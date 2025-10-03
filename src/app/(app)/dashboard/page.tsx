// src/app/(app)/dashboard/page.tsx
import { createClient } from '@/utils/supabase/server';
import { LuCheck, LuLoader, LuTriangleAlert, LuClipboardList, LuPlus } from 'react-icons/lu';
import Link from 'next/link';
import { StatCard } from '@/components/dashboard/StatCard';
import { RecentTasks } from '@/components/dashboard/RecentTasks';
import { PerformanceCharts } from '@/components/dashboard/PerformanceCharts';

/**
 * Procesa los datos de la actividad semanal para el gráfico de barras.
 */
const processWeeklyData = (rpcData: { completion_day: string; tasks_count: number }[] | null) => {
  const labels = Array.from({ length: 7 }).map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    if (i === 6) return 'Hoy';
    return d.toLocaleDateString('es-ES', { weekday: 'short' }).replace('.', '');
  });

  const data = Array(7).fill(0);
  if (!rpcData) return { labels, data };

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  rpcData.forEach(item => {
    const itemDate = new Date(item.completion_day);
    itemDate.setHours(0, 0, 0, 0);
    const diffTime = today.getTime() - itemDate.getTime();
    const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));
    if (diffDays >= 0 && diffDays < 7) {
      const index = 6 - diffDays;
      data[index] = item.tasks_count;
    }
  });

  return { labels, data };
};

export default async function DashboardPage() {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    const { data: profile } = await supabase.from('profiles').select('full_name').eq('id', user!.id).single();
        
    // --- OBTENCIÓN DE DATOS PARA LAS TARJETAS Y GRÁFICOS ---
    const { count: completedTasks } = await supabase.from('tasks').select('*', { count: 'exact', head: true }).eq('status', 'Completada');
    const { count: inProgressTasks } = await supabase.from('tasks').select('*', { count: 'exact', head: true }).eq('status', 'En Progreso');
    const { count: pendingTasks } = await supabase.from('tasks').select('*', { count: 'exact', head: true }).eq('status', 'Pendiente');
    const totalTasks = (completedTasks ?? 0) + (inProgressTasks ?? 0) + (pendingTasks ?? 0);
    
    // --- LLAMADA A LA FUNCIÓN RPC PARA EL GRÁFICO DE BARRAS ---
    const { data: weeklyActivityRaw, error: rpcError } = await supabase.rpc('get_weekly_completed_tasks_stats');
    if (rpcError) {
      // Log removido para producción; considerar integrar logger o toast
    }
    const weeklyActivityData = processWeeklyData(weeklyActivityRaw);

    // --- CONSULTA PARA TAREAS RECIENTES (CON IMAGEN) ---
    const { data: recentTasks, error: recentTasksError } = await supabase
        .from('tasks')
        .select(`
          id, 
          title, 
          status, 
          progress_percent,
          progress_image_url, 
          assignee:profiles(full_name)
        `)
        .order('created_at', { ascending: false })
        .limit(5);

    if (recentTasksError) {
      // Log removido para producción; considerar integrar logger o toast
    }
    
    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900">Dashboard</h1>
                    <p className="mt-1 text-lg text-slate-600">
                        Bienvenido, <span className="font-semibold">{profile?.full_name ?? user?.email}</span>.
                    </p>
                </div>
                <Link 
                    href="/tasks/new"
                    className="mt-4 sm:mt-0 inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition-all transform hover:scale-105"
                >
                    <LuPlus className="h-4 w-4" />
                    Crear Tarea
                </Link>
            </header>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <StatCard title="Total de Tareas" value={totalTasks} icon={LuClipboardList} color={{ bg: 'bg-sky-100', text: 'text-sky-600' }} change={5.2} />
                <StatCard title="Completadas" value={completedTasks ?? 0} icon={LuCheck} color={{ bg: 'bg-emerald-100', text: 'text-emerald-600' }} change={12} />
                <StatCard title="En Progreso" value={inProgressTasks ?? 0} icon={LuLoader} color={{ bg: 'bg-blue-100', text: 'text-blue-600' }} change={-2.1} />
                <StatCard title="Pendientes" value={pendingTasks ?? 0} icon={LuTriangleAlert} color={{ bg: 'bg-amber-100', text: 'text-amber-600' }} change={-8} />
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <PerformanceCharts 
                  taskStats={{
                    completed: completedTasks ?? 0,
                    inProgress: inProgressTasks ?? 0,
                    pending: pendingTasks ?? 0,
                  }}
                  weeklyActivity={weeklyActivityData}
                />
                
                <div className="lg:col-span-1">
                  <RecentTasks tasks={recentTasks ?? []} />
                </div>
            </div>
        </div>
    );
}
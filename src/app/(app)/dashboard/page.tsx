// src/app/(app)/dashboard/page.tsx
import { createClient } from '@/utils/supabase/server';
// --- INICIO DE LA CORRECCIÓN ---
import { LuCheck, LuLoader, LuTriangleAlert, LuClipboardList } from 'react-icons/lu';
// --- FIN DE LA CORRECCIÓN ---
import Link from 'next/link';

// ... (El componente StatCard no cambia)
const StatCard = ({ title, value, icon: Icon, color }: { title: string; value: number | string; icon: React.ElementType; color: string }) => (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 flex items-center justify-between">
        <div>
            <p className="text-sm font-medium text-gray-500">{title}</p>
            <p className="text-3xl font-bold text-gray-900 mt-1">{value}</p>
        </div>
        <div className={`p-3 rounded-full ${color}`}>
            <Icon className="h-6 w-6 text-white" />
        </div>
    </div>
);


const RecentTaskItem = ({ task }: { task: { title: string | null, profiles: { full_name: string | null } | null } }) => (
    <li className="flex items-center justify-between py-3">
        <div>
            <p className="text-sm font-medium text-gray-900">{task.title ?? 'Tarea sin título'}</p>
            <p className="text-xs text-gray-500">Asignado a: {task.profiles?.full_name ?? 'N/A'}</p>
        </div>
    </li>
);

export default async function DashboardPage() {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    const { data: profile } = await supabase.from('profiles').select('full_name').eq('id', user!.id).single();
        
    const { count: totalTasks } = await supabase.from('tasks').select('*', { count: 'exact', head: true });
    const { count: completedTasks } = await supabase.from('tasks').select('*', { count: 'exact', head: true }).eq('status', 'Completada');
    const { count: inProgressTasks } = await supabase.from('tasks').select('*', { count: 'exact', head: true }).eq('status', 'En Progreso');
    const { count: pendingTasks } = await supabase.from('tasks').select('*', { count: 'exact', head: true }).eq('status', 'Pendiente');
    
    const { data: recentTasks, error: recentTasksError } = await supabase.from('tasks').select('title, profiles(full_name)').order('created_at', { ascending: false }).limit(5);

    if (recentTasksError) {
        console.error('Error fetching recent tasks:', recentTasksError.message);
    }
    
    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
                <p className="mt-2 text-lg text-gray-600">
                    Bienvenido, {profile?.full_name ?? user?.email}. Aquí tienes un resumen de la actividad.
                </p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <StatCard title="Total de Tareas" value={totalTasks ?? 0} icon={LuClipboardList} color="bg-sky-500" />
                <StatCard title="Completadas" value={completedTasks ?? 0} icon={LuCheck} color="bg-emerald-500" />
                <StatCard title="En Progreso" value={inProgressTasks ?? 0} icon={LuLoader} color="bg-blue-500" />
                {/* --- CORRECCIÓN FINAL --- */}
                <StatCard title="Pendientes" value={pendingTasks ?? 0} icon={LuTriangleAlert} color="bg-amber-500" />
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                    <h2 className="text-xl font-semibold text-gray-800">Gráficos de Rendimiento</h2>
                    <div className="mt-4 h-64 flex items-center justify-center text-gray-400 bg-gray-50 rounded-lg">
                        Gráficos próximamente...
                    </div>
                </div>
                
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                    <h2 className="text-xl font-semibold text-gray-800 mb-4">Tareas Recientes</h2>
                    {recentTasks && recentTasks.length > 0 ? (
                        <ul className="divide-y divide-gray-200">
                            {recentTasks.map((task, index) => (
                                <RecentTaskItem key={index} task={task} />
                            ))}
                        </ul>
                    ) : (
                        <p className="text-sm text-gray-500 mt-4">No hay tareas recientes para mostrar.</p>
                    )}
                    <Link href="/tasks" className="mt-6 block text-center text-sm font-medium text-blue-600 hover:text-blue-700">
                        Ver todas las tareas
                    </Link>
                </div>
            </div>
        </div>
    );
}
// src/app/(app)/dashboard/page.tsx

import StatCard from '@/components/dashboard/StatCard';
import { createClient } from '@/utils/supabase/server';
import { LuLayoutDashboard, LuListTodo } from 'react-icons/lu';
import RecentTasksList from '@/components/dashboard/RecentTasksList'; // <-- Importa la LISTA
import { Task } from '@/lib/types'; // <-- Importa el tipo centralizado

export default async function DashboardPage() {
  const supabase = createClient();
  const baseQuery = supabase.from('tasks');

  try {
    const { data: tasks, error: tasksError } = await baseQuery.select('*');
    if (tasksError) throw tasksError;

    const { count: totalTasks } = await baseQuery.select('*', { count: 'exact', head: true });
    const { count: inProgressTasks } = await baseQuery.select('*', { count: 'exact', head: true }).eq('status', 'in progress');
    const { count: completedTasks } = await baseQuery.select('*', { count: 'exact', head: true }).eq('status', 'completed');
    
    // Esta consulta es la que define la estructura del tipo Task
    const { data: recentTasksData, error: recentTasksError } = await supabase
      .from('tasks')
      .select('*, divisions(name), assignee:profiles(full_name), milestones(image_url)')
      .order('created_at', { ascending: false })
      .limit(5);

    if (recentTasksError) throw recentTasksError;
    
    // Le decimos a TypeScript que estos datos son del tipo Task[]
    const recentTasks: Task[] = recentTasksData;

    return (
      <div className="p-6 space-y-6">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatCard title="Total de Tareas" value={totalTasks ?? 0} icon={<LuListTodo />} />
          <StatCard title="En Progreso" value={inProgressTasks ?? 0} icon={<LuLayoutDashboard />} />
          <StatCard title="Completadas" value={completedTasks ?? 0} icon={<LuListTodo />} />
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h3 className="font-semibold mb-2">Tareas Recientes</h3>
          {recentTasks && recentTasks.length > 0 ? (
            // Llama al componente de la LISTA una sola vez y le pasas TODAS las tareas
            <RecentTasksList tasks={recentTasks} />
          ) : (
            <p className="text-center text-gray-500 py-4">No hay tareas recientes para mostrar.</p>
          )}
        </div>
      </div>
    );

  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    return (
      <div className="p-6 text-red-500">
        <p>Error al cargar los datos del dashboard. Por favor, inténtelo de nuevo más tarde.</p>
      </div>
    );
  }
}
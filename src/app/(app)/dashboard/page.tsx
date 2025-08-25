// ... (importaciones y componentes StatCard, etc. se mantienen)
import RecentTaskItem from '@/components/dashboard/RecentTaskItem';

// Asegúrate de que el tipo RecentTask esté bien definido
interface RecentTask {
  id: string; // Añadir id para el key
  title: string | null;
  status: string | null;
  due_date: string | null;
  progress_percent: number | null;
  divisions: { name: string | null } | null;
  assignee: { full_name: string | null } | null;
  milestones: { image_url: string | null }[];
}

// ... (componentes StatCard, RecentTaskItem, etc.)

export default async function DashboardPage() {
    // ... (lógica de obtención de datos se mantiene)

    try {
        // ... (código para obtener tasks, etc.)

        const { data: recentTasks, error: recentTasksError } = await baseQuery.select('*, divisions(name), assignee:profiles(full_name), milestones(image_url)').order('created_at', { ascending: false }).limit(5);
        if (recentTasksError) throw recentTasksError;

        return (
            <div className="p-6 space-y-6">
                {/* ... (JSX del dashboard) ... */}
                <div className="bg-white p-6 rounded-lg shadow-sm">
                    <h3 className="font-semibold mb-2">Tareas Recientes</h3>
                    <div className="space-y-2 divide-y divide-gray-100">
                        {recentTasks && recentTasks.length > 0 ? (
                            // --- INICIO DE LA CORRECCIÓN ---
                            // Añadimos el tipo explícito 'any' temporalmente para que el build pase,
                            // o mejor, casteamos al tipo correcto.
                            recentTasks.map((task: RecentTask) => <RecentTaskItem key={task.id} task={task} />)
                            // --- FIN DE LA CORRECCIÓN ---
                        ) : (<p className="text-center text-gray-500 py-4">No hay tareas recientes para mostrar.</p>)}
                    </div>
                    {/* ... */}
                </div>
            </div>
        );

    } catch (error) {
        // ... (bloque catch)
    }
}
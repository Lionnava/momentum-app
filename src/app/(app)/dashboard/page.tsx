// src/app/(app)/dashboard/page.tsx
import RecentTasksList from '@/components/dashboard/RecentTasksList'; // <-- ¡Ahora importas la LISTA!
// ... (otras importaciones y la interface se mantienen)

export default async function DashboardPage() {
  try {
    // ... (tu código para obtener los datos sigue igual)
    const { data: recentTasks, error: recentTasksError } = await baseQuery.select('*, divisions(name), assignee:profiles(full_name), milestones(image_url)').order('created_at', { ascending: false }).limit(5);
    if (recentTasksError) throw recentTasksError;

    return (
      <div className="p-6 space-y-6">
        {/* ... (el resto de tu dashboard) ... */}
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
    // ... (bloque catch)
  }
}
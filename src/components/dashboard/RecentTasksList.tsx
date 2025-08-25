// src/components/dashboard/RecentTasksList.tsx
import RecentTaskItem from './RecentTaskItem'; // Importa el componente para el ITEM

// Recibe un ARRAY de tareas como 'prop'
export default function RecentTasksList({ tasks }: { tasks: any[] }) {
  return (
    <div className="space-y-2 divide-y divide-gray-100">
      {/* AQUÍ es donde va el bucle .map() */}
      {tasks.map((task) => (
        <RecentTaskItem key={task.id} task={task} />
      ))}
    </div>
  );
}
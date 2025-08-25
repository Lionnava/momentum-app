// src/components/dashboard/RecentTasksList.tsx

import { Task } from '@/lib/types'; // <-- Usa el tipo centralizado
import RecentTaskItem from './RecentTaskItem';

// Recibe un ARRAY de tareas como 'prop'
export default function RecentTasksList({ tasks }: { tasks: Task[] }) {
  return (
    <div className="space-y-2 divide-y divide-gray-100">
      {/* AQUÍ es donde va el bucle .map() */}
      {tasks.map((task) => (
        <RecentTaskItem key={task.id} task={task} />
      ))}
    </div>
  );
}
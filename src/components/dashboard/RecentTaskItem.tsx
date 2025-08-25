// src/components/dashboard/RecentTaskItem.tsx

import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Task } from '@/lib/types'; // <-- Usa el tipo centralizado

// Este componente recibe UNA SOLA tarea, no una lista.
export default function RecentTaskItem({ task }: { task: Task }) {
  
  const getStatusVariant = (status: string | null) => {
    switch (status?.toLowerCase()) {
      case 'in progress':
        return 'default';
      case 'completed':
        return 'success';
      case 'pending':
        return 'secondary';
      default:
        return 'outline';
    }
  };
  
  return (
    <Link href={`/tasks/${task.id}/view`} className="block hover:bg-muted/50 p-2 rounded-md transition-colors">
      <div className="flex justify-between items-center">
        <p className="font-medium truncate">{task.name}</p> 
        <Badge variant={getStatusVariant(task.status)}>{task.status}</Badge>
      </div>
    </Link>
  );
}
// src/components/dashboard/RecentTaskItem.tsx
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';

// Recibe UNA SOLA tarea como 'prop'
export default function RecentTaskItem({ task }: { task: any }) {
  const getStatusVariant = (status: string) => {
    // ... (la lógica del color del badge)
    return 'default'; 
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
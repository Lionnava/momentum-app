'use client';

import { useTransition } from 'react';
import { LuTrash2 } from 'react-icons/lu';
import { deleteTask } from '@/app/(app)/tasks/actions'; // CORRECCIÓN: Importar deleteTask

export default function DeleteTaskButton({ taskId }: { taskId: string }) {
  const [isPending, startTransition] = useTransition();

  const handleDelete = () => {
    if (confirm('¿Estás seguro de que quieres eliminar esta tarea?')) {
      startTransition(async () => {
        const result = await deleteTask(taskId);
        if (result?.error) {
          alert(`Error: ${result.error}`); // O usar un toast para una mejor UX
        }
      });
    }
  };

  return (
    <button
      onClick={handleDelete}
      disabled={isPending}
      className="p-2 text-gray-500 hover:text-red-600 rounded-full hover:bg-red-100 disabled:opacity-50 transition-colors"
      aria-label="Eliminar tarea"
    >
      {isPending ? '...' : <LuTrash2 className="h-5 w-5" />}
    </button>
  );
}
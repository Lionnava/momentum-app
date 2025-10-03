// src/app/(app)/tasks/_components/DeleteTaskButton.tsx
'use client'
import { LuTrash2 } from 'react-icons/lu';
import { deleteTaskAction } from '@/app/(app)/tasks/actions'; // <-- RUTA CORREGIDA

export function DeleteTaskButton({ taskId }: { taskId: string }) {
    const deleteTaskWithId = deleteTaskAction.bind(null, taskId);
    
    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        const confirmed = window.confirm('¿Estás seguro de que quieres eliminar esta tarea? Esta acción no se puede deshacer.');
        if (!confirmed) {
            event.preventDefault();
        }
    };

    // --- INICIO DE LA CORRECCIÓN DEL FORMULARIO ---
    // El 'action' del formulario debe usar la función que creamos con .bind()
    return (
        <form action={deleteTaskWithId} onSubmit={handleSubmit}>
            <button 
                type="submit"
                className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors"
                aria-label="Eliminar tarea"
            >
                <LuTrash2 className="h-5 w-5" />
            </button>
        </form>
    );
    // --- FIN DE LA CORRECCIÓN DEL FORMULARIO ---
}
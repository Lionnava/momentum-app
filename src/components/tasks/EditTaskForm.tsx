// src/components/tasks/EditTaskForm.tsx

'use client';

import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { updateTaskAction, type UpdateTaskFormState } from '@/app/(private)/tasks/actions';
import type { Task, User, Division } from '@/lib/types';
import { useEffect } from 'react';

function SubmitButton() {
    const { pending } = useFormStatus();
    return (
        <button 
            type="submit" 
            disabled={pending} 
            className="w-full flex justify-center py-2 px-4 mt-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-400"
        >
            {pending ? 'Guardando Cambios...' : 'Guardar Cambios'}
        </button>
    );
}

interface EditTaskFormProps {
    task: Task;
    users: User[];
    divisions: Division[];
}

export function EditTaskForm({ task, users, divisions }: EditTaskFormProps) {
    const initialState: UpdateTaskFormState = { success: false, message: null };
    const [state, formAction] = useActionState(updateTaskAction, initialState);
    
    // Opcional: Mostrar un "toast" de éxito
    useEffect(() => {
        if (state.success && state.message) {
            alert(state.message); // En una app real, usarías una librería de "toasts"
        }
    }, [state]);

    return (
        <form action={formAction} className="space-y-4">
            <input type="hidden" name="taskId" value={task.id} />

            {state && !state.success && state.message && (
                <div className="p-3 bg-red-100 border-red-400 text-red-700 rounded-md">
                    {state.message}
                </div>
            )}

            <div>
                <label htmlFor="titulo" className="block text-sm font-medium text-gray-700">Título</label>
                <input type="text" id="titulo" name="titulo" defaultValue={task.titulo} required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" />
            </div>

            <div>
                <label htmlFor="notes" className="block text-sm font-medium text-gray-700">Notas</label>
                <textarea id="notes" name="notes" defaultValue={task.notes} rows={5} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" />
            </div>
            
            <div>
                 <label htmlFor="status" className="block text-sm font-medium text-gray-700">Estado</label>
                 <select id="status" name="status" defaultValue={task.status} required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2">
                    <option value="Pendiente">Pendiente</option>
                    <option value="En Progreso">En Progreso</option>
                    <option value="Completada">Completada</option>
                 </select>
            </div>
            
            <div>
                <label htmlFor="progress_percent" className="block text-sm font-medium text-gray-700">Progreso</label>
                <input type="range" id="progress_percent" name="progress_percent" min="0" max="100" defaultValue={task.progress_percent} className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer" />
            </div>

            <SubmitButton />
        </form>
    );
}
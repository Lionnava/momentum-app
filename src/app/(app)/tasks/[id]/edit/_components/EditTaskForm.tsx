// src/app/(app)/tasks/[id]/edit/_components/EditTaskForm.tsx
'use client'

import { useActionState, useFormStatus } from 'react';
import { updateTaskAction, type UpdateTaskState } from '@/app/(app)/tasks/actions';
import Link from 'next/link';
import { useState } from 'react';

// Tipos limpios
type Task = {
    id: string; title: string; assignee_id: string | null; due_date: string | null;
    status: string; division_id: string | null; progress_percent: number; requires_approval: boolean;
}
type Profile = { id: string; full_name: string | null; };
type Division = { id: string; name: string | null; };

function SubmitButton() {
    const { pending } = useFormStatus();
    return (
        <button type="submit" disabled={pending} className="px-6 py-2 text-sm font-semibold text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:bg-blue-400">
            {pending ? 'Actualizando...' : 'Guardar Cambios'}
        </button>
    );
}

export function EditTaskForm({ task, profiles, divisions }: { task: Task; profiles: Profile[]; divisions: Division[] }) {
    const initialState: UpdateTaskState = { message: '' };
    const updateTaskWithId = updateTaskAction.bind(null, task.id);
    const [state, formAction] = useActionState(updateTaskWithId, initialState);
    const defaultDueDate = task.due_date ? new Date(task.due_date).toISOString().split('T')[0] : '';
    const [progress, setProgress] = useState(task.progress_percent);

    return (
        <form action={formAction} className="space-y-6">
            <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700">Título</label>
                <input type="text" name="title" id="title" required defaultValue={task.title} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" />
            </div>
             <div>
                <label htmlFor="progress_percent" className="block text-sm font-medium text-gray-700">
                    Progreso: <span className="font-bold text-blue-600">{progress}%</span>
                </label>
                <input id="progress_percent" name="progress_percent" type="range" min="0" max="100" step="5" defaultValue={progress} onChange={(e) => setProgress(Number(e.target.value))} className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer mt-2" />
            </div>
            {/* ... (resto del formulario igual) ... */}

            <div className="flex items-center justify-end gap-4 pt-4 mt-4 border-t">
                 <Link href="/tasks" className="text-sm font-medium text-gray-600 hover:text-gray-800">Cancelar</Link>
                <SubmitButton />
            </div>
        </form>
    );
}
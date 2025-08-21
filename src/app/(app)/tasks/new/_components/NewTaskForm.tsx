// src/app/(app)/tasks/new/_components/NewTaskForm.tsx
'use client';

import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { createTaskAction, type CreateTaskState } from '../actions';
import Link from 'next/link';

type Profile = { id: string; full_name: string | null; };
type Division = { id: string; name: string | null; };

function SubmitButton() {
    const { pending } = useFormStatus();
    return (
        <button type="submit" disabled={pending} className="w-full sm:w-auto px-6 py-2 text-sm font-semibold text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:bg-blue-400">
            {pending ? 'Guardando...' : 'Crear Tarea'}
        </button>
    );
}

export function NewTaskForm({ profiles, divisions }: { profiles: Profile[]; divisions: Division[] }) {
    const initialState: CreateTaskState = { message: '' };
    const [state, formAction] = useActionState(createTaskAction, initialState);

    return (
        <form action={formAction} className="space-y-6">
            <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700">Título de la Tarea</label>
                <input type="text" name="title" id="title" required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                    <label htmlFor="division_id" className="block text-sm font-medium text-gray-700">División</label>
                    <select name="division_id" id="division_id" required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2">
                        <option value="">Seleccione una división</option>
                        {divisions.map(division => (<option key={division.id} value={division.id}>{division.name}</option>))}
                    </select>
                </div>
                <div>
                    <label htmlFor="assignee_id" className="block text-sm font-medium text-gray-700">Asignar a</label>
                    <select name="assignee_id" id="assignee_id" required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2">
                        <option value="">Seleccione un usuario</option>
                        {profiles.map(profile => (<option key={profile.id} value={profile.id}>{profile.full_name || profile.id}</option>))}
                    </select>
                </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                    <label htmlFor="due_date" className="block text-sm font-medium text-gray-700">Fecha Límite</label>
                    <input type="date" name="due_date" id="due_date" required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" />
                </div>
                <div>
                    <label htmlFor="status" className="block text-sm font-medium text-gray-700">Estado Inicial</label>
                    <select name="status" id="status" required defaultValue="Pendiente" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2">
                        <option value="Pendiente">Pendiente</option>
                        <option value="En Progreso">En Progreso</option>
                    </select>
                </div>
            </div>
            <div className="flex items-center gap-3 pt-4">
                <input
                    type="checkbox"
                    id="requires_approval"
                    name="requires_approval"
                    className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <label htmlFor="requires_approval" className="text-sm font-medium text-gray-700">
                    Esta tarea requiere aprobación de un superior
                </label>
            </div>
            {state?.message && (<p aria-live="polite" className="text-sm text-red-600 text-center">{state.message}</p>)}
            <div className="flex items-center justify-end gap-4 pt-4 mt-4 border-t">
                 <Link href="/tasks" className="text-sm font-medium text-gray-600 hover:text-gray-800">Cancelar</Link>
                <SubmitButton />
            </div>
        </form>
    );
}
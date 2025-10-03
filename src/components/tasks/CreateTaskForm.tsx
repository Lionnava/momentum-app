// src/components/tasks/CreateTaskForm.tsx

'use client';

import { useTransition } from 'react';
import { createTaskAction } from '@/app/(private)/tasks/actions';
import type { User, Division } from '@/lib/types';

interface CreateTaskFormProps {
    users: User[];
    divisions: Division[];
    allTasks: { id: string; titulo: string }[];
}

export function CreateTaskForm({ users, divisions, allTasks }: CreateTaskFormProps) {
    const [isPending, startTransition] = useTransition();

    const handleSubmit = (formData: FormData) => {
        startTransition(() => {
            createTaskAction(formData);
        });
    };

    return (
        <form action={handleSubmit} className="space-y-4">
            <div>
                <label htmlFor="titulo" className="block text-sm font-medium text-gray-700">Título de la Tarea</label>
                <input type="text" id="titulo" name="titulo" required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
            </div>

            <div>
                <label htmlFor="assignee" className="block text-sm font-medium text-gray-700">Asignar a</label>
                <select id="assignee" name="assignee" required defaultValue="" className="mt-1 block w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm">
                    <option value="" disabled>Selecciona un usuario</option>
                    {users.map(user => (<option key={user.id} value={user.id}>{user.name} ({user.position})</option>))}
                </select>
            </div>
            
            <div>
                <label htmlFor="division" className="block text-sm font-medium text-gray-700">División</label>
                <select id="division" name="division" required defaultValue="" className="mt-1 block w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm">
                     <option value="" disabled>Selecciona una división</option>
                    {divisions.map(division => (<option key={division.id} value={division.id}>{division.name}</option>))}
                </select>
            </div>

            {/* --- NUEVO CAMPO DE DEPENDENCIA --- */}
            <div>
                <label htmlFor="depends_on" className="block text-sm font-medium text-gray-700">Depende de (Opcional)</label>
                <select id="depends_on" name="depends_on" defaultValue="" className="mt-1 block w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm">
                    <option value="">Ninguna</option>
                    {allTasks.map(task => (<option key={task.id} value={task.id}>{task.titulo}</option>))}
                </select>
            </div>

            <div>
                <label htmlFor="due_date" className="block text-sm font-medium text-gray-700">Fecha Límite</label>
                <input type="date" id="due_date" name="due_date" required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
            </div>

            <div>
                 <label htmlFor="status" className="block text-sm font-medium text-gray-700">Estado Inicial</label>
                 <select id="status" name="status" defaultValue="Pendiente" required className="mt-1 block w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm">
                    <option value="Pendiente">Pendiente</option>
                    <option value="En Progreso">En Progreso</option>
                    <option value="Completada">Completada</option>
                 </select>
            </div>

            <button type="submit" disabled={isPending} className="w-full flex justify-center py-2 px-4 mt-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-400">
                {isPending ? 'Creando Tarea...' : 'Crear Tarea'}
            </button>
        </form>
    );
}
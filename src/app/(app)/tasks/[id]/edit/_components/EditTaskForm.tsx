'use client';

import { useFormState, useFormStatus } from 'react-dom';
// --- INICIO DE LA CORRECCIÓN ---
// Corregimos la ruta y el nombre de la importación
import { updateTask, type FormState } from '@/app/(app)/tasks/actions';
// --- FIN DE LA CORRECCIÓN ---
import type { Tables } from '@/lib/types';

type Task = Tables<'tasks'>;

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full px-4 py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 disabled:opacity-50"
    >
      {pending ? 'Guardando...' : 'Guardar Cambios'}
    </button>
  );
}

export default function EditTaskForm({ task }: { task: Task }) {
  const initialState: FormState = { message: '', success: false };
  const updateTaskWithId = updateTask.bind(null, task.id);
  const [state, formAction] = useFormState(updateTaskWithId, initialState);

  return (
    <form action={formAction} className="space-y-6">
      {/* ... El resto del JSX del formulario no necesita cambios ... */}
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700">Título</label>
        <input type="text" id="title" name="title" defaultValue={task.title ?? ''} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" />
      </div>
      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700">Descripción</label>
        <textarea id="description" name="description" rows={4} defaultValue={task.description ?? ''} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"></textarea>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div>
          <label htmlFor="status" className="block text-sm font-medium text-gray-700">Estado</label>
          <select id="status" name="status" defaultValue={task.status ?? 'Pendiente'} className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md">
            <option>Pendiente</option>
            <option>En Progreso</option>
            <option>Completada</option>
          </select>
        </div>
        <div>
          <label htmlFor="due_date" className="block text-sm font-medium text-gray-700">Fecha de Vencimiento</label>
          <input type="date" id="due_date" name="due_date" defaultValue={task.due_date ?? ''} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" />
        </div>
      </div>
      {state?.message && !state.success && ( <p className="text-sm text-red-500">{state.message}</p> )}
      <SubmitButton />
    </form>
  );
}
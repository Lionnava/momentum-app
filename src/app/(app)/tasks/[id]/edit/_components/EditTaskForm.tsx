'use client';

// --- INICIO DE LA CORRECCIÓN ---
import { useActionState } from 'react';         // useActionState se importa desde 'react'
import { useFormStatus } from 'react-dom';      // useFormStatus se importa desde 'react-dom'
// --- FIN DE LA CORRECCIÓN ---

import { updateTask } from '@/app/(app)/tasks/actions'; 
import type { FormState } from '@/app/(app)/tasks/actions';
// Asegúrate de tener tus tipos de Supabase generados en esta ruta o ajústala.
import type { Tables } from '@/lib/types'; 

// Definimos el tipo de la tarea para pasarlo como prop
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
  
  // Usamos .bind para pre-cargar la server action con el ID de la tarea.
  const updateTaskWithId = updateTask.bind(null, task.id);
  
  // useActionState ahora funcionará porque está importado correctamente.
  const [state, formAction] = useActionState(updateTaskWithId, initialState);

  return (
    <form action={formAction} className="space-y-6">
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700">
          Título
        </label>
        <input
          type="text"
          id="title"
          name="title"
          defaultValue={task.title ?? ''}
          required
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
        />
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700">
          Descripción
        </label>
        <textarea
          id="description"
          name="description"
          rows={4}
          defaultValue={task.description ?? ''}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
        ></textarea>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div>
          <label htmlFor="status" className="block text-sm font-medium text-gray-700">
            Estado
          </label>
          <select
            id="status"
            name="status"
            defaultValue={task.status ?? 'Pendiente'}
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
          >
            <option>Pendiente</option>
            <option>En Progreso</option>
            <option>Completada</option>
          </select>
        </div>
        <div>
          <label htmlFor="due_date" className="block text-sm font-medium text-gray-700">
            Fecha de Vencimiento
          </label>
          <input
            type="date"
            id="due_date"
            name="due_date"
            defaultValue={task.due_date ?? ''}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
      </div>

      {/* Mostramos el mensaje de error si la acción falla */}
      {state?.message && !state.success && (
        <p className="text-sm text-red-500">{state.message}</p>
      )}

      <SubmitButton />
    </form>
  );
}
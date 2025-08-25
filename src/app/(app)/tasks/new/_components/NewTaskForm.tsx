'use client';

// --- INICIO DE LA CORRECCIÓN ---
import { useActionState } from 'react';         // useActionState se importa desde 'react'
import { useFormStatus } from 'react-dom';      // useFormStatus se importa desde 'react-dom'
// --- FIN DE LA CORRECCIÓN ---

import { createTask } from '../actions';
import type { FormState } from '../actions';
// Asegúrate de tener tus tipos de Supabase generados en esta ruta o ajústala.
import type { Tables } from '@/lib/types'; 

// Definimos el tipo para las divisiones que pasamos como props
type Division = Pick<Tables<'divisions'>, 'id' | 'name'>;

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full px-4 py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 disabled:opacity-50"
    >
      {pending ? 'Creando...' : 'Crear Tarea'}
    </button>
  );
}

export default function NewTaskForm({ divisions }: { divisions: Division[] }) {
  const initialState: FormState = { message: '', success: false };
  const [state, formAction] = useActionState(createTask, initialState);

  return (
    <form action={formAction} className="space-y-6">
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700">
          Título de la Tarea
        </label>
        <input
          type="text"
          id="title"
          name="title"
          required
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
        />
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700">
          Descripción (Opcional)
        </label>
        <textarea
          id="description"
          name="description"
          rows={4}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
        ></textarea>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div>
          <label htmlFor="division_id" className="block text-sm font-medium text-gray-700">
            División
          </label>
          <select
            id="division_id"
            name="division_id"
            required
            defaultValue=""
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
          >
            <option value="" disabled>Selecciona una división</option>
            {divisions.map((div) => (
              <option key={div.id} value={div.id}>{div.name}</option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="due_date" className="block text-sm font-medium text-gray-700">
            Fecha de Vencimiento (Opcional)
          </label>
          <input
            type="date"
            id="due_date"
            name="due_date"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
      </div>

      {state?.message && !state.success && (
        <p className="text-sm text-red-500">{state.message}</p>
      )}

      <SubmitButton />
    </form>
  );
}
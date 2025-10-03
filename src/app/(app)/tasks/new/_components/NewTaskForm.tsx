// src/app/(app)/tasks/new/_components/NewTaskForm.tsx
'use client';

import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { createTaskAction, type CreateTaskState } from '@/app/actions';
import Link from 'next/link';

// Tipos para los props del componente
type Profile = { id: string; full_name: string | null; };
type NewTaskFormProps = { users: Profile[]; };

// Componente para el botón de envío que muestra un estado de carga
function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="inline-flex justify-center rounded-md border border-transparent bg-blue-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
    >
      {pending ? 'Creando...' : 'Crear Tarea'}
    </button>
  );
}

export function NewTaskForm({ users }: NewTaskFormProps) {
  const initialState: CreateTaskState = { message: null, errors: {} };
  const [state, formAction] = useActionState(createTaskAction, initialState);

  // CORRECCIÓN: Nos aseguramos de que 'users' sea un array antes de usar .map()
  // Si 'users' es null, undefined, o cualquier otra cosa, 'usersList' será un array vacío [].
  const usersList = Array.isArray(users) ? users : [];

  return (
    <form action={formAction} className="space-y-6">
      {/* Título de la Tarea */}
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700">Título</label>
        <input
          type="text"
          id="title"
          name="title"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          required
        />
        {state.errors?.title && <p className="mt-1 text-sm text-red-600">{state.errors.title[0]}</p>}
      </div>

      {/* Descripción */}
      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700">Descripción (Opcional)</label>
        <textarea
          id="description"
          name="description"
          rows={4}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
        />
      </div>

      {/* Asignar a */}
      <div>
        <label htmlFor="assignee_id" className="block text-sm font-medium text-gray-700">Asignar a</label>
        <select
          id="assignee_id"
          name="assignee_id"
          className="mt-1 block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
          required
        >
          <option value="">Selecciona un usuario...</option>
          {/* Usamos la variable segura 'usersList' para evitar el error de 'map' */}
          {usersList.map((user) => (
            <option key={user.id} value={user.id}>{user.full_name}</option>
          ))}
        </select>
        {state.errors?.assignee_id && <p className="mt-1 text-sm text-red-600">{state.errors.assignee_id[0]}</p>}
      </div>

      {/* Fecha Límite */}
      <div>
        <label htmlFor="due_date" className="block text-sm font-medium text-gray-700">Fecha Límite</label>
        <input
          type="date"
          id="due_date"
          name="due_date"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          required
        />
        {state.errors?.due_date && <p className="mt-1 text-sm text-red-600">{state.errors.due_date[0]}</p>}
      </div>

      {/* Botones de Acción */}
      <div className="flex justify-end gap-4">
        <Link href="/tasks" className="inline-flex justify-center rounded-md border border-gray-300 bg-white py-2 px-4 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
          Cancelar
        </Link>
        <SubmitButton />
      </div>

      {/* Mensaje general de error */}
      {state.message && <p className="mt-2 text-sm text-red-600">{state.message}</p>}
    </form>
  );
}
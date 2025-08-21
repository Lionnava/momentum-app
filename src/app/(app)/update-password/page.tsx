// src/app/(app)/update-password/page.tsx
'use client'

import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { updatePasswordAction, type UpdatePasswordState } from './actions';
import Link from 'next/link';

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button 
      type="submit" 
      disabled={pending}
      className="w-full bg-blue-600 text-white font-semibold py-2 px-4 rounded-md hover:bg-blue-700 disabled:bg-blue-400"
      aria-disabled={pending}
    >
      {pending ? 'Actualizando...' : 'Actualizar Contraseña'}
    </button>
  );
}

export default function UpdatePasswordPage() {
  const initialState: UpdatePasswordState = { message: '', success: false };
  const [state, formAction] = useActionState(updatePasswordAction, initialState);

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-9rem)] bg-gray-50 px-4">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-xl shadow-lg border">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900">Establecer Nueva Contraseña</h1>
          <p className="mt-2 text-sm text-gray-600">
            Introduce tu nueva contraseña. Debe tener al menos 6 caracteres.
          </p>
        </div>

        {state.success ? (
          <div className="text-center">
            <p className="p-4 bg-green-100 text-green-800 rounded-md">{state.message}</p>
            <Link href="/dashboard" className="mt-4 inline-block font-medium text-blue-600 hover:text-blue-500">
              Ir al Dashboard
            </Link>
          </div>
        ) : (
          <form action={formAction} className="space-y-4">
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Nueva Contraseña
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                minLength={6}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
              />
            </div>
            
            {state.message && !state.success && (
              <p aria-live="polite" className="text-sm text-red-600 text-center">
                {state.message}
              </p>
            )}

            <SubmitButton />
          </form>
        )}
      </div>
    </div>
  );
}
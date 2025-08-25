'use client';

// --- INICIO DE LA CORRECCIÓN ---
import { useActionState } from 'react';         // useActionState se importa desde 'react'
import { useFormStatus } from 'react-dom';      // useFormStatus se importa desde 'react-dom'
// --- FIN DE LA CORRECCIÓN ---

import { signIn } from './actions';
import type { FormState } from './actions';
import Link from 'next/link';

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      aria-disabled={pending}
      className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
    >
      {pending ? 'Iniciando...' : 'Iniciar Sesión'}
    </button>
  );
}

export default function LoginPage() {
  const initialState: FormState = { message: '', success: false };
  const [state, formAction] = useActionState(signIn, initialState);

  return (
    <div className="w-full max-w-md px-8 py-10 bg-white rounded-lg shadow-xl">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-800">Accede a tu cuenta</h2>
        <p className="text-gray-500 mt-2">
          Ingresa tus credenciales para continuar.
        </p>
      </div>

      <form action={formAction} className="space-y-6">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">Correo Electrónico</label>
          <input id="email" name="email" type="email" autoComplete="email" required className="mt-1 appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
        </div>
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700">Contraseña</label>
          <input id="password" name="password" type="password" autoComplete="current-password" required className="mt-1 appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
        </div>

        {state?.message && !state.success && (
          <p aria-live="polite" className="text-sm text-red-500 text-center">{state.message}</p>
        )}

        <SubmitButton />
      </form>
    </div>
  );
}
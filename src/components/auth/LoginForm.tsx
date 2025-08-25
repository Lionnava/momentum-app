// src/components/auth/LoginForm.tsx
'use client'

// --- INICIO DE LA CORRECCIÓN ---
// Importamos los hooks desde sus paquetes específicos para evitar ambigüedades.
import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
// --- FIN DE LA CORRECCIÓN ---

import { loginAction, type FormState } from '@/app/(public)/login/actions';
import Link from 'next/link';

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending} className="w-full bg-blue-600 text-white font-semibold py-2 px-4 rounded-md hover:bg-blue-700 disabled:bg-blue-400">
      {pending ? 'Procesando...' : 'Iniciar Sesión'}
    </button>
  );
}

export function LoginForm() {
  const initialState: FormState = { message: '' };
  const [state, formAction] = useActionState(loginAction, initialState);

  return (
    <form action={formAction} className="space-y-4">
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700">Correo Electrónico</label>
        <input id="email" name="email" type="email" required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"/>
      </div>
      <div>
        <div className="flex items-center justify-between">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">Contraseña</label>
            <div className="text-sm">
                <Link href="/forgot-password" className="font-medium text-blue-600 hover:text-blue-500">
                    ¿Olvidaste tu contraseña?
                </Link>
            </div>
        </div>
        <input id="password" name="password" type="password" required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"/>
      </div>
      {state?.message && ( <p className="text-sm text-red-600 text-center">{state.message}</p> )}
      <SubmitButton />
    </form>
  );
}
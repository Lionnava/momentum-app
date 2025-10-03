// src/app/(public)/forgot-password/page.tsx
'use client'

import { useActionState } from 'react'; // <-- Corregido: Importar desde 'react'
import { useFormStatus } from 'react-dom';
import Link from 'next/link';

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button 
      type="submit" 
      disabled={pending}
      className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-400"
      aria-disabled={pending}
    >
      {pending ? 'Enviando...' : 'Enviar Enlace'}
    </button>
  );
}

export default function ForgotPasswordPage() {
  const initialState: ForgotPasswordState = { message: '', success: false };
  const [state, formAction] = useActionState(requestPasswordResetAction, initialState);

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-9rem)] bg-gray-50 px-4">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-xl shadow-lg border">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900">Restablecer Contraseña</h1>
          <p className="mt-2 text-sm text-gray-600">
            Introduce tu correo y te enviaremos las instrucciones.
          </p>
        </div>

        {state.success ? (
          <div className="p-4 bg-green-100 border border-green-300 text-green-800 rounded-md text-center">
            <p>{state.message}</p>
          </div>
        ) : (
          <form action={formAction} className="space-y-6">
            <div>
              <label htmlFor="email" className="sr-only">Email</label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="tu-correo@registrado.com"
              />
            </div>
            {state.message && !state.success && (
                <p aria-live="polite" className="text-sm text-red-600 text-center">
                    {state.message}
                </p>
            )}
            <div>
              <SubmitButton />
            </div>
          </form>
        )}

        <div className="text-sm text-center">
          <Link href="/login" className="font-medium text-blue-600 hover:text-blue-500">
            Volver a Iniciar Sesión
          </Link>
        </div>
      </div>
    </div>
  );
}
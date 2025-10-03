// src/components/auth/login-form.tsx
'use client';

import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import Link from 'next/link';
import { login, type AuthFormState } from '@/app/actions'; 
import { LuLogIn } from 'react-icons/lu';

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
    >
      {pending ? 'Iniciando...' : (
        <>
          <LuLogIn className="mr-2 h-5 w-5" />
          Iniciar Sesión
        </>
      )}
    </button>
  );
}

export function LoginForm() {
  const initialState: AuthFormState = {};
  const [state, formAction] = useActionState(login, initialState);

  return (
    <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-md border">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900">Bienvenido de nuevo</h2>
        <p className="mt-2 text-sm text-gray-600">Inicia sesión para acceder a tu dashboard.</p>
      </div>

      <form action={formAction} className="space-y-6">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            Correo Electrónico
          </label>
          <div className="mt-1">
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700">
            Contraseña
          </label>
          <div className="mt-1">
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="text-sm">
            <Link href="/forgot-password" className="font-medium text-blue-600 hover:text-blue-500">
              ¿Olvidaste tu contraseña?
            </Link>
          </div>
        </div>
        
        {state?.error && (
            <p className="text-sm text-red-600 bg-red-50 p-3 rounded-md">{state.error}</p>
        )}

        <div>
          <SubmitButton />
        </div>
      </form>
    </div>
  );
}
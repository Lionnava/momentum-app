'use client'

import { useFormState, useFormStatus } from 'react-dom'
import { loginAction, signupAction, type FormState } from '@/app/(public)/login/actions'

function SubmitButton() {
  const { pending } = useFormStatus()
  return (
    <button 
      type="submit" 
      disabled={pending}
      className="w-full bg-blue-600 text-white font-semibold py-2 px-4 rounded-md hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed transition-colors"
    >
      {pending ? 'Procesando...' : 'Iniciar Sesión'}
    </button>
  )
}

export function LoginForm() {
  const initialState: FormState = { message: '', success: false };
  const [state, formAction] = useFormState(loginAction, initialState);

  return (
    <form action={formAction} className="space-y-4">
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
          Correo Electrónico
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
        />
      </div>
      <div>
        <label htmlFor="password" className="block text-sm font-medium text-gray-700">
          Contraseña
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      {state.message && (
        <p aria-live="polite" className={`text-sm ${state.success ? 'text-green-600' : 'text-red-600'}`}>
          {state.message}
        </p>
      )}

      <SubmitButton />
    </form>
  )
}
'use client';

import { useFormState, useFormStatus } from 'react-dom';
import { forgotPassword, type ForgotPasswordState } from './actions';

function SubmitButton() {
    const { pending } = useFormStatus();
    return (
        <button type="submit" disabled={pending} className="w-full px-4 py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 disabled:opacity-50">
            {pending ? 'Enviando...' : 'Enviar Enlace de Recuperación'}
        </button>
    );
}

export default function ForgotPasswordPage() {
    const initialState: ForgotPasswordState = { message: '', success: false };
    const [state, formAction] = useFormState(forgotPassword, initialState);

    return (
        <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
            <h2 className="text-2xl font-bold text-center">Recuperar Contraseña</h2>
            <p className="text-center text-sm text-gray-600">Ingresa tu correo y te enviaremos un enlace para restablecer tu contraseña.</p>
            <form action={formAction} className="space-y-6">
                <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">Correo Electrónico</label>
                    <input id="email" name="email" type="email" required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" />
                </div>
                {state?.message && (
                    <p className={`text-sm p-3 rounded-md text-center ${state.success ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        {state.message}
                    </p>
                )}
                <SubmitButton />
            </form>
        </div>
    );
}
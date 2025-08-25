'use client';

import { useFormState, useFormStatus } from 'react-dom';
// --- INICIO DE LA CORRECCIÓN ---
// Importamos la acción con el nombre correcto desde el archivo correcto
import { updatePassword } from './actions';
// --- FIN DE LA CORRECCIÓN ---

// Definimos el tipo de estado aquí para que la acción pueda importarlo si es necesario
export type UpdatePasswordState = {
  message: string;
  success: boolean;
};

function SubmitButton() {
    const { pending } = useFormStatus();
    return (
        <button type="submit" disabled={pending} className="w-full px-4 py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 disabled:opacity-50">
            {pending ? 'Guardando...' : 'Establecer Contraseña'}
        </button>
    );
}

export default function UpdatePasswordPage() {
    const initialState: UpdatePasswordState = { message: '', success: false };
    const [state, formAction] = useFormState(updatePassword, initialState);

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
                <h2 className="text-2xl font-bold text-center">Actualiza tu Contraseña</h2>
                <form action={formAction} className="space-y-6">
                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700">Nueva Contraseña</label>
                        <input id="password" name="password" type="password" required minLength={6} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" />
                    </div>
                     <div>
                        <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">Confirmar Contraseña</label>
                        <input id="confirmPassword" name="confirmPassword" type="password" required minLength={6} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" />
                    </div>
                    {state?.message && (
                        <p className={`text-sm p-3 rounded-md text-center ${state.success ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                            {state.message}
                        </p>
                    )}
                    <SubmitButton />
                </form>
            </div>
        </div>
    );
}
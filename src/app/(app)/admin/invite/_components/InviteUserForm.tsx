'use client';

// --- INICIO DE LA CORRECCIÓN ---
import { useActionState } from 'react';         // useActionState se importa desde 'react'
import { useFormStatus } from 'react-dom';      // useFormStatus se importa desde 'react-dom'
// --- FIN DE LA CORRECCIÓN ---

import { inviteUser, type InviteUserState } from '../actions';

function SubmitButton() {
    const { pending } = useFormStatus();
    return (
        <button
            type="submit"
            disabled={pending}
            className="w-full px-4 py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 disabled:opacity-50"
        >
            {pending ? 'Enviando invitación...' : 'Enviar Invitación'}
        </button>
    );
}

export default function InviteUserForm() {
    const initialState: InviteUserState = { message: '', success: false };
    const [state, formAction] = useActionState(inviteUser, initialState);

    return (
        <form action={formAction} className="space-y-6">
            <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                    Correo Electrónico del Invitado
                </label>
                <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                />
            </div>
            <div>
                <label htmlFor="rol" className="block text-sm font-medium text-gray-700">
                    Asignar Rol
                </label>
                <select
                    id="rol"
                    name="rol"
                    required
                    defaultValue=""
                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                >
                    <option value="" disabled>Selecciona un rol</option>
                    <option value="employee">Empleado</option>
                    <option value="manager">Manager</option>
                    {/* Por seguridad, un Super Manager no debería poder crear otro Super Manager desde la UI */}
                </select>
            </div>
            {state?.message && (
                <p className={`text-sm p-3 rounded-md text-center ${state.success ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {state.message}
                </p>
            )}
            <SubmitButton />
        </form>
    );
}
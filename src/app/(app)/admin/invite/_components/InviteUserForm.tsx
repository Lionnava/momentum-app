// src/app/(app)/admin/invite/_components/InviteUserForm.tsx
'use client'

import { useActionState, useFormStatus } from 'react-dom';
import { inviteUserAction, type InviteState } from '../actions';

function SubmitButton() {
    const { pending } = useFormStatus();
    return (
        <button type="submit" disabled={pending} className="w-full px-6 py-2 font-semibold text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:bg-blue-400">
            {pending ? 'Enviando...' : 'Enviar Invitación'}
        </button>
    );
}

export function InviteUserForm() {
    const initialState: InviteState = { message: '', success: false };
    const [state, formAction] = useActionState(inviteUserAction, initialState);

    return (
        <form action={formAction} className="space-y-6">
            <div>
                <label htmlFor="full_name" className="block text-sm font-medium text-gray-700">Nombre Completo</label>
                <input type="text" name="full_name" id="full_name" required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" />
            </div>
            <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">Correo Electrónico</label>
                <input type="email" name="email" id="email" required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" />
            </div>
            <div>
                <label htmlFor="rol" className="block text-sm font-medium text-gray-700">Asignar Rol</label>
                <select name="rol" id="rol" required defaultValue="employee" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2">
                    <option value="employee">Empleado</option>
                    <option value="manager">Manager</option>
                    <option value="supermanager">Super Manager</option>
                </select>
            </div>
            
            {state.message && (
                <p className={`text-sm text-center p-3 rounded-md ${state.success ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {state.message}
                </p>
            )}

            <div className="pt-4">
                <SubmitButton />
            </div>
        </form>
    );
}
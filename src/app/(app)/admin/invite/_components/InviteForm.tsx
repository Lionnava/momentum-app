// src/app/(app)/admin/invite/_components/InviteForm.tsx
'use client';

import { useActionState, useEffect, useRef } from 'react';
import { useFormStatus } from 'react-dom';
import toast from 'react-hot-toast';
import { inviteUser } from '@/app/actions';
import { LuLoader, LuSend } from 'react-icons/lu';

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending} className="inline-flex w-full justify-center items-center gap-2 rounded-md bg-blue-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-blue-700 disabled:opacity-50">
      {pending ? <><LuLoader className="animate-spin" size={16} /> Enviando...</> : <><LuSend size={16} /> Enviar Invitación</>}
    </button>
  );
}

const initialState = {
  success: false,
  message: '',
};

export function InviteUserForm() {
  const [state, formAction] = useActionState(inviteUser, initialState);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.message) {
      if (state.success) {
        toast.success(state.message);
        formRef.current?.reset();
      } else {
        toast.error(state.message);
      }
    }
  }, [state]);

  return (
    <form ref={formRef} action={formAction} className="space-y-6">
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700">Correo Electrónico</label>
        <input id="email" name="email" type="email" required className="mt-1 block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm" placeholder="ejemplo@dominio.com" />
      </div>
      <div>
        <label htmlFor="role" className="block text-sm font-medium text-gray-700">Rol</label>
        <select id="role" name="role" required className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm">
          <option value="">Selecciona un rol...</option>
          <option value="admin">Administrador</option>
          <option value="user">Usuario</option>
        </select>
      </div>
      <SubmitButton />
    </form>
  );
}
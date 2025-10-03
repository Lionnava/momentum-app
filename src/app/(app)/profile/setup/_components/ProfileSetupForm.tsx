// src/app/(app)/profile/setup/_components/ProfileSetupForm.tsx
'use client';

import { useFormStatus } from 'react-dom';
import type { User } from '@supabase/supabase-js';

function SubmitButton() {
  const { pending } = useFormStatus();
  return <button disabled={pending} className="w-full justify-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 disabled:bg-slate-400">{pending ? 'Guardando...' : 'Guardar y Continuar al Dashboard'}</button>;
}

export function ProfileSetupForm({ user }: { user: User }) {
  return (
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-slate-700">Correo Electrónico</label>
        <input id="email" type="email" value={user.email} disabled className="mt-1 block w-full rounded-md border-slate-300 bg-slate-100 shadow-sm px-3 py-2 cursor-not-allowed" />
      </div>
      <div>
        <label htmlFor="full_name" className="block text-sm font-medium text-slate-700">Nombre Completo</label>
        <input id="full_name" name="full_name" type="text" required placeholder="Tu nombre y apellido" className="mt-1 block w-full rounded-md border-slate-300 shadow-sm px-3 py-2" />
      </div>
      <SubmitButton />
    </form>
  );
}
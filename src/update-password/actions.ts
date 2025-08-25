'use server';

import { createServerClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';

export type UpdatePasswordState = {
  message: string;
  success: boolean;
};

export async function updatePassword(prevState: UpdatePasswordState, formData: FormData): Promise<UpdatePasswordState> {
    const supabase = createServerClient();

    const password = formData.get('password') as string;
    const confirmPassword = formData.get('confirmPassword') as string;

    if (password !== confirmPassword) {
        return { message: 'Las contraseñas no coinciden.', success: false };
    }
    
    if (password.length < 6) {
        return { message: 'La contraseña debe tener al menos 6 caracteres.', success: false };
    }

    const { error } = await supabase.auth.updateUser({ password });

    if (error) {
        return { message: `Error al actualizar la contraseña: ${error.message}`, success: false };
    }

    redirect('/dashboard');
}
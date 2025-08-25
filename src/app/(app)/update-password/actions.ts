'use server'

import { createServerClient } from '@/utils/supabase/server' // CORRECCIÓN
import { redirect } from 'next/navigation'
import type { UpdatePasswordState } from './page' // Asumiendo que el tipo está en la página

export async function updatePassword(prevState: UpdatePasswordState, formData: FormData): Promise<UpdatePasswordState> {
    const supabase = createServerClient();

    const password = formData.get('password') as string;
    const confirmPassword = formData.get('confirmPassword') as string;

    if (password !== confirmPassword) return { message: 'Las contraseñas no coinciden.', success: false };
    if (password.length < 6) return { message: 'La contraseña debe tener al menos 6 caracteres.', success: false };

    const { error } = await supabase.auth.updateUser({ password });
    if (error) return { message: `Error: ${error.message}`, success: false };

    redirect('/dashboard');
}
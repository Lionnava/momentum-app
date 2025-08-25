'use server'

import { createServerClient } from '@/utils/supabase/server' // CORRECCIÓN

export type ForgotPasswordState = {
  message: string;
  success: boolean;
}

export async function forgotPassword(prevState: ForgotPasswordState, formData: FormData): Promise<ForgotPasswordState> {
    const supabase = createServerClient();
    const email = formData.get('email') as string;

    if (!email) return { message: 'El correo es obligatorio.', success: false };

    // La URL a la que se enviará al usuario para resetear la contraseña
    // ¡Asegúrate de que la página /update-password exista!
    const redirectTo = '/update-password';

    const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo });

    if (error) {
        return { message: `Error: ${error.message}`, success: false };
    }

    return { message: 'Si existe una cuenta con ese correo, recibirás un enlace para restablecer tu contraseña.', success: true };
}
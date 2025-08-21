// src/app/(public)/forgot-password/actions.ts
'use server'

import { createClient } from '@/utils/supabase/server'

export type ForgotPasswordState = {
  message: string;
  success: boolean;
}

export async function requestPasswordResetAction(
  prevState: ForgotPasswordState, 
  formData: FormData
): Promise<ForgotPasswordState> {
  const email = formData.get('email') as string
  const supabase = createClient()

  // Construye la URL a la que el usuario será redirigido desde el correo.
  // ¡Asegúrate de crear esta página más adelante!
  const redirectTo = `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback?next=/update-password`

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo,
  });

  if (error) {
    return {
      message: 'Error: No se pudo enviar el correo de restablecimiento.',
      success: false,
    }
  }

  return {
    message: 'Si existe una cuenta con ese correo, se ha enviado un enlace para restablecer la contraseña.',
    success: true,
  }
}
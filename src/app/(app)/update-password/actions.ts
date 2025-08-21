// src/app/(app)/update-password/actions.ts
'use server'

import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'

export type UpdatePasswordState = {
  message: string;
  success: boolean;
}

export async function updatePasswordAction(
  prevState: UpdatePasswordState,
  formData: FormData
): Promise<UpdatePasswordState> {
  const password = formData.get('password') as string;
  const supabase = createClient();

  // Primero, verificamos que el usuario tenga una sesión activa
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    // Esto no debería ocurrir gracias al layout, pero es una buena práctica de seguridad
    return redirect('/login?message=Error: Sesión no válida');
  }

  // Actualizamos la contraseña del usuario
  const { error } = await supabase.auth.updateUser({ password });

  if (error) {
    return {
      message: `Error: ${error.message}`,
      success: false,
    };
  }

  return {
    message: '¡Tu contraseña ha sido actualizada con éxito!',
    success: true,
  };
}
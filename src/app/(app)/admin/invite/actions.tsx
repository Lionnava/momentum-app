'use server';

import { createServiceRoleClient } from '@/utils/supabase/service';
import { revalidatePath } from 'next/cache';
import { headers } from 'next/headers'; // Importamos 'headers'

export type InviteUserState = {
  message: string;
  success: boolean;
};

export async function inviteUser(prevState: InviteUserState, formData: FormData): Promise<InviteUserState> {
  const email = formData.get('email') as string;
  const rol = formData.get('rol') as string;

  if (!email || !rol) {
    return { message: 'El correo y el rol son obligatorios.', success: false };
  }
  
  // --- INICIO DE LA CORRECCIÓN CLAVE ---
  // Obtenemos el origen (http://localhost:3000) dinámicamente
  const origin = headers().get('origin');
  
  // Creamos la URL de redirección explícita
  const redirectTo = `${origin}/auth/callback`;
  // --- FIN DE LA CORRECCIÓN CLAVE ---

  const supabase = createServiceRoleClient();

  const { data, error } = await supabase.auth.admin.inviteUserByEmail(email, {
    data: {
      initial_rol: rol,
    },
    // Le decimos a Supabase a dónde redirigir al usuario DESPUÉS de que el token sea validado
    redirectTo: redirectTo, 
  });

  if (error) {
    console.error('Error al invitar usuario:', error);
    return { message: `Error: ${error.message}`, success: false };
  }

  revalidatePath('/admin/invite');
  return { message: `Invitación enviada exitosamente a ${email}.`, success: true };
}
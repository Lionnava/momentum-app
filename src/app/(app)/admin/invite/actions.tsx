'use server';

import { createServerClient } from '@supabase/ssr'; 
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

/**
 * Server Action para invitar a un nuevo usuario.
 * Se ejecuta en el servidor y utiliza la clave de servicio de Supabase
 * para tener permisos de administrador.
 */
export async function inviteUserAction(formData: FormData) {
  const email = formData.get('email') as string;
  const role = formData.get('role') as string;

  // Validaciones básicas
  if (!email || !role) {
    return redirect('/admin/invite?error=Email y rol son requeridos.');
  }

  const cookieStore = cookies();

  // Creamos un cliente de Supabase con permisos de administrador
  // utilizando la clave de servicio (SUPABASE_SERVICE_ROLE_KEY).
  // ¡Esta clave debe estar en tu archivo .env.local!
  const supabaseAdmin = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      cookies: {
        get(name: string) { return cookieStore.get(name)?.value; },
        set(name: string, value: string, options) {
          try { cookieStore.set({ name, value, ...options }); } catch (error) {}
        },
        remove(name: string, options) {
          try { cookieStore.set({ name, value: '', ...options }); } catch (error) {}
        },
      }
    }
  );

  // Usamos la función de admin para enviar la invitación por correo.
  // Pasamos el rol en los metadatos para que el trigger de la base de datos lo recoja.
  const { data, error } = await supabaseAdmin.auth.admin.inviteUserByEmail(email, {
    data: { role: role }
  });

  if (error) {
    console.error('Error al invitar usuario:', error);
    // Redirigir de vuelta a la página con un mensaje de error
    return redirect(`/admin/invite?error=${encodeURIComponent(error.message)}`);
  }

  console.log('Usuario invitado exitosamente:', data);
  // Redirigir de vuelta a la página con un mensaje de éxito
  return redirect('/admin/invite?success=Invitación enviada correctamente.');
}
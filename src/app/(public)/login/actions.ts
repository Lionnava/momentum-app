'use server';

import { createServerClient } from '@/utils/supabase/server';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

// Estado mejorado para la respuesta del formulario.
export type FormState = {
  message: string;
  success: boolean;
};

// Renombrada de loginAction a signIn para mayor claridad.
export async function signIn(prevState: FormState, formData: FormData): Promise<FormState> {
  const supabase = createServerClient();

  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  if (!email || !password) {
    return { message: 'El correo y la contraseña son obligatorios.', success: false };
  }

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return { message: 'Credenciales inválidas. Por favor, intente de nuevo.', success: false };
  }

  revalidatePath('/', 'layout');
  redirect('/dashboard');
}

// Función signUp añadida para el registro.
export async function signUp(prevState: FormState, formData: FormData): Promise<FormState> {
  const supabase = createServerClient();
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  if (!email || !password) {
    return { message: 'El correo y la contraseña son obligatorios.', success: false };
  }

  const { error } = await supabase.auth.signUp({ email, password });

  if (error) {
    return { message: `Error al registrar: ${error.message}`, success: false };
  }

  return { message: '¡Registro exitoso! Revisa tu correo para confirmar tu cuenta.', success: true };
}


// Renombrada de logoutAction a signOut para mayor claridad.
export async function signOut() {
  const supabase = createServerClient();
  await supabase.auth.signOut();
  redirect('/login');
}
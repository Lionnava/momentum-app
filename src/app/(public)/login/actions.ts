'use server'

import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'

export type FormState = {
  message: string;
}

export async function loginAction(prevState: FormState, formData: FormData): Promise<FormState> {
  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const supabase = createClient()

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    return {
      message: 'Credenciales inválidas. Por favor, intente de nuevo.',
    }
  }
  redirect('/dashboard')
}

export async function logoutAction() {
    const supabase = createClient();
    await supabase.auth.signOut();
    redirect('/login');
}
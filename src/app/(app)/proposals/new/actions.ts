'use server';
import { createServerClient } from '@/utils/supabase/server';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export type FormState = {
  message: string;
  success: boolean;
};

export async function createProposal(prevState: FormState, formData: FormData): Promise<FormState> {
  const supabase = createServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { message: 'No autorizado.', success: false };

  const title = formData.get('title') as string;
  const description = formData.get('description') as string;
  const division_id = formData.get('division_id') as string;

  if (!title || !division_id) {
    return { message: 'El título y la división son obligatorios.', success: false };
  }

  const { error } = await supabase.from('proposals').insert({
    title,
    description,
    division_id,
    proponent_id: user.id,
    status: 'Pendiente',
  });

  if (error) {
    return { message: `Error al crear la propuesta: ${error.message}`, success: false };
  }
  
  revalidatePath('/tasks');
  return { message: '¡Propuesta enviada con éxito!', success: true };
}
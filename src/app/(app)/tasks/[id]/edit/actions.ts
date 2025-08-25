'use server';

import { createServerClient } from '@/utils/supabase/server';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export type FormState = {
  message: string;
  success: boolean;
};

// --- INICIO DE LA CORRECCIÓN: AÑADIR TIPOS ---
export async function updateTask(taskId: string, prevState: FormState, formData: FormData): Promise<FormState> {
// --- FIN DE LA CORRECCIÓN ---
  const supabase = createServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { message: 'No autorizado.', success: false };

  const title = formData.get('title') as string;
  const description = formData.get('description') as string;
  const status = formData.get('status') as string;
  const due_date = formData.get('due_date') as string;

  if (!title) {
    return { message: 'El título es obligatorio.', success: false };
  }

  const { error } = await supabase
    .from('tasks')
    .update({ title, description, status, due_date: due_date || null })
    .eq('id', taskId);

  if (error) {
    return { message: `Error: ${error.message}`, success: false };
  }

  revalidatePath('/tasks');
  revalidatePath(`/tasks/${taskId}/edit`);
  redirect('/tasks');
}
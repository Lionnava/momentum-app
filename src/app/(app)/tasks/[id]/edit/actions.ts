// src/app/(app)/tasks/[id]/edit/actions.ts o similar
'use server';

import { createServerClient } from '@/utils/supabase/server';
import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

// Asumiendo una función de validación simple
function isValidUUID(uuid: any) {
  if (typeof uuid !== 'string') return false;
  const regex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  return regex.test(uuid);
}

export async function updateTask(taskId: string, formData: FormData) {
  const cookieStore = cookies();
  const supabase = createServerClient(cookieStore);
  
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: 'No autorizado' };

  const title = formData.get('title') as string;
  const description = formData.get('description') as string;
  const workflowId = formData.get('workflowId') as string;

  // --- VALIDACIÓN ---
  if (!title) {
    return { error: 'El título es obligatorio.' };
  }
  if (!isValidUUID(workflowId)) { // O la validación que necesites (ej. !isNaN(parseInt(workflowId)))
    return { error: 'Por favor, seleccione un flujo de trabajo válido.' };
  }

  const { error } = await supabase
    .from('tasks')
    .update({
      title,
      description,
      work_flow_id: workflowId,
    })
    .eq('id', taskId)
    .eq('user_id', user.id); // <-- Importante también para seguridad

  if (error) {
    return { error: 'Error al actualizar la tarea: ' + error.message };
  }

  revalidatePath(`/tasks/${taskId}/edit`);
  revalidatePath('/tasks');
  redirect('/tasks');
}
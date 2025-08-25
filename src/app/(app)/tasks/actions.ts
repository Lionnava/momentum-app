'use server';

import { createServerClient } from '@/utils/supabase/server';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

// --- TIPOS DE ESTADO PARA LOS FORMULARIOS ---
export type FormState = {
  message: string;
  success: boolean;
};
export type MilestoneFormState = {
  message: string;
  success: boolean;
};
export type AssignTaskState = {
  success?: string;
  error?: string;
} | null;

// --- ACCIÓN PARA ACTUALIZAR UNA TAREA ---
// La firma debe ser así para que .bind funcione correctamente con useFormState
export async function updateTask(taskId: string, prevState: FormState, formData: FormData): Promise<FormState> {
  const supabase = createServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { message: 'No autorizado.', success: false };

  const title = formData.get('title') as string;
  const description = formData.get('description') as string;
  const status = formData.get('status') as string;
  const due_date = formData.get('due_date') as string;

  if (!title) return { message: 'El título es obligatorio.', success: false };

  const { error } = await supabase
    .from('tasks')
    .update({ title, description, status, due_date: due_date || null })
    .eq('id', taskId);

  if (error) return { message: `Error al actualizar: ${error.message}`, success: false };

  revalidatePath('/tasks');
  revalidatePath(`/tasks/${taskId}/edit`);
  redirect('/tasks');
}


// --- ACCIÓN PARA AÑADIR UN HITO ---
export async function addMilestone(prevState: MilestoneFormState, formData: FormData): Promise<MilestoneFormState> {
  const supabase = createServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { message: 'No autorizado.', success: false };

  const description = formData.get('description') as string;
  const taskId = formData.get('taskId') as string;
  const imageFile = formData.get('image') as File;

  if (!description || !taskId) return { message: 'La descripción es obligatoria.', success: false };

  let imageUrl: string | null = null;
  if (imageFile && imageFile.size > 0) {
    const fileName = `${user.id}/${taskId}/${Date.now()}-${imageFile.name}`;
    const { data: uploadData, error: uploadError } = await supabase.storage.from('task_images').upload(fileName, imageFile);
    if (uploadError) return { message: 'Error al subir la imagen.', success: false };
    const { data: { publicUrl } } = supabase.storage.from('task_images').getPublicUrl(uploadData.path);
    imageUrl = publicUrl;
  }

  const { error: insertError } = await supabase.from('milestones').insert({ task_id: taskId, description, image_url: imageUrl });
  if (insertError) return { message: 'Error al guardar el hito.', success: false };

  revalidatePath(`/tasks/${taskId}/edit`);
  revalidatePath(`/tasks/${taskId}/view`);
  return { message: 'Hito añadido con éxito.', success: true };
}

// --- ACCIÓN PARA ASIGNAR TAREA ---
export async function assignTask(prevState: AssignTaskState, formData: FormData): Promise<AssignTaskState> {
    const supabase = createServerClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { error: 'No autorizado.' };
    const { data: profile } = await supabase.from('profiles').select('rol').eq('id', user.id).single();
    const userRole = profile?.rol.replace(/::text/g, '').toLowerCase();
    if (userRole !== 'manager' && userRole !== 'supermanager') return { error: 'No tienes permisos para asignar tareas.' };
    
    const taskId = formData.get('taskId') as string;
    const assigneeId = formData.get('assigneeId') as string;
    if (!taskId || !assigneeId) return { error: 'Faltan datos para asignar la tarea.' };

    const { error } = await supabase.from('tasks').update({ assignee_id: assigneeId, status: 'Pendiente' }).eq('id', taskId);
    if (error) return { error: 'No se pudo asignar la tarea.' };

    revalidatePath('/tasks');
    return { success: '¡Tarea asignada!' };
}

// --- OTRAS ACCIONES (No usan useFormState, por lo que su firma es más simple) ---
export async function deleteTask(taskId: string) {
  const supabase = createServerClient();
  const { error } = await supabase.from('tasks').delete().eq('id', taskId);
  if (error) return { error: "No se pudo eliminar la tarea." };
  revalidatePath('/tasks');
  return { success: true };
}

export async function deleteMilestone(milestoneId: string, taskId: string) {
  const supabase = createServerClient();
  const { error } = await supabase.from('milestones').delete().eq('id', milestoneId);
  if (error) return { error: "No se pudo eliminar el hito." };
  revalidatePath(`/tasks/${taskId}/view`);
  return { success: true };
}

export async function toggleMilestone(milestoneId: string, currentStatus: boolean, taskId: string) {
  const supabase = createServerClient();
  const { error } = await supabase.from('milestones').update({ is_completed: !currentStatus }).eq('id', milestoneId);
  if (error) return { error: "No se pudo actualizar el hito." };
  revalidatePath(`/tasks/${taskId}/view`);
  return { success: true };
}

export async function updateTaskProgress(taskId: string, progress: number) {
  const supabase = createServerClient();
  const { error } = await supabase.from('tasks').update({ progress_percent: progress }).eq('id', taskId);
  if (error) return { error: "No se pudo actualizar el progreso." };
  revalidatePath(`/tasks/${taskId}/view`);
  revalidatePath('/dashboard');
  return { success: true };
}
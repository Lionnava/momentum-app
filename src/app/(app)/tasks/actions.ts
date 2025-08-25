'use server';

import { createServerClient } from '@/utils/supabase/server';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function deleteTask(taskId: string) { /* ... */ }
export async function updateTask(taskId: string, formData: FormData) { /* ... */ }
export type MilestoneFormState = { message: string; success: boolean; };
export async function addMilestone(prevState: MilestoneFormState, formData: FormData): Promise<MilestoneFormState> { /* ... */ }

// --- FUNCIÓN 'assignTask' Y SU TIPO DE ESTADO ---
export type AssignTaskState = {
  success?: string;
  error?: string;
} | null;

export async function assignTask(prevState: AssignTaskState, formData: FormData): Promise<AssignTaskState> {
  const supabase = createServerClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: 'No autorizado.' };

  const { data: profile } = await supabase.from('profiles').select('rol').eq('id', user.id).single();
  const userRole = profile?.rol.replace(/::text/g, '').toLowerCase();

  if (userRole !== 'manager' && userRole !== 'supermanager') {
    return { error: 'No tienes permisos para asignar tareas.' };
  }
  
  const taskId = formData.get('taskId') as string;
  const assigneeId = formData.get('assigneeId') as string;

  if (!taskId || !assigneeId) {
    return { error: 'Faltan datos para asignar la tarea.' };
  }

  const { error } = await supabase
    .from('tasks')
    .update({ assignee_id: assigneeId, status: 'Pendiente' })
    .eq('id', taskId);

  if (error) {
    console.error('Error al asignar tarea:', error);
    return { error: 'No se pudo asignar la tarea.' };
  }

  revalidatePath('/tasks');
  return { success: '¡Tarea asignada!' };
}
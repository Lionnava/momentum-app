'use server';

import { createServerClient } from '@/utils/supabase/server';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

// ... (tus funciones signIn, signUp, signOut, etc. si están en archivos globales)

// --- ACCIONES DE TAREAS Y HITOS ---

export async function deleteTask(taskId: string) { /* ... */ }
export async function updateTask(taskId: string, formData: FormData) { /* ... */ }

export type MilestoneFormState = { message: string; success: boolean; };
export async function addMilestone(prevState: MilestoneFormState, formData: FormData): Promise<MilestoneFormState> {
  // ... (código existente de addMilestone)
}

// --- NUEVA ACCIÓN: ELIMINAR UN HITO ---
export async function deleteMilestone(milestoneId: string, taskId: string) {
  const supabase = createServerClient();
  const { error } = await supabase.from('milestones').delete().eq('id', milestoneId);
  if (error) {
    console.error("Error deleting milestone:", error);
    return { error: "No se pudo eliminar el hito." };
  }
  revalidatePath(`/tasks/${taskId}/view`); // Revalidamos la página de vista
  return { success: true };
}

// --- NUEVA ACCIÓN: MARCAR UN HITO COMO COMPLETADO/NO COMPLETADO ---
export async function toggleMilestone(milestoneId: string, currentStatus: boolean, taskId: string) {
  const supabase = createServerClient();
  const { error } = await supabase.from('milestones').update({ is_completed: !currentStatus }).eq('id', milestoneId);
  if (error) {
    console.error("Error toggling milestone:", error);
    return { error: "No se pudo actualizar el hito." };
  }
  revalidatePath(`/tasks/${taskId}/view`);
  return { success: true };
}

// --- NUEVA ACCIÓN: ACTUALIZAR EL PROGRESO GENERAL DE LA TAREA ---
export async function updateTaskProgress(taskId: string, progress: number) {
  const supabase = createServerClient();
  const { error } = await supabase.from('tasks').update({ progress_percent: progress }).eq('id', taskId);
  if (error) {
    console.error("Error updating task progress:", error);
    return { error: "No se pudo actualizar el progreso." };
  }
  revalidatePath(`/tasks/${taskId}/view`);
  revalidatePath('/dashboard'); // También revalidamos el dashboard
  return { success: true };
}

// ... (resto de tus acciones)
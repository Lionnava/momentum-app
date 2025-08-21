// src/app/(app)/tasks/actions.ts
'use server'

import { createClient } from '@/utils/supabase/server';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

// --- ACCIONES DE CREACIÓN DE TAREAS ---
export type CreateTaskState = { message: string; };

export async function createTaskAction(prevState: CreateTaskState, formData: FormData): Promise<CreateTaskState> {
    const supabase = createClient();
    const title = formData.get('title') as string;
    const assigneeId = formData.get('assignee_id') as string;
    const dueDate = formData.get('due_date') as string;
    const status = formData.get('status') as string;
    const divisionId = formData.get('division_id') as string;
    const requiresApproval = formData.get('requires_approval') === 'on';

    if (!title || !assigneeId || !dueDate || !status || !divisionId) {
        return { message: 'Error: Todos los campos son obligatorios.' };
    }

    const { error } = await supabase.from('tasks').insert({
        title,
        assignee_id: assigneeId,
        due_date: dueDate,
        status,
        division_id: divisionId,
        requires_approval: requiresApproval,
    });

    if (error) {
        console.error('Error creating task:', error);
        return { message: `Error de base de datos: ${error.message}` };
    }

    revalidatePath('/tasks');
    revalidatePath('/dashboard');
    redirect('/tasks');
}

// --- ACCIONES DE FLUJO DE TRABAJO Y APROBACIÓN ---

export async function completeTaskAction(taskId: string, requiresApproval: boolean) {
    const supabase = createClient();
    const newStatus = requiresApproval ? 'En Revisión' : 'Completada';
    await supabase.from('tasks').update({ status: newStatus, progress_percent: 100 }).eq('id', taskId);
    revalidatePath('/tasks');
    revalidatePath('/dashboard');
}

export async function approveTaskAction(taskId: string) {
    const supabase = createClient();
    await supabase.from('tasks').update({ status: 'Completada' }).eq('id', taskId);
    revalidatePath('/tasks');
    revalidatePath('/dashboard');
}

export async function rejectTaskAction(taskId: string) {
    const supabase = createClient();
    await supabase.from('tasks').update({ status: 'En Progreso' }).eq('id', taskId);
    revalidatePath('/tasks');
    revalidatePath('/dashboard');
}

// --- ACCIONES CRUD (Update y Delete) ---

export type UpdateTaskState = { message: string; };

export async function updateTaskAction(taskId: string, prevState: UpdateTaskState, formData: FormData): Promise<UpdateTaskState> {
    const supabase = createClient();
    const title = formData.get('title') as string;
    const assigneeId = formData.get('assignee_id') as string;
    const dueDate = formData.get('due_date') as string;
    const status = formData.get('status') as string;
    const divisionId = formData.get('division_id') as string;

    const { error } = await supabase.from('tasks').update({ 
        title, 
        assignee_id: assigneeId,
        due_date: dueDate,
        status,
        division_id: divisionId,
    }).eq('id', taskId);

    if (error) { return { message: 'Error al actualizar la tarea.' }; }
    
    revalidatePath('/tasks');
    revalidatePath(`/tasks/${taskId}/view`);
    redirect('/tasks');
}

export async function deleteTaskAction(taskId: string) {
    const supabase = createClient();
    const { error } = await supabase.from('tasks').delete().eq('id', taskId);

    if (error) {
        console.error('Error deleting task:', error);
        return redirect('/tasks?message=Error al eliminar la tarea');
    }

    revalidatePath('/tasks');
    revalidatePath('/dashboard');
    redirect('/tasks');
}

// --- ACCIONES DE HITOS ---

export async function toggleMilestoneAction(milestoneId: string, newState: boolean) {
    const supabase = createClient();
    await supabase.from('milestones').update({ is_completed: newState }).eq('id', milestoneId);
}

export async function addMilestoneAction(taskId: string, formData: FormData) {
    const supabase = createClient();
    const description = formData.get('description') as string;
    if (!description) return;
    await supabase.from('milestones').insert({ task_id: taskId, description });
}

export async function deleteMilestoneAction(milestoneId: string) {
    const supabase = createClient();
    await supabase.from('milestones').delete().eq('id', milestoneId);
}

export async function updateTaskProgressAction(taskId: string, newProgress: number) {
    const supabase = createClient();
    await supabase.from('tasks').update({ progress_percent: newProgress }).eq('id', taskId);
    revalidatePath(`/tasks/${taskId}/view`);
    revalidatePath('/tasks');
    revalidatePath('/dashboard');
}
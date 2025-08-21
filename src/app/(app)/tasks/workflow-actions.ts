// src/app/(app)/tasks/workflow-actions.ts
'use server'

import { createClient } from '@/utils/supabase/server';
import { revalidatePath } from 'next/cache';

// ELIMINAMOS: const supabase = createClient();

// Acción para cuando un empleado completa una tarea
export async function completeTaskAction(taskId: string, requiresApproval: boolean) {
    // Creamos el cliente DENTRO de la acción
    const supabase = createClient();
    const newStatus = requiresApproval ? 'En Revisión' : 'Completada';
    
    const { error } = await supabase
        .from('tasks')
        .update({ status: newStatus })
        .eq('id', taskId);

    if (error) {
        console.error('Error al completar la tarea:', error.message);
    }
    revalidatePath('/tasks');
    revalidatePath('/dashboard');
}

// Acción para que un manager apruebe una tarea
export async function approveTaskAction(taskId: string) {
    // Creamos el cliente DENTRO de la acción
    const supabase = createClient();

    const { error } = await supabase
        .from('tasks')
        .update({ status: 'Aprobada' })
        .eq('id', taskId);

    if (error) {
        console.error('Error al aprobar la tarea:', error.message);
    }
    revalidatePath('/tasks');
    revalidatePath('/dashboard');
}

// Acción para que un manager rechace una tarea
export async function rejectTaskAction(taskId: string) {
    // Creamos el cliente DENTRO de la acción
    const supabase = createClient();

    const { error } = await supabase
        .from('tasks')
        .update({ status: 'En Progreso' })
        .eq('id', taskId);
    
    if (error) {
        console.error('Error al rechazar la tarea:', error.message);
    }
    revalidatePath('/tasks');
    revalidatePath('/dashboard');
}
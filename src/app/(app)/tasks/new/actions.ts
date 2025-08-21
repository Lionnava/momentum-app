// src/app/(app)/tasks/new/actions.ts
'use server'

import { createClient } from '@/utils/supabase/server';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export type CreateTaskState = { message: string; };

export async function createTaskAction(prevState: CreateTaskState, formData: FormData): Promise<CreateTaskState> {
    const supabase = createClient();
    const title = formData.get('title') as string;
    const assigneeId = formData.get('assignee_id') as string;
    const dueDate = formData.get('due_date') as string;
    const status = formData.get('status') as string;
    const divisionId = formData.get('division_id') as string;
    const requiresApproval = formData.get('requires_approval') === 'on'; // Los checkboxes envían 'on'

    if (!title || !assigneeId || !dueDate || !status || !divisionId) {
        return { message: 'Error: Todos los campos son obligatorios.' };
    }

    const { error } = await supabase.from('tasks').insert({
        title,
        assignee_id: assigneeId,
        due_date: dueDate,
        status,
        division_id: divisionId,
        requires_approval: requiresApproval, // Guardamos el valor booleano
    });

    if (error) {
        console.error('Error creating task:', error);
        return { message: `Error de base de datos: ${error.message}` };
    }

    revalidatePath('/tasks');
    revalidatePath('/dashboard');
    redirect('/tasks');
}
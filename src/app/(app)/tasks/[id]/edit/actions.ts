// src/app/(app)/tasks/[id]/edit/actions.ts
'use server'

import { createClient } from '@/utils/supabase/server';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export type UpdateTaskState = { message: string; };

export async function updateTaskAction(
    taskId: string,
    prevState: UpdateTaskState,
    formData: FormData
): Promise<UpdateTaskState> {
    const supabase = createClient();

    // ... (obtener title, assigneeId, etc.) ...
    // --- INICIO DE LA MODIFICACIÓN ---
    const progressPercent = Number(formData.get('progress_percent'));
    // --- FIN DE LA MODIFICACIÓN ---
    
    // ... (validación) ...

    const { error } = await supabase
        .from('tasks')
        .update({
            title,
            assignee_id: assigneeId,
            due_date: dueDate,
            status,
            division_id: divisionId,
            progress_percent: progressPercent, // Guardamos el nuevo valor
        })
        .eq('id', taskId);

    if (error) { /* ... no cambia ... */ }

    revalidatePath('/tasks');
    // ... (resto de revalidate y redirect no cambian) ...
}

// ... (la función deleteTaskAction no cambia) ...
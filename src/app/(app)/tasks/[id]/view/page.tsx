// src/app/(app)/tasks/[id]/view/page.tsx
import { createClient } from '@/utils/supabase/server';
import { notFound } from 'next/navigation';
import { ManageTask } from './_components/ManageTask';

export default async function ViewTaskPage({ params }: { params: { id: string } }) {
    const supabase = createClient();
    
    const { data: taskData, error: taskError } = await supabase
        .from('tasks')
        .select(`*, milestones (*)`)
        .eq('id', params.id)
        .order('created_at', { referencedTable: 'milestones', ascending: true })
        .single();

    if (taskError || !taskData) {
        return notFound();
    }
    
    // --- INICIO DE LA CORRECCIÓN ---
    // Creamos un objeto 'task' saneado. Si 'milestones' es null,
    // lo reemplazamos con un array vacío.
    const task = {
        ...taskData,
        milestones: taskData.milestones ?? [],
    };
    // --- FIN DE LA CORRECCIÓN ---

    return (
        <div className="max-w-2xl mx-auto p-4 sm:p-6 lg:p-8">
            <div className="bg-white p-8 rounded-lg shadow-md border">
                <ManageTask task={task} />
            </div>
        </div>
    );
}
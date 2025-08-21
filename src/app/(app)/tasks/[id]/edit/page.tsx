// src/app/(app)/tasks/[id]/edit/page.tsx
import { createClient } from '@/utils/supabase/server';
import { notFound } from 'next/navigation';
import { EditTaskForm } from './_components/EditTaskForm';

// Definimos el tipo explícito para los props, solucionando el error de TypeScript
type EditPageProps = {
  params: { id: string };
};

export default async function EditTaskPage({ params }: EditPageProps) {
    const supabase = createClient();
    
    const { data: task, error: taskError } = await supabase
        .from('tasks')
        .select('*')
        .eq('id', params.id)
        .single();

    if (taskError || !task) {
        return notFound();
    }

    const { data: profiles } = await supabase.from('profiles').select('id, full_name');
    const { data: divisions } = await supabase.from('divisions').select('id, name');

    return (
        <div className="max-w-2xl mx-auto p-4 sm:p-6 lg:p-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-800">Editar Tarea</h1>
                <p className="mt-1 text-gray-600">Actualiza los detalles de la tarea.</p>
            </div>
            
            <div className="bg-white p-8 rounded-lg shadow-md border">
                <EditTaskForm 
                    task={task as any}
                    profiles={profiles ?? []} 
                    divisions={divisions ?? []} 
                />
            </div>
        </div>
    );
}
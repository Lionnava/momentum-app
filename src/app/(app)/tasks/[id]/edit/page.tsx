// src/app/(app)/tasks/[id]/edit/page.tsx
import { createClient } from '@/utils/supabase/server';
import { notFound } from 'next/navigation';
import { TaskForm } from './_components/TaskForm';

export default async function EditTaskPage({ params }: { params: { id: string } }) {
  const supabase = createClient();

  // Obtenemos la tarea específica Y sus hitos relacionados
  const { data: task, error: taskError } = await supabase
    .from('tasks')
    .select(`
      *,
      milestones ( * )
    `)
    .eq('id', params.id)
    .single();

  if (taskError || !task) {
    notFound(); // Si la tarea no existe, muestra una página 404
  }
  
  // Obtenemos la lista de usuarios para el selector de "Asignar a"
  const { data: users, error: usersError } = await supabase
    .from('profiles')
    .select('id, full_name');

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Editar Tarea</h1>
          <p className="mt-1 text-slate-600">Actualiza los detalles y gestiona los hitos de la tarea.</p>
        </div>
        
        <div className="bg-white p-8 border border-slate-200 rounded-lg shadow-sm">
          <TaskForm task={task} users={users ?? []} />
        </div>
      </div>
    </div>
  );
}
import { createServerClient } from '@/utils/supabase/server';
import { notFound } from 'next/navigation';
import EditTaskForm from './_components/EditTaskForm';
// Importaremos el nuevo componente que vamos a crear
import MilestoneManager from './_components/MilestoneManager';
import type { Tables } from '@/lib/types';

// Extendemos el tipo Task para incluir sus hitos
type TaskWithMilestones = Tables<'tasks'> & {
  milestones: Tables<'milestones'>[];
};

async function getTaskAndMilestones(id: string): Promise<TaskWithMilestones | null> {
  const supabase = createServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  // Hacemos una sola consulta para obtener la tarea y todos sus hitos
  const { data: task } = await supabase
    .from('tasks')
    .select(`
      *,
      milestones ( * )
    `)
    .eq('id', id)
    // .eq('assignee_id', user.id) // Opcional: restringir acceso si es necesario
    .single();
    
  return task;
}

export default async function EditTaskPage({ params }: { params: { id: string } }) {
  const taskData = await getTaskAndMilestones(params.id);

  if (!taskData) {
    notFound();
  }

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Editar Tarea</h1>
        <div className="bg-white p-8 rounded-xl shadow-md border border-gray-200">
          <EditTaskForm task={taskData} />
        </div>
      </div>
      
      {/* Añadimos el nuevo componente para manejar los hitos */}
      <div className="max-w-3xl mx-auto">
        <h2 className="text-2xl font-bold mb-6">Hitos de la Tarea</h2>
        <div className="bg-white p-8 rounded-xl shadow-md border border-gray-200">
          <MilestoneManager taskId={taskData.id} initialMilestones={taskData.milestones} />
        </div>
      </div>
    </div>
  );
}
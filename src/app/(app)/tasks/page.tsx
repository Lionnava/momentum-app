// src/app/(app)/tasks/page.tsx
import { createClient } from '@/utils/supabase/server';
import Link from 'next/link';
import Image from 'next/image';
import { LuPlus, LuPencil, LuTrash2 } from 'react-icons/lu';
import { ProgressBar } from '@/components/ui/ProgressBar';
// Esta importación ahora funcionará correctamente
import { deleteTask } from '@/app/actions';

export default async function TasksListPage() {
  const supabase = createClient();
  const { data: tasks, error } = await supabase
    .from('tasks')
    .select(`
        *,
        assignee:profiles(full_name)
    `)
    .order('created_at', { ascending: false });

  if (error) {
    console.error("Error al obtener las tareas:", error);
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Todas las Tareas</h1>
          <p className="mt-1 text-slate-600">Vista de administrador de todas las tareas del sistema.</p>
        </div>
        <Link href="/tasks/new" className="inline-flex items-center gap-2 rounded-md bg-blue-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-blue-700">
          <LuPlus size={16} />
          Nueva Tarea
        </Link>
      </div>

      <div className="space-y-4">
        {tasks?.map(task => (
          <div key={task.id} className="bg-white border border-slate-200 rounded-lg shadow-sm p-5">
            <div className="flex items-start justify-between">
              <div>
                <p className="font-semibold text-lg text-slate-800">{task.title}</p>
                <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                  task.status === 'Completada' ? 'bg-emerald-100 text-emerald-700' :
                  task.status === 'En Progreso' ? 'bg-blue-100 text-blue-700' :
                  'bg-amber-100 text-amber-700'
                }`}>{task.status}</span>
              </div>
              <div className="flex items-center gap-3">
                <Link href={`/tasks/${task.id}/edit`} className="text-slate-500 hover:text-blue-600 p-1">
                  <LuPencil size={18} />
                </Link>
                {/* Este formulario ahora funciona porque la función deleteTask existe y está exportada */}
                <form action={deleteTask.bind(null, task.id)}>
                    <button type="submit" className="text-slate-500 hover:text-red-600 p-1">
                        <LuTrash2 size={18} />
                    </button>
                </form>
              </div>
            </div>

            {task.progress_image_url && (
                <div className="mt-4">
                    <Image 
                        src={task.progress_image_url} 
                        alt={`Imagen de la tarea ${task.title}`} 
                        width={200} 
                        height={120} 
                        className="rounded-md object-cover border border-slate-200"
                    />
                </div>
            )}

            <div className="mt-3 text-sm text-slate-600 space-y-1">
              {task.division_id && <p><span className="font-medium">División:</span> {task.division_id}</p>}
              <p><span className="font-medium">Asignado a:</span> {task.assignee?.full_name ?? 'N/A'}</p>
              <p><span className="font-medium">Fecha Límite:</span> {task.due_date ? new Date(task.due_date).toLocaleDateString('es-ES') : 'N/A'}</p>
            </div>
            
            <div className="mt-4">
                <p className="text-xs font-medium text-slate-500 mb-1">Progreso</p>
                <ProgressBar value={task.progress_percent ?? 0} />
            </div>
          </div>
        ))}
        {(!tasks || tasks.length === 0) && (
            <div className="text-center py-12">
                <p className="text-slate-500">No hay tareas para mostrar.</p>
            </div>
        )}
      </div>
    </div>
  );
}
// src/components/dashboard/RecentTasks.tsx
import Link from 'next/link';
import Image from 'next/image';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { LuImageOff } from 'react-icons/lu';

// Tipos de datos
type Profile = { full_name: string | null; };
type Task = {
  id: string | number;
  title: string | null;
  status: string | null;
  progress_percent: number | null;
  progress_image_url: string | null;
  assignee: Profile | null;
};

const statusColors: { [key: string]: string } = {
  'Completada': 'bg-emerald-100 text-emerald-700',
  'En Progreso': 'bg-blue-100 text-blue-700',
  'Pendiente': 'bg-amber-100 text-amber-700',
};

const RecentTaskItem = ({ task }: { task: Task }) => {
  const progress = task.progress_percent ?? 0;

  return (
    <Link href={`/tasks/${task.id}/edit`} className="block hover:bg-slate-50 p-3.5 -mx-3.5 rounded-lg transition-colors">
      <li className="flex flex-col">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="flex-shrink-0 h-10 w-10 rounded-md bg-slate-200 flex items-center justify-center overflow-hidden">
              {task.progress_image_url ? (
                <Image src={task.progress_image_url} alt={`Imagen de ${task.title ?? 'tarea'}`} width={40} height={40} className="object-cover h-full w-full" />
              ) : (
                <LuImageOff className="h-5 w-5 text-slate-400" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-slate-800 truncate">{task.title ?? 'Tarea sin título'}</p>
              <p className="text-xs text-slate-500">Asignado a: {task.assignee?.full_name ?? 'Nadie'}</p>
            </div>
          </div>
          <span className={`flex-shrink-0 px-2.5 py-1 text-xs font-medium rounded-full ${statusColors[task.status ?? ''] || 'bg-slate-100 text-slate-600'}`}>
            {task.status ?? 'Sin estado'}
          </span>
        </div>
        
        {/* --- ¡LA LÓGICA CORREGIDA! --- */}
        {/* Mostramos la barra si la tarea no está 'Pendiente' */}
        {task.status !== 'Pendiente' && (
          <div className="mt-2.5 pl-13">
            <ProgressBar value={progress} />
          </div>
        )}
      </li>
    </Link>
  );
};

export const RecentTasks = ({ tasks }: { tasks: Task[] }) => {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200/80 h-full flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-slate-800">Tareas Recientes</h2>
        <Link href="/tasks" className="text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors">
          Ver todas
        </Link>
      </div>
      
      {tasks && tasks.length > 0 ? (
        <ul className="divide-y divide-slate-200/80">
          {tasks.map((task) => (
            <RecentTaskItem key={task.id} task={task} />
          ))}
        </ul>
      ) : (
        <div className="flex-grow flex flex-col items-center justify-center text-center">
            <p className="text-sm font-medium text-slate-600">Todo en orden</p>
            <p className="text-sm text-slate-500 mt-1">No hay tareas recientes para mostrar.</p>
        </div>
      )}
    </div>
  );
};
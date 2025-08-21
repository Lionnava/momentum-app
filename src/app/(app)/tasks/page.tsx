// src/app/(app)/tasks/page.tsx

// --- INICIO DE LA CORRECCIÓN ---
import { createClient } from '@/utils/supabase/server';
// --- FIN DE LA CORRECCIÓN ---

import Link from 'next/link';
import { LuPencil } from 'react-icons/lu';
import { DeleteTaskButton } from './_components/DeleteTaskButton';

type TaskWithDetails = {
  id: string;
  title: string;
  status: string;
  due_date: string;
  requires_approval: boolean;
  progress_percent: number;
  profiles: { full_name: string | null; } | null;
  divisions: { name: string | null; } | null;
};

function TaskCard({ task, userRole }: { task: TaskWithDetails; userRole: string }) {
    const assigneeName = task.profiles?.full_name || 'No asignado';
    const divisionName = task.divisions?.name || 'Sin división';
    const dueDate = new Date(task.due_date).toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' });
    const statusStyles: { [key: string]: { text: string; bg: string; border: string; } } = {
        'Pendiente': { text: 'text-gray-800', bg: 'bg-gray-100', border: 'border-gray-300' },
        'En Progreso': { text: 'text-blue-800', bg: 'bg-blue-100', border: 'border-blue-300' },
        'En Revisión': { text: 'text-yellow-800', bg: 'bg-yellow-100', border: 'border-yellow-300' },
        'Completada': { text: 'text-purple-800', bg: 'bg-purple-100', border: 'border-purple-300' },
        'Aprobada': { text: 'text-green-800', bg: 'bg-green-100', border: 'border-green-300' },
    };
    const currentStatusStyle = statusStyles[task.status] || statusStyles['Pendiente'];

    return (
        <div className="bg-white p-5 rounded-lg shadow-sm border mb-4">
            <div className="flex justify-between items-start">
                <h3 className="text-lg font-semibold text-gray-800">{task.title}</h3>
                <span className={`px-2 py-1 text-xs font-bold rounded-full border ${currentStatusStyle.bg} ${currentStatusStyle.text} ${currentStatusStyle.border}`}>
                    {task.status}
                </span>
            </div>
            <div className="mt-4 text-sm text-gray-600 space-y-2">
                <p><strong>División:</strong> {divisionName}</p>
                <p><strong>Asignado a:</strong> {assigneeName}</p>
                <p><strong>Fecha Límite:</strong> {dueDate}</p>
            </div>
            <div className="mt-4">
                <div className="flex justify-between mb-1">
                    <span className="text-xs font-medium text-gray-500">Progreso</span>
                    <span className="text-sm font-bold text-blue-600">{task.progress_percent}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${task.progress_percent}%` }}></div>
                </div>
            </div>
            <div className="mt-4 pt-4 border-t flex items-center justify-end gap-2">
                 {/* Aquí iría la lógica de botones condicionales si la añades */}
                <Link href={`/tasks/${task.id}/edit`} className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-full">
                    <LuPencil className="h-5 w-5" />
                </Link>
                <DeleteTaskButton taskId={task.id} />
            </div>
        </div>
    );
}

export default async function TasksPage() {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    const { data: profile } = await supabase.from('profiles').select('rol').eq('id', user.id).single();
    const userRole = profile?.rol ?? 'employee';

    const { data: tasks, error } = await supabase
        .from('tasks')
        .select(`*, profiles(full_name), divisions(name)`)
        .order('due_date', { ascending: true });

    if (error) {
        console.error("Error al obtener tareas:", error.message);
        return <p className="p-8 text-red-500">Error al cargar las tareas: {error.message}</p>;
    }

    return (
        <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800">
                        {userRole === 'employee' ? 'Mis Tareas' : 'Todas las Tareas'}
                    </h1>
                    <p className="mt-1 text-gray-600">
                        {userRole === 'employee' ? 'Aquí se listan todas las tareas que tienes asignadas.' : 'Vista de administrador de todas las tareas del sistema.'}
                    </p>
                </div>
                <Link href="/tasks/new" className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md shadow-sm hover:bg-blue-700">
                    Nueva Tarea
                </Link>
            </div>
            {tasks && tasks.length > 0 ? (
                <div>
                    {tasks.map(task => (<TaskCard key={task.id} task={task as TaskWithDetails} userRole={userRole} />))}
                </div>
            ) : (
                <div className="text-center py-16 px-6 bg-white rounded-lg border-2 border-dashed">
                    <h3 className="text-lg font-medium text-gray-800">No hay tareas para mostrar</h3>
                    <p className="mt-1 text-gray-500">Intenta crear una nueva tarea o ajusta los filtros.</p>
                </div>
            )}
        </div>
    );
}
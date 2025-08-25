import createClient from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import PrintButton from './_components/PrintButton';
import Image from 'next/image'; // Importamos el componente Image

// --- INICIO DE LA CORRECCIÓN ---
// En lugar de 'Tables', importamos los tipos que SÍ existen.
import { Task, User, Division } from '@/lib/types'; 
// --- FIN DE LA CORRECCIÓN ---

// Definimos un tipo más completo para nuestras tareas de reporte
// que coincide con la estructura de la consulta a Supabase.
type ReportTask = Task & {
  assignee: User | null;
  division: Division | null;
};

export default async function ReportsPage() {
  const supabase = createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return redirect('/auth/login');
  }

  // Obtenemos todas las tareas con sus relaciones expandidas
  const { data: tasks, error } = await supabase
    .from('tasks')
    .select('*, assignee:profiles(*), division:divisions(*)');

  if (error) {
    console.error('Error fetching tasks for report:', error);
    return <p className="text-red-500">Error al cargar las tareas.</p>;
  }

  // Le decimos a TypeScript que el resultado es un array de nuestro nuevo tipo.
  const reportTasks: ReportTask[] = tasks as any;

  return (
    <div className="max-w-4xl mx-auto p-8 bg-white" id="report-content">
      <header className="flex justify-between items-center border-b pb-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Reporte de Tareas</h1>
          <p className="text-gray-500">Generado el: {new Date().toLocaleDateString()}</p>
        </div>
        <div className="w-24 h-auto">
           {/* Asegúrate de tener una imagen de logo en public/logo.png */}
           <Image src="/logo.png" alt="Logo de la Empresa" width={100} height={40} />
        </div>
      </header>
      
      <main>
        {reportTasks.map((task) => (
          <div key={task.id} className="mb-6 p-4 border rounded-lg break-inside-avoid">
            <h2 className="text-xl font-semibold text-gray-700">{task.name}</h2>
            <div className="grid grid-cols-2 gap-4 mt-2 text-sm">
              <p><strong>Estado:</strong> {task.status}</p>
              <p><strong>Fecha Límite:</strong> {new Date(task.due_date || '').toLocaleDateString()}</p>
              <p><strong>Asignado a:</strong> {task.assignee?.name || 'No asignado'}</p>
              <p><strong>División:</strong> {task.division?.name || 'Sin división'}</p>
            </div>
          </div>
        ))}
      </main>

      <footer className="mt-8 pt-4 border-t text-center text-xs text-gray-400">
        <p>Momentum App - Reporte Interno</p>
      </footer>
      
      <PrintButton />
    </div>
  );
}
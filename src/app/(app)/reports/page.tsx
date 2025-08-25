import { createServerClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import PrintButton from './_components/PrintButton';
import type { Tables } from '@/lib/types';
import Image from 'next/image'; // Importamos el componente Image

// Definimos un tipo más completo para nuestras tareas de reporte
type ReportTask = Tables<'tasks'> & {
  divisions: Pick<Tables<'divisions'>, 'name'> | null;
  assignee: Pick<Tables<'profiles'>, 'full_name'> | null;
  milestones: { image_url: string | null }[]; // Incluimos los hitos
};

async function getReportData(userId: string, role: string, divisionId: string | null): Promise<ReportTask[]> {
  const supabase = createServerClient();
  // --- CONSULTA ACTUALIZADA ---
  // Ahora también pedimos 'progress_percent' y los 'milestones'
  let query = supabase.from('tasks').select('*, divisions(name), assignee:profiles(full_name), milestones(image_url)');

  if (role === 'manager' && divisionId) {
      query = query.eq('division_id', divisionId);
  } else if (role === 'employee') {
      query = query.eq('assignee_id', userId);
  }
  
  const { data, error } = await query.order('created_at', { ascending: false });
  if (error) {
    console.error("Error fetching report data:", error);
    return [];
  }
  return data || [];
}

export default async function ReportsPage() {
  const supabase = createServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');
  
  const { data: profile } = await supabase.from('profiles').select('rol, division_id').eq('id', user.id).single();
  if (!profile) redirect('/login');

  const tasks = await getReportData(user.id, profile.rol, profile.division_id);

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="flex justify-between items-center mb-6 no-print">
        <div>
          <h1 className="text-3xl font-bold">Reporte de Tareas</h1>
          <p className="text-gray-500">Un resumen de todas las tareas relevantes para tu rol.</p>
        </div>
        <PrintButton />
      </div>
      
      {/* --- INICIO DE LA CORRECCIÓN: ÁREA DE IMPRESIÓN MEJORADA --- */}
      <div className="bg-white p-6 rounded-lg shadow-sm printable-area">
        {/* Membrete para impresión */}
        <div className="print-header hidden print:block mb-8 text-center">
          <Image src="/logo.png" alt="Logo" width={80} height={80} className="mx-auto" />
          <h1 className="text-xl font-bold mt-2">SECRETARÍA DE EDUCACIÓN SUPERIOR</h1>
          <p className="text-sm">GOBERNACIÓN BOLIVARIANA DEL ZULIA</p>
          <hr className="my-4" />
        </div>
        
        <div className="flex justify-between items-baseline mb-4">
            <h2 className="text-xl font-semibold">Reporte Generado</h2>
            <p className="text-sm text-gray-500">Fecha: {new Date().toLocaleDateString('es-ES')}</p>
        </div>
        
        <table className="w-full text-sm text-left text-gray-500">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50">
            <tr>
              <th scope="col" className="px-4 py-3">Respaldo</th>
              <th scope="col" className="px-6 py-3">Título</th>
              <th scope="col" className="px-6 py-3">División</th>
              <th scope="col" className="px-6 py-3">Asignado a</th>
              <th scope="col" className="px-6 py-3">Estado</th>
              <th scope="col" className="px-6 py-3">% Avance</th>
              <th scope="col" className="px-6 py-3">Fecha Venc.</th>
            </tr>
          </thead>
          <tbody>
            {tasks.map((task) => {
                const latestMilestoneWithImage = task.milestones && [...task.milestones].reverse().find(m => m.image_url);
                return (
                    <tr key={task.id} className="bg-white border-b">
                        <td className="p-2">
                            {latestMilestoneWithImage ? (
                                <Image src={latestMilestoneWithImage.image_url!} alt="Respaldo" width={60} height={60} className="rounded object-cover"/>
                            ) : (
                                <span className="text-xs text-gray-400">N/A</span>
                            )}
                        </td>
                        <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">{task.title}</th>
                        <td className="px-6 py-4">{task.divisions?.name || 'N/A'}</td>
                        <td className="px-6 py-4">{task.assignee?.full_name || 'Sin Asignar'}</td>
                        <td className="px-6 py-4">{task.status}</td>
                        <td className="px-6 py-4 font-medium">{task.progress_percent}%</td>
                        <td className="px-6 py-4">{task.due_date ? new Date(task.due_date).toLocaleDateString('es-ES') : 'N/A'}</td>
                    </tr>
                )
            })}
          </tbody>
        </table>
        {tasks.length === 0 && <p className="text-center p-8">No hay tareas para mostrar en este reporte.</p>}
      </div>
       {/* --- FIN DE LA CORRECCIÓN --- */}
    </div>
  );
}
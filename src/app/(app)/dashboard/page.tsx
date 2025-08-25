import { createServerClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { LuCheck, LuLoader, LuTriangleAlert, LuClipboardList, LuEye, LuPaperclip, LuBuilding2, LuUser, LuCalendar } from 'react-icons/lu';
import StatusPieChart from '@/components/dashboard/StatusPieChart';
import DivisionBarChart from '@/components/dashboard/DivisionBarChart';
import Image from 'next/image';

// --- DEFINICIÓN DE TIPOS ---
interface RecentTask {
  title: string | null;
  status: string | null;
  due_date: string | null;
  progress_percent: number | null;
  divisions: { name: string | null } | null;
  assignee: { full_name: string | null } | null;
  milestones: { image_url: string | null }[];
}

// --- COMPONENTES DE UI INTERNOS ---
const StatCard = ({ title, value, icon: Icon, color }: { title: string; value: number | string; icon: React.ElementType; color: string }) => (
    <div className="bg-white p-4 rounded-lg shadow-sm flex items-center justify-between">
        <div>
            <p className="text-xs font-medium text-gray-500 uppercase">{title}</p>
            <p className="text-2xl font-bold text-gray-900">{value}</p>
        </div>
        <div className={`p-3 rounded-full ${color}`}>
            <Icon className="h-6 w-6 text-white" />
        </div>
    </div>
);

const RecentTaskItem = ({ task }: { task: RecentTask }) => {
    const formatDate = (dateString: string | null) => {
        if (!dateString) return 'Sin fecha';
        const date = new Date(dateString);
        date.setUTCDate(date.getUTCDate() + 1);
        return date.toLocaleDateString('es-ES', { year: 'numeric', month: 'short', day: 'numeric' });
    };
    const latestMilestoneWithImage = task.milestones && [...task.milestones].reverse().find(m => m.image_url);
    return (
        <div className="flex items-start justify-between py-4 gap-4">
            {latestMilestoneWithImage ? (
                <Image src={latestMilestoneWithImage.image_url!} alt="Hito de tarea" width={80} height={80} className="rounded-md object-cover w-20 h-20" />
            ) : (
                <div className="w-20 h-20 bg-gray-100 rounded-md flex items-center justify-center">
                    <LuPaperclip className="h-8 w-8 text-gray-400" />
                </div>
            )}
            <div className="flex-1">
                <p className="text-sm font-semibold text-gray-800">{task.title}</p>
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1 text-xs text-gray-500">
                    <span className="flex items-center gap-1.5"><LuBuilding2 />{task.divisions?.name || 'N/A'}</span>
                    <span className="flex items-center gap-1.5"><LuUser />{task.assignee?.full_name || 'Sin Asignar'}</span>
                    <span className="flex items-center gap-1.5"><LuCalendar />{formatDate(task.due_date)}</span>
                </div>
                 <div className="w-full h-2 bg-gray-200 rounded-full mt-2">
                    <div className="h-2 bg-blue-500 rounded-full" style={{ width: `${task.progress_percent || 0}%` }}></div>
                </div>
            </div>
        </div>
    );
};

// --- PÁGINA PRINCIPAL DEL DASHBOARD ---
export default async function DashboardPage() {
    const supabase = createServerClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { redirect('/login'); }
        
    const { data: profile } = await supabase.from('profiles').select('full_name, rol, division_id').eq('id', user.id).single();
    if (!profile) { await supabase.auth.signOut(); redirect('/login?message=Perfil no encontrado'); }

    try {
        const userRole = profile.rol.replace(/::text/g, '').toLowerCase().trim();
        let baseFilter = {};

        if (userRole === 'manager' && profile.division_id) {
            baseFilter = { column: 'division_id', value: profile.division_id };
        } else if (userRole === 'employee') {
            baseFilter = { column: 'assignee_id', value: user.id };
        }

        // --- CONSULTAS SECUENCIALES Y SEGURAS ---
        
        // Consulta para todas las tareas (se usará para los gráficos)
        let allTasksQuery = supabase.from('tasks').select('status, divisions(name)');
        if (baseFilter.column) allTasksQuery = allTasksQuery.eq(baseFilter.column, baseFilter.value);
        const { data: tasksForCharts, error: tasksForChartsError } = await allTasksQuery;
        if (tasksForChartsError) throw tasksForChartsError;
        
        const tasks = tasksForCharts || [];

        // Consultas para las estadísticas (counts)
        const getCount = async (status?: string) => {
            let query = supabase.from('tasks').select('*', { count: 'exact', head: true });
            if (baseFilter.column) query = query.eq(baseFilter.column, baseFilter.value);
            if (status) query = query.eq('status', status);
            const { count, error } = await query;
            if (error) throw error;
            return count ?? 0;
        };

        const totalTasks = await getCount();
        const completedTasks = await getCount('Completada');
        const inProgressTasks = await getCount('En Progreso');
        const pendingTasks = await getCount('Pendiente');
        const inReviewTasks = await getCount('En Revisión');

        // Consulta para Tareas Recientes
        let recentTasksQuery = supabase.from('tasks').select('*, divisions(name), assignee:profiles(full_name), milestones(image_url)');
        if (baseFilter.column) recentTasksQuery = recentTasksQuery.eq(baseFilter.column, baseFilter.value);
        const { data: recentTasks, error: recentTasksError } = await recentTasksQuery.order('created_at', { ascending: false }).limit(5);
        if (recentTasksError) throw recentTasksError;
        
        // Procesamiento de datos para los gráficos
        const statusDistribution = tasks.reduce((acc, task) => { acc[task.status] = (acc[task.status] || 0) + 1; return acc; }, {} as Record<string, number>);
        const pieChartData = Object.entries(statusDistribution).map(([name, value]) => ({ name, value }));
        
        const divisionDistribution = tasks.reduce((acc, task) => { const divisionName = task.divisions?.name || 'Sin División'; acc[divisionName] = (acc[divisionName] || 0) + 1; return acc; }, {} as Record<string, number>);
        const barChartData = Object.entries(divisionDistribution).map(([name, value]) => ({ name, "Nº de Tareas": value }));

        return (
            <div className="p-6 space-y-6">
                <div><h1 className="text-3xl font-bold">Dashboard</h1><p className="text-gray-600">Bienvenido, {profile.full_name}. Aquí tienes un resumen de la actividad.</p></div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4"><StatCard title="Total de Tareas" value={totalTasks} icon={LuClipboardList} color="bg-gray-500" /><StatCard title="Pendientes" value={pendingTasks} icon={LuTriangleAlert} color="bg-amber-500" /><StatCard title="En Progreso" value={inProgressTasks} icon={LuLoader} color="bg-blue-500" /><StatCard title="En Revisión" value={inReviewTasks} icon={LuEye} color="bg-violet-500" /><StatCard title="Completadas" value={completedTasks} icon={LuCheck} color="bg-emerald-500" /></div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6"><div className="bg-white p-4 rounded-lg shadow-sm"><h3 className="font-semibold mb-2">Distribución por Estado</h3><StatusPieChart data={pieChartData} /></div><div className="bg-white p-4 rounded-lg shadow-sm"><h3 className="font-semibold mb-2">Tareas por División</h3><DivisionBarChart data={barChartData} /></div></div>
                <div className="bg-white p-6 rounded-lg shadow-sm"><h3 className="font-semibold mb-2">Tareas Recientes</h3><div className="space-y-2 divide-y divide-gray-100">{recentTasks && recentTasks.length > 0 ? (recentTasks.map((task, i) => <RecentTaskItem key={i} task={task as any} />)) : (<p className="text-center text-gray-500 py-4">No hay tareas recientes para mostrar.</p>)}</div><div className="text-center mt-4"><Link href="/tasks" className="text-sm font-medium text-blue-600 hover:underline">Ver todas las tareas</Link></div></div>
            </div>
        );

    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Ocurrió un error desconocido.';
        console.error("Error al renderizar el Dashboard:", errorMessage);
        return (
            <div className="p-8 text-center"><h2 className="text-xl font-bold text-red-600">Error al Cargar el Dashboard</h2><p className="text-gray-600 mt-2">No se pudieron obtener los datos. Por favor, revisa la consola del servidor.</p><p className="text-xs text-red-400 mt-4"><code>{errorMessage}</code></p></div>
        );
    }
}
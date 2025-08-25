import { createServerClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import DeleteTaskButton from './_components/DeleteTaskButton';
import AssignTaskForm from './_components/AssignTaskForm';
import { LuPenLine, LuCircleCheck, LuPlus } from 'react-icons/lu';
import { revalidatePath } from 'next/cache';
import type { Tables } from '@/lib/types';

// Tipos, StatusBadge... (código completo)

// ...

export default async function TasksPage() {
    const supabase = createServerClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { redirect('/login'); }

    const { data: profile } = await supabase.from('profiles').select('rol, division_id').eq('id', user.id).single();
    if (!profile) { redirect('/login'); }
    
    const userRole = profile.rol.replace(/::text/g, '').toLowerCase().trim();
    const isManager = userRole === 'manager' || userRole === 'supermanager';

    // 1. Obtener tareas asignadas al usuario actual
    const { data: myTasksData } = await supabase.from('tasks').select('*, divisions(name)').eq('assignee_id', user.id).order('created_at', { ascending: false });
    const myTasks: any[] = myTasksData || [];

    // 2. Lógica solo para managers
    let proposals: any[] = [];
    let unassignedTasks: any[] = [];
    let employees: any[] = [];

    if (isManager) {
        // Obtener propuestas pendientes
        const { data: proposalsData } = await supabase.from('proposals').select('*, proponent:profiles(full_name), divisions(name)').eq('status', 'Pendiente');
        proposals = proposalsData || [];

        // Obtener tareas sin asignar
        let unassignedQuery = supabase.from('tasks').select('*, divisions(name)').is('assignee_id', null);
        if (userRole === 'manager' && profile.division_id) { unassignedQuery = unassignedQuery.eq('division_id', profile.division_id); }
        const { data: unassignedTasksData } = await unassignedQuery;
        unassignedTasks = unassignedTasksData || [];

        // Obtener empleados para asignar
        let employeesQuery = supabase.from('profiles').select('id, full_name').eq('rol', 'employee');
        if (userRole === 'manager' && profile.division_id) { employeesQuery = employeesQuery.eq('division_id', profile.division_id); }
        const { data: employeesData } = await employeesQuery;
        employees = employeesData || [];
    }

    return (
        <div className="container mx-auto px-4 py-8 space-y-12">
            <div className="flex justify-between items-center">
              <h1 className="text-3xl font-bold text-gray-900">Gestión de Tareas</h1>
              {isManager && (
                <Link href="/tasks/new" className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white font-semibold rounded-md hover:bg-indigo-700">
                  <LuPlus className="h-5 w-5" />
                  Crear Tarea Directa
                </Link>
              )}
            </div>
            
            {/* ... JSX para Propuestas, Tareas Sin Asignar y Mis Tareas ... */}
        </div>
    );
}
// src/app/(app)/tasks/new/page.tsx
import { NewTaskForm } from './_components/NewTaskForm';
import { createClient } from '@/utils/supabase/server';

export default async function NewTaskPage() {
    const supabase = createClient();

    // Obtenemos los perfiles para el selector "Asignar a"
    const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('id, full_name')
        .order('full_name', { ascending: true });

    // --- INICIO DE LA MODIFICACIÓN ---
    // Obtenemos las divisiones para el nuevo selector
    const { data: divisions, error: divisionsError } = await supabase
        .from('divisions')
        .select('id, name')
        .order('name', { ascending: true });
    // --- FIN DE LA MODIFICACIÓN ---

    if (profilesError || divisionsError) {
        console.error('Error fetching data for task form:', profilesError || divisionsError);
        return <p className="p-8 text-red-500">No se pudieron cargar los datos necesarios para el formulario.</p>;
    }

    return (
        <div className="max-w-2xl mx-auto p-4 sm:p-6 lg:p-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-800">Crear Nueva Tarea</h1>
                <p className="mt-1 text-gray-600">Completa los detalles de la nueva tarea.</p>
            </div>
            
            <div className="bg-white p-8 rounded-lg shadow-md border">
                {/* Pasamos ambos listados al formulario */}
                <NewTaskForm profiles={profiles ?? []} divisions={divisions ?? []} />
            </div>
        </div>
    );
}
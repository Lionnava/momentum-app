// src/app/(app)/tasks/new/page.tsx
import { createClient } from '@/utils/supabase/server';
import { NewTaskForm } from './_components/NewTaskForm';

export default async function NewTaskPage() {
  const supabase = createClient();
  const { data: users, error } = await supabase
    .from('profiles')
    .select('id, full_name')
    .order('full_name', { ascending: true });

  if (error) {
    console.error('Error al obtener usuarios para el formulario de tareas:', error);
    // Si hay un error, el formulario no tendrá usuarios para mostrar,
    // pero al menos no fallará la aplicación.
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Crear Nueva Tarea</h1>
          <p className="mt-1 text-slate-600">
            Rellena los detalles para crear una nueva tarea en el sistema.
          </p>
        </div>
        
        <div className="bg-white p-8 border border-slate-200 rounded-lg shadow-sm">
          {/* CORRECCIÓN: Nos aseguramos de que 'users' sea siempre un array. 
              Si 'users' es null o undefined, se convierte en un array vacío []. */}
          <NewTaskForm users={users || []} />
        </div>
      </div>
    </div>
  );
}
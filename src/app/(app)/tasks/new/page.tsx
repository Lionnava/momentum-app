import { createServerClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import NewTaskForm from './_components/NewTaskForm';
import type { Tables } from '@/lib/types';

type Division = Pick<Tables<'divisions'>, 'id' | 'name'>;

async function getDataForNewTaskPage(): Promise<{ divisions: Division[] }> {
  const supabase = createServerClient();
  
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    redirect('/login');
  }

  const { data: profile } = await supabase.from('profiles').select('rol').eq('id', user.id).single();
  
  const userRole = profile?.rol.replace(/::text/g, '').toLowerCase();
  
  if (userRole !== 'manager' && userRole !== 'supermanager') {
    redirect('/tasks?error=unauthorized_creation');
  }
  
  const { data: divisions } = await supabase.from('divisions').select('id, name');
  
  return { divisions: divisions || [] };
}

export default async function NewTaskPage() {
  const { divisions } = await getDataForNewTaskPage();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Crear Nueva Tarea Directamente</h1>
        <div className="text-sm text-amber-800 bg-amber-100 border-l-4 border-amber-500 p-4 rounded-md mb-6" role="alert">
          <p className="font-bold">Atención</p>
          <p>Estás creando una tarea directamente. Esta acción está reservada para roles de gestión.</p>
        </div>
        <div className="bg-white p-8 rounded-xl shadow-md border border-gray-200">
          <NewTaskForm divisions={divisions} />
        </div>
      </div>
    </div>
  );
}
'use server';

import { createServerClient } from '@/utils/supabase/server';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

// Estado para la respuesta del formulario.
export type FormState = {
  message: string;
  success: boolean;
};

export async function createTask(prevState: FormState, formData: FormData): Promise<FormState> {
  const supabase = createServerClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return { message: 'Error de autenticación.', success: false };
  }

  // Extraer datos del formulario
  const title = formData.get('title') as string;
  const description = formData.get('description') as string;
  const due_date = formData.get('due_date') as string;
  const division_id = formData.get('division_id') as string;

  // Validación básica
  if (!title || !division_id) {
    return { message: 'El título y la división son obligatorios.', success: false };
  }

  // Crear el objeto para insertar en la base de datos
  const { error } = await supabase.from('tasks').insert({
    title,
    description,
    due_date: due_date || null,
    division_id,
    assignee_id: user.id, // Asignar la tarea al usuario que la crea
    status: 'Pendiente', // Estado por defecto
  });

  if (error) {
    console.error('Error al crear la tarea:', error);
    return { message: 'Error en la base de datos: no se pudo crear la tarea.', success: false };
  }

  // Limpiar la caché de la página de tareas para que aparezca la nueva
  revalidatePath('/tasks');
  
  // Redirigir al usuario de vuelta a la lista de tareas
  redirect('/tasks');
}
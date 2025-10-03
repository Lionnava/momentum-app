// src/app/actions.ts
'use server';

import { createClient } from '@/utils/supabase/server';
import { revalidatePath } from 'next/cache';
import { createClient as createAdminClient } from '@supabase/supabase-js';
import { redirect } from 'next/navigation';
import { z } from 'zod';
import { headers } from 'next/headers';

// =================================================================
// FUNCIONES DE AUTENTICACIÓN
// =================================================================
export interface AuthFormState {
  error?: string | null;
  message?: string | null;
}

export async function login(prevState: AuthFormState, formData: FormData): Promise<AuthFormState> {
  const supabase = createClient();
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  if (!email || !password) {
    return { error: 'El correo y la contraseña son obligatorios.' };
  }

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    console.error("Login error:", error);
    return { error: 'Las credenciales no son válidas.' };
  }

  revalidatePath('/', 'layout');
  redirect('/dashboard');
}

export async function signup(prevState: AuthFormState, formData: FormData): Promise<AuthFormState> {
  const origin = headers().get('origin');
  const supabase = createClient();
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  
  if (!email || !password) {
    return { error: 'El correo y la contraseña son obligatorios.' };
  }
  if (password.length < 6) {
    return { error: 'La contraseña debe tener al menos 6 caracteres.' };
  }

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${origin}/auth/callback`,
    },
  });

  if (error) {
    console.error("Signup error:", error);
    return { error: 'No se pudo registrar al usuario. Es posible que el correo ya esté en uso.' };
  }

  return { message: 'Revisa tu correo para verificar tu cuenta.' };
}

// =================================================================
// FUNCIONES DEL CHAT
// =================================================================
export async function startChat(participantId: string): Promise<{ roomId: string; error?: string }> {
  try {
    const supabase = createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) { return { roomId: '', error: 'No autenticado' }; }
    if (!participantId) { return { roomId: '', error: 'ID de participante requerido' }; }
    const { data: userRooms, error: roomsError } = await supabase.from('chat_participants').select('room_id').eq('user_id', user.id);
    if (roomsError) { console.error('Error fetching user rooms:', roomsError); return { roomId: '', error: 'Error al buscar conversaciones' }; }
    const userRoomIds = userRooms?.map(r => r.room_id) || [];
    if (userRoomIds.length > 0) {
      const { data: existingRoom, error: checkError } = await supabase.from('chat_participants').select('room_id').eq('user_id', participantId).in('room_id', userRoomIds).limit(1).single();
      if (!checkError && existingRoom) {
        const { data: roomInfo } = await supabase.from('chat_rooms').select('room_type').eq('id', existingRoom.room_id).single();
        if (roomInfo?.room_type === 'dm') { return { roomId: existingRoom.room_id }; }
      }
    }
    const { data: newRoom, error: createError } = await supabase.from('chat_rooms').insert({ room_type: 'dm', name: null, created_by: user.id }).select('id').single();
    if (createError) { console.error('Error creating room:', createError); return { roomId: '', error: 'Error al crear conversación' }; }
    const { error: participantsError } = await supabase.from('chat_participants').insert([{ room_id: newRoom.id, user_id: user.id }, { room_id: newRoom.id, user_id: participantId }]);
    if (participantsError) { await supabase.from('chat_rooms').delete().eq('id', newRoom.id); return { roomId: '', error: 'Error al agregar participantes' }; }
    revalidatePath('/chat');
    return { roomId: newRoom.id };
  } catch (error: unknown) { console.error('Unexpected error in startChat:', error); return { roomId: '', error: error.message || 'Error inesperado' }; }
}

export async function sendMessage(roomId: string, formData: FormData) {
  const supabase = createClient();
  const content = formData.get('content') as string;
  if (!content || content.trim() === '') { return { error: 'El mensaje no puede estar vacío.' }; }
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) { return { error: 'Usuario no autenticado.' }; }
  const { error } = await supabase.from('messages').insert({ room_id: roomId, user_id: user.id, content: content.trim() });
  if (error) { console.error('Error sending message:', error); return { error: 'Error al enviar el mensaje.' }; }
  revalidatePath(`/chat/${roomId}`);
  return { success: true };
}

export async function deleteConversation(roomId: string) {
    const supabase = createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) { return { error: 'No autenticado.' }; }
    const { count, error: participantError } = await supabase.from('chat_participants').select('*', { count: 'exact', head: true }).eq('room_id', roomId).eq('user_id', user.id);
    if (participantError || count === 0) { return { error: 'No autorizado para eliminar esta conversación.' }; }
    const { error: deleteMessagesError } = await supabase.from('messages').delete().eq('room_id', roomId);
    if (deleteMessagesError) { console.error("Error deleting messages:", deleteMessagesError); return { error: 'Error al eliminar los mensajes.' }; }
    const { error: deleteParticipantsError } = await supabase.from('chat_participants').delete().eq('room_id', roomId);
    if (deleteParticipantsError) { console.error("Error deleting participants:", deleteParticipantsError); return { error: 'Error al eliminar participantes.' }; }
    const { error: deleteRoomError } = await supabase.from('chat_rooms').delete().eq('id', roomId);
    if (deleteRoomError) { console.error("Error deleting room:", deleteRoomError); return { error: 'Error al eliminar la sala.' }; }
    revalidatePath('/chat');
    redirect('/chat');
}

// =================================================================
// FUNCIÓN PARA INVITAR USUARIOS
// =================================================================
interface InviteUserFormState { success: boolean; message: string; }
export async function inviteUser(prevState: InviteUserFormState, formData: FormData): Promise<InviteUserFormState> {
  const email = formData.get('email') as string;
  const role = formData.get('role') as string;
  if (!email || !role) { return { success: false, message: 'El correo y el rol son obligatorios.' }; }
  try {
    const supabaseAdmin = createAdminClient( process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY! );
    const { error } = await supabaseAdmin.auth.admin.inviteUserByEmail(email, { data: { role: role }, redirectTo: `${process.env.NEXT_PUBLIC_BASE_URL}/auth/confirm` });
    if (error) { console.error('Error al invitar usuario:', error.message); return { success: false, message: `Error: ${error.message}` }; }
    revalidatePath('/admin/users');
    return { success: true, message: `Invitación enviada correctamente a ${email}.` };
  } catch (e: unknown) { console.error('Error inesperado al invitar:', e); return { success: false, message: 'Ocurrió un error inesperado en el servidor.' }; }
}

// =================================================================
// FUNCIONES PARA GESTIÓN DE TAREAS Y HITOS
// =================================================================
export interface CreateTaskState {
  errors?: { title?: string[]; description?: string[]; assignee_id?: string[]; due_date?: string[]; };
  message?: string | null;
}
const CreateTaskSchema = z.object({
  title: z.string().min(3, { message: 'El título debe tener al menos 3 caracteres.' }),
  description: z.string().optional(),
  assignee_id: z.string().uuid({ message: 'Por favor, selecciona un usuario válido.' }),
  due_date: z.string().refine((date) => !isNaN(Date.parse(date)), { message: 'Fecha no válida.' }),
});
export async function createTaskAction(prevState: CreateTaskState, formData: FormData): Promise<CreateTaskState> {
  const validatedFields = CreateTaskSchema.safeParse(Object.fromEntries(formData.entries()));
  if (!validatedFields.success) {
    return { errors: validatedFields.error.flatten().fieldErrors, message: 'Faltan campos. No se pudo crear la tarea.' };
  }
  const { title, description, assignee_id, due_date } = validatedFields.data;
  const supabase = createClient();
  const { error } = await supabase.from('tasks').insert({ title, description, assignee_id, due_date, status: 'Pendiente' });
  if (error) { console.error('Error de base de datos:', error); return { message: 'Error de base de datos: No se pudo crear la tarea.' }; }
  revalidatePath('/tasks');
  redirect('/tasks');
}

const UpdateTaskSchema = z.object({
  title: z.string().min(3, 'El título es requerido.'),
  description: z.string().optional(),
  assignee_id: z.string().uuid('Debe seleccionar un asignado.'),
  status: z.enum(['Pendiente', 'En Progreso', 'Completada']),
});
export async function updateTask(taskId: string, formData: FormData) {
  const validatedFields = UpdateTaskSchema.safeParse(Object.fromEntries(formData.entries()));
  if (!validatedFields.success) { return { error: 'Datos inválidos.' }; }
  const supabase = createClient();
  const { error } = await supabase.from('tasks').update(validatedFields.data).eq('id', taskId);
  if (error) { return { error: 'Error al actualizar la tarea.' }; }
  revalidatePath(`/tasks/${taskId}/edit`);
  revalidatePath('/tasks');
  return { success: 'Tarea actualizada.' };
}

export async function deleteTask(taskId: string) {
  if (!taskId) { throw new Error('El ID de la tarea es requerido para eliminarla.'); }
  const supabase = createClient();
  const { error } = await supabase.from('tasks').delete().eq('id', taskId);
  if (error) { console.error('Error al eliminar la tarea:', error.message); throw new Error('No se pudo eliminar la tarea.'); }
  revalidatePath('/tasks');
}

export async function createMilestone(taskId: string, formData: FormData) {
  const description = formData.get('description') as string;
  if (!description || description.trim().length < 3) { return { error: 'La descripción es muy corta.' }; }
  const supabase = createClient();
  const { error } = await supabase.from('milestones').insert({ task_id: taskId, description: description.trim() });
  if (error) { return { error: 'No se pudo crear el hito.' }; }
  revalidatePath(`/tasks/${taskId}/edit`);
  return { success: 'Hito creado.' };
}

export async function toggleMilestoneCompletion(milestoneId: string, currentState: boolean, taskId: string) {
  const supabase = createClient();
  const { error } = await supabase.from('milestones').update({ is_completed: !currentState }).eq('id', milestoneId);
  if (error) { console.error(error); return; }
  revalidatePath(`/tasks/${taskId}/edit`);
}

export async function deleteMilestone(milestoneId: string, taskId: string) {
  const supabase = createClient();
  const { error } = await supabase.from('milestones').delete().eq('id', milestoneId);
  if (error) { console.error(error); return; }
  revalidatePath(`/tasks/${taskId}/edit`);
}

export async function addImageToMilestone(milestoneId: string, taskId: string, oldImageUrl: string | null, formData: FormData) {
    const file = formData.get('image') as File;
    if (!file || file.size === 0) { return { error: 'No se seleccionó ningún archivo.' }; }
    const supabase = createClient();
    if (oldImageUrl) {
        const oldFileName = oldImageUrl.split('/').pop();
        if (oldFileName) { await supabase.storage.from('milestone-images').remove([oldFileName]); }
    }
    const fileExt = file.name.split('.').pop();
    const fileName = `${milestoneId}-${Date.now()}.${fileExt}`;
    const { error: uploadError } = await supabase.storage.from('milestone-images').upload(fileName, file);
    if (uploadError) { return { error: 'Error al subir la imagen.' }; }
    const { data: { publicUrl } } = supabase.storage.from('milestone-images').getPublicUrl(fileName);
    const { error: updateError } = await supabase.from('milestones').update({ image_url: publicUrl }).eq('id', milestoneId);
    if (updateError) { return { error: 'Error al guardar la URL de la imagen.' }; }
    revalidatePath(`/tasks/${taskId}/edit`);
    return { success: 'Imagen actualizada.' };
}

export async function deleteMilestoneImage(milestoneId: string, taskId: string, imageUrl: string) {
    if (!imageUrl) { return { error: 'No hay imagen para eliminar.' }; }
    const supabase = createClient();
    const fileName = imageUrl.split('/').pop();
    if (!fileName) { return { error: 'URL de imagen no válida.' }; }
    const { error: storageError } = await supabase.storage.from('milestone-images').remove([fileName]);
    if (storageError) { console.error('Storage Error:', storageError); return { error: 'No se pudo eliminar el archivo de imagen.' }; }
    const { error: dbError } = await supabase.from('milestones').update({ image_url: null }).eq('id', milestoneId);
    if (dbError) { return { error: 'No se pudo actualizar la base de datos.' }; }
    revalidatePath(`/tasks/${taskId}/edit`);
    return { success: 'Imagen eliminada.' };
}

export async function updateTaskImage(taskId: string, oldImageUrl: string | null, formData: FormData) {
    const file = formData.get('image') as File;
    if (!file || file.size === 0) { return { error: 'No se seleccionó ningún archivo.' }; }
    const supabase = createClient();
    if (oldImageUrl) {
        const oldFileName = oldImageUrl.split('/').pop();
        if (oldFileName) { await supabase.storage.from('task-images').remove([oldFileName]); }
    }
    const fileExt = file.name.split('.').pop();
    const fileName = `task-${taskId}-${Date.now()}.${fileExt}`;
    const { error: uploadError } = await supabase.storage.from('task-images').upload(fileName, file);
    if (uploadError) { return { error: 'Error al subir la imagen.' }; }
    const { data: { publicUrl } } = supabase.storage.from('task-images').getPublicUrl(fileName);
    const { error: updateError } = await supabase.from('tasks').update({ progress_image_url: publicUrl }).eq('id', taskId);
    if (updateError) { return { error: 'Error al guardar la URL de la imagen.' }; }
    revalidatePath(`/tasks/${taskId}/edit`);
    revalidatePath('/tasks');
    return { success: 'Imagen de tarea actualizada.' };
}

export async function deleteTaskImage(taskId: string, imageUrl: string) {
    if (!imageUrl) { return { error: 'No hay imagen para eliminar.' }; }
    const supabase = createClient();
    const fileName = imageUrl.split('/').pop();
    if (!fileName) { return { error: 'URL de imagen no válida.' }; }
    const { error: storageError } = await supabase.storage.from('task-images').remove([fileName]);
    if (storageError) { return { error: 'No se pudo eliminar el archivo de imagen.' }; }
    const { error: dbError } = await supabase.from('tasks').update({ progress_image_url: null }).eq('id', taskId);
    if (dbError) { return { error: 'No se pudo actualizar la base de datos.' }; }
    revalidatePath(`/tasks/${taskId}/edit`);
    revalidatePath('/tasks');
    return { success: 'Imagen de tarea eliminada.' };
}
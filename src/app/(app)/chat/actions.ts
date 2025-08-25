'use server';

import { createServerClient } from '@/utils/supabase/server';
import { createServiceRoleClient } from '@/utils/supabase/service';
import { revalidatePath } from 'next/cache';

// -- Tipos para los estados de las acciones --
export type SendMessageState = { error?: string; success?: boolean } | null;
export type CreateChatRoomState = { error?: string; room_id?: string };

// --- ACCIÓN PARA ENVIAR MENSAJES ---
export async function sendMessage(prevState: SendMessageState, formData: FormData): Promise<SendMessageState> {
  const supabase = createServerClient();
  const content = formData.get('content') as string;
  const roomId = formData.get('room_id') as string;

  if (!content?.trim() || !roomId) {
    return { error: 'El contenido del mensaje no puede estar vacío.' };
  }

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return { error: 'No autorizado.' };
  }

  const { error } = await supabase.from('messages').insert({
    content: content.trim(),
    room_id: roomId,
    user_id: user.id,
  });

  if (error) {
    console.error('Error sending message:', error);
    return { error: 'No se pudo enviar el mensaje.' };
  }

  revalidatePath(`/chat`);
  return { success: true };
}

// --- ACCIÓN PARA BUSCAR USUARIOS ---
export async function searchUsers(query: string): Promise<{ id: string; full_name: string | null; email: string | null }[]> {
  const supabase = createServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  const { data, error } = await supabase
    .from('profiles')
    .select('id, full_name, email')
    .ilike('full_name', `%${query}%`)
    .neq('id', user.id)
    .limit(10);
  
  if (error) {
    console.error('Error buscando usuarios:', error);
    return [];
  }
  return data || [];
}

// --- ACCIÓN PARA CREAR UNA SALA DE CHAT ---
export async function createChatRoom(participantId: string): Promise<CreateChatRoomState> {
  const supabase = createServiceRoleClient(); // Usamos Service Role para crear la sala y añadir participantes
  const { data: { user } } = await createServerClient().auth.getUser(); // Usamos el cliente normal para obtener el usuario actual
  
  if (!user) return { error: 'No autorizado.' };
  if (user.id === participantId) return { error: 'No puedes crear un chat contigo mismo.' };

  const { data: participantProfile } = await supabase.from('profiles').select('full_name').eq('id', participantId).single();
  if (!participantProfile) return { error: 'El usuario seleccionado no existe.' };

  const roomName = `Chat con ${participantProfile.full_name}`;
  const { data: newRoom, error: roomError } = await supabase.from('chat_rooms').insert({ name: roomName }).select().single();
  if (roomError) {
    console.error('Error creando la sala:', roomError);
    return { error: 'No se pudo crear la sala de chat.' };
  }

  const { error: participantsError } = await supabase.from('chat_participants').insert([
    { room_id: newRoom.id, user_id: user.id },
    { room_id: newRoom.id, user_id: participantId },
  ]);

  if (participantsError) {
    await supabase.from('chat_rooms').delete().eq('id', newRoom.id);
    return { error: 'No se pudo añadir participantes a la sala.' };
  }

  revalidatePath('/chat');
  return { room_id: newRoom.id };
}
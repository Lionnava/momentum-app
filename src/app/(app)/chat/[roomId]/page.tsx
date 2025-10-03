// src/app/(app)/chat/[roomId]/page.tsx
import { createClient } from '@/utils/supabase/server';
import { notFound } from 'next/navigation';
import { ChatRoom } from './_components/ChatRoom';

// La definición de tipos es perfecta.
interface ChatRoomPageProps {
  params: {
    roomId: string;
  };
}

// FIX: Se ha añadido 'async' para permitir el uso de 'await' dentro del componente.
export default async function ChatRoomPage({ params }: ChatRoomPageProps) {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    // Ahora puedes acceder a roomId de forma segura
    const { roomId } = params;

    // Lógica para obtener la sala y verificar el acceso (ahora es válida)
    const { data: room, error: roomError } = await supabase
        .from('chat_rooms')
        .select('*, participants:chat_participants(profile:profiles(id, full_name))')
        .eq('id', roomId) // Usamos la variable roomId que ya desestructuramos
        .single();
    
    // Verificación de acceso mejorada
    if (roomError || !room) {
        return notFound();
    }
    
    // Asegurarse de que el usuario actual es un participante
    const isParticipant = (await supabase.from('chat_participants').select('id').eq('user_id', user?.id ?? '').eq('room_id', roomId)).data?.length ?? 0 > 0;
    if (!isParticipant) {
        return notFound();
    }

    // Lógica para obtener mensajes (sin cambios)
    const { data: messages } = await supabase.from('messages').select('*, sender:profiles(full_name)').eq('room_id', roomId).order('created_at');
    
    const otherParticipant = room.participants.find(p => p.profile?.id !== user?.id)?.profile;
    const roomName = room.name || otherParticipant?.full_name || 'Conversación';

    return (
        <ChatRoom
            room={{ id: room.id, name: roomName }}
            initialMessages={messages ?? []}
            currentUser={user}
        />
    );
}
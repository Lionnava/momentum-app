// src/app/(app)/chat/[roomId]/page.tsx
import { createClient } from '@/utils/supabase/server';
import { notFound } from 'next/navigation';
import { ChatRoom } from './_components/ChatRoom'; // Reutilizamos nuestro componente de UI

export default async function ChatRoomPage({ params }: { params: { roomId: string } }) {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    // Lógica para obtener la sala y verificar el acceso (sin cambios)
    const { data: room, error: roomError } = await supabase
        .from('chat_rooms')
        .select('*, participants:chat_participants(profile:profiles(id, full_name))')
        .eq('id', params.roomId)
        .in('id', (await supabase.from('chat_participants').select('room_id').eq('user_id', user?.id ?? '')).data?.map(p => p.room_id) ?? [])
        .single();
    if (roomError || !room) notFound();

    // Lógica para obtener mensajes (sin cambios)
    const { data: messages } = await supabase.from('messages').select('*, sender:profiles(full_name)').eq('room_id', params.roomId).order('created_at');
    
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
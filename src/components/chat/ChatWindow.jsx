'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/utils/supabase/client';
import MessageList from './MessageList';
import MessageInput from './MessageInput';
// Asegúrate de importar el componente de invitación si lo tienes
import InviteParticipant from './InviteParticipant';

export default function ChatWindow({ roomId, currentUser }) {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [roomName, setRoomName] = useState('');

  // Cargar datos iniciales de la sala
  useEffect(() => {
    const fetchRoomData = async () => {
      setLoading(true);
      // Obtener mensajes
      const { data: messagesData } = await supabase
        .from('messages')
        .select('*, profiles(full_name)') // ¡Mejora! Obtenemos el nombre del autor
        .eq('room_id', roomId)
        .order('created_at', { ascending: true });
      setMessages(messagesData || []);
      
      // Obtener nombre de la sala
      const { data: roomData } = await supabase
        .from('chat_rooms').select('name').eq('id', roomId).single();
      setRoomName(roomData?.name || '');
      
      setLoading(false);
    };
    if (roomId) fetchRoomData();
  }, [roomId]);

  // Suscribirse a nuevos mensajes en tiempo real
  useEffect(() => {
    const channel = supabase
      .channel(`room:${roomId}`)
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'messages', filter: `room_id=eq.${roomId}` },
        async (payload) => {
          // Necesitamos obtener el perfil del autor del nuevo mensaje
          const { data: profile } = await supabase
            .from('profiles')
            .select('full_name')
            .eq('id', payload.new.user_id)
            .single();
          
          const newMessage = {
            ...payload.new,
            profiles: profile
          };
          setMessages((currentMessages) => [...currentMessages, newMessage]);
        }
      )
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [roomId]);

  const handleSendMessage = async (content) => {
    await supabase.from('messages').insert({
      content: content,
      room_id: roomId,
      user_id: currentUser.id,
    });
  };
  
  if (loading) return <div className="flex items-center justify-center flex-1">Cargando sala...</div>;

  return (
    <div className="flex flex-col h-full bg-white">
      <div className="p-4 font-semibold text-gray-700 bg-gray-100 border-b">
        <h2>{roomName || 'Chat'}</h2>
      </div>
      <MessageList messages={messages} currentUserId={currentUser?.id} />
      <InviteParticipant roomId={roomId} />
      <MessageInput onSendMessage={handleSendMessage} />
    </div>
  );
}
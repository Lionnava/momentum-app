'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import MessageInput from './MessageInput';
// --- INICIO DE LA CORRECCIÓN ---
// Quitamos las llaves {} para usar la importación por defecto.
import MessageList from './MessageList'; 
// --- FIN DE LA CORRECCIÓN ---

export default function ChatWindow({ selectedRoom }) {
  const supabase = createClient();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setCurrentUser(user);
    };
    getUser();
  }, [supabase]);

  useEffect(() => {
    async function fetchMessages() {
      if (!selectedRoom) return;
      setLoading(true);
      const { data, error } = await supabase
        .from('messages')
        .select('*, author:profiles!messages_user_id_fkey(full_name)')
        .eq('room_id', selectedRoom.id)
        .order('created_at', { ascending: true });

      if (error) console.error("Error al cargar mensajes:", error);
      else setMessages(data);
      setLoading(false);
    }
    fetchMessages();
  }, [selectedRoom, supabase]);

  useEffect(() => {
    if (!selectedRoom) return;
    const channel = supabase
      .channel(`room_${selectedRoom.id}`)
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages', filter: `room_id=eq.${selectedRoom.id}` },
        async (payload) => {
          const { data: newMessage, error } = await supabase
            .from('messages')
            .select('*, author:profiles!messages_user_id_fkey(full_name)')
            .eq('id', payload.new.id)
            .single();
          if (!error && newMessage) {
            setMessages((currentMessages) => [...currentMessages, newMessage]);
          }
        }
      )
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [selectedRoom, supabase]);

  if (!selectedRoom) {
    return <div className="flex-1 flex items-center justify-center text-gray-500"><p>Selecciona un chat para comenzar a conversar</p></div>;
  }

  return (
    <div className="flex-1 flex flex-col bg-white">
      <header className="p-4 border-b border-gray-200 bg-gray-50"><h2 className="font-semibold text-gray-800">{selectedRoom.name}</h2></header>
      <MessageList messages={messages} loading={loading} currentUserId={currentUser?.id} />
      <MessageInput roomId={selectedRoom.id} />
    </div>
  );
}
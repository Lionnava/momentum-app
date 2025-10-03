// src/app/(app)/chat/[roomId]/_components/ChatRoom.tsx
'use client';

import { sendMessage } from '@/app/actions';
import { type User } from '@supabase/supabase-js';
import { useRef, useEffect, useState } from 'react';
import { LuSend } from 'react-icons/lu';
import { createClient } from '@/utils/supabase/client'; // Ahora esta importación funciona

// Tipos
type Profile = { full_name: string | null; avatar_url: string | null; };
type Message = { id: string; content: string; created_at: string; user_id: string; sender: Profile | null; };
type Room = { id: string; name: string; };

type ChatRoomProps = {
  room: Room;
  initialMessages: Message[];
  currentUser: User | null;
};

export function ChatRoom({ room, initialMessages, currentUser }: ChatRoomProps) {
  const [messages, setMessages] = useState(initialMessages);
  const formRef = useRef<HTMLFormElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const supabase = createClient();
    const channel = supabase
      .channel(`room-${room.id}`)
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'messages', filter: `room_id=eq.${room.id}` },
        async (payload) => {
            // Cuando llega un nuevo mensaje, obtenemos los datos del remitente
            const { data: senderProfile } = await supabase
                .from('profiles')
                .select('full_name, avatar_url')
                .eq('id', payload.new.user_id)
                .single();

            const newMessage = {
                ...payload.new,
                sender: senderProfile,
            } as Message;

            setMessages((currentMessages) => [...currentMessages, newMessage]);
        }
      )
      .subscribe();
      
    return () => {
      supabase.removeChannel(channel);
    };
  }, [room.id]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (formData: FormData) => {
    await sendMessage(room.id, formData);
    formRef.current?.reset();
  };

  return (
    <div className="flex flex-col h-full bg-gray-50">
      <div className="flex items-center p-4 border-b bg-white shadow-sm">
        <h2 className="text-xl font-semibold text-gray-800">{room.name}</h2>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex items-end gap-3 ${
              message.user_id === currentUser?.id ? 'justify-end' : 'justify-start'
            }`}
          >
            <div
              className={`max-w-xs md:max-w-md lg:max-w-lg p-3 rounded-lg ${
                message.user_id === currentUser?.id
                  ? 'bg-blue-500 text-white'
                  : 'bg-white text-gray-800 shadow-sm border'
              }`}
            >
              <p>{message.content}</p>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 border-t bg-white">
        <form ref={formRef} action={handleSendMessage} className="flex items-center gap-3">
          <input
            type="text"
            name="content"
            placeholder="Escribe un mensaje..."
            className="flex-1 block w-full rounded-full border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 px-4 py-2"
            autoComplete="off"
            required
          />
          <button
            type="submit"
            className="inline-flex items-center justify-center rounded-full h-10 w-10 bg-blue-600 text-white hover:bg-blue-700"
          >
            <LuSend size={20} />
          </button>
        </form>
      </div>
    </div>
  );
}
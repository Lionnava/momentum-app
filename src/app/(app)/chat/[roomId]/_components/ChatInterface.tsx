// src/app/(app)/chat/[roomId]/_components/ChatInterface.tsx
'use client';

import { useEffect, useState, useRef } from 'react';
import { createClient } from '@/utils/supabase/client';
import { sendMessage } from '@/app/actions';
import EmojiPicker, { type EmojiClickData } from 'emoji-picker-react';
import { LuSend, LuPaperclip, LuSmile, LuDownload, LuFile, LuX } from 'react-icons/lu';

// --- DEFINICIÓN DE TIPOS CLAROS (NO MÁS 'any') ---
type Profile = {
  full_name: string | null;
  avatar_url: string | null;
};
type Message = {
  id: string;
  created_at: string;
  user_id: string;
  room_id: string;
  content: string | null;
  file_url: string | null;
  file_name: string | null;
  author: Profile | null;
};
type Participant = {
    user: Profile & { id: string };
};
type RoomInfo = {
  id: string;
  room_type: 'dm' | 'group';
  name: string | null;
  participants: Participant[];
};
type ChatInterfaceProps = {
  initialMessages: Message[];
  roomInfo: RoomInfo;
  userId: string;
};

// --- FUNCIÓN DE AYUDA CON TIPOS ---
const getConversationName = (room: RoomInfo, currentUserId: string): string => {
    if (room.room_type === 'group') {
        return room.name || 'Grupo sin nombre';
    }
    const otherParticipant = room.participants.find(p => p.user?.id !== currentUserId);
    return otherParticipant?.user?.full_name || 'Conversación';
};

// Componente para renderizar un mensaje
const MessageBubble = ({ msg, userId }: { msg: Message, userId: string }) => {
    const isAuthor = msg.user_id === userId;
    return (
        <div className={`flex items-end gap-2 mb-4 ${isAuthor ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-md p-3 rounded-lg ${isAuthor ? 'bg-blue-600 text-white' : 'bg-white border'}`}>
                <p className="text-sm break-words">{msg.content}</p>
                {msg.file_url && (
                    <a 
                        href={msg.file_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        download={msg.file_name || 'descarga'}
                        className={`mt-2 flex items-center gap-2 p-2 rounded-md transition-colors ${isAuthor ? 'bg-blue-700 hover:bg-blue-800' : 'bg-slate-100 hover:bg-slate-200'}`}
                    >
                        <LuFile className="flex-shrink-0" />
                        <span className="text-xs font-medium truncate">{msg.file_name || 'Archivo adjunto'}</span>
                        <LuDownload className="ml-auto flex-shrink-0" />
                    </a>
                )}
            </div>
        </div>
    );
};

export function ChatInterface({ initialMessages, roomInfo, userId }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [inputText, setInputText] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  
  const supabase = createClient();
  const messagesEndRef = useRef<null | HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    const channel = supabase
      .channel(`room-${roomInfo.id}`)
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages', filter: `room_id=eq.${roomInfo.id}` },
        (payload) => {
          const newMessage = payload.new as Message;
          supabase.from('profiles').select('full_name, avatar_url').eq('id', newMessage.user_id).single().then(({ data: author }) => {
              setMessages(currentMessages => [...currentMessages, { ...newMessage, author }]);
          });
        }
      ).subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [supabase, roomInfo.id]);

  const handleEmojiClick = (emojiData: EmojiClickData) => {
    setInputText(prev => prev + emojiData.emoji);
    setShowEmojiPicker(false);
  };

  const handleFormSubmit = async (formData: FormData) => {
    // No necesitamos poner el texto manualmente, el formulario ya lo tiene
    // formData.append('content', inputText);
    if (file) {
        formData.append('file', file);
    }
    await sendMessage(roomInfo.id, formData);
    setInputText('');
    setFile(null);
  };

  return (
    <>
      <header className="p-4 border-b border-slate-200">
        <h3 className="font-semibold">{getConversationName(roomInfo, userId)}</h3>
      </header>
      <div className="flex-grow p-4 overflow-y-auto bg-slate-50">
        {messages.map(msg => <MessageBubble key={msg.id} msg={msg} userId={userId} />)}
        <div ref={messagesEndRef} />
      </div>
      <footer className="p-4 border-t bg-white">
        <form action={handleFormSubmit} className="space-y-2">
            {file && (
                <div className="flex items-center gap-2 p-2 text-sm bg-slate-100 rounded-md">
                    <LuFile />
                    <span className="truncate flex-grow">{file.name}</span>
                    <button type="button" onClick={() => setFile(null)} className="text-slate-500 hover:text-red-600"><LuX /></button>
                </div>
            )}
            <div className="flex items-center gap-2 relative">
                <input
                    type="text"
                    name="content" // El 'name' es importante para que FormData lo recoja
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    className="flex-grow border rounded-full px-4 py-2"
                    placeholder="Escribe un mensaje..."
                />
                 <button type="button" onClick={() => setShowEmojiPicker(prev => !prev)} className="p-2 text-slate-500 hover:text-blue-600">
                    <LuSmile />
                </button>
                <label htmlFor="file-upload" className="p-2 text-slate-500 hover:text-blue-600 cursor-pointer">
                    <LuPaperclip />
                </label>
                <input id="file-upload" type="file" className="hidden" onChange={(e) => setFile(e.target.files?.[0] || null)} />
                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-full flex items-center gap-2">
                    <LuSend />
                </button>

                {showEmojiPicker && (
                    <div className="absolute bottom-14 right-0 z-10">
                        <EmojiPicker onEmojiClick={handleEmojiClick} />
                    </div>
                )}
            </div>
        </form>
      </footer>
    </>
  );
}
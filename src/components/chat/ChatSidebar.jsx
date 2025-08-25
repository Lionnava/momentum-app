'use client';

import { useState, useEffect, useCallback } from 'react';
import { createClient } from '@/utils/supabase/client';
import { LuPlus } from 'react-icons/lu';
import NewChatCommand from './NewChatCommand';

export default function ChatSidebar({ onSelectRoom, selectedRoom }) {
  const supabase = createClient();
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isCommandOpen, setIsCommandOpen] = useState(false);

  const fetchRooms = useCallback(async () => {
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const { data: chatData, error } = await supabase
        .from('chat_participants')
        .select('chat_rooms!inner(id, name)')
        .eq('user_id', user.id)
        .order('name', { referencedTable: 'chat_rooms' });
      
      if (error) {
        console.error("Error al cargar las salas de chat:", error);
      } else if (chatData) {
        const extractedRooms = chatData.map(p => p.chat_rooms).filter(Boolean);
        setRooms(extractedRooms);
      }
    }
    setLoading(false);
  }, [supabase]);

  useEffect(() => {
    fetchRooms();
  }, [fetchRooms]);

  const handleChatCreated = useCallback((newRoomId) => {
    setIsCommandOpen(false);
    fetchRooms();
  }, [fetchRooms]);

  return (
    <>
      <aside className="w-1/3 md:w-1/4 bg-gray-50 border-r border-gray-200 flex flex-col">
        <div className="p-4 border-b border-gray-200 flex justify-between items-center">
          <h2 className="font-semibold text-lg text-gray-800">Chats</h2>
          <button 
            onClick={() => setIsCommandOpen(true)}
            className="p-1 text-gray-500 hover:text-blue-600 transition-colors"
            title="Nuevo Chat (Ctrl + K)"
          >
            <LuPlus className="h-6 w-6" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto">
          {loading && <p className="p-4 text-sm text-gray-500">Cargando salas...</p>}
          {!loading && rooms.length === 0 && <p className="p-4 text-sm text-gray-500">No perteneces a ninguna sala.</p>}
          <ul>
            {rooms.map((room) => (
              <li key={room.id} onClick={() => onSelectRoom(room)}>
                <div className={`p-4 cursor-pointer hover:bg-gray-200 transition-colors ${selectedRoom?.id === room.id ? 'bg-indigo-100' : ''}`}>
                  <p className="font-medium text-gray-800 truncate">{room.name}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </aside>

      <NewChatCommand 
        open={isCommandOpen} 
        setOpen={setIsCommandOpen} 
        onChatCreated={handleChatCreated}
      />
    </>
  );
}
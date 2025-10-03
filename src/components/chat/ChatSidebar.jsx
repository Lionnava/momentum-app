'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/utils/supabase/client';
import { LuCirclePlus } from 'react-icons/lu';

// --- LA CLAVE ESTÁ AQUÍ: "export default function" ---
export default function ChatSidebar({ currentUserId, onSelectRoom, activeRoomId }) {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!currentUserId) {
      setLoading(false); // Si no hay usuario, deja de cargar
      return;
    }

    const fetchUserRooms = async () => {
      setLoading(true);
      const { data: participantData } = await supabase
        .from('chat_participants')
        .select('room_id')
        .eq('user_id', currentUserId);

      if (!participantData || participantData.length === 0) {
        setRooms([]);
        setLoading(false);
        return;
      }

      const roomIds = participantData.map(p => p.room_id);

      const { data: roomData } = await supabase
        .from('chat_rooms')
        .select('id, name')
        .in('id', roomIds);

      setRooms(roomData || []);
      setLoading(false);
    };

    fetchUserRooms();
  }, [currentUserId]);
  
  // ... (tu useEffect para las suscripciones en tiempo real se queda igual)

  const handleCreateRoom = async () => {
    const roomName = prompt("Introduce el nombre de la nueva sala:");
    if (!roomName || roomName.trim() === '') return;

    const { data: newRoom, error: createError } = await supabase
      .from('chat_rooms').insert({ name: roomName }).select().single();

    if (createError) {
      alert("Error al crear la sala: " + createError.message);
      return;
    }

    const { error: participantError } = await supabase
      .from('chat_participants').insert({ room_id: newRoom.id, user_id: currentUserId });
    
    if (participantError) {
      alert("Error al añadir participante: " + participantError.message);
      return;
    }

    setRooms(currentRooms => [...currentRooms, newRoom]);
    onSelectRoom(newRoom.id); 
  };
  
  return (
    <div className="flex flex-col h-full bg-gray-100 border-r">
      <div className="flex items-center justify-between p-4 border-b">
        <h2 className="text-lg font-semibold">Conversaciones</h2>
        <button 
          onClick={handleCreateRoom}
          title="Crear nueva sala de chat"
          className="p-1 text-gray-500 rounded-full hover:bg-gray-200 hover:text-gray-800"
        >
          <LuCirclePlus size={22} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto">
        {loading ? (
          <p className="p-4 text-sm text-gray-500">Cargando salas...</p>
        ) : rooms.length > 0 ? (
          <ul>
            {rooms.map(room => (
              <li key={room.id}>
                <button
                  onClick={() => onSelectRoom(room.id)}
                  className={`w-full text-left px-4 py-3 hover:bg-gray-200 ${
                    activeRoomId === room.id ? 'bg-blue-100 font-semibold' : ''
                  }`}
                >
                  {room.name || `Sala ${room.id.substring(0, 6)}`}
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p className="p-4 text-sm text-gray-500">
            No tienes conversaciones. <br />
            ¡Crea una con el botón `+` de arriba!
          </p>
        )}
      </div>
    </div>
  );
}
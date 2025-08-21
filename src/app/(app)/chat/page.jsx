'use client';

import { useState, useEffect } from 'react';
import ChatSidebar from '@/components/chat/ChatSidebar'; // Correcto, sin llaves
import ChatWindow from '@/components/chat/ChatWindow';
// ¡Esta es la importación CORRECTA!
import { supabase } from '@/utils/supabase/client';

export default function ChatPage() {
  const [selectedRoomId, setSelectedRoomId] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoadingUser, setIsLoadingUser] = useState(true);
  
  // NO necesitamos crear la instancia aquí, ya la importamos.

  useEffect(() => {
    const fetchUser = async () => {
      // Usamos 'supabase' directamente
      const { data: { user } } = await supabase.auth.getUser();
      setCurrentUser(user);
      setIsLoadingUser(false);
    };
    fetchUser();
  }, []); // El array de dependencias puede estar vacío aquí
  
  const handleSelectRoom = (roomId) => {
    setSelectedRoomId(roomId);
  };
  
  if (isLoadingUser) {
    return (
        <div className="flex items-center justify-center h-full">
            Cargando sesión de usuario...
        </div>
    );
  }

  if (!currentUser) {
    return (
      <div className="flex items-center justify-center h-full">
        Error: No se pudo obtener la sesión del usuario.
      </div>
    );
  }

  return (
    <div className="flex h-screen antialiased text-gray-800 bg-gray-50">
      <div className="flex flex-row w-full h-full overflow-x-hidden">
        <div className="flex-shrink-0 w-64 md:w-80">
          <ChatSidebar 
            currentUserId={currentUser.id} 
            onSelectRoom={handleSelectRoom} 
            activeRoomId={selectedRoomId}
          />
        </div>
        <div className="flex flex-col flex-auto h-full">
          {selectedRoomId ? (
            <ChatWindow 
              key={selectedRoomId}
              roomId={selectedRoomId} 
              currentUser={currentUser} 
            />
          ) : (
            <div className="flex items-center justify-center h-full text-gray-500">
              <p>Selecciona una conversación para empezar a chatear.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
'use client';

import { useEffect, useRef } from 'react';

export default function MessageList({ messages, currentUserId }) {
  const endOfMessagesRef = useRef(null);

  // Efecto para hacer scroll automáticamente al final cuando llegan nuevos mensajes
  useEffect(() => {
    endOfMessagesRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Si no hay mensajes, muestra un placeholder
  if (!messages || messages.length === 0) {
    return (
      <div className="flex-1 p-4 text-center text-gray-500">
        Aún no hay mensajes. ¡Sé el primero en saludar!
      </div>
    );
  }

  return (
    <div className="flex-1 p-4 overflow-y-auto bg-gray-50">
      {messages.map((msg) => {
        const isCurrentUser = msg.user_id === currentUserId;
        
        return (
          <div
            key={msg.id}
            // Alinea los mensajes del usuario actual a la derecha y los de otros a la izquierda
            className={`flex mb-3 ${isCurrentUser ? 'justify-end' : 'justify-start'}`}
          >
            <div
              // Aplica diferentes colores de fondo
              className={`max-w-xs px-4 py-2 rounded-lg lg:max-w-md ${
                isCurrentUser ? 'bg-blue-500 text-white' : 'bg-white border'
              }`}
            >
              <p className="text-sm">{msg.content}</p>
              <span className={`text-xs mt-1 block ${isCurrentUser ? 'text-blue-100' : 'text-gray-400'}`}>
                {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          </div>
        );
      })}
      {/* Elemento invisible al final de la lista para hacer scroll */}
      <div ref={endOfMessagesRef} />
    </div>
  );
}
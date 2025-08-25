'use client';
import { useRef, useEffect } from 'react';

// ... (El componente Message no necesita cambios)

// Asegúrate de que esta línea sea 'export default function MessageList...'
export default function MessageList({ messages, loading, currentUserId }) {
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  if (loading) {
    return <div className="flex-1 flex items-center justify-center text-gray-400">Cargando mensajes...</div>;
  }

  return (
    <div className="flex-1 p-6 overflow-y-auto">
      {messages.map((msg) => (
        <Message key={msg.id} message={msg} isCurrentUser={msg.user_id === currentUserId} />
      ))}
      <div ref={messagesEndRef} />
    </div>
  );
}
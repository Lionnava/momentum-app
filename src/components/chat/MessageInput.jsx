'use client';

import { useState } from 'react';

export default function MessageInput({ onSendMessage }) {
  const [message, setMessage] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault(); // Evita que la página se recargue al enviar el formulario
    
    // No enviar mensajes vacíos
    if (message.trim() === '') {
      return;
    }

    // Llama a la función que le pasó el componente padre
    onSendMessage(message);
    
    // Limpia el campo de texto después de enviar
    setMessage('');
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 bg-gray-100 border-t">
      <div className="flex items-center">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Escribe un mensaje..."
          className="flex-grow px-3 py-2 border rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          type="submit"
          className="px-4 py-2 font-semibold text-white bg-blue-600 rounded-r-md hover:bg-blue-700 disabled:opacity-50"
          disabled={!message.trim()}
        >
          Enviar
        </button>
      </div>
    </form>
  );
}
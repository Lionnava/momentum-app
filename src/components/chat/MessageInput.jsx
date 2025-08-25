'use client';

import { useRef } from 'react';
import { useFormStatus } from 'react-dom';
import { LuSend } from 'react-icons/lu';
// --- INICIO DE LA CORRECCIÓN ---
// Corregimos la ruta para apuntar al archivo de acciones correcto.
import { sendMessage } from '@/app/(app)/chat/actions';
// --- FIN DE LA CORRECCIÓN ---

function SendButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="p-3 bg-blue-600 text-white rounded-full hover:bg-blue-700 disabled:bg-blue-300 disabled:cursor-not-allowed transition-colors"
      aria-label="Enviar mensaje"
    >
      <LuSend className="h-5 w-5" />
    </button>
  );
}

export default function MessageInput({ roomId }) {
  const formRef = useRef(null);

  const handleAction = async (formData) => {
    const response = await sendMessage(null, formData); // Pasamos null como estado previo
    if (response?.success) {
      formRef.current?.reset();
    } else if (response?.error) {
      console.error(response.error);
    }
  };

  return (
    <div className="p-4 bg-gray-50 border-t border-gray-200">
      <form ref={formRef} action={handleAction} className="flex items-center gap-3">
        <input type="hidden" name="room_id" value={roomId} />
        <input
          type="text"
          name="content"
          placeholder="Escribe un mensaje..."
          required
          autoComplete="off"
          className="flex-1 px-4 py-2 bg-white border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <SendButton />
      </form>
    </div>
  );
}
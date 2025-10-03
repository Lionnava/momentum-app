// src/app/(app)/chat/_components/ChatClientPage.tsx
'use client';

import { useState } from 'react';
import { LuPlus } from 'react-icons/lu';
import { NewConversationModal } from './NewConversationModal';

type Profile = { id: string; full_name: string | null; };
type ChatClientPageProps = {
  users: Profile[];
};

export function ChatClientPage({ users }: ChatClientPageProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <div className="flex-1 flex flex-col">
        {/* Encabezado de la lista de conversaciones */}
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-xl font-semibold">Conversaciones</h2>
          <button onClick={() => setIsModalOpen(true)} className="p-2 rounded-full hover:bg-gray-100">
            <LuPlus size={20} />
          </button>
        </div>
        
        {/* Lista de conversaciones (a desarrollar) */}
        <div className="flex-1 overflow-y-auto p-4">
          <p className="text-gray-500">Conversación</p>
          <p className="text-sm text-gray-400">No hay mensajes aún</p>
        </div>
      </div>
      
      {/* Placeholder para la vista de chat */}
      <div className="flex-1 flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <p className="text-gray-600">Selecciona una conversación</p>
          <p className="text-sm text-gray-400">O crea una nueva para empezar a chatear.</p>
        </div>
      </div>

      {isModalOpen && (
        <NewConversationModal
          users={users}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </>
  );
}
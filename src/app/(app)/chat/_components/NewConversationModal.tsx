// src/app/(app)/chat/_components/NewConversationModal.tsx
'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { startChat } from '@/app/actions';
// CORRECCIÓN: El nombre correcto del ícono es LuLoader, sin el '2'.
import { LuLoader } from 'react-icons/lu';

type Profile = { id: string; full_name: string | null; };
type NewConversationModalProps = {
  users: Profile[];
  onClose: () => void;
};

export function NewConversationModal({ users, onClose }: NewConversationModalProps) {
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleStartChat = () => {
    if (!selectedUserId) {
      toast.error('Por favor, selecciona un participante.');
      return;
    }
    
    startTransition(async () => {
      toast.loading('Iniciando conversación...');
      const result = await startChat(selectedUserId);
      toast.dismiss();

      if (result.error) {
        toast.error(result.error);
      } else if (result.roomId) {
        toast.success('¡Conversación iniciada!');
        router.push(`/chat/${result.roomId}`);
        onClose();
      }
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-800">Nueva Conversación</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-800 text-2xl">&times;</button>
        </div>

        <p className="text-sm text-gray-600 mb-4">Selecciona un participante:</p>

        <div className="space-y-2 max-h-60 overflow-y-auto border rounded-md p-2">
          {users.map(user => (
            <label key={user.id} className={`flex items-center p-3 rounded-md cursor-pointer ${selectedUserId === user.id ? 'bg-blue-100 ring-2 ring-blue-300' : 'hover:bg-gray-100'}`}>
              <input
                type="radio"
                name="participant"
                value={user.id}
                onChange={(e) => setSelectedUserId(e.target.value)}
                className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
              />
              <span className="ml-3 text-sm font-medium text-gray-800">{user.full_name}</span>
            </label>
          ))}
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50">
            Cancelar
          </button>
          <button
            onClick={handleStartChat}
            disabled={isPending || !selectedUserId}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2"
          >
            {/* CORRECCIÓN: Usando el componente con el nombre correcto */}
            {isPending && <LuLoader className="animate-spin" />}
            Iniciar Chat
          </button>
        </div>
      </div>
    </div>
  );
}
// src/app/(app)/chat/_components/NewChatModal.tsx
'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { startChat } from '@/app/actions';
import { LuX } from 'react-icons/lu';

type User = { id: string; full_name: string; };

export function NewChatModal({ allUsers, onClose }: { allUsers: User[], onClose: () => void }) {
  const router = useRouter();
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [groupName, setGroupName] = useState('');
  const [isPending, startTransition] = useTransition();

  const handleToggleUser = (userId: string) => {
    setSelectedUsers(prev => 
      prev.includes(userId) 
        ? prev.filter(id => id !== userId) 
        : [...prev, userId]
    );
  };

  const isGroupChat = selectedUsers.length > 1;

  // Función handleSubmit que faltaba
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (selectedUsers.length === 0) {
      toast.error('Selecciona al menos un participante');
      return;
    }

    if (isGroupChat && !groupName.trim()) {
      toast.error('Ingresa un nombre para el grupo');
      return;
    }

    startTransition(async () => {
      try {
        // Para chats individuales (solo un usuario seleccionado)
        if (selectedUsers.length === 1) {
          const userId = selectedUsers[0];
          const { roomId, error } = await startChat(userId);
          
          if (error) {
            toast.error(error);
            return;
          }

          if (roomId) {
            router.push(`/chat/${roomId}`);
            onClose();
            toast.success('Chat iniciado');
          }
        } else {
          // Para chats grupales (múltiples usuarios)
          // Aquí necesitarías crear una función startGroupChat
          toast.error('Funcionalidad de grupos aún no implementada');
          // await startGroupChat(selectedUsers, groupName);
        }
      } catch (error) {
        toast.error('Error inesperado');
      }
    });
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md flex flex-col">
        <header className="p-4 border-b flex items-center justify-between">
          <h3 className="text-lg font-semibold">Nueva Conversación</h3>
          <button onClick={onClose} className="text-slate-500 hover:text-slate-800">
            <LuX size={20} />
          </button>
        </header>
        
        {/* Cambiado de form action a onSubmit */}
        <form onSubmit={handleSubmit}>
          <div className="p-4 max-h-[60vh] overflow-y-auto">
            {isGroupChat && (
              <div className="mb-4">
                <label htmlFor="groupName" className="block text-sm font-medium mb-1 text-slate-700">
                  Nombre del Grupo
                </label>
                <input
                  type="text"
                  id="groupName"
                  value={groupName}
                  onChange={e => setGroupName(e.target.value)}
                  required={isGroupChat}
                  className="w-full border rounded-md px-3 py-2 border-slate-300 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Ej: Equipo de Proyecto"
                />
              </div>
            )}
            
            <p className="text-sm font-medium mb-2 text-slate-700">Selecciona participantes:</p>
            <div className="space-y-1">
              {allUsers.map(user => (
                <label 
                  key={user.id} 
                  className={`flex items-center gap-3 p-2 rounded-md cursor-pointer transition-colors ${
                    selectedUsers.includes(user.id) ? 'bg-blue-100' : 'hover:bg-slate-50'
                  }`}
                >
                  <input 
                    type="checkbox" 
                    checked={selectedUsers.includes(user.id)} 
                    onChange={() => handleToggleUser(user.id)} 
                    className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-600" 
                  />
                  <span>{user.full_name}</span>
                </label>
              ))}
            </div>
          </div>
          
          <footer className="p-4 border-t bg-slate-50 flex justify-end gap-2 rounded-b-lg">
            <button 
              type="button" 
              onClick={onClose} 
              className="px-4 py-2 rounded-md border bg-white hover:bg-slate-100"
            >
              Cancelar
            </button>
            <button 
              type="submit" 
              disabled={selectedUsers.length === 0 || isPending || (isGroupChat && !groupName.trim())}
              className="px-4 py-2 rounded-md bg-blue-600 text-white disabled:bg-slate-400 disabled:cursor-not-allowed"
            >
              {isPending ? 'Iniciando...' : 'Iniciar Chat'}
            </button>
          </footer>
        </form>
      </div>
    </div>
  );
}
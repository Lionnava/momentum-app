'use client';

import { useState, useEffect, useTransition } from 'react';
// --- INICIO DE LA CORRECCIÓN ---
// Corregimos la ruta para apuntar al archivo de acciones correcto
import { createChatRoom, searchUsers } from '@/app/(app)/chat/actions';
// --- FIN DE LA CORRECCIÓN ---
import { LuSearch, LuUser, LuLoader, LuX } from 'react-icons/lu';

export default function NewChatCommand({ open, setOpen, onChatCreated }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isCreating, startCreateTransition] = useTransition();

  // Atajo de teclado
  useEffect(() => {
    const down = (e) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((isOpen) => !isOpen);
      }
    };
    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, [setOpen]);

  // Búsqueda de usuarios
  useEffect(() => {
    if (searchQuery.length < 2) {
      setSearchResults([]);
      return;
    }
    setLoading(true);
    const debounce = setTimeout(async () => {
      const users = await searchUsers(searchQuery);
      setSearchResults(users);
      setLoading(false);
    }, 300);
    return () => clearTimeout(debounce);
  }, [searchQuery]);

  const handleSelectUser = (userId) => {
    startCreateTransition(async () => {
      const result = await createChatRoom(userId);
      if (result.error) {
        alert(result.error);
      } else {
        onChatCreated(result.room_id);
      }
    });
  };
  
  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black/60 flex items-start justify-center z-50 p-4 pt-[10vh]" onClick={() => setOpen(false)}>
      <div className="bg-white rounded-lg shadow-xl w-full max-w-lg flex flex-col" onClick={(e) => e.stopPropagation()}>
        <div className="p-4 border-b flex justify-between items-center">
          <h3 className="text-lg font-semibold text-gray-800">Iniciar un nuevo chat</h3>
          <button onClick={() => setOpen(false)} className="p-1 rounded-full text-gray-500 hover:bg-gray-200"><LuX className="h-5 w-5" /></button>
        </div>
        <div className="p-4">
          <div className="relative">
            <LuSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Buscar usuarios por nombre..." className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" autoFocus />
          </div>
        </div>
        <div className="px-4 pb-4 min-h-[10rem] max-h-60 overflow-y-auto">
          {loading && ( <div className="flex items-center justify-center h-full text-gray-500"><LuLoader className="mr-2 h-4 w-4 animate-spin" />Buscando...</div> )}
          {!loading && searchQuery.length > 2 && searchResults.length === 0 && ( <p className="text-center text-gray-500 pt-8">No se encontraron usuarios.</p> )}
          <ul className="divide-y divide-gray-100">
            {searchResults.map((user) => (
              <li key={user.id}>
                <button onClick={() => handleSelectUser(user.id)} disabled={isCreating} className="w-full text-left p-3 hover:bg-gray-100 rounded-md disabled:opacity-50 flex items-center gap-3">
                  <LuUser className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="font-medium text-gray-800">{user.full_name}</p>
                    <p className="text-sm text-gray-500">{user.email}</p>
                  </div>
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
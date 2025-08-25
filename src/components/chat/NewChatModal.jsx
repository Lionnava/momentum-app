'use client';

import { useState, useTransition } from 'react';
import { createChatRoom, searchUsers } from '@/app/(app)/chat/actions';
import { LuSearch, LuX } from 'react-icons/lu';

export default function NewChatModal({ onClose, onChatCreated }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, startSearchTransition] = useTransition();
  const [isCreating, startCreateTransition] = useTransition();

  const handleSearch = (query) => {
    setSearchQuery(query);
    startSearchTransition(async () => {
      if (query.length > 2) {
        const users = await searchUsers(query);
        setSearchResults(users);
      } else {
        setSearchResults([]);
      }
    });
  };

  const handleCreateRoom = (participantId) => {
    startCreateTransition(async () => {
      const result = await createChatRoom(participantId);
      if (result.error) {
        alert(result.error); // Puedes reemplazar esto con un toast
      } else {
        onChatCreated(result.room_id);
      }
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
        <div className="p-4 border-b flex justify-between items-center">
          <h3 className="text-lg font-semibold">Iniciar un nuevo chat</h3>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-200">
            <LuX className="h-5 w-5" />
          </button>
        </div>
        <div className="p-4">
          <div className="relative">
            <LuSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              placeholder="Buscar usuarios por nombre..."
              className="w-full pl-10 pr-4 py-2 border rounded-md"
            />
          </div>
          <div className="mt-4 max-h-60 overflow-y-auto">
            {isSearching && <p className="text-gray-500">Buscando...</p>}
            <ul>
              {searchResults.map((user) => (
                <li key={user.id}>
                  <button
                    onClick={() => handleCreateRoom(user.id)}
                    disabled={isCreating}
                    className="w-full text-left p-3 hover:bg-gray-100 rounded-md disabled:opacity-50"
                  >
                    <p className="font-medium">{user.full_name}</p>
                    <p className="text-sm text-gray-500">{user.email}</p>
                  </button>
                </li>
              ))}
            </ul>
            {!isSearching && searchQuery.length > 2 && searchResults.length === 0 && (
              <p className="text-gray-500 text-center py-4">No se encontraron usuarios.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
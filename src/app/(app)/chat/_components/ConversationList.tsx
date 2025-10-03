// src/app/(app)/chat/_components/ConversationList.tsx
'use client';

'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LuPlus, LuUser, LuUsers, LuSearch, LuMoveVertical, LuArchive, LuTrash2 } from 'react-icons/lu';
import { NewChatModal } from './NewChatModal';

const getConversationName = (room: any, currentUserId: string) => {
  if (room.room_type === 'group') return room.name || 'Grupo sin nombre';
  const participants = room.participants || [];
  const otherParticipant = participants.find((p: any) => p.id !== currentUserId);
  return otherParticipant?.full_name || 'Conversación';
};

const getConversationAvatar = (room: any, currentUserId: string) => {
  if (room.room_type === 'group') {
    return (
      <div className="relative flex-shrink-0">
        <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-400 to-purple-500 flex items-center justify-center">
          <LuUsers className="text-white" size={18} />
        </div>
        <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 border-2 border-white rounded-full"></span>
      </div>
    );
  }
  
  const participants = room.participants || [];
  const otherParticipant = participants.find((p: any) => p.id !== currentUserId);
  
  if (otherParticipant?.avatar_url) {
    return (
      <div className="relative flex-shrink-0">
        <img 
          src={otherParticipant.avatar_url} 
          alt={otherParticipant.full_name} 
          className="w-10 h-10 rounded-full object-cover"
        />
        <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 border-2 border-white rounded-full"></span>
      </div>
    );
  }
  
  return (
    <div className="relative flex-shrink-0">
      <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center">
        <LuUser className="text-slate-500" size={18} />
      </div>
      <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 border-2 border-white rounded-full"></span>
    </div>
  );
};

const getLastMessagePreview = (room: any) => {
  if (!room.last_message) return 'No hay mensajes aún';
  
  const prefix = room.last_message.sender ? `${room.last_message.sender.full_name}: ` : '';
  return prefix + (room.last_message.content || 'Archivo adjunto');
};

type User = { id: string; full_name: string; avatar_url: string | null; };
type Room = { 
  id: string; 
  name: string | null; 
  room_type: 'dm' | 'group'; 
  participants: User[]; 
  last_message?: {
    content: string;
    created_at: string;
    sender: User;
  };
  unread_count?: number;
};
type ConversationListProps = { initialRooms: Room[]; allUsers: User[]; currentUserId: string; };

export function ConversationList({ initialRooms, allUsers, currentUserId }: ConversationListProps) {
  const pathname = usePathname();
  const [isModalOpen, setModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  const filteredRooms = useMemo(() => {
    if (!searchTerm) return initialRooms;
    
    return initialRooms.filter(room => {
      const name = getConversationName(room, currentUserId).toLowerCase();
      return name.includes(searchTerm.toLowerCase());
    });
  }, [initialRooms, searchTerm, currentUserId]);

  const toggleDropdown = (roomId: string) => {
    setActiveDropdown(activeDropdown === roomId ? null : roomId);
  };

  const handleArchive = (roomId: string) => {
    console.log("Archivar conversación:", roomId);
    setActiveDropdown(null);
  };

  const handleDelete = (roomId: string) => {
    console.log("Eliminar conversación:", roomId);
    setActiveDropdown(null);
  };

  return (
    <div className="flex flex-col h-full bg-white border-r border-slate-200">
      <header className="p-4 border-b border-slate-200 flex items-center justify-between flex-shrink-0">
        <h2 className="text-lg font-semibold text-slate-800">Conversaciones</h2>
        <button 
          onClick={() => setModalOpen(true)} 
          className="text-slate-500 hover:text-blue-600 transition-colors p-1 rounded-full hover:bg-slate-100" 
          title="Nueva conversación"
        >
          <LuPlus size={22} />
        </button>
      </header>

      <div className="p-3 border-b border-slate-200">
        <div className="relative">
          <LuSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={18} />
          <input
            type="text"
            placeholder="Buscar conversaciones..."
            className="w-full pl-10 pr-4 py-2 bg-slate-100 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <nav className="flex-grow overflow-y-auto">
        {filteredRooms.length === 0 ? (
          <div className="p-6 text-center">
            {searchTerm ? (
              <>
                <div className="mx-auto w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-3">
                  <LuSearch className="text-slate-400" size={24} />
                </div>
                <p className="text-sm text-slate-500">No se encontraron conversaciones para "{searchTerm}"</p>
                <button 
                  onClick={() => setSearchTerm('')}
                  className="mt-2 text-sm text-blue-600 hover:text-blue-800"
                >
                  Limpiar búsqueda
                </button>
              </>
            ) : (
              <>
                <div className="mx-auto w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-3">
                  <LuUsers className="text-slate-400" size={24} />
                </div>
                <p className="text-sm text-slate-500">No tienes conversaciones.</p>
                <button 
                  onClick={() => setModalOpen(true)}
                  className="mt-3 text-sm bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
                >
                  Crear conversación
                </button>
              </>
            )}
          </div>
        ) : (
          <div className="py-2">
            <div className="px-4 pt-2 pb-1">
              <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Contactos</h3>
            </div>
            <ul>
              {filteredRooms.filter(r => r.room_type === 'dm').map(room => (
                <li key={room.id} className="relative">
                  <Link 
                    href={`/chat/${room.id}`} 
                    className={`flex items-center gap-3 p-3 mx-2 rounded-lg transition-colors ${pathname.includes(room.id) ? 'bg-blue-50' : 'hover:bg-slate-50'}`}
                  >
                    {getConversationAvatar(room, currentUserId)}
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start">
                        <span className={`truncate font-medium ${pathname.includes(room.id) ? 'text-blue-800' : 'text-slate-800'}`}>
                          {getConversationName(room, currentUserId)}
                        </span>
                        {room.last_message && (
                          <span className="text-xs text-slate-400 whitespace-nowrap">
                            {new Date(room.last_message.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-slate-500 truncate">
                        {getLastMessagePreview(room)}
                      </p>
                    </div>
                    {room.unread_count > 0 && (
                      <span className="absolute right-12 top-3 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                        {room.unread_count}
                      </span>
                    )}
                  </Link>
                  <button 
                    onClick={() => toggleDropdown(room.id)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1 rounded"
                  >
                    <LuMoveVertical size={16} />
                  </button>
                  
                  {activeDropdown === room.id && (
                    <div className="absolute right-3 top-10 z-10 bg-white rounded-md shadow-lg py-1 border border-slate-200">
                      <button 
                        onClick={() => handleArchive(room.id)}
                        className="flex items-center w-full px-4 py-2 text-sm text-slate-700 hover:bg-slate-100"
                      >
                        <LuArchive size={16} className="mr-2" />
                        Archivar
                      </button>
                      <button 
                        onClick={() => handleDelete(room.id)}
                        className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-slate-100"
                      >
                        <LuTrash2 size={16} className="mr-2" />
                        Eliminar
                      </button>
                    </div>
                  )}
                </li>
              ))}
            </ul>
            
            {filteredRooms.filter(r => r.room_type === 'group').length > 0 && (
              <>
                <div className="px-4 pt-6 pb-1">
                  <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Grupos / Temas</h3>
                </div>
                <ul>
                  {filteredRooms.filter(r => r.room_type === 'group').map(room => (
                    <li key={room.id} className="relative">
                      <Link 
                        href={`/chat/${room.id}`} 
                        className={`flex items-center gap-3 p-3 mx-2 rounded-lg transition-colors ${pathname.includes(room.id) ? 'bg-blue-50' : 'hover:bg-slate-50'}`}
                      >
                        {getConversationAvatar(room, currentUserId)}
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-start">
                            <span className={`truncate font-medium ${pathname.includes(room.id) ? 'text-blue-800' : 'text-slate-800'}`}>
                              {getConversationName(room, currentUserId)}
                            </span>
                            {room.last_message && (
                              <span className="text-xs text-slate-400 whitespace-nowrap">
                                {new Date(room.last_message.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-slate-500 truncate">
                            {getLastMessagePreview(room)}
                          </p>
                        </div>
                        {room.unread_count > 0 && (
                          <span className="absolute right-12 top-3 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                            {room.unread_count}
                          </span>
                        )}
                      </Link>
                      <button 
                        onClick={() => toggleDropdown(room.id)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1 rounded"
                      >
                        <LuMoveVertical size={16} />
                      </button>
                      
                      {activeDropdown === room.id && (
                        <div className="absolute right-3 top-10 z-10 bg-white rounded-md shadow-lg py-1 border border-slate-200">
                          <button 
                            onClick={() => handleArchive(room.id)}
                            className="flex items-center w-full px-4 py-2 text-sm text-slate-700 hover:bg-slate-100"
                          >
                            <LuArchive size={16} className="mr-2" />
                            Archivar
                          </button>
                          <button 
                            onClick={() => handleDelete(room.id)}
                            className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-slate-100"
                          >
                            <LuTrash2 size={16} className="mr-2" />
                            Eliminar
                          </button>
                        </div>
                      )}
                    </li>
                  ))}
                </ul>
              </>
            )}
          </div>
        )}
      </nav>
      
      {isModalOpen && (
        <NewChatModal 
          allUsers={allUsers} 
          onClose={() => setModalOpen(false)} 
        />
      )}
    </div>
  );
}
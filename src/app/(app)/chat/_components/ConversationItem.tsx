// src/app/(app)/chat/_components/ConversationItem.tsx
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useTransition } from 'react';
import { LuEllipsis, LuTrash2 } from 'react-icons/lu';
import { type Conversation } from '../layout';
import { deleteConversation } from '@/app/actions';
import toast from 'react-hot-toast';

export function ConversationItem({ conversation }: { conversation: Conversation }) {
    const pathname = usePathname();
    const isActive = pathname === `/chat/${conversation.id}`;
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isPending, startTransition] = useTransition();

    const handleDelete = () => {
        if (window.confirm('¿Estás seguro de que quieres eliminar esta conversación? Esta acción no se puede deshacer.')) {
            startTransition(async () => {
                const result = await deleteConversation(conversation.id);
                if (result?.error) {
                    toast.error(result.error);
                } else {
                    toast.success('Conversación eliminada.');
                }
                setIsMenuOpen(false);
            });
        }
    };

    return (
        <div className={`relative flex items-center group ${isActive ? 'bg-blue-50' : 'hover:bg-gray-50'}`}>
            <Link
                href={`/chat/${conversation.id}`}
                className="flex-grow block p-4 border-b"
                onClick={() => setIsMenuOpen(false)}
            >
                <p className={`font-semibold ${isActive ? 'text-blue-700' : 'text-gray-800'}`}>{conversation.name}</p>
                <p className="text-sm text-gray-500 truncate">Último mensaje...</p>
            </Link>
            
            <div className="absolute right-2">
                <button 
                    onClick={() => setIsMenuOpen(!isMenuOpen)} 
                    className="p-2 rounded-full opacity-0 group-hover:opacity-100 focus:opacity-100 hover:bg-gray-200"
                >
                    <LuEllipsis />
                </button>
                {isMenuOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10 border">
                        <button 
                            onClick={handleDelete}
                            disabled={isPending}
                            className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2 disabled:opacity-50"
                        >
                            <LuTrash2 />
                            {isPending ? 'Eliminando...' : 'Eliminar conversación'}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
// src/app/(app)/chat/_components/NewConversationButton.tsx
'use client';

import { useState } from 'react';
import { createClient } from '@/utils/supabase/client'; // Ahora esta importación funciona
import { LuPlus } from 'react-icons/lu';
import { NewConversationModal } from './NewConversationModal';

type Profile = { id: string; full_name: string | null; };

async function getUsers(): Promise<Profile[]> {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return [];

    const { data: users, error } = await supabase
        .from('profiles')
        .select('id, full_name')
        .not('id', 'eq', user.id);
        
    if (error) {
        console.error("Error fetching users for modal:", error);
        return [];
    }
    return users ?? [];
}

export function NewConversationButton() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [users, setUsers] = useState<Profile[]>([]);

    const handleClick = async () => {
        const userList = await getUsers();
        setUsers(userList);
        setIsModalOpen(true);
    };

    return (
        <>
            <button onClick={handleClick} className="p-2 rounded-full hover:bg-gray-100">
                <LuPlus size={20} />
            </button>
            {isModalOpen && (
                <NewConversationModal
                    users={users}
                    onClose={() => setIsModalOpen(false)}
                />
            )}
        </>
    );
}
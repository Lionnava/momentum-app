// src/app/(app)/chat/layout.tsx
import { createClient } from '@/utils/supabase/server';
import { NewConversationButton } from './_components/NewConversationButton';
import { ConversationItem } from './_components/ConversationItem';
import { type User } from '@supabase/supabase-js';

// Los tipos ahora son más simples porque la DB nos da los datos procesados
type Participant = { profile: { id: string; full_name: string | null; } };
export type Conversation = { id: string; name: string | null; room_type: string; participants: Participant[]; };

// La función ahora es una simple llamada RPC
async function getConversations(): Promise<Conversation[]> {
    const supabase = createClient();
    const { data, error } = await supabase.rpc('get_user_conversations');

    if (error) {
        console.error("Error calling get_user_conversations:", error);
        return [];
    }
    return data as Conversation[];
}

export default async function ChatLayout({ children }: { children: React.ReactNode }) {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return <div className="p-4">Por favor, inicia sesión.</div>;
    }
    
    // Ya no necesitamos pasar el 'user' a la función
    const conversations = await getConversations();

    return (
        <div className="flex h-screen bg-white">
            <aside className="w-1/4 min-w-[300px] border-r flex flex-col">
                <div className="flex items-center justify-between p-4 border-b">
                    <h2 className="text-xl font-semibold">Conversaciones</h2>
                    <NewConversationButton />
                </div>
                <nav className="flex-1 overflow-y-auto">
                    {conversations.map((convo) => (
                        <ConversationItem key={convo.id} conversation={convo} />
                    ))}
                    {conversations.length === 0 && (
                        <p className="p-4 text-center text-sm text-gray-500">No tienes conversaciones.</p>
                    )}
                </nav>
            </aside>
            <main className="flex-1 flex flex-col">
                {children}
            </main>
        </div>
    );
}
// src/app/(app)/layout.tsx
import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import { Sidebar } from './_components/Sidebar';

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return redirect('/login');
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('full_name, avatar_url')
    .eq('id', user.id)
    .single();

  return (
    <div className="flex h-screen w-full bg-gray-50">
      <Sidebar user={user} profile={profile} />
      <main className="flex-1 overflow-y-auto">
        {children}
      </main>
    </div> // <-- ETIQUETA DE CIERRE DEL DIV QUE FALTABA
  );
} // <-- LLAVE DE CIERRE DE LA FUNCIÓN QUE FALTABA
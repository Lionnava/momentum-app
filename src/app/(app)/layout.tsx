// src/app/(app)/layout.tsx

import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import { Sidebar } from '@/components/layout/Sidebar';
import { Header } from '@/components/layout/Header';
import { SimpleFooter } from '@/components/layout/SimpleFooter';

export type UserProfile = {
    rol: string;
    full_name: string | null;
    email: string;
};

async function getUserData() {
  // --- AÑADE ESTAS LÍNEAS DE DEPURACIÓN ---
  console.log("--- Verificando variables de entorno en el servidor ---");
  console.log("Supabase URL:", process.env.NEXT_PUBLIC_SUPABASE_URL);
  console.log("Supabase Anon Key:", process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
  // --- FIN DE LÍNEAS DE DEPURACIÓN ---

  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  const { data: profile, error } = await supabase
    .from('profiles')
    .select('rol, full_name')
    .eq('id', user.id)
    .single();

  if (error || !profile) {
    await supabase.auth.signOut();
    redirect('/login?message=Error: Perfil de usuario no encontrado.');
  }
  
  const userProfile: UserProfile = {
    rol: profile.rol,
    full_name: profile.full_name,
    email: user.email!,
  };

  return userProfile;
}

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const userProfile = await getUserData();
  
  return (
    <div className="flex min-h-screen">
      <Sidebar userRole={userProfile.rol} /> 
      <div className="flex flex-1 flex-col">
        <Header userProfile={userProfile} /> 
        <main className="flex-1 bg-gray-50 p-4 sm:p-6 lg:p-8">
          {children}
        </main>
        <SimpleFooter />
      </div>
    </div>
  );
}
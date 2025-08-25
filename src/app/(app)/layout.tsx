import { createServerClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import { Sidebar } from '@/components/layout/Sidebar';
import { Header } from '@/components/layout/Header';
import { SimpleFooter } from '@/components/layout/SimpleFooter';

export type UserProfile = {
  rol: string;
  full_name: string | null;
  email: string;
  division_id: string | null;
};

async function getUserData(): Promise<UserProfile> {
  const supabase = createServerClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  const { data: profile, error } = await supabase.from('profiles').select('rol, full_name, division_id').eq('id', user.id).single();

  if (error || !profile) {
    await supabase.auth.signOut();
    redirect('/login?message=Profile not found');
  }
  
  // --- CORRECCIÓN CLAVE ---
  // Limpiamos y normalizamos el rol aquí, una sola vez.
  const cleanRole = profile.rol.replace(/::text/g, '').toLowerCase().trim();

  return {
    rol: cleanRole, // Devolvemos el rol ya limpio
    full_name: profile.full_name,
    email: user.email!,
    division_id: profile.division_id,
  };
}

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const userProfile = await getUserData();
  
  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Pasamos el rol ya limpio a la Sidebar */}
      <Sidebar userRole={userProfile.rol} /> 
      <div className="flex flex-1 flex-col">
        <Header userProfile={userProfile} />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">{children}</main>
        <SimpleFooter />
      </div>
    </div>
  );
}
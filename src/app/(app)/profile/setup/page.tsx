// src/app/(app)/profile/setup/page.tsx
import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import { ProfileSetupForm } from './_components/ProfileSetupForm';
import type { User } from '@supabase/supabase-js';

export default async function ProfileSetupPage() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return redirect('/login');
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('full_name')
    .eq('id', user.id)
    .single();

  if (profile && profile.full_name) {
    redirect('/dashboard');
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-50">
        <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
            <div className="text-center">
                <h1 className="text-2xl font-bold text-slate-900">¡Bienvenido a Momentum!</h1>
                <p className="mt-2 text-slate-600">Solo un paso más. Por favor, completa tu perfil para continuar.</p>
            </div>
            <ProfileSetupForm user={user as User} />
        </div>
    </div>
  );
}
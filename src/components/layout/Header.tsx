import Link from 'next/link';
import Image from 'next/image';
import { signOut } from '@/app/(public)/login/actions';
import type { UserProfile } from '@/app/(app)/layout';

// --- INICIO DE LA CORRECCIÓN ---
function formatRole(role: string): string {
  if (!role) return '';
  // Primero, quitamos el '::text' si existe
  const cleanRole = role.replace(/::text/g, '');
  // Luego, convertimos 'superManager' a 'Super Manager'
  const spaced = cleanRole.replace(/([A-Z])/g, ' $1');
  // Finalmente, capitalizamos la primera letra
  return spaced.charAt(0).toUpperCase() + spaced.slice(1);
}
// --- FIN DE LA CORRECCIÓN ---

export function Header({ userProfile }: { userProfile: UserProfile | null }) {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/80 backdrop-blur-sm">
      <div className="container mx-auto flex h-20 items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href={userProfile ? "/dashboard" : "/"} className="flex items-center gap-3">
          <Image src="/logo.png" alt="Momentum Logo" width={32} height={32} className="rounded-lg"/>
          <span className="text-xl font-bold text-slate-800 hidden sm:inline">Momentum</span>
        </Link>
        <div className="flex items-center gap-4">
          {userProfile ? (
            <>
              <div className="text-right hidden md:block">
                <p className="text-sm font-semibold text-slate-800">
                  {userProfile.full_name || userProfile.email}
                </p>
                <p className="text-xs font-semibold text-blue-600 tracking-wide uppercase">
                  {/* La función de formato ahora limpiará el texto */}
                  {formatRole(userProfile.rol)}
                </p>
              </div>
              <form action={signOut}>
                <button type="submit" className="px-4 py-2 text-sm font-semibold bg-slate-100 text-slate-700 rounded-md hover:bg-slate-200">
                  Cerrar Sesión
                </button>
              </form>
            </>
          ) : (
            <Link href="/login" className="px-4 py-2 text-sm font-semibold bg-blue-600 text-white rounded-md hover:bg-blue-700">
              Iniciar Sesión
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
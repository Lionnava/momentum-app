import Link from 'next/link';
import Image from 'next/image';
import { logoutAction } from '@/app/(public)/login/actions';
import type { UserProfile } from '@/app/(app)/layout';

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
              <span className="text-sm text-slate-600 hidden md:inline">
                Hola, {userProfile.full_name || userProfile.email}
              </span>
              <form action={logoutAction}>
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
// src/app/(app)/_components/Sidebar.tsx
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LuLayoutDashboard, LuListTodo, LuMessageSquare, LuUsers, LuLogOut, LuEllipsisVertical } from 'react-icons/lu';
import { type User } from '@supabase/supabase-js';
import { useState } from 'react';

type Profile = { full_name: string | null; avatar_url: string | null; } | null;
type SidebarProps = { user: User; profile: Profile; };

const navItems = [
  { href: '/dashboard', icon: LuLayoutDashboard, label: 'Dashboard' },
  { href: '/tasks', icon: LuListTodo, label: 'Tareas' },
  { href: '/chat', icon: LuMessageSquare, label: 'Chat' },
  { href: '/admin', icon: LuUsers, label: 'Administración' },
];

function UserAvatar({ profile }: { profile: Profile }) {
  const getInitials = (name: string | null | undefined) => {
    if (!name) return '?';
    const names = name.split(' ');
    if (names.length > 1) { return `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase(); }
    return name.substring(0, 2).toUpperCase();
  };
  if (profile?.avatar_url) { return <img src={profile.avatar_url} alt={profile.full_name || 'Avatar'} className="h-10 w-10 rounded-full object-cover" />; }
  return (
    <div className="h-10 w-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold select-none">
      {getInitials(profile?.full_name)}
    </div>
  );
}

export function Sidebar({ user, profile }: SidebarProps) {
  const pathname = usePathname();
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  return (
    <aside className="w-64 bg-white border-r flex flex-col shadow-sm">
      <div className="flex items-center gap-3 px-6 py-4 border-b">
        <div className="h-8 w-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-lg select-none">M</div>
        <h1 className="text-xl font-bold text-gray-800">Momentum</h1>
      </div>
      <nav className="flex-1 px-4 py-4 space-y-1.5">
        {navItems.map((item) => {
          const isActive = pathname.startsWith(item.href);
          return (
            <Link key={item.label} href={item.href} className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${ isActive ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900' }`}>
              <item.icon className="h-5 w-5" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>
      <div className="px-4 py-4 border-t relative">
        {isUserMenuOpen && (
          <div className="absolute bottom-full left-4 right-4 mb-2 bg-white rounded-lg shadow-lg border z-10 animate-fade-in-up">
            <form action="/auth/signout" method="post" className="w-full">
              <button type="submit" className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-600 hover:bg-red-50 rounded-md transition-colors">
                <LuLogOut />
                Cerrar Sesión
              </button>
            </form>
          </div>
        )}
        <button onClick={() => setIsUserMenuOpen(!isUserMenuOpen)} className="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-gray-100 transition-colors">
          <UserAvatar profile={profile} />
          <div className="flex-1 text-left overflow-hidden">
            <p className="font-semibold text-sm text-gray-800 truncate">{profile?.full_name || user.email}</p>
            <p className="text-xs text-gray-500">Ver menú</p>
          </div>
          <LuEllipsisVertical className="text-gray-500" />
        </button>
      </div>
    </aside>
  );
}
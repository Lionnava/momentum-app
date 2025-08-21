'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { IconType } from 'react-icons'

// Importa los iconos que ya usas y el nuevo para la administración
import { LuLayoutDashboard, LuClipboardList } from 'react-icons/lu'
import { BsChatDots } from 'react-icons/bs';
import { FiUsers } from 'react-icons/fi'; // <-- Icono para Administración

import { cn } from '@/lib/utils'

// Definimos la estructura de un enlace de navegación
type NavLinkItem = {
  href: string;
  label: string;
  icon: IconType;
  roles: string[]; // Roles permitidos para ver este enlace
};

// Centralizamos todos los enlaces para fácil mantenimiento
const navLinks: NavLinkItem[] = [
  { 
    href: '/dashboard', 
    label: 'Dashboard', 
    icon: LuLayoutDashboard,
    roles: ['employee', 'manager', 'supermanager'] 
  },
  { 
    href: '/tasks', 
    label: 'Tareas', 
    icon: LuClipboardList,
    roles: ['employee', 'manager', 'supermanager'] 
  },
  { 
    href: '/chat', 
    label: 'Chat', 
    icon: BsChatDots,
    roles: ['employee', 'manager', 'supermanager']
  },
  // --- AÑADIMOS EL NUEVO ENLACE DE ADMINISTRACIÓN AQUÍ ---
  { 
    href: '/admin/invite', // Apunta a la página de invitación que creamos
    label: 'Administración', 
    icon: FiUsers,
    // ¡CRÍTICO! Solo visible para estos roles.
    roles: ['manager', 'supermanager'] 
  },
];

export function Sidebar({ userRole }: { userRole: string }) {
  const pathname = usePathname();

  return (
    <aside className="hidden md:flex w-64 flex-col bg-white border-r">
      {/* Puedes colocar tu logo o nombre de la app aquí */}
      <div className="p-4 border-b">
        <h1 className="text-2xl font-bold text-gray-800">Momentum</h1>
      </div>
      <nav className="flex-1 flex flex-col gap-2 p-4 mt-4">
        {navLinks.map((link) => {
          // Si el rol del usuario no está incluido en la lista de roles del enlace, no lo renderizamos.
          if (!link.roles.includes(userRole)) {
            return null;
          }

          // Lógica para determinar si el enlace está activo
          const isActive = (link.href === '/dashboard' && pathname === link.href) ||
                           (link.href !== '/dashboard' && pathname.startsWith(link.href));

          const Icon = link.icon;

          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                'flex items-center gap-3 rounded-lg px-3 py-2 text-gray-700 transition-all hover:bg-gray-100 font-medium',
                isActive && 'bg-blue-600 text-white hover:bg-blue-700'
              )}
            >
              <Icon className="h-5 w-5" />
              {link.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
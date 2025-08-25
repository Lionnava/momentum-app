'use client'

import Link from 'next/link';
import { usePathname } from 'next/navigation';

type SvgComponent = React.FC<React.SVGProps<SVGSVGElement>>;

type NavLinkItem = {
  href: string;
  label: string;
  icon: SvgComponent;
  roles: string[];
};

// --- ICONOS SVG COMO COMPONENTES ---
const IconDashboard = (props: React.SVGProps<SVGSVGElement>) => ( <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><rect width="7" height="9" x="3" y="3" rx="1"/><rect width="7"height="5" x="14" y="3" rx="1"/><rect width="7" height="9" x="14" y="12" rx="1"/><rect width="7" height="5" x="3" y="16" rx="1"/></svg> );
const IconTasks = (props: React.SVGProps<SVGSVGElement>) => ( <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/><path d="M9.5 13a2.5 2.5 0 0 1-5 0V9"/><path d="M19.5 13a2.5 2.5 0 0 1-5 0V9"/></svg> );
const IconChat = (props: React.SVGProps<SVGSVGElement>) => ( <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg> );
const IconAdmin = (props: React.SVGProps<SVGSVGElement>) => ( <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg> );
const IconFilePlus = (props: React.SVGProps<SVGSVGElement>) => ( <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/><path d="M9 15h6"/><path d="M12 12v6"/></svg> );
const IconReports = (props: React.SVGProps<SVGSVGElement>) => ( <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M15.5 2H8.6c-.4 0-.8.2-1.1.5-.3.3-.5.7-.5 1.1V21c0 .6.4 1 1 1h12c.6 0 1-.4 1-1V8.5L15.5 2z"/><path d="M15 2v6h6"/></svg> );

const navLinks: NavLinkItem[] = [
  { href: '/dashboard', label: 'Dashboard', icon: IconDashboard, roles: ['employee', 'manager', 'supermanager'] },
  { href: '/tasks', label: 'Tareas', icon: IconTasks, roles: ['employee', 'manager', 'supermanager'] },
  { href: '/proposals/new', label: 'Nueva Propuesta', icon: IconFilePlus, roles: ['employee', 'manager', 'supermanager'] },
  { href: '/chat', label: 'Chat', icon: IconChat, roles: ['employee', 'manager', 'supermanager']},
  { href: '/reports', label: 'Reportes', icon: IconReports, roles: ['manager', 'supermanager'] },
  { href: '/admin/invite', label: 'Administración', icon: IconAdmin, roles: ['manager', 'supermanager'] },
];

export function Sidebar({ userRole }: { userRole: string }) {
  const pathname = usePathname();
  const cleanUserRole = userRole.trim().toLowerCase();

  return (
    <aside className="hidden md:flex w-64 flex-col bg-white border-r">
      <div className="flex items-center justify-center h-20 border-b px-6"><Link href="/dashboard" className="flex items-center gap-2"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6 text-blue-600"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg><span className="text-xl font-bold text-slate-800">Momentum</span></Link></div>
      <nav className="flex-1 flex flex-col gap-1 p-4">
        {navLinks.map((link) => {
          if (!link.roles.includes(cleanUserRole)) return null;
          const isActive = (link.href === '/dashboard' && pathname === link.href) || (link.href !== '/dashboard' && pathname.startsWith(link.href));
          const Icon = link.icon;
          const linkClasses = `flex items-center gap-3 rounded-md px-3 py-2 text-gray-700 transition-all hover:bg-gray-100 font-medium ${isActive ? 'bg-blue-600 text-white hover:bg-blue-700' : ''}`;
          return ( <Link key={link.href} href={link.href} className={linkClasses}><Icon className="h-5 w-5" />{link.label}</Link> );
        })}
      </nav>
    </aside>
  );
}
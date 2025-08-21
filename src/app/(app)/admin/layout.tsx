import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';

/**
 * Este layout actúa como un guardián de seguridad para todas las rutas
 * que se encuentren dentro de la carpeta /admin.
 */
export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = createClient();

  // 1. Obtener el usuario actual de la sesión.
  const { data: { user } } = await supabase.auth.getUser();

  // Si no hay usuario, redirigir a la página de login.
  if (!user) {
    return redirect('/login');
  }
  
  // 2. Obtener el perfil del usuario para verificar su rol.
  const { data: profile } = await supabase
    .from('profiles')
    .select('rol')
    .eq('id', user.id)
    .single();
    
  // 3. ¡La lógica de autorización!
  //    Si el rol del usuario no está en la lista de roles permitidos, redirigir.
  const isAdmin = profile?.rol === 'manager' || profile?.rol === 'supermanager';

  if (!isAdmin) {
    return redirect('/dashboard');
  }

  // 4. Si el usuario tiene el rol correcto, le permitimos ver el contenido.
  return <>{children}</>;
}
import { ReactNode } from 'react';

// Este layout ya no necesita lógica de seguridad,
// ya que la Sidebar en el layout principal se encargará de ocultar
// el enlace para los roles no autorizados.
// La protección a nivel de ruta (si alguien escribe la URL manualmente)
// la podemos manejar en el middleware.

export default function AdminLayout({
  children,
}: {
  children: ReactNode;
}) {
  return <>{children}</>;
}
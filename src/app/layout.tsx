// src/app/layout.tsx
import './globals.css'; // ¡ESTA LÍNEA CARGA TODOS LOS ESTILOS!
import { Toaster } from 'react-hot-toast';

export const metadata = {
  title: 'Momentum App',
  description: 'Gestión de tareas y colaboración para equipos.',
};

// Forzando un nuevo despliegue en Vercel
export default function RootLayout({ ...

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body className="antialiased">
        {/* 'children' será cualquier página activa, incluyendo los layouts (public) y (app) */}
        {children}
        <Toaster 
          position="top-center"
          reverseOrder={false}
        />
      </body>
    </html>
  );
}
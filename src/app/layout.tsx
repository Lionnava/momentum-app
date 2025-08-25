import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import "./print.css"; // Si tienes este archivo para los reportes

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Momentum App | Plataforma de Gestión",
  description: "Planificador de Tareas y Proyectos",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className="h-full">
      <body className={`${inter.className} h-full bg-gray-50 text-slate-800`}>
        {/* El contenido de todos los demás layouts y páginas se inyectará aquí */}
        {children}
      </body>
    </html>
  );
}
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

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
    <html lang="es" className="h-full bg-gray-50">
      <body className={`${inter.className} text-slate-800`}>
        {children}
      </body>
    </html>
  );
}
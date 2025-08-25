import React from 'react';
import { Footer } from '@/components/layout/Footer'; // Corregido: Importación nombrada
import { Header } from '@/components/layout/Header';

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header userProfile={null} /> {/* Pasamos null porque no hay usuario en el layout público */}
      <main className="flex-grow flex items-center justify-center">
        {children}
      </main>
      <Footer />
    </div>
  );
}
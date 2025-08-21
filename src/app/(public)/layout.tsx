import React from 'react';
import { Footer } from '@/components/layout/Footer';
import { Header } from '@/components/layout/Header';

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-screen">
      <Header userProfile={null} />
      <main className="flex-grow flex items-center justify-center p-4">
        {children}
      </main>
      <Footer />
    </div>
  );
}
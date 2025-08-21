// src/components/ui/Logo.tsx
import Image from 'next/image';
import Link from 'next/link';

export function Logo() {
  return (
    <Link href="/" className="flex items-center gap-3" aria-label="Página de inicio de Momentum">
      <Image
        src="/logo.png" // Asegúrate de tener este archivo en tu carpeta /public
        alt="Momentum Logo"
        width={40}
        height={40}
        className="rounded-lg"
        priority // Carga esta imagen con prioridad ya que está en el header
      />
      <span className="text-2xl font-bold text-slate-800 hidden sm:inline">
        Momentum
      </span>
    </Link>
  );
}
// src/app/page.tsx

import Image from 'next/image';
import Link from 'next/link';

export default function HomePage() {
  return (
    // Ajustamos el minHeight para la nueva altura del header (5rem) y footer (aprox 4rem)
    <div 
        className="flex flex-col items-center justify-center text-center px-4 py-16"
        style={{ minHeight: 'calc(100vh - 9rem)' }} 
    >
      <Image
        src="/logo.png"
        alt="Momentum App Logo"
        width={370} // 1. Aumentamos significativamente el tamaño a 250px
        height={370}
        className="h-80 w-80 mb-5 shadow-x0 rounded-full" // h-48 y w-48 (192px), sombra más pronunciada
        priority
      />
      <h1 className="text-5xl md:text-7xl font-extrabold text-slate-900 tracking-tight">
        Bienvenido a <span className="text-blue-600">Momentum</span>
      </h1>
      <p className="mt-3 max-w-2xl text-xl text-slate-600">
        Tu centro de control para la planificación y seguimiento de tareas. Organiza, colabora y alcanza tus objetivos con claridad.
      </p>
      <div className="mt-12 flex flex-col sm:flex-row gap-4">
        <Link 
          href="/dashboard" 
          className="inline-block text-lg px-10 py-4 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition-all transform hover:scale-105"
        >
          Ir al Dashboard
        </Link>
        <Link 
          href="/login" 
          className="inline-block text-lg px-10 py-4 bg-white text-slate-800 font-semibold border border-slate-300 rounded-lg shadow-sm hover:bg-slate-50 transition-all transform hover:scale-105"
        >
          Iniciar Sesión
        </Link>
      </div>
    </div>
  );
}
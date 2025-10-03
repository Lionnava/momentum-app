// src/app/page.tsx
import Link from 'next/link';
import Image from 'next/image';

export default function HomePage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 text-center p-8">
      <header className="flex flex-col items-center">
        {/* Asume que tienes tu logo en public/logo.png */}
        <Image src="/logo.png" alt="Logo de la Secretaría" width={120} height={120} className="mb-6 rounded-full shadow-md" />
        <h1 className="text-4xl md:text-5xl font-bold text-gray-800">
          Bienvenido a Momentum
        </h1>
        <p className="mt-4 max-w-2xl text-lg text-gray-600">
          Tu centro de control para la planificación y seguimiento de tareas. Organiza, colabora y alcanza tus objetivos con claridad.
        </p>
      </header>
      <div className="mt-10 flex flex-col sm:flex-row gap-4">
        <Link 
          href="/dashboard"
          className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition-transform transform hover:scale-105"
        >
          Ir al Dashboard
        </Link>
        <Link 
          href="/login"
          className="px-6 py-3 bg-white text-blue-600 font-semibold rounded-lg shadow-md hover:bg-gray-100 ring-1 ring-inset ring-gray-200 transition-transform transform hover:scale-105"
        >
          Iniciar Sesión
        </Link>
      </div>
    </div>
  );
}
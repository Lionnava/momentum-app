// src/app/error.tsx
'use client'; 

import { useEffect } from 'react';
import Link from 'next/link';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Puedes registrar el error en un servicio de monitoreo como Sentry, LogRocket, etc.
    console.error(error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center">
      <h2 className="text-2xl font-bold mb-4">¡Ups! Algo salió mal.</h2>
      <p className="text-gray-600 mb-6">
        Hemos encontrado un error inesperado. Por favor, intenta de nuevo.
      </p>
      <div className="flex gap-4">
        <button
          onClick={() => reset()}
          className="px-4 py-2 font-semibold text-white bg-blue-600 rounded-md hover:bg-blue-700"
        >
          Intentar de nuevo
        </button>
        <Link href="/dashboard" className="px-4 py-2 font-semibold text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300">
          Ir al Dashboard
        </Link>
      </div>
    </div>
  );
}
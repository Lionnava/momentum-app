import Link from 'next/link';

export function Footer() {
  const currentYear = new Date().getFullYear();
  return (
    <footer className="w-full bg-white border-t border-gray-200 py-4 px-4 sm:px-6 lg:px-8">
      <div className="container mx-auto text-center text-xs text-gray-500">
        <p>
          Creado y Desarrollado por Ing. LionelNava21, para uso exclusivo, experimental de la Secretaría de Educación Superior, adscrita a la Gobernación Bolivariana del estado Zulia. Bajo convenio Mutuo.
        </p>
        <p className="mt-1">
          Se reservan todos los derechos. © {currentYear} | Versión: 1.0.0-beta
        </p>
      </div>
    </footer>
  );
}
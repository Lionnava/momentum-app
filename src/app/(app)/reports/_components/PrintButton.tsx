'use client';

import { LuPrinter } from 'react-icons/lu';

export default function PrintButton() {
  return (
    <button
      onClick={() => window.print()}
      className="flex items-center gap-2 px-4 py-2 bg-gray-700 text-white font-semibold rounded-md hover:bg-gray-800 no-print"
    >
      <LuPrinter className="h-5 w-5" />
      Imprimir Reporte
    </button>
  );
}
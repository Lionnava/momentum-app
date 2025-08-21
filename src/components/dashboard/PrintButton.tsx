// src/components/dashboard/PrintButton.tsx

'use client';

export function PrintButton() {
    const handlePrint = () => {
        window.print();
    };

    return (
        <button
            onClick={handlePrint}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 transition-colors"
        >
            Imprimir / Guardar como PDF
        </button>
    );
}
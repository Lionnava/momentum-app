// src/components/proposals/ProposalForm.tsx

'use client';

import { useTransition } from 'react';
import { createProposalAction } from '@/app/(private)/proposals/actions';
import type { Division } from '@/lib/types';

interface ProposalFormProps {
    divisions: Division[];
}

export function ProposalForm({ divisions }: ProposalFormProps) {
    const [isPending, startTransition] = useTransition();

    const handleSubmit = (formData: FormData) => {
        startTransition(() => {
            createProposalAction(formData);
        });
    };

    return (
        <form action={handleSubmit} className="space-y-4">
            <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700">Título de la Propuesta</label>
                <input 
                    type="text" 
                    id="title" 
                    name="title" 
                    required 
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
            </div>

            <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700">Descripción y Justificación</label>
                <textarea 
                    id="description" 
                    name="description" 
                    rows={5} 
                    required 
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
            </div>
            
            <div>
                <label htmlFor="division" className="block text-sm font-medium text-gray-700">División Relevante</label>
                {/* --- CORRECCIÓN AQUÍ --- */}
                <select 
                    id="division" 
                    name="division" 
                    required 
                    defaultValue="" // 1. Añadimos defaultValue aquí
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                >
                     {/* 2. Quitamos 'selected' de esta opción */}
                     <option value="" disabled>Selecciona una división</option>
                    {divisions.map(division => (
                        <option key={division.id} value={division.id}>{division.name}</option>
                    ))}
                </select>
            </div>

            <button 
                type="submit" 
                disabled={isPending} 
                className="w-full flex justify-center py-2 px-4 mt-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:bg-green-400"
            >
                {isPending ? 'Enviando Propuesta...' : 'Enviar Propuesta'}
            </button>
        </form>
    );
}
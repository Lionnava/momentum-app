'use client';

// --- INICIO DE LA CORRECCIÓN DEFINITIVA PARA REACT 19 ---
import { useActionState } from 'react';         // Correcto: se importa desde 'react'
import { useFormStatus } from 'react-dom';      // Correcto: se importa desde 'react-dom'
// --- FIN DE LA CORRECCIÓN ---

import { createProposal, type FormState } from '../actions';
import type { Tables } from '@/lib/types';

type Division = Pick<Tables<'divisions'>, 'id' | 'name'>;

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button 
      type="submit" 
      disabled={pending} 
      className="w-full px-4 py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 disabled:opacity-50"
    >
      {pending ? 'Enviando...' : 'Enviar Propuesta'}
    </button>
  );
}

export default function NewProposalForm({ divisions }: { divisions: Division[] }) {
  const initialState: FormState = { message: '', success: false };
  // Usamos el hook con el nombre y la importación correctos para React 19
  const [state, formAction] = useActionState(createProposal, initialState);

  return (
    <form action={formAction} className="space-y-6">
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700">Título de la Propuesta</label>
        <input 
          type="text" 
          id="title" 
          name="title" 
          required 
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
        />
      </div>
      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700">Descripción</label>
        <textarea 
          id="description" 
          name="description" 
          rows={4} 
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
        ></textarea>
      </div>
      <div>
        <label htmlFor="division_id" className="block text-sm font-medium text-gray-700">División</label>
        <select 
          id="division_id" 
          name="division_id" 
          required 
          defaultValue="" 
          className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
        >
          <option value="" disabled>Selecciona una división</option>
          {divisions.map((div) => (
            <option key={div.id} value={div.id}>{div.name}</option>
          ))}
        </select>
      </div>
      {state?.message && <p className={`text-sm p-3 rounded-md text-center ${state.success ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>{state.message}</p>}
      <SubmitButton />
    </form>
  );
}
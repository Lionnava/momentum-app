'use client';

// --- INICIO DE LA CORRECCIÓN PARA REACT 19 ---
import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
// --- FIN DE LA CORRECCIÓN ---

import { addMilestone, type MilestoneFormState } from '@/app/(app)/tasks/actions';
import type { Tables } from '@/lib/types';
import Image from 'next/image';
import { LuPaperclip } from 'react-icons/lu';

type Milestone = Tables<'milestones'>;

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending} className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 disabled:opacity-50">
      {pending ? 'Añadiendo...' : 'Añadir Hito'}
    </button>
  );
}

export default function MilestoneManager({ taskId, initialMilestones }: { taskId: string; initialMilestones: Milestone[] }) {
  const initialState: MilestoneFormState = { message: '', success: false };
  // Usamos el hook correcto para React 19
  const [state, formAction] = useActionState(addMilestone, initialState);

  return (
    <div className="space-y-6">
      <form action={formAction} className="space-y-4 p-4 border border-dashed rounded-lg">
        <h4 className="font-semibold text-gray-800">Añadir Nuevo Hito</h4>
        <input type="hidden" name="taskId" value={taskId} />
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">Descripción</label>
          <textarea id="description" name="description" rows={3} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"></textarea>
        </div>
        <div>
          <label htmlFor="image" className="block text-sm font-medium text-gray-700">Imagen de Respaldo (Opcional)</label>
          <input type="file" id="image" name="image" accept="image/*" className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"/>
        </div>
        {state?.message && <p className={`text-sm ${state.success ? 'text-green-600' : 'text-red-600'}`}>{state.message}</p>}
        <SubmitButton />
      </form>

      <div>
        <h4 className="font-semibold text-gray-800 mb-4">Hitos Registrados</h4>
        <ul className="space-y-4">
          {initialMilestones.length > 0 ? (
            initialMilestones.map((milestone) => (
              <li key={milestone.id} className="p-4 border rounded-md flex gap-4 items-start">
                {milestone.image_url ? (
                  <Image src={milestone.image_url} alt="Hito" width={100} height={100} className="rounded-md object-cover" />
                ) : (
                  <div className="w-[100px] h-[100px] bg-gray-100 rounded-md flex items-center justify-center">
                    <LuPaperclip className="h-8 w-8 text-gray-400" />
                  </div>
                )}
                <div className="flex-1">
                  <p className="text-sm text-gray-800">{milestone.description}</p>
                  <p className="text-xs text-gray-400 mt-2">Registrado: {new Date(milestone.created_at).toLocaleString('es-ES')}</p>
                </div>
              </li>
            ))
          ) : (
            <p className="text-sm text-gray-500 text-center py-4">No hay hitos registrados para esta tarea.</p>
          )}
        </ul>
      </div>
    </div>
  );
}
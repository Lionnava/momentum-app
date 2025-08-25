'use client';

import { useFormState, useFormStatus } from 'react-dom';
// --- INICIO DE LA CORRECCIÓN ---
import { assignTask, type AssignTaskState } from '@/app/(app)/tasks/actions';
// --- FIN DE LA CORRECCIÓN ---
import type { Tables } from '@/lib/types';

type Employee = Pick<Tables<'profiles'>, 'id' | 'full_name'>;

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending} className="px-3 py-1 text-xs font-semibold bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50">
      {pending ? 'Asignando...' : 'Asignar'}
    </button>
  );
}

export default function AssignTaskForm({ taskId, employees }: { taskId: string, employees: Employee[] }) {
  const initialState: AssignTaskState = null;
  const [state, formAction] = useFormState(assignTask, initialState);

  return (
    <form action={formAction} className="flex items-center gap-2">
      <input type="hidden" name="taskId" value={taskId} />
      <select
        name="assigneeId"
        required
        defaultValue=""
        className="block w-full pl-3 pr-8 py-1 text-sm border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 rounded-md"
      >
        <option value="" disabled>Seleccionar empleado...</option>
        {employees.map(emp => (
          <option key={emp.id} value={emp.id}>{emp.full_name}</option>
        ))}
      </select>
      <SubmitButton />
      {state?.success && <p className="text-xs text-green-600 ml-2">{state.success}</p>}
      {state?.error && <p className="text-xs text-red-600 ml-2">{state.error}</p>}
    </form>
  );
}
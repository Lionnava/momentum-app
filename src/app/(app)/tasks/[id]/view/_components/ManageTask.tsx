'use client';

import { useOptimistic, useRef, useTransition } from 'react';
import { LuCheck, LuCircle, LuPlus, LuTrash2 } from 'react-icons/lu';
// --- INICIO DE LA CORRECCIÓN DE IMPORTACIONES ---
import { addMilestone, toggleMilestone, deleteMilestone, updateTaskProgress } from '@/app/(app)/tasks/actions';
// --- FIN DE LA CORRECCIÓN ---
import { useRouter } from 'next/navigation';

type Milestone = { id: string; description: string; is_completed: boolean; task_id: string; created_at: string };
type Task = { id: string; progress_percent: number; milestones: Milestone[] };

export function ManageTask({ task }: { task: Task }) {
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);
  const [isPending, startTransition] = useTransition();
  const [optimisticMilestones, setOptimisticMilestones] = useOptimistic(
    task.milestones,
    (state, newMilestones: Milestone[]) => newMilestones
  );

  const handleProgressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newProgress = parseInt(e.target.value, 10);
    startTransition(() => {
      updateTaskProgress(task.id, newProgress);
    });
  };
  
  const handleToggleMilestone = (milestone: Milestone) => {
    const newMilestones = optimisticMilestones.map(m =>
        m.id === milestone.id ? { ...m, is_completed: !m.is_completed } : m
    );
    startTransition(() => {
        setOptimisticMilestones(newMilestones);
        toggleMilestone(milestone.id, milestone.is_completed, task.id);
    });
  }

  const handleDeleteMilestone = (milestoneId: string) => {
      const newMilestones = optimisticMilestones.filter(m => m.id !== milestoneId);
      startTransition(() => {
          setOptimisticMilestones(newMilestones);
          deleteMilestone(milestoneId, task.id);
      });
  }

  return (
    <div className="space-y-6">
      <div>
        <label htmlFor="progress" className="block text-sm font-medium text-gray-700">Progreso General ({task.progress_percent}%)</label>
        <input
          type="range"
          id="progress"
          name="progress_percent"
          min="0"
          max="100"
          defaultValue={task.progress_percent}
          onChange={handleProgressChange}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
        />
      </div>

      <div className="space-y-4">
        <h3 className="font-semibold">Hitos</h3>
        {optimisticMilestones.map(milestone => (
          <div key={milestone.id} className="flex items-center gap-3">
            <button onClick={() => handleToggleMilestone(milestone)}>
              {milestone.is_completed ? <LuCheck className="text-green-500" /> : <LuCircle className="text-gray-400" />}
            </button>
            <p className={`flex-1 ${milestone.is_completed ? 'line-through text-gray-500' : ''}`}>
              {milestone.description}
            </p>
            <button onClick={() => handleDeleteMilestone(milestone.id)} className="text-gray-400 hover:text-red-500">
              <LuTrash2 />
            </button>
          </div>
        ))}
      </div>
      
      <form ref={formRef} action={async (formData) => {
          // Lógica para añadir hito (si la necesitas aquí)
      }}>
          {/* ... formulario para añadir un nuevo hito ... */}
      </form>
    </div>
  );
}
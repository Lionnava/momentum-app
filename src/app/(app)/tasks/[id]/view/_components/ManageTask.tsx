// src/app/(app)/tasks/[id]/view/_components/ManageTask.tsx
'use client'

import { useOptimistic, useRef, useTransition } from 'react';
import { LuCheck, LuCircle, LuPlus, LuTrash2 } from 'react-icons/lu';
import { useRouter } from 'next/navigation';

type Milestone = { id: string; description: string; is_completed: boolean; task_id: string; created_at: string };
type Task = { id: string; title: string; progress_percent: number; milestones?: Milestone[] };

export function ManageTask({ task }: { task: Task }) {
    const router = useRouter();
    const formRef = useRef<HTMLFormElement>(null);
    const [isPending, startTransition] = useTransition();

    const milestones = task.milestones ?? [];

    const [optimisticMilestones, setOptimisticMilestones] = useOptimistic(
        milestones,
        (state, { action, milestone }: { action: 'ADD' | 'TOGGLE' | 'DELETE', milestone: Milestone }) => {
            switch (action) {
                case 'ADD':
                    return [...state, milestone];
                case 'TOGGLE':
                    return state.map(m => m.id === milestone.id ? { ...m, is_completed: milestone.is_completed } : m);
                case 'DELETE':
                    return state.filter(m => m.id !== milestone.id);
                default:
                    return state;
            }
        }
    );

    const updateProgress = async (currentMilestones: Milestone[]) => {
        const completedCount = currentMilestones.filter(m => m.is_completed).length;
        const totalCount = currentMilestones.length;
        const newProgress = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;
        await updateTaskProgressAction(task.id, newProgress);
    };

    const handleToggleMilestone = (milestone: Milestone) => {
        startTransition(async () => {
            const newIsCompleted = !milestone.is_completed;
            const newOptimisticState = { action: 'TOGGLE' as const, milestone: { ...milestone, is_completed: newIsCompleted } };
            setOptimisticMilestones(newOptimisticState);
            await toggleMilestoneAction(milestone.id, newIsCompleted);
            const newMilestones = milestones.map(m => m.id === milestone.id ? { ...m, is_completed: newIsCompleted } : m);
            await updateProgress(newMilestones);
            router.refresh();
        });
    };

    const handleDeleteMilestone = (milestone: Milestone) => {
        startTransition(async () => {
            setOptimisticMilestones({ action: 'DELETE' as const, milestone });
            await deleteMilestoneAction(milestone.id);
            const newMilestones = milestones.filter(m => m.id !== milestone.id);
            await updateProgress(newMilestones);
        });
    };

    return (
        <div>
            <h1 className="text-2xl font-bold mb-2">{task.title}</h1>
            <p className="text-gray-500 mb-6">Gestiona los hitos para completar esta tarea.</p>

            <div className="w-full bg-gray-200 rounded-full h-2.5 mb-6">
                <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${task.progress_percent}%` }}></div>
            </div>

            <div className="space-y-3">
                {optimisticMilestones.map(milestone => (
                    <div key={milestone.id} className="group flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50">
                        <button onClick={() => handleToggleMilestone(milestone)} className="flex items-center gap-3 text-left flex-1">
                            {milestone.is_completed ? <LuCheck className="h-5 w-5 text-green-500" /> : <LuCircle className="h-5 w-5 text-gray-400" />}
                            <span className={milestone.is_completed ? 'line-through text-gray-500' : ''}>
                                {milestone.description}
                            </span>
                        </button>
                        <form action={() => handleDeleteMilestone(milestone)}>
                            <button type="submit" className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-500 p-1">
                                <LuTrash2 size={16} />
                            </button>
                        </form>
                    </div>
                ))}
            </div>

            <form 
                ref={formRef}
                action={async (formData) => {
                    const description = formData.get('description') as string;
                    if (!description) return;
                    startTransition(async () => {
                        const tempId = crypto.randomUUID();
                        const newMilestone = { id: tempId, description, is_completed: false, task_id: task.id, created_at: new Date().toISOString() };
                        setOptimisticMilestones({ action: 'ADD' as const, milestone: newMilestone });
                        formRef.current?.reset();
                        await addMilestoneAction(task.id, formData);
                        await updateProgress([...milestones, newMilestone]);
                    });
                }} 
                className="mt-6 flex gap-2"
            >
                <input name="description" placeholder="Añadir nuevo hito..." className="flex-1 border-gray-300 rounded-md p-2" required />
                <button type="submit" className="bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700"><LuPlus /></button>
            </form>
        </div>
    );
}
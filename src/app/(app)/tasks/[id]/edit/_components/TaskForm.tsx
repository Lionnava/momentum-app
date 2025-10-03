// src/app/(app)/tasks/[id]/edit/_components/TaskForm.tsx
'use client';

import { useRef, useTransition } from 'react';
import { useFormStatus } from 'react-dom';
import Link from 'next/link';
import toast from 'react-hot-toast';
import Image from 'next/image';
import { updateTask, createMilestone, toggleMilestoneCompletion, deleteMilestone, addImageToMilestone, deleteMilestoneImage, updateTaskImage, deleteTaskImage } from '@/app/actions';
import { LuTrash2, LuPlus, LuSquare, LuSquareCheck, LuCamera, LuExternalLink, LuX, LuImagePlus, LuImageOff } from 'react-icons/lu';

// Tipos
type Profile = { id: string; full_name: string | null; };
type Milestone = { id: string; description: string; is_completed: boolean; image_url: string | null; };
type Task = { id: string; title: string; description: string | null; assignee_id: string | null; status: string; progress_image_url: string | null; milestones: Milestone[]; };
type TaskFormProps = { task: Task; users: Profile[]; };

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending} className="inline-flex items-center rounded-md bg-blue-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-blue-700 disabled:opacity-50">
      {pending ? 'Guardando...' : 'Guardar Cambios'}
    </button>
  );
}

export function TaskForm({ task, users }: TaskFormProps) {
  const [isPending, startTransition] = useTransition();
  const newMilestoneFormRef = useRef<HTMLFormElement>(null);

  const handleUpdateTask = async (formData: FormData) => {
    toast.loading('Guardando cambios...');
    const result = await updateTask(task.id, formData);
    toast.dismiss();
    if (result?.error) {
      toast.error(result.error);
    } else if (result?.success) {
      toast.success(result.success);
    }
  };
  
  const handleAddMilestone = async (formData: FormData) => {
    const result = await createMilestone(task.id, formData);
    if (result?.error) toast.error(result.error);
    if (result?.success) { toast.success(result.success); newMilestoneFormRef.current?.reset(); }
  };

  const handleImageUpload = async (milestone: Milestone, formData: FormData) => {
    toast.loading('Subiendo imagen...');
    const result = await addImageToMilestone(milestone.id, task.id, milestone.image_url, formData);
    toast.dismiss();
    if (result?.error) toast.error(result.error);
    if (result?.success) toast.success(result.success);
  };
  
  const handleImageDelete = async (milestone: Milestone) => {
    if (!milestone.image_url) return;
    toast.loading('Eliminando imagen...');
    const result = await deleteMilestoneImage(milestone.id, task.id, milestone.image_url);
    toast.dismiss();
    if (result?.error) toast.error(result.error);
    if (result?.success) toast.success(result.success);
  };

  const handleTaskImageUpload = async (formData: FormData) => {
    toast.loading('Subiendo imagen principal...');
    const result = await updateTaskImage(task.id, task.progress_image_url, formData);
    toast.dismiss();
    if (result?.error) toast.error(result.error);
    if (result?.success) toast.success(result.success);
  };

  const handleTaskImageDelete = async () => {
    if (!task.progress_image_url) return;
    toast.loading('Eliminando imagen principal...');
    const result = await deleteTaskImage(task.id, task.progress_image_url);
    toast.dismiss();
    if (result?.error) toast.error(result.error);
    if (result?.success) toast.success(result.success);
  };

  return (
    <div>
      <div className="space-y-2 border-b pb-8 mb-8">
        <label className="block text-sm font-medium text-gray-700">Imagen de la Tarea</label>
        <div className="mt-2 flex items-center gap-4">
          {task.progress_image_url ? (
            <div className="relative group">
              <Image src={task.progress_image_url} alt="Imagen de la tarea" width={128} height={128} className="h-32 w-32 rounded-md object-cover" />
              <form action={handleTaskImageDelete} className="absolute top-1 right-1">
                <button type="submit" className="p-1.5 bg-red-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                  <LuImageOff size={16} />
                </button>
              </form>
            </div>
          ) : (
            <div className="h-32 w-32 rounded-md border-2 border-dashed border-gray-300 flex items-center justify-center">
              <LuImagePlus size={32} className="text-gray-400" />
            </div>
          )}
          <form action={handleTaskImageUpload}>
            <input type="file" name="image" id="task-image-upload" accept="image/*" className="sr-only" onChange={e => e.currentTarget.form?.requestSubmit()} />
            <label htmlFor="task-image-upload" className="cursor-pointer rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50">
              {task.progress_image_url ? 'Cambiar' : 'Subir imagen'}
            </label>
          </form>
        </div>
      </div>
      <form action={handleUpdateTask} className="space-y-6 border-b pb-8 mb-8">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700">Título</label>
          <input type="text" name="title" id="title" defaultValue={task.title} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm" required />
        </div>
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">Descripción</label>
          <textarea name="description" id="description" defaultValue={task.description ?? ''} rows={4} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="assignee_id" className="block text-sm font-medium text-gray-700">Asignado a</label>
            <select name="assignee_id" id="assignee_id" defaultValue={task.assignee_id ?? ''} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm" required>
              <option value="">Sin asignar</option>
              {users.map(user => (
                <option key={user.id} value={user.id}>{user.full_name}</option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="status" className="block text-sm font-medium text-gray-700">Estado</label>
            <select name="status" id="status" defaultValue={task.status} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm" required>
              <option>Pendiente</option>
              <option>En Progreso</option>
              <option>Completada</option>
            </select>
          </div>
        </div>
        <div className="flex justify-end gap-4">
          <Link href="/tasks" className="rounded-md bg-white py-2 px-4 text-sm font-medium text-gray-700 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50">
            Cancelar
          </Link>
          <SubmitButton />
        </div>
      </form>
      <div>
        <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">Hitos</h3>
        <div className="space-y-3 mb-6">
          {task.milestones.map((milestone) => (
            <div key={milestone.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-md">
              <form action={() => startTransition(() => toggleMilestoneCompletion(milestone.id, milestone.is_completed, task.id))}>
                <button type="submit" className="p-1">
                  {milestone.is_completed ? <LuSquareCheck className="text-blue-600" size={20} /> : <LuSquare className="text-gray-400" size={20} />}
                </button>
              </form>
              <span className={`flex-grow ${milestone.is_completed ? 'line-through text-gray-500' : ''}`}>{milestone.description}</span>
              {milestone.image_url ? (
                <>
                  <a href={milestone.image_url} target="_blank" rel="noopener noreferrer" className="p-1 text-gray-500 hover:text-blue-600"><LuExternalLink size={18} /></a>
                  <form action={() => handleImageDelete(milestone)}>
                    <button type="submit" className="p-1 text-gray-500 hover:text-red-600"><LuX size={18} /></button>
                  </form>
                </>
              ) : (
                <form action={(fd) => handleImageUpload(milestone, fd)} className="relative">
                  <input type="file" name="image" id={`file-${milestone.id}`} accept="image/*" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" onChange={(e) => e.currentTarget.form?.requestSubmit()} />
                  <label htmlFor={`file-${milestone.id}`} className="p-1 text-gray-500 hover:text-blue-600 cursor-pointer"><LuCamera size={18} /></label>
                </form>
              )}
              <form action={() => startTransition(() => deleteMilestone(milestone.id, task.id))}>
                <button type="submit" className="p-1 text-gray-500 hover:text-red-600"><LuTrash2 size={18} /></button>
              </form>
            </div>
          ))}
        </div>
        <form ref={newMilestoneFormRef} action={handleAddMilestone} className="flex items-center gap-3">
          <LuPlus className="text-gray-400" size={20} />
          <input type="text" name="description" placeholder="Añadir nuevo hito..." className="flex-grow block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm" required />
          <button type="submit" className="inline-flex items-center rounded-md bg-emerald-600 py-1.5 px-3 text-sm font-medium text-white shadow-sm hover:bg-emerald-700">Añadir</button>
        </form>
      </div>
    </div>
  );
}
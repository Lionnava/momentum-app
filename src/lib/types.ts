// src/lib/types.ts

// Asegúrate de que este tipo refleje tu esquema de base de datos 'tasks'
// y las tablas relacionadas 'profiles' y 'divisions'.
export type Task = {
    id: string;
    created_at: string;
    title: string; // Asumimos que el título no puede ser null en una tarea real
    description: string | null;
    status: 'Pendiente' | 'En Progreso' | 'En Revisión' | 'Completada'; // ¡Añadimos 'En Revisión'!
    priority: 'Baja' | 'Media' | 'Alta';
    due_date: string | null;
    assigned_to: string | null; // UUID del usuario asignado
    division_id: string | null; // UUID de la división

    // Campos relacionados que podemos obtener con .select('*, profiles(full_name), divisions(name)')
    profiles?: {
        full_name: string | null;
    } | null;
    divisions?: {
        name: string;
    } | null;
};
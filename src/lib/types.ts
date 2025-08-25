// src/lib/types.ts

export interface User {
    id: string;
    collectionId: string;
    name: string;
    email: string;
    avatar: string;
    position: string;
    rol: 'employee' | 'manager' | 'supermanager';
}

export interface Division {
    id: string;
    collectionId: string;
    name: string;
    manager: string;
    expand?: {
        manager?: User;
    }
}

// --- INTERFAZ CORREGIDA ---
// Esta es la versión que coincide con tu consulta en el Dashboard.
export interface Task {
  id: string;
  name: string; // Se cambió 'titulo' por 'name'
  status: string;
  due_date: string | null;
  progress_percent: number | null;
  // Estos son los objetos que te devuelve Supabase con el '.select()'
  divisions: { name: string | null } | null;
  assignee: { full_name: string | null } | null;
  milestones: { image_url: string | null }[];
}

export interface Proposal {
    id: string;
    collectionId: string;
    title: string;
    description: string;
    proposer: string;
    status: 'Pendiente' | 'Pendiente Manager' | 'Pendiente superManager' | 'Aprobada' | 'Rechazada';
    division: string;
    decision_notes?: string;
    expand?: {
        proposer?: User;
        division?: Division;
    };
}

export interface Advance {
    id: string;
    collectionId: string;
    description: string;
    is_completed: boolean;
    task: string;
}
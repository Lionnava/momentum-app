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

export interface Task {
    id: string;
    collectionId: string;
    titulo: string;
    notes?: string;
    status: 'Pendiente' | 'En Progreso' | 'Completada';
    progress_percent: number;
    due_date: string;
    assignee: string;
    division: string;
    depends_on: string;
    expand?: {
        assignee?: User;
        division?: Division;
        depends_on?: Task;
    };
}

export interface Proposal {
    id: string;
    collectionId: string;
    title: string;
    description: string;
    proposer: string;
    // --- ESTADOS ACTUALIZADOS ---
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
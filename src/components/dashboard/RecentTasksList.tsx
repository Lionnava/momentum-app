// src/components/dashboard/RecentTasksList.tsx

import type { Task } from "@/lib/types";
import Link from 'next/link';

// Pequeño componente para mostrar una "píldora" de estado con color
function StatusBadge({ status }: { status: string }) {
    const baseClasses = "px-2 py-1 text-xs font-medium rounded-full";
    let colorClasses = "";

    switch (status) {
        case 'Pendiente':
            colorClasses = "bg-yellow-100 text-yellow-800";
            break;
        case 'En Progreso':
            colorClasses = "bg-green-100 text-green-800";
            break;
        case 'Completada':
            colorClasses = "bg-blue-100 text-blue-800";
            break;
        default:
            colorClasses = "bg-gray-100 text-gray-800";
    }

    return <span className={`${baseClasses} ${colorClasses}`}>{status}</span>;
}


interface RecentTasksListProps {
    tasks: Task[];
}

export function RecentTasksList({ tasks }: RecentTasksListProps) {
    return (
        // Usamos las mismas clases de tarjeta que en los otros componentes del dashboard
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-700 mb-4">
                Últimas Tareas Actualizadas
            </h3>
            <ul className="space-y-3">
                {tasks.map((task) => (
                    <li key={task.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-md hover:bg-gray-100 transition-colors">
                        <div>
                            <p className="font-semibold text-gray-800">{task.titulo}</p>
                            <p className="text-sm text-gray-500">
                                {task.expand?.division?.name || 'Sin División'}
                            </p>
                        </div>
                        <StatusBadge status={task.status} />
                    </li>
                ))}
            </ul>
        </div>
    );
}
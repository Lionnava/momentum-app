// src/components/dashboard/PerformanceCharts.tsx
import { TaskStatusDoughnutChart } from './TaskStatusDoughnutChart';
import { TasksCompletedBarChart } from './TasksCompletedBarChart';
// --- CORRECCIÓN AQUÍ: Usamos el nombre de icono correcto ---
import { LuChartBar } from 'react-icons/lu'; 

type PerformanceChartsProps = {
  taskStats: {
    completed: number;
    inProgress: number;
    pending: number;
  };
  weeklyActivity: {
    labels: string[];
    data: number[];
  };
};

export const PerformanceCharts = ({ taskStats, weeklyActivity }: PerformanceChartsProps) => {
  const totalTasks = taskStats.completed + taskStats.inProgress + taskStats.pending;
  
  // Comprobamos si hay alguna actividad en los datos del gráfico de barras
  const hasWeeklyActivity = weeklyActivity.data.some(value => value > 0);

  return (
    <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-5 gap-8">
      {/* Gráfico de Dona (sin cambios) */}
      <div className="md:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-slate-200/80">
        <h3 className="text-lg font-semibold text-slate-800 mb-4">
          Distribución de Tareas
        </h3>
        <div className="h-64 relative">
          {totalTasks > 0 ? (
            <TaskStatusDoughnutChart data={taskStats} />
          ) : (
            <p className="flex items-center justify-center h-full text-slate-500">No hay datos para mostrar</p>
          )}
        </div>
      </div>

      {/* Gráfico de Barras */}
      <div className="md:col-span-3 bg-white p-6 rounded-xl shadow-sm border border-slate-200/80">
        <h3 className="text-lg font-semibold text-slate-800 mb-4">
          Actividad Semanal
        </h3>
        <div className="h-64 relative">
           {hasWeeklyActivity ? (
             <TasksCompletedBarChart chartData={weeklyActivity} />
           ) : (
             <div className="flex flex-col items-center justify-center h-full text-slate-500">
               {/* --- CORRECCIÓN AQUÍ: Usamos el icono correcto --- */}
               <LuChartBar className="h-10 w-10 text-slate-400 mb-2" />
               <p className="font-medium">No ha habido actividad esta semana</p>
               <p className="text-sm text-slate-400">Las tareas completadas aparecerán aquí.</p>
             </div>
           )}
        </div>
      </div>
    </div>
  );
};
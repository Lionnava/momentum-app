// src/components/dashboard/TaskStatusDoughnutChart.tsx
'use client'; // MUY IMPORTANTE: Los gráficos deben ser Client Components

import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

type ChartProps = {
  data: {
    completed: number;
    inProgress: number;
    pending: number;
  };
};

export const TaskStatusDoughnutChart = ({ data: chartData }: ChartProps) => {
  const data = {
    labels: ['Completadas', 'En Progreso', 'Pendientes'],
    datasets: [
      {
        label: 'Tareas',
        data: [chartData.completed, chartData.inProgress, chartData.pending],
        backgroundColor: [
          '#10b981', // emerald-500
          '#3b82f6', // blue-500
          '#f59e0b', // amber-500
        ],
        borderColor: '#ffffff', // Borde blanco para separar secciones
        borderWidth: 2,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '70%', // Esto crea el "agujero" de la dona
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
          boxWidth: 12,
          padding: 20,
          font: {
            size: 12,
          },
        },
      },
    },
  };

  return <Doughnut data={data} options={options} />;
};
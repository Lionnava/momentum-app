// src/components/dashboard/TasksCompletedBarChart.tsx
'use client'; 

import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

// DEFINIMOS LAS PROPS QUE ESPERAMOS
type ChartProps = {
  chartData: {
    labels: string[];
    data: number[];
  };
};

export const TasksCompletedBarChart = ({ chartData }: ChartProps) => {
  // CREAMOS EL OBJETO DE DATOS DINÁMICAMENTE
  const data = {
    labels: chartData.labels,
    datasets: [{
        label: 'Tareas Completadas',
        data: chartData.data, // USAMOS LOS DATOS REALES
        backgroundColor: '#3b82f6', // blue-500
        borderRadius: 4,
    }],
  };
  
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: { stepSize: 1 },
      },
      x: { grid: { display: false } }
    },
  };

  return <Bar options={options} data={data} />;
};
'use client';

import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';

interface ChartData {
  name: string;
  value: number;
}

const COLORS: { [key: string]: string } = {
  'Pendiente': '#f59e0b', // amber-500
  'En Progreso': '#3b82f6', // blue-500
  'En Revisión': '#8b5cf6', // violet-500
  'Completada': '#22c55e', // green-500
};

export default function StatusPieChart({ data }: { data: ChartData[] }) {
  if (!data || data.length === 0) {
    return <p className="text-center text-gray-500">No hay datos para mostrar.</p>;
  }

  return (
    <ResponsiveContainer width="100%" height={250}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          labelLine={false}
          outerRadius={80}
          fill="#8884d8"
          dataKey="value"
          nameKey="name"
          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
        >
          {data.map((entry) => (
            <Cell key={`cell-${entry.name}`} fill={COLORS[entry.name] || '#8884d8'} />
          ))}
        </Pie>
        <Tooltip />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );
}
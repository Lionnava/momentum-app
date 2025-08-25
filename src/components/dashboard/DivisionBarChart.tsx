'use client';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface ChartData {
  name: string;
  "Nº de Tareas": number;
}

export default function DivisionBarChart({ data }: { data: ChartData[] }) {
   if (!data || data.length === 0) {
    return <p className="text-center text-gray-500">No hay datos para mostrar.</p>;
  }
  
  return (
    <ResponsiveContainer width="100%" height={250}>
      <BarChart
        data={data}
        margin={{ top: 5, right: 20, left: -10, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis allowDecimals={false} />
        <Tooltip />
        <Legend />
        <Bar dataKey="Nº de Tareas" fill="#8884d8" />
      </BarChart>
    </ResponsiveContainer>
  );
}
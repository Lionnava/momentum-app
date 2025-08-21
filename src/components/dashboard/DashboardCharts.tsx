// src/components/dashboard/DashboardCharts.tsx

'use client'; // ¡Esencial para que Recharts funcione!

import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import type { Task } from '@/lib/types';

// Definimos las props que recibirá el componente
interface DashboardChartsProps {
    tasksByStatus: { name: string; value: number }[];
    tasksByDivision: { name: string; value: number }[];
    averageProgress: number;
}

const COLORS = ['#FFBB28', '#00C49F', '#0088FE']; // Amarillo para Pendiente, Verde para En Progreso, Azul para Completada

export function DashboardCharts({ tasksByStatus, tasksByDivision, averageProgress }: DashboardChartsProps) {
    return (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '2rem', padding: '2rem' }}>
            
            {/* Gráfico de Torta: Tareas por Estado */}
            <div style={{ border: '1px solid #eee', padding: '1rem', borderRadius: '8px' }}>
                <h3 style={{ textAlign: 'center' }}>Tareas por Estado</h3>
                <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                        <Pie data={tasksByStatus} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} fill="#8884d8" label>
                            {tasksByStatus.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Pie>
                        <Tooltip />
                        <Legend />
                    </PieChart>
                </ResponsiveContainer>
            </div>

            {/* Gráfico de Barras: Tareas por División */}
            <div style={{ border: '1px solid #eee', padding: '1rem', borderRadius: '8px' }}>
                <h3 style={{ textAlign: 'center' }}>Tareas por División</h3>
                 <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={tasksByDivision}>
                        <XAxis dataKey="name" />
                        <YAxis allowDecimals={false} />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="value" fill="#82ca9d" name="Nº de Tareas" />
                    </BarChart>
                </ResponsiveContainer>
            </div>

            {/* Tarjeta de KPI: Progreso Promedio */}
             <div style={{ border: '1px solid #eee', padding: '1rem', borderRadius: '8px', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                <h3 style={{ textAlign: 'center', margin: 0 }}>Progreso Promedio Total</h3>
                <p style={{ fontSize: '4rem', fontWeight: 'bold', margin: '1rem 0', color: '#00C49F' }}>
                    {averageProgress.toFixed(0)}%
                </p>
            </div>

        </div>
    );
}
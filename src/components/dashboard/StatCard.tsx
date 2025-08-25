// src/components/dashboard/StatCard.tsx

import React from 'react';

interface StatCardProps {
  title: string;
  value: number | string;
  icon: React.ReactNode;
}

export default function StatCard({ title, value, icon }: StatCardProps) {
  return (
    <div className="bg-white p-4 rounded-lg shadow-sm flex items-center space-x-4">
      <div className="bg-blue-100 text-blue-600 p-3 rounded-full">
        {icon}
      </div>
      <div>
        <p className="text-sm text-gray-500">{title}</p>
        <p className="text-2xl font-bold">{value}</p>
      </div>
    </div>
  );
}
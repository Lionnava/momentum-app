// src/components/dashboard/StatCard.tsx
import { LuArrowUpRight, LuArrowDownRight } from 'react-icons/lu';

type StatCardProps = {
  title: string;
  value: number | string;
  icon: React.ElementType;
  color: {
    bg: string; // ej: 'bg-blue-100'
    text: string; // ej: 'text-blue-600'
  };
  change?: number; // Opcional: cambio porcentual
};

const StatCard = ({ title, value, icon: Icon, color, change }: StatCardProps) => {
  const isPositive = change !== undefined && change >= 0;

  return (
    <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-200/80">
      <div className="flex items-center justify-between mb-2">
        <p className="text-sm font-medium text-slate-500">{title}</p>
        <div className={`p-2 rounded-lg ${color.bg}`}>
          <Icon className={`h-5 w-5 ${color.text}`} />
        </div>
      </div>
      <div>
        <p className="text-3xl font-bold text-slate-900">{value}</p>
        {change !== undefined && (
          <div className="flex items-center gap-1 mt-1">
            <span className={`flex items-center text-xs font-semibold ${isPositive ? 'text-emerald-500' : 'text-red-500'}`}>
              {isPositive ? <LuArrowUpRight className="h-3 w-3" /> : <LuArrowDownRight className="h-3 w-3" />}
              {Math.abs(change)}%
            </span>
            <span className="text-xs text-slate-400">vs la semana pasada</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default StatCard;
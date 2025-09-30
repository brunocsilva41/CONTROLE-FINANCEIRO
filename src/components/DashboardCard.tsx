import { LucideIcon } from 'lucide-react';

interface DashboardCardProps {
  title: string;
  value: string;
  icon: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  className?: string;
}

export function DashboardCard({ title, value, icon: Icon, trend, className = '' }: DashboardCardProps) {
  return (
    <div className={`bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 ${className}`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">{title}</p>
          <h3 className="text-2xl font-bold mt-2 text-gray-900 dark:text-white">{value}</h3>
          {trend && (
            <p className={`text-sm mt-2 ${trend.isPositive ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
              {trend.isPositive ? '↑' : '↓'} {Math.abs(trend.value)}%
            </p>
          )}
        </div>
        <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <Icon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
        </div>
      </div>
    </div>
  );
}
import type { ComponentType, SVGProps } from 'react';

interface StatsCardProps {
    title: string;
    value: string | number;
    subtitle?: string;
    icon: ComponentType<SVGProps<SVGSVGElement> & { size?: number | string }>;
    trend?: {
        value: number;
        isPositive: boolean;
    };
    color?: 'orange' | 'blue' | 'green' | 'purple' | 'slate' | 'brandBlue' | 'brandYellow';
}

const colorVariants = {
    orange: 'bg-yellow-50 text-[#F5B500] border-yellow-100',
    blue: 'bg-blue-50 text-blue-600 border-blue-100',
    green: 'bg-green-50 text-green-600 border-green-100',
    purple: 'bg-purple-50 text-purple-600 border-purple-100',
    slate: 'bg-slate-50 text-slate-600 border-slate-100',
    brandBlue: 'bg-[#2E6A9C]/5 text-[#2E6A9C] border-[#2E6A9C]/10',
    brandYellow: 'bg-[#F5B500]/5 text-[#F5B500] border-[#F5B500]/10',
};

const iconBgVariants = {
    orange: 'bg-[#F5B500]/10',
    blue: 'bg-blue-500/10',
    green: 'bg-green-500/10',
    purple: 'bg-purple-500/10',
    slate: 'bg-slate-500/10',
    brandBlue: 'bg-[#2E6A9C]/10',
    brandYellow: 'bg-[#F5B500]/10',
};

export function StatsCard({
    title,
    value,
    subtitle,
    icon: Icon,
    trend,
    color = 'orange'
}: StatsCardProps) {
    return (
        <div className={`
      p-6 rounded-xl border bg-white
      shadow-sm hover:shadow-md transition-shadow duration-200
    `}>
            <div className="flex items-start justify-between">
                <div>
                    <p className="text-sm font-medium text-gray-500 uppercase tracking-wide">
                        {title}
                    </p>
                    <p
                        className="text-3xl font-bold text-slate-800 mt-2"
                        style={{ fontFamily: 'Teko, sans-serif' }}
                    >
                        {value}
                    </p>
                    {subtitle && (
                        <p className="text-sm text-gray-500 mt-1">{subtitle}</p>
                    )}
                    {trend && (
                        <div className={`flex items-center gap-1 mt-2 text-sm ${trend.isPositive ? 'text-green-600' : 'text-[#2E6A9C]'
                            }`}>
                            <span>{trend.isPositive ? '↑' : '↓'}</span>
                            <span>{Math.abs(trend.value)}%</span>
                            <span className="text-gray-400">vs. mês anterior</span>
                        </div>
                    )}
                </div>
                <div className={`p-3 rounded-xl ${iconBgVariants[color]}`}>
                    <Icon size={24} className={colorVariants[color].split(' ')[1]} />
                </div>
            </div>
        </div>
    );
}

export default StatsCard;

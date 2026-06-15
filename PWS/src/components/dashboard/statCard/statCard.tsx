import React from 'react';
import { clsx } from 'clsx';
import { HiOutlineTrendingUp } from 'react-icons/hi';
import type { IconType } from 'react-icons';

interface StatCardProps {
  title: string;
  value: string;
  subtitle: string;
  trend?: string;
  icon: IconType;
  color: 'purple' | 'pink' | 'green';
}

const StatCard: React.FC<StatCardProps> = ({ title, value, subtitle, trend, icon: Icon, color }) => {
  const colorStyles = {
    purple: 'bg-gradient-purple text-white',
    pink: 'bg-gradient-pink-light text-white',
    green: 'bg-gradient-green text-white',
  };

  const iconBgStyles = {
    purple: 'bg-white/20',
    pink: 'bg-white/20',
    green: 'bg-white/20',
  };

  return (
    <div className={clsx("p-8 rounded-3xl border border-white/20 overflow-hidden relative shadow-sm flex flex-col justify-between h-48 group", colorStyles[color])}>
      <div className="flex items-start justify-between relative z-10">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-[0.2em] opacity-80 mb-6 font-dm">{title}</p>
          <h3 className="text-5xl font-bold font-playfair mb-4 leading-none tracking-tight">{value}</h3>
          {trend ? (
            <p className="text-[14px] font-regular opacity-80 flex items-center gap-1.5 font-dm">
              <HiOutlineTrendingUp className="size-4" /> {trend}
            </p>
          ) : (
            <p className="text-[14px] font-regular opacity-80 font-dm">{subtitle}</p>
          )}
        </div>

        <div className={clsx("size-12 rounded-xl flex items-center justify-center backdrop-blur-md", iconBgStyles[color])}>
          <Icon className="size-8" />
        </div>
      </div>
    </div>
  );
};

export default StatCard;

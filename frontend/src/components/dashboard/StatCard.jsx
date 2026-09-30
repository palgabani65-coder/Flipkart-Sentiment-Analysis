import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

export const StatCard = ({
  icon: Icon,
  label,
  value,
  subValue,
  change,
  changePeriod = 'vs last period',
  index = 0,
  sparklinePoints = [20, 18, 22, 15, 24, 12, 28, 8, 30]
}) => {
  const isPositive = change > 0;
  const isNeutral = change === 0 || change === undefined;

  const width = 140;
  const height = 32;
  const points = sparklinePoints && sparklinePoints.length > 0 ? sparklinePoints : [10, 14, 12, 18, 16, 22, 20, 26, 28];

  const pathD = points.map((val, i) => {
    const x = (i / (points.length - 1)) * width;
    const y = height - (val / 35) * height;
    return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
  }).join(' ');

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.3 }}
      className="p-5 rounded-2xl border border-[#E5E7EB] dark:border-[#2E3132] bg-white dark:bg-[#191C1D] shadow-[0_4px_20px_rgba(0,0,0,0.04)] dark:shadow-none flex flex-col justify-between group hover:border-[#D1D5DB] dark:hover:border-[#33373B] transition-all font-sans"
    >
      {/* Top Header: Label & Icon */}
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-medium text-[#5C5F62] dark:text-[#A0A4A8] uppercase tracking-wider font-mono">
          {label}
        </span>
        <div className="w-8 h-8 rounded-lg bg-[#F8F9FA] dark:bg-[#242729] border border-[#E5E7EB] dark:border-[#33373B] text-[#000000] dark:text-white flex items-center justify-center shrink-0">
          {Icon && <Icon className="w-4 h-4 text-[#000000] dark:text-white" />}
        </div>
      </div>

      {/* Main Metric Value */}
      <div className="mt-3 space-y-1">
        <div className="flex items-baseline gap-2">
          <span className="text-2xl sm:text-3xl font-semibold text-[#000000] dark:text-white tracking-tight">
            {value}
          </span>
          {subValue && (
            <span className="text-xs font-mono text-[#5C5F62] dark:text-[#A0A4A8]">
              ({subValue})
            </span>
          )}
        </div>
      </div>

      {/* Footer: Change badge + SVG micro sparkline */}
      <div className="mt-3 pt-2 flex items-center justify-between border-t border-[#E5E7EB] dark:border-[#2E3132]">
        {change !== undefined ? (
          <div className={`inline-flex items-center gap-1 text-[11px] font-mono px-2 py-0.5 rounded-md ${isPositive
              ? 'bg-[#F3F4F5] dark:bg-[#242729] text-[#000000] dark:text-white border border-[#E5E7EB] dark:border-[#33373B]'
              : isNeutral
                ? 'bg-[#F8F9FA] dark:bg-[#242729] text-[#5C5F62] dark:text-[#A0A4A8] border border-[#E5E7EB] dark:border-[#33373B]'
                : 'bg-[#FFDAD6]/60 dark:bg-rose-950/30 text-[#BA1A1A] dark:text-red-400 border border-[#FFB4AB]/60 dark:border-rose-900/40'
            }`}>
            {isPositive ? <TrendingUp className="w-3 h-3" /> : isNeutral ? <Minus className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
            <span>{isPositive ? '+' : ''}{change}%</span>
          </div>
        ) : (
          <span className="text-[10px] text-[#5C5F62] dark:text-[#A0A4A8] font-mono">No prev period</span>
        )}

        {/* Micro Sparkline Curve */}
        <div className="w-20 h-6 relative opacity-70 group-hover:opacity-100 transition-opacity">
          <svg className="w-full h-full overflow-visible" viewBox={`0 0 ${width} ${height}`}>
            <path
              d={pathD}
              fill="none"
              stroke="currentColor"
              className="text-[#000000] dark:text-white"
              strokeWidth="1.75"
              strokeLinecap="round"
            />
          </svg>
        </div>
      </div>
    </motion.div>
  );
};

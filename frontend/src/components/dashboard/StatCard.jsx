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
      className="p-5 rounded-2xl border border-[#E6E4F0] dark:border-[#282836] bg-white dark:bg-[#1C1C26] shadow-xs flex flex-col justify-between group hover:border-[#111116]/30 dark:hover:border-[#8B5CF6]/40 transition-all"
    >
      {/* Top Header: Label & Icon */}
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold text-slate-500 dark:text-[#9494A8] uppercase tracking-wider font-mono">
          {label}
        </span>
        <div className="w-8 h-8 rounded-xl bg-slate-100 dark:bg-[#242432] text-slate-900 dark:text-white flex items-center justify-center shrink-0">
          {Icon && <Icon className="w-4 h-4" />}
        </div>
      </div>

      {/* Main Metric Value */}
      <div className="mt-3 space-y-1">
        <div className="flex items-baseline gap-2">
          <span className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white font-mono tracking-tight">
            {value}
          </span>
          {subValue && (
            <span className="text-xs font-bold text-slate-500 dark:text-[#9494A8] font-mono">
              ({subValue})
            </span>
          )}
        </div>
      </div>

      {/* Footer: Change badge + SVG micro sparkline */}
      <div className="mt-3 pt-2 flex items-center justify-between border-t border-slate-100 dark:border-[#282836]/50">
        {change !== undefined ? (
          <div className={`inline-flex items-center gap-1 text-[11px] font-extrabold font-mono px-2 py-0.5 rounded-full ${
            isPositive
              ? 'bg-[#DCFCE7] text-[#15803D] dark:bg-emerald-950/40 dark:text-[#22C55E]'
              : isNeutral
              ? 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
              : 'bg-[#FEE2E2] text-[#B91C1C] dark:bg-rose-950/40 dark:text-[#EF4444]'
          }`}>
            {isPositive ? <TrendingUp className="w-3 h-3" /> : isNeutral ? <Minus className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
            <span>{isPositive ? '+' : ''}{change}%</span>
          </div>
        ) : (
          <span className="text-[10px] text-slate-400 font-mono">No prev period</span>
        )}

        {/* Micro Sparkline Curve */}
        <div className="w-20 h-6 relative opacity-80 group-hover:opacity-100 transition-opacity">
          <svg className="w-full h-full overflow-visible" viewBox={`0 0 ${width} ${height}`}>
            <path
              d={pathD}
              fill="none"
              stroke={isPositive ? '#16A34A' : '#DC2626'}
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        </div>
      </div>
    </motion.div>
  );
};

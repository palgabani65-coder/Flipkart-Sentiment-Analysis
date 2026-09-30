import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown } from 'lucide-react';

export const StatCard = ({ title, value, change, changeType = 'positive', icon: Icon, description }) => {
  return (
    <motion.div
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      className="p-6 rounded-2xl bg-white border border-[#E5E7EB] shadow-[0_4px_20px_rgba(0,0,0,0.04)] hover:border-[#D1D5DB] transition-all font-sans"
    >
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-medium text-[#5C5F62] uppercase tracking-wider font-mono">{title}</span>
        {Icon && (
          <div className="p-2 rounded-lg bg-[#F8F9FA] border border-[#E5E7EB] text-[#000000]">
            <Icon className="w-4 h-4 text-[#000000]" />
          </div>
        )}
      </div>

      <div className="mt-4 flex items-baseline justify-between">
        <span className="text-3xl font-semibold tracking-tight text-[#000000]">
          {value}
        </span>

        {change && (
          <div
            className={`flex items-center text-[11px] font-mono px-2 py-0.5 rounded-md ${changeType === 'positive'
                ? 'bg-[#F3F4F5] text-[#000000] border border-[#E5E7EB]'
                : 'bg-[#FFDAD6]/60 text-[#BA1A1A] border border-[#FFB4AB]/60'
              }`}
          >
            {changeType === 'positive' ? (
              <TrendingUp className="w-3 h-3 mr-1" />
            ) : (
              <TrendingDown className="w-3 h-3 mr-1" />
            )}
            {change}
          </div>
        )}
      </div>

      {description && (
        <p className="mt-2 text-xs text-[#5C5F62]">{description}</p>
      )}
    </motion.div>
  );
};

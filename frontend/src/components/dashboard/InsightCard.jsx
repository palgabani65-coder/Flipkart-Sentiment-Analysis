import React from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, TrendingUp, Lightbulb, Star, ArrowRight } from 'lucide-react';

const typeConfig = {
  issue: {
    icon: AlertTriangle,
    color: 'text-[#F87171]',
    bg: 'bg-[#881337]/40',
    border: 'border-[#E11D48]/30',
    badge: 'bg-[#881337]/60 text-[#F87171]',
    label: 'Product Issue',
    dot: 'bg-rose-500',
  },
  strength: {
    icon: TrendingUp,
    color: 'text-[#C4B5FD]',
    bg: 'bg-[#8B5CF6]/20',
    border: 'border-[#8B5CF6]/30',
    badge: 'bg-[#8B5CF6]/20 text-[#C4B5FD]',
    label: 'Customer Strength',
    dot: 'bg-[#C4B5FD]',
  },
  trend: {
    icon: Lightbulb,
    color: 'text-amber-400',
    bg: 'bg-amber-950/40',
    border: 'border-amber-800/40',
    badge: 'bg-amber-950/60 text-amber-400',
    label: 'Emerging Trend',
    dot: 'bg-amber-400',
  },
  opportunity: {
    icon: Star,
    color: 'text-[#A78BFA]',
    bg: 'bg-[#8B5CF6]/20',
    border: 'border-[#8B5CF6]/30',
    badge: 'bg-[#8B5CF6]/20 text-[#A78BFA]',
    label: 'Opportunity',
    dot: 'bg-[#A78BFA]',
  },
};

export const InsightCard = ({ 
  type = 'issue', 
  title, 
  description, 
  mentionRate, 
  recommendation,
  index = 0 
}) => {
  const config = typeConfig[type] || typeConfig.issue;
  const Icon = config.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08, duration: 0.35 }}
      className={`p-6 rounded-3xl bg-white dark:bg-[#12101B] border border-slate-200/80 dark:border-[#1E1A2E] shadow-xs hover:border-[#8B5CF6]/40 transition-all space-y-4`}
    >
      {/* Type badge */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className={`w-8 h-8 rounded-xl ${config.bg} flex items-center justify-center ${config.color}`}>
            <Icon className="w-4 h-4" />
          </div>
          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider font-mono ${config.badge}`}>
            {config.label}
          </span>
        </div>
        <div className={`w-2.5 h-2.5 rounded-full ${config.dot} animate-pulse`} />
      </div>

      {/* Content */}
      <div className="space-y-2">
        <h4 className="text-sm font-extrabold text-slate-900 dark:text-white leading-snug">
          "{title}"
        </h4>
        <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
          {description}
        </p>
      </div>

      {/* Mention rate */}
      {mentionRate && (
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-mono font-bold text-slate-400 uppercase">Mentioned in:</span>
          <span className={`text-xs font-extrabold ${config.color}`}>{mentionRate}</span>
        </div>
      )}

      {/* Recommendation */}
      {recommendation && (
        <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-[#171424] border border-slate-100 dark:border-[#1E1A2E]">
          <p className="text-[10px] font-bold uppercase text-[#C4B5FD] mb-1 font-mono">Recommendation</p>
          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
            {recommendation}
          </p>
        </div>
      )}
    </motion.div>
  );
};

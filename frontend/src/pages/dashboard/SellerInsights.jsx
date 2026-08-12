import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  Sparkles, Heart, AlertTriangle, TrendingUp, TrendingDown, 
  ArrowRight, CheckCircle2, XCircle, MessageSquareText
} from 'lucide-react';

const WHAT_CUSTOMERS_LOVE = [
  { topic: 'Battery Life', mentions: '4,823 mentions', score: 96 },
  { topic: 'Sound Quality', mentions: '3,921 mentions', score: 94 },
  { topic: 'Value for Money', mentions: '3,114 mentions', score: 88 },
  { topic: 'Design', mentions: '2,481 mentions', score: 92 },
];

const CUSTOMER_PAIN_POINTS = [
  { topic: 'Connectivity', mentions: '1,842 mentions', score: 18 },
  { topic: 'Battery Drain', mentions: '1,324 mentions', score: 24 },
  { topic: 'Packaging', mentions: '921 mentions', score: 32 },
  { topic: 'Durability', mentions: '742 mentions', score: 38 },
];

const TRENDING_TOPICS = [
  { name: 'Connectivity', trend: 'up', direction: '↑' },
  { name: 'Battery', trend: 'up', direction: '↑' },
  { name: 'Packaging', trend: 'down', direction: '↓' },
  { name: 'Sound Quality', trend: 'neutral', direction: '→' },
];

export const SellerInsights = () => {
  const navigate = useNavigate();

  return (
    <div className="space-y-8 pb-10">
      
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <span className="px-2.5 py-0.5 rounded-full bg-[#111116] dark:bg-[#2563EB] text-white text-[10px] font-extrabold uppercase font-mono tracking-wider flex items-center gap-1">
            ✦ AI Customer Voice
          </span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
          Customer Insights & Actionable Feedback
        </h2>
        <p className="text-xs text-slate-500 dark:text-[#9494A8] mt-1 font-medium">
          Understand what customers love, what problems they report, and what your store should improve.
        </p>
      </div>

      {/* ✦ AI RECOMMENDATION BOX (Section 7 Blueprint) */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-6 rounded-2xl bg-[#111116] dark:bg-[#1C1C26] text-white shadow-xl border border-slate-800 dark:border-[#282836] space-y-4"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-400 animate-pulse" />
            <span className="text-xs font-bold uppercase tracking-wider text-amber-400 font-mono">
              ✦ AI RECOMMENDATION
            </span>
          </div>
          <span className="px-2.5 py-0.5 rounded-full bg-white/10 text-white text-[10px] font-mono">
            High Priority Action
          </span>
        </div>

        <p className="text-sm sm:text-base font-extrabold leading-relaxed text-slate-100">
          Connectivity is the most frequently mentioned issue in negative reviews. Consider investigating Bluetooth stability and connection reliability.
        </p>

        <div className="flex items-center justify-between pt-2 border-t border-slate-800 dark:border-slate-800">
          <span className="text-xs text-slate-400 font-mono">Mentions detected across 1,842 negative review logs</span>
          <button
            onClick={() => navigate('/dashboard/reviews')}
            className="px-4 py-2 rounded-xl bg-white text-slate-900 font-extrabold text-xs flex items-center gap-1.5 hover:bg-slate-100 transition-all cursor-pointer shadow-md"
          >
            <span>View Related Reviews</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </motion.div>

      {/* Grid: What Customers Love & Customer Pain Points */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* What Customers Love ❤️ */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="p-6 rounded-2xl bg-white dark:bg-[#1C1C26] border border-[#E6E4F0] dark:border-[#282836] shadow-xs space-y-4"
        >
          <div className="flex items-center justify-between">
            <h3 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
              <Heart className="w-4.5 h-4.5 text-rose-500 fill-rose-500" />
              What Customers Love ❤️
            </h3>
            <span className="text-xs font-mono font-bold text-[#16A34A] dark:text-[#22C55E]">Positive Praise</span>
          </div>

          <div className="space-y-3">
            {WHAT_CUSTOMERS_LOVE.map((item, i) => (
              <div key={i} className="p-3.5 rounded-xl bg-[#DCFCE7] dark:bg-emerald-950/30 border border-[#BBF7D0] dark:border-emerald-900/40 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-[#15803D] dark:text-[#22C55E] shrink-0" />
                  <span className="text-xs font-bold text-slate-900 dark:text-white">{item.topic}</span>
                </div>
                <span className="text-xs font-mono font-extrabold text-[#15803D] dark:text-[#22C55E]">{item.mentions}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Customer Pain Points ⚠ */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="p-6 rounded-2xl bg-white dark:bg-[#1C1C26] border border-[#E6E4F0] dark:border-[#282836] shadow-xs space-y-4"
        >
          <div className="flex items-center justify-between">
            <h3 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
              <AlertTriangle className="w-4.5 h-4.5 text-[#DC2626]" />
              Customer Pain Points ⚠
            </h3>
            <span className="text-xs font-mono font-bold text-[#DC2626] dark:text-[#EF4444]">Negative Complaints</span>
          </div>

          <div className="space-y-3">
            {CUSTOMER_PAIN_POINTS.map((item, i) => (
              <div key={i} className="p-3.5 rounded-xl bg-[#FEE2E2] dark:bg-rose-950/30 border border-[#FECACA] dark:border-rose-900/40 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <XCircle className="w-4 h-4 text-[#B91C1C] dark:text-[#EF4444] shrink-0" />
                  <span className="text-xs font-bold text-slate-900 dark:text-white">{item.topic}</span>
                </div>
                <span className="text-xs font-mono font-extrabold text-[#B91C1C] dark:text-[#EF4444]">{item.mentions}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Trending Topics Grid */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="p-6 rounded-2xl bg-white dark:bg-[#1C1C26] border border-[#E6E4F0] dark:border-[#282836] shadow-xs space-y-4"
      >
        <h3 className="text-base font-extrabold text-slate-900 dark:text-white">Trending Topics</h3>
        
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 font-mono">
          {TRENDING_TOPICS.map((item, i) => (
            <div key={i} className="p-3.5 rounded-xl bg-slate-50 dark:bg-[#242432] border border-[#E6E4F0] dark:border-[#282836] flex items-center justify-between">
              <span className="text-xs font-bold text-slate-900 dark:text-white">{item.name}</span>
              <span className={`text-base font-black ${
                item.trend === 'up' ? 'text-[#DC2626] dark:text-[#EF4444]' :
                item.trend === 'down' ? 'text-[#16A34A] dark:text-[#22C55E]' : 'text-slate-400'
              }`}>{item.direction}</span>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

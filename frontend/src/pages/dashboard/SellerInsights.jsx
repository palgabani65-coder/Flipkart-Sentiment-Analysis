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
    <div className="space-y-8 pb-10 font-sans text-[#191C1D] dark:text-white transition-colors">

      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <span className="px-2.5 py-0.5 rounded-full bg-[#000000] dark:bg-white text-white dark:text-black text-[10px] font-semibold uppercase font-mono tracking-wider flex items-center gap-1 shadow-xs">
            ✦ AI Customer Voice
          </span>
        </div>
        <h2 className="text-3xl font-bold text-[#191C1D] dark:text-white tracking-tight font-sans">
          Customer Insights & Telemetry
        </h2>
        <p className="text-xs text-[#5C5F62] dark:text-[#A0A4A8] mt-1 font-mono">
          Understand praise patterns, reported defects, and real-time store telemetry.
        </p>
      </div>

      {/* ✦ AI RECOMMENDATION BOX (Nordic Mono) */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-6 rounded-2xl bg-white dark:bg-[#191C1D] text-[#191C1D] dark:text-white shadow-[0_4px_20px_rgba(0,0,0,0.04)] dark:shadow-none border border-[#E5E7EB] dark:border-[#2E3132] space-y-4"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#000000] dark:text-white" />
            <span className="text-xs font-semibold uppercase tracking-wider text-[#000000] dark:text-white font-mono">
              ✦ AI RECOMMENDATION
            </span>
          </div>
          <span className="px-2.5 py-0.5 rounded-md bg-[#F3F4F5] dark:bg-[#242729] border border-[#E5E7EB] dark:border-[#33373B] text-[#191C1D] dark:text-white text-[10px] font-mono">
            High Priority Action
          </span>
        </div>

        <p className="text-sm sm:text-base font-semibold leading-relaxed text-[#191C1D] dark:text-white font-sans">
          Connectivity is the most frequently mentioned issue in negative reviews. Consider investigating Bluetooth stability and connection reliability.
        </p>

        <div className="flex items-center justify-between pt-3 border-t border-[#E5E7EB] dark:border-[#2E3132]">
          <span className="text-xs text-[#5C5F62] dark:text-[#A0A4A8] font-mono">Mentions detected across 1,842 negative review logs</span>
          <button
            onClick={() => navigate('/dashboard/reviews')}
            className="px-4 py-2 rounded-lg bg-[#000000] dark:bg-white text-white dark:text-black text-xs font-mono hover:bg-[#1B1B1B] dark:hover:bg-slate-100 transition-colors flex items-center gap-1.5 shadow-xs cursor-pointer"
          >
            <span>View Related Reviews</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </motion.div>

      {/* Grid: What Customers Love & Customer Pain Points */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* What Customers Love */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="p-6 rounded-2xl bg-white dark:bg-[#191C1D] border border-[#E5E7EB] dark:border-[#2E3132] shadow-[0_4px_20px_rgba(0,0,0,0.04)] dark:shadow-none space-y-4"
        >
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-[#191C1D] dark:text-white flex items-center gap-2 font-sans">
              <Heart className="w-4 h-4 text-[#000000] dark:text-white" />
              What Customers Love
            </h3>
            <span className="text-xs font-mono text-[#5C5F62] dark:text-[#A0A4A8]">Positive Praise</span>
          </div>

          <div className="space-y-2.5">
            {WHAT_CUSTOMERS_LOVE.map((item, i) => (
              <div key={i} className="p-3.5 rounded-xl bg-[#F8F9FA] dark:bg-[#242729] border border-[#E5E7EB] dark:border-[#33373B] flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-[#000000] dark:text-white shrink-0" />
                  <span className="text-xs font-semibold text-[#191C1D] dark:text-white font-sans">{item.topic}</span>
                </div>
                <span className="text-xs font-mono text-[#5C5F62] dark:text-[#A0A4A8]">{item.mentions}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Customer Pain Points */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="p-6 rounded-2xl bg-white dark:bg-[#191C1D] border border-[#E5E7EB] dark:border-[#2E3132] shadow-[0_4px_20px_rgba(0,0,0,0.04)] dark:shadow-none space-y-4"
        >
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-[#191C1D] dark:text-white flex items-center gap-2 font-sans">
              <AlertTriangle className="w-4 h-4 text-[#BA1A1A] dark:text-red-400" />
              Customer Pain Points
            </h3>
            <span className="text-xs font-mono text-[#5C5F62] dark:text-[#A0A4A8]">Defect Logs</span>
          </div>

          <div className="space-y-2.5">
            {CUSTOMER_PAIN_POINTS.map((item, i) => (
              <div key={i} className="p-3.5 rounded-xl bg-[#F8F9FA] dark:bg-[#242729] border border-[#E5E7EB] dark:border-[#33373B] flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <XCircle className="w-4 h-4 text-[#BA1A1A] dark:text-red-400 shrink-0" />
                  <span className="text-xs font-semibold text-[#191C1D] dark:text-white font-sans">{item.topic}</span>
                </div>
                <span className="text-xs font-mono text-[#BA1A1A] dark:text-red-400 font-medium">{item.mentions}</span>
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
        className="p-6 rounded-2xl bg-white dark:bg-[#191C1D] border border-[#E5E7EB] dark:border-[#2E3132] shadow-[0_4px_20px_rgba(0,0,0,0.04)] dark:shadow-none space-y-4"
      >
        <h3 className="text-base font-bold text-[#191C1D] dark:text-white font-sans">Trending Topic Trajectory</h3>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 font-mono">
          {TRENDING_TOPICS.map((item, i) => (
            <div key={i} className="p-3.5 rounded-xl bg-[#F8F9FA] dark:bg-[#242729] border border-[#E5E7EB] dark:border-[#33373B] flex items-center justify-between">
              <span className="text-xs font-medium text-[#191C1D] dark:text-white">{item.name}</span>
              <span className={`text-base font-semibold ${item.trend === 'up' ? 'text-[#BA1A1A] dark:text-red-400' :
                  item.trend === 'down' ? 'text-[#000000] dark:text-white' : 'text-[#5C5F62] dark:text-[#A0A4A8]'
                }`}>{item.direction}</span>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

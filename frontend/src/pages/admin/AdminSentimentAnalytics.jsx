import React from 'react';
import { motion } from 'framer-motion';
import { BarChart3, ThumbsUp, ThumbsDown, Minus } from 'lucide-react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, Cell, Legend
} from 'recharts';
import { StatCard } from '../../components/dashboard/StatCard';
import { SentimentChart } from '../../components/dashboard/SentimentChart';

const TREND = [
  { month: 'Jan', positive: 65, neutral: 20, negative: 15 },
  { month: 'Feb', positive: 68, neutral: 18, negative: 14 },
  { month: 'Mar', positive: 64, neutral: 21, negative: 15 },
  { month: 'Apr', positive: 70, neutral: 17, negative: 13 },
  { month: 'May', positive: 72, neutral: 16, negative: 12 },
  { month: 'Jun', positive: 74, neutral: 15, negative: 11 },
];

const TOP_PRODUCTS = [
  { name: 'MacBook Air M3', positive: 82 },
  { name: 'Sony WH-1000XM5', positive: 79 },
  { name: 'Samsung S24', positive: 74 },
  { name: 'JBL Flip 6', positive: 71 },
  { name: 'OnePlus 12R', positive: 65 },
];

const WORST_PRODUCTS = [
  { name: 'boAt Rockerz 450', negative: 24 },
  { name: 'Redmi Note 13', negative: 20 },
  { name: 'OnePlus 12R', negative: 16 },
  { name: 'Samsung S24', negative: 10 },
];

import { useTheme } from '../../context/ThemeContext';

const ChartTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="px-3.5 py-2.5 rounded-xl bg-white dark:bg-[#191C1D] text-[#191C1D] dark:text-white text-xs shadow-2xl border border-[#E5E7EB] dark:border-[#33373B] font-mono space-y-1.5 min-w-[140px]">
        <p className="font-bold text-[#191C1D] dark:text-white pb-1 border-b border-[#E5E7EB] dark:border-[#2E3132]">{label}</p>
        {payload.map((p) => {
          const color = p.color || p.fill || p.stroke;
          const isBlack = color === '#000000';
          const isWhite = color === '#FFFFFF';
          return (
            <div key={p.dataKey} className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <div 
                  className={`w-2.5 h-2.5 rounded-full shrink-0 ${
                    isBlack 
                      ? 'bg-[#000000] border border-black/20 ring-1 ring-black/10' 
                      : isWhite 
                        ? 'bg-white border border-slate-300' 
                        : 'border border-slate-300 dark:border-slate-600'
                  }`} 
                  style={{ backgroundColor: color }} 
                />
                <span className="capitalize text-[#5C5F62] dark:text-[#A0A4A8]">{p.name || p.dataKey}:</span>
              </div>
              <span className="font-bold text-[#191C1D] dark:text-white">{p.value}%</span>
            </div>
          );
        })}
      </div>
    );
  }
  return null;
};

export const AdminSentimentAnalytics = () => {
  const { isDarkMode } = useTheme();

  return (
    <div className="space-y-6 pb-8 font-sans text-[#191C1D] dark:text-white transition-colors">
      <div>
        <h2 className="text-2xl sm:text-3xl font-bold text-[#191C1D] dark:text-white tracking-tight font-sans">Platform Sentiment Analytics</h2>
        <p className="text-xs text-[#5C5F62] dark:text-[#A0A4A8] mt-1 font-mono">Platform-wide sentiment distribution and trends across all sellers and products.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
        <StatCard icon={BarChart3} label="Total Reviews" value="84,312" change={22.4} index={0} variant="featured" />
        <StatCard icon={ThumbsUp} label="Positive %" value="72%" change={3.1} index={1} />
        <StatCard icon={Minus} label="Neutral %" value="17%" change={-1.4} index={2} />
        <StatCard icon={ThumbsDown} label="Negative %" value="11%" change={-1.7} index={3} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Overall Sentiment */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
          className="p-6 rounded-2xl bg-white dark:bg-[#191C1D] border border-[#E5E7EB] dark:border-[#2E3132] shadow-[0_4px_20px_rgba(0,0,0,0.04)] dark:shadow-none font-sans">
          <h3 className="text-base font-bold text-[#191C1D] dark:text-white mb-5 font-sans">Overall Sentiment</h3>
          <SentimentChart positive={72} neutral={17} negative={11} size={200} />
        </motion.div>

        {/* Sentiment Trend */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 }}
          className="p-6 rounded-2xl bg-white dark:bg-[#191C1D] border border-[#E5E7EB] dark:border-[#2E3132] shadow-[0_4px_20px_rgba(0,0,0,0.04)] dark:shadow-none font-sans">
          <h3 className="text-base font-bold text-[#191C1D] dark:text-white mb-5 font-sans">Sentiment Trajectory Trend</h3>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={TREND}>
                <defs>
                  <linearGradient id="agP" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={isDarkMode ? '#FFFFFF' : '#000000'} stopOpacity={0.2} />
                    <stop offset="95%" stopColor={isDarkMode ? '#FFFFFF' : '#000000'} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke={isDarkMode ? '#2E3132' : '#F0F1F3'} vertical={false} />
                <XAxis dataKey="month" stroke={isDarkMode ? '#A0A4A8' : '#94A3B8'} fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke={isDarkMode ? '#A0A4A8' : '#94A3B8'} fontSize={11} tickLine={false} axisLine={false} unit="%" />
                <Tooltip content={<ChartTooltip />} />
                <Area type="monotone" dataKey="positive" stroke={isDarkMode ? '#FFFFFF' : '#000000'} strokeWidth={2.5} fillOpacity={1} fill="url(#agP)" />
                <Area type="monotone" dataKey="negative" stroke={isDarkMode ? '#64748B' : '#7E7576'} strokeWidth={2} fillOpacity={0} fill="transparent" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Products by Positive Sentiment */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.12 }}
          className="p-6 rounded-2xl bg-white dark:bg-[#191C1D] border border-[#E5E7EB] dark:border-[#2E3132] shadow-[0_4px_20px_rgba(0,0,0,0.04)] dark:shadow-none font-sans">
          <h3 className="text-base font-bold text-[#191C1D] dark:text-white mb-5 font-sans">Top Products by Positive Sentiment</h3>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={TOP_PRODUCTS} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke={isDarkMode ? '#2E3132' : '#F0F1F3'} horizontal={false} />
                <XAxis type="number" stroke={isDarkMode ? '#A0A4A8' : '#94A3B8'} fontSize={11} tickLine={false} axisLine={false} unit="%" />
                <YAxis type="category" dataKey="name" stroke={isDarkMode ? '#A0A4A8' : '#94A3B8'} fontSize={10} tickLine={false} axisLine={false} width={110} />
                <Tooltip content={<ChartTooltip />} cursor={{ fill: isDarkMode ? 'rgba(255, 255, 255, 0.04)' : 'rgba(0, 0, 0, 0.03)', radius: 4 }} />
                <Bar dataKey="positive" fill={isDarkMode ? '#FFFFFF' : '#000000'} radius={[0, 6, 6, 0]} barSize={14} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Highest Negative Sentiment */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.16 }}
          className="p-6 rounded-2xl bg-white dark:bg-[#191C1D] border border-[#E5E7EB] dark:border-[#2E3132] shadow-[0_4px_20px_rgba(0,0,0,0.04)] dark:shadow-none font-sans">
          <h3 className="text-base font-bold text-[#191C1D] dark:text-white mb-5 font-sans">Products with Highest Negative Sentiment</h3>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={WORST_PRODUCTS} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke={isDarkMode ? '#2E3132' : '#F0F1F3'} horizontal={false} />
                <XAxis type="number" stroke={isDarkMode ? '#A0A4A8' : '#94A3B8'} fontSize={11} tickLine={false} axisLine={false} unit="%" />
                <YAxis type="category" dataKey="name" stroke={isDarkMode ? '#A0A4A8' : '#94A3B8'} fontSize={10} tickLine={false} axisLine={false} width={110} />
                <Tooltip content={<ChartTooltip />} cursor={{ fill: isDarkMode ? 'rgba(255, 255, 255, 0.04)' : 'rgba(0, 0, 0, 0.03)', radius: 4 }} />
                <Bar dataKey="negative" fill="#BA1A1A" radius={[0, 6, 6, 0]} barSize={14} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

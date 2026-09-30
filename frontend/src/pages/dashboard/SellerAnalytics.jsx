import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, BarChart3, Star, Filter, Download } from 'lucide-react';
import {
  LineChart, Line, AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';
import { SentimentChart } from '../../components/dashboard/SentimentChart';
import { useTheme } from '../../context/ThemeContext';

const TREND_DATA = [
  { date: 'Jul 1', positive: 1040, neutral: 310, negative: 450 },
  { date: 'Jul 7', positive: 1120, neutral: 340, negative: 490 },
  { date: 'Jul 14', positive: 1080, neutral: 330, negative: 460 },
  { date: 'Jul 21', positive: 1250, neutral: 380, negative: 420 },
  { date: 'Jul 28', positive: 1310, neutral: 390, negative: 410 },
  { date: 'Aug 4', positive: 1420, neutral: 410, negative: 390 },
  { date: 'Aug 11', positive: 1490, neutral: 430, negative: 370 },
];

const PRODUCT_COMPARISON_DATA = [
  { product: 'boAt Rockerz', positive: 92, neutral: 5, negative: 3 },
  { product: 'Noise Watch', positive: 87, neutral: 8, negative: 5 },
  { product: 'Zebronics Buds', positive: 84, neutral: 10, negative: 6 },
  { product: 'MacBook Air M3', positive: 82, neutral: 12, negative: 6 },
  { product: 'Sony XM5', positive: 79, neutral: 14, negative: 7 },
  { product: 'Galaxy S24', positive: 74, neutral: 16, negative: 10 },
];

const RATING_VS_SENTIMENT = [
  { rating: '5 Stars', positive: 96, neutral: 3, negative: 1 },
  { rating: '4 Stars', positive: 82, neutral: 15, negative: 3 },
  { rating: '3 Stars', positive: 25, neutral: 55, negative: 20 },
  { rating: '2 Stars', positive: 5, neutral: 25, negative: 70 },
  { rating: '1 Star', positive: 1, neutral: 4, negative: 95 },
];

const RATING_DIST = [
  { stars: '5 ★', pct: 49.5, count: 28450, color: '#16A34A' },
  { stars: '4 ★', pct: 24.9, count: 14320, color: '#2563EB' },
  { stars: '3 ★', pct: 9.1, count: 5210, color: '#EA580C' },
  { stars: '2 ★', pct: 8.4, count: 4820, color: '#EC4899' },
  { stars: '1 ★', pct: 8.1, count: 4734, color: '#DC2626' },
];

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="px-3.5 py-2.5 rounded-xl bg-white dark:bg-[#191C1D] text-[#191C1D] dark:text-white text-xs shadow-2xl border border-[#E5E7EB] dark:border-[#33373B] space-y-1.5 font-mono min-w-[150px]">
        <p className="font-bold text-[#191C1D] dark:text-white pb-1 border-b border-[#E5E7EB] dark:border-[#2E3132]">{label}</p>
        {payload.map((p) => {
          const color = p.color || p.fill;
          const isBlack = color === '#000000';
          const isWhite = color === '#FFFFFF';
          return (
            <div key={p.dataKey} className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <div
                  className={`w-2.5 h-2.5 rounded-full shrink-0 ${isBlack
                      ? 'bg-[#000000] border border-black/20 ring-1 ring-black/10'
                      : isWhite
                        ? 'bg-white border border-slate-300'
                        : 'border border-slate-300 dark:border-slate-600'
                    }`}
                  style={{ backgroundColor: color }}
                />
                <span className="capitalize text-[#5C5F62] dark:text-[#A0A4A8]">{p.name || p.dataKey}:</span>
              </div>
              <span className="font-bold text-[#191C1D] dark:text-white">
                {p.value}{typeof p.value === 'number' && p.value <= 100 ? '%' : ''}
              </span>
            </div>
          );
        })}
      </div>
    );
  }
  return null;
};

export const SellerAnalytics = () => {
  const [timeRange, setTimeRange] = useState('30D');
  const { isDarkMode } = useTheme();

  return (
    <div className="space-y-8 pb-10 font-sans text-[#191C1D] dark:text-white transition-colors">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-[#191C1D] dark:text-white tracking-tight font-sans">
            Sentiment Analytics & Visualizations
          </h2>
          <p className="text-xs text-[#5C5F62] dark:text-[#A0A4A8] mt-1 font-mono">
            In-depth statistical breakdown of review volume, rating distributions, and cross-product comparisons.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button className="px-4 py-2 bg-[#000000] dark:bg-white text-white dark:text-black text-xs font-mono rounded-lg hover:bg-[#1B1B1B] dark:hover:bg-slate-100 transition-colors flex items-center gap-1.5 shadow-xs cursor-pointer">
            <Download className="w-3.5 h-3.5" />
            <span>Export Telemetry</span>
          </button>
        </div>
      </div>

      {/* Row 1: ① Sentiment Trend Line Chart & ② Sentiment Distribution Donut */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* ① Sentiment Trend */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="lg:col-span-2 p-6 rounded-2xl bg-white dark:bg-[#191C1D] border border-[#E5E7EB] dark:border-[#2E3132] shadow-[0_4px_20px_rgba(0,0,0,0.04)] dark:shadow-none space-y-4"
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-semibold text-[#191C1D] dark:text-white">Sentiment Trajectory Over Time</h3>
              <p className="text-xs text-[#5C5F62] dark:text-[#A0A4A8] font-mono">Positive, neutral, and negative review volume trajectories</p>
            </div>
            <div className="flex items-center gap-1 p-1 rounded-lg bg-[#F8F9FA] dark:bg-[#242729] border border-[#E5E7EB] dark:border-[#33373B]">
              {['7D', '30D', '3M', '6M', '1Y'].map((r) => (
                <button
                  key={r}
                  onClick={() => setTimeRange(r)}
                  className={`px-2 py-1 rounded-md text-[10px] font-medium font-mono transition-all cursor-pointer ${timeRange === r
                      ? 'bg-[#000000] dark:bg-white text-white dark:text-black shadow-xs font-semibold'
                      : 'text-[#5C5F62] dark:text-[#A0A4A8] hover:text-[#000000] dark:hover:text-white'
                    }`}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>

          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={TREND_DATA}>
                <CartesianGrid strokeDasharray="3 3" stroke={isDarkMode ? '#2E3132' : '#F0F1F3'} vertical={false} />
                <XAxis dataKey="date" stroke={isDarkMode ? '#A0A4A8' : '#94A3B8'} fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke={isDarkMode ? '#A0A4A8' : '#94A3B8'} fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Legend wrapperStyle={{ fontSize: '11px', fontFamily: 'Geist, sans-serif' }} iconType="circle" />
                <Line type="monotone" dataKey="positive" name="Positive" stroke={isDarkMode ? '#FFFFFF' : '#000000'} strokeWidth={2.5} dot={{ r: 3, fill: isDarkMode ? '#FFFFFF' : '#000000' }} />
                <Line type="monotone" dataKey="neutral" name="Neutral" stroke={isDarkMode ? '#94A3B8' : '#64748B'} strokeWidth={1.75} strokeDasharray="3 3" dot={{ r: 2 }} />
                <Line type="monotone" dataKey="negative" name="Negative" stroke={isDarkMode ? '#64748B' : '#CBD5E1'} strokeWidth={1.5} dot={{ r: 2 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* ② Sentiment Distribution Donut */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="p-6 rounded-2xl bg-white dark:bg-[#191C1D] border border-[#E5E7EB] dark:border-[#2E3132] shadow-[0_4px_20px_rgba(0,0,0,0.04)] dark:shadow-none flex flex-col justify-between"
        >
          <div>
            <h3 className="text-base font-semibold text-[#191C1D] dark:text-white">Sentiment Distribution</h3>
            <p className="text-xs text-[#5C5F62] dark:text-[#A0A4A8] font-mono">Aggregate proportions across catalog</p>
          </div>

          <div className="my-4">
            <SentimentChart positive={68.4} neutral={13.4} negative={18.2} size={180} />
          </div>

          <div className="grid grid-cols-3 gap-2 text-center font-mono">
            <div className="p-2 rounded-xl bg-[#F8F9FA] dark:bg-[#242729] border border-[#E5E7EB] dark:border-[#33373B]">
              <span className="text-[10px] text-[#5C5F62] dark:text-[#A0A4A8] block">Positive</span>
              <span className="text-sm font-semibold text-[#000000] dark:text-white">68.4%</span>
            </div>
            <div className="p-2 rounded-xl bg-[#F8F9FA] dark:bg-[#242729] border border-[#E5E7EB] dark:border-[#33373B]">
              <span className="text-[10px] text-[#5C5F62] dark:text-[#A0A4A8] block">Neutral</span>
              <span className="text-sm font-semibold text-[#5C5F62] dark:text-[#A0A4A8]">13.4%</span>
            </div>
            <div className="p-2 rounded-xl bg-[#F8F9FA] dark:bg-[#242729] border border-[#E5E7EB] dark:border-[#33373B]">
              <span className="text-[10px] text-[#5C5F62] dark:text-[#A0A4A8] block">Negative</span>
              <span className="text-sm font-semibold text-[#5C5F62] dark:text-[#A0A4A8]">18.2%</span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Row 2: ③ Rating Distribution & ④ Product Comparison Bar Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* ③ Rating Distribution (Horizontal Bar) */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="p-6 rounded-2xl bg-white dark:bg-[#191C1D] border border-[#E5E7EB] dark:border-[#2E3132] shadow-[0_4px_20px_rgba(0,0,0,0.04)] dark:shadow-none space-y-4"
        >
          <div>
            <h3 className="text-base font-semibold text-[#191C1D] dark:text-white">Rating Distribution (1–5 Stars)</h3>
            <p className="text-xs text-[#5C5F62] dark:text-[#A0A4A8] font-mono">Star rating volume counts</p>
          </div>

          <div className="space-y-4 pt-2">
            {RATING_DIST.map((item) => (
              <div key={item.stars} className="space-y-1 font-mono">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-[#191C1D] dark:text-white font-medium">{item.stars}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-[#5C5F62] dark:text-[#A0A4A8] font-normal">{item.count.toLocaleString()} reviews</span>
                    <span className="text-[#000000] dark:text-white font-semibold">{item.pct}%</span>
                  </div>
                </div>
                <div className="h-2 rounded-full bg-[#F3F4F5] dark:bg-[#2E3132] overflow-hidden">
                  <div className="h-full rounded-full transition-all duration-500 bg-[#000000] dark:bg-white" style={{ width: `${item.pct}%` }} />
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* ④ Product Comparison Grouped Bar Chart */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="p-6 rounded-2xl bg-white dark:bg-[#191C1D] border border-[#E5E7EB] dark:border-[#2E3132] shadow-[0_4px_20px_rgba(0,0,0,0.04)] dark:shadow-none space-y-4"
        >
          <div>
            <h3 className="text-base font-semibold text-[#191C1D] dark:text-white">Product Sentiment Comparison</h3>
            <p className="text-xs text-[#5C5F62] dark:text-[#A0A4A8] font-mono">Side-by-side positive/neutral/negative percentage breakdown</p>
          </div>

          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={PRODUCT_COMPARISON_DATA}>
                <CartesianGrid strokeDasharray="3 3" stroke={isDarkMode ? '#2E3132' : '#F0F1F3'} vertical={false} />
                <XAxis dataKey="product" stroke={isDarkMode ? '#A0A4A8' : '#94A3B8'} fontSize={10} tickLine={false} axisLine={false} />
                <YAxis stroke={isDarkMode ? '#A0A4A8' : '#94A3B8'} fontSize={10} tickLine={false} axisLine={false} unit="%" />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: isDarkMode ? 'rgba(255, 255, 255, 0.04)' : 'rgba(0, 0, 0, 0.03)', radius: 6 }} />
                <Legend wrapperStyle={{ fontSize: '11px', fontFamily: 'Geist, sans-serif' }} iconType="circle" />
                <Bar dataKey="positive" name="Positive %" fill={isDarkMode ? '#FFFFFF' : '#000000'} radius={[4, 4, 0, 0]} />
                <Bar dataKey="neutral" name="Neutral %" fill={isDarkMode ? '#94A3B8' : '#64748B'} radius={[4, 4, 0, 0]} />
                <Bar dataKey="negative" name="Negative %" fill={isDarkMode ? '#64748B' : '#CBD5E1'} radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>

      {/* Row 3: ⑤ Rating vs Sentiment (Stacked Bar Chart) */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25 }}
        className="p-6 rounded-2xl bg-white dark:bg-[#191C1D] border border-[#E5E7EB] dark:border-[#2E3132] shadow-[0_4px_20px_rgba(0,0,0,0.04)] dark:shadow-none space-y-4"
      >
        <div>
          <h3 className="text-base font-semibold text-[#191C1D] dark:text-white">Rating vs Sentiment Correlation</h3>
          <p className="text-xs text-[#5C5F62] dark:text-[#A0A4A8] font-mono">Correlation between numerical star rating and predicted NLP sentiment</p>
        </div>

        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={RATING_VS_SENTIMENT}>
              <CartesianGrid strokeDasharray="3 3" stroke={isDarkMode ? '#2E3132' : '#F0F1F3'} vertical={false} />
              <XAxis dataKey="rating" stroke={isDarkMode ? '#A0A4A8' : '#94A3B8'} fontSize={11} tickLine={false} axisLine={false} />
              <YAxis stroke={isDarkMode ? '#A0A4A8' : '#94A3B8'} fontSize={11} tickLine={false} axisLine={false} unit="%" />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: isDarkMode ? 'rgba(255, 255, 255, 0.04)' : 'rgba(0, 0, 0, 0.03)', radius: 6 }} />
              <Legend wrapperStyle={{ fontSize: '11px', fontFamily: 'Geist, sans-serif' }} iconType="circle" />
              <Bar dataKey="positive" name="Positive Sentiment %" stackId="a" fill={isDarkMode ? '#FFFFFF' : '#000000'} />
              <Bar dataKey="neutral" name="Neutral Sentiment %" stackId="a" fill={isDarkMode ? '#94A3B8' : '#64748B'} />
              <Bar dataKey="negative" name="Negative Sentiment %" stackId="a" fill={isDarkMode ? '#64748B' : '#CBD5E1'} radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </motion.div>
    </div>
  );
};

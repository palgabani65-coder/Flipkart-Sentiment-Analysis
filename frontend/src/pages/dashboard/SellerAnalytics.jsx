import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, BarChart3, Star, Filter, Download } from 'lucide-react';
import { 
  LineChart, Line, AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';
import { SentimentChart } from '../../components/dashboard/SentimentChart';

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
      <div className="px-3 py-2 rounded-xl bg-[#111116] text-white text-xs shadow-2xl border border-slate-700 dark:border-[#282836] space-y-1 font-mono">
        <p className="font-extrabold text-white">{label}</p>
        {payload.map((p) => (
          <div key={p.dataKey} className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: p.color || p.fill }} />
            <span className="capitalize">{p.dataKey}:</span>
            <span className="font-bold">{p.value}{typeof p.value === 'number' && p.value <= 100 ? '%' : ''}</span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

export const SellerAnalytics = () => {
  const [timeRange, setTimeRange] = useState('30D');

  return (
    <div className="space-y-8 pb-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            Sentiment Analytics & Data Visualization
          </h2>
          <p className="text-xs text-slate-500 dark:text-[#9494A8] mt-1 font-medium">
            In-depth statistical breakdown of review volume, rating distributions, and cross-product comparisons.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button className="px-4 py-2 rounded-xl bg-[#111116] dark:bg-[#2563EB] text-white font-extrabold text-xs flex items-center gap-1.5 shadow-md">
            <Download className="w-3.5 h-3.5" />
            <span>Export Analytics</span>
          </button>
        </div>
      </div>

      {/* Row 1: ① Sentiment Trend Line Chart & ② Sentiment Distribution Donut */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* ① Sentiment Trend */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="lg:col-span-2 p-6 rounded-2xl bg-white dark:bg-[#1C1C26] border border-[#E6E4F0] dark:border-[#282836] shadow-xs space-y-4"
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-extrabold text-slate-900 dark:text-white">① Sentiment Trend Over Time</h3>
              <p className="text-xs text-slate-500 dark:text-[#9494A8]">Positive, neutral, and negative review volume trajectories</p>
            </div>
            <div className="flex items-center gap-1 p-1 rounded-xl bg-slate-100 dark:bg-[#242432]">
              {['7D', '30D', '3M', '6M', '1Y'].map((r) => (
                <button
                  key={r}
                  onClick={() => setTimeRange(r)}
                  className={`px-2 py-1 rounded-lg text-[10px] font-bold font-mono transition-all cursor-pointer ${
                    timeRange === r ? 'bg-white dark:bg-[#1C1C26] text-slate-900 dark:text-white shadow-xs' : 'text-slate-500'
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
                <CartesianGrid strokeDasharray="3 3" stroke="#E6E4F0" opacity={0.5} vertical={false} />
                <XAxis dataKey="date" stroke="#9494A8" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke="#9494A8" fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Legend wrapperStyle={{ fontSize: '11px', fontWeight: 600 }} iconType="circle" />
                <Line type="monotone" dataKey="positive" name="Positive Reviews" stroke="#16A34A" strokeWidth={2.5} dot={{ r: 3 }} />
                <Line type="monotone" dataKey="negative" name="Negative Reviews" stroke="#DC2626" strokeWidth={2.5} dot={{ r: 3 }} />
                <Line type="monotone" dataKey="neutral" name="Neutral Reviews" stroke="#EA580C" strokeWidth={2} dot={{ r: 2 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* ② Sentiment Distribution Donut */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="p-6 rounded-2xl bg-white dark:bg-[#1C1C26] border border-[#E6E4F0] dark:border-[#282836] shadow-xs flex flex-col justify-between"
        >
          <div>
            <h3 className="text-base font-extrabold text-slate-900 dark:text-white">② Sentiment Distribution</h3>
            <p className="text-xs text-slate-500 dark:text-[#9494A8]">Aggregate proportions across catalog</p>
          </div>

          <div className="my-4">
            <SentimentChart positive={68.4} neutral={13.4} negative={18.2} size={180} />
          </div>

          <div className="grid grid-cols-3 gap-2 text-center font-mono">
            <div className="p-2 rounded-xl bg-[#DCFCE7] dark:bg-[#242432]">
              <span className="text-[10px] text-[#15803D] dark:text-[#22C55E] block font-bold">Positive</span>
              <span className="text-sm font-black text-slate-900 dark:text-white">68.4%</span>
            </div>
            <div className="p-2 rounded-xl bg-[#FFEDD5] dark:bg-[#242432]">
              <span className="text-[10px] text-[#C2410C] dark:text-[#F59E0B] block font-bold">Neutral</span>
              <span className="text-sm font-black text-slate-900 dark:text-white">13.4%</span>
            </div>
            <div className="p-2 rounded-xl bg-[#FEE2E2] dark:bg-[#242432]">
              <span className="text-[10px] text-[#B91C1C] dark:text-[#EF4444] block font-bold">Negative</span>
              <span className="text-sm font-black text-slate-900 dark:text-white">18.2%</span>
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
          className="p-6 rounded-2xl bg-white dark:bg-[#1C1C26] border border-[#E6E4F0] dark:border-[#282836] shadow-xs space-y-4"
        >
          <div>
            <h3 className="text-base font-extrabold text-slate-900 dark:text-white">③ Rating Distribution (1–5 Stars)</h3>
            <p className="text-xs text-slate-500 dark:text-[#9494A8]">Star rating volume counts</p>
          </div>

          <div className="space-y-4 pt-2">
            {RATING_DIST.map((item) => (
              <div key={item.stars} className="space-y-1 font-mono">
                <div className="flex items-center justify-between text-xs font-bold">
                  <span className="text-slate-700 dark:text-white">{item.stars}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-slate-400 font-normal">{item.count.toLocaleString()} reviews</span>
                    <span className="text-slate-900 dark:text-white font-extrabold">{item.pct}%</span>
                  </div>
                </div>
                <div className="h-2.5 rounded-full bg-slate-100 dark:bg-[#242432] overflow-hidden">
                  <div className="h-full rounded-full transition-all duration-500" style={{ width: `${item.pct}%`, backgroundColor: item.color }} />
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
          className="p-6 rounded-2xl bg-white dark:bg-[#1C1C26] border border-[#E6E4F0] dark:border-[#282836] shadow-xs space-y-4"
        >
          <div>
            <h3 className="text-base font-extrabold text-slate-900 dark:text-white">④ Product Sentiment Comparison</h3>
            <p className="text-xs text-slate-500 dark:text-[#9494A8]">Side-by-side positive/neutral/negative percentage breakdown</p>
          </div>

          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={PRODUCT_COMPARISON_DATA}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E6E4F0" opacity={0.5} vertical={false} />
                <XAxis dataKey="product" stroke="#9494A8" fontSize={10} tickLine={false} axisLine={false} />
                <YAxis stroke="#9494A8" fontSize={10} tickLine={false} axisLine={false} unit="%" />
                <Tooltip content={<CustomTooltip />} />
                <Legend wrapperStyle={{ fontSize: '11px', fontWeight: 600 }} iconType="circle" />
                <Bar dataKey="positive" name="Positive %" fill="#16A34A" radius={[4, 4, 0, 0]} />
                <Bar dataKey="neutral" name="Neutral %" fill="#EA580C" radius={[4, 4, 0, 0]} />
                <Bar dataKey="negative" name="Negative %" fill="#DC2626" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>

      {/* Row 3: ⑤ Rating vs Sentiment (Stacked Bar Chart - Essential ML Graph) */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25 }}
        className="p-6 rounded-2xl bg-white dark:bg-[#1C1C26] border border-[#E6E4F0] dark:border-[#282836] shadow-xs space-y-4"
      >
        <div>
          <h3 className="text-base font-extrabold text-slate-900 dark:text-white">⑤ Rating vs Sentiment Correlation</h3>
          <p className="text-xs text-slate-500 dark:text-[#9494A8]">Correlation between numerical star rating and predicted NLP sentiment</p>
        </div>

        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={RATING_VS_SENTIMENT}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E6E4F0" opacity={0.5} vertical={false} />
              <XAxis dataKey="rating" stroke="#9494A8" fontSize={11} tickLine={false} axisLine={false} />
              <YAxis stroke="#9494A8" fontSize={11} tickLine={false} axisLine={false} unit="%" />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ fontSize: '11px', fontWeight: 600 }} iconType="circle" />
              <Bar dataKey="positive" name="Positive Sentiment %" stackId="a" fill="#16A34A" />
              <Bar dataKey="neutral" name="Neutral Sentiment %" stackId="a" fill="#EA580C" />
              <Bar dataKey="negative" name="Negative Sentiment %" stackId="a" fill="#DC2626" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </motion.div>
    </div>
  );
};

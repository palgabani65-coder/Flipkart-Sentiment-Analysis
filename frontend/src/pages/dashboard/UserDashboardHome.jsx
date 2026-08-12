import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  Package, MessageSquareText, ThumbsUp, ThumbsDown, Star,
  TrendingUp, TrendingDown, ArrowRight, Lightbulb, Sparkles,
  AlertTriangle, Filter, CheckCircle2, XCircle
} from 'lucide-react';
import { 
  AreaChart, Area, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';
import { StatCard } from '../../components/dashboard/StatCard';
import { SentimentChart } from '../../components/dashboard/SentimentChart';
import { SentimentBadge } from '../../components/common/SentimentBadge';

const TOP_PRODUCTS_DATA = [
  { id: 'p1', name: 'boAt Rockerz 255 Pro+', category: 'Audio', sentimentScore: 92, rating: 4.6, reviews: 2438, status: 'Positive' },
  { id: 'p2', name: 'Noise ColorFit Pro 4', category: 'Wearables', sentimentScore: 87, rating: 4.4, reviews: 1982, status: 'Positive' },
  { id: 'p3', name: 'Zebronics Wireless Buds', category: 'Audio', sentimentScore: 84, rating: 4.3, reviews: 1420, status: 'Positive' },
  { id: 'p4', name: 'Apple MacBook Air M3', category: 'Laptops', sentimentScore: 82, rating: 4.6, reviews: 1856, status: 'Positive' },
  { id: 'p5', name: 'Sony WH-1000XM5 Headphones', category: 'Audio', sentimentScore: 79, rating: 4.5, reviews: 1124, status: 'Positive' },
];

const TREND_DATA = [
  { date: 'Jul 1', positive: 1240, neutral: 280, negative: 320 },
  { date: 'Jul 7', positive: 1320, neutral: 290, negative: 310 },
  { date: 'Jul 14', positive: 1280, neutral: 310, negative: 330 },
  { date: 'Jul 21', positive: 1450, neutral: 330, negative: 290 },
  { date: 'Jul 28', positive: 1510, neutral: 340, negative: 280 },
  { date: 'Aug 4', positive: 1620, neutral: 350, negative: 270 },
  { date: 'Aug 11', positive: 1690, neutral: 360, negative: 260 },
];

const CUSTOMER_LIKES = [
  { topic: 'Battery life', mentions: '4,823 mentions' },
  { topic: 'Sound quality', mentions: '3,921 mentions' },
  { topic: 'Design', mentions: '2,481 mentions' },
  { topic: 'Value for money', mentions: '3,114 mentions' },
];

const CUSTOMER_DISLIKES = [
  { topic: 'Connectivity', mentions: '1,842 mentions' },
  { topic: 'Packaging', mentions: '921 mentions' },
  { topic: 'Battery drain', mentions: '1,324 mentions' },
  { topic: 'Build quality', mentions: '742 mentions' },
];

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="px-3 py-2 rounded-xl bg-[#111116] text-white text-xs shadow-2xl border border-slate-700 dark:border-[#282836] space-y-1 font-mono">
        <p className="font-extrabold text-white">{label}</p>
        {payload.map((p) => (
          <div key={p.dataKey} className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: p.color || p.stroke }} />
            <span className="capitalize">{p.dataKey}:</span>
            <span className="font-bold">{p.value} reviews</span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

export const UserDashboardHome = () => {
  const navigate = useNavigate();
  const [trendRange, setTrendRange] = useState('30D');

  return (
    <div className="space-y-8 pb-10">
      
      {/* Top Greeting Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            Good morning, Seller 👋
          </h2>
          <p className="text-xs text-slate-500 dark:text-[#9494A8] mt-1 font-medium">
            Here's what's happening with your products today.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate('/dashboard/sentiment-analysis')}
            className="px-4 py-2 rounded-xl bg-[#111116] hover:bg-black dark:bg-[#2563EB] text-white font-extrabold text-xs shadow-md transition-transform hover:scale-[1.02] cursor-pointer"
          >
            ✦ Analyze New Review
          </button>
        </div>
      </div>

      {/* 1. TOP 5 EXECUTIVE KPI CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <StatCard
          icon={Package}
          label="Products"
          value="128"
          change={4.2}
          index={0}
          sparklinePoints={[110, 114, 118, 122, 125, 128]}
        />
        <StatCard
          icon={MessageSquareText}
          label="Reviews"
          value="57,534"
          change={12.8}
          index={1}
          sparklinePoints={[42, 45, 48, 51, 54, 57]}
        />
        <StatCard
          icon={ThumbsUp}
          label="Positive"
          value="68.4%"
          change={8.4}
          index={2}
          sparklinePoints={[58, 60, 62, 64, 66, 68]}
        />
        <StatCard
          icon={ThumbsDown}
          label="Negative"
          value="18.2%"
          change={-2.1}
          index={3}
          sparklinePoints={[22, 21, 20, 19, 19, 18]}
        />
        <StatCard
          icon={Star}
          label="Average Rating"
          value="4.3"
          subValue="/ 5 ⭐"
          change={1.2}
          index={4}
          sparklinePoints={[4.0, 4.1, 4.2, 4.2, 4.3, 4.3]}
        />
      </div>

      {/* 2. MIDDLE SECTION: SENTIMENT OVERVIEW & SENTIMENT TREND */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Donut Chart: Sentiment Overview */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="p-6 rounded-2xl bg-white dark:bg-[#1C1C26] border border-[#E6E4F0] dark:border-[#282836] shadow-xs flex flex-col justify-between"
        >
          <div>
            <h3 className="text-base font-extrabold text-slate-900 dark:text-white tracking-tight">
              Sentiment Overview
            </h3>
            <p className="text-xs text-slate-500 dark:text-[#9494A8] mt-0.5">
              Overall catalog sentiment distribution
            </p>
          </div>

          <div className="my-4">
            <SentimentChart positive={68.4} neutral={13.4} negative={18.2} size={190} />
          </div>

          <div className="grid grid-cols-3 gap-2 pt-4 border-t border-slate-100 dark:border-[#282836] text-center">
            <div className="p-2 rounded-xl bg-[#DCFCE7] dark:bg-[#242432]">
              <span className="text-[10px] font-bold text-[#15803D] dark:text-[#22C55E] block font-mono">Positive</span>
              <span className="text-sm font-black text-slate-900 dark:text-white font-mono">68.4%</span>
            </div>

            <div className="p-2 rounded-xl bg-[#FFEDD5] dark:bg-[#242432]">
              <span className="text-[10px] font-bold text-[#C2410C] dark:text-[#F59E0B] block font-mono">Neutral</span>
              <span className="text-sm font-black text-slate-900 dark:text-white font-mono">13.4%</span>
            </div>

            <div className="p-2 rounded-xl bg-[#FEE2E2] dark:bg-[#242432]">
              <span className="text-[10px] font-bold text-[#B91C1C] dark:text-[#EF4444] block font-mono">Negative</span>
              <span className="text-sm font-black text-slate-900 dark:text-white font-mono">18.2%</span>
            </div>
          </div>
        </motion.div>

        {/* Line Chart: Sentiment Trend */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="lg:col-span-2 p-6 rounded-2xl bg-white dark:bg-[#1C1C26] border border-[#E6E4F0] dark:border-[#282836] shadow-xs flex flex-col justify-between"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-base font-extrabold text-slate-900 dark:text-white tracking-tight">
                Sentiment Trend
              </h3>
              <p className="text-xs text-slate-500 dark:text-[#9494A8] mt-0.5">
                Review volume trend by sentiment classification over time
              </p>
            </div>

            {/* Time Filter Pills: 7D | 30D | 3M | 6M | 1Y */}
            <div className="flex items-center gap-1 p-1 rounded-xl bg-slate-100 dark:bg-[#242432]">
              {['7D', '30D', '3M', '6M', '1Y'].map((range) => (
                <button
                  key={range}
                  onClick={() => setTrendRange(range)}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-extrabold transition-all cursor-pointer font-mono ${
                    trendRange === range
                      ? 'bg-white dark:bg-[#1C1C26] text-slate-900 dark:text-white shadow-xs'
                      : 'text-slate-500 dark:text-[#9494A8] hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  {range}
                </button>
              ))}
            </div>
          </div>

          <div className="h-64 mt-4 w-full">
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
      </div>

      {/* 3. LOWER SECTION: TOP PERFORMING PRODUCTS & CUSTOMER VOICE */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Top Performing Products (Show 5 products) */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="p-6 rounded-2xl bg-white dark:bg-[#1C1C26] border border-[#E6E4F0] dark:border-[#282836] shadow-xs space-y-4"
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
                Top Performing Products
              </h3>
              <p className="text-xs text-slate-500 dark:text-[#9494A8] mt-0.5">
                Top catalog items by sentiment score & rating
              </p>
            </div>
            <button
              onClick={() => navigate('/dashboard/products')}
              className="text-xs font-bold text-[#111116] dark:text-[#8B5CF6] hover:underline flex items-center gap-1 cursor-pointer"
            >
              View All <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            {TOP_PRODUCTS_DATA.map((prod) => (
              <div key={prod.id} className="p-3.5 rounded-xl bg-slate-50 dark:bg-[#242432] border border-[#E6E4F0] dark:border-[#282836] flex items-center justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate">{prod.name}</h4>
                  <div className="flex items-center gap-2 text-[10px] text-slate-400 font-mono mt-1">
                    <span className="flex items-center gap-0.5 text-amber-400 font-bold"><Star className="w-3 h-3 fill-amber-400" /> {prod.rating}</span>
                    <span>• {prod.reviews.toLocaleString()} reviews</span>
                  </div>
                </div>

                <div className="w-36 space-y-1">
                  <div className="flex items-center justify-between text-[11px] font-mono font-bold">
                    <span className="text-slate-500 dark:text-slate-400">Sentiment</span>
                    <span className="text-[#16A34A] dark:text-[#22C55E]">{prod.sentimentScore}%</span>
                  </div>
                  <div className="h-2 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
                    <div className="h-full rounded-full bg-[#16A34A] dark:bg-[#22C55E]" style={{ width: `${prod.sentimentScore}%` }} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Customer Voice / What Customers Are Saying */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="p-6 rounded-2xl bg-white dark:bg-[#1C1C26] border border-[#E6E4F0] dark:border-[#282836] shadow-xs space-y-4 flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-bold uppercase tracking-wider text-[#111116] dark:text-[#8B5CF6] font-mono">
                CUSTOMER VOICE
              </span>
            </div>
            <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
              What Customers Are Saying
            </h3>
            <p className="text-xs text-slate-500 dark:text-[#9494A8] mt-0.5">
              Extracted praise & complaint topics from NLP analysis
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* 👍 Customers like */}
            <div className="p-4 rounded-xl bg-[#DCFCE7] dark:bg-emerald-950/30 border border-[#BBF7D0] dark:border-emerald-900/40 space-y-2">
              <h4 className="text-xs font-bold text-[#15803D] dark:text-[#22C55E] flex items-center gap-1.5">
                <ThumbsUp className="w-3.5 h-3.5" />
                👍 Customers like
              </h4>
              <ul className="space-y-1 text-xs text-slate-800 dark:text-slate-200 font-medium">
                {CUSTOMER_LIKES.map((item, i) => (
                  <li key={i} className="flex items-center justify-between">
                    <span>• {item.topic}</span>
                    <span className="text-[9px] font-mono text-[#15803D] dark:text-[#22C55E] font-bold">{item.mentions}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* ⚠ Customers dislike */}
            <div className="p-4 rounded-xl bg-[#FEE2E2] dark:bg-rose-950/30 border border-[#FECACA] dark:border-rose-900/40 space-y-2">
              <h4 className="text-xs font-bold text-[#B91C1C] dark:text-[#EF4444] flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5" />
                ⚠ Customers dislike
              </h4>
              <ul className="space-y-1 text-xs text-slate-800 dark:text-slate-200 font-medium">
                {CUSTOMER_DISLIKES.map((item, i) => (
                  <li key={i} className="flex items-center justify-between">
                    <span>• {item.topic}</span>
                    <span className="text-[9px] font-mono text-[#B91C1C] dark:text-[#EF4444] font-bold">{item.mentions}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <button
            onClick={() => navigate('/dashboard/insights')}
            className="w-full py-2.5 rounded-xl bg-[#111116] hover:bg-black dark:bg-[#2563EB] text-white font-extrabold text-xs flex items-center justify-center gap-2 shadow-md cursor-pointer mt-2"
          >
            <span>Explore AI Customer Insights</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </motion.div>
      </div>
    </div>
  );
};

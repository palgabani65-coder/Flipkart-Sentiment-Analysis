import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Users, Package, MessageSquareText, Cpu, TrendingUp, ShieldCheck, ArrowRight, Star } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { SentimentChart } from '../../components/dashboard/SentimentChart';

const PLATFORM_GROWTH_DATA = [
  { date: 'Mar 2026', sellers: 120, products: 640, reviews: 22000 },
  { date: 'Apr 2026', sellers: 155, products: 820, reviews: 31000 },
  { date: 'May 2026', sellers: 180, products: 960, reviews: 39000 },
  { date: 'Jun 2026', sellers: 210, products: 1100, reviews: 46000 },
  { date: 'Jul 2026', sellers: 235, products: 1210, reviews: 52000 },
  { date: 'Aug 2026', sellers: 248, products: 1284, reviews: 57534 },
];

const MOST_ACTIVE_SELLERS = [
  { id: 's1', name: 'Gabani Electronics', email: 'palgabani65@gmail.com', products: 24, reviews: 12486, sentimentScore: '74%' },
  { id: 's2', name: 'Apex Retailers India', email: 'contact@apexretail.in', products: 42, reviews: 18920, sentimentScore: '82%' },
  { id: 's3', name: 'Digital World Store', email: 'support@digitalworld.com', products: 31, reviews: 9410, sentimentScore: '68%' },
];

const MOST_REVIEWED_PRODUCTS = [
  { id: 'p1', name: 'boAt Rockerz 450 Pro', category: 'Audio', reviews: 4512, rating: 3.7, sentiment: '52%' },
  { id: 'p2', name: 'Redmi Note 13 Pro 5G', category: 'Smartphones', reviews: 3204, rating: 3.9, sentiment: '58%' },
  { id: 'p3', name: 'boAt Rockerz 255 Pro+', category: 'Audio', reviews: 2438, rating: 4.6, sentiment: '92%' },
];

export const AdminOverview = () => {
  const navigate = useNavigate();

  return (
    <div className="space-y-8 pb-10">
      {/* Header */}
      <div>
        <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
          Platform Admin Ecosystem Overview
        </h2>
        <p className="text-xs text-slate-500 dark:text-[#9494A8] mt-1 font-medium">
          Global platform metric monitoring across 248 registered Flipkart sellers and ML pipeline operations.
        </p>
      </div>

      {/* 1. TOP 5 ECOSYSTEM METRIC CARDS (Specification Section 12) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 font-mono">
        <div className="p-5 rounded-2xl bg-white dark:bg-[#1C1C26] border border-[#E6E4F0] dark:border-[#282836] shadow-xs">
          <span className="text-[10px] font-bold text-slate-400 uppercase">Total Sellers</span>
          <p className="text-2xl font-black text-slate-900 dark:text-white mt-1">248</p>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-[#1C1C26] border border-[#E6E4F0] dark:border-[#282836] shadow-xs">
          <span className="text-[10px] font-bold text-slate-400 uppercase">Total Products</span>
          <p className="text-2xl font-black text-slate-900 dark:text-white mt-1">1,284</p>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-[#1C1C26] border border-[#E6E4F0] dark:border-[#282836] shadow-xs">
          <span className="text-[10px] font-bold text-slate-400 uppercase">Total Reviews</span>
          <p className="text-2xl font-black text-slate-900 dark:text-white mt-1">57,534</p>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-[#1C1C26] border border-[#E6E4F0] dark:border-[#282836] shadow-xs">
          <span className="text-[10px] font-bold text-slate-400 uppercase">Reviews Analyzed</span>
          <p className="text-2xl font-black text-slate-900 dark:text-white mt-1">54,892</p>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-[#1C1C26] border border-[#E6E4F0] dark:border-[#282836] shadow-xs">
          <span className="text-[10px] font-bold text-slate-400 uppercase">Model Accuracy</span>
          <p className="text-2xl font-black text-[#16A34A] dark:text-[#22C55E] mt-1">91.8%</p>
        </div>
      </div>

      {/* 2. PLATFORM GROWTH & SENTIMENT DISTRIBUTION */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Platform Growth Line Chart */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="lg:col-span-2 p-6 rounded-2xl bg-white dark:bg-[#1C1C26] border border-[#E6E4F0] dark:border-[#282836] shadow-xs space-y-4"
        >
          <div>
            <h3 className="text-base font-extrabold text-slate-900 dark:text-white">Platform Growth</h3>
            <p className="text-xs text-slate-500 dark:text-[#9494A8]">Monthly growth trajectory across Sellers, Products & Reviews</p>
          </div>

          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={PLATFORM_GROWTH_DATA}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E6E4F0" opacity={0.5} vertical={false} />
                <XAxis dataKey="date" stroke="#9494A8" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke="#9494A8" fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip />
                <Legend wrapperStyle={{ fontSize: '11px', fontWeight: 600 }} iconType="circle" />
                <Line type="monotone" dataKey="reviews" name="Total Reviews" stroke="#2563EB" strokeWidth={2.5} />
                <Line type="monotone" dataKey="products" name="Products" stroke="#8B5CF6" strokeWidth={2} />
                <Line type="monotone" dataKey="sellers" name="Sellers" stroke="#16A34A" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Global Sentiment Distribution Donut */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="p-6 rounded-2xl bg-white dark:bg-[#1C1C26] border border-[#E6E4F0] dark:border-[#282836] shadow-xs flex flex-col justify-between"
        >
          <div>
            <h3 className="text-base font-extrabold text-slate-900 dark:text-white">Global Sentiment Distribution</h3>
            <p className="text-xs text-slate-500 dark:text-[#9494A8]">Ecosystem-wide sentiment proportions</p>
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

      {/* 3. MOST ACTIVE SELLERS & MOST REVIEWED PRODUCTS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Most Active Sellers */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="p-6 rounded-2xl bg-white dark:bg-[#1C1C26] border border-[#E6E4F0] dark:border-[#282836] shadow-xs space-y-4"
        >
          <div className="flex items-center justify-between">
            <h3 className="text-base font-extrabold text-slate-900 dark:text-white">Most Active Sellers</h3>
            <button onClick={() => navigate('/admin/sellers')} className="text-xs font-bold text-[#2563EB] hover:underline flex items-center gap-1">
              All Sellers <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-2 font-mono text-xs">
            {MOST_ACTIVE_SELLERS.map((s) => (
              <div key={s.id} className="p-3 rounded-xl bg-slate-50 dark:bg-[#242432] border border-[#E6E4F0] dark:border-[#282836] flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-slate-900 dark:text-white">{s.name}</h4>
                  <span className="text-[10px] text-slate-400">{s.email}</span>
                </div>
                <div className="text-right">
                  <span className="font-extrabold text-slate-900 dark:text-white block">{s.reviews.toLocaleString()} reviews</span>
                  <span className="text-[10px] text-[#16A34A] dark:text-[#22C55E] font-bold">{s.sentimentScore} positive</span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Most Reviewed Products */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="p-6 rounded-2xl bg-white dark:bg-[#1C1C26] border border-[#E6E4F0] dark:border-[#282836] shadow-xs space-y-4"
        >
          <div className="flex items-center justify-between">
            <h3 className="text-base font-extrabold text-slate-900 dark:text-white">Most Reviewed Products</h3>
            <button onClick={() => navigate('/admin/products')} className="text-xs font-bold text-[#2563EB] hover:underline flex items-center gap-1">
              All Products <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-2 font-mono text-xs">
            {MOST_REVIEWED_PRODUCTS.map((p) => (
              <div key={p.id} className="p-3 rounded-xl bg-slate-50 dark:bg-[#242432] border border-[#E6E4F0] dark:border-[#282836] flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-slate-900 dark:text-white">{p.name}</h4>
                  <span className="text-[10px] text-slate-400">{p.category}</span>
                </div>
                <div className="text-right">
                  <span className="font-extrabold text-slate-900 dark:text-white block">{p.reviews.toLocaleString()} reviews</span>
                  <span className="text-[10px] text-amber-400 font-bold">⭐ {p.rating} ({p.sentiment})</span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

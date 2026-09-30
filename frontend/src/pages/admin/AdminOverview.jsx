import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  Users, Package, MessageSquareText, Cpu, TrendingUp, 
  ShieldCheck, ArrowRight, Star, Plus, Download, Filter, 
  MoreVertical, Activity, Gauge, HardDrive, Key, LogIn, RefreshCw, AlertCircle
} from 'lucide-react';
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
  { id: 's1', name: 'Apex Electronics', email: 'palgabani65@gmail.com', products: 24, reviews: 12486, sentimentScore: '74%' },
  { id: 's2', name: 'Nexus Retailers India', email: 'contact@nexusretail.in', products: 42, reviews: 18920, sentimentScore: '82%' },
  { id: 's3', name: 'Digital World Store', email: 'support@digitalworld.com', products: 31, reviews: 9410, sentimentScore: '68%' },
];

const MOST_REVIEWED_PRODUCTS = [
  { id: 'p1', name: 'boAt Rockerz 450 Pro', category: 'Audio', reviews: 4512, rating: 3.7, sentiment: '52%' },
  { id: 'p2', name: 'Redmi Note 13 Pro 5G', category: 'Smartphones', reviews: 3204, rating: 3.9, sentiment: '58%' },
  { id: 'p3', name: 'boAt Rockerz 255 Pro+', category: 'Audio', reviews: 2438, rating: 4.6, sentiment: '92%' },
];

const ACCESS_USERS = [
  {
    initials: 'ER',
    name: 'Elena Rostova',
    email: 'elena.r@flipsentiment.io',
    role: 'SysAdmin',
    status: 'Active',
  },
  {
    initials: 'MK',
    name: 'Marcus Kim',
    email: 'm.kim@flipsentiment.io',
    role: 'Analyst',
    status: 'Active',
  },
  {
    initials: 'SJ',
    name: 'Sarah Jenkins',
    email: 's.jenkins@flipsentiment.io',
    role: 'Viewer',
    status: 'Suspended',
  },
];

const AUDIT_LOGS = [
  {
    title: 'Successful login',
    details: 'Marcus Kim • 192.168.1.45',
    time: 'Just now',
    icon: LogIn,
    type: 'neutral',
  },
  {
    title: 'API Key rotated',
    details: 'System Service • Prod-Cluster-A',
    time: '12 mins ago',
    icon: Key,
    type: 'neutral',
  },
  {
    title: 'Model weights updated',
    details: 'Elena Rostova • Model: v4.2.1',
    time: '45 mins ago',
    icon: RefreshCw,
    type: 'primary',
  },
  {
    title: 'Failed authentication',
    details: 'Unknown User • 10.0.0.99',
    time: '2 hours ago',
    icon: AlertCircle,
    type: 'error',
  },
];

import { useTheme } from '../../context/ThemeContext';

const ChartTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="px-3.5 py-2.5 rounded-xl bg-white dark:bg-[#191C1D] text-[#191C1D] dark:text-white text-xs shadow-2xl border border-[#E5E7EB] dark:border-[#33373B] font-mono space-y-1.5 min-w-[140px]">
        <p className="font-bold text-[#191C1D] dark:text-white pb-1 border-b border-[#E5E7EB] dark:border-[#2E3132]">{label}</p>
        {payload.map((p) => {
          const color = p.stroke || p.color || p.fill;
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
              <span className="font-bold text-[#191C1D] dark:text-white">{p.value}</span>
            </div>
          );
        })}
      </div>
    );
  }
  return null;
};

export const AdminOverview = () => {
  const navigate = useNavigate();
  const { isDarkMode } = useTheme();

  return (
    <div className="space-y-8 pb-12 font-sans text-[#191C1D] dark:text-white transition-colors">
      {/* Header (Matching Mockup 5) */}
      <div>
        <h2 className="text-3xl font-bold text-[#191C1D] dark:text-white tracking-tight font-sans">
          System Administration
        </h2>
        <p className="text-xs text-[#5C5F62] dark:text-[#A0A4A8] mt-1 font-mono max-w-2xl">
          Manage platform access, monitor infrastructure health, and review security events.
        </p>
      </div>

      {/* System Status & Quick Actions Bento Grid (Matching Mockup 5) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* System Status (Span 8) */}
        <div className="col-span-12 lg:col-span-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* DB Status */}
          <div className="bg-white dark:bg-[#191C1D] rounded-xl p-4 border border-[#E5E7EB] dark:border-[#2E3132] shadow-[0_4px_20px_rgba(0,0,0,0.04)] dark:shadow-none flex flex-col justify-between h-32 relative overflow-hidden group hover:border-[#000000] dark:hover:border-white transition-colors cursor-pointer">
            <div className="flex justify-between items-start">
              <span className="text-[11px] font-mono uppercase tracking-wider text-[#5C5F62] dark:text-[#A0A4A8]">Database</span>
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#000000] dark:bg-white opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#000000] dark:bg-white"></span>
              </span>
            </div>
            <div>
              <div className="text-xl font-bold text-[#000000] dark:text-white font-sans">Healthy</div>
              <div className="text-xs font-mono text-[#5C5F62] dark:text-[#A0A4A8] mt-1">99.9% Uptime</div>
            </div>
            <div className="absolute bottom-0 left-0 w-full h-1 bg-[#EDEEEF] dark:bg-[#2E3132]">
              <div className="h-full bg-[#000000] dark:bg-white w-full"></div>
            </div>
          </div>

          {/* API Latency */}
          <div className="bg-white dark:bg-[#191C1D] rounded-xl p-4 border border-[#E5E7EB] dark:border-[#2E3132] shadow-[0_4px_20px_rgba(0,0,0,0.04)] dark:shadow-none flex flex-col justify-between h-32 relative overflow-hidden group hover:border-[#000000] dark:hover:border-white transition-colors cursor-pointer">
            <div className="flex justify-between items-start">
              <span className="text-[11px] font-mono uppercase tracking-wider text-[#5C5F62] dark:text-[#A0A4A8]">API Latency</span>
              <Gauge className="w-4 h-4 text-[#5C5F62] dark:text-[#A0A4A8]" />
            </div>
            <div>
              <div className="text-xl font-bold text-[#000000] dark:text-white font-sans flex items-baseline gap-1">
                24<span className="text-xs font-mono text-[#5C5F62] dark:text-[#A0A4A8]">ms</span>
              </div>
              <div className="text-xs font-mono text-[#5C5F62] dark:text-[#A0A4A8] mt-1">P95 Global Avg</div>
            </div>
          </div>

          {/* CPU Load */}
          <div className="bg-white dark:bg-[#191C1D] rounded-xl p-4 border border-[#E5E7EB] dark:border-[#2E3132] shadow-[0_4px_20px_rgba(0,0,0,0.04)] dark:shadow-none flex flex-col justify-between h-32 relative overflow-hidden group hover:border-[#000000] dark:hover:border-white transition-colors cursor-pointer">
            <div className="flex justify-between items-start">
              <span className="text-[11px] font-mono uppercase tracking-wider text-[#5C5F62] dark:text-[#A0A4A8]">CPU Load</span>
              <HardDrive className="w-4 h-4 text-[#5C5F62] dark:text-[#A0A4A8]" />
            </div>
            <div>
              <div className="text-xl font-bold text-[#000000] dark:text-white font-sans">32%</div>
              <div className="text-xs font-mono text-[#5C5F62] dark:text-[#A0A4A8] mt-1">Stable</div>
            </div>
            <div className="absolute bottom-0 left-0 w-full h-1 bg-[#EDEEEF] dark:bg-[#2E3132]">
              <div className="h-full bg-[#000000] dark:bg-white w-1/3"></div>
            </div>
          </div>
        </div>

        {/* Quick Actions (Span 4) */}
        <div className="col-span-12 lg:col-span-4 bg-white dark:bg-[#191C1D] rounded-xl border border-[#E5E7EB] dark:border-[#2E3132] shadow-[0_4px_20px_rgba(0,0,0,0.04)] dark:shadow-none p-4 flex flex-col justify-between h-32">
          <div className="text-[11px] font-mono uppercase tracking-wider text-[#5C5F62] dark:text-[#A0A4A8]">Actions</div>
          <div className="flex gap-2">
            <button 
              onClick={() => navigate('/admin/sellers')}
              className="flex-1 bg-[#000000] dark:bg-white text-white dark:text-black rounded-lg text-xs font-mono py-2.5 px-3 hover:bg-[#1B1B1B] dark:hover:bg-slate-100 transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>New User</span>
            </button>
            <button 
              onClick={() => navigate('/admin/reviews')}
              className="flex-1 bg-white dark:bg-[#242729] border border-[#E5E7EB] dark:border-[#33373B] text-[#191C1D] dark:text-white rounded-lg text-xs font-mono py-2.5 px-3 hover:bg-[#F8F9FA] dark:hover:bg-[#2E3132] transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export</span>
            </button>
          </div>
        </div>
      </div>

      {/* Access Control Table & Audit Log Feed (Matching Mockup 5) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Access Control Table (Span 8) */}
        <div className="col-span-12 lg:col-span-8 bg-white dark:bg-[#191C1D] rounded-2xl border border-[#E5E7EB] dark:border-[#2E3132] shadow-[0_4px_20px_rgba(0,0,0,0.04)] dark:shadow-none overflow-hidden min-h-[380px] flex flex-col">
          <div className="px-5 py-4 border-b border-[#E5E7EB] dark:border-[#2E3132] flex justify-between items-center bg-[#F8F9FA] dark:bg-[#242729]">
            <h3 className="text-base font-bold text-[#191C1D] dark:text-white font-sans">Access Control</h3>
            <button className="text-[#5C5F62] dark:text-[#A0A4A8] hover:text-[#000000] dark:hover:text-white cursor-pointer">
              <Filter className="w-4 h-4" />
            </button>
          </div>

          <div className="overflow-x-auto flex-1">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[#E5E7EB] dark:border-[#2E3132] bg-[#F8F9FA]/50 dark:bg-[#242729]/50 font-mono text-[10px] text-[#5C5F62] dark:text-[#A0A4A8] uppercase tracking-wider">
                  <th className="py-3 px-5 font-medium">User</th>
                  <th className="py-3 px-5 font-medium">Role</th>
                  <th className="py-3 px-5 font-medium">Status</th>
                  <th className="py-3 px-5 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="font-mono text-xs text-[#191C1D] dark:text-white divide-y divide-[#E5E7EB] dark:divide-[#2E3132]">
                {ACCESS_USERS.map((usr) => (
                  <tr key={usr.email} className={`hover:bg-[#F8F9FA] dark:hover:bg-[#242729] transition-colors ${usr.status === 'Suspended' ? 'opacity-60' : ''}`}>
                    <td className="py-3.5 px-5">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-[#EDEEEF] dark:bg-[#242729] text-[#191C1D] dark:text-white flex items-center justify-center font-bold text-xs">
                          {usr.initials}
                        </div>
                        <div>
                          <div className="font-semibold text-[#191C1D] dark:text-white font-sans">{usr.name}</div>
                          <div className="text-[11px] text-[#5C5F62] dark:text-[#A0A4A8]">{usr.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-5">
                      <span className="bg-[#EDEEEF] dark:bg-[#242729] text-[#191C1D] dark:text-white px-2.5 py-1 rounded text-[11px] font-semibold border border-[#E5E7EB] dark:border-[#33373B]">
                        {usr.role}
                      </span>
                    </td>
                    <td className="py-3.5 px-5">
                      <div className="flex items-center gap-1.5">
                        <div className={`w-1.5 h-1.5 rounded-full ${usr.status === 'Active' ? 'bg-[#000000] dark:bg-white' : 'bg-[#BA1A1A] dark:bg-red-400'}`} />
                        <span>{usr.status}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-5 text-right">
                      <button className="text-[#5C5F62] dark:text-[#A0A4A8] hover:text-[#000000] dark:hover:text-white cursor-pointer">
                        <MoreVertical className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Audit Log Feed (Span 4) */}
        <div className="col-span-12 lg:col-span-4 bg-white dark:bg-[#191C1D] rounded-2xl border border-[#E5E7EB] dark:border-[#2E3132] shadow-[0_4px_20px_rgba(0,0,0,0.04)] dark:shadow-none flex flex-col min-h-[380px]">
          <div className="px-5 py-4 border-b border-[#E5E7EB] dark:border-[#2E3132] flex justify-between items-center bg-[#F8F9FA] dark:bg-[#242729]">
            <h3 className="text-base font-bold text-[#191C1D] dark:text-white font-sans">Audit Log</h3>
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#000000] dark:bg-white opacity-50"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#000000] dark:bg-white"></span>
            </span>
          </div>

          <div className="p-5 flex-1 overflow-y-auto space-y-4 font-mono text-xs">
            {AUDIT_LOGS.map((log, idx) => {
              const IconComponent = log.icon;
              return (
                <div key={idx} className={`flex gap-3 items-start ${log.type === 'error' ? 'opacity-80' : ''}`}>
                  <div className="mt-0.5 p-1 rounded-md bg-[#F8F9FA] dark:bg-[#242729] text-[#191C1D] dark:text-white border border-[#E5E7EB] dark:border-[#33373B]">
                    <IconComponent className={`w-3.5 h-3.5 ${log.type === 'error' ? 'text-[#BA1A1A] dark:text-red-400' : 'text-[#191C1D] dark:text-white'}`} />
                  </div>
                  <div>
                    <div className={`text-xs font-semibold ${log.type === 'error' ? 'text-[#BA1A1A] dark:text-red-400' : 'text-[#191C1D] dark:text-white'}`}>
                      {log.title}
                    </div>
                    <div className="text-[11px] text-[#5C5F62] dark:text-[#A0A4A8] mt-0.5">{log.details}</div>
                    <div className="text-[10px] text-[#7E7576] dark:text-[#848484] mt-0.5">{log.time}</div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="p-3 border-t border-[#E5E7EB] dark:border-[#2E3132] bg-[#F8F9FA]/50 dark:bg-[#242729]/50 text-center">
            <button 
              onClick={() => navigate('/admin/activity')}
              className="text-xs font-mono uppercase tracking-wider text-[#5C5F62] dark:text-[#A0A4A8] hover:text-[#000000] dark:hover:text-white transition-colors cursor-pointer"
            >
              View All Logs →
            </button>
          </div>
        </div>
      </div>

      {/* Ecosystem Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 font-mono">
        <div className="p-5 rounded-2xl bg-white dark:bg-[#191C1D] border border-[#E5E7EB] dark:border-[#2E3132] shadow-[0_4px_20px_rgba(0,0,0,0.04)] dark:shadow-none">
          <span className="text-[10px] font-medium text-[#5C5F62] dark:text-[#A0A4A8] uppercase tracking-wider">Total Sellers</span>
          <p className="text-2xl font-bold text-[#191C1D] dark:text-white mt-1 font-sans">248</p>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-[#191C1D] border border-[#E5E7EB] dark:border-[#2E3132] shadow-[0_4px_20px_rgba(0,0,0,0.04)] dark:shadow-none">
          <span className="text-[10px] font-medium text-[#5C5F62] dark:text-[#A0A4A8] uppercase tracking-wider">Total Products</span>
          <p className="text-2xl font-bold text-[#191C1D] dark:text-white mt-1 font-sans">1,284</p>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-[#191C1D] border border-[#E5E7EB] dark:border-[#2E3132] shadow-[0_4px_20px_rgba(0,0,0,0.04)] dark:shadow-none">
          <span className="text-[10px] font-medium text-[#5C5F62] dark:text-[#A0A4A8] uppercase tracking-wider">Total Reviews</span>
          <p className="text-2xl font-bold text-[#191C1D] dark:text-white mt-1 font-sans">57,534</p>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-[#191C1D] border border-[#E5E7EB] dark:border-[#2E3132] shadow-[0_4px_20px_rgba(0,0,0,0.04)] dark:shadow-none">
          <span className="text-[10px] font-medium text-[#5C5F62] dark:text-[#A0A4A8] uppercase tracking-wider">Reviews Analyzed</span>
          <p className="text-2xl font-bold text-[#191C1D] dark:text-white mt-1 font-sans">54,892</p>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-[#191C1D] border border-[#E5E7EB] dark:border-[#2E3132] shadow-[0_4px_20px_rgba(0,0,0,0.04)] dark:shadow-none">
          <span className="text-[10px] font-medium text-[#5C5F62] dark:text-[#A0A4A8] uppercase tracking-wider">Model Accuracy</span>
          <p className="text-2xl font-bold text-[#000000] dark:text-white mt-1 font-sans">91.8%</p>
        </div>
      </div>

      {/* Platform Growth & Global Sentiment Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Platform Growth Line Chart */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="lg:col-span-2 p-6 rounded-2xl bg-white dark:bg-[#191C1D] border border-[#E5E7EB] dark:border-[#2E3132] shadow-[0_4px_20px_rgba(0,0,0,0.04)] dark:shadow-none space-y-4"
        >
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-base font-bold text-[#191C1D] dark:text-white font-sans">Platform Growth</h3>
              <p className="text-xs text-[#5C5F62] dark:text-[#A0A4A8] font-mono">Monthly trajectory across Sellers, Products & Reviews</p>
            </div>
          </div>

          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={PLATFORM_GROWTH_DATA}>
                <CartesianGrid strokeDasharray="3 3" stroke={isDarkMode ? '#2E3132' : '#E5E7EB'} vertical={false} />
                <XAxis dataKey="date" stroke={isDarkMode ? '#A0A4A8' : '#5C5F62'} fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke={isDarkMode ? '#A0A4A8' : '#5C5F62'} fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip content={<ChartTooltip />} />
                <Legend wrapperStyle={{ fontSize: '11px', fontWeight: 500 }} iconType="circle" />
                <Line type="monotone" dataKey="reviews" name="Total Reviews" stroke={isDarkMode ? '#FFFFFF' : '#000000'} strokeWidth={2.5} dot={{ r: 3, fill: isDarkMode ? '#FFFFFF' : '#000000' }} />
                <Line type="monotone" dataKey="products" name="Products" stroke={isDarkMode ? '#94A3B8' : '#64748B'} strokeWidth={2} strokeDasharray="4 4" />
                <Line type="monotone" dataKey="sellers" name="Sellers" stroke={isDarkMode ? '#64748B' : '#CBD5E1'} strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Global Sentiment Distribution Donut */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="p-6 rounded-2xl bg-white dark:bg-[#191C1D] border border-[#E5E7EB] dark:border-[#2E3132] shadow-[0_4px_20px_rgba(0,0,0,0.04)] dark:shadow-none flex flex-col justify-between"
        >
          <div>
            <h3 className="text-base font-bold text-[#191C1D] dark:text-white font-sans">Global Sentiment Distribution</h3>
            <p className="text-xs text-[#5C5F62] dark:text-[#A0A4A8] font-mono">Ecosystem-wide sentiment proportions</p>
          </div>

          <div className="my-4">
            <SentimentChart positive={68.4} neutral={13.4} negative={18.2} size={180} />
          </div>

          <div className="grid grid-cols-3 gap-2 text-center font-mono text-xs">
            <div className="p-2.5 rounded-xl bg-[#F8F9FA] dark:bg-[#242729] border border-[#E5E7EB] dark:border-[#33373B]">
              <span className="text-[10px] text-[#000000] dark:text-white block font-semibold">Positive</span>
              <span className="text-sm font-bold text-[#000000] dark:text-white">68.4%</span>
            </div>
            <div className="p-2.5 rounded-xl bg-[#F8F9FA] dark:bg-[#242729] border border-[#E5E7EB] dark:border-[#33373B]">
              <span className="text-[10px] text-[#5C5F62] dark:text-[#A0A4A8] block font-semibold">Neutral</span>
              <span className="text-sm font-bold text-[#5C5F62] dark:text-[#A0A4A8]">13.4%</span>
            </div>
            <div className="p-2.5 rounded-xl bg-[#F8F9FA] dark:bg-[#242729] border border-[#E5E7EB] dark:border-[#33373B]">
              <span className="text-[10px] text-[#7E7576] dark:text-[#64748B] block font-semibold">Negative</span>
              <span className="text-sm font-bold text-[#7E7576] dark:text-[#64748B]">18.2%</span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Most Active Sellers & Most Reviewed Products */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Most Active Sellers */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="p-6 rounded-2xl bg-white dark:bg-[#191C1D] border border-[#E5E7EB] dark:border-[#2E3132] shadow-[0_4px_20px_rgba(0,0,0,0.04)] dark:shadow-none space-y-4"
        >
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-[#191C1D] dark:text-white font-sans">Most Active Sellers</h3>
            <button onClick={() => navigate('/admin/sellers')} className="text-xs font-mono text-[#000000] dark:text-white hover:underline flex items-center gap-1 cursor-pointer">
              All Sellers <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-2 font-mono text-xs">
            {MOST_ACTIVE_SELLERS.map((s) => (
              <div key={s.id} className="p-3.5 rounded-xl bg-[#F8F9FA] dark:bg-[#242729] border border-[#E5E7EB] dark:border-[#33373B] flex items-center justify-between hover:border-[#000000] dark:hover:border-white transition-colors">
                <div>
                  <h4 className="font-semibold text-[#191C1D] dark:text-white font-sans">{s.name}</h4>
                  <span className="text-[10px] text-[#5C5F62] dark:text-[#A0A4A8]">{s.email}</span>
                </div>
                <div className="text-right">
                  <span className="font-bold text-[#191C1D] dark:text-white block">{s.reviews.toLocaleString()} reviews</span>
                  <span className="text-[10px] text-[#000000] dark:text-white font-semibold">{s.sentimentScore} positive</span>
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
          className="p-6 rounded-2xl bg-white dark:bg-[#191C1D] border border-[#E5E7EB] dark:border-[#2E3132] shadow-[0_4px_20px_rgba(0,0,0,0.04)] dark:shadow-none space-y-4"
        >
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-[#191C1D] dark:text-white font-sans">Most Reviewed Products</h3>
            <button onClick={() => navigate('/admin/products')} className="text-xs font-mono text-[#000000] dark:text-white hover:underline flex items-center gap-1 cursor-pointer">
              All Products <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-2 font-mono text-xs">
            {MOST_REVIEWED_PRODUCTS.map((p) => (
              <div key={p.id} className="p-3.5 rounded-xl bg-[#F8F9FA] dark:bg-[#242729] border border-[#E5E7EB] dark:border-[#33373B] flex items-center justify-between hover:border-[#000000] dark:hover:border-white transition-colors">
                <div>
                  <h4 className="font-semibold text-[#191C1D] dark:text-white font-sans">{p.name}</h4>
                  <span className="text-[10px] text-[#5C5F62] dark:text-[#A0A4A8]">{p.category}</span>
                </div>
                <div className="text-right">
                  <span className="font-bold text-[#191C1D] dark:text-white block">{p.reviews.toLocaleString()} reviews</span>
                  <span className="text-[10px] text-[#5C5F62] dark:text-[#A0A4A8]">⭐ {p.rating} ({p.sentiment})</span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

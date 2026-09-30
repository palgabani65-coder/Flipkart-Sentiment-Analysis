import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  MessageSquare, Star, Smile, Frown, TrendingUp, TrendingDown,
  Minus, Download, MoreHorizontal, ArrowRight
} from 'lucide-react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';
import { useNotification } from '../../context/NotificationContext';
import { useTheme } from '../../context/ThemeContext';
import { SentimentChart } from '../../components/dashboard/SentimentChart';

const TREND_DATA = [
  { date: 'Mon', positive: 62, neutral: 28, negative: 14 },
  { date: 'Tue', positive: 78, neutral: 20, negative: 5 },
  { date: 'Wed', positive: 60, neutral: 35, negative: 20 },
  { date: 'Thu', positive: 72, neutral: 6, negative: 2 },
  { date: 'Fri', positive: 76, neutral: 22, negative: 10 },
];

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="px-3.5 py-2.5 rounded-xl bg-white dark:bg-[#191C1D] text-[#191C1D] dark:text-white text-xs shadow-2xl border border-[#E5E7EB] dark:border-[#33373B] space-y-1.5 font-mono min-w-[140px]">
        <p className="font-bold text-[#191C1D] dark:text-white pb-1 border-b border-[#E5E7EB] dark:border-[#2E3132]">{label}</p>
        {payload.map((p) => {
          const color = p.stroke || p.color;
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
              <span className="font-bold text-[#191C1D] dark:text-white">{p.value}%</span>
            </div>
          );
        })}
      </div>
    );
  }
  return null;
};

export const UserDashboardHome = () => {
  const navigate = useNavigate();
  const { addToast } = useNotification();
  const { theme, isDarkMode } = useTheme();
  const [timeRange, setTimeRange] = useState('7D');
  const [trendRange, setTrendRange] = useState('30D');

  const handleExport = () => {
    const csvContent = "Metric,Value,Period\nTotal Reviews,124592,+12.4%\nAvg Rating,4.2,0.0%\nPositive Sentiment,68%,+4.2%\nNegative Sentiment,14%,-1.8%\n";
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `flipsentiment-overview-${timeRange.toLowerCase()}-${Date.now()}.csv`;
    link.click();
    URL.revokeObjectURL(url);
    addToast(`Overview telemetry (${timeRange}) exported as CSV`, 'success');
  };

  return (
    <div className="space-y-6 pb-12 font-sans bg-[#F8F9FA] dark:bg-[#121415] text-[#191C1D] dark:text-white transition-colors">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h2 className="text-3xl md:text-5xl font-semibold text-[#000000] dark:text-white tracking-tight font-sans">
            Overview
          </h2>
          <p className="text-base md:text-lg text-[#5C5F62] dark:text-[#A0A4A8] mt-2 font-sans">
            Sentiment analysis across all active product streams.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Time range selector pills */}
          <div className="flex bg-[#FFFFFF] dark:bg-[#191C1D] border border-[#E5E7EB] dark:border-[#2E3132] rounded-lg overflow-hidden p-1 shadow-2xs">
            {['7D', '30D', '90D'].map((range) => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={`px-3 py-1 text-sm font-mono rounded transition-colors cursor-pointer ${timeRange === range
                  ? 'bg-[#E7E8E9] dark:bg-[#2E3132] text-[#000000] dark:text-white font-semibold'
                  : 'text-[#5C5F62] dark:text-[#A0A4A8] hover:bg-[#F3F4F5] dark:hover:bg-[#242729]'
                  }`}
              >
                {range}
              </button>
            ))}
          </div>

          {/* Export Button */}
          <button
            onClick={handleExport}
            className="h-10 px-4 bg-[#000000] dark:bg-white text-white dark:text-black rounded-lg text-xs font-mono hover:bg-[#2E3132] dark:hover:bg-slate-100 transition-colors flex items-center gap-2 cursor-pointer shadow-2xs"
          >
            <Download className="w-4 h-4" />
            <span>Export</span>
          </button>
        </div>
      </div>

      {/* Bento Grid Layout - 4 KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">

        {/* KPI 1: Total Reviews */}
        <div className="bg-[#FFFFFF] dark:bg-[#191C1D] rounded-xl p-6 shadow-[0_4px_20px_rgba(0,0,0,0.04)] dark:shadow-none border border-[#E5E7EB] dark:border-[#2E3132] flex flex-col justify-between h-40 relative overflow-hidden group cursor-pointer hover:border-[#000000] dark:hover:border-white transition-all hover:shadow-md">
          {/* Subtle Cool Slate Accent Background */}
          <div className="absolute inset-0 bg-gradient-to-br from-transparent to-[#F0F4F8] dark:to-[#1E293B] opacity-35 pointer-events-none rounded-xl" />

          <div className="flex justify-between items-start relative z-10">
            <span className="text-xs font-mono text-[#5C5F62] dark:text-[#A0A4A8] uppercase tracking-wider font-medium">
              Total Reviews
            </span>
            <MessageSquare className="w-5 h-5 text-[#000000] dark:text-white opacity-70 group-hover:opacity-100 transition-opacity" />
          </div>
          <div className="relative z-10">
            <div className="text-3xl font-bold text-[#000000] dark:text-white font-sans">
              124,592
            </div>
            <div className="flex items-center gap-1 mt-1">
              <TrendingUp className="w-3.5 h-3.5 text-[#000000] dark:text-white" />
              <span className="font-mono text-xs text-[#000000] dark:text-white font-semibold">+12.4%</span>
              <span className="font-mono text-xs text-[#5C5F62] dark:text-[#A0A4A8] ml-1">vs last period</span>
            </div>
          </div>
        </div>

        {/* KPI 2: Avg Rating */}
        <div className="bg-[#FFFFFF] dark:bg-[#191C1D] rounded-xl p-6 shadow-[0_4px_20px_rgba(0,0,0,0.04)] dark:shadow-none border border-[#E5E7EB] dark:border-[#2E3132] flex flex-col justify-between h-40 relative overflow-hidden group cursor-pointer hover:border-[#000000] dark:hover:border-white transition-all hover:shadow-md">
          {/* Subtle Amber Warm Accent Background */}
          <div className="absolute inset-0 bg-gradient-to-br from-transparent to-[#FEF3C7] dark:to-[#78350F]/20 opacity-20 pointer-events-none rounded-xl" />

          <div className="flex justify-between items-start relative z-10">
            <span className="text-xs font-mono text-[#5C5F62] dark:text-[#A0A4A8] uppercase tracking-wider font-medium">
              Avg Rating
            </span>
            <Star className="w-5 h-5 text-[#000000] dark:text-white opacity-70 group-hover:opacity-100 transition-opacity" />
          </div>
          <div className="relative z-10">
            <div className="text-3xl font-bold text-[#000000] dark:text-white font-sans">
              4.2
            </div>
            <div className="flex items-center gap-1 mt-1">
              <Minus className="w-3.5 h-3.5 text-[#5C5F62] dark:text-[#A0A4A8]" />
              <span className="font-mono text-xs text-[#5C5F62] dark:text-[#A0A4A8]">0.0%</span>
              <span className="font-mono text-xs text-[#5C5F62] dark:text-[#A0A4A8] ml-1">vs last period</span>
            </div>
          </div>
        </div>

        {/* KPI 3: Positive Sentiment */}
        <div className="bg-[#FFFFFF] dark:bg-[#191C1D] rounded-xl p-6 shadow-[0_4px_20px_rgba(0,0,0,0.04)] dark:shadow-none border border-[#E5E7EB] dark:border-[#2E3132] flex flex-col justify-between h-40 relative overflow-hidden group cursor-pointer hover:border-[#000000] dark:hover:border-white transition-all hover:shadow-md">
          {/* Subtle Icy Mint Accent Background */}
          <div className="absolute inset-0 bg-gradient-to-br from-transparent to-[#E0F2F1] dark:to-[#064E3B]/20 opacity-30 pointer-events-none rounded-xl" />

          <div className="flex justify-between items-start relative z-10">
            <span className="text-xs font-mono text-[#5C5F62] dark:text-[#A0A4A8] uppercase tracking-wider font-medium">
              Positive
            </span>
            <Smile className="w-5 h-5 text-[#000000] dark:text-white opacity-70 group-hover:opacity-100 transition-opacity" />
          </div>
          <div className="relative z-10">
            <div className="text-3xl font-bold text-[#000000] dark:text-white font-sans">
              68%
            </div>
            <div className="flex items-center gap-1 mt-1">
              <TrendingUp className="w-3.5 h-3.5 text-[#000000] dark:text-white" />
              <span className="font-mono text-xs text-[#000000] dark:text-white font-semibold">+4.2%</span>
              <span className="font-mono text-xs text-[#5C5F62] dark:text-[#A0A4A8] ml-1">vs last period</span>
            </div>
          </div>
        </div>

        {/* KPI 4: Negative Sentiment */}
        <div className="bg-[#FFFFFF] dark:bg-[#191C1D] rounded-xl p-6 shadow-[0_4px_20px_rgba(0,0,0,0.04)] dark:shadow-none border border-[#E5E7EB] dark:border-[#2E3132] flex flex-col justify-between h-40 relative overflow-hidden group cursor-pointer hover:border-[#000000] dark:hover:border-white transition-all hover:shadow-md">
          {/* Subtle Soft Rose Accent Background */}
          <div className="absolute inset-0 bg-gradient-to-br from-transparent to-[#FFEBEE] dark:to-[#881337]/20 opacity-25 pointer-events-none rounded-xl" />

          <div className="flex justify-between items-start relative z-10">
            <span className="text-xs font-mono text-[#5C5F62] dark:text-[#A0A4A8] uppercase tracking-wider font-medium">
              Negative
            </span>
            <Frown className="w-5 h-5 text-[#000000] dark:text-white opacity-70 group-hover:opacity-100 transition-opacity" />
          </div>
          <div className="relative z-10">
            <div className="text-3xl font-bold text-[#000000] dark:text-white font-sans">
              14%
            </div>
            <div className="flex items-center gap-1 mt-1">
              <TrendingDown className="w-3.5 h-3.5 text-[#000000] dark:text-white" />
              <span className="font-mono text-xs text-[#000000] dark:text-white font-semibold">-1.8%</span>
              <span className="font-mono text-xs text-[#5C5F62] dark:text-[#A0A4A8] ml-1">vs last period</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Trajectory Line Chart (Takes up 2 columns) */}
        <div className="lg:col-span-2 bg-[#FFFFFF] dark:bg-[#191C1D] rounded-xl p-6 shadow-[0_4px_20px_rgba(0,0,0,0.04)] dark:shadow-none border border-[#E5E7EB] dark:border-[#2E3132] min-h-[400px] flex flex-col justify-between">
          <div className="flex justify-between items-center mb-2">
            <div>
              <h3 className="text-lg font-medium text-[#000000] dark:text-white font-sans tracking-tight">
                Sentiment Trajectory
              </h3>
              <p className="text-xs text-[#5C5F62] dark:text-[#A0A4A8] mt-0.5 font-mono">
                Review volume trend by sentiment classification over time
              </p>
            </div>
            <button className="text-[#5C5F62] dark:text-[#A0A4A8] hover:text-[#000000] dark:hover:text-white transition-colors cursor-pointer">
              <MoreHorizontal className="w-5 h-5" />
            </button>
          </div>

          <div className="h-72 mt-4 w-full flex-1 min-h-[260px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={TREND_DATA}>
                <CartesianGrid strokeDasharray="3 3" stroke={isDarkMode ? '#2E3132' : '#E5E7EB'} opacity={0.6} vertical={false} />
                <XAxis dataKey="date" stroke={isDarkMode ? '#A0A4A8' : '#5C5F62'} fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke={isDarkMode ? '#A0A4A8' : '#5C5F62'} fontSize={11} tickLine={false} axisLine={false} domain={[0, 100]} ticks={[0, 50, 100]} />
                <Tooltip content={<CustomTooltip />} />
                <Legend wrapperStyle={{ fontSize: '11px', fontFamily: 'Geist, monospace', paddingTop: '8px' }} iconType="circle" />
                <Line
                  type="monotone"
                  dataKey="positive"
                  name="Positive"
                  stroke={isDarkMode ? '#FFFFFF' : '#000000'}
                  strokeWidth={2.5}
                  dot={{ r: 3.5, fill: isDarkMode ? '#FFFFFF' : '#000000' }}
                  activeDot={{ r: 6, fill: isDarkMode ? '#191C1D' : '#FFFFFF', stroke: isDarkMode ? '#FFFFFF' : '#000000', strokeWidth: 2 }}
                />
                <Line
                  type="monotone"
                  dataKey="neutral"
                  name="Neutral"
                  stroke={isDarkMode ? '#94A3B8' : '#505F76'}
                  strokeWidth={2}
                  dot={{ r: 3, fill: isDarkMode ? '#94A3B8' : '#505F76' }}
                  activeDot={{ r: 5, fill: isDarkMode ? '#191C1D' : '#FFFFFF', stroke: isDarkMode ? '#94A3B8' : '#505F76', strokeWidth: 2 }}
                />
                <Line
                  type="monotone"
                  dataKey="negative"
                  name="Negative"
                  stroke={isDarkMode ? '#64748B' : '#CAD5E2'}
                  strokeWidth={2.5}
                  dot={{ r: 3.5, fill: isDarkMode ? '#64748B' : '#CAD5E2' }}
                  activeDot={{ r: 6, fill: isDarkMode ? '#191C1D' : '#FFFFFF', stroke: isDarkMode ? '#64748B' : '#CAD5E2', strokeWidth: 2 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Sentiment Distribution Donut (1 column) */}
        <div className="bg-[#FFFFFF] dark:bg-[#191C1D] rounded-xl p-6 shadow-[0_4px_20px_rgba(0,0,0,0.04)] dark:shadow-none border border-[#E5E7EB] dark:border-[#2E3132] min-h-[400px] flex flex-col justify-between">
          <div>
            <h3 className="text-base font-bold text-[#191C1D] dark:text-white font-sans">
              Sentiment Distribution
            </h3>
            <p className="text-xs text-[#5C5F62] dark:text-[#A0A4A8] font-mono mt-0.5">
              Aggregate proportions across catalog
            </p>
          </div>

          <div className="my-2 flex justify-center">
            <SentimentChart positive={68.4} neutral={13.4} negative={18.2} size={185} />
          </div>

          {/* 3 Bottom KPI Cards */}
          <div className="grid grid-cols-3 gap-2 text-center font-mono pt-1">
            <div className="p-2.5 rounded-xl bg-[#F8F9FA] dark:bg-[#242729] border border-[#E5E7EB] dark:border-[#33373B]">
              <span className="text-[11px] text-[#5C5F62] dark:text-[#A0A4A8] block font-medium">Positive</span>
              <span className="text-base font-bold text-[#000000] dark:text-white mt-0.5 block">68.4%</span>
            </div>
            <div className="p-2.5 rounded-xl bg-[#F8F9FA] dark:bg-[#242729] border border-[#E5E7EB] dark:border-[#33373B]">
              <span className="text-[11px] text-[#5C5F62] dark:text-[#A0A4A8] block font-medium">Neutral</span>
              <span className="text-base font-bold text-[#5C5F62] dark:text-[#A0A4A8] mt-0.5 block">13.4%</span>
            </div>
            <div className="p-2.5 rounded-xl bg-[#F8F9FA] dark:bg-[#242729] border border-[#E5E7EB] dark:border-[#33373B]">
              <span className="text-[11px] text-[#5C5F62] dark:text-[#A0A4A8] block font-medium">Negative</span>
              <span className="text-base font-bold text-[#5C5F62] dark:text-[#A0A4A8] mt-0.5 block">18.2%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Row: Trending Topics & Signal Snapshot */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Trending Topics Keyword Cloud */}
        <div className="bg-[#FFFFFF] dark:bg-[#191C1D] rounded-xl p-6 shadow-[0_4px_20px_rgba(0,0,0,0.04)] dark:shadow-none border border-[#E5E7EB] dark:border-[#2E3132] min-h-[320px] flex flex-col justify-between">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium text-[#000000] dark:text-white font-sans">
              Trending Topics
            </h3>
            <span className="px-2.5 py-1 bg-[#F3F4F5] dark:bg-[#242729] text-[#5C5F62] dark:text-[#A0A4A8] text-xs rounded font-mono">
              Top 15
            </span>
          </div>

          {/* Word Cloud layout matching exact mockup */}
          <div className="flex flex-wrap gap-3 items-center justify-center flex-1 py-4">
            <span className="text-3xl font-bold text-[#000000] dark:text-white px-2 py-1 cursor-pointer hover:bg-[#F3F4F5] dark:hover:bg-[#242729] rounded transition-colors font-sans">
              Integration
            </span>
            <span className="text-lg text-[#5C5F62] dark:text-[#A0A4A8] px-2 py-1 cursor-pointer hover:bg-[#F3F4F5] dark:hover:bg-[#242729] rounded transition-colors font-sans">
              Pricing
            </span>
            <span className="text-2xl font-medium text-[#000000] dark:text-white px-2 py-1 cursor-pointer hover:bg-[#F3F4F5] dark:hover:bg-[#242729] rounded transition-colors border-b-2 border-[#7E7576] font-sans">
              Customer Support
            </span>
            <span className="text-sm text-[#5C5F62] dark:text-[#A0A4A8] px-2 py-1 cursor-pointer hover:bg-[#F3F4F5] dark:hover:bg-[#242729] rounded transition-colors font-sans">
              Onboarding
            </span>
            <span className="text-xl font-semibold text-[#000000] dark:text-white px-2 py-1 cursor-pointer hover:bg-[#F3F4F5] dark:hover:bg-[#242729] rounded transition-colors font-sans">
              Speed
            </span>
            <span className="text-base text-[#5C5F62] dark:text-[#A0A4A8] px-2 py-1 cursor-pointer hover:bg-[#F3F4F5] dark:hover:bg-[#242729] rounded transition-colors font-sans">
              UI Design
            </span>
            <span className="text-4xl font-bold text-[#000000] dark:text-white px-2 py-1 cursor-pointer hover:bg-[#F3F4F5] dark:hover:bg-[#242729] rounded transition-colors relative group font-sans">
              Reliability
              <span className="absolute -top-1 -right-2 w-2.5 h-2.5 bg-[#000000] dark:bg-white rounded-full" />
            </span>
            <span className="text-sm text-[#7E7576] dark:text-[#64748B] px-2 py-1 cursor-pointer hover:bg-[#F3F4F5] dark:hover:bg-[#242729] rounded transition-colors line-through decoration-[#7E7576] font-sans">
              Downtime
            </span>
            <span className="text-lg text-[#000000] dark:text-white px-2 py-1 cursor-pointer hover:bg-[#F3F4F5] dark:hover:bg-[#242729] rounded transition-colors font-sans">
              Analytics
            </span>
            <span className="text-xs text-[#5C5F62] dark:text-[#A0A4A8] px-2 py-1 cursor-pointer hover:bg-[#F3F4F5] dark:hover:bg-[#242729] rounded transition-colors font-sans">
              Export
            </span>
            <span className="text-xl font-medium text-[#000000] dark:text-white px-2 py-1 cursor-pointer hover:bg-[#F3F4F5] dark:hover:bg-[#242729] rounded transition-colors font-sans">
              API Access
            </span>
            <span className="text-base text-[#5C5F62] dark:text-[#A0A4A8] px-2 py-1 cursor-pointer hover:bg-[#F3F4F5] dark:hover:bg-[#242729] rounded transition-colors font-sans">
              Documentation
            </span>
          </div>

          <div className="pt-3 border-t border-[#E5E7EB] dark:border-[#2E3132] flex items-center justify-between text-xs font-mono text-[#5C5F62] dark:text-[#A0A4A8]">
            <span>Active stream monitoring</span>
            <button
              onClick={() => navigate('/dashboard/analytics')}
              className="text-[#000000] dark:text-white font-semibold hover:underline flex items-center gap-1 cursor-pointer"
            >
              Analytics Deep Dive <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Signal Snapshot (Quotes with left indicator bars) */}
        <div className="bg-[#FFFFFF] dark:bg-[#191C1D] rounded-xl p-6 shadow-[0_4px_20px_rgba(0,0,0,0.04)] dark:shadow-none border border-[#E5E7EB] dark:border-[#2E3132] min-h-[320px] flex flex-col justify-between">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium text-[#000000] dark:text-white font-sans">
              Signal Snapshot
            </h3>
            <button
              onClick={() => navigate('/dashboard/history')}
              className="text-xs font-mono text-[#5C5F62] dark:text-[#A0A4A8] hover:text-[#000000] dark:hover:text-white transition-colors flex items-center gap-1 cursor-pointer"
            >
              View All <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="flex-1 space-y-3 overflow-y-auto pr-1">
            {/* Review Item 1 */}
            <div className="p-3.5 bg-[#F8F9FA] dark:bg-[#242729] rounded-lg border border-[#EDEEEF] dark:border-[#33373B] flex gap-3.5 items-start group hover:border-[#7E7576] dark:hover:border-[#5C5F62] transition-colors">
              <div className="w-1.5 h-full min-h-[44px] bg-[#000000] dark:bg-white rounded-full mt-1 shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start mb-1">
                  <span className="text-xs font-semibold text-[#000000] dark:text-white font-sans">
                    "Game-changing reliability."
                  </span>
                  <span className="font-mono text-[10px] text-[#5C5F62] dark:text-[#848484] shrink-0 ml-2">2h ago</span>
                </div>
                <p className="text-xs text-[#5C5F62] dark:text-[#A0A4A8] line-clamp-2 leading-relaxed font-sans">
                  The new infrastructure upgrade has completely eliminated the latency issues we were seeing during peak hours.
                </p>
              </div>
            </div>

            {/* Review Item 2 */}
            <div className="p-3.5 bg-[#F8F9FA] dark:bg-[#242729] rounded-lg border border-[#EDEEEF] dark:border-[#33373B] flex gap-3.5 items-start group hover:border-[#7E7576] dark:hover:border-[#5C5F62] transition-colors">
              <div className="w-1.5 h-full min-h-[44px] bg-[#505F76] dark:bg-[#94A3B8] rounded-full mt-1 shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start mb-1">
                  <span className="text-xs font-semibold text-[#000000] dark:text-white font-sans">
                    "Solid update, missing export."
                  </span>
                  <span className="font-mono text-[10px] text-[#5C5F62] dark:text-[#848484] shrink-0 ml-2">5h ago</span>
                </div>
                <p className="text-xs text-[#5C5F62] dark:text-[#A0A4A8] line-clamp-2 leading-relaxed font-sans">
                  Appreciate the new UI layout, but moving the CSV export to a secondary menu adds friction to my daily workflow.
                </p>
              </div>
            </div>

            {/* Review Item 3 */}
            <div className="p-3.5 bg-[#F8F9FA] dark:bg-[#242729] rounded-lg border border-[#EDEEEF] dark:border-[#33373B] flex gap-3.5 items-start group hover:border-[#7E7576] dark:hover:border-[#5C5F62] transition-colors">
              <div className="w-1.5 h-full min-h-[44px] bg-[#CAD5E2] dark:bg-[#64748B] rounded-full mt-1 shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start mb-1">
                  <span className="text-xs font-semibold text-[#000000] dark:text-white font-sans">
                    "Support response slow."
                  </span>
                  <span className="font-mono text-[10px] text-[#5C5F62] dark:text-[#848484] shrink-0 ml-2">1d ago</span>
                </div>
                <p className="text-xs text-[#5C5F62] dark:text-[#A0A4A8] line-clamp-2 leading-relaxed font-sans">
                  Still waiting on a resolution for ticket #4829. Usually faster, not sure what the delay is this week.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

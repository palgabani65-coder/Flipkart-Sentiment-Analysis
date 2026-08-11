import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  BarChart3, 
  PieChart as PieIcon, 
  TrendingUp, 
  Layers, 
  BrainCircuit, 
  Filter,
  Download
} from 'lucide-react';
import { 
  PieChart, 
  Pie, 
  Cell, 
  Tooltip, 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Legend, 
  LineChart, 
  Line, 
  RadarChart, 
  PolarGrid, 
  PolarAngleAxis, 
  PolarRadiusAxis, 
  Radar 
} from 'recharts';
import { analyticsService } from '../services/analyticsService';
import { useNotification } from '../context/NotificationContext';

const COLORS = {
  positive: '#10b981', // Emerald
  neutral: '#f59e0b',  // Amber
  negative: '#f43f5e',  // Rose
  blue: '#3b82f6',
  purple: '#8b5cf6'
};

export const Analytics = () => {
  const { addToast } = useNotification();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAnalytics();
  }, []);

  const loadAnalytics = async () => {
    try {
      setLoading(true);
      const res = await analyticsService.getAnalyticsData();
      setData(res);
    } catch (err) {
      addToast('Failed to load analytics metrics', 'error');
    } finally {
      setLoading(false);
    }
  };

  if (loading || !data) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const pieData = [
    { name: 'Positive Sentiment', value: data.overallPositivePercent, color: COLORS.positive },
    { name: 'Neutral Sentiment', value: data.overallNeutralPercent, color: COLORS.neutral },
    { name: 'Negative Sentiment', value: data.overallNegativePercent, color: COLORS.negative }
  ];

  return (
    <div className="space-y-8 pb-12">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900 dark:text-white flex items-center gap-2">
            <BarChart3 className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            Sentiment Analytics & Insights Hub
          </h1>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Aggregated Flipkart review sentiment distribution, ratings correlation, and longitudinal NLP trends
          </p>
        </div>

        <button
          onClick={() => addToast('Analytics report exported', 'success')}
          className="px-4 py-2 rounded-xl bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800 text-xs font-bold hover:bg-blue-100 transition-colors flex items-center gap-2 self-start"
        >
          <Download className="w-4 h-4" /> Export Report CSV
        </button>
      </div>

      {/* Row 1: Donut Chart & Rating Alignment */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Sentiment Distribution Donut (5 cols) */}
        <div className="lg:col-span-5 p-6 rounded-3xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 shadow-sm space-y-4">
          <div>
            <h2 className="text-base font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <PieIcon className="w-4 h-4 text-blue-500" />
              Overall Sentiment Distribution
            </h2>
            <p className="text-xs text-gray-400">Share of Positive, Neutral & Negative reviews</p>
          </div>

          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value) => [`${value}%`, 'Share']}
                  contentStyle={{ backgroundColor: '#1e293b', borderRadius: '12px', border: 'none', color: '#fff', fontSize: '12px' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-3 gap-2 text-center text-xs font-bold">
            <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
              <span className="block text-base">{data.overallPositivePercent}%</span>
              <span className="text-[10px] opacity-80 font-medium">Positive</span>
            </div>
            <div className="p-2.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-800">
              <span className="block text-base">{data.overallNeutralPercent}%</span>
              <span className="text-[10px] opacity-80 font-medium">Neutral</span>
            </div>
            <div className="p-2.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-800">
              <span className="block text-base">{data.overallNegativePercent}%</span>
              <span className="text-[10px] opacity-80 font-medium">Negative</span>
            </div>
          </div>
        </div>

        {/* Rating vs Sentiment Stacked Bar (7 cols) */}
        <div className="lg:col-span-7 p-6 rounded-3xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 shadow-sm space-y-4">
          <div>
            <h2 className="text-base font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <Layers className="w-4 h-4 text-purple-500" />
              Rating Stars vs Predicted Sentiment
            </h2>
            <p className="text-xs text-gray-400">Comparing 1-5 Star Ratings against NLP model predictions</p>
          </div>

          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.ratingVsSentiment} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                <XAxis dataKey="rating" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#1e293b', borderRadius: '12px', border: 'none', color: '#fff', fontSize: '12px' }}
                />
                <Legend wrapperStyle={{ fontSize: '11px' }} />
                <Bar dataKey="positive" name="Positive %" stackId="a" fill={COLORS.positive} radius={[0, 0, 0, 0]} />
                <Bar dataKey="neutral" name="Neutral %" stackId="a" fill={COLORS.neutral} />
                <Bar dataKey="negative" name="Negative %" stackId="a" fill={COLORS.negative} radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      {/* Row 2: Sentiment Trend Line & Category Radar */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Monthly Trend Timeline (7 cols) */}
        <div className="lg:col-span-7 p-6 rounded-3xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 shadow-sm space-y-4">
          <div>
            <h2 className="text-base font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-emerald-500" />
              Longitudinal Sentiment Trend
            </h2>
            <p className="text-xs text-gray-400">Monthly sentiment progression over recent timeframes</p>
          </div>

          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data.monthlyTrends} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#1e293b', borderRadius: '12px', border: 'none', color: '#fff', fontSize: '12px' }}
                />
                <Legend wrapperStyle={{ fontSize: '11px' }} />
                <Line type="monotone" dataKey="positive" name="Positive %" stroke={COLORS.positive} strokeWidth={3} dot={{ r: 4 }} />
                <Line type="monotone" dataKey="negative" name="Negative %" stroke={COLORS.negative} strokeWidth={3} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Category Radar Benchmark (5 cols) */}
        <div className="lg:col-span-5 p-6 rounded-3xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 shadow-sm space-y-4">
          <div>
            <h2 className="text-base font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <BrainCircuit className="w-4 h-4 text-blue-500" />
              Category Sentiment Benchmark
            </h2>
            <p className="text-xs text-gray-400">Positive sentiment percentage across Flipkart product categories</p>
          </div>

          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={data.categoryBreakdown}>
                <PolarGrid opacity={0.2} />
                <PolarAngleAxis dataKey="category" tick={{ fontSize: 11, fill: '#64748b' }} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fontSize: 10 }} />
                <Radar name="Positive %" dataKey="positive" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.4} />
                <Tooltip contentStyle={{ backgroundColor: '#1e293b', borderRadius: '12px', color: '#fff', fontSize: '12px' }} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      {/* Row 3: Top Aspects Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Top Positive Aspects */}
        <div className="p-6 rounded-3xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 shadow-sm space-y-4">
          <h2 className="text-base font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-2">
            Top Praised Aspects (Positive Highlights)
          </h2>
          <div className="space-y-3">
            {data.topPositiveAspects.map((asp, idx) => (
              <div key={idx} className="p-3 rounded-2xl bg-emerald-50/60 dark:bg-emerald-950/30 flex items-center justify-between">
                <div>
                  <h3 className="text-xs font-bold text-gray-900 dark:text-white">{asp.aspect}</h3>
                  <span className="text-[11px] text-gray-500">{asp.count.toLocaleString()} mentions</span>
                </div>
                <span className="text-xs font-extrabold text-emerald-600 dark:text-emerald-400 font-mono">
                  {asp.sentimentScore}%
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Top Negative Aspects */}
        <div className="p-6 rounded-3xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 shadow-sm space-y-4">
          <h2 className="text-base font-bold text-rose-600 dark:text-rose-400 flex items-center gap-2">
            Top Flagged Issues (Negative Complaints)
          </h2>
          <div className="space-y-3">
            {data.topNegativeAspects.map((asp, idx) => (
              <div key={idx} className="p-3 rounded-2xl bg-rose-50/60 dark:bg-rose-950/30 flex items-center justify-between">
                <div>
                  <h3 className="text-xs font-bold text-gray-900 dark:text-white">{asp.aspect}</h3>
                  <span className="text-[11px] text-gray-500">{asp.count.toLocaleString()} mentions</span>
                </div>
                <span className="text-xs font-extrabold text-rose-600 dark:text-rose-400 font-mono">
                  {asp.sentimentScore}%
                </span>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
};

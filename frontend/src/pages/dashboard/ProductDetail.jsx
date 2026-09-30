import React from 'react';
import { motion } from 'framer-motion';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, Star, TrendingUp, ThumbsUp, ThumbsDown, 
  CheckCircle2, XCircle, MessageSquareText, BarChart3
} from 'lucide-react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
import { SentimentBadge } from '../../components/common/SentimentBadge';
import { SentimentChart } from '../../components/dashboard/SentimentChart';
import { useTheme } from '../../context/ThemeContext';

const PRODUCT_DATA = {
  p1: {
    name: 'Samsung Galaxy S24 Ultra 5G',
    category: 'Smartphones',
    rating: 4.3,
    reviews: 2431,
    overallSentiment: 'Positive',
    positive: 74,
    neutral: 16,
    negative: 10,
    ratingDist: [
      { stars: '5★', count: 980, pct: 40 },
      { stars: '4★', count: 730, pct: 30 },
      { stars: '3★', count: 390, pct: 16 },
      { stars: '2★', count: 195, pct: 8 },
      { stars: '1★', count: 136, pct: 6 },
    ],
    trendData: [
      { week: 'W1', positive: 70, neutral: 18, negative: 12 },
      { week: 'W2', positive: 72, neutral: 17, negative: 11 },
      { week: 'W3', positive: 68, neutral: 19, negative: 13 },
      { week: 'W4', positive: 74, neutral: 16, negative: 10 },
      { week: 'W5', positive: 76, neutral: 15, negative: 9 },
      { week: 'W6', positive: 74, neutral: 16, negative: 10 },
    ],
    positiveFeedback: [
      'Excellent camera quality and S-Pen precision',
      'Bright AMOLED display with vivid colors',
      'Premium titanium build quality',
      'Fast delivery and good packaging',
      'Great value for flagship segment',
    ],
    negativeFeedback: [
      'Battery drains faster than expected',
      'Heavier compared to previous model',
      'S-Pen gesture response delay',
      'Heating during extended gaming sessions',
    ],
    recentReviews: [
      { id: 'r1', text: 'Absolutely love the camera. Night mode is incredible, best phone I have used.', rating: 5, sentiment: 'Positive', confidence: 96.2, date: 'Today' },
      { id: 'r2', text: 'Battery performance is disappointing. Barely lasts a full day with moderate use.', rating: 2, sentiment: 'Negative', confidence: 91.4, date: 'Yesterday' },
      { id: 'r3', text: 'Display is beautiful. Performance is smooth. Worth the price for Samsung fans.', rating: 4, sentiment: 'Positive', confidence: 88.7, date: '2 days ago' },
      { id: 'r4', text: 'Average camera for the price. Nothing groundbreaking. Decent phone overall.', rating: 3, sentiment: 'Neutral', confidence: 67.3, date: '3 days ago' },
      { id: 'r5', text: 'Phone heats up significantly while charging. Customer support was unhelpful.', rating: 2, sentiment: 'Negative', confidence: 93.1, date: '4 days ago' },
    ],
  },
};

const getProductData = (id) => PRODUCT_DATA[id] || PRODUCT_DATA.p1;

const ChartTooltip = ({ active, payload, label }) => {
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

export const ProductDetail = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const { isDarkMode } = useTheme();
  const data = getProductData(productId);

  return (
    <div className="space-y-6 pb-8 font-sans text-[#191C1D] dark:text-white transition-colors">
      {/* Back + Header */}
      <div className="flex items-start gap-4">
        <button
          onClick={() => navigate('/dashboard/products')}
          className="mt-1 p-2 rounded-xl border border-[#E5E7EB] dark:border-[#2E3132] text-[#5C5F62] dark:text-[#A0A4A8] hover:text-[#191C1D] dark:hover:text-white hover:bg-[#F8F9FA] dark:hover:bg-[#242729] transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div className="flex-1">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-[#191C1D] dark:text-white tracking-tight font-sans">{data.name}</h2>
              <div className="flex items-center gap-3 mt-1.5 font-mono">
                <div className="flex items-center gap-1">
                  <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-400" />
                  <span className="text-sm font-bold text-[#191C1D] dark:text-white">{data.rating}</span>
                </div>
                <span className="text-xs text-[#5C5F62] dark:text-[#A0A4A8]">{data.reviews.toLocaleString()} reviews</span>
                <SentimentBadge sentiment={data.overallSentiment} size="sm" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Top Row: Sentiment Breakdown + Review Trend */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sentiment Breakdown */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-6 rounded-2xl bg-white dark:bg-[#191C1D] border border-[#E5E7EB] dark:border-[#2E3132] shadow-[0_4px_20px_rgba(0,0,0,0.04)] dark:shadow-none"
        >
          <h3 className="text-base font-bold text-[#191C1D] dark:text-white mb-5 font-sans">Sentiment Breakdown</h3>
          <SentimentChart positive={data.positive} neutral={data.neutral} negative={data.negative} size={180} />
        </motion.div>

        {/* Review Trend */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="p-6 rounded-2xl bg-white dark:bg-[#191C1D] border border-[#E5E7EB] dark:border-[#2E3132] shadow-[0_4px_20px_rgba(0,0,0,0.04)] dark:shadow-none"
        >
          <h3 className="text-base font-bold text-[#191C1D] dark:text-white mb-5 font-sans">Review Trajectory Trend</h3>
          <div className="h-52">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data.trendData}>
                <defs>
                  <linearGradient id="gradP" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={isDarkMode ? '#FFFFFF' : '#000000'} stopOpacity={0.2}/>
                    <stop offset="95%" stopColor={isDarkMode ? '#FFFFFF' : '#000000'} stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke={isDarkMode ? '#2E3132' : '#F0F1F3'} vertical={false} />
                <XAxis dataKey="week" stroke={isDarkMode ? '#A0A4A8' : '#94A3B8'} fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke={isDarkMode ? '#A0A4A8' : '#94A3B8'} fontSize={11} tickLine={false} axisLine={false} unit="%" />
                <Tooltip content={<ChartTooltip />} />
                <Area type="monotone" dataKey="positive" stroke={isDarkMode ? '#FFFFFF' : '#000000'} strokeWidth={2.5} fillOpacity={1} fill="url(#gradP)" />
                <Area type="monotone" dataKey="negative" stroke={isDarkMode ? '#64748B' : '#7E7576'} strokeWidth={2} fillOpacity={0} fill="transparent" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>

      {/* Rating Distribution */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="p-6 rounded-2xl bg-white dark:bg-[#191C1D] border border-[#E5E7EB] dark:border-[#2E3132] shadow-[0_4px_20px_rgba(0,0,0,0.04)] dark:shadow-none"
      >
        <h3 className="text-base font-bold text-[#191C1D] dark:text-white mb-5 font-sans">Rating Distribution</h3>
        <div className="space-y-3">
          {data.ratingDist.map((item) => (
            <div key={item.stars} className="flex items-center gap-3 font-mono">
              <span className="text-xs font-semibold text-[#191C1D] dark:text-white w-8">{item.stars}</span>
              <div className="flex-1 h-2.5 rounded-full bg-[#F3F4F5] dark:bg-[#2E3132] overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-500 bg-[#000000] dark:bg-white"
                  style={{ width: `${item.pct}%` }}
                />
              </div>
              <span className="text-xs text-[#5C5F62] dark:text-[#A0A4A8] font-mono w-14 text-right">{item.count.toLocaleString()}</span>
              <span className="text-[10px] text-[#000000] dark:text-white font-mono font-semibold w-10 text-right">{item.pct}%</span>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Positive / Negative Feedback */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="p-6 rounded-2xl bg-white dark:bg-[#191C1D] border border-[#E5E7EB] dark:border-[#2E3132] shadow-[0_4px_20px_rgba(0,0,0,0.04)] dark:shadow-none"
        >
          <h3 className="text-base font-bold text-[#191C1D] dark:text-white mb-4 flex items-center gap-2 font-sans">
            <ThumbsUp className="w-4 h-4 text-[#000000] dark:text-white" />
            Common Positive Feedback
          </h3>
          <div className="space-y-2.5">
            {data.positiveFeedback.map((item, i) => (
              <div key={i} className="flex items-start gap-2.5 p-3 rounded-xl bg-[#F8F9FA] dark:bg-[#242729] border border-[#EDEEEF] dark:border-[#33373B]">
                <CheckCircle2 className="w-4 h-4 text-[#000000] dark:text-white shrink-0 mt-0.5" />
                <span className="text-xs text-[#191C1D] dark:text-white font-medium">{item}</span>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="p-6 rounded-2xl bg-white dark:bg-[#191C1D] border border-[#E5E7EB] dark:border-[#2E3132] shadow-[0_4px_20px_rgba(0,0,0,0.04)] dark:shadow-none"
        >
          <h3 className="text-base font-bold text-[#191C1D] dark:text-white mb-4 flex items-center gap-2 font-sans">
            <ThumbsDown className="w-4 h-4 text-[#BA1A1A] dark:text-red-400" />
            Common Negative Feedback
          </h3>
          <div className="space-y-2.5">
            {data.negativeFeedback.map((item, i) => (
              <div key={i} className="flex items-start gap-2.5 p-3 rounded-xl bg-rose-50/50 dark:bg-rose-950/20 border border-rose-200/60 dark:border-rose-900/40">
                <XCircle className="w-4 h-4 text-[#BA1A1A] dark:text-red-400 shrink-0 mt-0.5" />
                <span className="text-xs text-[#191C1D] dark:text-white font-medium">{item}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Recent Reviews */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="rounded-2xl bg-white dark:bg-[#191C1D] border border-[#E5E7EB] dark:border-[#2E3132] shadow-[0_4px_20px_rgba(0,0,0,0.04)] dark:shadow-none overflow-hidden"
      >
        <div className="p-5 border-b border-[#E5E7EB] dark:border-[#2E3132]">
          <h3 className="text-base font-bold text-[#191C1D] dark:text-white font-sans">Recent Reviews</h3>
        </div>
        <div className="divide-y divide-[#E5E7EB] dark:divide-[#2E3132]">
          {data.recentReviews.map((review) => (
            <div key={review.id} className="p-5 hover:bg-[#F8F9FA] dark:hover:bg-[#242729] transition-colors">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <p className="text-xs font-medium text-[#191C1D] dark:text-white leading-relaxed font-sans">
                    "{review.text}"
                  </p>
                  <div className="flex items-center gap-3 mt-2.5 font-mono">
                    <div className="flex items-center gap-0.5">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={`w-3 h-3 ${i < review.rating ? 'text-[#000000] dark:text-white fill-[#000000] dark:fill-white' : 'text-[#E5E7EB] dark:text-[#33373B]'}`}
                        />
                      ))}
                    </div>
                    <SentimentBadge sentiment={review.sentiment} size="sm" />
                    <span className="text-[10px] text-[#5C5F62] dark:text-[#A0A4A8]">Conf: {review.confidence}%</span>
                  </div>
                </div>
                <span className="text-[10px] text-[#5C5F62] dark:text-[#A0A4A8] font-mono shrink-0">{review.date}</span>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

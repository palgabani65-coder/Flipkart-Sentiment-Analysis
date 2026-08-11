import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Sparkles, 
  MessageSquare, 
  ThumbsUp, 
  ThumbsDown, 
  TrendingUp, 
  ShoppingBag, 
  BrainCircuit, 
  ArrowRight,
  RefreshCw,
  Search
} from 'lucide-react';
import { StatCard } from '../components/common/StatCard';
import { SentimentBadge } from '../components/common/SentimentBadge';
import { predictionService } from '../services/predictionService';
import { productService } from '../services/productService';
import { analyticsService } from '../services/analyticsService';
import { useNotification } from '../context/NotificationContext';

export const Dashboard = () => {
  const { addToast } = useNotification();
  const [stats, setStats] = useState(null);
  const [recentReviews, setRecentReviews] = useState([]);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Quick predict widget state
  const [quickInput, setQuickInput] = useState('');
  const [quickResult, setQuickResult] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const [analytics, prodRes, history] = await Promise.all([
        analyticsService.getAnalyticsData(),
        productService.getProducts({ limit: 4 }),
        predictionService.getHistory()
      ]);

      setStats(analytics);
      setFeaturedProducts(prodRes.products);
      setRecentReviews(history.slice(0, 5));
    } catch (err) {
      addToast('Failed to load dashboard metrics', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickPredict = async (e) => {
    e.preventDefault();
    if (!quickInput.trim()) return;

    try {
      setAnalyzing(true);
      const res = await predictionService.predictSingle(quickInput);
      setQuickResult(res);
      addToast(`Predicted sentiment: ${res.sentiment}`, 'success');
      loadDashboardData();
    } catch (err) {
      addToast(err.message || 'Analysis failed', 'error');
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <div className="space-y-8 pb-12">
      
      {/* Hero Welcome Banner */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative rounded-3xl fk-gradient p-8 text-white overflow-hidden shadow-xl"
      >
        <div className="absolute right-0 top-0 bottom-0 w-1/2 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-yellow-300/20 via-transparent to-transparent pointer-events-none" />

        <div className="relative z-10 max-w-2xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-semibold text-yellow-300">
            <BrainCircuit className="w-4 h-4" /> AI Sentiment Analytics Platform v2.4
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Flipkart Customer Review Intelligence
          </h1>

          <p className="text-sm text-blue-100 leading-relaxed">
            Real-time NLP sentiment analysis engine analyzing thousands of buyer reviews to extract aspect-level feedback, confidence ratings, and satisfaction trends.
          </p>

          <div className="pt-2 flex flex-wrap gap-3">
            <Link
              to="/predict"
              className="px-5 py-2.5 rounded-full bg-yellow-400 hover:bg-yellow-300 text-blue-950 font-extrabold text-sm shadow-md transition-all flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4" /> Open Sentiment Predictor
            </Link>
            <Link
              to="/analytics"
              className="px-5 py-2.5 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md text-white font-bold text-sm border border-white/20 transition-all flex items-center gap-2"
            >
              View Analytics Hub
            </Link>
          </div>
        </div>
      </motion.div>

      {/* Overview Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard
          title="Analyzed Reviews"
          value={stats ? stats.totalAnalyzed.toLocaleString() : '14,850'}
          change="+12.4% vs last mo"
          changeType="positive"
          icon={MessageSquare}
          description="Total Flipkart reviews processed"
        />
        <StatCard
          title="Positive Ratio"
          value={stats ? `${stats.overallPositivePercent}%` : '74.2%'}
          change="+3.1%"
          changeType="positive"
          icon={ThumbsUp}
          description="Buyer satisfaction benchmark"
        />
        <StatCard
          title="Negative Feedback"
          value={stats ? `${stats.overallNegativePercent}%` : '11.5%'}
          change="-1.8%"
          changeType="positive"
          icon={ThumbsDown}
          description="Flagged issues & complaints"
        />
        <StatCard
          title="Avg Model Confidence"
          value={stats ? `${stats.avgConfidenceScore}%` : '93.8%'}
          change="High Precision"
          changeType="positive"
          icon={BrainCircuit}
          description="Bi-LSTM + BERT fine-tuned accuracy"
        />
      </div>

      {/* Main Grid: Quick Predictor & Recent Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column (2 cols): Quick Predict Widget */}
        <div className="lg:col-span-2 space-y-6">
          <div className="p-6 rounded-3xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-gray-900 dark:text-white">Quick Review Analyzer</h2>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Paste any review snippet to instantly classify sentiment & key aspects</p>
                </div>
              </div>
            </div>

            <form onSubmit={handleQuickPredict} className="space-y-3">
              <textarea
                rows="3"
                value={quickInput}
                onChange={(e) => setQuickInput(e.target.value)}
                placeholder="Example: The camera quality is mindblowing and battery lasts easily 2 days, but phone gets slightly warm while charging..."
                className="w-full p-4 text-sm rounded-2xl bg-gray-50 dark:bg-gray-800/60 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 outline-none resize-none transition-all"
              />

              <div className="flex items-center justify-between pt-1">
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setQuickInput('The display crispness is incredible and sound clarity is top notch!')}
                    className="px-2.5 py-1 text-xs rounded-lg bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 hover:opacity-90"
                  >
                    + Positive Sample
                  </button>
                  <button
                    type="button"
                    onClick={() => setQuickInput('Extremely bad delivery experience and battery drains rapidly.')}
                    className="px-2.5 py-1 text-xs rounded-lg bg-rose-50 text-rose-700 dark:bg-rose-950/50 dark:text-rose-300 border border-rose-200 dark:border-rose-800 hover:opacity-90"
                  >
                    + Negative Sample
                  </button>
                </div>

                <button
                  type="submit"
                  disabled={analyzing || !quickInput.trim()}
                  className="px-5 py-2.5 rounded-xl fk-gradient font-bold text-white text-xs shadow-md hover:opacity-95 disabled:opacity-50 transition-all flex items-center gap-2"
                >
                  {analyzing ? (
                    <RefreshCw className="w-4 h-4 animate-spin" />
                  ) : (
                    <>
                      <span>Predict Sentiment</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </form>

            {/* Quick Result Output */}
            {quickResult && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-gray-500">Predicted Output</span>
                  <SentimentBadge sentiment={quickResult.sentiment} confidence={quickResult.confidence} size="md" />
                </div>

                <div className="space-y-1">
                  <span className="text-xs text-gray-400 font-medium">Extracted Aspects:</span>
                  <div className="flex flex-wrap gap-2 pt-1">
                    {quickResult.aspects.map((asp, idx) => (
                      <span key={idx} className="px-2.5 py-1 rounded-lg bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-xs font-medium text-gray-700 dark:text-gray-300 flex items-center gap-1.5">
                        <span>{asp.name}:</span>
                        <span className={asp.sentiment === 'Positive' ? 'text-emerald-600 font-bold' : asp.sentiment === 'Negative' ? 'text-rose-600 font-bold' : 'text-amber-600 font-bold'}>
                          {asp.sentiment}
                        </span>
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </div>

          {/* Featured Flipkart Products */}
          <div className="p-6 rounded-3xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-blue-600" />
                Featured Products Analysis
              </h2>
              <Link to="/products" className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline">
                View All Catalog →
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {featuredProducts.map((product) => (
                <Link
                  key={product.id}
                  to={`/products/${product.id}`}
                  className="p-4 rounded-2xl bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-700/60 hover:border-blue-500/50 transition-all group"
                >
                  <div className="flex gap-3">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-14 h-14 rounded-xl object-cover border border-gray-200 dark:border-gray-700"
                    />
                    <div className="flex-1 min-w-0">
                      <h3 className="text-xs font-bold text-gray-900 dark:text-white truncate group-hover:text-blue-600 transition-colors">
                        {product.name}
                      </h3>
                      <p className="text-[11px] text-gray-400 mt-0.5 font-medium">₹{product.price.toLocaleString()} • {product.category}</p>
                      
                      <div className="mt-2 flex items-center justify-between">
                        <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
                          {product.sentimentSummary.positive}% Positive
                        </span>
                        <span className="text-[10px] text-gray-400">
                          {product.totalReviews} reviews
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column (1 col): Live Activity Feed */}
        <div className="p-6 rounded-3xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-gray-100 dark:border-gray-800">
            <h2 className="text-base font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-emerald-500" />
              Recent Predictions
            </h2>
            <Link to="/history" className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline">
              History
            </Link>
          </div>

          <div className="space-y-4">
            {recentReviews.map((rev) => (
              <div key={rev.id} className="p-3.5 rounded-2xl bg-gray-50 dark:bg-gray-800/40 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-gray-900 dark:text-white truncate max-w-[140px]">
                    {rev.productName}
                  </span>
                  <SentimentBadge sentiment={rev.sentiment} confidence={rev.confidence} size="sm" />
                </div>

                <p className="text-xs text-gray-600 dark:text-gray-300 line-clamp-2 leading-relaxed">
                  "{rev.reviewText}"
                </p>

                <div className="flex items-center justify-between text-[10px] text-gray-400 pt-1">
                  <span>{rev.timestamp}</span>
                  <span className="font-mono">{rev.aspects?.length || 1} aspects</span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
};

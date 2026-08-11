import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, 
  Star, 
  ThumbsUp, 
  ThumbsDown, 
  MessageSquare, 
  CheckCircle2,
  Sparkles,
  Search,
  Filter
} from 'lucide-react';
import { productService } from '../services/productService';
import { SentimentBadge } from '../components/common/SentimentBadge';
import { SkeletonCard } from '../components/common/SkeletonLoader';

export const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sentimentFilter, setSentimentFilter] = useState('All');

  useEffect(() => {
    loadProduct();
  }, [id]);

  const loadProduct = async () => {
    try {
      setLoading(true);
      const res = await productService.getProductById(id);
      setProduct(res);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6 max-w-4xl mx-auto py-8">
        <SkeletonCard />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="text-center py-16">
        <p className="text-gray-500">Product not found.</p>
        <Link to="/products" className="text-blue-600 font-bold text-xs mt-2 inline-block">
          ← Back to Catalog
        </Link>
      </div>
    );
  }

  const filteredReviews = product.reviews.filter((r) => {
    if (sentimentFilter === 'All') return true;
    return r.sentiment.toLowerCase() === sentimentFilter.toLowerCase();
  });

  return (
    <div className="space-y-8 pb-12">
      
      {/* Back Button */}
      <Link
        to="/products"
        className="inline-flex items-center gap-2 text-xs font-bold text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Product Catalog
      </Link>

      {/* Main Product Hero Card */}
      <div className="p-8 rounded-3xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 shadow-sm grid grid-cols-1 md:grid-cols-12 gap-8">
        
        {/* Left Image (5 cols) */}
        <div className="md:col-span-5 relative h-72 rounded-2xl overflow-hidden bg-gray-50 dark:bg-gray-800 flex items-center justify-center">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover"
          />
          <span className="absolute top-3 left-3 px-3 py-1 rounded-full bg-yellow-400 text-blue-950 font-extrabold text-xs">
            {product.discount}
          </span>
        </div>

        {/* Right Info (7 cols) */}
        <div className="md:col-span-7 space-y-5">
          <div>
            <span className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider">{product.brand} • {product.category}</span>
            <h1 className="text-2xl font-extrabold text-gray-900 dark:text-white mt-1 leading-snug">
              {product.name}
            </h1>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-gray-900 dark:text-white">
                ₹{product.price.toLocaleString()}
              </span>
              <span className="text-sm text-gray-400 line-through">
                ₹{product.originalPrice.toLocaleString()}
              </span>
            </div>

            <div className="flex items-center gap-1 px-3 py-1 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 font-extrabold text-sm">
              <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
              <span>{product.rating} / 5</span>
            </div>
          </div>

          {/* Sentiment Summary Bar */}
          <div className="p-4 rounded-2xl bg-gray-50 dark:bg-gray-800/60 space-y-3">
            <div className="flex items-center justify-between text-xs font-bold">
              <span className="text-gray-600 dark:text-gray-300">Sentiment Distribution</span>
              <span className="text-emerald-600 dark:text-emerald-400 font-mono">
                {product.sentimentSummary.positive}% Positive Feedback
              </span>
            </div>

            <div className="w-full h-3 rounded-full bg-gray-200 dark:bg-gray-700 flex overflow-hidden">
              <div style={{ width: `${product.sentimentSummary.positive}%` }} className="bg-emerald-500 h-full" />
              <div style={{ width: `${product.sentimentSummary.neutral}%` }} className="bg-amber-400 h-full" />
              <div style={{ width: `${product.sentimentSummary.negative}%` }} className="bg-rose-500 h-full" />
            </div>

            <div className="flex items-center justify-between text-[11px] text-gray-400 pt-1">
              <span>{product.sentimentSummary.positive}% Positive</span>
              <span>{product.sentimentSummary.neutral}% Neutral</span>
              <span>{product.sentimentSummary.negative}% Negative</span>
            </div>
          </div>

          {/* Key Aspect Tag Highlights */}
          <div className="space-y-2">
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider block">Aspect Sentiment Ratings</span>
            <div className="grid grid-cols-2 gap-2">
              {product.aspects.map((asp, idx) => (
                <div key={idx} className="p-2.5 rounded-xl bg-gray-50 dark:bg-gray-800/40 border border-gray-100 dark:border-gray-800 flex items-center justify-between text-xs">
                  <span className="font-semibold text-gray-700 dark:text-gray-300">{asp.name}</span>
                  <SentimentBadge sentiment={asp.sentiment} confidence={asp.score} size="sm" />
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

      {/* Customer Reviews Section */}
      <div className="p-8 rounded-3xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 shadow-sm space-y-6">
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-100 dark:border-gray-800">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-blue-600" />
            Flipkart Customer Reviews ({filteredReviews.length})
          </h2>

          {/* Sentiment Filter Tabs */}
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-gray-400" />
            {['All', 'Positive', 'Neutral', 'Negative'].map((st) => (
              <button
                key={st}
                onClick={() => setSentimentFilter(st)}
                className={`px-3 py-1 rounded-xl text-xs font-bold transition-all ${
                  sentimentFilter === st
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200'
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>

        {/* Reviews List */}
        <div className="space-y-4">
          {filteredReviews.map((rev) => (
            <motion.div
              key={rev.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="p-5 rounded-2xl bg-gray-50 dark:bg-gray-800/40 border border-gray-100 dark:border-gray-800/60 space-y-3"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/60 text-blue-600 dark:text-blue-400 font-bold text-xs flex items-center justify-center">
                    {rev.user.charAt(0)}
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-gray-900 dark:text-white flex items-center gap-1.5">
                      {rev.user}
                      {rev.verifiedPurchase && (
                        <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-normal flex items-center gap-0.5">
                          <CheckCircle2 className="w-3 h-3" /> Verified Buyer
                        </span>
                      )}
                    </h3>
                    <div className="flex items-center gap-1 text-[11px] text-amber-500 font-bold">
                      <Star className="w-3 h-3 fill-amber-400" /> {rev.rating} Stars
                    </div>
                  </div>
                </div>

                <SentimentBadge sentiment={rev.sentiment} confidence={rev.confidence} size="sm" />
              </div>

              <h4 className="text-xs font-bold text-gray-800 dark:text-gray-200">{rev.title}</h4>
              <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed">{rev.comment}</p>

              <div className="flex items-center justify-between text-[11px] text-gray-400 pt-1">
                <span>{rev.date}</span>
                <div className="flex gap-2">
                  {rev.aspects?.map((asp, i) => (
                    <span key={i} className="px-2 py-0.5 rounded bg-white dark:bg-gray-900 border text-[10px]">
                      {asp.name}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

      </div>

    </div>
  );
};

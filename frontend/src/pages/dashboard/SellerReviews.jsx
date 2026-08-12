import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquareText, Search, Star, Filter, ArrowRight, ThumbsUp, ThumbsDown, Package, X, Sparkles, CheckCircle2 } from 'lucide-react';
import { ReviewTable } from '../../components/dashboard/ReviewTable';
import { SentimentBadge } from '../../components/common/SentimentBadge';

const REVIEWS = [
  { 
    id: 'r1', 
    text: 'Great sound quality and battery life is fantastic. Charges within 20 mins! Highly recommended for fitness routines.', 
    product: 'boAt Rockerz 255 Pro+', 
    rating: 5, 
    sentiment: 'Positive', 
    confidence: 98.4, 
    date: 'Today',
    keywords: ['sound quality', 'battery life', 'fantastic', 'fast charging'] 
  },
  { 
    id: 'r2', 
    text: 'Bluetooth keeps disconnecting frequently during outdoor runs. Pairing process is very tedious.', 
    product: 'Noise ColorFit Pro 4', 
    rating: 2, 
    sentiment: 'Negative', 
    confidence: 96.1, 
    date: 'Today',
    keywords: ['bluetooth', 'disconnecting', 'tedious', 'pairing'] 
  },
  { 
    id: 'r3', 
    text: 'Display is gorgeous and S-Pen works flawlessly for notes and sketch drawings.', 
    product: 'Samsung Galaxy S24 Ultra', 
    rating: 5, 
    sentiment: 'Positive', 
    confidence: 95.8, 
    date: 'Yesterday',
    keywords: ['display', 'gorgeous', 's-pen', 'flawlessly'] 
  },
  { 
    id: 'r4', 
    text: 'Camera is average in low light, speaker sound is somewhat muted.', 
    product: 'Redmi Note 13 Pro 5G', 
    rating: 3, 
    sentiment: 'Neutral', 
    confidence: 74.2, 
    date: 'Yesterday',
    keywords: ['camera', 'average', 'low light', 'muted'] 
  },
  { 
    id: 'r5', 
    text: 'MacBook Air M3 is incredibly fast. Worth every rupee spent.', 
    product: 'Apple MacBook Air M3', 
    rating: 5, 
    sentiment: 'Positive', 
    confidence: 97.5, 
    date: '2 days ago',
    keywords: ['m3 chip', 'fast', 'worth it', 'performance'] 
  },
  { 
    id: 'r6', 
    text: 'Heating issues during gaming. Charger was damaged inside package.', 
    product: 'OnePlus 12R 5G', 
    rating: 2, 
    sentiment: 'Negative', 
    confidence: 91.8, 
    date: '3 days ago',
    keywords: ['heating', 'gaming', 'damaged charger', 'package'] 
  },
];

export const SellerReviews = () => {
  const [search, setSearch] = useState('');
  const [sentimentFilter, setSentimentFilter] = useState('All');
  const [ratingFilter, setRatingFilter] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedReview, setSelectedReview] = useState(null);

  const filtered = REVIEWS
    .filter(r => sentimentFilter === 'All' || r.sentiment === sentimentFilter)
    .filter(r => ratingFilter === 'All' || r.rating.toString() === ratingFilter)
    .filter(r => r.text.toLowerCase().includes(search.toLowerCase()) || r.product.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="space-y-6 pb-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            Customer Reviews Catalog
          </h2>
          <p className="text-xs text-slate-500 dark:text-[#9494A8] mt-1 font-medium">
            Inspect customer reviews across products with live ML keyword extraction.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3.5 py-1.5 rounded-full bg-[#111116] dark:bg-[#2563EB] text-white text-xs font-bold font-mono">
            {filtered.length} Reviews
          </span>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="p-4 rounded-2xl bg-white dark:bg-[#1C1C26] border border-[#E6E4F0] dark:border-[#282836] shadow-xs">
        <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3">
          <div className="relative flex-1 max-w-sm">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search review text or product name..."
              className="w-full pl-9 pr-4 py-2.5 rounded-full bg-slate-50 dark:bg-[#242432] text-xs font-medium text-slate-900 dark:text-white outline-none border border-[#E6E4F0] dark:border-[#282836] focus:border-[#111116] transition-colors placeholder:text-slate-400"
            />
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <select
              value={sentimentFilter}
              onChange={(e) => setSentimentFilter(e.target.value)}
              className="px-3 py-2 rounded-xl border border-[#E6E4F0] dark:border-[#282836] bg-slate-50 dark:bg-[#242432] text-xs font-bold text-slate-700 dark:text-white outline-none cursor-pointer"
            >
              <option value="All">All Sentiments</option>
              <option value="Positive">Positive</option>
              <option value="Neutral">Neutral</option>
              <option value="Negative">Negative</option>
            </select>

            <select
              value={ratingFilter}
              onChange={(e) => setRatingFilter(e.target.value)}
              className="px-3 py-2 rounded-xl border border-[#E6E4F0] dark:border-[#282836] bg-slate-50 dark:bg-[#242432] text-xs font-bold text-slate-700 dark:text-white outline-none cursor-pointer"
            >
              <option value="All">All Ratings</option>
              <option value="5">5 Stars</option>
              <option value="4">4 Stars</option>
              <option value="3">3 Stars</option>
              <option value="2">2 Stars</option>
              <option value="1">1 Star</option>
            </select>
          </div>
        </div>
      </div>

      {/* Custom Table with Row Click Handler */}
      <div className="rounded-2xl bg-white dark:bg-[#1C1C26] border border-[#E6E4F0] dark:border-[#282836] shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-slate-100 dark:border-[#282836] bg-slate-50/60 dark:bg-[#242432]">
                <th className="py-3 px-4 text-[10px] font-bold uppercase tracking-wider text-slate-400 font-mono">Product</th>
                <th className="py-3 px-4 text-[10px] font-bold uppercase tracking-wider text-slate-400 font-mono">Review Text</th>
                <th className="py-3 px-4 text-[10px] font-bold uppercase tracking-wider text-slate-400 font-mono">Rating</th>
                <th className="py-3 px-4 text-[10px] font-bold uppercase tracking-wider text-slate-400 font-mono">Sentiment</th>
                <th className="py-3 px-4 text-[10px] font-bold uppercase tracking-wider text-slate-400 font-mono text-right">Confidence</th>
                <th className="py-3 px-4 text-[10px] font-bold uppercase tracking-wider text-slate-400 font-mono text-right">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-[#282836]">
              {filtered.map((rev) => (
                <tr
                  key={rev.id}
                  onClick={() => setSelectedReview(rev)}
                  className="hover:bg-slate-50 dark:hover:bg-[#242432] transition-colors cursor-pointer"
                >
                  <td className="py-3.5 px-4 text-xs font-bold text-slate-900 dark:text-white truncate max-w-[160px]">{rev.product}</td>
                  <td className="py-3.5 px-4 text-xs text-slate-600 dark:text-[#9494A8] truncate max-w-[280px]">"{rev.text}"</td>
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-0.5">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star key={i} className={`w-3 h-3 ${i < rev.rating ? 'text-amber-400 fill-amber-400' : 'text-slate-200 dark:text-[#282836]'}`} />
                      ))}
                    </div>
                  </td>
                  <td className="py-3.5 px-4"><SentimentBadge sentiment={rev.sentiment} size="sm" /></td>
                  <td className="py-3.5 px-4 text-right text-xs font-mono font-bold text-slate-700 dark:text-slate-300">{rev.confidence}%</td>
                  <td className="py-3.5 px-4 text-right text-[11px] font-mono text-slate-400">{rev.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Review Details Modal (Specification Section 4) */}
      <AnimatePresence>
        {selectedReview && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-lg p-6 rounded-2xl bg-white dark:bg-[#1C1C26] border border-[#E6E4F0] dark:border-[#282836] shadow-2xl space-y-4"
            >
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-[#282836]">
                <h3 className="text-base font-extrabold text-slate-900 dark:text-white">Review ML Details</h3>
                <button
                  onClick={() => setSelectedReview(null)}
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Review Quote */}
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-[#242432] space-y-2">
                <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 italic leading-relaxed">
                  "{selectedReview.text}"
                </p>
                <div className="flex items-center gap-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className={`w-3.5 h-3.5 ${i < selectedReview.rating ? 'text-amber-400 fill-amber-400' : 'text-slate-300 dark:text-slate-600'}`} />
                  ))}
                </div>
              </div>

              {/* ML Output Specs */}
              <div className="grid grid-cols-2 gap-3 text-xs font-mono">
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-[#242432]">
                  <span className="text-[10px] text-slate-400 uppercase block">Predicted Sentiment</span>
                  <span className={`text-base font-black ${
                    selectedReview.sentiment === 'Positive' ? 'text-[#16A34A] dark:text-[#22C55E]' :
                    selectedReview.sentiment === 'Negative' ? 'text-[#DC2626] dark:text-[#EF4444]' : 'text-[#EA580C] dark:text-[#F59E0B]'
                  }`}>{selectedReview.sentiment.toUpperCase()}</span>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 dark:bg-[#242432]">
                  <span className="text-[10px] text-slate-400 uppercase block">Model Confidence</span>
                  <span className="text-base font-black text-slate-900 dark:text-white">{selectedReview.confidence}%</span>
                </div>
              </div>

              {/* Important Keywords Extracted */}
              <div className="space-y-1.5 font-mono">
                <span className="text-[10px] font-bold uppercase text-slate-400 block">Important Words (TF-IDF Features)</span>
                <div className="flex items-center gap-1.5 flex-wrap">
                  {selectedReview.keywords?.map((word, i) => (
                    <span key={i} className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-[#242432] text-slate-800 dark:text-slate-200 text-xs font-bold border border-[#E6E4F0] dark:border-[#282836]">
                      ✓ {word}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  onClick={() => setSelectedReview(null)}
                  className="px-4 py-2 rounded-xl bg-[#111116] dark:bg-[#2563EB] text-white font-bold text-xs cursor-pointer"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

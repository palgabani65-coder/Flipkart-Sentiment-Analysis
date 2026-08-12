import React from 'react';
import { SentimentBadge } from '../common/SentimentBadge';
import { Star, ChevronLeft, ChevronRight } from 'lucide-react';

export const ReviewTable = ({ 
  reviews = [], 
  showProduct = true,
  currentPage = 1,
  totalPages = 1,
  onPageChange
}) => {
  return (
    <div className="rounded-2xl bg-white dark:bg-[#1E1E24] border border-slate-200 dark:border-[#2A2A34] shadow-xs overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-slate-200 dark:border-[#2A2A34] bg-slate-50/60 dark:bg-[#262630]">
              <th className="py-3.5 px-5 text-[10px] font-bold uppercase tracking-wider text-slate-400 font-mono">Review</th>
              {showProduct && (
                <th className="py-3.5 px-4 text-[10px] font-bold uppercase tracking-wider text-slate-400 font-mono">Product</th>
              )}
              <th className="py-3.5 px-4 text-[10px] font-bold uppercase tracking-wider text-slate-400 font-mono">Rating</th>
              <th className="py-3.5 px-4 text-[10px] font-bold uppercase tracking-wider text-slate-400 font-mono">Sentiment</th>
              <th className="py-3.5 px-4 text-[10px] font-bold uppercase tracking-wider text-slate-400 font-mono text-right">Confidence</th>
              <th className="py-3.5 px-4 text-[10px] font-bold uppercase tracking-wider text-slate-400 font-mono text-right">Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-[#2A2A34]">
            {reviews.map((review) => (
              <tr key={review.id} className="hover:bg-slate-50/50 dark:hover:bg-[#262630]/60 transition-colors">
                <td className="py-4 px-5 max-w-[300px]">
                  <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 truncate leading-relaxed">
                    "{review.text}"
                  </p>
                </td>
                {showProduct && (
                  <td className="py-4 px-4 text-xs font-medium text-slate-500 dark:text-[#9494A8] truncate max-w-[140px]">
                    {review.product}
                  </td>
                )}
                <td className="py-4 px-4">
                  <div className="flex items-center gap-0.5">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`w-3 h-3 ${i < review.rating ? 'text-amber-400 fill-amber-400' : 'text-slate-200 dark:text-[#2A2A34]'}`}
                      />
                    ))}
                  </div>
                </td>
                <td className="py-4 px-4">
                  <SentimentBadge sentiment={review.sentiment} size="sm" />
                </td>
                <td className="py-4 px-4 text-right text-xs font-bold font-mono text-slate-700 dark:text-slate-300">
                  {review.confidence}%
                </td>
                <td className="py-4 px-4 text-right text-[11px] font-mono text-slate-400">
                  {review.date}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {reviews.length === 0 && (
        <div className="py-16 text-center">
          <p className="text-sm text-slate-400 font-medium">No reviews found.</p>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between px-5 py-3 border-t border-slate-100 dark:border-[#2A2A34]">
          <span className="text-[11px] text-slate-400 font-mono">
            Page {currentPage} of {totalPages}
          </span>
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => onPageChange?.(currentPage - 1)}
              disabled={currentPage <= 1}
              className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-[#262630] disabled:opacity-30 transition-colors cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            {Array.from({ length: totalPages }).map((_, i) => (
              <button
                key={i}
                onClick={() => onPageChange?.(i + 1)}
                className={`w-7 h-7 rounded-xl text-[11px] font-bold transition-colors cursor-pointer ${
                  currentPage === i + 1
                    ? 'bg-[#2563EB] text-white font-extrabold shadow-xs'
                    : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-[#262630]'
                }`}
              >
                {i + 1}
              </button>
            ))}
            <button
              onClick={() => onPageChange?.(currentPage + 1)}
              disabled={currentPage >= totalPages}
              className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-[#262630] disabled:opacity-30 transition-colors cursor-pointer"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

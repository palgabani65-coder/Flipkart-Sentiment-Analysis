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
    <div className="rounded-2xl bg-white border border-[#E5E7EB] shadow-[0_4px_20px_rgba(0,0,0,0.04)] overflow-hidden font-sans">
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-[#E5E7EB] bg-[#F8F9FA]">
              <th className="py-3.5 px-5 text-[10px] font-medium uppercase tracking-wider text-[#5C5F62] font-mono">Review</th>
              {showProduct && (
                <th className="py-3.5 px-4 text-[10px] font-medium uppercase tracking-wider text-[#5C5F62] font-mono">Product</th>
              )}
              <th className="py-3.5 px-4 text-[10px] font-medium uppercase tracking-wider text-[#5C5F62] font-mono">Rating</th>
              <th className="py-3.5 px-4 text-[10px] font-medium uppercase tracking-wider text-[#5C5F62] font-mono">Sentiment</th>
              <th className="py-3.5 px-4 text-[10px] font-medium uppercase tracking-wider text-[#5C5F62] font-mono text-right">Confidence</th>
              <th className="py-3.5 px-4 text-[10px] font-medium uppercase tracking-wider text-[#5C5F62] font-mono text-right">Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E5E7EB]">
            {reviews.map((review) => (
              <tr key={review.id} className="hover:bg-[#F8F9FA] transition-colors">
                <td className="py-4 px-5 max-w-[300px]">
                  <p className="text-xs font-medium text-[#191C1D] truncate leading-relaxed">
                    "{review.text}"
                  </p>
                </td>
                {showProduct && (
                  <td className="py-4 px-4 text-xs font-normal text-[#5C5F62] truncate max-w-[140px]">
                    {review.product}
                  </td>
                )}
                <td className="py-4 px-4">
                  <div className="flex items-center gap-0.5">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`w-3 h-3 ${i < review.rating ? 'text-amber-500 fill-amber-400' : 'text-[#E5E7EB]'}`}
                      />
                    ))}
                  </div>
                </td>
                <td className="py-4 px-4">
                  <SentimentBadge sentiment={review.sentiment} size="sm" />
                </td>
                <td className="py-4 px-4 text-right text-xs font-semibold font-mono text-[#000000]">
                  {review.confidence}%
                </td>
                <td className="py-4 px-4 text-right text-[11px] font-mono text-[#5C5F62]">
                  {review.date}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {reviews.length === 0 && (
        <div className="py-16 text-center">
          <p className="text-sm text-[#5C5F62] font-mono">No reviews found.</p>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between px-5 py-3 border-t border-[#E5E7EB]">
          <span className="text-[11px] text-[#5C5F62] font-mono">
            Page {currentPage} of {totalPages}
          </span>
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => onPageChange?.(currentPage - 1)}
              disabled={currentPage <= 1}
              className="p-1.5 rounded-lg text-[#5C5F62] hover:text-[#000000] hover:bg-[#F3F4F5] disabled:opacity-30 transition-colors cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            {Array.from({ length: totalPages }).map((_, i) => (
              <button
                key={i}
                onClick={() => onPageChange?.(i + 1)}
                className={`w-7 h-7 rounded-lg text-[11px] font-mono transition-colors cursor-pointer ${currentPage === i + 1
                    ? 'bg-[#000000] text-white font-semibold shadow-xs'
                    : 'text-[#5C5F62] hover:bg-[#F3F4F5] hover:text-[#000000]'
                  }`}
              >
                {i + 1}
              </button>
            ))}
            <button
              onClick={() => onPageChange?.(currentPage + 1)}
              disabled={currentPage >= totalPages}
              className="p-1.5 rounded-lg text-[#5C5F62] hover:text-[#000000] hover:bg-[#F3F4F5] disabled:opacity-30 transition-colors cursor-pointer"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

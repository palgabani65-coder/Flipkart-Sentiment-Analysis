import React from 'react';
import { SentimentBadge } from '../common/SentimentBadge';
import { ArrowUpRight, ArrowDownRight, Star } from 'lucide-react';

export const ProductTable = ({ products = [], onViewProduct }) => {
  return (
    <div className="rounded-2xl bg-white border border-[#E5E7EB] shadow-[0_4px_20px_rgba(0,0,0,0.04)] overflow-hidden font-sans">
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-[#E5E7EB] bg-[#F8F9FA]">
              <th className="py-3.5 px-5 text-[10px] font-medium uppercase tracking-wider text-[#5C5F62] font-mono">Product</th>
              <th className="py-3.5 px-4 text-[10px] font-medium uppercase tracking-wider text-[#5C5F62] font-mono">Reviews</th>
              <th className="py-3.5 px-4 text-[10px] font-medium uppercase tracking-wider text-[#5C5F62] font-mono">Avg Rating</th>
              <th className="py-3.5 px-4 text-[10px] font-medium uppercase tracking-wider text-[#5C5F62] font-mono">Positive</th>
              <th className="py-3.5 px-4 text-[10px] font-medium uppercase tracking-wider text-[#5C5F62] font-mono">Neutral</th>
              <th className="py-3.5 px-4 text-[10px] font-medium uppercase tracking-wider text-[#5C5F62] font-mono">Negative</th>
              <th className="py-3.5 px-4 text-[10px] font-medium uppercase tracking-wider text-[#5C5F62] font-mono">Trend</th>
              <th className="py-3.5 px-4 text-[10px] font-medium uppercase tracking-wider text-[#5C5F62] font-mono">Sentiment</th>
              <th className="py-3.5 px-4 text-[10px] font-medium uppercase tracking-wider text-[#5C5F62] font-mono"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E5E7EB]">
            {products.map((product) => {
              const trendPositive = product.trend > 0;
              return (
                <tr key={product.id} className="hover:bg-[#F8F9FA] transition-colors">
                  <td className="py-4 px-5">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-[#F8F9FA] border border-[#E5E7EB] flex items-center justify-center text-[#000000] shrink-0">
                        <Star className="w-3.5 h-3.5 text-[#000000]" />
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-[#191C1D] truncate max-w-[180px]">{product.name}</p>
                        <p className="text-[10px] text-[#5C5F62] font-mono">{product.category}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-4 text-xs font-semibold text-[#000000] font-mono">
                    {product.reviews?.toLocaleString()}
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-1">
                      <span className="text-xs font-semibold text-[#000000] font-mono">{product.rating}</span>
                      <Star className="w-3 h-3 text-amber-500 fill-amber-400" />
                    </div>
                  </td>
                  <td className="py-4 px-4 text-xs font-medium text-[#191C1D] font-mono">{product.positive}%</td>
                  <td className="py-4 px-4 text-xs font-medium text-[#5C5F62] font-mono">{product.neutral}%</td>
                  <td className="py-4 px-4 text-xs font-medium text-[#BA1A1A] font-mono">{product.negative}%</td>
                  <td className="py-4 px-4">
                    <div className={`flex items-center gap-1 text-xs font-mono ${trendPositive ? 'text-[#000000]' : 'text-[#BA1A1A]'}`}>
                      {trendPositive ? <ArrowUpRight className="w-3.5 h-3.5" /> : <ArrowDownRight className="w-3.5 h-3.5" />}
                      <span>{Math.abs(product.trend)}%</span>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <SentimentBadge sentiment={product.overallSentiment} size="sm" />
                  </td>
                  <td className="py-4 px-4">
                    {onViewProduct && (
                      <button
                        onClick={() => onViewProduct(product.id)}
                        className="btn-nordic-primary text-[10px] px-3 py-1.5"
                      >
                        View
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {products.length === 0 && (
        <div className="py-16 text-center">
          <p className="text-sm text-[#5C5F62] font-mono">No products found.</p>
        </div>
      )}
    </div>
  );
};

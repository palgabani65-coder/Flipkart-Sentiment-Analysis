import React from 'react';
import { SentimentBadge } from '../common/SentimentBadge';
import { ArrowUpRight, ArrowDownRight, Star } from 'lucide-react';

export const ProductTable = ({ products = [], onViewProduct }) => {
  return (
    <div className="rounded-3xl bg-white dark:bg-[#12101B] border border-slate-200/80 dark:border-[#1E1A2E] shadow-xs overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-slate-200/80 dark:border-[#1E1A2E] bg-slate-50/60 dark:bg-[#171424]">
              <th className="py-3.5 px-5 text-[10px] font-bold uppercase tracking-wider text-slate-400 font-mono">Product</th>
              <th className="py-3.5 px-4 text-[10px] font-bold uppercase tracking-wider text-slate-400 font-mono">Reviews</th>
              <th className="py-3.5 px-4 text-[10px] font-bold uppercase tracking-wider text-slate-400 font-mono">Avg Rating</th>
              <th className="py-3.5 px-4 text-[10px] font-bold uppercase tracking-wider text-slate-400 font-mono">Positive</th>
              <th className="py-3.5 px-4 text-[10px] font-bold uppercase tracking-wider text-slate-400 font-mono">Neutral</th>
              <th className="py-3.5 px-4 text-[10px] font-bold uppercase tracking-wider text-slate-400 font-mono">Negative</th>
              <th className="py-3.5 px-4 text-[10px] font-bold uppercase tracking-wider text-slate-400 font-mono">Trend</th>
              <th className="py-3.5 px-4 text-[10px] font-bold uppercase tracking-wider text-slate-400 font-mono">Sentiment</th>
              <th className="py-3.5 px-4 text-[10px] font-bold uppercase tracking-wider text-slate-400 font-mono"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-[#1E1A2E]">
            {products.map((product) => {
              const trendPositive = product.trend > 0;
              return (
                <tr key={product.id} className="hover:bg-slate-50/50 dark:hover:bg-[#171424]/60 transition-colors">
                  <td className="py-4 px-5">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-2xl bg-slate-100 dark:bg-[#1A1728] flex items-center justify-center text-slate-400 shrink-0">
                        <Star className="w-4 h-4 text-[#C4B5FD]" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-900 dark:text-white truncate max-w-[180px]">{product.name}</p>
                        <p className="text-[10px] text-slate-400 font-medium">{product.category}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-4 text-xs font-bold text-slate-700 dark:text-slate-300 font-mono">
                    {product.reviews?.toLocaleString()}
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-1">
                      <span className="text-xs font-bold text-slate-900 dark:text-white">{product.rating}</span>
                      <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                    </div>
                  </td>
                  <td className="py-4 px-4 text-xs font-bold text-[#34D399] font-mono">{product.positive}%</td>
                  <td className="py-4 px-4 text-xs font-bold text-amber-500 font-mono">{product.neutral}%</td>
                  <td className="py-4 px-4 text-xs font-bold text-[#F87171] font-mono">{product.negative}%</td>
                  <td className="py-4 px-4">
                    <div className={`flex items-center gap-1 text-xs font-bold ${trendPositive ? 'text-[#34D399]' : 'text-[#F87171]'}`}>
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
                        className="px-3 py-1.5 rounded-xl text-[10px] font-bold text-purple-950 dark:text-[#08070D] bg-[#C4B5FD] hover:bg-[#B5A1FC] transition-all cursor-pointer shadow-xs"
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
          <p className="text-sm text-slate-400 font-medium">No products found.</p>
        </div>
      )}
    </div>
  );
};

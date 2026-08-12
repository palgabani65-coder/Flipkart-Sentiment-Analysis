import React, { useState } from 'react';
import { Search, Star } from 'lucide-react';
import { SentimentBadge } from '../../components/common/SentimentBadge';

const REVIEWS = [
  { id: 1, text: 'Excellent camera quality. Best phone I have used this year.', product: 'Samsung Galaxy S24 Ultra', seller: 'Gabani Electronics', rating: 5, sentiment: 'Positive', confidence: 94.2, date: 'Today' },
  { id: 2, text: 'Battery drains fast. Disappointing for the price.', product: 'Samsung Galaxy S24 Ultra', seller: 'Gabani Electronics', rating: 2, sentiment: 'Negative', confidence: 89.5, date: 'Today' },
  { id: 3, text: 'MacBook Air M3 is incredibly fast. Worth every rupee spent.', product: 'Apple MacBook Air M3', seller: 'TechWorld India', rating: 5, sentiment: 'Positive', confidence: 97.1, date: 'Yesterday' },
  { id: 4, text: 'Average display. Speaker quality is mediocre.', product: 'Redmi Note 13 Pro 5G', seller: 'SmartGadgets', rating: 3, sentiment: 'Neutral', confidence: 62.4, date: 'Yesterday' },
  { id: 5, text: 'Noise cancellation is superb. Very comfortable for travel.', product: 'Sony WH-1000XM5', seller: 'Gabani Electronics', rating: 5, sentiment: 'Positive', confidence: 95.8, date: '2 days ago' },
  { id: 6, text: 'Heating issues during gaming. Charger was damaged.', product: 'OnePlus 12R 5G', seller: 'Budget Bazaar', rating: 2, sentiment: 'Negative', confidence: 91.3, date: '3 days ago' },
];

export const AdminReviews = () => {
  const [search, setSearch] = useState('');
  const filtered = REVIEWS.filter(r => r.text.toLowerCase().includes(search.toLowerCase()) || r.product.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="space-y-6 pb-8">
      <div>
        <h2 className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight">Review Management</h2>
        <p className="text-xs text-slate-400 mt-1">Platform-wide review analytics and moderation.</p>
      </div>

      <div className="p-4 rounded-2xl bg-white dark:bg-[#0F111A] border border-slate-200/80 dark:border-[#252A3A] shadow-sm">
        <div className="relative max-w-sm">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search reviews..."
            className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-slate-50 dark:bg-[#090D16] text-xs font-medium text-slate-900 dark:text-white outline-none border border-slate-200 dark:border-[#252A3A] focus:border-[#22D3EE] transition-colors placeholder:text-slate-400" />
        </div>
      </div>

      <div className="rounded-2xl bg-white dark:bg-[#0F111A] border border-slate-200/80 dark:border-[#252A3A] shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-slate-200/80 dark:border-[#252A3A] bg-slate-50/60 dark:bg-[#090D16]/50">
                <th className="py-3.5 px-5 text-[10px] font-bold uppercase tracking-wider text-slate-400 font-mono">Review</th>
                <th className="py-3.5 px-4 text-[10px] font-bold uppercase tracking-wider text-slate-400 font-mono">Product</th>
                <th className="py-3.5 px-4 text-[10px] font-bold uppercase tracking-wider text-slate-400 font-mono">Seller</th>
                <th className="py-3.5 px-4 text-[10px] font-bold uppercase tracking-wider text-slate-400 font-mono">Rating</th>
                <th className="py-3.5 px-4 text-[10px] font-bold uppercase tracking-wider text-slate-400 font-mono">Sentiment</th>
                <th className="py-3.5 px-4 text-[10px] font-bold uppercase tracking-wider text-slate-400 font-mono text-right">Confidence</th>
                <th className="py-3.5 px-4 text-[10px] font-bold uppercase tracking-wider text-slate-400 font-mono text-right">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-[#252A3A]">
              {filtered.map((r) => (
                <tr key={r.id} className="hover:bg-slate-50/50 dark:hover:bg-[#151926]/40 transition-colors">
                  <td className="py-4 px-5 text-xs font-semibold text-slate-800 dark:text-slate-200 max-w-[280px] truncate">"{r.text}"</td>
                  <td className="py-4 px-4 text-xs text-slate-500 dark:text-slate-400 truncate max-w-[150px]">{r.product}</td>
                  <td className="py-4 px-4 text-xs text-slate-500 dark:text-slate-400">{r.seller}</td>
                  <td className="py-4 px-4"><div className="flex items-center gap-0.5">{Array.from({ length: 5 }).map((_, i) => (<Star key={i} className={`w-3 h-3 ${i < r.rating ? 'text-amber-400 fill-amber-400' : 'text-slate-200 dark:text-slate-700'}`} />))}</div></td>
                  <td className="py-4 px-4"><SentimentBadge sentiment={r.sentiment} size="sm" /></td>
                  <td className="py-4 px-4 text-right text-xs font-bold font-mono text-slate-700 dark:text-slate-300">{r.confidence}%</td>
                  <td className="py-4 px-4 text-right text-[11px] text-slate-400 font-mono">{r.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

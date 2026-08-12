import React, { useState } from 'react';
import { Package, Search, Star } from 'lucide-react';
import { SentimentBadge } from '../../components/common/SentimentBadge';

const PRODUCTS = [
  { id: 1, name: 'Samsung Galaxy S24 Ultra 5G', seller: 'Gabani Electronics', reviews: 2431, rating: 4.3, sentiment: 'Positive', lastAnalysis: '2h ago', status: 'active' },
  { id: 2, name: 'Apple MacBook Air M3 2024', seller: 'TechWorld India', reviews: 1856, rating: 4.6, sentiment: 'Positive', lastAnalysis: '5h ago', status: 'active' },
  { id: 3, name: 'Redmi Note 13 Pro 5G', seller: 'SmartGadgets', reviews: 3204, rating: 3.9, sentiment: 'Neutral', lastAnalysis: '1d ago', status: 'active' },
  { id: 4, name: 'Sony WH-1000XM5', seller: 'Gabani Electronics', reviews: 1124, rating: 4.5, sentiment: 'Positive', lastAnalysis: '3h ago', status: 'active' },
  { id: 5, name: 'boAt Rockerz 450 Pro', seller: 'Budget Bazaar', reviews: 4512, rating: 3.7, sentiment: 'Negative', lastAnalysis: '2d ago', status: 'flagged' },
];

export const AdminProducts = () => {
  const [search, setSearch] = useState('');
  const filtered = PRODUCTS.filter(p => p.name.toLowerCase().includes(search.toLowerCase()) || p.seller.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="space-y-6 pb-8">
      <div>
        <h2 className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight">Product Management</h2>
        <p className="text-xs text-slate-400 mt-1">All products across the FlipSentiment platform.</p>
      </div>

      <div className="p-4 rounded-2xl bg-white dark:bg-[#0F111A] border border-slate-200/80 dark:border-[#252A3A] shadow-sm">
        <div className="relative max-w-sm">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search products or sellers..."
            className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-slate-50 dark:bg-[#090D16] text-xs font-medium text-slate-900 dark:text-white outline-none border border-slate-200 dark:border-[#252A3A] focus:border-[#22D3EE] transition-colors placeholder:text-slate-400" />
        </div>
      </div>

      <div className="rounded-2xl bg-white dark:bg-[#0F111A] border border-slate-200/80 dark:border-[#252A3A] shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-slate-200/80 dark:border-[#252A3A] bg-slate-50/60 dark:bg-[#090D16]/50">
                <th className="py-3.5 px-5 text-[10px] font-bold uppercase tracking-wider text-slate-400 font-mono">Product</th>
                <th className="py-3.5 px-4 text-[10px] font-bold uppercase tracking-wider text-slate-400 font-mono">Seller</th>
                <th className="py-3.5 px-4 text-[10px] font-bold uppercase tracking-wider text-slate-400 font-mono">Reviews</th>
                <th className="py-3.5 px-4 text-[10px] font-bold uppercase tracking-wider text-slate-400 font-mono">Rating</th>
                <th className="py-3.5 px-4 text-[10px] font-bold uppercase tracking-wider text-slate-400 font-mono">Sentiment</th>
                <th className="py-3.5 px-4 text-[10px] font-bold uppercase tracking-wider text-slate-400 font-mono">Last Analysis</th>
                <th className="py-3.5 px-4 text-[10px] font-bold uppercase tracking-wider text-slate-400 font-mono">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-[#252A3A]">
              {filtered.map((p) => (
                <tr key={p.id} className="hover:bg-slate-50/50 dark:hover:bg-[#151926]/40 transition-colors">
                  <td className="py-4 px-5 text-xs font-bold text-slate-900 dark:text-white">{p.name}</td>
                  <td className="py-4 px-4 text-xs text-slate-500 dark:text-slate-400">{p.seller}</td>
                  <td className="py-4 px-4 text-xs font-bold text-slate-700 dark:text-slate-300 font-mono">{p.reviews.toLocaleString()}</td>
                  <td className="py-4 px-4"><div className="flex items-center gap-1"><span className="text-xs font-bold">{p.rating}</span><Star className="w-3 h-3 text-amber-400 fill-amber-400" /></div></td>
                  <td className="py-4 px-4"><SentimentBadge sentiment={p.sentiment} size="sm" /></td>
                  <td className="py-4 px-4 text-[11px] text-slate-400 font-mono">{p.lastAnalysis}</td>
                  <td className="py-4 px-4">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${p.status === 'active' ? 'bg-cyan-50 dark:bg-[#22D3EE]/20 text-cyan-700 dark:text-[#22D3EE]' : 'bg-amber-50 dark:bg-amber-950/40 text-amber-600'}`}>
                      {p.status.charAt(0).toUpperCase() + p.status.slice(1)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

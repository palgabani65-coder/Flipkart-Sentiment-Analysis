import React, { useState } from 'react';
import { Package, Search, Star } from 'lucide-react';
import { SentimentBadge } from '../../components/common/SentimentBadge';

const PRODUCTS = [
  { id: 1, name: 'Samsung Galaxy S24 Ultra 5G', seller: 'Apex Electronics', reviews: 2431, rating: 4.3, sentiment: 'Positive', lastAnalysis: '2h ago', status: 'active' },
  { id: 2, name: 'Apple MacBook Air M3 2024', seller: 'TechWorld India', reviews: 1856, rating: 4.6, sentiment: 'Positive', lastAnalysis: '5h ago', status: 'active' },
  { id: 3, name: 'Redmi Note 13 Pro 5G', seller: 'SmartGadgets', reviews: 3204, rating: 3.9, sentiment: 'Neutral', lastAnalysis: '1d ago', status: 'active' },
  { id: 4, name: 'Sony WH-1000XM5', seller: 'Apex Electronics', reviews: 1124, rating: 4.5, sentiment: 'Positive', lastAnalysis: '3h ago', status: 'active' },
  { id: 5, name: 'boAt Rockerz 450 Pro', seller: 'Budget Bazaar', reviews: 4512, rating: 3.7, sentiment: 'Negative', lastAnalysis: '2d ago', status: 'flagged' },
];

export const AdminProducts = () => {
  const [search, setSearch] = useState('');
  const filtered = PRODUCTS.filter(p => p.name.toLowerCase().includes(search.toLowerCase()) || p.seller.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="space-y-6 pb-8 font-sans text-[#191C1D] dark:text-white transition-colors">
      <div>
        <h2 className="text-2xl sm:text-3xl font-bold text-[#191C1D] dark:text-white tracking-tight font-sans">Product Management</h2>
        <p className="text-xs text-[#5C5F62] dark:text-[#A0A4A8] mt-1 font-mono">All products across the FlipSentiment platform.</p>
      </div>

      <div className="p-4 rounded-2xl bg-white dark:bg-[#191C1D] border border-[#E5E7EB] dark:border-[#2E3132] shadow-[0_4px_20px_rgba(0,0,0,0.04)] dark:shadow-none font-sans">
        <div className="relative max-w-sm">
          <Search className="w-3.5 h-3.5 text-[#5C5F62] dark:text-[#A0A4A8] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search products or sellers..."
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-[#F8F9FA] dark:bg-[#242729] text-xs font-mono text-[#191C1D] dark:text-white outline-none border border-[#E5E7EB] dark:border-[#33373B] focus:border-[#000000] dark:focus:border-white transition-colors placeholder:text-[#5C5F62] dark:placeholder:text-[#848484]" />
        </div>
      </div>

      <div className="rounded-2xl bg-white dark:bg-[#191C1D] border border-[#E5E7EB] dark:border-[#2E3132] shadow-[0_4px_20px_rgba(0,0,0,0.04)] dark:shadow-none overflow-hidden font-sans">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-[#E5E7EB] dark:border-[#2E3132] bg-[#F8F9FA] dark:bg-[#242729]">
                <th className="py-3.5 px-5 text-[10px] font-semibold uppercase tracking-wider text-[#5C5F62] dark:text-[#A0A4A8] font-mono">Product</th>
                <th className="py-3.5 px-4 text-[10px] font-semibold uppercase tracking-wider text-[#5C5F62] dark:text-[#A0A4A8] font-mono">Seller</th>
                <th className="py-3.5 px-4 text-[10px] font-semibold uppercase tracking-wider text-[#5C5F62] dark:text-[#A0A4A8] font-mono">Reviews</th>
                <th className="py-3.5 px-4 text-[10px] font-semibold uppercase tracking-wider text-[#5C5F62] dark:text-[#A0A4A8] font-mono">Rating</th>
                <th className="py-3.5 px-4 text-[10px] font-semibold uppercase tracking-wider text-[#5C5F62] dark:text-[#A0A4A8] font-mono">Sentiment</th>
                <th className="py-3.5 px-4 text-[10px] font-semibold uppercase tracking-wider text-[#5C5F62] dark:text-[#A0A4A8] font-mono">Last Analysis</th>
                <th className="py-3.5 px-4 text-[10px] font-semibold uppercase tracking-wider text-[#5C5F62] dark:text-[#A0A4A8] font-mono">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5E7EB] dark:divide-[#2E3132]">
              {filtered.map((p) => (
                <tr key={p.id} className="hover:bg-[#F8F9FA] dark:hover:bg-[#242729] transition-colors">
                  <td className="py-4 px-5 text-xs font-bold text-[#191C1D] dark:text-white font-sans">{p.name}</td>
                  <td className="py-4 px-4 text-xs text-[#5C5F62] dark:text-[#A0A4A8] font-sans">{p.seller}</td>
                  <td className="py-4 px-4 text-xs font-semibold text-[#191C1D] dark:text-white font-mono">{p.reviews.toLocaleString()}</td>
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-1 font-mono">
                      <span className="text-xs font-semibold text-[#191C1D] dark:text-white">{p.rating}</span>
                      <Star className="w-3 h-3 text-amber-500 fill-amber-400" />
                    </div>
                  </td>
                  <td className="py-4 px-4"><SentimentBadge sentiment={p.sentiment} size="sm" /></td>
                  <td className="py-4 px-4 text-[11px] text-[#5C5F62] dark:text-[#A0A4A8] font-mono">{p.lastAnalysis}</td>
                  <td className="py-4 px-4">
                    <span className={`px-2.5 py-0.5 rounded-md text-[10px] font-semibold font-mono border ${
                      p.status === 'active' 
                        ? 'bg-[#F3F4F5] dark:bg-[#242729] border-[#E5E7EB] dark:border-[#33373B] text-[#000000] dark:text-white' 
                        : 'bg-amber-50 dark:bg-amber-950/30 border-amber-200/60 dark:border-amber-900/40 text-amber-600 dark:text-amber-400'
                    }`}>
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

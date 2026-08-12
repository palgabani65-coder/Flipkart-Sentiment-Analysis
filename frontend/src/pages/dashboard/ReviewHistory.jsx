import React, { useState } from 'react';
import { Search, History, Filter } from 'lucide-react';
import { ReviewTable } from '../../components/dashboard/ReviewTable';

const HISTORY = [
  { id: 'h1', text: 'Fast delivery by Flipkart seller. Product arrived in pristine condition.', product: 'Samsung Galaxy S24 Ultra', rating: 5, sentiment: 'Positive', confidence: 97.4, date: '10 Aug 2026' },
  { id: 'h2', text: 'Average battery life. Camera is good but phone gets warm fast.', product: 'Redmi Note 13 Pro 5G', rating: 3, sentiment: 'Neutral', confidence: 71.2, date: '09 Aug 2026' },
  { id: 'h3', text: 'Faulty charging cable inside box. Replacement took 5 days.', product: 'boAt Rockerz 450 Pro', rating: 1, sentiment: 'Negative', confidence: 93.8, date: '08 Aug 2026' },
];

export const ReviewHistory = () => {
  const [search, setSearch] = useState('');

  const filtered = HISTORY.filter(h =>
    h.text.toLowerCase().includes(search.toLowerCase()) ||
    h.product.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 pb-8">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">Review Analysis History</h2>
          <p className="text-xs text-slate-500 dark:text-[#9494A8] mt-1 font-medium">Archived log of past sentiment analysis runs and batch reports.</p>
        </div>
        <span className="px-3 py-1 rounded-full bg-[#111116] dark:bg-[#2563EB] text-white text-[11px] font-bold font-mono">
          {HISTORY.length} Archived Runs
        </span>
      </div>

      <div className="p-4 rounded-2xl bg-white dark:bg-[#1C1C26] border border-[#E6E4F0] dark:border-[#282836] shadow-xs">
        <div className="relative max-w-sm">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search history..."
            className="w-full pl-9 pr-4 py-2.5 rounded-full bg-slate-50 dark:bg-[#242432] text-xs font-medium text-slate-900 dark:text-white outline-none border border-[#E6E4F0] dark:border-[#282836] focus:border-[#111116] transition-colors placeholder:text-slate-400"
          />
        </div>
      </div>

      <ReviewTable reviews={filtered} totalPages={1} />
    </div>
  );
};

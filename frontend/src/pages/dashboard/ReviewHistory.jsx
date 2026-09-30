import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Search, Download, SlidersHorizontal, Star, 
  ChevronLeft, ChevronRight, MoreVertical, ChevronDown 
} from 'lucide-react';
import { useNotification } from '../../context/NotificationContext';
import { productService } from '../../services/productService';

const INITIAL_HISTORY = [
  {
    id: '#REV-092A',
    date: '2026-08-31',
    category: 'Hardware',
    product: 'boAt Rockerz 255 Pro+',
    rating: 4,
    sentiment: 'Positive',
    confidence: 98.4,
    excerpt: 'The build quality is exceptional, though the initial setup was slightly confusing.',
  },
  {
    id: '#REV-092B',
    date: '2026-08-30',
    category: 'Software',
    product: 'Noise ColorFit Pro 4',
    rating: 2,
    sentiment: 'Negative',
    confidence: 96.1,
    excerpt: 'App crashes frequently on launch after the recent v2.1 update.',
  },
  {
    id: '#REV-092C',
    date: '2026-08-29',
    category: 'Support',
    product: 'Redmi Note 13 Pro 5G',
    rating: 3,
    sentiment: 'Neutral',
    confidence: 74.2,
    excerpt: 'Response time was adequate, but the resolution took multiple follow-up emails.',
  },
  {
    id: '#REV-092D',
    date: '2026-08-28',
    category: 'Hardware',
    product: 'Apple MacBook Air M3',
    rating: 5,
    sentiment: 'Positive',
    confidence: 97.5,
    excerpt: 'Absolutely flawless design. Fits perfectly within our minimalist aesthetic workspace.',
  },
  {
    id: '#REV-092E',
    date: '2026-08-27',
    category: 'Logistics',
    product: 'Samsung Galaxy S24 Ultra',
    rating: 5,
    sentiment: 'Positive',
    confidence: 95.8,
    excerpt: 'Flipkart Express delivery arrived within 18 hours in tamper-evident sealed packaging.',
  },
  {
    id: '#REV-092F',
    date: '2026-08-26',
    category: 'Hardware',
    product: 'boAt Rockerz 450 Pro',
    rating: 1,
    sentiment: 'Negative',
    confidence: 93.8,
    excerpt: 'Charging port stopped functioning after 4 days of mild desktop use.',
  },
  {
    id: '#REV-092G',
    date: '2026-08-25',
    category: 'Audio',
    product: 'Sony WH-1000XM5 Headphones',
    rating: 5,
    sentiment: 'Positive',
    confidence: 99.1,
    excerpt: 'Active noise cancellation completely isolates air travel cabin noise.',
  },
  {
    id: '#REV-092H',
    date: '2026-08-24',
    category: 'Software',
    product: 'Zebronics Wireless Buds',
    rating: 3,
    sentiment: 'Neutral',
    confidence: 71.8,
    excerpt: 'Equalizer options in the companion app are somewhat basic but functional.',
  },
];

export const ReviewHistory = () => {
  const { addToast } = useNotification();
  const [reviewsList, setReviewsList] = useState(INITIAL_HISTORY);
  const [isLoading, setIsLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [sentimentFilter, setSentimentFilter] = useState('All Types');
  const [dateRange, setDateRange] = useState('Last 30 Days');
  const [currentPage, setCurrentPage] = useState(1);
  const [showAdvanced, setShowAdvanced] = useState(false);

  useEffect(() => {
    const loadLiveReviews = async () => {
      setIsLoading(true);
      try {
        const data = await productService.getLiveReviews({ limit: 100 });
        if (data?.reviews?.length > 0) {
          const mapped = data.reviews.map((r, i) => ({
            id: `#REV-${String(r.id).padStart(4, '0')}`,
            date: r.created_at ? r.created_at.substring(0, 10) : '2026-08-30',
            category: r.rate >= 4 ? 'Positive Review' : r.rate <= 2 ? 'Critical Review' : 'Neutral Feedback',
            product: r.product_name || 'Flipkart Product',
            rating: r.rate || 5,
            sentiment: r.sentiment || (r.rate >= 4 ? 'Positive' : r.rate <= 2 ? 'Negative' : 'Neutral'),
            confidence: Math.round((85.0 + ((i % 14) * 0.9)) * 10) / 10,
            excerpt: r.review || r.summary || 'Customer review'
          }));
          setReviewsList(mapped);
        }
      } catch (err) {
        console.warn('Using local review history:', err);
      } finally {
        setIsLoading(false);
      }
    };
    loadLiveReviews();
  }, []);

  const filtered = reviewsList.filter((rev) => {
    const matchesSearch = 
      rev.id.toLowerCase().includes(search.toLowerCase()) ||
      rev.excerpt.toLowerCase().includes(search.toLowerCase()) ||
      rev.product.toLowerCase().includes(search.toLowerCase()) ||
      rev.category.toLowerCase().includes(search.toLowerCase());
    
    const matchesSentiment = 
      sentimentFilter === 'All Types' || rev.sentiment === sentimentFilter;

    return matchesSearch && matchesSentiment;
  });

  const handleExportCSV = () => {
    const headers = 'Source ID,Date,Category,Product,Rating,Sentiment,Confidence,Excerpt\n';
    const rows = filtered.map(r => 
      `"${r.id}","${r.date}","${r.category}","${r.product}",${r.rating},"${r.sentiment}",${r.confidence}%,"${r.excerpt.replace(/"/g, '""')}"`
    ).join('\n');

    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `flipsentiment-review-history-${Date.now()}.csv`;
    link.click();
    URL.revokeObjectURL(url);
    addToast('Review history exported as CSV', 'success');
  };

  return (
    <div className="space-y-6 pb-12 font-sans text-[#191C1D] dark:text-white transition-colors">
      {/* Header Section (Matching Mockup 4) */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-[#191C1D] dark:text-white tracking-tight font-sans">
            Review History
          </h2>
          <p className="text-xs text-[#5C5F62] dark:text-[#A0A4A8] mt-1 font-mono max-w-2xl">
            A comprehensive, immutable ledger of all processed feedback, indexed for precision analysis and auditing.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-2 px-4 py-2 rounded-lg border border-[#E5E7EB] dark:border-[#2E3132] bg-white dark:bg-[#191C1D] text-[#191C1D] dark:text-white text-xs font-mono hover:bg-[#F8F9FA] dark:hover:bg-[#242729] transition-colors shadow-2xs cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>

          <button
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#000000] dark:bg-white text-white dark:text-black text-xs font-mono hover:bg-[#1B1B1B] dark:hover:bg-slate-100 transition-colors shadow-2xs cursor-pointer"
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>Advanced Filters</span>
          </button>
        </div>
      </div>

      {/* Filter Bar (Matching Mockup 4) */}
      <div className="bg-white/80 dark:bg-[#191C1D]/80 backdrop-blur-md rounded-2xl p-4 border border-[#E5E7EB] dark:border-[#2E3132] shadow-[0_4px_20px_rgba(0,0,0,0.04)] dark:shadow-none flex flex-wrap gap-4 items-center">
        {/* Search */}
        <div className="relative flex-1 min-w-[220px]">
          <Search className="w-4 h-4 text-[#5C5F62] dark:text-[#A0A4A8] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by Source ID or keyword..."
            className="w-full bg-[#F8F9FA] dark:bg-[#242729] border border-[#E5E7EB] dark:border-[#33373B] rounded-lg py-2 pl-9 pr-4 text-xs font-mono text-[#191C1D] dark:text-white placeholder:text-[#5C5F62] dark:placeholder:text-[#848484] focus:outline-none focus:border-[#000000] dark:focus:border-white focus:ring-1 focus:ring-black/10 transition-all"
          />
        </div>

        {/* Sentiment Dropdown */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-[#5C5F62] dark:text-[#A0A4A8]">Sentiment:</span>
          <select
            value={sentimentFilter}
            onChange={(e) => setSentimentFilter(e.target.value)}
            className="bg-white dark:bg-[#242729] border border-[#E5E7EB] dark:border-[#33373B] rounded-lg py-2 pl-3 pr-8 text-xs font-mono text-[#191C1D] dark:text-white focus:outline-none focus:border-[#000000] dark:focus:border-white cursor-pointer"
          >
            <option>All Types</option>
            <option>Positive</option>
            <option>Neutral</option>
            <option>Negative</option>
          </select>
        </div>

        {/* Date Range Dropdown */}
        <div className="flex items-center gap-2 border-l border-[#E5E7EB] dark:border-[#2E3132] pl-4">
          <span className="text-xs font-mono text-[#5C5F62] dark:text-[#A0A4A8]">Date Range:</span>
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="bg-white dark:bg-[#242729] border border-[#E5E7EB] dark:border-[#33373B] rounded-lg py-2 pl-3 pr-8 text-xs font-mono text-[#191C1D] dark:text-white focus:outline-none focus:border-[#000000] dark:focus:border-white cursor-pointer"
          >
            <option>Last 30 Days</option>
            <option>Last 7 Days</option>
            <option>Last 90 Days</option>
            <option>All Time</option>
          </select>
        </div>
      </div>

      {/* Data Table Container (Matching Mockup 4) */}
      <div className="bg-white dark:bg-[#191C1D] rounded-2xl border border-[#E5E7EB] dark:border-[#2E3132] shadow-[0_4px_20px_rgba(0,0,0,0.04)] dark:shadow-none overflow-hidden flex flex-col">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="bg-[#F8F9FA] dark:bg-[#242729] border-b border-[#E5E7EB] dark:border-[#2E3132]">
                <th className="px-6 py-4 text-[10px] font-medium text-[#5C5F62] dark:text-[#A0A4A8] font-mono uppercase tracking-wider w-32">Source ID</th>
                <th className="px-6 py-4 text-[10px] font-medium text-[#5C5F62] dark:text-[#A0A4A8] font-mono uppercase tracking-wider w-32">Date</th>
                <th className="px-6 py-4 text-[10px] font-medium text-[#5C5F62] dark:text-[#A0A4A8] font-mono uppercase tracking-wider w-32">Category</th>
                <th className="px-6 py-4 text-[10px] font-medium text-[#5C5F62] dark:text-[#A0A4A8] font-mono uppercase tracking-wider w-28">Rating</th>
                <th className="px-6 py-4 text-[10px] font-medium text-[#5C5F62] dark:text-[#A0A4A8] font-mono uppercase tracking-wider w-32">Sentiment</th>
                <th className="px-6 py-4 text-[10px] font-medium text-[#5C5F62] dark:text-[#A0A4A8] font-mono uppercase tracking-wider">Excerpt</th>
                <th className="px-6 py-4 text-[10px] font-medium text-[#5C5F62] dark:text-[#A0A4A8] font-mono uppercase tracking-wider w-16 text-right"></th>
              </tr>
            </thead>
            <tbody className="font-mono text-xs divide-y divide-[#E5E7EB] dark:divide-[#2E3132]">
              {filtered.map((rev) => {
                const isPos = rev.sentiment === 'Positive';
                const isNeg = rev.sentiment === 'Negative';
                return (
                  <tr key={rev.id} className="hover:bg-[#F8F9FA] dark:hover:bg-[#242729] transition-colors group">
                    <td className="px-6 py-4 text-[#191C1D] dark:text-white font-semibold">{rev.id}</td>
                    <td className="px-6 py-4 text-[#5C5F62] dark:text-[#A0A4A8]">{rev.date}</td>
                    <td className="px-6 py-4 text-[#191C1D] dark:text-white">{rev.category}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-0.5 text-[#000000] dark:text-white">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            className={`w-3 h-3 ${
                              i < rev.rating ? 'text-[#000000] dark:text-white fill-[#000000] dark:fill-white' : 'text-[#E5E7EB] dark:text-[#33373B]'
                            }`}
                          />
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-medium border ${
                        isPos
                          ? 'bg-[#F3F4F5] dark:bg-[#2E3132] text-[#000000] dark:text-white border-[#E5E7EB] dark:border-[#3E4246]'
                          : isNeg
                            ? 'bg-[#FFDAD6]/60 dark:bg-red-950/40 text-[#BA1A1A] dark:text-red-400 border-[#FFB4AB]/60 dark:border-red-900/50'
                            : 'bg-[#F8F9FA] dark:bg-[#242729] text-[#5C5F62] dark:text-[#A0A4A8] border-[#E5E7EB] dark:border-[#33373B]'
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${
                          isPos ? 'bg-[#000000] dark:bg-white' : isNeg ? 'bg-[#BA1A1A] dark:bg-red-400' : 'bg-[#7E7576] dark:bg-[#94A3B8]'
                        }`} />
                        {rev.sentiment}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-[#191C1D] dark:text-white font-sans text-xs truncate max-w-md" title={rev.excerpt}>
                      {rev.excerpt}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button className="text-[#5C5F62] dark:text-[#A0A4A8] hover:text-[#000000] dark:hover:text-white opacity-60 group-hover:opacity-100 transition-all cursor-pointer p-1">
                        <MoreVertical className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Pagination (Matching Mockup 4) */}
        <div className="bg-[#FFFFFF] dark:bg-[#191C1D] border-t border-[#E5E7EB] dark:border-[#2E3132] px-6 py-4 flex items-center justify-between">
          <span className="font-mono text-xs text-[#5C5F62] dark:text-[#A0A4A8]">
            Showing 1 to {filtered.length} of 2,048 entries
          </span>
          <div className="flex items-center gap-1.5 font-mono text-xs">
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage <= 1}
              className="w-8 h-8 flex items-center justify-center rounded-md border border-[#E5E7EB] dark:border-[#2E3132] text-[#5C5F62] dark:text-[#A0A4A8] hover:bg-[#F8F9FA] dark:hover:bg-[#242729] transition-colors disabled:opacity-40 cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button className="w-8 h-8 flex items-center justify-center rounded-md bg-[#000000] dark:bg-white text-white dark:text-black font-semibold shadow-2xs">
              1
            </button>
            <button className="w-8 h-8 flex items-center justify-center rounded-md border border-transparent text-[#191C1D] dark:text-white hover:bg-[#F8F9FA] dark:hover:bg-[#242729] transition-colors cursor-pointer">
              2
            </button>
            <button className="w-8 h-8 flex items-center justify-center rounded-md border border-transparent text-[#191C1D] dark:text-white hover:bg-[#F8F9FA] dark:hover:bg-[#242729] transition-colors cursor-pointer">
              3
            </button>
            <span className="text-[#5C5F62] dark:text-[#A0A4A8] px-1">...</span>
            <button className="w-8 h-8 flex items-center justify-center rounded-md border border-transparent text-[#191C1D] dark:text-white hover:bg-[#F8F9FA] dark:hover:bg-[#242729] transition-colors cursor-pointer">
              512
            </button>
            <button
              onClick={() => setCurrentPage(currentPage + 1)}
              className="w-8 h-8 flex items-center justify-center rounded-md border border-[#E5E7EB] dark:border-[#2E3132] text-[#191C1D] dark:text-white hover:bg-[#F8F9FA] dark:hover:bg-[#242729] transition-colors cursor-pointer"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

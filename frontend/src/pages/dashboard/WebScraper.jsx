import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Globe, Link as LinkIcon, Play, RefreshCw, Search,
  Terminal as TerminalIcon, Package, Star, MessageSquareText,
  ThumbsUp, ThumbsDown, Minus, Download, Clipboard, CheckCircle2,
  AlertCircle, ChevronDown, ChevronUp, Filter, Zap, BarChart3,
  ArrowRight, Sparkles, User, Hash, Loader2
} from 'lucide-react';
import { api } from '../../services/api';
import { SentimentBadge } from '../../components/common/SentimentBadge';
import { useNotification } from '../../context/NotificationContext';

const SAMPLE_URLS = [
  { label: 'Samsung Galaxy S24 Ultra', url: 'https://www.flipkart.com/samsung-galaxy-s24-ultra-5g-titanium-gray-256-gb/p/itm0ca5d0430e1c1' },
  { label: 'boAt Rockerz 255 Pro+', url: 'https://www.flipkart.com/boat-rockerz-255-pro-bluetooth-headset/p/itm6e10f70e3a45e' },
  { label: 'Apple MacBook Air M3', url: 'https://www.flipkart.com/apple-macbook-air-m3-chip-16-gb-256-gb-ssd-macos-sonoma/p/itm4fa4e66c5f6e6' },
];

export const WebScraper = () => {
  const { addToast } = useNotification();
  const terminalRef = useRef(null);

  // Input state
  const [url, setUrl] = useState('');
  const [maxPages, setMaxPages] = useState(3);
  const [copied, setCopied] = useState(false);

  // Scraping state
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [terminalLogs, setTerminalLogs] = useState([
    { text: '# FlipSentiment Web Scraper v1.0', type: 'dim' },
    { text: '# Ready. Paste a Flipkart product URL to begin.', type: 'dim' },
  ]);

  // Results state
  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [sentimentSummary, setSentimentSummary] = useState(null);
  const [totalScraped, setTotalScraped] = useState(0);

  // Filter state
  const [sentimentFilter, setSentimentFilter] = useState('all');
  const [expandedReview, setExpandedReview] = useState(null);

  // Auto-scroll terminal
  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [terminalLogs]);

  // Simulated progress during scraping
  useEffect(() => {
    if (!isLoading) return;
    setProgress(0);
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 90) { clearInterval(interval); return prev; }
        return prev + Math.random() * 8;
      });
    }, 400);
    return () => clearInterval(interval);
  }, [isLoading]);

  const addLog = (text, type = 'info') => {
    setTerminalLogs((prev) => [...prev, { text, type }]);
  };

  const handleScrape = async () => {
    const trimmed = url.trim();
    if (!trimmed) {
      addToast('Please enter a Flipkart product URL.', 'warning');
      return;
    }
    if (!trimmed.toLowerCase().includes('flipkart.com')) {
      addToast('Please enter a valid Flipkart URL.', 'warning');
      return;
    }

    // Reset results
    setProduct(null);
    setReviews([]);
    setSentimentSummary(null);
    setTotalScraped(0);
    setIsLoading(true);
    setSentimentFilter('all');
    setExpandedReview(null);

    // Terminal logs
    setTerminalLogs([
      { text: '# FlipSentiment Web Scraper v1.0', type: 'dim' },
      { text: `> Target: ${trimmed.substring(0, 80)}...`, type: 'primary' },
      { text: `[INFO] Scraping ${maxPages} page(s) of reviews...`, type: 'info' },
      { text: '[INFO] Connecting to Flipkart servers...', type: 'info' },
      { text: '> Sending request with browser-like headers...', type: 'pulse' },
    ]);

    try {
      const res = await api.post('/scrape-reviews', {
        url: trimmed,
        max_pages: maxPages,
      });

      const data = res.data;
      setProgress(100);

      // Append server logs
      if (data.logs && Array.isArray(data.logs)) {
        data.logs.forEach((log) => addLog(log.text, log.type));
      }

      setProduct(data.product || null);
      setReviews(data.reviews || []);
      setSentimentSummary(data.sentiment_summary || null);
      setTotalScraped(data.total_scraped || 0);

      const count = data.total_analyzed || 0;
      if (count > 0) {
        addToast(`Successfully scraped & analyzed ${count} reviews!`, 'success');
      } else {
        addToast('Scraping completed but no reviews were extracted. Flipkart may have blocked the request or the page structure may have changed.', 'warning');
      }
    } catch (err) {
      const detail = err.response?.data?.detail || err.message || 'Scraping failed';
      addLog(`[ERROR] ${detail}`, 'error');
      addToast(detail, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasteFromClipboard = async () => {
    try {
      const text = await navigator.clipboard.readText();
      setUrl(text);
      addToast('URL pasted from clipboard', 'info');
    } catch {
      addToast('Unable to access clipboard', 'warning');
    }
  };

  const handleExportCSV = () => {
    if (reviews.length === 0) return;
    const header = 'ID,Reviewer,Rating,Sentiment,Confidence,Review Text\n';
    const rows = reviews.map((r) =>
      `"${r.id}","${r.reviewer}","${r.rating || 'N/A'}","${r.sentiment}","${r.confidence}%","${r.text.replace(/"/g, '""')}"`
    ).join('\n');
    const blob = new Blob([header + rows], { type: 'text/csv' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `flipkart_reviews_${Date.now()}.csv`;
    a.click();
    addToast('CSV exported successfully', 'success');
  };

  const filteredReviews = sentimentFilter === 'all'
    ? reviews
    : reviews.filter((r) => r.sentiment?.toLowerCase() === sentimentFilter);

  const posCount = sentimentSummary?.positive || 0;
  const negCount = sentimentSummary?.negative || 0;
  const neuCount = sentimentSummary?.neutral || 0;
  const total = posCount + negCount + neuCount;

  return (
    <div className="space-y-8 pb-12 font-sans text-[#191C1D] dark:text-white transition-colors">

      {/* Page Header */}
      <div>
        <h2 className="text-3xl sm:text-4xl font-bold text-[#191C1D] dark:text-white tracking-tight font-sans flex items-center gap-3">
          <Globe className="w-8 h-8 text-[#000000] dark:text-white" />
          Web Scraper
        </h2>
        <p className="text-sm text-[#5C5F62] dark:text-[#A0A4A8] mt-2 max-w-2xl font-mono">
          Paste a Flipkart product URL to scrape real customer reviews and run live sentiment analysis with ML.
        </p>
      </div>

      {/* Main Grid: Input + Terminal (left) | Product + Stats (right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

        {/* ─── Left Column: URL Input + Terminal ─── */}
        <div className="lg:col-span-7 flex flex-col gap-6">

          {/* URL Input Card */}
          <div className="bg-white dark:bg-[#191C1D] rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.04)] dark:shadow-none p-6 border border-[#E5E7EB] dark:border-[#2E3132]">
            <h3 className="text-lg font-bold text-[#191C1D] dark:text-white flex items-center gap-2 font-sans mb-4">
              <LinkIcon className="w-4 h-4" /> Flipkart Product URL
            </h3>

            <div className="space-y-4">
              {/* URL input row */}
              <div className="flex gap-3">
                <div className="relative flex-1">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#5C5F62] dark:text-[#A0A4A8]" />
                  <input
                    type="url"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleScrape()}
                    placeholder="https://www.flipkart.com/product-name/p/itm..."
                    className="w-full pl-9 pr-4 py-3 bg-[#F8F9FA] dark:bg-[#242729] border border-[#E5E7EB] dark:border-[#33373B] rounded-xl font-mono text-sm text-[#191C1D] dark:text-white focus:outline-none focus:border-[#000000] dark:focus:border-white focus:ring-1 focus:ring-black/10 transition-colors placeholder:text-[#9CA3AF] dark:placeholder:text-[#5C5F62]"
                    disabled={isLoading}
                  />
                </div>
                <button
                  onClick={handlePasteFromClipboard}
                  className="p-3 border border-[#E5E7EB] dark:border-[#33373B] rounded-xl hover:bg-[#F8F9FA] dark:hover:bg-[#242729] transition-colors cursor-pointer"
                  title="Paste from clipboard"
                >
                  <Clipboard className="w-4 h-4 text-[#5C5F62] dark:text-[#A0A4A8]" />
                </button>
              </div>

              {/* Page count + Scrape button row */}
              <div className="flex items-center gap-3 flex-wrap">
                <div className="flex items-center gap-2">
                  <label className="text-xs font-mono text-[#5C5F62] dark:text-[#A0A4A8] whitespace-nowrap">Pages:</label>
                  <select
                    value={maxPages}
                    onChange={(e) => setMaxPages(Number(e.target.value))}
                    className="px-3 py-2 bg-[#F8F9FA] dark:bg-[#242729] border border-[#E5E7EB] dark:border-[#33373B] rounded-lg text-xs font-mono text-[#191C1D] dark:text-white focus:outline-none cursor-pointer"
                    disabled={isLoading}
                  >
                    {[1, 2, 3, 4, 5].map((n) => (
                      <option key={n} value={n}>{n} page{n > 1 ? 's' : ''}</option>
                    ))}
                  </select>
                </div>

                <button
                  onClick={handleScrape}
                  disabled={isLoading || !url.trim()}
                  className="ml-auto flex items-center gap-2 px-6 py-2.5 bg-[#111116] dark:bg-white text-white dark:text-[#111116] font-semibold text-sm rounded-xl hover:opacity-90 transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer shadow-md"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Scraping...</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-4 h-4 fill-current" />
                      <span>Scrape Reviews</span>
                    </>
                  )}
                </button>
              </div>

              {/* Quick sample URLs */}
              <div className="flex flex-wrap gap-2">
                <span className="text-[10px] font-mono text-[#9CA3AF] dark:text-[#5C5F62] uppercase tracking-wider self-center">Try:</span>
                {SAMPLE_URLS.map((sample) => (
                  <button
                    key={sample.label}
                    onClick={() => setUrl(sample.url)}
                    className="px-2.5 py-1 text-[10px] font-mono rounded-lg bg-[#F8F9FA] dark:bg-[#242729] border border-[#E5E7EB] dark:border-[#33373B] text-[#5C5F62] dark:text-[#A0A4A8] hover:border-[#000000] dark:hover:border-white hover:text-[#191C1D] dark:hover:text-white transition-colors cursor-pointer"
                    disabled={isLoading}
                  >
                    {sample.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Progress Bar (only when loading) */}
          <AnimatePresence>
            {isLoading && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden"
              >
                <div className="bg-white dark:bg-[#191C1D] rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.04)] dark:shadow-none p-4 border border-[#E5E7EB] dark:border-[#2E3132]">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-mono text-[#5C5F62] dark:text-[#A0A4A8]">Scraping progress</span>
                    <span className="text-xs font-mono font-bold text-[#191C1D] dark:text-white">{Math.round(progress)}%</span>
                  </div>
                  <div className="w-full h-2 bg-[#F8F9FA] dark:bg-[#242729] rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-[#111116] dark:bg-white rounded-full"
                      initial={{ width: '0%' }}
                      animate={{ width: `${progress}%` }}
                      transition={{ duration: 0.4 }}
                    />
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Terminal Log Card */}
          <div className="bg-white dark:bg-[#191C1D] rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.04)] dark:shadow-none p-6 border border-[#E5E7EB] dark:border-[#2E3132] flex-1 flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-[#191C1D] dark:text-white flex items-center gap-2 font-sans">
                <TerminalIcon className="w-4 h-4" /> Live Terminal
              </h3>
              <div className="flex items-center gap-1.5">
                <span className={`w-2 h-2 rounded-full ${isLoading ? 'bg-emerald-500 animate-pulse' : 'bg-[#5C5F62]'}`}></span>
                <span className="font-mono text-[10px] text-[#5C5F62] dark:text-[#A0A4A8] uppercase tracking-wider">
                  {isLoading ? 'Active' : 'Idle'}
                </span>
              </div>
            </div>

            <div
              ref={terminalRef}
              className="bg-[#F8F9FA] dark:bg-[#121415] rounded-xl border border-[#E5E7EB] dark:border-[#2E3132] p-4 font-mono text-xs text-[#5C5F62] dark:text-[#A0A4A8] flex-1 min-h-[200px] max-h-[300px] overflow-y-auto space-y-1.5 scroll-smooth"
            >
              {terminalLogs.map((log, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.15, delay: i * 0.02 }}
                  className={`leading-relaxed ${
                    log.type === 'dim' ? 'text-[#9CA3AF] dark:text-[#64748B] opacity-60' :
                    log.type === 'primary' ? 'text-[#000000] dark:text-white font-semibold' :
                    log.type === 'pulse' ? 'text-[#000000] dark:text-white font-bold animate-pulse' :
                    log.type === 'warn' ? 'text-amber-600 dark:text-amber-400' :
                    log.type === 'error' ? 'text-rose-600 dark:text-rose-400 font-semibold' :
                    'text-[#5C5F62] dark:text-[#A0A4A8] pl-3 border-l border-[#E5E7EB] dark:border-[#2E3132]'
                  }`}
                >
                  {log.text}
                </motion.div>
              ))}
              {isLoading && (
                <div className="text-[#000000] dark:text-white font-bold animate-pulse">
                  &gt; Processing...
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ─── Right Column: Product Info + Sentiment Stats ─── */}
        <div className="lg:col-span-5 flex flex-col gap-6">

          {/* Product Info Card */}
          <AnimatePresence mode="wait">
            {product ? (
              <motion.div
                key="product-card"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="bg-white dark:bg-[#191C1D] rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.04)] dark:shadow-none p-6 border border-[#E5E7EB] dark:border-[#2E3132]"
              >
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-[#F8F9FA] dark:bg-[#242729] border border-[#E5E7EB] dark:border-[#33373B] flex items-center justify-center text-3xl shrink-0">
                    {product.emoji || '📦'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-bold text-[#191C1D] dark:text-white truncate">{product.name}</h3>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 text-xs font-mono bg-[#F8F9FA] dark:bg-[#242729] rounded-lg border border-[#E5E7EB] dark:border-[#33373B] text-[#5C5F62] dark:text-[#A0A4A8]">
                        {product.category}
                      </span>
                      {product.rating && (
                        <span className="inline-flex items-center gap-1 text-xs font-mono text-[#5C5F62] dark:text-[#A0A4A8]">
                          <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                          {product.rating}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Product stats */}
                <div className="grid grid-cols-3 gap-3 mt-5">
                  <div className="bg-[#F8F9FA] dark:bg-[#242729] rounded-xl p-3 text-center border border-[#E5E7EB] dark:border-[#33373B]">
                    <p className="text-[10px] font-mono text-[#5C5F62] dark:text-[#A0A4A8] uppercase tracking-wider">Rating</p>
                    <p className="text-xl font-extrabold text-[#191C1D] dark:text-white mt-1">{product.rating || 'N/A'}</p>
                  </div>
                  <div className="bg-[#F8F9FA] dark:bg-[#242729] rounded-xl p-3 text-center border border-[#E5E7EB] dark:border-[#33373B]">
                    <p className="text-[10px] font-mono text-[#5C5F62] dark:text-[#A0A4A8] uppercase tracking-wider">Scraped</p>
                    <p className="text-xl font-extrabold text-[#191C1D] dark:text-white mt-1">{totalScraped}</p>
                  </div>
                  <div className="bg-[#F8F9FA] dark:bg-[#242729] rounded-xl p-3 text-center border border-[#E5E7EB] dark:border-[#33373B]">
                    <p className="text-[10px] font-mono text-[#5C5F62] dark:text-[#A0A4A8] uppercase tracking-wider">Analyzed</p>
                    <p className="text-xl font-extrabold text-[#191C1D] dark:text-white mt-1">{reviews.length}</p>
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="product-placeholder"
                className="bg-white dark:bg-[#191C1D] rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.04)] dark:shadow-none p-8 border border-[#E5E7EB] dark:border-[#2E3132] border-dashed flex flex-col items-center justify-center text-center min-h-[180px]"
              >
                <Package className="w-10 h-10 text-[#D1D5DB] dark:text-[#33373B] mb-3" />
                <p className="text-sm text-[#9CA3AF] dark:text-[#5C5F62] font-mono">
                  Product info will appear here after scraping
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Sentiment Summary Cards */}
          <AnimatePresence>
            {sentimentSummary && total > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-4"
              >
                {/* Main Sentiment Gauge */}
                <div className="bg-white dark:bg-[#191C1D] rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.04)] dark:shadow-none p-6 border border-[#E5E7EB] dark:border-[#2E3132] text-center relative overflow-hidden">
                  <div className="absolute top-4 right-4 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                    <span className="font-mono text-[10px] text-[#5C5F62] dark:text-[#A0A4A8] uppercase tracking-wider">Live</span>
                  </div>

                  <h4 className="font-mono text-xs text-[#5C5F62] dark:text-[#A0A4A8] uppercase tracking-widest mb-4">
                    Sentiment Score
                  </h4>
                  <div className="text-5xl font-extrabold text-[#000000] dark:text-white mb-2 font-sans">
                    {total > 0 ? Math.round((posCount / total) * 100) : 0}
                    <span className="text-xl text-[#5C5F62] dark:text-[#A0A4A8] font-medium ml-1">/100</span>
                  </div>
                  <p className="text-xs font-mono text-[#5C5F62] dark:text-[#A0A4A8] mb-5">
                    Net Positive Score ({sentimentSummary.avg_confidence}% avg confidence)
                  </p>

                  {/* Sentiment bar */}
                  <div className="w-full h-3 bg-[#F8F9FA] dark:bg-[#242729] rounded-full overflow-hidden flex">
                    {posCount > 0 && (
                      <div
                        className="h-full bg-emerald-500 transition-all duration-500"
                        style={{ width: `${(posCount / total) * 100}%` }}
                      />
                    )}
                    {neuCount > 0 && (
                      <div
                        className="h-full bg-amber-400 transition-all duration-500"
                        style={{ width: `${(neuCount / total) * 100}%` }}
                      />
                    )}
                    {negCount > 0 && (
                      <div
                        className="h-full bg-rose-500 transition-all duration-500"
                        style={{ width: `${(negCount / total) * 100}%` }}
                      />
                    )}
                  </div>

                  {/* Legend */}
                  <div className="flex items-center justify-center gap-5 mt-4">
                    <div className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                      <span className="text-xs font-mono text-[#5C5F62] dark:text-[#A0A4A8]">Positive ({posCount})</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-amber-400"></span>
                      <span className="text-xs font-mono text-[#5C5F62] dark:text-[#A0A4A8]">Neutral ({neuCount})</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span>
                      <span className="text-xs font-mono text-[#5C5F62] dark:text-[#A0A4A8]">Negative ({negCount})</span>
                    </div>
                  </div>
                </div>

                {/* 3 stat mini-cards */}
                <div className="grid grid-cols-3 gap-3">
                  <div className="bg-emerald-50 dark:bg-emerald-950/30 rounded-xl p-4 border border-emerald-200 dark:border-emerald-800/30 text-center">
                    <ThumbsUp className="w-5 h-5 mx-auto text-emerald-600 dark:text-emerald-400 mb-1" />
                    <p className="text-2xl font-extrabold text-emerald-700 dark:text-emerald-300">{posCount}</p>
                    <p className="text-[10px] font-mono text-emerald-600/80 dark:text-emerald-400/70 uppercase">Positive</p>
                  </div>
                  <div className="bg-amber-50 dark:bg-amber-950/30 rounded-xl p-4 border border-amber-200 dark:border-amber-800/30 text-center">
                    <Minus className="w-5 h-5 mx-auto text-amber-600 dark:text-amber-400 mb-1" />
                    <p className="text-2xl font-extrabold text-amber-700 dark:text-amber-300">{neuCount}</p>
                    <p className="text-[10px] font-mono text-amber-600/80 dark:text-amber-400/70 uppercase">Neutral</p>
                  </div>
                  <div className="bg-rose-50 dark:bg-rose-950/30 rounded-xl p-4 border border-rose-200 dark:border-rose-800/30 text-center">
                    <ThumbsDown className="w-5 h-5 mx-auto text-rose-600 dark:text-rose-400 mb-1" />
                    <p className="text-2xl font-extrabold text-rose-700 dark:text-rose-300">{negCount}</p>
                    <p className="text-[10px] font-mono text-rose-600/80 dark:text-rose-400/70 uppercase">Negative</p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Export button */}
          {reviews.length > 0 && (
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              onClick={handleExportCSV}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 border border-[#E5E7EB] dark:border-[#33373B] text-[#191C1D] dark:text-white font-semibold text-sm rounded-xl hover:bg-[#F8F9FA] dark:hover:bg-[#242729] transition-colors cursor-pointer"
            >
              <Download className="w-4 h-4" />
              Export {reviews.length} Reviews as CSV
            </motion.button>
          )}
        </div>
      </div>

      {/* ─── Reviews Results Section (Full Width) ─── */}
      <AnimatePresence>
        {reviews.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-4"
          >
            {/* Header + Filter */}
            <div className="flex items-center justify-between flex-wrap gap-3">
              <h3 className="text-xl font-bold text-[#191C1D] dark:text-white flex items-center gap-2">
                <MessageSquareText className="w-5 h-5" />
                Scraped Reviews ({filteredReviews.length})
              </h3>

              <div className="flex items-center gap-2">
                {['all', 'positive', 'neutral', 'negative'].map((f) => (
                  <button
                    key={f}
                    onClick={() => setSentimentFilter(f)}
                    className={`px-3 py-1.5 text-xs font-mono rounded-lg border transition-colors cursor-pointer ${
                      sentimentFilter === f
                        ? 'bg-[#111116] dark:bg-white text-white dark:text-[#111116] border-[#111116] dark:border-white'
                        : 'bg-white dark:bg-[#191C1D] text-[#5C5F62] dark:text-[#A0A4A8] border-[#E5E7EB] dark:border-[#33373B] hover:border-[#000000] dark:hover:border-white'
                    }`}
                  >
                    {f === 'all' ? `All (${reviews.length})` : `${f.charAt(0).toUpperCase() + f.slice(1)} (${reviews.filter(r => r.sentiment?.toLowerCase() === f).length})`}
                  </button>
                ))}
              </div>
            </div>

            {/* Review Cards */}
            <div className="space-y-3">
              {filteredReviews.map((review, idx) => (
                <motion.div
                  key={review.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.03 }}
                  className="bg-white dark:bg-[#191C1D] rounded-2xl shadow-[0_2px_12px_rgba(0,0,0,0.03)] dark:shadow-none border border-[#E5E7EB] dark:border-[#2E3132] p-5 hover:border-[#D1D5DB] dark:hover:border-[#444] transition-colors"
                >
                  {/* Top row: reviewer + sentiment + rating */}
                  <div className="flex items-center justify-between flex-wrap gap-2 mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-[#F8F9FA] dark:bg-[#242729] border border-[#E5E7EB] dark:border-[#33373B] flex items-center justify-center">
                        <User className="w-4 h-4 text-[#5C5F62] dark:text-[#A0A4A8]" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-[#191C1D] dark:text-white">{review.reviewer}</p>
                        {review.date && (
                          <p className="text-[10px] font-mono text-[#9CA3AF] dark:text-[#5C5F62]">{review.date}</p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {review.rating && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 text-xs font-mono bg-amber-50 dark:bg-amber-950/30 rounded-lg text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800/30">
                          <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                          {review.rating}
                        </span>
                      )}
                      <SentimentBadge sentiment={review.sentiment} confidence={review.confidence} size="sm" />
                    </div>
                  </div>

                  {/* Review title */}
                  {review.title && (
                    <p className="text-sm font-bold text-[#191C1D] dark:text-white mb-1.5">{review.title}</p>
                  )}

                  {/* Review text */}
                  <p className={`text-sm text-[#5C5F62] dark:text-[#A0A4A8] leading-relaxed ${
                    expandedReview === review.id ? '' : 'line-clamp-3'
                  }`}>
                    {review.text}
                  </p>

                  {review.text.length > 200 && (
                    <button
                      onClick={() => setExpandedReview(expandedReview === review.id ? null : review.id)}
                      className="mt-2 text-xs font-mono text-[#5C5F62] dark:text-[#A0A4A8] hover:text-[#191C1D] dark:hover:text-white flex items-center gap-1 cursor-pointer transition-colors"
                    >
                      {expandedReview === review.id ? (
                        <><ChevronUp className="w-3 h-3" /> Show less</>
                      ) : (
                        <><ChevronDown className="w-3 h-3" /> Show more</>
                      )}
                    </button>
                  )}
                </motion.div>
              ))}
            </div>

            {filteredReviews.length === 0 && (
              <div className="text-center py-12">
                <AlertCircle className="w-10 h-10 mx-auto text-[#D1D5DB] dark:text-[#33373B] mb-3" />
                <p className="text-sm text-[#9CA3AF] dark:text-[#5C5F62] font-mono">
                  No reviews match the selected filter.
                </p>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

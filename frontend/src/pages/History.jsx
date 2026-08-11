import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  History as HistoryIcon, 
  Search, 
  Trash2, 
  Download, 
  Filter, 
  Calendar,
  Sparkles
} from 'lucide-react';
import { predictionService } from '../services/predictionService';
import { SentimentBadge } from '../components/common/SentimentBadge';
import { useNotification } from '../context/NotificationContext';

export const History = () => {
  const { addToast } = useNotification();
  const [historyItems, setHistoryItems] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterSentiment, setFilterSentiment] = useState('All');

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = () => {
    setHistoryItems(predictionService.getHistory());
  };

  const handleDelete = (id) => {
    const updated = predictionService.deleteHistoryItem(id);
    setHistoryItems(updated);
    addToast('Item removed from history', 'info');
  };

  const handleClearAll = () => {
    if (window.confirm('Are you sure you want to clear all prediction history?')) {
      predictionService.clearHistory();
      setHistoryItems([]);
      addToast('Prediction history cleared', 'info');
    }
  };

  const exportCSV = () => {
    if (historyItems.length === 0) return;
    let csv = 'ID,Product,Review,Sentiment,Confidence,Timestamp\n';
    historyItems.forEach((item) => {
      csv += `"${item.id}","${item.productName}","${item.reviewText.replace(/"/g, '""')}","${item.sentiment}",${item.confidence},"${item.timestamp}"\n`;
    });

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Prediction_History_${Date.now()}.csv`;
    a.click();
    addToast('History exported as CSV', 'success');
  };

  const filteredItems = historyItems.filter((item) => {
    const matchesSearch = 
      item.reviewText.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.productName.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesSentiment = 
      filterSentiment === 'All' || item.sentiment.toLowerCase() === filterSentiment.toLowerCase();

    return matchesSearch && matchesSentiment;
  });

  return (
    <div className="space-y-8 pb-12">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900 dark:text-white flex items-center gap-2">
            <HistoryIcon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            Prediction History Logs
          </h1>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            View, filter, export or manage all previous Flipkart review sentiment predictions
          </p>
        </div>

        <div className="flex gap-2">
          <button
            onClick={exportCSV}
            disabled={historyItems.length === 0}
            className="px-4 py-2 rounded-xl bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800 text-xs font-bold hover:bg-blue-100 disabled:opacity-50 transition-colors flex items-center gap-2"
          >
            <Download className="w-4 h-4" /> Export CSV
          </button>
          <button
            onClick={handleClearAll}
            disabled={historyItems.length === 0}
            className="px-4 py-2 rounded-xl bg-rose-50 dark:bg-rose-950 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-800 text-xs font-bold hover:bg-rose-100 disabled:opacity-50 transition-colors flex items-center gap-2"
          >
            <Trash2 className="w-4 h-4" /> Clear History
          </button>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-center bg-white dark:bg-gray-900 p-4 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm">
        
        {/* Search */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search past predictions..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-xs rounded-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500/50"
          />
        </div>

        {/* Sentiment Filter Tabs */}
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-gray-400" />
          {['All', 'Positive', 'Neutral', 'Negative'].map((st) => (
            <button
              key={st}
              onClick={() => setFilterSentiment(st)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                filterSentiment === st
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200'
              }`}
            >
              {st}
            </button>
          ))}
        </div>

      </div>

      {/* History Items List */}
      <div className="space-y-4">
        {filteredItems.length > 0 ? (
          filteredItems.map((item) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-5 rounded-3xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 shadow-sm space-y-3"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-gray-900 dark:text-white">{item.productName}</h3>
                  <span className="text-[11px] text-gray-400 flex items-center gap-1 mt-0.5 font-mono">
                    <Calendar className="w-3 h-3" /> {item.timestamp}
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <SentimentBadge sentiment={item.sentiment} confidence={item.confidence} size="md" />
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="p-1.5 rounded-lg text-gray-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed font-mono bg-gray-50 dark:bg-gray-800/40 p-3 rounded-xl">
                "{item.reviewText}"
              </p>

              {item.aspects && item.aspects.length > 0 && (
                <div className="flex flex-wrap gap-2 pt-1">
                  {item.aspects.map((asp, idx) => (
                    <span key={idx} className="px-2.5 py-0.5 rounded-md bg-gray-100 dark:bg-gray-800 text-[10px] font-semibold text-gray-600 dark:text-gray-400">
                      {typeof asp === 'string' ? asp : asp.name}
                    </span>
                  ))}
                </div>
              )}
            </motion.div>
          ))
        ) : (
          <div className="text-center py-16 bg-white dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-gray-800 text-gray-400 space-y-2">
            <HistoryIcon className="w-8 h-8 mx-auto text-gray-300 dark:text-gray-700" />
            <p className="text-sm font-semibold">No prediction logs found</p>
            <p className="text-xs">Run a sentiment analysis on the Predictor page to populate your history.</p>
          </div>
        )}
      </div>

    </div>
  );
};

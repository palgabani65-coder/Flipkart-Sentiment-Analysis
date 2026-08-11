import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sparkles, 
  FileText, 
  Upload, 
  CheckCircle, 
  ThumbsUp, 
  ThumbsDown, 
  BrainCircuit, 
  Layers,
  Download,
  AlertCircle,
  Copy,
  RefreshCw
} from 'lucide-react';
import { SentimentBadge } from '../components/common/SentimentBadge';
import { predictionService } from '../services/predictionService';
import { useNotification } from '../context/NotificationContext';

export const Predictor = () => {
  const { addToast } = useNotification();
  const [activeTab, setActiveTab] = useState('single'); // 'single' or 'batch'

  // Single review states
  const [productName, setProductName] = useState('');
  const [reviewText, setReviewText] = useState('');
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState(null);

  // Batch analysis states
  const [batchText, setBatchText] = useState('');
  const [batchAnalyzing, setBatchAnalyzing] = useState(false);
  const [batchResults, setBatchResults] = useState(null);

  const sampleReviews = [
    {
      label: 'Positive iPhone Review',
      text: 'The titanium finish feels incredible in hand! Camera zoom produces crystal clear shots even in pitch black settings. Battery life easily stretches beyond a full day.'
    },
    {
      label: 'Negative Delivery & Thermal Review',
      text: 'Extremely poor experience. The laptop battery drains within 1 hour and fan sounds like a turbine engine. Flipkart package arrived torn.'
    },
    {
      label: 'Neutral Audio Review',
      text: 'Sound quality is acceptable for the price. Earbuds fit comfortably, but active noise cancellation is mediocre.'
    }
  ];

  const handleSingleSubmit = async (e) => {
    e.preventDefault();
    if (!reviewText.trim()) {
      addToast('Please enter a review text.', 'warning');
      return;
    }

    try {
      setAnalyzing(true);
      const res = await predictionService.predictSingle(
        reviewText, 
        productName.trim() || 'Custom Flipkart Product'
      );
      setResult(res);
      addToast(`Analyzed successfully: ${res.sentiment} sentiment detected`, 'success');
    } catch (err) {
      addToast(err.message || 'Analysis failed', 'error');
    } finally {
      setAnalyzing(false);
    }
  };

  const handleBatchSubmit = async (e) => {
    e.preventDefault();
    if (!batchText.trim()) {
      addToast('Please enter review lines for batch analysis.', 'warning');
      return;
    }

    const lines = batchText
      .split('\n')
      .map((line) => line.trim())
      .filter((line) => line.length > 5);

    if (lines.length === 0) {
      addToast('No valid lines found. Each review should be on a separate line.', 'warning');
      return;
    }

    try {
      setBatchAnalyzing(true);
      const res = await predictionService.predictBatch(lines);
      setBatchResults(res);
      addToast(`Batch complete: Processed ${res.length} reviews`, 'success');
    } catch (err) {
      addToast('Batch prediction failed', 'error');
    } finally {
      setBatchAnalyzing(false);
    }
  };

  const exportBatchJSON = () => {
    if (!batchResults) return;
    const blob = new Blob([JSON.stringify(batchResults, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `FlipSentiment_Batch_Export_${Date.now()}.json`;
    a.click();
    addToast('Downloaded JSON report', 'success');
  };

  return (
    <div className="space-y-8 pb-12">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900 dark:text-white flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            AI Sentiment Predictor Studio
          </h1>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Perform deep learning NLP sentiment classification & aspect extraction on Flipkart reviews
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex rounded-2xl bg-gray-100 dark:bg-gray-800 p-1 self-start">
          <button
            onClick={() => setActiveTab('single')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === 'single'
                ? 'bg-white dark:bg-gray-900 text-blue-600 dark:text-blue-400 shadow-sm'
                : 'text-gray-500 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            <FileText className="w-3.5 h-3.5" /> Single Review
          </button>
          <button
            onClick={() => setActiveTab('batch')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === 'batch'
                ? 'bg-white dark:bg-gray-900 text-blue-600 dark:text-blue-400 shadow-sm'
                : 'text-gray-500 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            <Layers className="w-3.5 h-3.5" /> Batch / Bulk Mode
          </button>
        </div>
      </div>

      {/* SINGLE REVIEW TAB */}
      {activeTab === 'single' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Input Form (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            <div className="p-6 rounded-3xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 shadow-sm space-y-5">
              <h2 className="text-base font-bold text-gray-900 dark:text-white">Review Input Details</h2>

              <form onSubmit={handleSingleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                    Flipkart Product Name (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Apple iPhone 15 Pro, Sony Headphones..."
                    value={productName}
                    onChange={(e) => setProductName(e.target.value)}
                    className="w-full px-4 py-2.5 text-sm rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500/50"
                  />
                </div>

                <div>
                  <div className="flex justify-between items-center mb-1.5">
                    <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300">
                      Customer Review Text
                    </label>
                    <span className="text-[11px] text-gray-400 font-mono">
                      {reviewText.length} characters
                    </span>
                  </div>
                  <textarea
                    rows="6"
                    value={reviewText}
                    onChange={(e) => setReviewText(e.target.value)}
                    placeholder="Type or paste customer review text here..."
                    required
                    className="w-full p-4 text-sm rounded-2xl bg-gray-50 dark:bg-gray-800/60 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 outline-none resize-none transition-all"
                  />
                </div>

                {/* Pre-filled Sample Prompt Chips */}
                <div>
                  <span className="text-xs text-gray-400 font-medium block mb-2">Try Sample Reviews:</span>
                  <div className="flex flex-wrap gap-2">
                    {sampleReviews.map((sample, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => {
                          setReviewText(sample.text);
                          setProductName(sample.label.split(' ')[1] || 'Sample Product');
                        }}
                        className="px-3 py-1.5 rounded-xl bg-gray-100 dark:bg-gray-800 text-xs font-medium text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-blue-950 hover:text-blue-600 transition-colors"
                      >
                        + {sample.label}
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={analyzing || !reviewText.trim()}
                  className="w-full py-3.5 rounded-xl fk-gradient font-bold text-white text-sm shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
                >
                  {analyzing ? (
                    <RefreshCw className="w-5 h-5 animate-spin" />
                  ) : (
                    <>
                      <BrainCircuit className="w-5 h-5" />
                      Run Model Inference
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>

          {/* Right Results Display (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            {result ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-6 rounded-3xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 shadow-sm space-y-6"
              >
                <div className="flex items-center justify-between pb-4 border-b border-gray-100 dark:border-gray-800">
                  <div>
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Classification Result</span>
                    <h3 className="text-lg font-extrabold text-gray-900 dark:text-white mt-0.5">{result.productName}</h3>
                  </div>
                  <SentimentBadge sentiment={result.sentiment} confidence={result.confidence} size="lg" />
                </div>

                {/* Animated Confidence Gauge Bar */}
                <div className="space-y-2">
                  <div className="flex justify-between text-xs font-bold">
                    <span className="text-gray-500">Model Confidence</span>
                    <span className="text-blue-600 dark:text-blue-400 font-mono">{result.confidence}%</span>
                  </div>
                  <div className="w-full h-3 rounded-full bg-gray-100 dark:bg-gray-800 overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${result.confidence}%` }}
                      transition={{ duration: 0.8, ease: 'easeOut' }}
                      className={`h-full rounded-full ${
                        result.sentiment === 'Positive'
                          ? 'bg-emerald-500'
                          : result.sentiment === 'Negative'
                          ? 'bg-rose-500'
                          : 'bg-amber-500'
                      }`}
                    />
                  </div>
                </div>

                {/* Aspect Extraction Breakdown */}
                <div className="space-y-3">
                  <span className="text-xs font-bold text-gray-700 dark:text-gray-300 block">
                    Aspect-Based Sentiment Extraction:
                  </span>
                  <div className="space-y-2">
                    {result.aspects.map((asp, idx) => (
                      <div
                        key={idx}
                        className="p-3 rounded-xl bg-gray-50 dark:bg-gray-800/60 flex items-center justify-between"
                      >
                        <span className="text-xs font-semibold text-gray-800 dark:text-gray-200">
                          {asp.name}
                        </span>
                        <SentimentBadge sentiment={asp.sentiment} confidence={asp.score} size="sm" />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Text snippet view */}
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 text-xs text-gray-600 dark:text-gray-300 font-mono leading-relaxed border border-slate-200/50 dark:border-slate-700/50">
                  "{result.reviewText}"
                </div>
              </motion.div>
            ) : (
              <div className="p-12 rounded-3xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 shadow-sm flex flex-col items-center text-center justify-center space-y-3 text-gray-400 min-h-[380px]">
                <BrainCircuit className="w-12 h-12 stroke-[1.5] text-blue-500/40 animate-pulse" />
                <h3 className="font-bold text-sm text-gray-700 dark:text-gray-300">Awaiting Input</h3>
                <p className="text-xs max-w-xs">
                  Fill in review details on the left and click "Run Model Inference" to generate instant sentiment & aspect analysis.
                </p>
              </div>
            )}
          </div>

        </div>
      )}

      {/* BATCH ANALYSIS TAB */}
      {activeTab === 'batch' && (
        <div className="space-y-6">
          <div className="p-6 rounded-3xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 shadow-sm space-y-4">
            <div>
              <h2 className="text-base font-bold text-gray-900 dark:text-white">Batch Review Processing</h2>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                Paste multiple review texts (one review per line) for high-speed automated sentiment classification
              </p>
            </div>

            <form onSubmit={handleBatchSubmit} className="space-y-4">
              <textarea
                rows="8"
                value={batchText}
                onChange={(e) => setBatchText(e.target.value)}
                placeholder="Review 1: Camera is amazing and battery lasts long.&#10;Review 2: Overheating issue while gaming, worst purchase.&#10;Review 3: Packaging was torn, but product inside works fine..."
                className="w-full p-4 text-sm rounded-2xl bg-gray-50 dark:bg-gray-800/60 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white font-mono placeholder-gray-400 focus:ring-2 focus:ring-blue-500/50 outline-none resize-none"
              />

              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-400">
                  {batchText.split('\n').filter((l) => l.trim().length > 5).length} lines detected
                </span>

                <button
                  type="submit"
                  disabled={batchAnalyzing || !batchText.trim()}
                  className="px-6 py-2.5 rounded-xl fk-gradient font-bold text-white text-xs shadow-md disabled:opacity-50 transition-all flex items-center gap-2"
                >
                  {batchAnalyzing ? (
                    <RefreshCw className="w-4 h-4 animate-spin" />
                  ) : (
                    <>
                      <Layers className="w-4 h-4" />
                      Run Bulk Sentiment Analysis
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* Batch Results Table */}
          {batchResults && (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-6 rounded-3xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 shadow-sm space-y-4"
            >
              <div className="flex items-center justify-between pb-3 border-b border-gray-100 dark:border-gray-800">
                <h3 className="text-base font-bold text-gray-900 dark:text-white">Batch Analysis Output ({batchResults.length})</h3>
                <button
                  onClick={exportBatchJSON}
                  className="px-3 py-1.5 rounded-xl bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800 text-xs font-bold hover:bg-blue-100 transition-colors flex items-center gap-1.5"
                >
                  <Download className="w-3.5 h-3.5" /> Export JSON
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-gray-50 dark:bg-gray-800 text-gray-500 uppercase text-[10px] font-bold">
                    <tr>
                      <th className="p-3">#</th>
                      <th className="p-3">Review Snippet</th>
                      <th className="p-3">Predicted Sentiment</th>
                      <th className="p-3">Confidence</th>
                      <th className="p-3">Aspects Extracted</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                    {batchResults.map((item, idx) => (
                      <tr key={idx} className="hover:bg-gray-50/50 dark:hover:bg-gray-800/40">
                        <td className="p-3 font-mono text-gray-400">{idx + 1}</td>
                        <td className="p-3 text-gray-900 dark:text-gray-200 max-w-sm truncate">{item.reviewText}</td>
                        <td className="p-3">
                          <SentimentBadge sentiment={item.sentiment} size="sm" />
                        </td>
                        <td className="p-3 font-mono text-gray-700 dark:text-gray-300">{item.confidence}%</td>
                        <td className="p-3 text-gray-500">
                          {item.aspects?.map((a) => a.name).join(', ')}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          )}
        </div>
      )}

    </div>
  );
};

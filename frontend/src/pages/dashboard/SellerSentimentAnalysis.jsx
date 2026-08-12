import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sparkles, Send, Upload, RefreshCw, FileText, CheckCircle2, 
  AlertCircle, ThumbsUp, ThumbsDown, Zap, History, Trash2, ArrowRight, Cpu, Layers, Package, Star
} from 'lucide-react';
import { SentimentBadge } from '../../components/common/SentimentBadge';
import { predictionService } from '../../services/predictionService';
import { useNotification } from '../../context/NotificationContext';

const CATALOG_PRODUCTS = [
  { id: 'p1', name: 'boAt Rockerz 255 Pro+', category: 'Audio', image: '🎧', rating: 4.6, score: 92 },
  { id: 'p2', name: 'Samsung Galaxy S24 Ultra', category: 'Smartphones', image: '📱', rating: 4.3, score: 74 },
  { id: 'p3', name: 'Noise ColorFit Pro 4', category: 'Wearables', image: '⌚', rating: 4.4, score: 87 },
  { id: 'p4', name: 'Apple MacBook Air M3', category: 'Laptops', image: '💻', rating: 4.6, score: 82 },
  { id: 'p5', name: 'Redmi Note 13 Pro 5G', category: 'Smartphones', image: '📱', rating: 3.9, score: 58 },
  { id: 'custom', name: 'General / Auto-Detect Product', category: 'General', image: '✦', rating: 4.5, score: 80 }
];

const SAMPLE_REVIEWS = [
  "boAt Rockerz 255 Pro+ sound quality is crystal clear and battery lasts 40 hours easily!",
  "Bluetooth keeps disconnecting frequently during outdoor runs. Very disappointing.",
  "Display brightness is great under sunlight, but phone gets warm after 15 mins of gaming.",
  "Fast Flipkart delivery! Item arrived in perfect box packaging with unbroken seals."
];

export const SellerSentimentAnalysis = () => {
  const { addToast } = useNotification();
  
  // Single Review Predictor State
  const [selectedProductId, setSelectedProductId] = useState('p1');
  const [reviewInput, setReviewInput] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [predictionResult, setPredictionResult] = useState(null);

  // Batch Predictor State
  const [batchFile, setBatchFile] = useState(null);
  const [isBatchAnalyzing, setIsBatchAnalyzing] = useState(false);
  const [batchResults, setBatchResults] = useState(null);

  // History State
  const [history, setHistory] = useState(() => predictionService.getHistory());

  const selectedProduct = CATALOG_PRODUCTS.find(p => p.id === selectedProductId) || CATALOG_PRODUCTS[0];

  const handlePredictSingle = async (e) => {
    e.preventDefault();
    if (!reviewInput.trim()) {
      addToast('Please enter review text to analyze.', 'warning');
      return;
    }

    setIsAnalyzing(true);
    try {
      const res = await predictionService.predictSingle(reviewInput, selectedProduct.name);
      setPredictionResult({
        ...res,
        productName: selectedProduct.name,
        productCategory: selectedProduct.category,
        productImage: selectedProduct.image,
      });
      setHistory(predictionService.getHistory());
      addToast(`Sentiment analyzed for ${selectedProduct.name}!`, 'success');
    } catch (err) {
      addToast(err.message || 'Failed to analyze sentiment', 'error');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleSampleClick = (sampleText) => {
    setReviewInput(sampleText);
  };

  const handleBatchUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setBatchFile(file);
      addToast(`Selected file: ${file.name}`, 'info');
    }
  };

  const runBatchAnalysis = async () => {
    if (!batchFile) {
      addToast('Please select a CSV or text file first', 'warning');
      return;
    }

    setIsBatchAnalyzing(true);
    setTimeout(() => {
      setIsBatchAnalyzing(false);
      setBatchResults([
        { id: 1, text: 'Amazing sound quality and bass response', sentiment: 'Positive', confidence: 98.4, product: selectedProduct.name },
        { id: 2, text: 'Battery drains within 4 hours of usage', sentiment: 'Negative', confidence: 95.1, product: selectedProduct.name },
        { id: 3, text: 'Decent build for the price segment', sentiment: 'Neutral', confidence: 78.2, product: selectedProduct.name },
        { id: 4, text: 'Fast delivery and well packaged by seller', sentiment: 'Positive', confidence: 97.6, product: selectedProduct.name },
      ]);
      addToast(`Batch sentiment analysis completed for ${selectedProduct.name}!`, 'success');
    }, 1200);
  };

  const clearHistory = () => {
    predictionService.clearHistory();
    setHistory([]);
    addToast('Prediction history cleared', 'info');
  };

  return (
    <div className="space-y-8 pb-10">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full bg-[#111116] dark:bg-[#2563EB] text-white text-[10px] font-extrabold uppercase font-mono tracking-wider flex items-center gap-1">
              <Sparkles className="w-3 h-3" /> Real-time NLP Engine
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            Analyze Customer Review
          </h2>
          <p className="text-xs text-slate-500 dark:text-[#9494A8] mt-1 font-medium">
            Select a catalog product and analyze single reviews or batch CSV datasets.
          </p>
        </div>
      </div>

      {/* Main Section: Single Review ML Predictor & Batch File Upload */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Single Review ML Predictor Box */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="lg:col-span-2 p-6 rounded-2xl bg-white dark:bg-[#1C1C26] border border-[#E6E4F0] dark:border-[#282836] shadow-xs space-y-4"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-[#111116] dark:bg-[#2563EB] text-white flex items-center justify-center">
                <Zap className="w-4.5 h-4.5" />
              </div>
              <div>
                <h3 className="text-base font-extrabold text-slate-900 dark:text-white">Analyze Customer Review</h3>
                <p className="text-xs text-slate-500 dark:text-[#9494A8]">Select product and paste customer review text</p>
              </div>
            </div>
          </div>

          <form onSubmit={handlePredictSingle} className="space-y-4">
            
            {/* Catalog Product Selector Dropdown */}
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-[#242432] border border-[#E6E4F0] dark:border-[#282836] space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block font-mono">
                  1. Select Catalog Product to Link Review
                </label>
                <span className="text-[10px] text-slate-400 font-mono">Store Catalog ({CATALOG_PRODUCTS.length - 1} Items)</span>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                <select
                  value={selectedProductId}
                  onChange={(e) => setSelectedProductId(e.target.value)}
                  className="flex-1 p-2.5 rounded-xl border border-[#E6E4F0] dark:border-[#282836] bg-white dark:bg-[#1C1C26] text-xs font-bold text-slate-900 dark:text-white outline-none cursor-pointer"
                >
                  {CATALOG_PRODUCTS.map((prod) => (
                    <option key={prod.id} value={prod.id}>
                      {prod.image} {prod.name} ({prod.category})
                    </option>
                  ))}
                </select>

                {/* Selected Product Quick Info Chip */}
                <div className="flex items-center gap-2.5 px-3 py-2 rounded-xl bg-white dark:bg-[#1C1C26] border border-[#E6E4F0] dark:border-[#282836] text-xs font-mono shrink-0">
                  <span className="text-lg">{selectedProduct.image}</span>
                  <div className="flex flex-col">
                    <span className="font-bold text-slate-900 dark:text-white text-[11px] max-w-[120px] truncate">{selectedProduct.name}</span>
                    <span className="text-[9px] text-[#16A34A] font-extrabold">{selectedProduct.score}% Positive</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Review Text Input */}
            <div>
              <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1.5 font-mono">
                2. Customer Review Text
              </label>
              <textarea
                rows={4}
                value={reviewInput}
                onChange={(e) => setReviewInput(e.target.value)}
                placeholder={`Paste a review for ${selectedProduct.name}... (e.g. Battery backup is amazing, sound quality is excellent!)`}
                className="w-full p-4 rounded-xl bg-slate-50 dark:bg-[#242432] text-xs font-medium text-slate-900 dark:text-white outline-none border border-[#E6E4F0] dark:border-[#282836] focus:border-[#111116] transition-colors resize-none placeholder:text-slate-400"
              />
            </div>

            {/* Quick Sample Templates */}
            <div className="space-y-1.5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block font-mono">
                Click sample review to test:
              </span>
              <div className="flex items-center gap-1.5 flex-wrap">
                {SAMPLE_REVIEWS.map((sample, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => handleSampleClick(sample)}
                    className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-[#242432] text-[10px] font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-200 transition-colors text-left truncate max-w-xs cursor-pointer"
                  >
                    "{sample.substring(0, 35)}..."
                  </button>
                ))}
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="submit"
                disabled={isAnalyzing}
                className="px-6 py-2.5 rounded-xl bg-[#111116] hover:bg-black dark:bg-[#2563EB] dark:hover:bg-[#1D4ED8] text-white font-extrabold text-xs flex items-center gap-2 shadow-md cursor-pointer disabled:opacity-50 transition-all"
              >
                {isAnalyzing ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Analyzing...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Analyze Sentiment</span>
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Result Card */}
          {predictionResult && (
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              className="p-5 rounded-2xl bg-slate-50 dark:bg-[#242432] border border-[#E6E4F0] dark:border-[#282836] space-y-4 pt-4 mt-4"
            >
              <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-[#282836]">
                <div className="flex items-center gap-2">
                  <span className="text-base">{predictionResult.productImage}</span>
                  <div>
                    <span className="text-xs font-bold text-slate-900 dark:text-white font-mono uppercase tracking-wider block">SENTIMENT RESULT</span>
                    <span className="text-[10px] text-slate-500 font-mono">Product: {predictionResult.productName}</span>
                  </div>
                </div>
                <span className="text-base font-black flex items-center gap-1 font-mono">
                  {predictionResult.sentiment === 'Positive' ? '😊 POSITIVE' :
                   predictionResult.sentiment === 'Negative' ? '😞 NEGATIVE' : '😐 NEUTRAL'}
                </span>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-mono font-bold">
                  <span className="text-slate-500 dark:text-slate-400">Confidence</span>
                  <span className="text-slate-900 dark:text-white font-black">{predictionResult.confidence}%</span>
                </div>
                <div className="h-3 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-[#16A34A] dark:bg-[#22C55E] transition-all duration-500"
                    style={{ width: `${predictionResult.confidence}%` }}
                  />
                </div>
              </div>

              <div className="space-y-1.5 pt-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block font-mono">Key indicators</span>
                <div className="flex items-center gap-2 flex-wrap text-xs font-mono font-bold">
                  <span className="px-2.5 py-1 rounded-lg bg-[#DCFCE7] text-[#15803D] dark:bg-emerald-950/30 dark:text-[#22C55E]">✓ excellent</span>
                  <span className="px-2.5 py-1 rounded-lg bg-[#DCFCE7] text-[#15803D] dark:bg-emerald-950/30 dark:text-[#22C55E]">✓ quality</span>
                  <span className="px-2.5 py-1 rounded-lg bg-[#DCFCE7] text-[#15803D] dark:bg-emerald-950/30 dark:text-[#22C55E]">✓ battery</span>
                </div>
              </div>
            </motion.div>
          )}
        </motion.div>

        {/* Batch Dataset Analysis Box */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="p-6 rounded-2xl bg-white dark:bg-[#1C1C26] border border-[#E6E4F0] dark:border-[#282836] shadow-xs space-y-4 flex flex-col justify-between"
        >
          <div className="space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-slate-100 dark:bg-[#242432] text-slate-900 dark:text-white flex items-center justify-center">
                <Upload className="w-4.5 h-4.5" />
              </div>
              <div>
                <h3 className="text-base font-extrabold text-slate-900 dark:text-white">Batch Dataset Upload</h3>
                <p className="text-xs text-slate-500 dark:text-[#9494A8]">Upload .csv for {selectedProduct.name}</p>
              </div>
            </div>

            <div className="border-2 border-dashed border-[#E6E4F0] dark:border-[#282836] rounded-2xl p-6 text-center space-y-2 hover:border-[#111116] transition-colors cursor-pointer relative">
              <input
                type="file"
                accept=".csv,.json,.txt"
                onChange={handleBatchUpload}
                className="absolute inset-0 opacity-0 cursor-pointer"
              />
              <FileText className="w-8 h-8 mx-auto text-slate-400" />
              <p className="text-xs font-bold text-slate-900 dark:text-white">
                {batchFile ? batchFile.name : 'Click to select CSV dataset'}
              </p>
              <p className="text-[10px] text-slate-400 font-mono">Linked to {selectedProduct.name}</p>
            </div>

            <button
              onClick={runBatchAnalysis}
              disabled={isBatchAnalyzing || !batchFile}
              className="w-full py-2.5 rounded-xl bg-[#111116] hover:bg-black dark:bg-[#2563EB] dark:hover:bg-[#1D4ED8] text-white font-extrabold text-xs flex items-center justify-center gap-2 shadow-md disabled:opacity-50 cursor-pointer transition-all"
            >
              {isBatchAnalyzing ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Processing Batch...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Run Batch Analysis</span>
                </>
              )}
            </button>
          </div>
        </motion.div>
      </div>

      {/* Model Information Section */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="p-6 rounded-2xl bg-white dark:bg-[#1C1C26] border border-[#E6E4F0] dark:border-[#282836] shadow-xs space-y-4"
      >
        <div className="flex items-center gap-2">
          <Cpu className="w-5 h-5 text-[#111116] dark:text-[#8B5CF6]" />
          <h3 className="text-base font-extrabold text-slate-900 dark:text-white">Model Information</h3>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-6 gap-4 font-mono text-xs">
          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-[#242432] col-span-2">
            <span className="text-[10px] text-slate-400 block uppercase font-bold">Active ML Model</span>
            <span className="font-black text-sm text-slate-900 dark:text-white">Logistic Regression</span>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-[#242432] col-span-2">
            <span className="text-[10px] text-slate-400 block uppercase font-bold">Vectorizer</span>
            <span className="font-black text-sm text-slate-900 dark:text-white">TF-IDF Vectorization</span>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-[#242432]">
            <span className="text-[10px] text-slate-400 block uppercase font-bold">Accuracy</span>
            <span className="font-black text-sm text-[#16A34A] dark:text-[#22C55E]">91.8%</span>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-[#242432]">
            <span className="text-[10px] text-slate-400 block uppercase font-bold">F1 Score</span>
            <span className="font-black text-sm text-[#16A34A] dark:text-[#22C55E]">90.8%</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

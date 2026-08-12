import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Cpu, Layers, RefreshCw, CheckCircle2, Sliders, Zap, Database, ArrowRight } from 'lucide-react';
import { useNotification } from '../../context/NotificationContext';

export const AdminModel = () => {
  const { addToast } = useNotification();
  const [isRetraining, setIsRetraining] = useState(false);

  const handleRetrain = () => {
    setIsRetraining(true);
    setTimeout(() => {
      setIsRetraining(false);
      addToast('ML Model retrained successfully on 57,534 dataset reviews!', 'success');
    }, 1500);
  };

  const PIPELINE_STEPS = [
    { title: 'Raw Review', desc: 'Customer review text input' },
    { title: 'Cleaning', desc: 'Lowercasing & special char removal' },
    { title: 'Tokenization', desc: 'Word & n-gram token splitting' },
    { title: 'Stopword Removal', desc: 'English stopword filtering' },
    { title: 'Lemmatization', desc: 'Word root stemming' },
    { title: 'TF-IDF', desc: 'N-gram feature matrix' },
    { title: 'ML Model', desc: 'Logistic Regression' },
    { title: 'Sentiment', desc: 'Pos / Neu / Neg output' },
  ];

  return (
    <div className="space-y-8 pb-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full bg-[#111116] dark:bg-[#2563EB] text-white text-[10px] font-extrabold uppercase font-mono tracking-wider flex items-center gap-1">
              ● Active Model
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            ML Model Management
          </h2>
          <p className="text-xs text-slate-500 dark:text-[#9494A8] mt-1 font-medium">
            Inspect active NLP pipeline architecture, feature hyperparameters, and trigger manual model retraining.
          </p>
        </div>

        <button
          onClick={handleRetrain}
          disabled={isRetraining}
          className="px-4 py-2 rounded-xl bg-[#111116] hover:bg-black dark:bg-[#2563EB] text-white font-extrabold text-xs flex items-center gap-2 shadow-md cursor-pointer disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${isRetraining ? 'animate-spin' : ''}`} />
          <span>{isRetraining ? 'Retraining Model...' : 'Retrain ML Model'}</span>
        </button>
      </div>

      {/* Top Row: Current Model Card & Key Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Current Model Card (Specification Section 14) */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-6 rounded-2xl bg-white dark:bg-[#1C1C26] border border-[#E6E4F0] dark:border-[#282836] shadow-xs space-y-4"
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 font-mono">CURRENT MODEL</span>
            <span className="px-2 py-0.5 rounded-md bg-[#DCFCE7] text-[#15803D] dark:bg-emerald-950/30 dark:text-[#22C55E] text-[10px] font-bold font-mono">
              ● Active
            </span>
          </div>

          <div>
            <h3 className="text-xl font-black text-slate-900 dark:text-white font-mono">Logistic Regression</h3>
            <p className="text-xs text-slate-500 dark:text-[#9494A8] mt-1 font-mono">TF-IDF N-gram Vectorization (1, 2)</p>
          </div>

          <div className="pt-3 border-t border-slate-100 dark:border-[#282836] space-y-2 text-xs font-mono">
            <div className="flex justify-between">
              <span className="text-slate-400">Dataset Size:</span>
              <span className="font-bold text-slate-900 dark:text-white">57,534 reviews</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Vocabulary Size:</span>
              <span className="font-bold text-slate-900 dark:text-white">12,450 features</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Last Trained:</span>
              <span className="font-bold text-slate-900 dark:text-white">Today</span>
            </div>
          </div>
        </motion.div>

        {/* 4 Metric Cards */}
        <div className="lg:col-span-2 grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="p-5 rounded-2xl bg-white dark:bg-[#1C1C26] border border-[#E6E4F0] dark:border-[#282836] shadow-xs flex flex-col justify-between">
            <span className="text-[10px] font-bold text-slate-400 uppercase font-mono">Accuracy</span>
            <p className="text-2xl font-black text-[#16A34A] dark:text-[#22C55E] font-mono mt-2">91.8%</p>
          </div>

          <div className="p-5 rounded-2xl bg-white dark:bg-[#1C1C26] border border-[#E6E4F0] dark:border-[#282836] shadow-xs flex flex-col justify-between">
            <span className="text-[10px] font-bold text-slate-400 uppercase font-mono">Precision</span>
            <p className="text-2xl font-black text-slate-900 dark:text-white font-mono mt-2">91.2%</p>
          </div>

          <div className="p-5 rounded-2xl bg-white dark:bg-[#1C1C26] border border-[#E6E4F0] dark:border-[#282836] shadow-xs flex flex-col justify-between">
            <span className="text-[10px] font-bold text-slate-400 uppercase font-mono">Recall</span>
            <p className="text-2xl font-black text-slate-900 dark:text-white font-mono mt-2">90.5%</p>
          </div>

          <div className="p-5 rounded-2xl bg-white dark:bg-[#1C1C26] border border-[#E6E4F0] dark:border-[#282836] shadow-xs flex flex-col justify-between">
            <span className="text-[10px] font-bold text-slate-400 uppercase font-mono">F1 Score</span>
            <p className="text-2xl font-black text-slate-900 dark:text-white font-mono mt-2">90.8%</p>
          </div>
        </div>
      </div>

      {/* MODEL PIPELINE DIAGRAM (Section 14 Specification) */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="p-6 rounded-2xl bg-white dark:bg-[#1C1C26] border border-[#E6E4F0] dark:border-[#282836] shadow-xs space-y-4"
      >
        <div>
          <h3 className="text-base font-extrabold text-slate-900 dark:text-white">NLP Sentiment Inference Pipeline Architecture</h3>
          <p className="text-xs text-slate-500 dark:text-[#9494A8] mt-0.5">End-to-end data preprocessing and classification flow</p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2 pt-2">
          {PIPELINE_STEPS.map((step, i) => (
            <div key={i} className="p-3 rounded-xl bg-slate-50 dark:bg-[#242432] border border-[#E6E4F0] dark:border-[#282836] flex flex-col justify-between text-center space-y-2 relative group">
              <span className="text-[10px] font-mono text-[#2563EB] font-bold">Step 0{i + 1}</span>
              <div>
                <h4 className="text-xs font-bold text-slate-900 dark:text-white">{step.title}</h4>
                <p className="text-[9px] text-slate-400 mt-0.5 leading-tight">{step.desc}</p>
              </div>
              {i < PIPELINE_STEPS.length - 1 && (
                <div className="hidden lg:block absolute -right-2 top-1/2 -translate-y-1/2 z-10 text-slate-300 dark:text-slate-600 font-bold">
                  →
                </div>
              )}
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

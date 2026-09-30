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
    <div className="space-y-8 pb-10 font-sans text-[#191C1D] dark:text-white transition-colors">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full bg-[#000000] dark:bg-white text-white dark:text-black text-[10px] font-semibold uppercase font-mono tracking-wider flex items-center gap-1 shadow-xs">
              ● Active Model
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-[#191C1D] dark:text-white tracking-tight font-sans">
            ML Model Management
          </h2>
          <p className="text-xs text-[#5C5F62] dark:text-[#A0A4A8] mt-1 font-mono">
            Inspect active NLP pipeline architecture, feature hyperparameters, and trigger manual model retraining.
          </p>
        </div>

        <button
          onClick={handleRetrain}
          disabled={isRetraining}
          className="px-4 py-2.5 rounded-lg bg-[#000000] dark:bg-white hover:bg-[#1B1B1B] dark:hover:bg-slate-100 text-white dark:text-black font-semibold font-mono text-xs flex items-center gap-2 shadow-xs transition-colors cursor-pointer disabled:opacity-50"
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
          className="p-6 rounded-2xl bg-white dark:bg-[#191C1D] border border-[#E5E7EB] dark:border-[#2E3132] shadow-[0_4px_20px_rgba(0,0,0,0.04)] dark:shadow-none space-y-4 font-sans"
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-[#5C5F62] dark:text-[#A0A4A8] font-mono">CURRENT MODEL</span>
            <span className="px-2.5 py-0.5 rounded-md bg-[#F3F4F5] dark:bg-[#242729] border border-[#E5E7EB] dark:border-[#33373B] text-[#000000] dark:text-white text-[10px] font-semibold font-mono">
              ● Active
            </span>
          </div>

          <div>
            <h3 className="text-xl font-bold text-[#191C1D] dark:text-white font-sans">Logistic Regression</h3>
            <p className="text-xs text-[#5C5F62] dark:text-[#A0A4A8] mt-1 font-mono">TF-IDF N-gram Vectorization (1, 2)</p>
          </div>

          <div className="pt-3 border-t border-[#E5E7EB] dark:border-[#2E3132] space-y-2 text-xs font-mono">
            <div className="flex justify-between">
              <span className="text-[#5C5F62] dark:text-[#A0A4A8]">Dataset Size:</span>
              <span className="font-semibold text-[#191C1D] dark:text-white">57,534 reviews</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#5C5F62] dark:text-[#A0A4A8]">Vocabulary Size:</span>
              <span className="font-semibold text-[#191C1D] dark:text-white">12,450 features</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#5C5F62] dark:text-[#A0A4A8]">Last Trained:</span>
              <span className="font-semibold text-[#191C1D] dark:text-white">Today</span>
            </div>
          </div>
        </motion.div>

        {/* 4 Metric Cards */}
        <div className="lg:col-span-2 grid grid-cols-2 sm:grid-cols-4 gap-4 font-mono">
          <div className="p-5 rounded-2xl bg-white dark:bg-[#191C1D] border border-[#E5E7EB] dark:border-[#2E3132] shadow-[0_4px_20px_rgba(0,0,0,0.04)] dark:shadow-none flex flex-col justify-between">
            <span className="text-[10px] font-medium text-[#5C5F62] dark:text-[#A0A4A8] uppercase">Accuracy</span>
            <p className="text-2xl font-bold text-[#000000] dark:text-white mt-2">91.8%</p>
          </div>

          <div className="p-5 rounded-2xl bg-white dark:bg-[#191C1D] border border-[#E5E7EB] dark:border-[#2E3132] shadow-[0_4px_20px_rgba(0,0,0,0.04)] dark:shadow-none flex flex-col justify-between">
            <span className="text-[10px] font-medium text-[#5C5F62] dark:text-[#A0A4A8] uppercase">Precision</span>
            <p className="text-2xl font-bold text-[#191C1D] dark:text-white mt-2">91.2%</p>
          </div>

          <div className="p-5 rounded-2xl bg-white dark:bg-[#191C1D] border border-[#E5E7EB] dark:border-[#2E3132] shadow-[0_4px_20px_rgba(0,0,0,0.04)] dark:shadow-none flex flex-col justify-between">
            <span className="text-[10px] font-medium text-[#5C5F62] dark:text-[#A0A4A8] uppercase">Recall</span>
            <p className="text-2xl font-bold text-[#191C1D] dark:text-white mt-2">90.5%</p>
          </div>

          <div className="p-5 rounded-2xl bg-white dark:bg-[#191C1D] border border-[#E5E7EB] dark:border-[#2E3132] shadow-[0_4px_20px_rgba(0,0,0,0.04)] dark:shadow-none flex flex-col justify-between">
            <span className="text-[10px] font-medium text-[#5C5F62] dark:text-[#A0A4A8] uppercase">F1 Score</span>
            <p className="text-2xl font-bold text-[#191C1D] dark:text-white mt-2">90.8%</p>
          </div>
        </div>
      </div>

      {/* MODEL PIPELINE DIAGRAM (Section 14 Specification) */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="p-6 rounded-2xl bg-white dark:bg-[#191C1D] border border-[#E5E7EB] dark:border-[#2E3132] shadow-[0_4px_20px_rgba(0,0,0,0.04)] dark:shadow-none space-y-4 font-sans"
      >
        <div>
          <h3 className="text-base font-bold text-[#191C1D] dark:text-white font-sans">NLP Sentiment Inference Pipeline Architecture</h3>
          <p className="text-xs text-[#5C5F62] dark:text-[#A0A4A8] mt-0.5 font-mono">End-to-end data preprocessing and classification flow</p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2 pt-2">
          {PIPELINE_STEPS.map((step, i) => (
            <div key={i} className="p-3 rounded-xl bg-[#F8F9FA] dark:bg-[#242729] border border-[#E5E7EB] dark:border-[#33373B] flex flex-col justify-between text-center space-y-2 relative group">
              <span className="text-[10px] font-mono text-[#000000] dark:text-white font-bold">Step 0{i + 1}</span>
              <div>
                <h4 className="text-xs font-semibold text-[#191C1D] dark:text-white font-sans">{step.title}</h4>
                <p className="text-[9px] text-[#5C5F62] dark:text-[#A0A4A8] mt-0.5 leading-tight font-sans">{step.desc}</p>
              </div>
              {i < PIPELINE_STEPS.length - 1 && (
                <div className="hidden lg:block absolute -right-2 top-1/2 -translate-y-1/2 z-10 text-[#5C5F62] dark:text-[#A0A4A8] font-bold">
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

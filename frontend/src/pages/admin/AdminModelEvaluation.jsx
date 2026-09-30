import React from 'react';
import { motion } from 'framer-motion';
import { BarChart3, CheckCircle2, Cpu, FileText, Layers, Award } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const MODEL_COMPARISON = [
  { name: 'Naive Bayes', accuracy: 86.4, precision: 85.2, recall: 84.8, f1: 85.0, status: 'Evaluated' },
  { name: 'Logistic Regression', accuracy: 91.8, precision: 91.2, recall: 90.5, f1: 90.8, status: 'Active Selected' },
  { name: 'Random Forest', accuracy: 89.6, precision: 89.1, recall: 88.4, f1: 88.7, status: 'Evaluated' },
  { name: 'Support Vector Classifier (SVC)', accuracy: 90.4, precision: 89.8, recall: 89.2, f1: 89.5, status: 'Evaluated' },
];

const CONFUSION_MATRIX = [
  { actual: 'Positive', predPos: 31250, predNeu: 940, predNeg: 464 },
  { actual: 'Neutral', predPos: 1120, predNeu: 8450, predNeg: 557 },
  { actual: 'Negative', predPos: 680, predNeu: 890, predNeg: 13183 },
];

import { useTheme } from '../../context/ThemeContext';

const ChartTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="px-3.5 py-2.5 rounded-xl bg-white dark:bg-[#191C1D] text-[#191C1D] dark:text-white text-xs shadow-2xl border border-[#E5E7EB] dark:border-[#33373B] font-mono space-y-1.5 min-w-[140px]">
        <p className="font-bold text-[#191C1D] dark:text-white pb-1 border-b border-[#E5E7EB] dark:border-[#2E3132]">{label}</p>
        {payload.map((p) => {
          const color = p.color || p.fill;
          const isBlack = color === '#000000';
          const isWhite = color === '#FFFFFF';
          return (
            <div key={p.dataKey} className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <div 
                  className={`w-2.5 h-2.5 rounded-full shrink-0 ${
                    isBlack 
                      ? 'bg-[#000000] border border-black/20 ring-1 ring-black/10' 
                      : isWhite 
                        ? 'bg-white border border-slate-300' 
                        : 'border border-slate-300 dark:border-slate-600'
                  }`} 
                  style={{ backgroundColor: color }} 
                />
                <span className="capitalize text-[#5C5F62] dark:text-[#A0A4A8]">{p.name || p.dataKey}:</span>
              </div>
              <span className="font-bold text-[#191C1D] dark:text-white">{p.value}%</span>
            </div>
          );
        })}
      </div>
    );
  }
  return null;
};

export const AdminModelEvaluation = () => {
  const { isDarkMode } = useTheme();

  return (
    <div className="space-y-8 pb-10 font-sans text-[#191C1D] dark:text-white transition-colors">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <span className="px-2.5 py-0.5 rounded-full bg-[#000000] dark:bg-white text-white dark:text-black text-[10px] font-semibold uppercase font-mono tracking-wider flex items-center gap-1 shadow-xs">
            ✦ ML Evaluation Audit
          </span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold text-[#191C1D] dark:text-white tracking-tight font-sans">
          Machine Learning Model Evaluation
        </h2>
        <p className="text-xs text-[#5C5F62] dark:text-[#A0A4A8] mt-1 font-mono">
          Benchmark comparison across ML classification algorithms, TF-IDF vectorization performance, and confusion matrices.
        </p>
      </div>

      {/* Model Comparison Table (Section 15 Specification) */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-6 rounded-2xl bg-white dark:bg-[#191C1D] border border-[#E5E7EB] dark:border-[#2E3132] shadow-[0_4px_20px_rgba(0,0,0,0.04)] dark:shadow-none space-y-4 font-sans"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-[#000000] dark:text-white" />
            <h3 className="text-base font-bold text-[#191C1D] dark:text-white font-sans">ML Algorithm Benchmark Comparison</h3>
          </div>
          <span className="text-xs font-mono font-semibold text-[#000000] dark:text-white">Primary: Logistic Regression (91.8%)</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left font-mono text-xs">
            <thead>
              <tr className="border-b border-[#E5E7EB] dark:border-[#2E3132] bg-[#F8F9FA] dark:bg-[#242729]">
                <th className="py-3 px-4 font-semibold uppercase tracking-wider text-[#5C5F62] dark:text-[#A0A4A8]">Model Algorithm</th>
                <th className="py-3 px-4 font-semibold uppercase tracking-wider text-[#5C5F62] dark:text-[#A0A4A8]">Accuracy</th>
                <th className="py-3 px-4 font-semibold uppercase tracking-wider text-[#5C5F62] dark:text-[#A0A4A8]">Precision</th>
                <th className="py-3 px-4 font-semibold uppercase tracking-wider text-[#5C5F62] dark:text-[#A0A4A8]">Recall</th>
                <th className="py-3 px-4 font-semibold uppercase tracking-wider text-[#5C5F62] dark:text-[#A0A4A8]">F1 Score</th>
                <th className="py-3 px-4 font-semibold uppercase tracking-wider text-[#5C5F62] dark:text-[#A0A4A8] text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5E7EB] dark:divide-[#2E3132]">
              {MODEL_COMPARISON.map((m) => (
                <tr key={m.name} className={`hover:bg-[#F8F9FA] dark:hover:bg-[#242729] transition-colors ${m.status.includes('Active') ? 'bg-[#F8F9FA] dark:bg-[#242729]' : ''}`}>
                  <td className="py-3.5 px-4 font-bold text-[#191C1D] dark:text-white font-sans">{m.name}</td>
                  <td className="py-3.5 px-4 font-bold text-[#000000] dark:text-white">{m.accuracy}%</td>
                  <td className="py-3.5 px-4 font-medium text-[#191C1D] dark:text-slate-200">{m.precision}%</td>
                  <td className="py-3.5 px-4 font-medium text-[#191C1D] dark:text-slate-200">{m.recall}%</td>
                  <td className="py-3.5 px-4 font-bold text-[#191C1D] dark:text-white">{m.f1}%</td>
                  <td className="py-3.5 px-4 text-right">
                    <span className={`px-2.5 py-1 rounded-md text-[10px] font-semibold font-mono ${
                      m.status.includes('Active')
                        ? 'bg-[#000000] text-white dark:bg-white dark:text-black shadow-xs'
                        : 'bg-[#F3F4F5] dark:bg-[#242729] border border-[#E5E7EB] dark:border-[#33373B] text-[#5C5F62] dark:text-[#A0A4A8]'
                    }`}>
                      {m.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Model Performance Comparison Bar Chart & Confusion Matrix Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Model Performance Comparison Bar Chart */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="p-6 rounded-2xl bg-white dark:bg-[#191C1D] border border-[#E5E7EB] dark:border-[#2E3132] shadow-[0_4px_20px_rgba(0,0,0,0.04)] dark:shadow-none space-y-4 font-sans"
        >
          <div>
            <h3 className="text-base font-bold text-[#191C1D] dark:text-white font-sans">Algorithm Accuracy & F1 Comparison</h3>
            <p className="text-xs text-[#5C5F62] dark:text-[#A0A4A8] font-mono">Visual metric comparison across models</p>
          </div>

          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={MODEL_COMPARISON}>
                <CartesianGrid strokeDasharray="3 3" stroke={isDarkMode ? '#2E3132' : '#F0F1F3'} vertical={false} />
                <XAxis dataKey="name" stroke={isDarkMode ? '#A0A4A8' : '#94A3B8'} fontSize={9} tickLine={false} axisLine={false} />
                <YAxis stroke={isDarkMode ? '#A0A4A8' : '#94A3B8'} fontSize={10} tickLine={false} axisLine={false} domain={[75, 100]} />
                <Tooltip content={<ChartTooltip />} cursor={{ fill: isDarkMode ? 'rgba(255, 255, 255, 0.04)' : 'rgba(0, 0, 0, 0.03)', radius: 6 }} />
                <Legend wrapperStyle={{ fontSize: '11px', fontWeight: 600 }} iconType="circle" />
                <Bar dataKey="accuracy" name="Accuracy %" fill={isDarkMode ? '#FFFFFF' : '#000000'} radius={[4, 4, 0, 0]} />
                <Bar dataKey="f1" name="F1 Score %" fill={isDarkMode ? '#64748B' : '#7E7576'} radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Confusion Matrix (3x3 Grid Specification Section 15) */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="p-6 rounded-2xl bg-white dark:bg-[#191C1D] border border-[#E5E7EB] dark:border-[#2E3132] shadow-[0_4px_20px_rgba(0,0,0,0.04)] dark:shadow-none space-y-4 flex flex-col justify-between font-sans"
        >
          <div>
            <h3 className="text-base font-bold text-[#191C1D] dark:text-white font-sans">Logistic Regression Confusion Matrix</h3>
            <p className="text-xs text-[#5C5F62] dark:text-[#A0A4A8] font-mono">Predicted vs Actual review counts across dataset</p>
          </div>

          <div className="p-4 rounded-xl bg-[#F8F9FA] dark:bg-[#242729] border border-[#E5E7EB] dark:border-[#33373B] font-mono">
            <div className="grid grid-cols-4 gap-2 text-center text-xs">
              <div className="font-semibold text-[#5C5F62] dark:text-[#A0A4A8]">Actual \ Pred</div>
              <div className="font-bold text-[#000000] dark:text-white">Pos</div>
              <div className="font-bold text-[#5C5F62] dark:text-[#A0A4A8]">Neu</div>
              <div className="font-bold text-[#BA1A1A] dark:text-red-400">Neg</div>

              {CONFUSION_MATRIX.map((row) => (
                <React.Fragment key={row.actual}>
                  <div className="font-semibold text-[#191C1D] dark:text-white text-left self-center">{row.actual}</div>
                  <div className="p-2.5 rounded-lg bg-white dark:bg-[#191C1D] border border-[#E5E7EB] dark:border-[#33373B] font-bold text-[#000000] dark:text-white shadow-2xs">{row.predPos.toLocaleString()}</div>
                  <div className="p-2.5 rounded-lg bg-white dark:bg-[#191C1D] border border-[#E5E7EB] dark:border-[#33373B] font-medium text-[#5C5F62] dark:text-[#A0A4A8] shadow-2xs">{row.predNeu.toLocaleString()}</div>
                  <div className="p-2.5 rounded-lg bg-white dark:bg-[#191C1D] border border-[#E5E7EB] dark:border-[#33373B] font-bold text-[#BA1A1A] dark:text-red-400 shadow-2xs">{row.predNeg.toLocaleString()}</div>
                </React.Fragment>
              ))}
            </div>
          </div>

          <div className="text-[11px] text-[#5C5F62] dark:text-[#A0A4A8] font-mono text-center">
            Total Evaluation Dataset: 57,534 reviews • Test Split: 20%
          </div>
        </motion.div>
      </div>
    </div>
  );
};

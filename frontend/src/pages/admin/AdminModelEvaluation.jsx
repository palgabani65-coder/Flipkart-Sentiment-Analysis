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

const ChartTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="px-3 py-2 rounded-xl bg-[#111116] text-white text-xs shadow-2xl border border-slate-700 dark:border-[#282836] font-mono">
        <p className="font-extrabold text-white">{label}</p>
        {payload.map((p) => (
          <div key={p.dataKey} className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: p.color || p.fill }} />
            <span className="capitalize">{p.dataKey}:</span>
            <span className="font-bold">{p.value}%</span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

export const AdminModelEvaluation = () => {
  return (
    <div className="space-y-8 pb-10">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <span className="px-2.5 py-0.5 rounded-full bg-[#111116] dark:bg-[#2563EB] text-white text-[10px] font-extrabold uppercase font-mono tracking-wider flex items-center gap-1">
            ✦ ML Evaluation Audit
          </span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
          Machine Learning Model Evaluation
        </h2>
        <p className="text-xs text-slate-500 dark:text-[#9494A8] mt-1 font-medium">
          Benchmark comparison across ML classification algorithms, TF-IDF vectorization performance, and confusion matrices.
        </p>
      </div>

      {/* Model Comparison Table (Section 15 Specification) */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-6 rounded-2xl bg-white dark:bg-[#1C1C26] border border-[#E6E4F0] dark:border-[#282836] shadow-xs space-y-4"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-[#111116] dark:text-[#8B5CF6]" />
            <h3 className="text-base font-extrabold text-slate-900 dark:text-white">ML Algorithm Benchmark Comparison</h3>
          </div>
          <span className="text-xs font-mono font-bold text-[#16A34A] dark:text-[#22C55E]">Primary: Logistic Regression (91.8%)</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left font-mono text-xs">
            <thead>
              <tr className="border-b border-slate-100 dark:border-[#282836] bg-slate-50/60 dark:bg-[#242432]">
                <th className="py-3 px-4 font-bold uppercase tracking-wider text-slate-400">Model Algorithm</th>
                <th className="py-3 px-4 font-bold uppercase tracking-wider text-slate-400">Accuracy</th>
                <th className="py-3 px-4 font-bold uppercase tracking-wider text-slate-400">Precision</th>
                <th className="py-3 px-4 font-bold uppercase tracking-wider text-slate-400">Recall</th>
                <th className="py-3 px-4 font-bold uppercase tracking-wider text-slate-400">F1 Score</th>
                <th className="py-3 px-4 font-bold uppercase tracking-wider text-slate-400 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-[#282836]">
              {MODEL_COMPARISON.map((m) => (
                <tr key={m.name} className={`hover:bg-slate-50 dark:hover:bg-[#242432] transition-colors ${m.status.includes('Active') ? 'bg-[#DCFCE7]/40 dark:bg-emerald-950/20' : ''}`}>
                  <td className="py-3.5 px-4 font-bold text-slate-900 dark:text-white">{m.name}</td>
                  <td className="py-3.5 px-4 font-extrabold text-[#16A34A] dark:text-[#22C55E]">{m.accuracy}%</td>
                  <td className="py-3.5 px-4 font-bold text-slate-700 dark:text-slate-300">{m.precision}%</td>
                  <td className="py-3.5 px-4 font-bold text-slate-700 dark:text-slate-300">{m.recall}%</td>
                  <td className="py-3.5 px-4 font-extrabold text-slate-900 dark:text-white">{m.f1}%</td>
                  <td className="py-3.5 px-4 text-right">
                    <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold ${
                      m.status.includes('Active')
                        ? 'bg-[#111116] text-white dark:bg-[#2563EB]'
                        : 'bg-slate-100 dark:bg-[#242432] text-slate-500'
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
          className="p-6 rounded-2xl bg-white dark:bg-[#1C1C26] border border-[#E6E4F0] dark:border-[#282836] shadow-xs space-y-4"
        >
          <div>
            <h3 className="text-base font-extrabold text-slate-900 dark:text-white">Algorithm Accuracy & F1 Comparison</h3>
            <p className="text-xs text-slate-500 dark:text-[#9494A8]">Visual metric comparison across models</p>
          </div>

          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={MODEL_COMPARISON}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E6E4F0" opacity={0.5} vertical={false} />
                <XAxis dataKey="name" stroke="#9494A8" fontSize={9} tickLine={false} axisLine={false} />
                <YAxis stroke="#9494A8" fontSize={10} tickLine={false} axisLine={false} domain={[75, 100]} />
                <Tooltip content={<ChartTooltip />} />
                <Legend wrapperStyle={{ fontSize: '11px', fontWeight: 600 }} iconType="circle" />
                <Bar dataKey="accuracy" name="Accuracy %" fill="#16A34A" radius={[4, 4, 0, 0]} />
                <Bar dataKey="f1" name="F1 Score %" fill="#2563EB" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Confusion Matrix (3x3 Grid Specification Section 15) */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="p-6 rounded-2xl bg-white dark:bg-[#1C1C26] border border-[#E6E4F0] dark:border-[#282836] shadow-xs space-y-4 flex flex-col justify-between"
        >
          <div>
            <h3 className="text-base font-extrabold text-slate-900 dark:text-white">Logistic Regression Confusion Matrix</h3>
            <p className="text-xs text-slate-500 dark:text-[#9494A8]">Predicted vs Actual review counts across dataset</p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 dark:bg-[#242432] border border-[#E6E4F0] dark:border-[#282836] font-mono">
            <div className="grid grid-cols-4 gap-2 text-center text-xs">
              <div className="font-bold text-slate-400">Actual \ Pred</div>
              <div className="font-bold text-[#16A34A] dark:text-[#22C55E]">Pos</div>
              <div className="font-bold text-[#EA580C] dark:text-[#F59E0B]">Neu</div>
              <div className="font-bold text-[#DC2626] dark:text-[#EF4444]">Neg</div>

              {CONFUSION_MATRIX.map((row) => (
                <React.Fragment key={row.actual}>
                  <div className="font-bold text-slate-800 dark:text-slate-200 text-left self-center">{row.actual}</div>
                  <div className="p-2.5 rounded-lg bg-[#DCFCE7] dark:bg-emerald-950/40 font-extrabold text-[#15803D] dark:text-[#22C55E]">{row.predPos.toLocaleString()}</div>
                  <div className="p-2.5 rounded-lg bg-[#FFEDD5] dark:bg-amber-950/40 font-extrabold text-[#C2410C] dark:text-[#F59E0B]">{row.predNeu.toLocaleString()}</div>
                  <div className="p-2.5 rounded-lg bg-[#FEE2E2] dark:bg-rose-950/40 font-extrabold text-[#B91C1C] dark:text-[#EF4444]">{row.predNeg.toLocaleString()}</div>
                </React.Fragment>
              ))}
            </div>
          </div>

          <div className="text-[11px] text-slate-500 font-mono text-center">
            Total Evaluation Dataset: 57,534 reviews • Test Split: 20%
          </div>
        </motion.div>
      </div>
    </div>
  );
};

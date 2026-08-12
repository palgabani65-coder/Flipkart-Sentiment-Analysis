import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FileText, Download, CheckCircle2, Sparkles, Printer } from 'lucide-react';
import { useNotification } from '../../context/NotificationContext';

const REPORT_TYPES = [
  { id: 'rep1', title: 'Overall Sentiment Report', desc: 'Comprehensive summary of customer sentiment across all seller products.' },
  { id: 'rep2', title: 'Product Sentiment Report', desc: 'Detailed breakdown of sentiment breakdown and ratings per individual item.' },
  { id: 'rep3', title: 'Negative Review Report', desc: 'Audit log of negative customer feedback and actionable improvement themes.' },
  { id: 'rep4', title: 'Monthly Analytics Report', desc: 'Historical monthly trends, rating distributions, and volume changes.' },
  { id: 'rep5', title: 'Product Comparison Report', desc: 'Side-by-side sentiment percentage comparison of top catalog products.' },
];

export const SellerReports = () => {
  const { addToast } = useNotification();
  const [selectedReport, setSelectedReport] = useState('rep1');
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = (typeTitle) => {
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
      addToast(`Generated ${typeTitle} PDF report successfully!`, 'success');
    }, 800);
  };

  return (
    <div className="space-y-8 pb-10">
      <div>
        <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
          Executive Reports & PDF Export
        </h2>
        <p className="text-xs text-slate-500 dark:text-[#9494A8] mt-1 font-medium">
          Generate structured sentiment intelligence reports for business partners and product managers.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Report Types List */}
        <div className="space-y-3 lg:col-span-2">
          {REPORT_TYPES.map((rep) => (
            <motion.div
              key={rep.id}
              whileHover={{ scale: 1.01 }}
              onClick={() => setSelectedReport(rep.id)}
              className={`p-5 rounded-2xl border cursor-pointer transition-all flex items-center justify-between ${
                selectedReport === rep.id
                  ? 'bg-slate-100/80 dark:bg-[#242432] border-[#111116] dark:border-[#8B5CF6] shadow-xs'
                  : 'bg-white dark:bg-[#1C1C26] border-[#E6E4F0] dark:border-[#282836] hover:border-slate-300'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                  selectedReport === rep.id
                    ? 'bg-[#111116] dark:bg-[#2563EB] text-white'
                    : 'bg-slate-100 dark:bg-[#242432] text-slate-400'
                }`}>
                  <FileText className="w-4.5 h-4.5" />
                </div>
                <div>
                  <h3 className="text-sm font-extrabold text-slate-900 dark:text-white">{rep.title}</h3>
                  <p className="text-xs text-slate-500 dark:text-[#9494A8] mt-0.5">{rep.desc}</p>
                </div>
              </div>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleGenerate(rep.title);
                }}
                className="px-3.5 py-2 rounded-xl bg-[#111116] hover:bg-black dark:bg-[#2563EB] dark:hover:bg-[#1D4ED8] text-white font-extrabold text-xs flex items-center gap-1.5 shadow-md cursor-pointer shrink-0"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Generate Report</span>
              </button>
            </motion.div>
          ))}
        </div>

        {/* Report Preview Box */}
        <div className="p-6 rounded-2xl bg-white dark:bg-[#1C1C26] border border-[#E6E4F0] dark:border-[#282836] shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-[#282836]">
            <span className="text-xs font-bold text-slate-900 dark:text-white font-mono">Report Preview</span>
            <span className="text-[10px] font-bold text-[#15803D] dark:text-[#22C55E] bg-[#DCFCE7] dark:bg-emerald-950/30 px-2 py-0.5 rounded-md">
              Ready to Export
            </span>
          </div>

          <div className="space-y-3 font-mono text-xs text-slate-600 dark:text-[#9494A8]">
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-[#242432]">
              <span className="text-[10px] text-slate-400 block">Report Title</span>
              <span className="font-bold text-slate-900 dark:text-white">
                {REPORT_TYPES.find(r => r.id === selectedReport)?.title}
              </span>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 dark:bg-[#242432]">
              <span className="text-[10px] text-slate-400 block">Dataset Coverage</span>
              <span className="font-bold text-slate-900 dark:text-white">57,534 Clean Reviews</span>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 dark:bg-[#242432]">
              <span className="text-[10px] text-slate-400 block">Overall Positive Ratio</span>
              <span className="font-bold text-[#15803D] dark:text-[#22C55E]">56.7% Positive</span>
            </div>
          </div>

          <button
            onClick={() => handleGenerate(REPORT_TYPES.find(r => r.id === selectedReport)?.title || 'Report')}
            disabled={isGenerating}
            className="w-full py-2.5 rounded-xl bg-[#111116] hover:bg-black dark:bg-[#2563EB] dark:hover:bg-[#1D4ED8] text-white font-extrabold text-xs flex items-center justify-center gap-2 shadow-md cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            <span>Download PDF Report</span>
          </button>
        </div>
      </div>
    </div>
  );
};

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
    <div className="space-y-8 pb-10 font-sans text-[#191C1D] dark:text-white transition-colors">
      <div>
        <h2 className="text-2xl sm:text-3xl font-bold text-[#191C1D] dark:text-white tracking-tight font-sans">
          Executive Reports & PDF Export
        </h2>
        <p className="text-xs text-[#5C5F62] dark:text-[#A0A4A8] mt-1 font-mono">
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
                  ? 'bg-[#F8F9FA] dark:bg-[#242729] border-[#000000] dark:border-white shadow-xs'
                  : 'bg-white dark:bg-[#191C1D] border-[#E5E7EB] dark:border-[#2E3132] hover:border-[#7E7576] dark:hover:border-[#5C5F62]'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                  selectedReport === rep.id
                    ? 'bg-[#000000] dark:bg-white text-white dark:text-black'
                    : 'bg-[#F3F4F5] dark:bg-[#242729] text-[#5C5F62] dark:text-[#A0A4A8]'
                }`}>
                  <FileText className="w-4.5 h-4.5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-[#191C1D] dark:text-white font-sans">{rep.title}</h3>
                  <p className="text-xs text-[#5C5F62] dark:text-[#A0A4A8] mt-0.5 font-mono">{rep.desc}</p>
                </div>
              </div>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleGenerate(rep.title);
                }}
                className="px-3.5 py-2 rounded-lg bg-[#000000] dark:bg-white text-white dark:text-black font-semibold font-mono text-xs flex items-center gap-1.5 shadow-xs hover:bg-[#1B1B1B] dark:hover:bg-slate-100 transition-colors cursor-pointer shrink-0"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Generate</span>
              </button>
            </motion.div>
          ))}
        </div>

        {/* Report Preview Box */}
        <div className="p-6 rounded-2xl bg-white dark:bg-[#191C1D] border border-[#E5E7EB] dark:border-[#2E3132] shadow-[0_4px_20px_rgba(0,0,0,0.04)] dark:shadow-none space-y-4 font-sans">
          <div className="flex items-center justify-between pb-3 border-b border-[#E5E7EB] dark:border-[#2E3132]">
            <span className="text-xs font-bold text-[#191C1D] dark:text-white font-mono">Report Preview</span>
            <span className="text-[10px] font-semibold text-[#000000] dark:text-white bg-[#F3F4F5] dark:bg-[#242729] border border-[#E5E7EB] dark:border-[#33373B] px-2 py-0.5 rounded-md font-mono">
              Ready to Export
            </span>
          </div>

          <div className="space-y-3 font-mono text-xs text-[#5C5F62] dark:text-[#A0A4A8]">
            <div className="p-3 rounded-xl bg-[#F8F9FA] dark:bg-[#242729] border border-[#EDEEEF] dark:border-[#33373B]">
              <span className="text-[10px] text-[#5C5F62] dark:text-[#848484] block uppercase">Report Title</span>
              <span className="font-semibold text-sm text-[#191C1D] dark:text-white">
                {REPORT_TYPES.find(r => r.id === selectedReport)?.title}
              </span>
            </div>

            <div className="p-3 rounded-xl bg-[#F8F9FA] dark:bg-[#242729] border border-[#EDEEEF] dark:border-[#33373B]">
              <span className="text-[10px] text-[#5C5F62] dark:text-[#848484] block uppercase">Dataset Coverage</span>
              <span className="font-semibold text-sm text-[#191C1D] dark:text-white">57,534 Clean Reviews</span>
            </div>

            <div className="p-3 rounded-xl bg-[#F8F9FA] dark:bg-[#242729] border border-[#EDEEEF] dark:border-[#33373B]">
              <span className="text-[10px] text-[#5C5F62] dark:text-[#848484] block uppercase">Overall Positive Ratio</span>
              <span className="font-semibold text-sm text-[#000000] dark:text-white">56.7% Positive</span>
            </div>
          </div>

          <button
            onClick={() => handleGenerate(REPORT_TYPES.find(r => r.id === selectedReport)?.title || 'Report')}
            disabled={isGenerating}
            className="w-full py-2.5 rounded-xl bg-[#000000] dark:bg-white text-white dark:text-black font-semibold font-mono text-xs flex items-center justify-center gap-2 shadow-xs hover:bg-[#1B1B1B] dark:hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            <span>Download PDF Report</span>
          </button>
        </div>
      </div>
    </div>
  );
};

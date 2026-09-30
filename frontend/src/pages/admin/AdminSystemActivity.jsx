import React from 'react';
import { motion } from 'framer-motion';
import { Activity, CheckCircle2, XCircle, User, LogIn, Package, Cpu, AlertTriangle } from 'lucide-react';

const ACTIVITIES = [
  { action: 'Seller registered', user: 'Vikram Singh', detail: 'vikram.s@email.com', time: '2 minutes ago', status: 'success', icon: User },
  { action: 'Product analyzed', user: 'Pal Gabani', detail: 'Samsung Galaxy S24 Ultra — 142 reviews', time: '10 minutes ago', status: 'success', icon: Package },
  { action: 'Review analysis completed', user: 'System', detail: 'Batch: 248 reviews processed in 3.2s', time: '25 minutes ago', status: 'success', icon: Cpu },
  { action: 'Seller login', user: 'Priya Patel', detail: 'priya.patel@email.com', time: '1 hour ago', status: 'info', icon: LogIn },
  { action: 'Admin login', user: 'Pal Gabani', detail: 'palgabani65@gmail.com', time: '1 hour ago', status: 'info', icon: LogIn },
  { action: 'Product analysis failed', user: 'Rahul Sharma', detail: 'Error: Invalid product URL — timeout', time: '2 hours ago', status: 'error', icon: AlertTriangle },
  { action: 'Model inference', user: 'System', detail: 'Logistic Regression TF-IDF v2.4 — 94.2% confidence', time: '2 hours ago', status: 'success', icon: Cpu },
  { action: 'Seller registered', user: 'Sneha Reddy', detail: 'sneha.reddy@email.com', time: '5 hours ago', status: 'success', icon: User },
  { action: 'Product analyzed', user: 'Amit Kumar', detail: 'boAt Rockerz 450 Pro — 312 reviews', time: '6 hours ago', status: 'success', icon: Package },
  { action: 'Seller login', user: 'Amit Kumar', detail: 'amit.kumar@email.com', time: '6 hours ago', status: 'info', icon: LogIn },
];

const statusStyles = {
  success: { bg: 'bg-[#F3F4F5] dark:bg-[#242729] border border-[#E5E7EB] dark:border-[#33373B]', text: 'text-[#000000] dark:text-white', dot: 'bg-[#000000] dark:bg-white' },
  info: { bg: 'bg-[#F8F9FA] dark:bg-[#242729] border border-[#E5E7EB] dark:border-[#33373B]', text: 'text-[#5C5F62] dark:text-[#A0A4A8]', dot: 'bg-[#5C5F62] dark:bg-[#A0A4A8]' },
  error: { bg: 'bg-rose-50 dark:bg-rose-950/30 border border-rose-200/60 dark:border-rose-900/40', text: 'text-[#BA1A1A] dark:text-red-400', dot: 'bg-[#BA1A1A] dark:bg-red-400' },
};

export const AdminSystemActivity = () => {
  return (
    <div className="space-y-6 pb-8 font-sans text-[#191C1D] dark:text-white transition-colors">
      <div>
        <h2 className="text-2xl sm:text-3xl font-bold text-[#191C1D] dark:text-white tracking-tight font-sans">System Activity</h2>
        <p className="text-xs text-[#5C5F62] dark:text-[#A0A4A8] mt-1 font-mono">Real-time audit log of platform events, seller actions, and system operations.</p>
      </div>

      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl bg-white dark:bg-[#191C1D] border border-[#E5E7EB] dark:border-[#2E3132] shadow-[0_4px_20px_rgba(0,0,0,0.04)] dark:shadow-none overflow-hidden font-sans">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-[#E5E7EB] dark:border-[#2E3132] bg-[#F8F9FA] dark:bg-[#242729]">
                <th className="py-3.5 px-5 text-[10px] font-semibold uppercase tracking-wider text-[#5C5F62] dark:text-[#A0A4A8] font-mono">Action</th>
                <th className="py-3.5 px-4 text-[10px] font-semibold uppercase tracking-wider text-[#5C5F62] dark:text-[#A0A4A8] font-mono">User</th>
                <th className="py-3.5 px-4 text-[10px] font-semibold uppercase tracking-wider text-[#5C5F62] dark:text-[#A0A4A8] font-mono">Details</th>
                <th className="py-3.5 px-4 text-[10px] font-semibold uppercase tracking-wider text-[#5C5F62] dark:text-[#A0A4A8] font-mono text-right">Timestamp</th>
                <th className="py-3.5 px-4 text-[10px] font-semibold uppercase tracking-wider text-[#5C5F62] dark:text-[#A0A4A8] font-mono">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5E7EB] dark:divide-[#2E3132]">
              {ACTIVITIES.map((item, i) => {
                const style = statusStyles[item.status];
                const Icon = item.icon;
                return (
                  <tr key={i} className="hover:bg-[#F8F9FA] dark:hover:bg-[#242729] transition-colors">
                    <td className="py-4 px-5">
                      <div className="flex items-center gap-2.5">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${style.bg} ${style.text}`}>
                          <Icon className="w-4 h-4" />
                        </div>
                        <span className="text-xs font-bold text-[#191C1D] dark:text-white font-sans">{item.action}</span>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-xs font-medium text-[#191C1D] dark:text-white font-sans">{item.user}</td>
                    <td className="py-4 px-4 text-xs text-[#5C5F62] dark:text-[#A0A4A8] max-w-[260px] truncate font-sans">{item.detail}</td>
                    <td className="py-4 px-4 text-right text-[11px] text-[#5C5F62] dark:text-[#A0A4A8] font-mono">{item.time}</td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-1.5 font-mono">
                        <div className={`w-2 h-2 rounded-full ${style.dot}`} />
                        <span className={`text-[10px] font-semibold ${style.text} capitalize`}>{item.status}</span>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
};

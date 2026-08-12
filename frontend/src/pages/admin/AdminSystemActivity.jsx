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
  success: { bg: 'bg-cyan-50 dark:bg-[#22D3EE]/20', text: 'text-cyan-700 dark:text-[#22D3EE]', dot: 'bg-[#22D3EE]' },
  info: { bg: 'bg-indigo-50 dark:bg-indigo-950/40', text: 'text-indigo-600 dark:text-[#818CF8]', dot: 'bg-[#818CF8]' },
  error: { bg: 'bg-rose-50 dark:bg-rose-950/40', text: 'text-rose-600 dark:text-rose-400', dot: 'bg-rose-500' },
};

export const AdminSystemActivity = () => {
  return (
    <div className="space-y-6 pb-8">
      <div>
        <h2 className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight">System Activity</h2>
        <p className="text-xs text-slate-400 mt-1">Real-time audit log of platform events, seller actions, and system operations.</p>
      </div>

      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl bg-white dark:bg-[#0F111A] border border-slate-200/80 dark:border-[#252A3A] shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-slate-200/80 dark:border-[#252A3A] bg-slate-50/60 dark:bg-[#090D16]/50">
                <th className="py-3.5 px-5 text-[10px] font-bold uppercase tracking-wider text-slate-400 font-mono">Action</th>
                <th className="py-3.5 px-4 text-[10px] font-bold uppercase tracking-wider text-slate-400 font-mono">User</th>
                <th className="py-3.5 px-4 text-[10px] font-bold uppercase tracking-wider text-slate-400 font-mono">Details</th>
                <th className="py-3.5 px-4 text-[10px] font-bold uppercase tracking-wider text-slate-400 font-mono text-right">Timestamp</th>
                <th className="py-3.5 px-4 text-[10px] font-bold uppercase tracking-wider text-slate-400 font-mono">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-[#252A3A]">
              {ACTIVITIES.map((item, i) => {
                const style = statusStyles[item.status];
                const Icon = item.icon;
                return (
                  <tr key={i} className="hover:bg-slate-50/50 dark:hover:bg-[#151926]/40 transition-colors">
                    <td className="py-4 px-5">
                      <div className="flex items-center gap-2.5">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${style.bg} ${style.text}`}>
                          <Icon className="w-4 h-4" />
                        </div>
                        <span className="text-xs font-bold text-slate-900 dark:text-white">{item.action}</span>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-xs font-medium text-slate-600 dark:text-slate-400">{item.user}</td>
                    <td className="py-4 px-4 text-xs text-slate-500 dark:text-slate-400 max-w-[260px] truncate">{item.detail}</td>
                    <td className="py-4 px-4 text-right text-[11px] text-slate-400 font-mono">{item.time}</td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-1.5">
                        <div className={`w-2 h-2 rounded-full ${style.dot}`} />
                        <span className={`text-[10px] font-bold ${style.text} capitalize`}>{item.status}</span>
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

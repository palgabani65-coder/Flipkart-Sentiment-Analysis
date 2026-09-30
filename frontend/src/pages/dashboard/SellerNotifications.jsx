import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Bell, AlertTriangle, TrendingDown, Sparkles, CheckCircle2, Trash2, FileText } from 'lucide-react';
import { useNotification } from '../../context/NotificationContext';

const NOTIFS = [
  { 
    id: 'n1', 
    title: '🔴 Negative sentiment increased', 
    desc: 'Product: boAt Rockerz 255 Pro+ — Negative reviews increased by 14% in the last 24 hours.', 
    time: '10 minutes ago', 
    type: 'critical', 
    icon: AlertTriangle 
  },
  { 
    id: 'n2', 
    title: '⚠ New customer issue detected', 
    desc: '"Bluetooth connectivity" is trending in negative reviews across audio catalog items.', 
    time: '1 hour ago', 
    type: 'warning', 
    icon: TrendingDown 
  },
  { 
    id: 'n3', 
    title: '📊 Monthly report ready', 
    desc: 'Your August sentiment intelligence executive report is compiled and ready for download.', 
    time: '3 hours ago', 
    type: 'info', 
    icon: FileText 
  },
  { 
    id: 'n4', 
    title: '✦ New AI insight', 
    desc: 'Customer sentiment for Samsung Galaxy S24 Ultra has improved by +6.2% this week.', 
    time: '5 hours ago', 
    type: 'success', 
    icon: Sparkles 
  },
];

export const SellerNotifications = () => {
  const { addToast } = useNotification();
  const [notifications, setNotifications] = useState(NOTIFS);

  const clearAll = () => {
    setNotifications([]);
    addToast('All notifications cleared', 'info');
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-10 font-sans text-[#191C1D] dark:text-white transition-colors">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold text-[#191C1D] dark:text-white tracking-tight font-sans">
            Seller Notifications
          </h2>
          <p className="text-xs text-[#5C5F62] dark:text-[#A0A4A8] mt-1 font-mono">
            Analytics-driven alerts regarding product sentiment spikes, negative review clusters, and AI report updates.
          </p>
        </div>

        {notifications.length > 0 && (
          <button
            onClick={clearAll}
            className="flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-mono font-medium text-[#BA1A1A] dark:text-red-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear All</span>
          </button>
        )}
      </div>

      <div className="space-y-3">
        {notifications.map((n, i) => {
          const Icon = n.icon;
          return (
            <motion.div
              key={n.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="p-4.5 rounded-2xl bg-white dark:bg-[#191C1D] border border-[#E5E7EB] dark:border-[#2E3132] shadow-[0_4px_20px_rgba(0,0,0,0.04)] dark:shadow-none flex items-start justify-between gap-4"
            >
              <div className="flex items-start gap-3.5">
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                  n.type === 'critical' ? 'bg-rose-50 dark:bg-rose-950/30 text-[#BA1A1A] dark:text-red-400' :
                  n.type === 'warning' ? 'bg-amber-50 dark:bg-amber-950/30 text-amber-600 dark:text-amber-400' :
                  n.type === 'info' ? 'bg-[#F3F4F5] dark:bg-[#242729] text-[#000000] dark:text-white' :
                  'bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400'
                }`}>
                  <Icon className="w-4.5 h-4.5" />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-[#191C1D] dark:text-white font-sans">{n.title}</h3>
                  <p className="text-xs text-[#5C5F62] dark:text-[#A0A4A8] mt-0.5 leading-relaxed font-sans">{n.desc}</p>
                  <span className="text-[9px] text-[#5C5F62] dark:text-[#848484] font-mono mt-1.5 block">{n.time}</span>
                </div>
              </div>
            </motion.div>
          );
        })}

        {notifications.length === 0 && (
          <div className="py-20 text-center rounded-2xl bg-white dark:bg-[#191C1D] border border-[#E5E7EB] dark:border-[#2E3132]">
            <Bell className="w-10 h-10 mx-auto text-[#5C5F62] dark:text-[#848484] mb-3" />
            <p className="text-xs font-medium text-[#5C5F62] dark:text-[#A0A4A8] font-mono">No active seller notifications.</p>
          </div>
        )}
      </div>
    </div>
  );
};

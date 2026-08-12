import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Settings, Bell, Globe, Palette, Shield, Save } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useNotification } from '../../context/NotificationContext';

export const SellerSettings = () => {
  const { theme, toggleTheme } = useTheme();
  const { addToast } = useNotification();
  const [emailNotifs, setEmailNotifs] = useState(true);
  const [sentimentAlerts, setSentimentAlerts] = useState(true);
  const [weeklyReport, setWeeklyReport] = useState(true);

  const Toggle = ({ checked, onChange }) => (
    <button
      onClick={onChange}
      className={`relative w-10 h-5 rounded-full transition-colors cursor-pointer ${
        checked ? 'bg-[#111116] dark:bg-[#2563EB]' : 'bg-slate-300 dark:bg-slate-700'
      }`}
    >
      <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow-xs transition-transform ${
        checked ? 'translate-x-5.5' : 'translate-x-0.5'
      }`} />
    </button>
  );

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-8">
      <div>
        <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">Settings</h2>
        <p className="text-xs text-slate-500 dark:text-[#9494A8] mt-1 font-medium">Configure notifications, appearance, and account preferences.</p>
      </div>

      {/* Notifications */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-6 rounded-2xl bg-white dark:bg-[#1C1C26] border border-[#E6E4F0] dark:border-[#282836] shadow-xs"
      >
        <h3 className="text-base font-extrabold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
          <Bell className="w-4 h-4 text-[#111116] dark:text-[#8B5CF6]" />
          Notifications
        </h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-slate-800 dark:text-slate-200">Email Notifications</p>
              <p className="text-[10px] text-slate-400 mt-0.5">Receive analysis completion emails</p>
            </div>
            <Toggle checked={emailNotifs} onChange={() => setEmailNotifs(!emailNotifs)} />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-slate-800 dark:text-slate-200">Sentiment Alerts</p>
              <p className="text-[10px] text-slate-400 mt-0.5">Get alerted when negative sentiment spikes</p>
            </div>
            <Toggle checked={sentimentAlerts} onChange={() => setSentimentAlerts(!sentimentAlerts)} />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-slate-800 dark:text-slate-200">Weekly Report</p>
              <p className="text-[10px] text-slate-400 mt-0.5">Receive weekly sentiment summary</p>
            </div>
            <Toggle checked={weeklyReport} onChange={() => setWeeklyReport(!weeklyReport)} />
          </div>
        </div>
      </motion.div>

      {/* Appearance */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.08 }}
        className="p-6 rounded-2xl bg-white dark:bg-[#1C1C26] border border-[#E6E4F0] dark:border-[#282836] shadow-xs"
      >
        <h3 className="text-base font-extrabold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
          <Palette className="w-4 h-4 text-[#111116] dark:text-[#8B5CF6]" />
          Appearance
        </h3>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-slate-800 dark:text-slate-200">Dark Mode</p>
            <p className="text-[10px] text-slate-400 mt-0.5">Current: {theme === 'dark' ? 'Dark' : 'Light'} theme</p>
          </div>
          <Toggle checked={theme === 'dark'} onChange={toggleTheme} />
        </div>
      </motion.div>

      {/* Save */}
      <button
        onClick={() => addToast('Settings saved successfully', 'success')}
        className="px-5 py-2.5 rounded-xl bg-[#111116] hover:bg-black dark:bg-[#2563EB] text-white font-extrabold text-xs flex items-center gap-2 shadow-md transition-all cursor-pointer"
      >
        <Save className="w-4 h-4" /> Save Settings
      </button>
    </div>
  );
};

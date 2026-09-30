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
      className={`relative w-11 h-6 rounded-full transition-colors cursor-pointer ${
        checked ? 'bg-[#000000] dark:bg-white' : 'bg-[#E5E7EB] dark:bg-[#2E3132]'
      }`}
    >
      <div className={`absolute top-1 w-4 h-4 rounded-full transition-transform ${
        checked 
          ? 'translate-x-6 bg-white dark:bg-black' 
          : 'translate-x-1 bg-white dark:bg-[#A0A4A8]'
      }`} />
    </button>
  );

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-8 font-sans text-[#191C1D] dark:text-white transition-colors">
      <div>
        <h2 className="text-2xl sm:text-3xl font-bold text-[#191C1D] dark:text-white tracking-tight font-sans">Settings</h2>
        <p className="text-xs text-[#5C5F62] dark:text-[#A0A4A8] mt-1 font-mono">Configure notifications, appearance, and account preferences.</p>
      </div>

      {/* Notifications */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-6 rounded-2xl bg-white dark:bg-[#191C1D] border border-[#E5E7EB] dark:border-[#2E3132] shadow-[0_4px_20px_rgba(0,0,0,0.04)] dark:shadow-none font-sans"
      >
        <h3 className="text-base font-bold text-[#191C1D] dark:text-white mb-4 flex items-center gap-2 font-sans">
          <Bell className="w-4 h-4 text-[#000000] dark:text-white" />
          Notifications
        </h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-[#191C1D] dark:text-white font-sans">Email Notifications</p>
              <p className="text-[10px] text-[#5C5F62] dark:text-[#A0A4A8] mt-0.5 font-mono">Receive analysis completion emails</p>
            </div>
            <Toggle checked={emailNotifs} onChange={() => setEmailNotifs(!emailNotifs)} />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-[#191C1D] dark:text-white font-sans">Sentiment Alerts</p>
              <p className="text-[10px] text-[#5C5F62] dark:text-[#A0A4A8] mt-0.5 font-mono">Get alerted when negative sentiment spikes</p>
            </div>
            <Toggle checked={sentimentAlerts} onChange={() => setSentimentAlerts(!sentimentAlerts)} />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-[#191C1D] dark:text-white font-sans">Weekly Report</p>
              <p className="text-[10px] text-[#5C5F62] dark:text-[#A0A4A8] mt-0.5 font-mono">Receive weekly sentiment summary</p>
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
        className="p-6 rounded-2xl bg-white dark:bg-[#191C1D] border border-[#E5E7EB] dark:border-[#2E3132] shadow-[0_4px_20px_rgba(0,0,0,0.04)] dark:shadow-none font-sans"
      >
        <h3 className="text-base font-bold text-[#191C1D] dark:text-white mb-4 flex items-center gap-2 font-sans">
          <Palette className="w-4 h-4 text-[#000000] dark:text-white" />
          Appearance
        </h3>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-[#191C1D] dark:text-white font-sans">Dark Mode</p>
            <p className="text-[10px] text-[#5C5F62] dark:text-[#A0A4A8] mt-0.5 font-mono">Current: {theme === 'dark' ? 'Dark' : 'Light'} theme</p>
          </div>
          <Toggle checked={theme === 'dark'} onChange={toggleTheme} />
        </div>
      </motion.div>

      {/* Save */}
      <button
        onClick={() => addToast('Settings saved successfully', 'success')}
        className="px-5 py-2.5 rounded-lg bg-[#000000] dark:bg-white hover:bg-[#1B1B1B] dark:hover:bg-slate-100 text-white dark:text-black font-semibold font-mono text-xs flex items-center gap-2 shadow-xs transition-colors cursor-pointer"
      >
        <Save className="w-4 h-4" /> Save Settings
      </button>
    </div>
  );
};

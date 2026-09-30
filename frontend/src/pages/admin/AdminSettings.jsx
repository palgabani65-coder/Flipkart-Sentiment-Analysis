import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Settings, Globe, Database, Cpu, Shield, Save, Bell, Palette } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useNotification } from '../../context/NotificationContext';

const SYSTEM_STATUS = [
  { label: 'Backend API', value: 'http://localhost:8000', status: 'Online', icon: Globe },
  { label: 'MongoDB Atlas', value: 'cluster0.mongodb.net', status: 'Connected', icon: Database },
  { label: 'ML Model', value: 'LR TF-IDF v2.4', status: 'Loaded', icon: Cpu },
];

export const AdminSettings = () => {
  const { theme, toggleTheme } = useTheme();
  const { addToast } = useNotification();
  const [maintenanceMode, setMaintenanceMode] = useState(false);

  const Toggle = ({ checked, onChange }) => (
    <button onClick={onChange}
      className={`relative w-11 h-6 rounded-full transition-colors cursor-pointer ${checked ? 'bg-[#000000] dark:bg-white' : 'bg-[#E5E7EB] dark:bg-[#2E3132]'}`}>
      <div className={`absolute top-1 w-4 h-4 rounded-full transition-transform ${checked ? 'translate-x-6 bg-white dark:bg-black' : 'translate-x-1 bg-white dark:bg-[#A0A4A8]'}`} />
    </button>
  );

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-8 font-sans text-[#191C1D] dark:text-white transition-colors">
      <div>
        <h2 className="text-2xl sm:text-3xl font-bold text-[#191C1D] dark:text-white tracking-tight font-sans">Admin Settings</h2>
        <p className="text-xs text-[#5C5F62] dark:text-[#A0A4A8] mt-1 font-mono">System infrastructure configuration and service status.</p>
      </div>

      {/* System Status */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
        className="p-6 rounded-2xl bg-white dark:bg-[#191C1D] border border-[#E5E7EB] dark:border-[#2E3132] shadow-[0_4px_20px_rgba(0,0,0,0.04)] dark:shadow-none font-sans">
        <h3 className="text-base font-bold text-[#191C1D] dark:text-white mb-4 flex items-center gap-2 font-sans">
          <Shield className="w-4 h-4 text-[#000000] dark:text-white" />
          System Infrastructure
        </h3>
        <div className="space-y-3">
          {SYSTEM_STATUS.map((sys) => {
            const Icon = sys.icon;
            return (
              <div key={sys.label} className="flex items-center justify-between p-3.5 rounded-xl bg-[#F8F9FA] dark:bg-[#242729] border border-[#EDEEEF] dark:border-[#33373B]">
                <div className="flex items-center gap-3">
                  <Icon className="w-4 h-4 text-[#5C5F62] dark:text-[#A0A4A8]" />
                  <div>
                    <p className="text-xs font-semibold text-[#191C1D] dark:text-white font-sans">{sys.label}</p>
                    <p className="text-[10px] text-[#5C5F62] dark:text-[#A0A4A8] font-mono">{sys.value}</p>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 font-mono">
                  <div className="w-2 h-2 rounded-full bg-[#000000] dark:bg-white animate-pulse" />
                  <span className="text-[10px] font-semibold text-[#000000] dark:text-white">{sys.status}</span>
                </div>
              </div>
            );
          })}
        </div>
      </motion.div>

      {/* Toggles */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 }}
        className="p-6 rounded-2xl bg-white dark:bg-[#191C1D] border border-[#E5E7EB] dark:border-[#2E3132] shadow-[0_4px_20px_rgba(0,0,0,0.04)] dark:shadow-none space-y-4 font-sans">
        <h3 className="text-base font-bold text-[#191C1D] dark:text-white flex items-center gap-2 font-sans">
          <Settings className="w-4 h-4 text-[#000000] dark:text-white" />
          Preferences
        </h3>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-[#191C1D] dark:text-white font-sans">Dark Mode</p>
            <p className="text-[10px] text-[#5C5F62] dark:text-[#A0A4A8] mt-0.5 font-mono">Current: {theme === 'dark' ? 'Dark' : 'Light'} theme</p>
          </div>
          <Toggle checked={theme === 'dark'} onChange={toggleTheme} />
        </div>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-[#191C1D] dark:text-white font-sans">Maintenance Mode</p>
            <p className="text-[10px] text-[#5C5F62] dark:text-[#A0A4A8] mt-0.5 font-mono">Disable seller access temporarily</p>
          </div>
          <Toggle checked={maintenanceMode} onChange={() => setMaintenanceMode(!maintenanceMode)} />
        </div>
      </motion.div>

      <button onClick={() => addToast('Settings saved', 'success')}
        className="px-5 py-2.5 rounded-lg bg-[#000000] dark:bg-white hover:bg-[#1B1B1B] dark:hover:bg-slate-100 text-white dark:text-black font-semibold font-mono text-xs flex items-center gap-2 shadow-xs transition-colors cursor-pointer">
        <Save className="w-4 h-4" /> Save Settings
      </button>
    </div>
  );
};

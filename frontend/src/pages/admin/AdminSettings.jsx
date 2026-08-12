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
      className={`relative w-10 h-5 rounded-full transition-colors cursor-pointer ${checked ? 'bg-[#22D3EE]' : 'bg-slate-300 dark:bg-slate-700'}`}>
      <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white dark:bg-slate-950 shadow-sm transition-transform ${checked ? 'translate-x-5.5' : 'translate-x-0.5'}`} />
    </button>
  );

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-8">
      <div>
        <h2 className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight">Admin Settings</h2>
        <p className="text-xs text-slate-400 mt-1">System infrastructure configuration and service status.</p>
      </div>

      {/* System Status */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
        className="p-6 rounded-2xl bg-white dark:bg-[#0F111A] border border-slate-200/80 dark:border-[#252A3A] shadow-sm">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
          <Shield className="w-4 h-4 text-cyan-600 dark:text-[#22D3EE]" />
          System Infrastructure
        </h3>
        <div className="space-y-3">
          {SYSTEM_STATUS.map((sys) => {
            const Icon = sys.icon;
            return (
              <div key={sys.label} className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 dark:bg-[#090D16]">
                <div className="flex items-center gap-3">
                  <Icon className="w-4 h-4 text-slate-400" />
                  <div>
                    <p className="text-xs font-bold text-slate-700 dark:text-slate-300">{sys.label}</p>
                    <p className="text-[10px] text-slate-400 font-mono">{sys.value}</p>
                  </div>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-[#22D3EE] animate-pulse" />
                  <span className="text-[10px] font-bold text-cyan-600 dark:text-[#22D3EE]">{sys.status}</span>
                </div>
              </div>
            );
          })}
        </div>
      </motion.div>

      {/* Toggles */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 }}
        className="p-6 rounded-2xl bg-white dark:bg-[#0F111A] border border-slate-200/80 dark:border-[#252A3A] shadow-sm space-y-4">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Settings className="w-4 h-4 text-cyan-600 dark:text-[#22D3EE]" />
          Preferences
        </h3>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-slate-700 dark:text-slate-300">Dark Mode</p>
            <p className="text-[10px] text-slate-400">Current: {theme === 'dark' ? 'Dark' : 'Light'}</p>
          </div>
          <Toggle checked={theme === 'dark'} onChange={toggleTheme} />
        </div>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-slate-700 dark:text-slate-300">Maintenance Mode</p>
            <p className="text-[10px] text-slate-400">Disable seller access temporarily</p>
          </div>
          <Toggle checked={maintenanceMode} onChange={() => setMaintenanceMode(!maintenanceMode)} />
        </div>
      </motion.div>

      <button onClick={() => addToast('Settings saved', 'success')}
        className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#22D3EE] to-[#818CF8] text-slate-950 font-extrabold text-xs flex items-center gap-2 shadow-md shadow-cyan-500/20 transition-all cursor-pointer">
        <Save className="w-4 h-4" /> Save Settings
      </button>
    </div>
  );
};

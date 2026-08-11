import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  User, 
  Mail, 
  Key, 
  ShieldCheck, 
  Moon, 
  Sun, 
  Save, 
  BrainCircuit, 
  CheckCircle2,
  Lock
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useNotification } from '../context/NotificationContext';

export const Profile = () => {
  const { user, updateProfile } = useAuth();
  const { isDarkMode, toggleTheme } = useTheme();
  const { addToast } = useNotification();

  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [apiKey, setApiKey] = useState(user?.apiKey || 'flkp_live_99a823b17c09e4f21a8d0e7b');
  const [customApiUrl, setCustomApiUrl] = useState(localStorage.getItem('fk_api_url') || 'http://localhost:8000/api/v1');
  const [loading, setLoading] = useState(false);

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await updateProfile({ name, email, apiKey });
      localStorage.setItem('fk_api_url', customApiUrl);
      addToast('Profile & Settings updated successfully', 'success');
    } catch (err) {
      addToast('Failed to save profile changes', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 pb-12 max-w-4xl mx-auto">
      
      {/* Header */}
      <div>
        <h1 className="text-2xl font-extrabold text-gray-900 dark:text-white flex items-center gap-2">
          <User className="w-6 h-6 text-blue-600 dark:text-blue-400" />
          User Profile & System Settings
        </h1>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
          Manage your analyst profile details, API keys, dark theme preferences, and backend connection endpoint
        </p>
      </div>

      {/* User Info Overview Card */}
      <div className="p-6 rounded-3xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 shadow-sm flex flex-col sm:flex-row items-center gap-6">
        <img
          src={user?.avatar || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80'}
          alt={user?.name}
          className="w-20 h-20 rounded-full object-cover ring-4 ring-blue-500/20"
        />

        <div className="flex-1 text-center sm:text-left space-y-1">
          <div className="flex items-center justify-center sm:justify-start gap-2">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">{user?.name}</h2>
            <span className="px-2 py-0.5 rounded-md bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300 font-extrabold text-[10px]">
              {user?.role || 'Lead Data Analyst'}
            </span>
          </div>
          <p className="text-xs text-gray-500">{user?.email}</p>
          <p className="text-[11px] text-gray-400 font-mono">Member since {user?.joinedDate || '2024-03-15'}</p>
        </div>

        <div className="flex gap-4 text-center text-xs border-t sm:border-t-0 sm:border-l border-gray-100 dark:border-gray-800 pt-4 sm:pt-0 sm:pl-6">
          <div>
            <span className="block text-lg font-bold text-blue-600 dark:text-blue-400 font-mono">
              {user?.stats?.totalPredictions || 142}
            </span>
            <span className="text-gray-400 text-[10px]">Predictions</span>
          </div>
          <div>
            <span className="block text-lg font-bold text-emerald-600 dark:text-emerald-400 font-mono">
              {user?.stats?.accuracyRate || 98.4}%
            </span>
            <span className="text-gray-400 text-[10px]">Accuracy</span>
          </div>
        </div>
      </div>

      {/* Main Settings Form */}
      <form onSubmit={handleSave} className="space-y-6">
        
        {/* Account Details */}
        <div className="p-6 rounded-3xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 shadow-sm space-y-4">
          <h2 className="text-base font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-blue-500" />
            Account Details
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                Display Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-2.5 text-sm rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500/50"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2.5 text-sm rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500/50"
              />
            </div>
          </div>
        </div>

        {/* API & Backend Service Settings */}
        <div className="p-6 rounded-3xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 shadow-sm space-y-4">
          <h2 className="text-base font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <Key className="w-4 h-4 text-purple-500" />
            API & Backend Integration Settings
          </h2>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                Personal API Secret Key
              </label>
              <input
                type="text"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                className="w-full px-4 py-2.5 text-sm font-mono rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500/50"
              />
              <p className="text-[11px] text-gray-400 mt-1">Use this key for programmatic API access to sentiment prediction endpoints.</p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                Custom Backend Endpoint URL (FastAPI / Flask / Node)
              </label>
              <input
                type="url"
                value={customApiUrl}
                onChange={(e) => setCustomApiUrl(e.target.value)}
                className="w-full px-4 py-2.5 text-sm font-mono rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500/50"
              />
              <p className="text-[11px] text-gray-400 mt-1">
                The frontend automatically connects to this URL when a custom API server is available, falling back to instant client inference.
              </p>
            </div>
          </div>
        </div>

        {/* Theme Settings */}
        <div className="p-6 rounded-3xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 shadow-sm space-y-4">
          <h2 className="text-base font-bold text-gray-900 dark:text-white flex items-center gap-2">
            {isDarkMode ? <Moon className="w-4 h-4 text-amber-400" /> : <Sun className="w-4 h-4 text-indigo-600" />}
            Appearance Preference
          </h2>

          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-gray-900 dark:text-white">Dark Workspace Mode</p>
              <p className="text-xs text-gray-400">Toggle high-contrast dark theme for night analysis</p>
            </div>

            <button
              type="button"
              onClick={toggleTheme}
              className={`w-14 h-7 rounded-full transition-colors relative p-1 ${
                isDarkMode ? 'bg-blue-600' : 'bg-gray-300'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full bg-white shadow-md transition-transform ${
                  isDarkMode ? 'translate-x-7' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="px-6 py-3 rounded-xl fk-gradient font-bold text-white text-sm shadow-md hover:opacity-95 disabled:opacity-50 transition-all flex items-center gap-2"
        >
          <Save className="w-4 h-4" /> Save Profile Changes
        </button>

      </form>

    </div>
  );
};

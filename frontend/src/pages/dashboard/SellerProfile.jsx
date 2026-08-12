import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Store, Mail, Calendar, Package, Shield, Key, Save } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext';

export const SellerProfile = () => {
  const { user } = useAuth();
  const { addToast } = useNotification();

  const [name, setName] = useState(user?.name || 'Pal Gabani');
  const [email, setEmail] = useState(user?.email || 'palgabani65@gmail.com');
  const [storeName, setStoreName] = useState(user?.storeName || 'Gabani Electronics');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');

  const handleSave = (e) => {
    e.preventDefault();
    addToast('Profile updated successfully!', 'success');
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-8">
      {/* Header */}
      <div>
        <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">Seller Profile</h2>
        <p className="text-xs text-slate-500 dark:text-[#9494A8] mt-1 font-medium">Manage your business information, account security, and preferences.</p>
      </div>

      {/* Profile Overview */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-6 rounded-2xl bg-white dark:bg-[#1C1C26] border border-[#E6E4F0] dark:border-[#282836] shadow-xs"
      >
        <div className="flex items-center gap-4 pb-5 border-b border-slate-100 dark:border-[#282836]">
          <div className="w-14 h-14 rounded-2xl bg-[#111116] dark:bg-[#2563EB] text-white font-black text-xl flex items-center justify-center shadow-md">
            {name.charAt(0).toUpperCase()}
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">{name}</h3>
            <p className="text-xs text-slate-500 dark:text-[#9494A8]">{email}</p>
            <div className="flex items-center gap-1 mt-1 font-mono">
              <Store className="w-3.5 h-3.5 text-[#111116] dark:text-[#8B5CF6]" />
              <span className="text-[11px] font-bold text-slate-900 dark:text-white">{storeName}</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-5">
          <div className="text-center">
            <p className="text-xl font-extrabold text-slate-900 dark:text-white font-mono">24</p>
            <p className="text-[10px] text-slate-400 font-mono uppercase">Products</p>
          </div>
          <div className="text-center">
            <p className="text-xl font-extrabold text-slate-900 dark:text-white font-mono">57,534</p>
            <p className="text-[10px] text-slate-400 font-mono uppercase">Reviews</p>
          </div>
          <div className="text-center">
            <p className="text-xl font-extrabold text-[#16A34A] dark:text-[#22C55E] font-mono">56.7%</p>
            <p className="text-[10px] text-slate-400 font-mono uppercase">Positive</p>
          </div>
          <div className="text-center">
            <p className="text-xl font-extrabold text-slate-900 dark:text-white font-mono">Jan 2024</p>
            <p className="text-[10px] text-slate-400 font-mono uppercase">Joined</p>
          </div>
        </div>
      </motion.div>

      {/* Business Information */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.08 }}
        className="p-6 rounded-2xl bg-white dark:bg-[#1C1C26] border border-[#E6E4F0] dark:border-[#282836] shadow-xs"
      >
        <h3 className="text-base font-extrabold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
          <Store className="w-4 h-4 text-[#111116] dark:text-[#8B5CF6]" />
          Business Information
        </h3>
        <form onSubmit={handleSave} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1.5 font-mono">Full Name</label>
              <input type="text" value={name} onChange={(e) => setName(e.target.value)}
                className="w-full p-3 rounded-xl bg-slate-50 dark:bg-[#242432] border border-[#E6E4F0] dark:border-[#282836] text-xs font-semibold text-slate-900 dark:text-white outline-none focus:border-[#111116]" />
            </div>
            <div>
              <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1.5 font-mono">Store Name</label>
              <input type="text" value={storeName} onChange={(e) => setStoreName(e.target.value)}
                className="w-full p-3 rounded-xl bg-slate-50 dark:bg-[#242432] border border-[#E6E4F0] dark:border-[#282836] text-xs font-semibold text-slate-900 dark:text-white outline-none focus:border-[#111116]" />
            </div>
          </div>
          <div>
            <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1.5 font-mono">Email Address</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 rounded-xl bg-slate-50 dark:bg-[#242432] border border-[#E6E4F0] dark:border-[#282836] text-xs font-semibold text-slate-900 dark:text-white outline-none focus:border-[#111116]" />
          </div>
          <button type="submit"
            className="px-5 py-2.5 rounded-xl bg-[#111116] hover:bg-black dark:bg-[#2563EB] dark:hover:bg-[#1D4ED8] text-white font-extrabold text-xs flex items-center gap-2 shadow-md transition-all cursor-pointer">
            <Save className="w-4 h-4" /> Save Changes
          </button>
        </form>
      </motion.div>

      {/* Account Security */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.16 }}
        className="p-6 rounded-2xl bg-white dark:bg-[#1C1C26] border border-[#E6E4F0] dark:border-[#282836] shadow-xs"
      >
        <h3 className="text-base font-extrabold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
          <Shield className="w-4 h-4 text-[#111116] dark:text-[#8B5CF6]" />
          Account Security
        </h3>
        <div className="space-y-4">
          <div>
            <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1.5 font-mono">Current Password</label>
            <input type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)}
              className="w-full p-3 rounded-xl bg-slate-50 dark:bg-[#242432] border border-[#E6E4F0] dark:border-[#282836] text-xs font-semibold text-slate-900 dark:text-white outline-none focus:border-[#111116]" />
          </div>
          <div>
            <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1.5 font-mono">New Password</label>
            <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)}
              className="w-full p-3 rounded-xl bg-slate-50 dark:bg-[#242432] border border-[#E6E4F0] dark:border-[#282836] text-xs font-semibold text-slate-900 dark:text-white outline-none focus:border-[#111116]" />
          </div>
          <button
            onClick={() => addToast('Password changed successfully', 'success')}
            className="px-5 py-2.5 rounded-xl bg-slate-900 dark:bg-[#242432] hover:bg-black text-white font-bold text-xs flex items-center gap-2 transition-all cursor-pointer">
            <Key className="w-4 h-4" /> Change Password
          </button>
        </div>
      </motion.div>
    </div>
  );
};

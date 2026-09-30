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
  const [storeName, setStoreName] = useState(user?.storeName || 'Apex Electronics');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');

  const handleSave = (e) => {
    e.preventDefault();
    addToast('Profile updated successfully!', 'success');
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-8 font-sans text-[#191C1D] dark:text-white transition-colors">
      {/* Header */}
      <div>
        <h2 className="text-2xl sm:text-3xl font-bold text-[#191C1D] dark:text-white tracking-tight font-sans">Seller Profile</h2>
        <p className="text-xs text-[#5C5F62] dark:text-[#A0A4A8] mt-1 font-mono">Manage your business information, account security, and preferences.</p>
      </div>

      {/* Profile Overview */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-6 rounded-2xl bg-white dark:bg-[#191C1D] border border-[#E5E7EB] dark:border-[#2E3132] shadow-[0_4px_20px_rgba(0,0,0,0.04)] dark:shadow-none font-sans"
      >
        <div className="flex items-center gap-4 pb-5 border-b border-[#E5E7EB] dark:border-[#2E3132]">
          <div className="w-14 h-14 rounded-full bg-[#000000] dark:bg-white text-white dark:text-black font-bold text-xl flex items-center justify-center shadow-xs">
            {name.charAt(0).toUpperCase()}
          </div>
          <div>
            <h3 className="text-lg font-bold text-[#191C1D] dark:text-white font-sans">{name}</h3>
            <p className="text-xs text-[#5C5F62] dark:text-[#A0A4A8] font-mono">{email}</p>
            <div className="flex items-center gap-1 mt-1 font-mono">
              <Store className="w-3.5 h-3.5 text-[#000000] dark:text-white" />
              <span className="text-[11px] font-semibold text-[#191C1D] dark:text-white">{storeName}</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-5">
          <div className="text-center p-3 rounded-xl bg-[#F8F9FA] dark:bg-[#242729] border border-[#EDEEEF] dark:border-[#33373B]">
            <p className="text-xl font-bold text-[#191C1D] dark:text-white font-mono">24</p>
            <p className="text-[10px] text-[#5C5F62] dark:text-[#A0A4A8] font-mono uppercase">Products</p>
          </div>
          <div className="text-center p-3 rounded-xl bg-[#F8F9FA] dark:bg-[#242729] border border-[#EDEEEF] dark:border-[#33373B]">
            <p className="text-xl font-bold text-[#191C1D] dark:text-white font-mono">57,534</p>
            <p className="text-[10px] text-[#5C5F62] dark:text-[#A0A4A8] font-mono uppercase">Reviews</p>
          </div>
          <div className="text-center p-3 rounded-xl bg-[#F8F9FA] dark:bg-[#242729] border border-[#EDEEEF] dark:border-[#33373B]">
            <p className="text-xl font-bold text-[#000000] dark:text-white font-mono">56.7%</p>
            <p className="text-[10px] text-[#5C5F62] dark:text-[#A0A4A8] font-mono uppercase">Positive</p>
          </div>
          <div className="text-center p-3 rounded-xl bg-[#F8F9FA] dark:bg-[#242729] border border-[#EDEEEF] dark:border-[#33373B]">
            <p className="text-xl font-bold text-[#191C1D] dark:text-white font-mono">Jan 2024</p>
            <p className="text-[10px] text-[#5C5F62] dark:text-[#A0A4A8] font-mono uppercase">Joined</p>
          </div>
        </div>
      </motion.div>

      {/* Business Information */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.08 }}
        className="p-6 rounded-2xl bg-white dark:bg-[#191C1D] border border-[#E5E7EB] dark:border-[#2E3132] shadow-[0_4px_20px_rgba(0,0,0,0.04)] dark:shadow-none font-sans"
      >
        <h3 className="text-base font-bold text-[#191C1D] dark:text-white mb-4 flex items-center gap-2 font-sans">
          <Store className="w-4 h-4 text-[#000000] dark:text-white" />
          Business Information
        </h3>
        <form onSubmit={handleSave} className="space-y-4 font-sans">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-[10px] font-semibold uppercase tracking-wider text-[#5C5F62] dark:text-[#A0A4A8] block mb-1.5 font-mono">Full Name</label>
              <input type="text" value={name} onChange={(e) => setName(e.target.value)}
                className="w-full p-3 rounded-xl bg-[#F8F9FA] dark:bg-[#242729] border border-[#E5E7EB] dark:border-[#33373B] text-xs font-medium text-[#191C1D] dark:text-white outline-none focus:border-[#000000] dark:focus:border-white transition-colors" />
            </div>
            <div>
              <label className="text-[10px] font-semibold uppercase tracking-wider text-[#5C5F62] dark:text-[#A0A4A8] block mb-1.5 font-mono">Store Name</label>
              <input type="text" value={storeName} onChange={(e) => setStoreName(e.target.value)}
                className="w-full p-3 rounded-xl bg-[#F8F9FA] dark:bg-[#242729] border border-[#E5E7EB] dark:border-[#33373B] text-xs font-medium text-[#191C1D] dark:text-white outline-none focus:border-[#000000] dark:focus:border-white transition-colors" />
            </div>
          </div>
          <div>
            <label className="text-[10px] font-semibold uppercase tracking-wider text-[#5C5F62] dark:text-[#A0A4A8] block mb-1.5 font-mono">Email Address</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 rounded-xl bg-[#F8F9FA] dark:bg-[#242729] border border-[#E5E7EB] dark:border-[#33373B] text-xs font-medium text-[#191C1D] dark:text-white outline-none focus:border-[#000000] dark:focus:border-white transition-colors font-mono" />
          </div>
          <button type="submit"
            className="px-5 py-2.5 rounded-lg bg-[#000000] dark:bg-white hover:bg-[#1B1B1B] dark:hover:bg-slate-100 text-white dark:text-black font-semibold font-mono text-xs flex items-center gap-2 shadow-xs transition-colors cursor-pointer">
            <Save className="w-4 h-4" /> Save Changes
          </button>
        </form>
      </motion.div>

      {/* Account Security */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.16 }}
        className="p-6 rounded-2xl bg-white dark:bg-[#191C1D] border border-[#E5E7EB] dark:border-[#2E3132] shadow-[0_4px_20px_rgba(0,0,0,0.04)] dark:shadow-none font-sans"
      >
        <h3 className="text-base font-bold text-[#191C1D] dark:text-white mb-4 flex items-center gap-2 font-sans">
          <Shield className="w-4 h-4 text-[#000000] dark:text-white" />
          Account Security
        </h3>
        <div className="space-y-4 font-sans">
          <div>
            <label className="text-[10px] font-semibold uppercase tracking-wider text-[#5C5F62] dark:text-[#A0A4A8] block mb-1.5 font-mono">Current Password</label>
            <input type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)}
              className="w-full p-3 rounded-xl bg-[#F8F9FA] dark:bg-[#242729] border border-[#E5E7EB] dark:border-[#33373B] text-xs font-medium text-[#191C1D] dark:text-white outline-none focus:border-[#000000] dark:focus:border-white transition-colors font-mono" />
          </div>
          <div>
            <label className="text-[10px] font-semibold uppercase tracking-wider text-[#5C5F62] dark:text-[#A0A4A8] block mb-1.5 font-mono">New Password</label>
            <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)}
              className="w-full p-3 rounded-xl bg-[#F8F9FA] dark:bg-[#242729] border border-[#E5E7EB] dark:border-[#33373B] text-xs font-medium text-[#191C1D] dark:text-white outline-none focus:border-[#000000] dark:focus:border-white transition-colors font-mono" />
          </div>
          <button
            onClick={() => addToast('Password changed successfully', 'success')}
            className="px-5 py-2.5 rounded-lg bg-[#000000] dark:bg-white hover:bg-[#1B1B1B] dark:hover:bg-slate-100 text-white dark:text-black font-semibold font-mono text-xs flex items-center gap-2 shadow-xs transition-colors cursor-pointer">
            <Key className="w-4 h-4" /> Change Password
          </button>
        </div>
      </motion.div>
    </div>
  );
};

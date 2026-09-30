import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, Search, MoreHorizontal, Eye, Ban, CheckCircle2, Trash2, Store } from 'lucide-react';
import { api } from '../../services/api';
import { useNotification } from '../../context/NotificationContext';

const SELLERS = [
  { id: 's1', name: 'Pal Gabani', store: 'Apex Electronics', email: 'palgabani65@gmail.com', products: 24, reviews: 12486, joined: 'Jan 2024', status: 'active' },
  { id: 's2', name: 'Rahul Sharma', store: 'TechWorld India', email: 'rahul.sharma@email.com', products: 18, reviews: 8932, joined: 'Mar 2024', status: 'active' },
  { id: 's3', name: 'Priya Patel', store: 'SmartGadgets', email: 'priya.patel@email.com', products: 12, reviews: 5241, joined: 'May 2024', status: 'active' },
  { id: 's4', name: 'Amit Kumar', store: 'Budget Bazaar', email: 'amit.kumar@email.com', products: 31, reviews: 15672, joined: 'Dec 2023', status: 'active' },
  { id: 's5', name: 'Sneha Reddy', store: 'Reddy Retail', email: 'sneha.reddy@email.com', products: 8, reviews: 2134, joined: 'Jul 2024', status: 'suspended' },
  { id: 's6', name: 'Vikram Singh', store: 'Singh Store', email: 'vikram.s@email.com', products: 5, reviews: 876, joined: 'Aug 2024', status: 'active' },
];

export const AdminSellers = () => {
  const { addToast } = useNotification();
  const [search, setSearch] = useState('');
  const [actionMenu, setActionMenu] = useState(null);
  const [sellersList, setSellersList] = useState(SELLERS);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await api.get('/users');
        if (res.data?.users?.length > 0) {
          const mapped = res.data.users.map((u, i) => ({
            id: u.id || `s_${i}`,
            name: u.name || 'User',
            store: u.name?.toLowerCase().includes('admin') ? 'Platform Admin' : 'Apex Electronics',
            email: u.email,
            products: 24,
            reviews: 12486,
            joined: u.created_at ? new Date(u.created_at).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : 'Jan 2024',
            status: 'active'
          }));
          setSellersList(mapped);
        }
      } catch (e) {
        console.warn('Using local sellers for admin:', e.message);
      }
    };
    fetchUsers();
  }, []);

  const handleDeleteSeller = async (sellerId) => {
    try {
      await api.delete(`/users/${sellerId}`);
      setSellersList(prev => prev.filter(s => s.id !== sellerId));
      addToast('User deleted successfully from database', 'info');
    } catch (err) {
      setSellersList(prev => prev.filter(s => s.id !== sellerId));
      addToast('User removed from view', 'info');
    }
    setActionMenu(null);
  };

  const handleToggleSuspend = (sellerId) => {
    setSellersList(prev => prev.map(s => {
      if (s.id === sellerId) {
        const newStatus = s.status === 'active' ? 'suspended' : 'active';
        addToast(`Seller status updated to ${newStatus}`, 'info');
        return { ...s, status: newStatus };
      }
      return s;
    }));
    setActionMenu(null);
  };

  const filtered = sellersList.filter(s =>
    (s.name || '').toLowerCase().includes(search.toLowerCase()) ||
    (s.store || '').toLowerCase().includes(search.toLowerCase()) ||
    (s.email || '').toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 pb-8 font-sans text-[#191C1D] dark:text-white transition-colors">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold text-[#191C1D] dark:text-white tracking-tight font-sans">Seller Management</h2>
          <p className="text-xs text-[#5C5F62] dark:text-[#A0A4A8] mt-1 font-mono">Manage all registered sellers on the FlipSentiment platform.</p>
        </div>
        <span className="px-3 py-1 rounded-md bg-[#F3F4F5] dark:bg-[#242729] border border-[#E5E7EB] dark:border-[#33373B] text-[#191C1D] dark:text-white text-[11px] font-semibold font-mono">
          {sellersList.length} Sellers
        </span>
      </div>

      {/* Search */}
      <div className="p-4 rounded-2xl bg-white dark:bg-[#191C1D] border border-[#E5E7EB] dark:border-[#2E3132] shadow-[0_4px_20px_rgba(0,0,0,0.04)] dark:shadow-none">
        <div className="relative max-w-sm">
          <Search className="w-3.5 h-3.5 text-[#5C5F62] dark:text-[#A0A4A8] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search sellers..."
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-[#F8F9FA] dark:bg-[#242729] text-xs font-mono text-[#191C1D] dark:text-white outline-none border border-[#E5E7EB] dark:border-[#33373B] focus:border-[#000000] dark:focus:border-white transition-colors placeholder:text-[#5C5F62] dark:placeholder:text-[#848484]"
          />
        </div>
      </div>

      {/* Table */}
      <div className="rounded-2xl bg-white dark:bg-[#191C1D] border border-[#E5E7EB] dark:border-[#2E3132] shadow-[0_4px_20px_rgba(0,0,0,0.04)] dark:shadow-none overflow-hidden font-sans">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-[#E5E7EB] dark:border-[#2E3132] bg-[#F8F9FA] dark:bg-[#242729]">
                <th className="py-3.5 px-5 text-[10px] font-semibold uppercase tracking-wider text-[#5C5F62] dark:text-[#A0A4A8] font-mono">Seller</th>
                <th className="py-3.5 px-4 text-[10px] font-semibold uppercase tracking-wider text-[#5C5F62] dark:text-[#A0A4A8] font-mono">Store</th>
                <th className="py-3.5 px-4 text-[10px] font-semibold uppercase tracking-wider text-[#5C5F62] dark:text-[#A0A4A8] font-mono">Email</th>
                <th className="py-3.5 px-4 text-[10px] font-semibold uppercase tracking-wider text-[#5C5F62] dark:text-[#A0A4A8] font-mono">Products</th>
                <th className="py-3.5 px-4 text-[10px] font-semibold uppercase tracking-wider text-[#5C5F62] dark:text-[#A0A4A8] font-mono">Reviews</th>
                <th className="py-3.5 px-4 text-[10px] font-semibold uppercase tracking-wider text-[#5C5F62] dark:text-[#A0A4A8] font-mono">Joined</th>
                <th className="py-3.5 px-4 text-[10px] font-semibold uppercase tracking-wider text-[#5C5F62] dark:text-[#A0A4A8] font-mono">Status</th>
                <th className="py-3.5 px-4 text-[10px] font-semibold uppercase tracking-wider text-[#5C5F62] dark:text-[#A0A4A8] font-mono">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5E7EB] dark:divide-[#2E3132]">
              {filtered.map((seller) => (
                <tr key={seller.id} className="hover:bg-[#F8F9FA] dark:hover:bg-[#242729] transition-colors">
                  <td className="py-4 px-5">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-[#000000] dark:bg-white text-white dark:text-black text-xs font-bold flex items-center justify-center shadow-xs">
                        {seller.name.charAt(0)}
                      </div>
                      <span className="text-xs font-bold text-[#191C1D] dark:text-white font-sans">{seller.name}</span>
                    </div>
                  </td>
                  <td className="py-4 px-4 text-xs text-[#5C5F62] dark:text-[#A0A4A8] font-medium font-sans">{seller.store}</td>
                  <td className="py-4 px-4 text-xs text-[#5C5F62] dark:text-[#A0A4A8] font-mono">{seller.email}</td>
                  <td className="py-4 px-4 text-xs font-semibold text-[#191C1D] dark:text-white font-mono">{seller.products}</td>
                  <td className="py-4 px-4 text-xs font-semibold text-[#191C1D] dark:text-white font-mono">{seller.reviews.toLocaleString()}</td>
                  <td className="py-4 px-4 text-[11px] text-[#5C5F62] dark:text-[#A0A4A8] font-mono">{seller.joined}</td>
                  <td className="py-4 px-4">
                    <span className={`px-2.5 py-0.5 rounded-md text-[10px] font-semibold font-mono border ${
                      seller.status === 'active'
                        ? 'bg-[#F3F4F5] dark:bg-[#242729] border-[#E5E7EB] dark:border-[#33373B] text-[#000000] dark:text-white'
                        : 'bg-rose-50 dark:bg-rose-950/30 border-rose-200/60 dark:border-rose-900/40 text-[#BA1A1A] dark:text-red-400'
                    }`}>
                      {seller.status.charAt(0).toUpperCase() + seller.status.slice(1)}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <div className="relative">
                      <button
                        onClick={() => setActionMenu(actionMenu === seller.id ? null : seller.id)}
                        className="p-1.5 rounded-lg text-[#5C5F62] hover:text-[#191C1D] dark:text-[#A0A4A8] dark:hover:text-white hover:bg-[#F8F9FA] dark:hover:bg-[#242729] transition-colors cursor-pointer"
                      >
                        <MoreHorizontal className="w-4 h-4" />
                      </button>
                      {actionMenu === seller.id && (
                        <div className="absolute right-0 mt-1 w-40 rounded-xl bg-white dark:bg-[#191C1D] border border-[#E5E7EB] dark:border-[#2E3132] shadow-xl p-1.5 z-50 font-sans">
                          <button 
                            onClick={() => {
                              addToast(`Viewing details for ${seller.name} (${seller.store})`, 'info');
                              setActionMenu(null);
                            }}
                            className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium text-[#191C1D] dark:text-white hover:bg-[#F8F9FA] dark:hover:bg-[#242729] transition-colors cursor-pointer"
                          >
                            <Eye className="w-3.5 h-3.5" /> View Seller
                          </button>
                          <button 
                            onClick={() => handleToggleSuspend(seller.id)}
                            className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-950/40 transition-colors cursor-pointer"
                          >
                            <Ban className="w-3.5 h-3.5" /> {seller.status === 'active' ? 'Suspend' : 'Activate'}
                          </button>
                          <button 
                            onClick={() => handleDeleteSeller(seller.id)}
                            className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium text-[#BA1A1A] dark:text-red-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" /> Delete
                          </button>
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

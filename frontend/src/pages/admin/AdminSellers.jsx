import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Users, Search, MoreHorizontal, Eye, Ban, CheckCircle2, Trash2, Store } from 'lucide-react';

const SELLERS = [
  { id: 's1', name: 'Pal Gabani', store: 'Gabani Electronics', email: 'palgabani65@gmail.com', products: 24, reviews: 12486, joined: 'Jan 2024', status: 'active' },
  { id: 's2', name: 'Rahul Sharma', store: 'TechWorld India', email: 'rahul.sharma@email.com', products: 18, reviews: 8932, joined: 'Mar 2024', status: 'active' },
  { id: 's3', name: 'Priya Patel', store: 'SmartGadgets', email: 'priya.patel@email.com', products: 12, reviews: 5241, joined: 'May 2024', status: 'active' },
  { id: 's4', name: 'Amit Kumar', store: 'Budget Bazaar', email: 'amit.kumar@email.com', products: 31, reviews: 15672, joined: 'Dec 2023', status: 'active' },
  { id: 's5', name: 'Sneha Reddy', store: 'Reddy Retail', email: 'sneha.reddy@email.com', products: 8, reviews: 2134, joined: 'Jul 2024', status: 'suspended' },
  { id: 's6', name: 'Vikram Singh', store: 'Singh Store', email: 'vikram.s@email.com', products: 5, reviews: 876, joined: 'Aug 2024', status: 'active' },
];

export const AdminSellers = () => {
  const [search, setSearch] = useState('');
  const [actionMenu, setActionMenu] = useState(null);

  const filtered = SELLERS.filter(s =>
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    s.store.toLowerCase().includes(search.toLowerCase()) ||
    s.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 pb-8">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight">Seller Management</h2>
          <p className="text-xs text-slate-400 mt-1">Manage all registered sellers on the FlipSentiment platform.</p>
        </div>
        <span className="px-3 py-1 rounded-full bg-cyan-50 dark:bg-[#22D3EE]/20 text-cyan-700 dark:text-[#22D3EE] text-[11px] font-bold font-mono">
          {SELLERS.length} Sellers
        </span>
      </div>

      {/* Search */}
      <div className="p-4 rounded-2xl bg-white dark:bg-[#0F111A] border border-slate-200/80 dark:border-[#252A3A] shadow-sm">
        <div className="relative max-w-sm">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search sellers..."
            className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-slate-50 dark:bg-[#090D16] text-xs font-medium text-slate-900 dark:text-white outline-none border border-slate-200 dark:border-[#252A3A] focus:border-[#22D3EE] transition-colors placeholder:text-slate-400"
          />
        </div>
      </div>

      {/* Table */}
      <div className="rounded-2xl bg-white dark:bg-[#0F111A] border border-slate-200/80 dark:border-[#252A3A] shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-slate-200/80 dark:border-[#252A3A] bg-slate-50/60 dark:bg-[#090D16]/50">
                <th className="py-3.5 px-5 text-[10px] font-bold uppercase tracking-wider text-slate-400 font-mono">Seller</th>
                <th className="py-3.5 px-4 text-[10px] font-bold uppercase tracking-wider text-slate-400 font-mono">Store</th>
                <th className="py-3.5 px-4 text-[10px] font-bold uppercase tracking-wider text-slate-400 font-mono">Email</th>
                <th className="py-3.5 px-4 text-[10px] font-bold uppercase tracking-wider text-slate-400 font-mono">Products</th>
                <th className="py-3.5 px-4 text-[10px] font-bold uppercase tracking-wider text-slate-400 font-mono">Reviews</th>
                <th className="py-3.5 px-4 text-[10px] font-bold uppercase tracking-wider text-slate-400 font-mono">Joined</th>
                <th className="py-3.5 px-4 text-[10px] font-bold uppercase tracking-wider text-slate-400 font-mono">Status</th>
                <th className="py-3.5 px-4 text-[10px] font-bold uppercase tracking-wider text-slate-400 font-mono">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-[#252A3A]">
              {filtered.map((seller) => (
                <tr key={seller.id} className="hover:bg-slate-50/50 dark:hover:bg-[#151926]/40 transition-colors">
                  <td className="py-4 px-5">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#22D3EE] to-[#818CF8] text-slate-950 text-xs font-black flex items-center justify-center shadow-sm">
                        {seller.name.charAt(0)}
                      </div>
                      <span className="text-xs font-bold text-slate-900 dark:text-white">{seller.name}</span>
                    </div>
                  </td>
                  <td className="py-4 px-4 text-xs text-slate-500 dark:text-slate-400 font-medium">{seller.store}</td>
                  <td className="py-4 px-4 text-xs text-slate-500 dark:text-slate-400 font-mono">{seller.email}</td>
                  <td className="py-4 px-4 text-xs font-bold text-slate-700 dark:text-slate-300 font-mono">{seller.products}</td>
                  <td className="py-4 px-4 text-xs font-bold text-slate-700 dark:text-slate-300 font-mono">{seller.reviews.toLocaleString()}</td>
                  <td className="py-4 px-4 text-[11px] text-slate-400 font-mono">{seller.joined}</td>
                  <td className="py-4 px-4">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      seller.status === 'active'
                        ? 'bg-cyan-50 dark:bg-[#22D3EE]/20 text-cyan-700 dark:text-[#22D3EE]'
                        : 'bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400'
                    }`}>
                      {seller.status.charAt(0).toUpperCase() + seller.status.slice(1)}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <div className="relative">
                      <button
                        onClick={() => setActionMenu(actionMenu === seller.id ? null : seller.id)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-[#090D16] transition-colors cursor-pointer"
                      >
                        <MoreHorizontal className="w-4 h-4" />
                      </button>
                      {actionMenu === seller.id && (
                        <div className="absolute right-0 mt-1 w-40 rounded-xl bg-white dark:bg-[#0B0D16] border border-slate-200 dark:border-[#252A3A] shadow-xl p-1.5 z-50">
                          <button className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-[#151926] transition-colors cursor-pointer">
                            <Eye className="w-3.5 h-3.5" /> View Seller
                          </button>
                          <button className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-950/40 transition-colors cursor-pointer">
                            <Ban className="w-3.5 h-3.5" /> Suspend
                          </button>
                          <button className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors cursor-pointer">
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

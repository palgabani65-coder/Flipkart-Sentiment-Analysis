import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Bell, 
  User, 
  LogOut, 
  Settings, 
  Shield, 
  Menu, 
  Search,
  Moon,
  Sun,
  Store,
  CheckCircle2,
  Plus,
  Download
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { useNotification } from '../../context/NotificationContext';

export const DashboardHeader = ({ title = 'Overview', subtitle = "Welcome back! Here's what's happening with your products today.", onOpenMobileMenu }) => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { addToast } = useNotification();
  const navigate = useNavigate();

  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const menuRef = useRef(null);
  const notifRef = useRef(null);

  const userName = user?.name || 'Store Manager';
  const userEmail = user?.email || 'palgabani65@gmail.com';
  const userRole = user?.role || 'user';
  const storeName = user?.storeName || 'Gabani Electronics';

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setShowUserMenu(false);
      }
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setShowNotifications(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    addToast('Logged out successfully', 'info');
    navigate('/login');
  };

  const sampleNotifications = [
    { id: 1, title: 'Negative reviews increased for Product X', desc: 'Connectivity issues reported in 12 new reviews.', time: '10m ago', unread: true },
    { id: 2, title: 'New sentiment trend detected', desc: 'Battery performance satisfaction dropped by 4.2%.', time: '1h ago', unread: true },
  ];

  return (
    <header className="h-[72px] px-5 lg:px-8 bg-white/90 dark:bg-[#16161E]/90 backdrop-blur-md border-b border-[#E6E4F0] dark:border-[#282836] flex items-center justify-between sticky top-0 z-30 transition-colors">
      
      {/* Left: Mobile Menu & Header Greetings */}
      <div className="flex items-center gap-4">
        <button
          onClick={onOpenMobileMenu}
          className="lg:hidden p-2 rounded-xl text-slate-600 dark:text-white hover:bg-slate-100 dark:hover:bg-[#1C1C26] transition-colors"
          aria-label="Open Navigation Menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Search Input Bar (Reference Emaily Design Spec - Pure white rounded pill) */}
        <div className="relative hidden md:block w-72 lg:w-96">
          <Search className="w-4 h-4 text-slate-400 dark:text-[#9494A8] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search products, reviews, topics..."
            className="w-full pl-10 pr-4 py-2 rounded-full bg-white dark:bg-[#242432] border border-[#E6E4F0] dark:border-[#282836] text-xs font-medium text-slate-900 dark:text-white outline-none transition-all placeholder:text-slate-400 dark:placeholder:text-[#9494A8] shadow-xs focus:border-[#111116] dark:focus:border-[#2563EB]"
          />
        </div>
      </div>

      {/* Right Controls: Action Button (Export/Analyze), Notifications, Theme, Profile Dropdown */}
      <div className="flex items-center gap-3">
        
        {/* Solid Dark Action Button (Matching 'Export CSV' in reference image) */}
        <button
          onClick={() => navigate('/dashboard/reviews')}
          className="px-4 py-2 rounded-xl bg-[#111116] hover:bg-black dark:bg-[#2563EB] dark:hover:bg-[#1D4ED8] text-white font-extrabold text-xs flex items-center gap-2 shadow-md transition-transform hover:scale-[1.02] cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span className="hidden sm:inline">Analyze Review</span>
        </button>

        {/* Notification Bell */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2 rounded-xl text-slate-500 dark:text-[#9494A8] hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-[#1C1C26] transition-colors cursor-pointer"
            aria-label="Notifications"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#EF4444]" />
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 rounded-2xl bg-white dark:bg-[#1C1C26] border border-[#E6E4F0] dark:border-[#282836] shadow-2xl p-4 z-50">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-[#282836]">
                <span className="text-xs font-bold text-slate-900 dark:text-white">Notifications</span>
                <span className="text-[10px] font-bold text-white bg-[#111116] dark:bg-[#2563EB] px-2 py-0.5 rounded-md">
                  2 New
                </span>
              </div>
              <div className="divide-y divide-slate-100 dark:divide-[#282836] mt-2 max-h-60 overflow-y-auto">
                {sampleNotifications.map((n) => (
                  <div key={n.id} className="py-2.5 px-1 flex items-start gap-2.5 rounded-xl">
                    <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-[#111116] dark:text-[#2563EB]" />
                    <div className="flex-1">
                      <p className="text-xs font-bold text-slate-900 dark:text-white">{n.title}</p>
                      <p className="text-[11px] text-slate-500 dark:text-[#9494A8]">{n.desc}</p>
                      <span className="text-[9px] text-slate-400 font-mono mt-1 block">{n.time}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="p-2 rounded-xl text-slate-500 dark:text-[#9494A8] hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-[#1C1C26] transition-colors cursor-pointer"
          title="Toggle Theme"
        >
          {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
        </button>

        {/* Profile Dropdown */}
        <div className="relative" ref={menuRef}>
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="flex items-center gap-2 p-1 rounded-xl hover:bg-slate-100 dark:hover:bg-[#1C1C26] transition-all cursor-pointer"
          >
            <div className="w-8 h-8 rounded-lg bg-[#111116] dark:bg-[#2563EB] text-white font-extrabold text-xs flex items-center justify-center shadow-xs">
              {userName.charAt(0).toUpperCase()}
            </div>
          </button>

          {showUserMenu && (
            <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-white dark:bg-[#1C1C26] border border-[#E6E4F0] dark:border-[#282836] shadow-2xl p-3 z-50">
              <div className="p-3 mb-2 rounded-xl bg-slate-50 dark:bg-[#242432]">
                <p className="text-xs font-bold text-slate-900 dark:text-white truncate">{userName}</p>
                <p className="text-[10px] text-slate-500 dark:text-[#9494A8] truncate">{userEmail}</p>
                <p className="text-[9px] text-[#111116] dark:text-[#8B5CF6] font-mono font-bold mt-1 flex items-center gap-1">
                  <Store className="w-3 h-3" /> {storeName}
                </p>
              </div>

              <div className="space-y-0.5">
                <Link
                  to="/dashboard/profile"
                  onClick={() => setShowUserMenu(false)}
                  className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-slate-600 dark:text-[#9494A8] hover:bg-slate-100 dark:hover:bg-[#242432] transition-colors"
                >
                  <User className="w-4 h-4 text-slate-400" />
                  <span>Profile</span>
                </Link>

                <Link
                  to="/dashboard/settings"
                  onClick={() => setShowUserMenu(false)}
                  className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-slate-600 dark:text-[#9494A8] hover:bg-slate-100 dark:hover:bg-[#242432] transition-colors"
                >
                  <Settings className="w-4 h-4 text-slate-400" />
                  <span>Settings</span>
                </Link>

                {userRole === 'admin' && (
                  <Link
                    to="/admin"
                    onClick={() => setShowUserMenu(false)}
                    className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold text-[#2563EB] dark:text-[#8B5CF6] hover:bg-blue-50 dark:hover:bg-[#2563EB]/20 transition-colors"
                  >
                    <Shield className="w-4 h-4" />
                    <span>Admin Console</span>
                  </Link>
                )}
              </div>

              <div className="pt-2 mt-2 border-t border-slate-100 dark:border-[#282836]">
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-[#EF4444] hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Logout</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

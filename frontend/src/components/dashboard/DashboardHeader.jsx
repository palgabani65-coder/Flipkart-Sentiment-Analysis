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
  HelpCircle,
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
  const storeName = user?.storeName || 'Apex Electronics';

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
    <header className="h-[72px] px-5 lg:px-8 bg-white/90 dark:bg-[#191C1D]/90 backdrop-blur-md border-b border-[#E5E7EB] dark:border-[#2E3132] flex items-center justify-between sticky top-0 z-30 transition-colors font-sans">

      {/* Left: Mobile Menu & Search */}
      <div className="flex items-center gap-4">
        <button
          onClick={onOpenMobileMenu}
          className="lg:hidden p-2 rounded-xl text-[#5C5F62] hover:text-[#191C1D] dark:text-[#A0A4A8] dark:hover:text-white hover:bg-[#F3F4F5] dark:hover:bg-[#2E3132] transition-colors"
          aria-label="Open Navigation Menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Search Input Bar */}
        <div className="relative hidden md:flex items-center bg-white dark:bg-[#242729] border border-[#E5E7EB] dark:border-[#3E4246] rounded-full px-4 py-1.5 focus-within:border-[#000000] dark:focus-within:border-white transition-colors w-64 lg:w-96 shadow-2xs">
          <Search className="w-4 h-4 text-[#5C5F62] dark:text-[#A0A4A8] mr-2 shrink-0" />
          <input
            type="text"
            placeholder="Search insights, products, or reviews..."
            className="bg-transparent border-none outline-none text-xs font-mono text-[#191C1D] dark:text-white placeholder:text-[#5C5F62] dark:placeholder:text-[#848484] w-full p-0 h-6 focus:ring-0"
          />
        </div>
      </div>

      {/* Right Controls: Theme Toggle, Notifications, Help, Profile Dropdown */}
      <div className="flex items-center gap-2">
        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="w-9 h-9 rounded-full flex items-center justify-center text-[#5C5F62] hover:text-[#000000] dark:text-[#A0A4A8] dark:hover:text-white hover:bg-[#F3F4F5] dark:hover:bg-[#2E3132] transition-colors cursor-pointer"
          title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
          aria-label="Toggle dark mode"
        >
          {theme === 'dark' ? (
            <Sun className="w-4 h-4 text-amber-400" />
          ) : (
            <Moon className="w-4 h-4 text-[#5C5F62]" />
          )}
        </button>

        {/* Notification Bell */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="w-9 h-9 rounded-full flex items-center justify-center text-[#5C5F62] hover:text-[#000000] dark:text-[#A0A4A8] dark:hover:text-white hover:bg-[#F3F4F5] dark:hover:bg-[#2E3132] transition-colors cursor-pointer relative"
            aria-label="Notifications"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-[#000000] dark:bg-white" />
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 rounded-2xl bg-white dark:bg-[#1E2123] border border-[#E5E7EB] dark:border-[#33373B] shadow-[0_4px_20px_rgba(0,0,0,0.06)] p-4 z-50">
              <div className="flex items-center justify-between pb-3 border-b border-[#E5E7EB] dark:border-[#33373B]">
                <span className="text-xs font-semibold text-[#191C1D] dark:text-white font-mono">Notifications</span>
                <span className="text-[10px] font-medium text-white dark:text-black bg-[#000000] dark:bg-white px-2 py-0.5 rounded-md font-mono">
                  2 New
                </span>
              </div>
              <div className="divide-y divide-[#E5E7EB] dark:divide-[#33373B] mt-2 max-h-60 overflow-y-auto">
                {sampleNotifications.map((n) => (
                  <div key={n.id} className="py-2.5 px-1 flex items-start gap-2.5 rounded-xl hover:bg-[#F3F4F5] dark:hover:bg-[#2E3132] transition-colors">
                    <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-[#000000] dark:text-white" />
                    <div className="flex-1">
                      <p className="text-xs font-semibold text-[#191C1D] dark:text-white">{n.title}</p>
                      <p className="text-[11px] text-[#5C5F62] dark:text-[#A0A4A8]">{n.desc}</p>
                      <span className="text-[9px] text-[#5C5F62] dark:text-[#848484] font-mono mt-1 block">{n.time}</span>
                    </div>
                  </div>
                ))}
              </div>
              <div className="pt-2 border-t border-[#E5E7EB] dark:border-[#33373B] mt-2 text-center">
                <button
                  onClick={() => {
                    navigate('/dashboard/notifications');
                    setShowNotifications(false);
                  }}
                  className="text-xs font-mono text-[#5C5F62] hover:text-[#000000] dark:text-[#A0A4A8] dark:hover:text-white transition-colors cursor-pointer w-full py-1 text-center font-medium"
                >
                  View All Notifications →
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Help Button */}
        <button
          onClick={() => addToast('FlipSentiment Enterprise documentation active', 'info')}
          className="w-9 h-9 rounded-full flex items-center justify-center text-[#5C5F62] hover:text-[#000000] dark:text-[#A0A4A8] dark:hover:text-white hover:bg-[#F3F4F5] dark:hover:bg-[#2E3132] transition-colors cursor-pointer"
          aria-label="Help"
          title="Help & Documentation"
        >
          <HelpCircle className="w-4 h-4" />
        </button>

        {/* Profile Dropdown */}
        <div className="relative" ref={menuRef}>
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="flex items-center gap-2 p-1 rounded-xl hover:bg-[#F3F4F5] dark:hover:bg-[#2E3132] transition-all cursor-pointer"
          >
            <div className="w-8 h-8 rounded-full bg-[#000000] dark:bg-white text-white dark:text-black font-bold text-xs flex items-center justify-center shadow-xs">
              {userName.charAt(0).toUpperCase()}
            </div>
          </button>

          {showUserMenu && (
            <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-white dark:bg-[#1E2123] border border-[#E5E7EB] dark:border-[#33373B] shadow-[0_4px_20px_rgba(0,0,0,0.06)] p-3 z-50">
              <div className="p-3 mb-2 rounded-xl bg-[#F8F9FA] dark:bg-[#282C2E] border border-[#E5E7EB] dark:border-[#33373B]">
                <p className="text-xs font-bold text-[#191C1D] dark:text-white truncate">{userName}</p>
                <p className="text-[10px] text-[#5C5F62] dark:text-[#A0A4A8] truncate font-mono">{userEmail}</p>
                <p className="text-[9px] text-[#000000] dark:text-white font-mono font-bold mt-1 flex items-center gap-1">
                  <Store className="w-3 h-3 text-[#000000] dark:text-white" /> {storeName}
                </p>
              </div>

              <div className="space-y-0.5">
                <Link
                  to="/dashboard/profile"
                  onClick={() => setShowUserMenu(false)}
                  className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-[#5C5F62] dark:text-[#A0A4A8] hover:text-[#191C1D] dark:hover:text-white hover:bg-[#F3F4F5] dark:hover:bg-[#2E3132] transition-colors"
                >
                  <User className="w-4 h-4 text-[#5C5F62] dark:text-[#A0A4A8]" />
                  <span>Profile</span>
                </Link>

                <Link
                  to="/dashboard/settings"
                  onClick={() => setShowUserMenu(false)}
                  className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-[#5C5F62] dark:text-[#A0A4A8] hover:text-[#191C1D] dark:hover:text-white hover:bg-[#F3F4F5] dark:hover:bg-[#2E3132] transition-colors"
                >
                  <Settings className="w-4 h-4 text-[#5C5F62] dark:text-[#A0A4A8]" />
                  <span>Settings</span>
                </Link>


                <div className="pt-1 mt-1 border-t border-[#E5E7EB] dark:border-[#33373B]">
                  <button
                    onClick={() => {
                      setShowUserMenu(false);
                      handleLogout();
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors cursor-pointer"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Log Out</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

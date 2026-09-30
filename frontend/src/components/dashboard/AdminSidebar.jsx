import React, { useState } from 'react';
import { NavLink, Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  Users,
  MessageSquareText,
  Package,
  PieChart,
  Cpu,
  BarChart3,
  Activity,
  Settings,
  LogOut,
  PanelLeftClose,
  Sun,
  Moon,
  ShieldCheck,
  Store
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { useNotification } from '../../context/NotificationContext';

export const AdminSidebar = ({ isOpen, isCollapsed, onToggleCollapse, onCloseMobile }) => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { addToast } = useNotification();
  const navigate = useNavigate();
  const location = useLocation();
  const [hoveredNav, setHoveredNav] = useState(null);

  const userName = user?.name || 'Admin';
  const storeName = user?.storeName || 'FlipSentiment';

  const handleLogout = () => {
    logout();
    addToast('Logged out from Admin console', 'info');
    navigate('/login');
  };

  const mainNav = [
    { label: 'Overview', path: '/admin', icon: LayoutDashboard },
    { label: 'Sellers', path: '/admin/sellers', icon: Users },
    { label: 'Products', path: '/admin/products', icon: Package },
    { label: 'Reviews', path: '/admin/reviews', icon: MessageSquareText },
    { label: 'Sentiment Analytics', path: '/admin/analytics', icon: PieChart },
    { label: 'ML Model', path: '/admin/model', icon: Cpu, badge: 'Active' },
    { label: 'Model Evaluation', path: '/admin/evaluation', icon: BarChart3 },
    { label: 'System Activity', path: '/admin/activity', icon: Activity },
  ];

  const systemNav = [
    { label: 'Settings', path: '/admin/settings', icon: Settings },
  ];

  const Tooltip = ({ text }) => (
    <motion.div
      initial={{ opacity: 0, x: 6, scale: 0.95 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 4, scale: 0.95 }}
      transition={{ duration: 0.15 }}
      className="absolute left-full top-1/2 -translate-y-1/2 ml-3 px-3 py-1.5 z-50 bg-[#111116] text-white text-xs font-bold rounded-xl shadow-2xl border border-slate-700 dark:border-[#282836] whitespace-nowrap pointer-events-none"
    >
      {text}
      <div className="absolute top-1/2 -left-1 -mt-1 w-2 h-2 bg-[#111116] border-l border-b border-slate-700 dark:border-[#282836] rotate-45" />
    </motion.div>
  );

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-xs lg:hidden transition-opacity"
        />
      )}

      {/* Sidebar Container */}
      <motion.aside
        initial={false}
        animate={{ width: isCollapsed ? 80 : 256 }}
        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
        className={`fixed top-0 bottom-0 left-0 z-40 bg-white dark:bg-[#191C1D] border-r border-[#E5E7EB] dark:border-[#2E3132] flex flex-col justify-between shadow-[0_4px_20px_rgba(0,0,0,0.04)] transition-colors font-sans ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
          }`}
      >
        <div className="w-full">
          {/* Brand Header */}
          <div className="h-[72px] px-5 flex items-center justify-between border-b border-[#E5E7EB] dark:border-[#2E3132]">
            {!isCollapsed ? (
              <>
                <Link to="/admin" className="flex items-center gap-3 overflow-hidden group">
                  <div className="w-8 h-8 rounded-full bg-[#000000] dark:bg-white text-white dark:text-black flex items-center justify-center font-bold text-sm shrink-0 shadow-xs transition-transform group-hover:scale-105">
                    <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>flip</span>
                  </div>

                  <div className="flex flex-col whitespace-nowrap">
                    <span className="font-bold text-[15px] tracking-tight text-[#191C1D] dark:text-white leading-tight font-sans">
                      FlipSentiment
                    </span>
                    <span className="text-[10px] text-[#5C5F62] dark:text-[#A0A4A8] font-mono tracking-wide">
                      Admin Console
                    </span>
                  </div>
                </Link>

                <button
                  onClick={onToggleCollapse}
                  className="hidden lg:flex p-1.5 rounded-lg text-[#5C5F62] dark:text-[#A0A4A8] hover:text-[#000000] dark:hover:text-white hover:bg-[#F3F4F5] dark:hover:bg-[#2E3132] transition-colors cursor-pointer shrink-0"
                  title="Collapse Sidebar"
                >
                  <PanelLeftClose className="w-4 h-4 text-[#5C5F62] dark:text-[#A0A4A8]" />
                </button>
              </>
            ) : (
              <button
                onClick={onToggleCollapse}
                className="w-full flex items-center justify-center p-1.5 rounded-xl text-[#5C5F62] transition-colors cursor-pointer"
                title="Expand Sidebar"
              >
                <div className="w-8 h-8 rounded-full bg-[#000000] text-white flex items-center justify-center font-bold text-sm shadow-xs hover:scale-105 transition-transform">
                  <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>flip</span>
                </div>
              </button>
            )}
          </div>

          {/* Navigation Area */}
          <div className={`p-3 space-y-1 ${isCollapsed ? 'overflow-visible' : 'overflow-y-auto max-h-[calc(100vh-140px)]'} custom-scrollbar`}>

            {/* Main Navigation */}
            <div className="space-y-1">

              {mainNav.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path || (item.path !== '/admin' && location.pathname.startsWith(item.path));

                return (
                  <div
                    key={item.label + item.path}
                    className="relative"
                    onMouseEnter={() => setHoveredNav(item.path)}
                    onMouseLeave={() => setHoveredNav(null)}
                  >
                    <NavLink
                      to={item.path}
                      end={item.path === '/admin'}
                      onClick={onCloseMobile}
                      className={`relative flex items-center ${isCollapsed ? 'justify-center' : 'justify-start'
                        } gap-3 px-3 py-2.5 rounded-xl text-xs transition-all z-10 group`}
                    >
                      {/* Active State Pill */}
                      {isActive && (
                        <motion.div
                          layoutId="activeAdminNavBackground"
                          className="absolute inset-0 rounded-xl bg-[#000000] dark:bg-white text-white dark:text-black shadow-xs z-0"
                          transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                        />
                      )}

                      <Icon
                        className={`w-4 h-4 shrink-0 transition-colors z-10 ${isActive
                            ? 'text-white dark:text-black'
                            : 'text-[#5C5F62] dark:text-[#A0A4A8] group-hover:text-[#000000] dark:group-hover:text-white'
                          }`}
                      />

                      {!isCollapsed && (
                        <span
                          className={`whitespace-nowrap z-10 ${isActive
                              ? 'font-semibold text-white dark:text-black'
                              : 'font-normal text-[#5C5F62] dark:text-[#A0A4A8] group-hover:text-[#000000] dark:group-hover:text-white'
                            }`}
                        >
                          {item.label}
                        </span>
                      )}

                      {!isCollapsed && item.badge && (
                        <span className={`ml-auto px-1.5 py-0.5 text-[9px] font-mono rounded-md z-10 ${isActive ? 'bg-white/20 dark:bg-black/20 text-white dark:text-black' : 'bg-[#EDEEEF] dark:bg-[#2E3132] text-[#5C5F62] dark:text-[#A0A4A8]'
                          }`}>
                          {item.badge}
                        </span>
                      )}
                    </NavLink>

                    {/* Tooltip when Collapsed */}
                    <AnimatePresence>
                      {isCollapsed && hoveredNav === item.path && (
                        <Tooltip text={item.label} />
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>

            {/* System Navigation */}
            <div className="pt-2 border-t border-[#E5E7EB] dark:border-[#2E3132] space-y-1">
              {!isCollapsed && (
                <span className="text-[10px] font-medium uppercase tracking-wider text-[#5C5F62] dark:text-[#848484] px-3 block mb-1 font-mono">
                  SETTINGS
                </span>
              )}
              {systemNav.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                return (
                  <div
                    key={item.path}
                    className="relative"
                    onMouseEnter={() => setHoveredNav(item.path)}
                    onMouseLeave={() => setHoveredNav(null)}
                  >
                    <NavLink
                      to={item.path}
                      onClick={onCloseMobile}
                      className={`relative flex items-center ${isCollapsed ? 'justify-center' : 'justify-between'
                        } px-3 py-2.5 rounded-xl text-xs transition-all ${isActive
                          ? 'bg-[#000000] dark:bg-white text-white dark:text-black font-semibold shadow-xs'
                          : 'text-[#5C5F62] dark:text-[#A0A4A8] hover:text-[#000000] dark:hover:text-white hover:bg-[#F3F4F5] dark:hover:bg-[#2E3132] font-normal'
                        }`}
                    >
                      <div className="flex items-center gap-3">
                        <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white dark:text-black' : 'text-[#5C5F62] dark:text-[#A0A4A8]'}`} />
                        {!isCollapsed && <span className={isActive ? 'text-white dark:text-black font-semibold' : ''}>{item.label}</span>}
                      </div>
                    </NavLink>
                    <AnimatePresence>
                      {isCollapsed && hoveredNav === item.path && (
                        <Tooltip text={item.label} />
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Bottom Section: Admin Profile Card + Theme Toggle */}
        <div className="p-3 w-full border-t border-[#E5E7EB] dark:border-[#2E3132] space-y-2">

          {/* Quick Theme Toggle */}
          <button
            onClick={toggleTheme}
            className={`w-full flex items-center ${isCollapsed ? 'justify-center' : 'justify-between'
              } p-2 rounded-xl text-xs font-medium text-[#5C5F62] dark:text-[#A0A4A8] hover:text-[#000000] dark:hover:text-white hover:bg-[#F3F4F5] dark:hover:bg-[#2E3132] transition-colors cursor-pointer`}
            title="Toggle Light/Dark Theme"
          >
            <div className="flex items-center gap-2.5">
              {theme === 'dark' ? (
                <Sun className="w-4 h-4 text-amber-500 shrink-0" />
              ) : (
                <Moon className="w-4 h-4 text-[#5C5F62] shrink-0" />
              )}
              {!isCollapsed && (
                <span>{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>
              )}
            </div>
          </button>

          {/* Admin Profile Card */}
          <div
            className={`flex items-center ${isCollapsed ? 'justify-center' : 'justify-between'
              } p-2 rounded-xl bg-white dark:bg-[#242729] border border-[#E5E7EB] dark:border-[#33373B] hover:border-[#D1D5DB] dark:hover:border-[#5C5F62] transition-all group shadow-xs`}
          >
            <div className="flex items-center gap-2.5 overflow-hidden">
              <div className="w-8 h-8 rounded-full bg-[#000000] dark:bg-white text-white dark:text-black font-bold text-xs flex items-center justify-center shrink-0 shadow-xs">
                {userName.charAt(0).toUpperCase()}
              </div>
              {!isCollapsed && (
                <div className="flex flex-col min-w-0">
                  <span className="text-xs font-semibold text-[#191C1D] dark:text-white truncate transition-colors">{userName}</span>
                  <span className="text-[10px] text-[#5C5F62] dark:text-[#A0A4A8] truncate flex items-center gap-1 font-mono">
                    <ShieldCheck className="w-2.5 h-2.5 text-[#5C5F62] dark:text-[#A0A4A8]" /> Admin
                  </span>
                </div>
              )}
            </div>

            {!isCollapsed && (
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  handleLogout();
                }}
                className="p-1 rounded-lg text-[#5C5F62] dark:text-[#A0A4A8] hover:text-[#BA1A1A] dark:hover:text-red-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors cursor-pointer"
                title="Logout"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </motion.aside>
    </>
  );
};

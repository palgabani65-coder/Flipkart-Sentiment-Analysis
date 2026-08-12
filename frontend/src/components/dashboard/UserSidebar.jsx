import React, { useState } from 'react';
import { NavLink, Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LayoutDashboard, 
  Package, 
  MessageSquareText, 
  BarChart3, 
  TrendingUp,
  Lightbulb,
  FileText,
  Bell, 
  Settings, 
  LogOut,
  PanelLeftClose,
  Sun,
  Moon,
  User,
  Store,
  ShoppingBag
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { useNotification } from '../../context/NotificationContext';

export const UserSidebar = ({ isOpen, isCollapsed, onToggleCollapse, onCloseMobile }) => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { addToast } = useNotification();
  const navigate = useNavigate();
  const location = useLocation();
  const [hoveredNav, setHoveredNav] = useState(null);

  const userName = user?.name || 'Store Manager';
  const storeName = user?.storeName || 'Gabani Electronics';

  const handleLogout = () => {
    logout();
    addToast('Logged out successfully', 'info');
    navigate('/login');
  };

  const mainNav = [
    { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { label: 'Products', path: '/dashboard/products', icon: Package },
    { label: 'Reviews', path: '/dashboard/reviews', icon: MessageSquareText },
    { label: 'Sentiment Analysis', path: '/dashboard/sentiment-analysis', icon: BarChart3 },
    { label: 'Analytics', path: '/dashboard/analytics', icon: TrendingUp },
    { label: 'Customer Insights', path: '/dashboard/insights', icon: Lightbulb },
    { label: 'Reports', path: '/dashboard/reports', icon: FileText },
  ];

  const systemNav = [
    { label: 'Notifications', path: '/dashboard/notifications', icon: Bell, badge: '3' },
    { label: 'Settings', path: '/dashboard/settings', icon: Settings },
  ];

  const Tooltip = ({ text }) => (
    <motion.div
      initial={{ opacity: 0, x: 6, scale: 0.95 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 4, scale: 0.95 }}
      transition={{ duration: 0.15 }}
      className="absolute left-full ml-3 px-3 py-1.5 z-50 bg-[#111116] text-white text-xs font-bold rounded-xl shadow-2xl border border-slate-700 dark:border-[#282836] whitespace-nowrap pointer-events-none"
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
        className={`fixed top-0 bottom-0 left-0 z-40 bg-white dark:bg-[#16161E] border-r border-[#E6E4F0] dark:border-[#282836] flex flex-col justify-between overflow-hidden shadow-xs transition-colors ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="w-full">
          {/* Brand Header */}
          <div className="h-[72px] px-4 flex items-center justify-between border-b border-[#E6E4F0] dark:border-[#282836]">
            {!isCollapsed ? (
              <>
                <Link to="/dashboard" className="flex items-center gap-3 overflow-hidden group">
                  <div className="w-9 h-9 rounded-xl bg-[#111116] dark:bg-[#2563EB] text-white flex items-center justify-center font-black text-sm shrink-0 shadow-md transition-transform group-hover:scale-105">
                    <ShoppingBag className="w-4 h-4" />
                  </div>
                  
                  <div className="flex flex-col whitespace-nowrap">
                    <span className="font-extrabold text-[15px] tracking-tight text-slate-900 dark:text-white leading-tight">
                      FlipSentiment
                    </span>
                    <span className="text-[10px] text-[#2563EB] dark:text-[#8B5CF6] font-mono font-bold uppercase tracking-wider">
                      Seller AI SaaS
                    </span>
                  </div>
                </Link>

                <button
                  onClick={onToggleCollapse}
                  className="hidden lg:flex p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-[#1C1C26] transition-colors cursor-pointer shrink-0"
                  title="Collapse Sidebar"
                >
                  <PanelLeftClose className="w-4 h-4 text-slate-400 dark:text-[#9494A8]" />
                </button>
              </>
            ) : (
              <button
                onClick={onToggleCollapse}
                className="w-full flex items-center justify-center p-1.5 rounded-xl text-slate-400 transition-colors cursor-pointer"
                title="Expand Sidebar"
              >
                <div className="w-9 h-9 rounded-xl bg-[#111116] dark:bg-[#2563EB] text-white flex items-center justify-center font-black text-sm shadow-md hover:scale-105 transition-transform">
                  <ShoppingBag className="w-4 h-4" />
                </div>
              </button>
            )}
          </div>

          {/* Navigation Area */}
          <div className="p-3 space-y-4 overflow-y-auto max-h-[calc(100vh-270px)] custom-scrollbar">
            
            {/* Main Navigation */}
            <div className="space-y-1">
              {!isCollapsed && (
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-[#9494A8] px-3 block mb-2 font-mono">
                  NAVIGATION
                </span>
              )}

              {mainNav.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path || (item.path !== '/dashboard' && location.pathname.startsWith(item.path));

                return (
                  <div
                    key={item.label + item.path}
                    className="relative"
                    onMouseEnter={() => setHoveredNav(item.path)}
                    onMouseLeave={() => setHoveredNav(null)}
                  >
                    <NavLink
                      to={item.path}
                      onClick={onCloseMobile}
                      className={`relative flex items-center ${
                        isCollapsed ? 'justify-center' : 'justify-start'
                      } gap-3 px-3 py-2.5 rounded-xl text-xs transition-all z-10 group`}
                    >
                      {/* Active State Solid Black Pill */}
                      {isActive && (
                        <motion.div
                          layoutId="activeNavBackground"
                          className="absolute inset-0 rounded-xl bg-[#111116] dark:bg-[#242432] text-white shadow-md z-0"
                          transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                        />
                      )}

                      {/* Right Indicator Pill */}
                      {isActive && (
                        <motion.div
                          layoutId="activeNavPill"
                          className={`absolute ${
                            isCollapsed ? 'right-0 w-1 h-6 rounded-l-full' : 'right-1.5 w-1 h-4 rounded-full'
                          } top-1/2 -translate-y-1/2 bg-[#2563EB] dark:bg-[#8B5CF6] shadow-[0_0_8px_rgba(37,99,235,0.6)] z-20`}
                          transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                        />
                      )}

                      <Icon
                        className={`w-4 h-4 shrink-0 transition-colors z-10 ${
                          isActive
                            ? 'text-white'
                            : 'text-slate-400 dark:text-[#9494A8] group-hover:text-slate-900 dark:group-hover:text-white'
                        }`}
                      />

                      {!isCollapsed && (
                        <span
                          className={`whitespace-nowrap z-10 ${
                            isActive
                              ? 'font-bold text-white'
                              : 'font-medium text-slate-600 dark:text-[#9494A8] group-hover:text-slate-900 dark:group-hover:text-white'
                          }`}
                        >
                          {item.label}
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
            <div className="pt-2 border-t border-[#E6E4F0] dark:border-[#282836] space-y-1">
              {!isCollapsed && (
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-[#9494A8] px-3 block mb-2 font-mono">
                  SYSTEM
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
                      className={`relative flex items-center ${
                        isCollapsed ? 'justify-center' : 'justify-between'
                      } px-3 py-2.5 rounded-xl text-xs transition-all ${
                        isActive
                          ? 'bg-[#111116] dark:bg-[#242432] text-white font-bold shadow-md'
                          : 'text-slate-600 dark:text-[#9494A8] hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-[#1C1C26] font-medium'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-slate-400 dark:text-[#9494A8]'}`} />
                        {!isCollapsed && <span className={isActive ? 'text-white font-bold' : ''}>{item.label}</span>}
                      </div>
                      {!isCollapsed && item.badge && (
                        <span className="px-1.5 py-0.5 text-[9px] font-bold rounded-md bg-[#2563EB]/15 text-[#2563EB] dark:text-[#8B5CF6] font-mono">
                          {item.badge}
                        </span>
                      )}
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

        {/* Bottom Section: Store Profile Card + Theme Toggle */}
        <div className="p-3 w-full border-t border-[#E6E4F0] dark:border-[#282836] space-y-2">
          
          {/* Quick Theme Toggle */}
          <button
            onClick={toggleTheme}
            className={`w-full flex items-center ${
              isCollapsed ? 'justify-center' : 'justify-between'
            } p-2 rounded-xl text-xs font-medium text-slate-600 dark:text-[#9494A8] hover:bg-slate-100 dark:hover:bg-[#1C1C26] transition-colors cursor-pointer`}
            title="Toggle Light/Dark Theme"
          >
            <div className="flex items-center gap-2.5">
              {theme === 'dark' ? (
                <Sun className="w-4 h-4 text-amber-400 shrink-0" />
              ) : (
                <Moon className="w-4 h-4 text-slate-600 shrink-0" />
              )}
              {!isCollapsed && (
                <span>{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>
              )}
            </div>
          </button>

          {/* Store Profile Card (Navigates to /dashboard/profile) */}
          <NavLink
            to="/dashboard/profile"
            onClick={onCloseMobile}
            className={`flex items-center ${
              isCollapsed ? 'justify-center' : 'justify-between'
            } p-2 rounded-xl bg-slate-50 dark:bg-[#1C1C26] border border-[#E6E4F0] dark:border-[#282836] hover:border-[#111116]/40 transition-all group`}
          >
            <div className="flex items-center gap-2.5 overflow-hidden">
              <div className="w-8 h-8 rounded-lg bg-[#111116] dark:bg-[#2563EB] text-white font-black text-xs flex items-center justify-center shrink-0 shadow-xs">
                {userName.charAt(0).toUpperCase()}
              </div>
              {!isCollapsed && (
                <div className="flex flex-col min-w-0">
                  <span className="text-xs font-bold text-slate-900 dark:text-white truncate group-hover:text-[#2563EB] transition-colors">{userName}</span>
                  <span className="text-[10px] text-slate-500 dark:text-[#9494A8] truncate font-mono flex items-center gap-1">
                    <Store className="w-2.5 h-2.5 text-slate-400" /> {storeName}
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
                className="p-1 rounded-lg text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors cursor-pointer"
                title="Logout"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            )}
          </NavLink>
        </div>
      </motion.aside>
    </>
  );
};

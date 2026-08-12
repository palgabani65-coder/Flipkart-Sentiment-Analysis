import React from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { 
  ShieldCheck, 
  Users, 
  MessageSquareText, 
  Package, 
  PieChart, 
  Cpu, 
  BarChart3,
  Activity, 
  Settings, 
  LogOut,
  ChevronLeft,
  ChevronRight,
  Store,
  LayoutDashboard
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext';

export const AdminSidebar = ({ isOpen, isCollapsed, onToggleCollapse, onCloseMobile }) => {
  const { logout } = useAuth();
  const { addToast } = useNotification();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    addToast('Logged out from Admin console', 'info');
    navigate('/login');
  };

  const navCategories = [
    {
      title: 'PLATFORM',
      items: [
        { label: 'Overview', path: '/admin', icon: LayoutDashboard },
        { label: 'Sellers', path: '/admin/sellers', icon: Users },
        { label: 'Products', path: '/admin/products', icon: Package },
        { label: 'Reviews', path: '/admin/reviews', icon: MessageSquareText },
      ]
    },
    {
      title: 'ANALYTICS & ML',
      items: [
        { label: 'Sentiment Analytics', path: '/admin/analytics', icon: PieChart },
        { label: 'ML Model', path: '/admin/model', icon: Cpu, badge: 'Active' },
        { label: 'Model Evaluation', path: '/admin/evaluation', icon: BarChart3 },
        { label: 'System Activity', path: '/admin/activity', icon: Activity },
      ]
    },
    {
      title: 'SYSTEM',
      items: [
        { label: 'Settings', path: '/admin/settings', icon: Settings },
      ]
    }
  ];

  return (
    <>
      {isOpen && (
        <div onClick={onCloseMobile}
          className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-xs lg:hidden transition-opacity" />
      )}

      <aside className={`fixed top-0 bottom-0 left-0 z-40 bg-white dark:bg-[#16161E] border-r border-[#E6E4F0] dark:border-[#282836] flex flex-col justify-between transition-all duration-300 ease-in-out ${
        isCollapsed ? 'lg:w-20' : 'lg:w-64'
      } w-64 ${
        isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      }`}>
        <div>
          <div className="h-[72px] px-5 flex items-center justify-between border-b border-[#E6E4F0] dark:border-[#282836]">
            <Link to="/admin" className="flex items-center gap-3 overflow-hidden">
              <div className="w-9 h-9 rounded-xl bg-[#111116] dark:bg-[#2563EB] text-white flex items-center justify-center font-black text-sm shrink-0 shadow-md">
                <ShoppingBag className="w-4 h-4" />
              </div>
              {!isCollapsed && (
                <div className="flex flex-col">
                  <span className="font-extrabold text-[15px] tracking-tight text-slate-900 dark:text-white leading-tight">FlipSentiment</span>
                  <span className="text-[9px] text-[#2563EB] dark:text-[#8B5CF6] font-mono font-bold uppercase tracking-wider">Admin Console</span>
                </div>
              )}
            </Link>
            <button onClick={onToggleCollapse}
              className="hidden lg:flex p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-[#1C1C26] transition-colors"
              title={isCollapsed ? "Expand" : "Collapse"}>
              {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
            </button>
          </div>

          <div className="p-3 space-y-5 overflow-y-auto mt-1 max-h-[calc(100vh-220px)]">
            {navCategories.map((cat) => (
              <div key={cat.title} className="space-y-0.5">
                {!isCollapsed && (
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-[#9494A8] px-3 block mb-2 font-mono">{cat.title}</span>
                )}
                {cat.items.map((item) => {
                  const Icon = item.icon;
                  return (
                    <NavLink key={item.path} to={item.path} end={item.path === '/admin'} onClick={onCloseMobile}
                      className={({ isActive }) =>
                        `relative flex items-center ${isCollapsed ? 'justify-center' : 'justify-between'} px-3 py-2.5 rounded-xl text-xs transition-all ${
                          isActive
                            ? 'bg-[#111116] dark:bg-[#242432] text-white font-bold shadow-md'
                            : 'text-slate-600 dark:text-[#9494A8] hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-[#1C1C26] font-medium'
                        }`
                      }
                      title={isCollapsed ? item.label : undefined}>
                      {({ isActive }) => (
                        <>
                          {isActive && <span className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 bg-[#2563EB] rounded-r-full shadow-[0_0_8px_rgba(37,99,235,0.8)]" />}
                          <div className="flex items-center gap-2.5">
                            <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                            {!isCollapsed && <span>{item.label}</span>}
                          </div>
                          {!isCollapsed && item.badge && (
                            <span className="px-1.5 py-0.5 text-[9px] font-bold rounded-md bg-[#2563EB] text-white font-mono">{item.badge}</span>
                          )}
                        </>
                      )}
                    </NavLink>
                  );
                })}
              </div>
            ))}
          </div>
        </div>

        <div className="p-3 border-t border-[#E6E4F0] dark:border-[#282836] space-y-1">
          <Link to="/dashboard"
            className={`flex items-center ${isCollapsed ? 'justify-center' : 'gap-2.5'} px-3 py-2.5 rounded-xl text-xs font-medium text-slate-600 dark:text-[#9494A8] hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-[#1C1C26] transition-colors`}
            title={isCollapsed ? "Seller View" : undefined}>
            <Store className="w-4 h-4 shrink-0 text-[#2563EB]" />
            {!isCollapsed && <span>Seller View</span>}
          </Link>
          <button onClick={handleLogout}
            className={`w-full flex items-center ${isCollapsed ? 'justify-center' : 'gap-2.5'} px-3 py-2.5 rounded-xl text-xs font-medium text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors cursor-pointer`}
            title={isCollapsed ? "Logout" : undefined}>
            <LogOut className="w-4 h-4 shrink-0" />
            {!isCollapsed && <span>Logout</span>}
          </button>
        </div>
      </aside>
    </>
  );
};

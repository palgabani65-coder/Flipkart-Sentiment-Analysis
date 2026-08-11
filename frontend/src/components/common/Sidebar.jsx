import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Sparkles, 
  ShoppingBag, 
  BarChart3, 
  History, 
  User, 
  HelpCircle,
  BrainCircuit
} from 'lucide-react';

export const Sidebar = ({ isOpen, onClose }) => {
  const navItems = [
    { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { label: 'Sentiment Predictor', path: '/predict', icon: Sparkles, badge: 'AI Live' },
    { label: 'Product Explorer', path: '/products', icon: ShoppingBag },
    { label: 'Analytics Hub', path: '/analytics', icon: BarChart3 },
    { label: 'Prediction History', path: '/history', icon: History },
    { label: 'User Profile', path: '/profile', icon: User },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-gray-900/50 backdrop-blur-sm lg:hidden transition-opacity"
        />
      )}

      {/* Sidebar Drawer */}
      <aside
        className={`fixed top-16 bottom-0 left-0 z-40 w-64 bg-white dark:bg-gray-900 border-r border-gray-200/80 dark:border-gray-800/80 flex flex-col justify-between transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="p-4 space-y-6 overflow-y-auto">
          
          <div className="space-y-1">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-gray-400 dark:text-gray-500 px-3">
              Main Menu
            </span>
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={onClose}
                  className={({ isActive }) =>
                    `flex items-center justify-between px-3.5 py-2.5 rounded-xl font-medium text-sm transition-all ${
                      isActive
                        ? 'bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 font-semibold shadow-sm'
                        : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white'
                    }`
                  }
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className="px-1.5 py-0.5 text-[10px] font-bold rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white">
                      {item.badge}
                    </span>
                  )}
                </NavLink>
              );
            })}
          </div>

          {/* Model Status Widget */}
          <div className="p-4 rounded-2xl bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-purple-950/40 dark:to-indigo-950/40 border border-purple-100 dark:border-purple-900/40">
            <div className="flex items-center gap-2 text-purple-600 dark:text-purple-400 font-bold text-xs">
              <BrainCircuit className="w-4 h-4 animate-pulse" />
              <span>Flipkart Review Model v2.4</span>
            </div>
            <p className="mt-1 text-xs text-gray-600 dark:text-gray-400">
              Bi-LSTM + BERT fine-tuned on 150K+ Flipkart e-commerce reviews.
            </p>
            <div className="mt-3 flex items-center justify-between text-[11px]">
              <span className="text-gray-500">Accuracy Score</span>
              <span className="font-extrabold text-emerald-600 dark:text-emerald-400">98.4%</span>
            </div>
          </div>

        </div>

        {/* Footer Support Info */}
        <div className="p-4 border-t border-gray-100 dark:border-gray-800 text-xs text-gray-400 flex items-center justify-between">
          <Link to="/#hero" onClick={onClose} className="hover:text-purple-600 dark:hover:text-purple-400 transition-colors">
            <span>FlipSentiment v1.0</span>
          </Link>
          <button className="hover:text-gray-600 dark:hover:text-gray-200 transition-colors">
            <HelpCircle className="w-4 h-4" />
          </button>
        </div>
      </aside>
    </>
  );
};

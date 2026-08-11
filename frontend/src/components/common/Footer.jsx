import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, ShieldCheck, Heart } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="mt-auto bg-white dark:bg-gray-900 border-t border-gray-200/80 dark:border-gray-800/80 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        
        <Link
          to="/#hero"
          onClick={(e) => {
            if (window.location.pathname === '/' || window.location.pathname === '') {
              e.preventDefault();
              const heroEl = document.getElementById('hero');
              if (heroEl) {
                heroEl.scrollIntoView({ behavior: 'smooth' });
              } else {
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }
            }
          }}
          className="flex items-center gap-2 group cursor-pointer"
        >
          <div className="w-6 h-6 rounded-lg fk-gradient flex items-center justify-center text-yellow-300 font-bold text-xs transition-transform group-hover:scale-105">
            <ShoppingBag className="w-3.5 h-3.5" />
          </div>
          <span className="font-bold text-sm text-gray-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
            FlipSentiment Analytics Engine
          </span>
        </Link>

        <div className="flex items-center gap-6 text-xs text-gray-500 dark:text-gray-400">
          <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-medium">
            <ShieldCheck className="w-4 h-4" /> Real-time Inference API Active
          </span>
          <a href="#" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Documentation</a>
          <a href="#" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Privacy Policy</a>
          <a href="#" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">API Specs</a>
        </div>

        <p className="text-xs text-gray-400 dark:text-gray-500 flex items-center gap-1">
          Built with <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" /> for Flipkart Customer Review Analysis
        </p>

      </div>
    </footer>
  );
};

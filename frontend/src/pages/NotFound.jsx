import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, ArrowLeft } from 'lucide-react';

export const NotFound = () => {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center p-6 space-y-4">
      <div className="w-16 h-16 rounded-3xl fk-gradient flex items-center justify-center text-yellow-300 shadow-xl">
        <ShoppingBag className="w-8 h-8" />
      </div>
      <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white">404</h1>
      <h2 className="text-lg font-bold text-gray-700 dark:text-gray-300">Page Not Found</h2>
      <p className="text-xs text-gray-400 max-w-sm">
        The sentiment analysis route you requested does not exist or has been moved.
      </p>
      <Link
        to="/"
        className="px-5 py-2.5 rounded-full fk-gradient font-bold text-white text-xs shadow-md transition-all flex items-center gap-2"
      >
        <ArrowLeft className="w-4 h-4" /> Return to Dashboard
      </Link>
    </div>
  );
};

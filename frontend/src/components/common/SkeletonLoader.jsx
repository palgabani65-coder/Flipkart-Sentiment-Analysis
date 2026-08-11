import React from 'react';

export const SkeletonCard = () => (
  <div className="p-6 rounded-2xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 animate-pulse space-y-4">
    <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-1/3"></div>
    <div className="h-8 bg-gray-200 dark:bg-gray-800 rounded w-1/2"></div>
    <div className="h-3 bg-gray-200 dark:bg-gray-800 rounded w-2/3"></div>
  </div>
);

export const SkeletonRow = () => (
  <div className="flex items-center gap-4 p-4 border-b border-gray-100 dark:border-gray-800 animate-pulse">
    <div className="w-10 h-10 bg-gray-200 dark:bg-gray-800 rounded-full"></div>
    <div className="flex-1 space-y-2">
      <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-1/4"></div>
      <div className="h-3 bg-gray-200 dark:bg-gray-800 rounded w-3/4"></div>
    </div>
    <div className="h-6 w-16 bg-gray-200 dark:bg-gray-800 rounded-full"></div>
  </div>
);

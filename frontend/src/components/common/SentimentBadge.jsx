import React from 'react';
import { ThumbsUp, ThumbsDown, Minus } from 'lucide-react';

export const SentimentBadge = ({ sentiment, confidence, showIcon = true, size = 'md' }) => {
  const getStyle = () => {
    switch (sentiment?.toLowerCase()) {
      case 'positive':
        return 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800';
      case 'negative':
        return 'bg-rose-50 text-rose-700 dark:bg-rose-950/50 dark:text-rose-400 border-rose-200 dark:border-rose-800';
      default:
        return 'bg-amber-50 text-amber-700 dark:bg-amber-950/50 dark:text-amber-400 border-amber-200 dark:border-amber-800';
    }
  };

  const getIcon = () => {
    switch (sentiment?.toLowerCase()) {
      case 'positive':
        return <ThumbsUp className="w-3.5 h-3.5" />;
      case 'negative':
        return <ThumbsDown className="w-3.5 h-3.5" />;
      default:
        return <Minus className="w-3.5 h-3.5" />;
    }
  };

  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-1 text-sm font-medium',
    lg: 'px-3 py-1.5 text-base font-semibold',
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border transition-all ${getStyle()} ${sizeClasses[size]}`}
    >
      {showIcon && getIcon()}
      <span>{sentiment}</span>
      {confidence !== undefined && (
        <span className="opacity-75 font-mono text-[0.85em]">({confidence}%)</span>
      )}
    </span>
  );
};

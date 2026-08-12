import React from 'react';
import { Search, Filter, X } from 'lucide-react';

export const FilterBar = ({
  searchValue = '',
  onSearchChange,
  searchPlaceholder = 'Search...',
  filters = [],
  activeFilters = {},
  onFilterChange,
  onClearFilters,
  children
}) => {
  const hasActiveFilters = Object.values(activeFilters).some(v => v && v !== 'all');

  return (
    <div className="p-4 rounded-3xl bg-white dark:bg-[#12101B] border border-slate-200/80 dark:border-[#1E1A2E] shadow-xs space-y-3">
      <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3">
        {/* Search Input */}
        <div className="relative flex-1 max-w-sm">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchValue}
            onChange={(e) => onSearchChange?.(e.target.value)}
            placeholder={searchPlaceholder}
            className="w-full pl-10 pr-4 py-2.5 rounded-full bg-slate-50 dark:bg-[#171424] text-xs font-semibold text-slate-900 dark:text-white outline-none border border-slate-200 dark:border-[#1E1A2E] focus:border-[#C4B5FD] transition-colors placeholder:text-slate-500"
          />
        </div>

        {/* Filter dropdowns */}
        <div className="flex items-center gap-2 flex-wrap">
          {filters.map((filter) => (
            <div key={filter.key} className="relative">
              <select
                value={activeFilters[filter.key] || 'all'}
                onChange={(e) => onFilterChange?.(filter.key, e.target.value)}
                className="appearance-none pl-3 pr-8 py-2 rounded-full border border-slate-200 dark:border-[#1E1A2E] bg-slate-50 dark:bg-[#171424] text-xs font-bold text-slate-700 dark:text-slate-300 outline-none focus:border-[#C4B5FD] transition-colors cursor-pointer"
              >
                <option value="all">{filter.label}</option>
                {filter.options.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
              <Filter className="w-3 h-3 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          ))}

          {hasActiveFilters && (
            <button
              onClick={onClearFilters}
              className="flex items-center gap-1 px-3 py-2 rounded-full text-[10px] font-bold text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors cursor-pointer"
            >
              <X className="w-3 h-3" />
              <span>Clear</span>
            </button>
          )}
        </div>

        {/* Extra slot for buttons */}
        {children}
      </div>
    </div>
  );
};

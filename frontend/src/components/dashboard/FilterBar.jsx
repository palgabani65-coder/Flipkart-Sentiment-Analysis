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
    <div className="p-4 rounded-2xl bg-white border border-[#E5E7EB] shadow-[0_4px_20px_rgba(0,0,0,0.04)] space-y-3 font-sans">
      <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3">
        {/* Search Input */}
        <div className="relative flex-1 max-w-sm">
          <Search className="w-4 h-4 text-[#5C5F62] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchValue}
            onChange={(e) => onSearchChange?.(e.target.value)}
            placeholder={searchPlaceholder}
            className="w-full pl-10 pr-4 py-2.5 rounded-full bg-white text-xs font-mono text-[#191C1D] outline-none border border-[#E5E7EB] focus:border-[#000000] focus:ring-1 focus:ring-black/10 transition-colors placeholder:text-[#5C5F62]"
          />
        </div>

        {/* Filter dropdowns */}
        <div className="flex items-center gap-2 flex-wrap">
          {filters.map((filter) => (
            <div key={filter.key} className="relative">
              <select
                value={activeFilters[filter.key] || 'all'}
                onChange={(e) => onFilterChange?.(filter.key, e.target.value)}
                className="appearance-none pl-3 pr-8 py-2 rounded-full border border-[#E5E7EB] bg-white text-xs font-mono text-[#191C1D] outline-none focus:border-[#000000] transition-colors cursor-pointer"
              >
                <option value="all">{filter.label}</option>
                {filter.options.map((opt) => (
                  <option key={opt.value} value={opt.value} className="bg-white text-[#191C1D]">{opt.label}</option>
                ))}
              </select>
              <Filter className="w-3 h-3 text-[#5C5F62] absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          ))}

          {hasActiveFilters && (
            <button
              onClick={onClearFilters}
              className="flex items-center gap-1 px-3 py-2 rounded-full text-[10px] font-mono text-[#BA1A1A] hover:bg-rose-50 transition-colors cursor-pointer"
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

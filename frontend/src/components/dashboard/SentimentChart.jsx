import React, { useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Sector } from 'recharts';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../../context/ThemeContext';

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const data = payload[0];
    const color = data.payload?.color;
    return (
      <div className="px-3 py-2 rounded-xl bg-white dark:bg-[#191C1D] text-[#191C1D] dark:text-[#e8e8e8] text-xs font-mono shadow-2xl border border-[#E5E7EB] dark:border-[#33373B] flex items-center gap-2">
        <div
          className="w-2.5 h-2.5 rounded-full shrink-0 border border-slate-300 dark:border-slate-600"
          style={{ backgroundColor: color }}
        />
        <span className="font-medium text-[#5C5F62] dark:text-[#A0A4A8]">{data.name}:</span>
        <span className="font-bold text-[#191C1D] dark:text-white">{data.value}%</span>
      </div>
    );
  }
  return null;
};

// Smooth pop-out active slice sector with subtle shadow
const renderActiveShape = (props) => {
  const { cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill } = props;

  return (
    <g>
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius - 2}
        outerRadius={outerRadius + 5}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
        cornerRadius={3}
        style={{
          filter: 'drop-shadow(0 4px 12px rgba(0, 0, 0, 0.28))',
          transition: 'all 200ms ease-out',
        }}
      />
    </g>
  );
};

export const SentimentChart = ({
  positive = 0,
  neutral = 0,
  negative = 0,
  size = 200,
  showLegend = true,
  showCenter = true,
}) => {
  const { isDarkMode } = useTheme();
  const [activeIndex, setActiveIndex] = useState(null);

  // Grey styled palette (original Nordic monochrome aesthetic)
  const data = [
    { name: 'Positive', value: positive, color: isDarkMode ? '#FFFFFF' : '#000000' },
    { name: 'Neutral', value: neutral, color: isDarkMode ? '#94A3B8' : '#505F76' },
    { name: 'Negative', value: negative, color: isDarkMode ? '#64748B' : '#CAD5E2' },
  ];

  // Active slice currently displayed in the center
  const displayItem = activeIndex !== null && data[activeIndex] ? data[activeIndex] : data[0];

  return (
    <div
      className="flex flex-col items-center gap-4 select-none"
      onMouseLeave={() => setActiveIndex(null)}
    >
      <div className="relative" style={{ width: size, height: size }}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              activeIndex={activeIndex !== null ? activeIndex : undefined}
              activeShape={renderActiveShape}
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={size * 0.33}
              outerRadius={size * 0.45}
              paddingAngle={2.5}
              dataKey="value"
              stroke="none"
              cornerRadius={2.5}
              isAnimationActive={false}
              onMouseEnter={(_, index) => setActiveIndex(index)}
            >
              {data.map((entry, index) => {
                const isHovered = activeIndex === index;
                const isDimmed = activeIndex !== null && !isHovered;
                return (
                  <Cell
                    key={index}
                    fill={entry.color}
                    opacity={isDimmed ? 0.35 : 1}
                    style={{
                      transition: 'opacity 180ms ease-out',
                      cursor: 'pointer',
                    }}
                  />
                );
              })}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>

        {/* Dynamic Center label reflecting the hovered slice */}
        {showCenter && (
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <AnimatePresence mode="wait">
              <motion.div
                key={displayItem.name}
                initial={{ opacity: 0, scale: 0.92, y: 2 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.92, y: -2 }}
                transition={{ duration: 0.15, ease: 'easeOut' }}
                className="flex flex-col items-center text-center"
              >
                <span className="text-2xl font-bold text-[#000000] dark:text-[#e8e8e8] font-sans tracking-tight">
                  {displayItem.value}%
                </span>
                <span className="text-[10px] font-bold uppercase font-mono tracking-wider text-[#5C5F62] dark:text-[#A0A4A8]">
                  {displayItem.name}
                </span>
              </motion.div>
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* Interactive Legend with Bidirectional Hover Binding */}
      {showLegend && (
        <div className="flex items-center gap-4">
          {data.map((item, index) => {
            const isHovered = activeIndex === index;
            const isDimmed = activeIndex !== null && !isHovered;
            return (
              <div
                key={item.name}
                onMouseEnter={() => setActiveIndex(index)}
                onMouseLeave={() => setActiveIndex(null)}
                className={`flex items-center gap-1.5 font-mono cursor-pointer transition-all duration-150 ${
                  isDimmed ? 'opacity-40' : 'opacity-100'
                }`}
              >
                <div
                  className="w-2.5 h-2.5 rounded-full transition-transform duration-150 border border-slate-300 dark:border-slate-600"
                  style={{
                    backgroundColor: item.color,
                    transform: isHovered ? 'scale(1.3)' : 'scale(1)',
                    boxShadow: isHovered
                      ? isDarkMode
                        ? '0 0 8px rgba(255,255,255,0.6)'
                        : '0 0 8px rgba(0,0,0,0.4)'
                      : 'none',
                  }}
                />
                <span
                  className={`text-[11px] transition-colors duration-150 ${
                    isHovered
                      ? 'text-[#000000] dark:text-white font-semibold'
                      : 'text-[#5C5F62] dark:text-[#A0A4A8]'
                  }`}
                >
                  {item.name}
                </span>
                <span className="text-[11px] font-semibold text-[#000000] dark:text-[#e8e8e8]">
                  {item.value}%
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default SentimentChart;

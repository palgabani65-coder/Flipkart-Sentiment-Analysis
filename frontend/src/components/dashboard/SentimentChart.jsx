import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

const COLORS = {
  positive: { fill: '#10B981', label: 'Positive' },
  neutral: { fill: '#F59E0B', label: 'Neutral' },
  negative: { fill: '#EF4444', label: 'Negative' },
};

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const data = payload[0];
    return (
      <div className="px-3 py-2 rounded-xl bg-[#0D0B14] text-white text-xs font-bold shadow-2xl border border-[#1E1A2E]">
        <span>{data.name}: {data.value}%</span>
      </div>
    );
  }
  return null;
};

export const SentimentChart = ({
  positive = 0,
  neutral = 0,
  negative = 0,
  size = 200,
  showLegend = true,
  showCenter = true,
}) => {
  const data = [
    { name: 'Positive', value: positive, color: COLORS.positive.fill },
    { name: 'Neutral', value: neutral, color: COLORS.neutral.fill },
    { name: 'Negative', value: negative, color: COLORS.negative.fill },
  ];

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="relative" style={{ width: size, height: size }}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={size * 0.32}
              outerRadius={size * 0.45}
              paddingAngle={3}
              dataKey="value"
              stroke="none"
              cornerRadius={4}
            >
              {data.map((entry, index) => (
                <Cell key={index} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>

        {/* Center label */}
        {showCenter && (
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-2xl font-extrabold text-slate-900 dark:text-white font-mono">{positive}%</span>
            <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase font-mono tracking-wider">Positive</span>
          </div>
        )}
      </div>

      {/* Legend */}
      {showLegend && (
        <div className="flex items-center gap-5">
          {data.map((item) => (
            <div key={item.name} className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
              <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400">{item.name}</span>
              <span className="text-[11px] font-extrabold text-slate-900 dark:text-white font-mono">{item.value}%</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};


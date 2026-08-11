import React from 'react';
import { ShoppingBag } from 'lucide-react';

export const PageLoader = () => {
  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center relative overflow-hidden z-50">
      {/* Subtle Glowing Background Pulse */}
      <div className="absolute w-72 h-72 rounded-full bg-emerald-500/10 blur-3xl animate-pulse pointer-events-none" />

      <div className="relative flex flex-col items-center gap-4">
        {/* Animated Brand Icon */}
        <div className="relative w-14 h-14 rounded-2xl bg-gradient-to-br from-white via-neutral-200 to-neutral-400 text-black flex items-center justify-center shadow-[0_0_25px_rgba(255,255,255,0.3)] animate-bounce">
          <ShoppingBag className="w-7 h-7" />
        </div>

        {/* Spinner Ring */}
        <div className="relative flex items-center justify-center">
          <div className="w-10 h-10 border-2 border-neutral-800 border-t-emerald-400 border-r-cyan-400 rounded-full animate-spin" />
        </div>

        {/* Text */}
        <div className="text-center space-y-1">
          <span className="block text-sm font-extrabold tracking-wider uppercase text-white">
            FlipSentiment
          </span>
          <span className="block text-[10px] text-neutral-400 font-mono tracking-widest">
            Loading AI Engine...
          </span>
        </div>
      </div>
    </div>
  );
};

export default PageLoader;

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export const InteractiveLamp = ({
  isLightOn = true,
  onToggleLight,
  focusedInput = null, // 'email' | 'password' | null
  emailLength = 0,
  showPassword = false,
  isSubmitting = false
}) => {
  // Eye tracking offset based on typing length in email field
  const eyeX = focusedInput === 'email' ? Math.min(Math.max((emailLength - 10) * 0.8, -8), 8) : 0;
  const eyeY = focusedInput === 'email' ? 3 : 0;

  // Shade angle and Y position during password input
  const isCoveringEyes = focusedInput === 'password' && !showPassword;

  return (
    <div className="relative flex flex-col items-center justify-center w-full max-w-[320px] h-[380px] select-none">
      
      {/* Light Beam Cone (Visible when light is ON) */}
      <motion.div
        initial={false}
        animate={{
          opacity: isLightOn ? 0.85 : 0,
          scale: isLightOn ? 1 : 0.95
        }}
        transition={{ duration: 0.3 }}
        className="absolute top-[120px] pointer-events-none z-0"
        style={{
          width: '340px',
          height: '240px',
          clipPath: 'polygon(35% 0%, 65% 0%, 100% 100%, 0% 100%)',
          background: 'linear-gradient(to bottom, rgba(254, 240, 138, 0.45) 0%, rgba(250, 204, 21, 0.15) 60%, transparent 100%)',
          filter: 'blur(8px)'
        }}
      />

      {/* Warm Ambient Floor Glow */}
      <motion.div
        animate={{
          opacity: isLightOn ? 0.6 : 0,
          scale: isLightOn ? 1 : 0.8
        }}
        transition={{ duration: 0.3 }}
        className="absolute bottom-4 w-64 h-16 rounded-full bg-amber-400/30 blur-2xl pointer-events-none z-0"
      />

      {/* Main Lamp Character Assembly */}
      <div className="relative z-10 flex flex-col items-center">
        
        {/* Lamp Shade (Head) with Facial Expressions */}
        <motion.div
          animate={{
            rotate: isCoveringEyes ? -8 : focusedInput === 'email' ? eyeX * 0.5 : 0,
            y: isCoveringEyes ? 18 : isSubmitting ? -6 : 0
          }}
          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          className="relative w-44 h-36 flex items-center justify-center cursor-pointer group"
          onClick={onToggleLight}
          title="Click to toggle light!"
        >
          {/* Trapezoid Lamp Shade SVG Body */}
          <svg viewBox="0 0 160 130" className="w-full h-full drop-shadow-xl overflow-visible">
            <defs>
              <linearGradient id="shadeGradOn" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#E6D7C3" />
                <stop offset="50%" stopColor="#D4C3AC" />
                <stop offset="100%" stopColor="#BBA68E" />
              </linearGradient>

              <linearGradient id="shadeGradOff" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#4A4E58" />
                <stop offset="100%" stopColor="#2A2D34" />
              </linearGradient>

              <linearGradient id="bulbGlow" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#FFFBEB" />
                <stop offset="100%" stopColor="#FDE047" />
              </linearGradient>
            </defs>

            {/* Inner Shade Glow Rim */}
            {isLightOn && (
              <ellipse cx="80" cy="120" rx="60" ry="10" fill="url(#bulbGlow)" opacity="0.9" />
            )}

            {/* Main Lamp Shade Geometry */}
            <path
              d="M 38 15 L 122 15 L 148 118 C 148 122, 12 122, 12 118 Z"
              fill={isLightOn ? "url(#shadeGradOn)" : "url(#shadeGradOff)"}
              stroke={isLightOn ? "#A8947D" : "#1F2228"}
              strokeWidth="2"
              className="transition-colors duration-300"
            />

            {/* Shade Top Rim Cap */}
            <ellipse
              cx="80"
              cy="15"
              rx="42"
              ry="7"
              fill={isLightOn ? "#C8B59E" : "#3A3D45"}
            />

            {/* Bottom Inner Edge Depth Line */}
            <path
              d="M 12 118 C 30 128, 130 128, 148 118"
              fill="none"
              stroke={isLightOn ? "#FFE699" : "#111317"}
              strokeWidth="3"
            />
          </svg>

          {/* FACIAL EXPRESSIONS OVERLAY */}
          <div className="absolute inset-0 flex flex-col items-center justify-center pt-2 pointer-events-none">
            
            {/* Eyes Container */}
            <motion.div
              animate={{
                x: eyeX,
                y: eyeY
              }}
              transition={{ type: 'spring', stiffness: 400, damping: 25 }}
              className="flex items-center gap-6 mb-2"
            >
              {isCoveringEyes ? (
                /* Shy / Covered Eyes (> <) */
                <div className="flex gap-6 text-slate-800 dark:text-slate-900 font-black text-lg select-none">
                  <span>&gt;</span>
                  <span>&lt;</span>
                </div>
              ) : showPassword ? (
                /* Surprised Wide Eyes (O O) */
                <>
                  <div className="w-[18px] h-[18px] rounded-full bg-slate-900 flex items-center justify-center">
                    <div className="w-[6px] h-[6px] rounded-full bg-white -translate-x-[2px] -translate-y-[2px]" />
                  </div>
                  <div className="w-[18px] h-[18px] rounded-full bg-slate-900 flex items-center justify-center">
                    <div className="w-[6px] h-[6px] rounded-full bg-white -translate-x-[2px] -translate-y-[2px]" />
                  </div>
                </>
              ) : isSubmitting ? (
                /* Happy Squinting Excited Eyes (^ ^) */
                <div className="flex gap-6 text-slate-900 font-extrabold text-base">
                  <span>^</span>
                  <span>^</span>
                </div>
              ) : (
                /* Standard Cute Happy Eyes ( curved arcs or dots ) */
                <>
                  <div className="w-3.5 h-3.5 rounded-full bg-slate-900 flex items-center justify-center">
                    <div className="w-1 h-1 rounded-full bg-white -translate-x-0.5 -translate-y-0.5" />
                  </div>
                  <div className="w-3.5 h-3.5 rounded-full bg-slate-900 flex items-center justify-center">
                    <div className="w-1 h-1 rounded-full bg-white -translate-x-0.5 -translate-y-0.5" />
                  </div>
                </>
              )}
            </motion.div>

            {/* Mouth Expression */}
            <div className="relative mt-0.5">
              {isCoveringEyes ? (
                /* Small O Mouth */
                <div className="w-2.5 h-2.5 rounded-full bg-slate-800" />
              ) : isSubmitting ? (
                /* Big Open Mouth */
                <div className="w-5 h-3 rounded-b-full bg-rose-500 border border-slate-900 overflow-hidden">
                  <div className="w-3 h-1.5 bg-rose-300 rounded-full mx-auto mt-1" />
                </div>
              ) : (
                /* Cute Tongue-Out Smile 😋 */
                <div className="relative">
                  <svg width="22" height="12" viewBox="0 0 22 12" fill="none">
                    <path
                      d="M 2 2 C 7 10, 15 10, 20 2"
                      stroke="#1E293B"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                    />
                  </svg>
                  {/* Tongue */}
                  <div className="absolute top-1 left-[10px] w-2.5 h-2.5 bg-rose-400 rounded-b-full border border-slate-900" />
                </div>
              )}
            </div>

            {/* Cute Rosy Cheeks */}
            <div className="absolute top-[42px] flex justify-between w-24 px-1 pointer-events-none opacity-60">
              <div className="w-3 h-1.5 rounded-full bg-rose-400/70 blur-[1px]" />
              <div className="w-3 h-1.5 rounded-full bg-rose-400/70 blur-[1px]" />
            </div>

          </div>

          {/* Interactive Pull String Switch (Hanging on Right) */}
          <motion.div
            className="absolute top-24 right-6 flex flex-col items-center cursor-pointer z-20"
            whileHover={{ y: 3 }}
            whileTap={{ y: 12 }}
            onClick={(e) => {
              e.stopPropagation();
              onToggleLight();
            }}
            title="Pull string to switch light"
          >
            <div className="w-0.5 h-12 bg-slate-400 dark:bg-slate-500 shadow-sm" />
            <div className="w-3 h-3 rounded-full bg-amber-300 border-2 border-slate-700 shadow-md hover:scale-125 transition-transform" />
          </motion.div>

        </motion.div>

        {/* Lamp Pole Stand */}
        <div className="w-2.5 h-28 bg-gradient-to-b from-slate-200 via-slate-300 to-slate-400 dark:from-slate-600 dark:to-slate-800 border-x border-slate-400/50 shadow-inner" />

        {/* Lamp Base Baseplate */}
        <div className="w-24 h-4 rounded-t-xl bg-gradient-to-b from-slate-200 to-slate-400 dark:from-slate-700 dark:to-slate-900 border border-slate-400/60 shadow-lg flex items-center justify-center">
          <div className="w-20 h-1 rounded-full bg-slate-300/50 dark:bg-slate-800" />
        </div>

      </div>

    </div>
  );
};

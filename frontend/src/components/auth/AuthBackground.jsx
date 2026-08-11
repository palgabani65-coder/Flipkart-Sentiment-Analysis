import React from 'react';
import { motion } from 'framer-motion';
import LightPillar from '../LightPillar';

export const AuthBackground = ({ className = '' }) => {
  return (
    <div className={`fixed inset-0 pointer-events-none overflow-hidden z-0 bg-[#050711] ${className}`}>
      {/* Exclusive WebGL LightPillar Background Component */}
      <div style={{ width: '100%', height: '100%', position: 'relative' }}>
        <LightPillar
          topColor="#22D3EE"
          bottomColor="#9C43FE"
          intensity={1.0}
          rotationSpeed={0.3}
          glowAmount={0.001}
          pillarWidth={3}
          pillarHeight={0.4}
          noiseIntensity={0.5}
          pillarRotation={25}
          interactive={false}
          mixBlendMode="screen"
          quality="high"
        />
      </div>

      {/* AI Signal Particles (Subtle floating dots layer) */}
      <div className="absolute inset-0 pointer-events-none opacity-15 overflow-hidden z-10">
        {[...Array(14)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 rounded-full bg-cyan-300 shadow-[0_0_6px_rgba(34,211,238,0.8)]"
            style={{
              top: `${(i * 7 + 12) % 90}%`,
              left: `${(i * 13 + 5) % 95}%`,
            }}
            animate={{
              y: [-10, -45, -10],
              x: [-5, 12, -5],
              opacity: [0.1, 0.5, 0.1],
            }}
            transition={{
              duration: 9 + (i % 5) * 2,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: i * 0.4,
            }}
          />
        ))}
      </div>

      {/* Occasional Faint Floating Sentiment Nodes (Extremely Low Opacity Behind Content) */}
      <div className="absolute inset-0 pointer-events-none z-10 font-mono text-[9px] tracking-widest uppercase select-none overflow-hidden">
        {[
          { text: '● +0.94 POSITIVE', type: 'positive', top: '18%', left: '12%' },
          { text: '● +0.82 QUALITY', type: 'positive', top: '78%', left: '8%' },
          { text: '● -0.31 DELIVERY', type: 'negative', top: '24%', left: '84%' },
          { text: '● 0.00 NEUTRAL', type: 'neutral', top: '82%', left: '76%' },
          { text: '● +0.91 PRODUCT', type: 'positive', top: '62%', left: '20%' },
          { text: '● +0.76 VALUE', type: 'positive', top: '14%', left: '72%' }
        ].map((node, i) => (
          <motion.div
            key={i}
            className={`absolute px-2 py-0.5 rounded-full border ${node.type === 'positive'
              ? 'text-emerald-300 border-emerald-500/20 bg-emerald-950/10'
              : node.type === 'negative'
                ? 'text-rose-300 border-rose-500/20 bg-rose-950/10'
                : 'text-slate-300 border-slate-500/20 bg-slate-900/10'
              }`}
            style={{ top: node.top, left: node.left }}
            animate={{
              opacity: [0, 0.12, 0],
              y: [6, -10, -20],
            }}
            transition={{
              duration: 5.5,
              repeat: Infinity,
              repeatDelay: 4 + i * 2.5,
              ease: 'easeInOut',
              delay: i * 2.2,
            }}
          >
            {node.text}
          </motion.div>
        ))}
      </div>
    </div>
  );
};














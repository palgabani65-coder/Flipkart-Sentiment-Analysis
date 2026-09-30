import React, { useEffect } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';

export const AuthBackground = React.memo(({ className = '' }) => {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Smooth spring physics for organic fluid tracking
  const springConfig = { damping: 30, stiffness: 70 };
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);

  // Parallax layers with differing depth factors
  const gridX = useTransform(smoothX, [-0.5, 0.5], [-14, 14]);
  const gridY = useTransform(smoothY, [-0.5, 0.5], [-14, 14]);

  const orb1X = useTransform(smoothX, [-0.5, 0.5], [28, -28]);
  const orb1Y = useTransform(smoothY, [-0.5, 0.5], [28, -28]);

  const orb2X = useTransform(smoothX, [-0.5, 0.5], [-35, 35]);
  const orb2Y = useTransform(smoothY, [-0.5, 0.5], [-35, 35]);

  const orb3X = useTransform(smoothX, [-0.5, 0.5], [20, -20]);
  const orb3Y = useTransform(smoothY, [-0.5, 0.5], [20, -20]);

  useEffect(() => {
    const handleMouseMove = (e) => {
      const { innerWidth, innerHeight } = window;
      if (!innerWidth || !innerHeight) return;
      const normX = e.clientX / innerWidth - 0.5;
      const normY = e.clientY / innerHeight - 0.5;
      mouseX.set(normX);
      mouseY.set(normY);
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [mouseX, mouseY]);

  return (
    <div className={`fixed inset-0 pointer-events-none overflow-hidden z-0 bg-[#101415] ${className}`}>
      {/* Electric Cobalt Ambient Orbs with slow drift + mouse parallax */}
      <motion.div
        style={{ x: orb1X, y: orb1Y }}
        className="absolute -top-40 -left-40 w-[600px] h-[600px] bg-[#7bd0ff]/[0.05] rounded-full blur-[140px] pointer-events-none animate-ambient-drift"
      />
      <motion.div
        style={{ x: orb2X, y: orb2Y }}
        className="absolute top-1/3 -right-40 w-[700px] h-[700px] bg-[#00a6e0]/[0.04] rounded-full blur-[160px] pointer-events-none animate-ambient-drift [animation-delay:4s]"
      />
      <motion.div
        style={{ x: orb3X, y: orb3Y }}
        className="absolute -bottom-40 left-1/4 w-[500px] h-[500px] bg-[#bec6e0]/[0.035] rounded-full blur-[140px] pointer-events-none animate-ambient-drift [animation-delay:8s]"
      />

      {/* Subtle tech micro-grid with responsive parallax */}
      <motion.div
        style={{ x: gridX, y: gridY }}
        className="absolute -inset-10 opacity-[0.07] pointer-events-none"
      >
        <div
          className="w-full h-full"
          style={{
            backgroundImage: 'radial-gradient(circle at 1px 1px, #7bd0ff 1.2px, transparent 0)',
            backgroundSize: '36px 36px',
          }}
        />
      </motion.div>
    </div>
  );
});

AuthBackground.displayName = 'AuthBackground';
export default AuthBackground;

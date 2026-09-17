import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

/**
 * Custom Desktop Cursor Glow Component
 */
const CursorGlow = () => {
  const [position, setPosition] = useState({ x: -100, y: -100 });
  const [isVisible, setIsVisible] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    // Only activate on desktop devices
    if (typeof window === 'undefined' || window.innerWidth < 768) return;

    const handleMouseMove = (e) => {
      setPosition({ x: e.clientX, y: e.clientY });
      if (!isVisible) setIsVisible(true);
    };

    const handleMouseLeave = () => setIsVisible(false);
    const handleMouseEnter = () => setIsVisible(true);

    const handleHoverStart = (e) => {
      const target = e.target;
      if (!target || target.nodeType !== 1) {
        setIsHovered(false);
        return;
      }

      const isInteractive =
        target.tagName === 'BUTTON' ||
        target.tagName === 'A' ||
        (typeof target.closest === 'function' && (target.closest('button') || target.closest('a'))) ||
        (target.classList && typeof target.classList.contains === 'function' && target.classList.contains('cursor-pointer'));

      setIsHovered(Boolean(isInteractive));
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseleave', handleMouseLeave);
    window.addEventListener('mouseenter', handleMouseEnter);
    window.addEventListener('mouseover', handleHoverStart);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('mouseenter', handleMouseEnter);
      window.removeEventListener('mouseover', handleHoverStart);
    };
  }, [isVisible]);

  if (!isVisible) return null;

  return (
    <div className="hidden md:block pointer-events-none fixed inset-0 z-[9999] overflow-hidden">
      {/* Outer Trailing Halo */}
      <motion.div
        className="fixed top-0 left-0 rounded-full border border-cyan-400/50 pointer-events-none shadow-[0_0_15px_rgba(0,229,255,0.4)]"
        animate={{
          x: position.x - (isHovered ? 24 : 16),
          y: position.y - (isHovered ? 24 : 16),
          width: isHovered ? 48 : 32,
          height: isHovered ? 48 : 32,
          backgroundColor: isHovered ? 'rgba(0, 229, 255, 0.15)' : 'rgba(0, 229, 255, 0)'
        }}
        transition={{ type: 'spring', damping: 30, stiffness: 400, mass: 0.1 }}
      />

      {/* Inner Glowing Cursor Dot */}
      <motion.div
        className="fixed top-0 left-0 w-2.5 h-2.5 bg-cyan-400 rounded-full pointer-events-none shadow-[0_0_10px_#00E5FF]"
        animate={{
          x: position.x - 5,
          y: position.y - 5
        }}
        transition={{ type: 'spring', damping: 40, stiffness: 800 }}
      />
    </div>
  );
};

export default CursorGlow;

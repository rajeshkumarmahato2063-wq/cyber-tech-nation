import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

/**
 * Custom Desktop Cursor Glow Component
 * Renders a subtle glowing pointer trail on desktop displays
 */
const CursorGlow = () => {
  const [position, setPosition] = useState({ x: -100, y: -100 });
  const [isVisible, setIsVisible] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const idleTimerRef = useRef(null);

  useEffect(() => {
    // Only activate on desktop devices with fine pointer support
    if (
      typeof window === 'undefined' ||
      window.innerWidth < 768 ||
      (window.matchMedia && !window.matchMedia('(pointer: fine)').matches)
    ) {
      return;
    }

    const resetIdleTimer = () => {
      if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
      idleTimerRef.current = setTimeout(() => {
        setIsVisible(false);
      }, 3000);
    };

    const handleMouseMove = (e) => {
      setPosition({ x: e.clientX, y: e.clientY });
      setIsVisible(true);
      resetIdleTimer();
    };

    const handleMouseLeave = () => {
      setIsVisible(false);
      setIsHovered(false);
    };

    const handleMouseEnter = () => {
      setIsVisible(true);
    };

    const handleMouseOver = (e) => {
      const target = e.target;
      if (!target || target.nodeType !== 1) {
        setIsHovered(false);
        return;
      }

      const isInteractive = Boolean(
        target.tagName === 'BUTTON' ||
        target.tagName === 'A' ||
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        (typeof target.closest === 'function' && (target.closest('button') || target.closest('a'))) ||
        (target.classList && typeof target.classList.contains === 'function' && target.classList.contains('cursor-pointer'))
      );

      setIsHovered(isInteractive);
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('mouseleave', handleMouseLeave);
    window.addEventListener('mouseenter', handleMouseEnter);
    window.addEventListener('mouseover', handleMouseOver, { passive: true });

    return () => {
      if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('mouseenter', handleMouseEnter);
      window.removeEventListener('mouseover', handleMouseOver);
    };
  }, []);

  if (!isVisible) return null;

  return (
    <div className="hidden md:block pointer-events-none fixed inset-0 z-[9999] overflow-hidden select-none">
      {/* Outer Trailing Halo */}
      <motion.div
        className="fixed top-0 left-0 rounded-full border border-cyan-400/40 pointer-events-none shadow-[0_0_12px_rgba(0,229,255,0.3)]"
        animate={{
          x: position.x - (isHovered ? 20 : 12),
          y: position.y - (isHovered ? 20 : 12),
          width: isHovered ? 40 : 24,
          height: isHovered ? 40 : 24,
          opacity: isVisible ? 1 : 0,
          backgroundColor: isHovered ? 'rgba(0, 229, 255, 0.1)' : 'rgba(0, 229, 255, 0)'
        }}
        transition={{ type: 'spring', damping: 28, stiffness: 350, mass: 0.1 }}
      />

      {/* Inner Glowing Cursor Dot */}
      <motion.div
        className="fixed top-0 left-0 w-2 h-2 bg-cyan-400 rounded-full pointer-events-none shadow-[0_0_8px_#00E5FF]"
        animate={{
          x: position.x - 4,
          y: position.y - 4,
          opacity: isVisible ? 1 : 0
        }}
        transition={{ type: 'spring', damping: 35, stiffness: 700 }}
      />
    </div>
  );
};

export default CursorGlow;


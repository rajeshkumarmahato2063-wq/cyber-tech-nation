import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

/**
 * Top Window Scroll Progress Bar Component
 */
const ScrollProgress = () => {
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight > 0) {
        const currentProgress = (window.scrollY / totalHeight) * 100;
        setScrollProgress(currentProgress);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="fixed top-0 left-0 right-0 h-1 z-[999] pointer-events-none">
      <motion.div
        className="h-full bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 shadow-[0_0_15px_rgba(0,229,255,0.8)] origin-left"
        style={{ width: `${scrollProgress}%` }}
        transition={{ duration: 0.1, ease: 'easeOut' }}
      />
    </div>
  );
};

export default ScrollProgress;

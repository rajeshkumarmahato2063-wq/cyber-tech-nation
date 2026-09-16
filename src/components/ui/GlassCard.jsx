import React from 'react';
import { motion } from 'framer-motion';

/**
 * Reusable Glassmorphism Card Component
 * 
 * @param {Object} props
 * @param {React.ReactNode} props.children
 * @param {string} [props.className='']
 * @param {boolean} [props.hoverEffect=true]
 * @param {'cyan' | 'purple' | 'blue' | 'none'} [props.glowColor='cyan']
 * @param {Function} [props.onClick]
 * @param {number} [props.delay=0]
 */
const GlassCard = ({
  children,
  className = '',
  hoverEffect = true,
  glowColor = 'cyan',
  onClick,
  delay = 0,
  ...props
}) => {
  const glowStyles = {
    cyan: "hover:border-cyan-400/40 hover:shadow-[0_10px_35px_-10px_rgba(0,229,255,0.2)]",
    purple: "hover:border-purple-400/40 hover:shadow-[0_10px_35px_-10px_rgba(124,58,237,0.2)]",
    blue: "hover:border-blue-400/40 hover:shadow-[0_10px_35px_-10px_rgba(37,99,235,0.2)]",
    none: ""
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.5, delay: delay }}
      whileHover={hoverEffect ? { y: -4, scale: 1.01 } : {}}
      onClick={onClick}
      className={`
        relative rounded-2xl p-6
        bg-[#0B1120]/70 backdrop-blur-xl
        border border-white/10
        shadow-[0_8px_32px_0_rgba(0,0,0,0.37)]
        transition-all duration-300
        ${hoverEffect ? glowStyles[glowColor] : ''}
        ${onClick ? 'cursor-pointer' : ''}
        ${className}
      `}
      {...props}
    >
      {/* Subtle top glare highlight line */}
      <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent rounded-t-2xl pointer-events-none" />
      
      {children}
    </motion.div>
  );
};

export default GlassCard;

import React from 'react';
import { motion } from 'framer-motion';

/**
 * Reusable Cyber-Tech Section Title Component
 * 
 * @param {Object} props
 * @param {string} props.title - Main heading title
 * @param {string} [props.subtitle] - Supporting subtitle text
 * @param {string} [props.badge] - Small floating badge above title
 * @param {'center' | 'left' | 'right'} [props.align='center']
 * @param {string} [props.className='']
 */
const SectionTitle = ({
  title,
  subtitle,
  badge,
  align = 'center',
  className = ''
}) => {
  const alignStyles = {
    center: 'text-center items-center',
    left: 'text-left items-start',
    right: 'text-right items-end'
  };

  const lineAlignStyles = {
    center: 'mx-auto',
    left: 'mr-auto',
    right: 'ml-auto'
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className={`flex flex-col mb-12 ${alignStyles[align]} ${className}`}
    >
      {badge && (
        <span className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-semibold uppercase tracking-wider bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 mb-3 shadow-[0_0_15px_rgba(0,229,255,0.15)]">
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
          {badge}
        </span>
      )}

      <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight section-title text-white">
        <span className="bg-gradient-to-r from-white via-slate-100 to-cyan-300 bg-clip-text text-transparent">
          {title}
        </span>
      </h2>

      {/* Animated Glowing Accent Underline */}
      <motion.div
        initial={{ width: 0 }}
        whileInView={{ width: '80px' }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className={`h-1 bg-gradient-to-r from-cyan-400 via-blue-600 to-purple-600 rounded-full mt-4 mb-3 shadow-[0_0_12px_rgba(0,229,255,0.6)] ${lineAlignStyles[align]}`}
      />

      {subtitle && (
        <p className="text-slate-400 text-base sm:text-lg max-w-2xl font-normal leading-relaxed mt-1">
          {subtitle}
        </p>
      )}
    </motion.div>
  );
};

export default SectionTitle;

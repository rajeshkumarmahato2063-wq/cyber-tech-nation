import React from 'react';
import { motion } from 'framer-motion';

/**
 * Reusable Cyber-Tech Button Component
 * 
 * @param {Object} props
 * @param {'primary' | 'secondary'} [props.variant='primary']
 * @param {React.ReactNode} props.children
 * @param {React.ReactNode} [props.icon]
 * @param {'left' | 'right'} [props.iconPosition='right']
 * @param {string} [props.className='']
 * @param {Function} [props.onClick]
 * @param {string} [props.type='button']
 * @param {boolean} [props.disabled=false]
 */
const Button = ({
  variant = 'primary',
  children,
  icon: Icon,
  iconPosition = 'right',
  className = '',
  onClick,
  type = 'button',
  disabled = false,
  ...props
}) => {
  // Base style shared by all button variants
  const baseStyles = "relative inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full font-semibold text-sm tracking-wide transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer select-none overflow-hidden";

  // Variant specific styling
  const variants = {
    primary: "bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-400 text-white shadow-[0_0_20px_rgba(37,99,235,0.4)] hover:shadow-[0_0_30px_rgba(0,229,255,0.6)] border border-cyan-400/30",
    secondary: "bg-transparent text-slate-200 border border-white/20 hover:border-cyan-400/60 hover:text-cyan-400 hover:bg-cyan-500/10 shadow-[0_0_15px_rgba(255,255,255,0.05)] hover:shadow-[0_0_20px_rgba(0,229,255,0.2)]"
  };

  return (
    <motion.button
      whileHover={{ y: disabled ? 0 : -2, scale: disabled ? 1 : 1.02 }}
      whileTap={{ scale: disabled ? 1 : 0.98 }}
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyles} ${variants[variant] || variants.primary} ${className}`}
      {...props}
    >
      {/* Background ambient light shimmer on hover */}
      <span className="absolute inset-0 bg-white/10 opacity-0 hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

      {Icon && iconPosition === 'left' && (
        <span className="w-5 h-5 flex items-center justify-center shrink-0">
          {typeof Icon === 'function' ? <Icon className="w-4 h-4" /> : Icon}
        </span>
      )}

      <span>{children}</span>

      {Icon && iconPosition === 'right' && (
        <span className="w-5 h-5 flex items-center justify-center shrink-0">
          {typeof Icon === 'function' ? <Icon className="w-4 h-4" /> : Icon}
        </span>
      )}
    </motion.button>
  );
};

export default Button;

import React from 'react';
import { motion } from 'framer-motion';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

/**
 * Reusable ThemeToggle Component connected to global ThemeContext
 */
const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <motion.button
      whileHover={{ scale: 1.08 }}
      whileTap={{ scale: 0.92 }}
      onClick={toggleTheme}
      className={`
        p-2.5 rounded-xl border transition-all duration-300
        flex items-center justify-center cursor-pointer relative z-50
        ${theme === 'dark'
          ? 'bg-white/5 hover:bg-white/10 text-cyan-400 border-white/10 shadow-[0_0_15px_rgba(0,229,255,0.2)]'
          : 'bg-white hover:bg-slate-100 text-amber-500 border-slate-300 shadow-md'}
      `}
      aria-label="Toggle Dark/Light Mode"
      title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
    >
      <motion.div
        key={theme}
        initial={{ rotate: -90, opacity: 0 }}
        animate={{ rotate: 0, opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        {theme === 'dark' ? <Moon className="w-5 h-5 text-cyan-400" /> : <Sun className="w-5 h-5 text-amber-500" />}
      </motion.div>
    </motion.button>
  );
};

export default ThemeToggle;


import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, HelpCircle } from 'lucide-react';

/**
 * Reusable FAQItem Component
 * 
 * @param {Object} props
 * @param {Object} props.faq - FAQ data object { id, question, answer, category }
 * @param {boolean} props.isOpen - Whether the accordion item is expanded
 * @param {Function} props.onToggle - Click handler to toggle accordion
 * @param {number} props.index - Index position
 */
const FAQItem = ({ faq, isOpen, onToggle, index }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.4, delay: index * 0.08 }}
      className={`
        rounded-2xl overflow-hidden
        bg-[#0B1120]/80 backdrop-blur-xl
        border transition-all duration-300
        ${isOpen 
          ? 'border-cyan-400/50 shadow-[0_10px_30px_-5px_rgba(0,229,255,0.25)]' 
          : 'border-white/10 hover:border-white/20 shadow-md'}
      `}
    >
      {/* Question Toggle Header */}
      <button
        type="button"
        onClick={onToggle}
        className="w-full p-5 sm:p-6 text-left flex items-center justify-between gap-4 group focus:outline-none"
        aria-expanded={isOpen}
      >
        <div className="flex items-center gap-3.5">
          <div className={`
            p-2 rounded-xl transition-colors duration-300 shrink-0
            ${isOpen ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30' : 'bg-white/5 text-slate-400 group-hover:text-cyan-400'}
          `}>
            <HelpCircle className="w-5 h-5" />
          </div>

          <h3 className={`
            text-base sm:text-lg font-bold tracking-tight transition-colors duration-300
            ${isOpen ? 'text-cyan-300' : 'text-white group-hover:text-cyan-200'}
          `}>
            {faq.question}
          </h3>
        </div>

        {/* Animated Chevron Arrow */}
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3, ease: 'easeInOut' }}
          className={`
            p-1.5 rounded-full shrink-0 transition-colors duration-300
            ${isOpen ? 'bg-cyan-500/20 text-cyan-400' : 'bg-white/5 text-slate-400 group-hover:text-white'}
          `}
        >
          <ChevronDown className="w-5 h-5" />
        </motion.div>
      </button>

      {/* Expandable Answer Content */}
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
          >
            <div className="px-6 pb-6 pt-1 text-slate-300 text-sm sm:text-base leading-relaxed font-normal border-t border-white/5">
              {faq.answer}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default FAQItem;

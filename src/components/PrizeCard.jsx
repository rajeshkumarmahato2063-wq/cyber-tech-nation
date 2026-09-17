import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, Sparkles } from 'lucide-react';

/**
 * Prize Theme Color Mapping Configuration
 */
const THEME_STYLES = {
  gold: {
    border: 'border-amber-500/30 hover:border-amber-400/80',
    shadow: 'hover:shadow-[0_15px_45px_-10px_rgba(245,158,11,0.35)]',
    iconBg: 'bg-gradient-to-br from-amber-500/20 to-yellow-500/10 text-amber-400 border-amber-500/40 shadow-[0_0_20px_rgba(245,158,11,0.3)]',
    amountText: 'bg-gradient-to-r from-amber-200 via-yellow-400 to-amber-500 bg-clip-text text-transparent',
    badge: 'bg-amber-500/20 text-amber-300 border-amber-500/40 shadow-[0_0_12px_rgba(245,158,11,0.2)]',
    topGlare: 'from-amber-400/60'
  },
  silver: {
    border: 'border-slate-400/30 hover:border-cyan-300/80',
    shadow: 'hover:shadow-[0_15px_45px_-10px_rgba(148,163,184,0.3)]',
    iconBg: 'bg-gradient-to-br from-slate-300/20 to-cyan-500/10 text-slate-200 border-slate-300/40 shadow-[0_0_20px_rgba(148,163,184,0.25)]',
    amountText: 'bg-gradient-to-r from-slate-100 via-slate-300 to-cyan-200 bg-clip-text text-transparent',
    badge: 'bg-slate-400/20 text-slate-200 border-slate-400/40 shadow-[0_0_12px_rgba(148,163,184,0.2)]',
    topGlare: 'from-slate-300/60'
  },
  bronze: {
    border: 'border-amber-700/30 hover:border-amber-600/80',
    shadow: 'hover:shadow-[0_15px_45px_-10px_rgba(217,119,6,0.3)]',
    iconBg: 'bg-gradient-to-br from-amber-700/20 to-orange-500/10 text-amber-400 border-amber-700/40 shadow-[0_0_20px_rgba(217,119,6,0.25)]',
    amountText: 'bg-gradient-to-r from-amber-300 via-amber-600 to-orange-400 bg-clip-text text-transparent',
    badge: 'bg-amber-700/20 text-amber-400 border-amber-700/40 shadow-[0_0_12px_rgba(217,119,6,0.2)]',
    topGlare: 'from-amber-600/60'
  },
  special: {
    border: 'border-cyan-500/30 hover:border-cyan-400/80',
    shadow: 'hover:shadow-[0_15px_45px_-10px_rgba(0,229,255,0.35)]',
    iconBg: 'bg-gradient-to-br from-cyan-500/20 to-purple-500/10 text-cyan-400 border-cyan-500/40 shadow-[0_0_20px_rgba(0,229,255,0.3)]',
    amountText: 'bg-gradient-to-r from-cyan-300 via-blue-400 to-purple-400 bg-clip-text text-transparent',
    badge: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40 shadow-[0_0_12px_rgba(0,229,255,0.2)]',
    topGlare: 'from-cyan-400/60'
  }
};

/**
 * Reusable PrizeCard Component
 */
const PrizeCard = ({ prize, index }) => {
  const theme = THEME_STYLES[prize.theme] || THEME_STYLES.special;
  const Icon = prize.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.5, delay: index * 0.15 }}
      whileHover={{ y: -10, scale: 1.02 }}
      className={`
        group relative rounded-2xl p-7
        bg-[#0B1120]/80 backdrop-blur-xl
        border border-white/10
        shadow-[0_8px_32px_0_rgba(0,0,0,0.4)]
        transition-all duration-300 ease-out
        flex flex-col justify-between shine-effect
        ${theme.border}
        ${theme.shadow}
        ${prize.isFeatured ? 'lg:-translate-y-3 lg:border-amber-400/60' : ''}
      `}
    >
      {/* Top Border Glow Glare */}
      <div className={`absolute inset-x-0 top-0 h-[1.5px] bg-gradient-to-r from-transparent ${theme.topGlare} to-transparent rounded-t-2xl opacity-80 group-hover:opacity-100 transition-opacity duration-300`} />

      <div>
        {/* Card Header: Badge & Floating Icon */}
        <div className="flex items-center justify-between mb-6">
          <span className={`px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider border ${theme.badge}`}>
            {prize.badge}
          </span>

          {/* Floating Icon Container */}
          <motion.div
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 3 + index, repeat: Infinity, ease: 'easeInOut' }}
            className={`p-4 rounded-2xl border ${theme.iconBg}`}
          >
            <Icon className="w-8 h-8" />
          </motion.div>
        </div>

        {/* Prize Title */}
        <h3 className="text-xl font-bold text-white mb-2 tracking-tight group-hover:text-slate-100 transition-colors">
          {prize.title}
        </h3>

        {/* Prize Amount or Special Banner */}
        <div className="mb-6">
          {prize.amount ? (
            <div className="flex items-baseline gap-1">
              <span className={`text-4xl md:text-5xl font-black font-mono tracking-tight ${theme.amountText}`}>
                {prize.amount}
              </span>
            </div>
          ) : (
            <div className={`text-2xl font-extrabold tracking-tight ${theme.amountText}`}>
              Exclusive Rewards
            </div>
          )}
          <p className="text-slate-400 text-xs mt-1 font-medium">{prize.subtitle}</p>
        </div>
      </div>

      {/* Perks List */}
      <div className="pt-5 border-t border-white/10 space-y-2.5">
        {prize.perks.map((perk, pIdx) => (
          <div key={pIdx} className="flex items-start gap-2.5 text-xs text-slate-300">
            <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
            <span className="leading-snug">{perk}</span>
          </div>
        ))}
      </div>
    </motion.div>
  );
};

export default PrizeCard;

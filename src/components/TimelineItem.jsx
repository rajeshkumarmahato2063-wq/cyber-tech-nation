import React from 'react';
import { motion } from 'framer-motion';
import { Clock, CheckCircle2 } from 'lucide-react';

/**
 * Reusable Timeline Item Component
 * 
 * @param {Object} props
 * @param {Object} props.item - Timeline event item payload
 * @param {number} props.index - Index of the item in the list
 * @param {boolean} props.isLast - Whether this is the final timeline node
 */
const TimelineItem = ({ item, index, isLast }) => {
  const isEven = index % 2 === 1;
  const Icon = item.icon;

  return (
    <div className="relative mb-12 last:mb-0">
      {/* Central / Left Animated Glowing Node Dot */}
      <div className="absolute left-6 md:left-1/2 -translate-x-1/2 top-0 z-20 flex items-center justify-center">
        {/* Pulsing Neon Glow Ring */}
        <div className="absolute w-12 h-12 rounded-full bg-cyan-400/20 animate-ring-pulse pointer-events-none" />
        
        {/* Core Node Circle */}
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: index * 0.15 }}
          className={`
            relative w-11 h-11 rounded-full
            bg-[#0B1120] border-2 border-cyan-400
            flex items-center justify-center text-cyan-400
            shadow-[0_0_20px_rgba(0,229,255,0.7)]
            transition-all duration-300 hover:scale-110 hover:border-white
          `}
        >
          <Icon className="w-5 h-5" />
        </motion.div>
      </div>

      {/* Card Wrapper with Desktop Alternating Slide & Mobile Left Alignment */}
      <div className={`
        relative flex flex-col
        pl-16 md:pl-0
        ${isEven ? 'md:items-end md:text-right' : 'md:items-start md:text-left'}
      `}>
        {/* Framer Motion Animated Glass Container */}
        <motion.div
          initial={{
            opacity: 0,
            x: typeof window !== 'undefined' && window.innerWidth < 768 ? 30 : (isEven ? 60 : -60)
          }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.6, delay: index * 0.12, ease: [0.25, 0.1, 0.25, 1.0] }}
          className={`
            w-full md:w-[calc(50%-3rem)]
            ${isEven ? 'md:ml-auto' : 'md:mr-auto'}
            group relative rounded-2xl p-6 md:p-7
            bg-[#0B1120]/80 backdrop-blur-xl
            border border-white/10
            shadow-[0_8px_32px_0_rgba(0,0,0,0.37)]
            hover:border-cyan-400/50 hover:shadow-[0_10px_35px_-5px_rgba(0,229,255,0.25)]
            transition-all duration-300
          `}
        >
          {/* Neon Glare Underline on Hover */}
          <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-cyan-400/50 to-transparent rounded-t-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

          {/* Header Badges: Phase & Date */}
          <div className={`
            flex flex-wrap items-center gap-2.5 mb-4
            ${isEven ? 'md:justify-end' : 'md:justify-start'}
          `}>
            {/* Phase Badge */}
            <span className="px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 shadow-[0_0_12px_rgba(0,229,255,0.15)]">
              {item.phase}
            </span>

            {/* Date Pill */}
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-white/5 text-slate-300 border border-white/10">
              <Clock className="w-3.5 h-3.5 text-cyan-400" />
              {item.date}
            </span>

            {item.status === 'active' && (
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                Live Now
              </span>
            )}
          </div>

          {/* Event Title */}
          <h3 className="text-xl md:text-2xl font-bold text-white mb-2 tracking-tight group-hover:text-cyan-300 transition-colors duration-300">
            {item.title}
          </h3>

          {/* Event Description */}
          <p className="text-slate-300 text-sm md:text-base leading-relaxed font-normal mb-4">
            {item.description}
          </p>

          {/* Event Highlights / Key Takeaways */}
          {item.highlights && item.highlights.length > 0 && (
            <div className={`
              pt-4 border-t border-white/5 flex flex-wrap gap-2
              ${isEven ? 'md:justify-end' : 'md:justify-start'}
            `}>
              {item.highlights.map((highlight, hIdx) => (
                <span 
                  key={hIdx} 
                  className="inline-flex items-center gap-1 text-xs font-medium text-slate-400 bg-white/5 px-2.5 py-1 rounded-md border border-white/5"
                >
                  <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" />
                  {highlight}
                </span>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default TimelineItem;

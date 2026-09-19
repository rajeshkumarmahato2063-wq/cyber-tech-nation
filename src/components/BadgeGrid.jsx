import React from 'react';
import { Trophy, Award, Zap, Cpu, Code, Users, Star } from 'lucide-react';
import { motion } from 'framer-motion';

const iconMap = {
  Trophy: Trophy,
  Award: Award,
  Zap: Zap,
  Cpu: Cpu,
  Code: Code,
  Users: Users
};

const colorMap = {
  yellow: 'bg-amber-500/20 text-amber-400 border-amber-500/40 shadow-[0_0_20px_rgba(245,158,11,0.3)]',
  cyan: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/40 shadow-[0_0_20px_rgba(0,229,255,0.3)]',
  purple: 'bg-purple-500/20 text-purple-300 border-purple-500/40 shadow-[0_0_20px_rgba(168,85,247,0.3)]',
  emerald: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40 shadow-[0_0_20px_rgba(16,185,129,0.3)]',
  blue: 'bg-blue-500/20 text-blue-400 border-blue-500/40 shadow-[0_0_20px_rgba(59,130,246,0.3)]',
  amber: 'bg-amber-500/20 text-amber-300 border-amber-500/40 shadow-[0_0_20px_rgba(217,119,6,0.3)]'
};

const BadgeGrid = ({ badges = [] }) => {
  if (!badges || badges.length === 0) return null;

  return (
    <div className="space-y-4 font-sans text-left">
      <div className="flex items-center gap-2 text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider">
        <Star className="w-4 h-4" /> Earned Achievement Badges ({badges.length})
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
        {badges.map((b, idx) => {
          const IconComponent = iconMap[b.icon] || Trophy;
          const style = colorMap[b.color] || colorMap.cyan;

          return (
            <motion.div
              key={b.code || idx}
              whileHover={{ scale: 1.05, y: -4 }}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.05 }}
              className={`p-3.5 rounded-2xl border ${style} flex flex-col items-center justify-center text-center space-y-1.5 backdrop-blur-md cursor-pointer`}
              title={b.description}
            >
              <div className="p-2.5 rounded-xl bg-black/40 border border-white/10">
                <IconComponent className="w-6 h-6" />
              </div>
              <span className="font-mono text-xs font-bold truncate max-w-[100px] text-white">{b.title}</span>
              <span className="text-[9px] text-slate-300 line-clamp-1">{b.description}</span>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default BadgeGrid;

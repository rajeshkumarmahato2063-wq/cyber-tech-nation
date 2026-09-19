import React from 'react';
import { Trophy, Award, Gift, Star } from 'lucide-react';
import { motion } from 'framer-motion';

const PrizeSection = ({ prizePool = '$10,000 USD' }) => {
  const prizes = [
    {
      rank: '1st Place Grand Winner',
      amount: '$5,000 USD',
      icon: Trophy,
      color: 'from-amber-400 to-yellow-600',
      glow: 'shadow-[0_0_30px_rgba(245,158,11,0.3)]',
      border: 'border-amber-500/50',
      perks: ['Cash Prize', 'VCC Mentorship Access', 'Cloud Credits ($2,000)', 'Grand Trophy & Certificates']
    },
    {
      rank: '2nd Place Runner-Up',
      amount: '$3,000 USD',
      icon: Award,
      color: 'from-slate-300 to-slate-500',
      glow: 'shadow-[0_0_30px_rgba(203,213,225,0.2)]',
      border: 'border-slate-400/50',
      perks: ['Cash Prize', 'Cloud Credits ($1,000)', 'Fast-track Incubator Interview', 'Silver Certificates']
    },
    {
      rank: '3rd Place Bronze',
      amount: '$2,000 USD',
      icon: Gift,
      color: 'from-amber-600 to-amber-800',
      glow: 'shadow-[0_0_30px_rgba(217,119,6,0.2)]',
      border: 'border-amber-700/50',
      perks: ['Cash Prize', 'Swag Kit & Gadgets', 'Hardware Dev Boards', 'Bronze Certificates']
    }
  ];

  return (
    <section className="py-12 px-6 max-w-6xl mx-auto space-y-8 text-center font-sans">
      <div className="space-y-3">
        <span className="px-4 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 font-mono text-xs font-bold uppercase tracking-widest">
          🏆 Rewards & Bounties
        </span>
        <h2 className="text-3xl sm:text-5xl font-extrabold font-mono text-white tracking-tight">
          Prize Pool Breakdown ({prizePool})
        </h2>
        <p className="text-slate-400 text-sm max-w-xl mx-auto">
          Compete for cash rewards, incubation opportunities, cloud credits, and direct investor mentorship.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
        {prizes.map((p, idx) => {
          const Icon = p.icon;
          return (
            <motion.div
              key={p.rank}
              whileHover={{ y: -8, scale: 1.02 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className={`relative p-8 rounded-3xl bg-[#0B1120]/90 border ${p.border} ${p.glow} backdrop-blur-md flex flex-col justify-between space-y-6 text-left`}
            >
              <div className="space-y-4">
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${p.color} p-3 text-slate-950 flex items-center justify-center font-bold shadow-lg`}>
                  <Icon className="w-8 h-8" />
                </div>

                <div>
                  <span className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider block">{p.rank}</span>
                  <div className="text-3xl font-extrabold font-mono text-white mt-1">{p.amount}</div>
                </div>

                <div className="space-y-2 pt-2 border-t border-white/10 text-xs font-mono text-slate-300">
                  {p.perks.map((perk) => (
                    <div key={perk} className="flex items-center gap-2">
                      <Star className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                      <span>{perk}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-2 text-[10px] font-mono text-cyan-400 font-bold uppercase">
                Official Winner Certificate Included
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
};

export default PrizeSection;

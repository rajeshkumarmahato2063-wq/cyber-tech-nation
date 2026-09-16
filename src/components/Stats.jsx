import React from 'react';
import { Users, Users2, Trophy, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import GlassCard from './ui/GlassCard';
import Counter from './ui/Counter';

/**
 * Statistics Section with Animated Counters
 */
const Stats = () => {
  const statsData = [
    {
      label: 'Participants',
      value: 500,
      suffix: '+',
      prefix: '',
      icon: Users,
      color: 'text-cyan-400',
      borderGlow: 'cyan',
      description: 'Hackers from premier colleges'
    },
    {
      label: 'Teams',
      value: 100,
      suffix: '+',
      prefix: '',
      icon: Users2,
      color: 'text-blue-400',
      borderGlow: 'blue',
      description: 'Cross-functional teams competing'
    },
    {
      label: 'Prize Pool',
      value: 10000,
      suffix: '',
      prefix: '₹',
      icon: Trophy,
      color: 'text-yellow-400',
      borderGlow: 'purple',
      description: 'Cash prizes & sponsor perks'
    },
    {
      label: 'Innovation Domains',
      value: 10,
      suffix: '+',
      prefix: '',
      icon: Sparkles,
      color: 'text-pink-400',
      borderGlow: 'purple',
      description: 'Cutting-edge technology tracks'
    },
  ];

  return (
    <section id="stats" className="relative py-16 px-6 z-10">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {statsData.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <GlassCard
                key={stat.label}
                glowColor={stat.borderGlow}
                delay={index * 0.1}
                className="flex flex-col items-center text-center p-8 group hover:-translate-y-2 transition-all duration-300"
              >
                {/* Icon with glowing background */}
                <div className="p-3 rounded-2xl bg-white/[0.03] border border-white/10 text-white group-hover:border-cyan-400/40 group-hover:shadow-[0_0_20px_rgba(0,229,255,0.3)] transition-all duration-300 mb-4">
                  <Icon className={`w-7 h-7 ${stat.color}`} />
                </div>

                {/* Animated Counter Value */}
                <div className="text-4xl sm:text-5xl font-extrabold my-1">
                  <Counter
                    target={stat.value}
                    prefix={stat.prefix}
                    suffix={stat.suffix}
                    duration={2.2}
                    className={`bg-gradient-to-r from-white via-slate-100 to-${stat.color.replace('text-', '')} bg-clip-text text-transparent drop-shadow-[0_0_15px_rgba(0,229,255,0.2)]`}
                  />
                </div>

                {/* Stat Title */}
                <div className="text-base font-bold text-slate-200 mt-1">
                  {stat.label}
                </div>

                {/* Description */}
                <div className="text-xs text-slate-400 mt-1 font-medium">
                  {stat.description}
                </div>
              </GlassCard>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
};

export default Stats;

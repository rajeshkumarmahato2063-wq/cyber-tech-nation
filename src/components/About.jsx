import React from 'react';
import { Clock, Users, Lightbulb, Trophy, BookOpen, Network, TrendingUp, Sparkles, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';
import SectionTitle from './ui/SectionTitle';
import GlassCard from './ui/GlassCard';

/**
 * About ZAYATHON & Why Participate Section
 */
const About = () => {
  // Four Key Features Cards
  const features = [
    {
      icon: Clock,
      title: '48-Hour Sprint',
      description: 'Non-stop innovation marathon to brainstorm, prototype, and build production-ready software solutions.',
      glowColor: 'cyan',
      iconColor: 'text-cyan-400',
      badge: 'Sprint'
    },
    {
      icon: Users,
      title: '500+ Innovators',
      description: 'Connect with developers, designers, and tech creators from premier universities across the nation.',
      glowColor: 'blue',
      iconColor: 'text-blue-400',
      badge: 'Community'
    },
    {
      icon: Lightbulb,
      title: 'Real-World Impact',
      description: 'Tackle cutting-edge industry problem statements crafted in partnership with leading technology companies.',
      glowColor: 'purple',
      iconColor: 'text-purple-400',
      badge: 'Innovation'
    },
    {
      icon: Trophy,
      title: '₹10,000+ Rewards',
      description: 'Win exciting cash prizes, exclusive merchandise, cloud credits, and direct interview opportunities.',
      glowColor: 'purple',
      iconColor: 'text-yellow-400',
      badge: 'Rewards'
    }
  ];

  // Why Participate Cards (Learn, Network, Grow)
  const benefits = [
    {
      icon: BookOpen,
      title: 'Learn & Build',
      subtitle: 'Hands-on Technical Mastery',
      color: 'text-cyan-400',
      borderColor: 'border-cyan-500/30',
      glow: 'cyan',
      points: [
        'Explore AI, Web3, Cloud, and Fullstack technologies',
        'Receive direct mentorship from senior software engineers',
        'Learn rapid agile prototyping under expert guidance'
      ]
    },
    {
      icon: Network,
      title: 'Network & Connect',
      subtitle: 'Expand Your Tech Circles',
      color: 'text-purple-400',
      borderColor: 'border-purple-500/30',
      glow: 'purple',
      points: [
        'Pitch ideas directly to startup founders & angel investors',
        'Collaborate with ambitious teammates and designers',
        'Join an elite alumni network of hackathon champions'
      ]
    },
    {
      icon: TrendingUp,
      title: 'Grow & Excel',
      subtitle: 'Accelerate Your Career',
      color: 'text-blue-400',
      borderColor: 'border-blue-500/30',
      glow: 'blue',
      points: [
        'Add a high-impact, verified project to your portfolio',
        'Earn nationally recognized digital certificates',
        'Access fast-tracked internship and job interviews'
      ]
    }
  ];

  return (
    <section id="about" className="section-container relative z-10 pt-20">
      
      {/* 1. Header & Vision Statement */}
      <SectionTitle
        badge="About The Hackathon"
        title="EMPOWERING TOMORROW'S CREATORS"
        subtitle="ZAYATHON 2026 is an intense 48-hour national hackathon hosted by ZAYA CODE HUB, designed to foster innovation, collaboration, and high-impact technology solutions."
      />

      {/* 2. Four Feature Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
        {features.map((feature, idx) => {
          const Icon = feature.icon;
          return (
            <GlassCard
              key={feature.title}
              glowColor={feature.glowColor}
              delay={idx * 0.1}
              className="flex flex-col justify-between p-6 rounded-2xl hover:-translate-y-2 transition-all duration-300 group"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 rounded-xl bg-white/[0.03] border border-white/10 group-hover:border-cyan-400/40 group-hover:shadow-[0_0_20px_rgba(0,229,255,0.3)] transition-all duration-300">
                    <Icon className={`w-6 h-6 ${feature.iconColor}`} />
                  </div>
                  <span className="text-[10px] font-mono uppercase tracking-wider px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-slate-400">
                    {feature.badge}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-white mb-2 group-hover:text-cyan-300 transition-colors">
                  {feature.title}
                </h3>
                <p className="text-slate-400 text-sm leading-relaxed">
                  {feature.description}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-white/5 flex items-center gap-1.5 text-xs text-slate-400 font-mono">
                <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                <span>Featured Metric</span>
              </div>
            </GlassCard>
          );
        })}
      </div>

      {/* 3. Why Participate Section */}
      <div className="mt-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-semibold uppercase tracking-wider bg-purple-500/10 text-purple-400 border border-purple-500/20 mb-3 shadow-[0_0_15px_rgba(124,58,237,0.15)]">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Why Join ZAYATHON</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight section-title">
            TRANSFORM YOUR SKILLS IN <span className="gradient-text">48 HOURS</span>
          </h2>
          <p className="text-slate-400 text-base max-w-xl mx-auto mt-2">
            Beyond the thrill of competition, here is how ZAYATHON empowers every participant.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {benefits.map((benefit, index) => {
            const Icon = benefit.icon;
            return (
              <GlassCard
                key={benefit.title}
                glowColor={benefit.glow}
                delay={index * 0.15}
                className="p-8 flex flex-col justify-between hover:-translate-y-2 transition-all duration-300"
              >
                <div>
                  <div className="flex items-center gap-4 mb-6">
                    <div className={`p-3.5 rounded-2xl bg-white/[0.03] border ${benefit.borderColor} shadow-[0_0_20px_rgba(0,229,255,0.15)]`}>
                      <Icon className={`w-7 h-7 ${benefit.color}`} />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-white">
                        {benefit.title}
                      </h3>
                      <p className="text-xs font-medium text-slate-400">
                        {benefit.subtitle}
                      </p>
                    </div>
                  </div>

                  <ul className="space-y-3.5">
                    {benefit.points.map((pt, i) => (
                      <li key={i} className="flex items-start gap-3 text-sm text-slate-300 leading-snug">
                        <CheckCircle2 className={`w-4 h-4 shrink-0 mt-0.5 ${benefit.color}`} />
                        <span>{pt}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-8 pt-4 border-t border-white/10 flex items-center justify-between text-xs text-slate-400 font-mono">
                  <span>Track Advantage</span>
                  <span className={benefit.color}>0{index + 1} / 03</span>
                </div>
              </GlassCard>
            );
          })}
        </div>
      </div>

    </section>
  );
};

export default About;

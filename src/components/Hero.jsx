import React from 'react';
import { Rocket, ArrowRight, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import Button from './ui/Button';
import GlassCard from './ui/GlassCard';

/**
 * Hero Component utilizing Phase 2 Design System
 */
const Hero = () => {
  return (
    <section className="relative min-h-[85vh] flex flex-col items-center justify-center text-center px-6 py-20 overflow-hidden">
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="flex flex-col items-center gap-6 max-w-4xl z-10"
      >
        {/* Cyber Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-semibold uppercase tracking-widest shadow-[0_0_15px_rgba(0,229,255,0.2)]">
          <Sparkles className="w-4 h-4 animate-spin-slow" />
          <span>National Level College Hackathon 2026</span>
        </div>

        {/* Hero Title */}
        <h1 className="text-5xl sm:text-6xl md:text-7xl font-extrabold tracking-tight section-title leading-tight">
          BUILD THE FUTURE AT <br />
          <span className="gradient-text">ZAYATHON</span>
        </h1>

        <p className="text-slate-300 text-lg sm:text-xl max-w-2xl leading-relaxed">
          48 hours of intense coding, groundbreaking innovations, and massive prizes. Empowering young developers to shape tomorrow.
        </p>

        {/* Action Buttons using UI Components */}
        <div className="flex flex-wrap items-center justify-center gap-4 mt-4">
          <Button variant="primary" icon={ArrowRight} iconPosition="right">
            Register Now
          </Button>
          <Button variant="secondary" icon={Rocket} iconPosition="left">
            Explore Domains
          </Button>
        </div>

        {/* Feature Cards Showcase */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 w-full max-w-3xl mt-12">
          <GlassCard glowColor="cyan" delay={0.2} className="text-center">
            <div className="text-3xl font-extrabold text-cyan-400 mb-1">$10,000+</div>
            <div className="text-xs uppercase tracking-wider text-slate-400 font-semibold">Prize Pool</div>
          </GlassCard>

          <GlassCard glowColor="purple" delay={0.4} className="text-center">
            <div className="text-3xl font-extrabold text-purple-400 mb-1">48 Hours</div>
            <div className="text-xs uppercase tracking-wider text-slate-400 font-semibold">Non-Stop Hacking</div>
          </GlassCard>

          <GlassCard glowColor="blue" delay={0.6} className="text-center">
            <div className="text-3xl font-extrabold text-blue-400 mb-1">500+</div>
            <div className="text-xs uppercase tracking-wider text-slate-400 font-semibold">Innovators</div>
          </GlassCard>
        </div>
      </motion.div>
    </section>
  );
};

export default Hero;

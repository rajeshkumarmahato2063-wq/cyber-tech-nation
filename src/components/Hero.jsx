import React from 'react';
import { Rocket, ArrowRight, Sparkles, Terminal, Code2, ShieldCheck, Zap } from 'lucide-react';
import { motion } from 'framer-motion';
import Button from './ui/Button';
import GlassCard from './ui/GlassCard';
import Countdown from './Countdown';

/**
 * Hero Section Component for ZAYATHON 2026
 * Features responsive split layout, Countdown timer, and interactive tech graphic showcase.
 */
const Hero = () => {
  return (
    <section id="hero" className="relative min-h-[90vh] flex items-center justify-center px-6 py-12 lg:py-20 overflow-hidden">
      <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center z-10">
        
        {/* Left Column - Headline, Subtitle, Action CTAs & Countdown */}
        <motion.div 
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="lg:col-span-7 flex flex-col items-center lg:items-start text-center lg:text-left space-y-6"
        >
          {/* Badge */}
          <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-bold uppercase tracking-widest shadow-[0_0_20px_rgba(0,229,255,0.25)]">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
            <Sparkles className="w-4 h-4 text-cyan-400" />
            <span>ZAYA CODE HUB PRESENTS</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight section-title leading-[1.1]">
            Build<span className="text-cyan-400">.</span> Innovate<span className="text-purple-400">.</span> <br className="hidden sm:inline" />
            <span className="gradient-text">Win.</span>
          </h1>

          {/* Subtitle */}
          <p className="text-slate-300 text-base sm:text-lg lg:text-xl max-w-2xl leading-relaxed font-normal">
            Join India's premier 48-hour national hackathon. Collaborate with top minds, solve real-world industry challenges, and compete for massive prizes.
          </p>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-2">
            <a href="#register">
              <Button variant="primary" icon={Rocket} iconPosition="right" className="!px-8 !py-4 text-base">
                Register Now
              </Button>
            </a>
            <a href="#about">
              <Button variant="secondary" icon={ArrowRight} iconPosition="right" className="!px-8 !py-4 text-base">
                Learn More
              </Button>
            </a>
          </div>

          {/* Countdown Timer Component */}
          <div className="pt-4 w-full flex flex-col items-center lg:items-start">
            <div className="text-xs uppercase tracking-widest text-slate-400 font-semibold mb-1 flex items-center gap-2">
              <Zap className="w-3.5 h-3.5 text-yellow-400 animate-pulse" />
              <span>Hackathon Begins In</span>
            </div>
            <Countdown targetDate="2026-09-17T09:00:00+05:30" />
          </div>
        </motion.div>

        {/* Right Column - Tech Interactive Graphic Showcase */}
        <motion.div 
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: 'easeOut' }}
          className="lg:col-span-5 relative flex items-center justify-center"
        >
          {/* Outer Ambient Glowing Aura */}
          <div className="absolute w-[350px] h-[350px] sm:w-[450px] sm:h-[450px] bg-gradient-to-tr from-cyan-500/20 via-purple-600/20 to-blue-600/20 rounded-full blur-[90px] animate-pulse-glow pointer-events-none" />

          {/* Main Floating Terminal Glass Card */}
          <div className="relative w-full max-w-md animate-float">
            <GlassCard glowColor="cyan" hoverEffect={true} className="!p-0 overflow-hidden border-cyan-500/30">
              
              {/* Terminal Titlebar */}
              <div className="px-4 py-3 bg-[#050816]/90 border-b border-white/10 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500/80" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                  <div className="w-3 h-3 rounded-full bg-green-500/80" />
                </div>
                <div className="flex items-center gap-1.5 text-xs text-slate-400 font-mono">
                  <Terminal className="w-3.5 h-3.5 text-cyan-400" />
                  <span>ZayathonCore.js</span>
                </div>
                <div className="w-12" />
              </div>

              {/* Code Snippet Display */}
              <div className="p-5 font-mono text-xs sm:text-sm text-slate-300 space-y-2 bg-[#080E1E]/90 leading-relaxed">
                <div>
                  <span className="text-purple-400">const</span> <span className="text-cyan-400">hackathon</span> = {'{'}
                </div>
                <div className="pl-4">
                  <span className="text-slate-400">name:</span> <span className="text-green-400">'ZAYATHON 2026'</span>,
                </div>
                <div className="pl-4">
                  <span className="text-slate-400">status:</span> <span className="text-yellow-400">'REGISTERING_NOW'</span>,
                </div>
                <div className="pl-4">
                  <span className="text-slate-400">prizePool:</span> <span className="text-cyan-400">'₹5,00,000+'</span>,
                </div>
                <div className="pl-4">
                  <span className="text-slate-400">tracks:</span> [<span className="text-purple-300">'AI'</span>, <span className="text-cyan-300">'Web3'</span>, <span className="text-blue-300">'Cloud'</span>],
                </div>
                <div>{'}'};</div>
                <div className="pt-2 text-cyan-400/90 flex items-center gap-2">
                  <Code2 className="w-4 h-4 text-cyan-400 inline animate-bounce" />
                  <span>// Ready to innovate? Press Register!</span>
                </div>
              </div>

              {/* Status bar */}
              <div className="px-4 py-2.5 bg-cyan-950/30 border-t border-cyan-500/20 flex items-center justify-between text-[11px] text-cyan-300">
                <span className="flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  National Level Event
                </span>
                <span className="font-mono text-slate-400">v2026.1.0</span>
              </div>

            </GlassCard>

            {/* Floating Floating Micro Badges */}
            <motion.div 
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute -top-6 -right-6 px-4 py-2 rounded-xl bg-[#0B1120]/90 border border-purple-500/40 backdrop-blur-xl shadow-[0_0_20px_rgba(124,58,237,0.3)] text-xs font-semibold text-purple-300 flex items-center gap-2"
            >
              <span className="w-2 h-2 rounded-full bg-purple-400" />
              AI & Machine Learning
            </motion.div>

            <motion.div 
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
              className="absolute -bottom-6 -left-6 px-4 py-2 rounded-xl bg-[#0B1120]/90 border border-cyan-500/40 backdrop-blur-xl shadow-[0_0_20px_rgba(0,229,255,0.3)] text-xs font-semibold text-cyan-300 flex items-center gap-2"
            >
              <span className="w-2 h-2 rounded-full bg-cyan-400" />
              Web3 & Decentralized
            </motion.div>
          </div>

        </motion.div>

      </div>
    </section>
  );
};

export default Hero;

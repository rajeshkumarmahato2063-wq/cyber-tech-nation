import React from 'react';
import SectionTitle from './ui/SectionTitle';
import GlassCard from './ui/GlassCard';
import { Cpu, Globe, Shield } from 'lucide-react';

/**
 * About Component utilizing Phase 2 Design System
 */
const About = () => {
  return (
    <section className="section-container relative z-10">
      <SectionTitle 
        badge="About The Event"
        title="WHERE IDEAS MEET IMPACT"
        subtitle="ZAYATHON brings together visionary developers, designers, and thinkers to craft cutting-edge technological solutions."
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
        <GlassCard glowColor="cyan" delay={0.1}>
          <div className="p-3 w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 mb-4 flex items-center justify-center">
            <Cpu className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold text-white mb-2">Next-Gen Tech</h3>
          <p className="text-slate-400 text-sm leading-relaxed">
            Build with Web3, Artificial Intelligence, Quantum computing, and Cloud infrastructure.
          </p>
        </GlassCard>

        <GlassCard glowColor="purple" delay={0.2}>
          <div className="p-3 w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400 mb-4 flex items-center justify-center">
            <Globe className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold text-white mb-2">Global Community</h3>
          <p className="text-slate-400 text-sm leading-relaxed">
            Connect with industry mentors, top technology partners, and passionate peers nationwide.
          </p>
        </GlassCard>

        <GlassCard glowColor="blue" delay={0.3}>
          <div className="p-3 w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 mb-4 flex items-center justify-center">
            <Shield className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold text-white mb-2">Fair Evaluation</h3>
          <p className="text-slate-400 text-sm leading-relaxed">
            Transparent judging criteria focusing on technical execution, innovation, and practical utility.
          </p>
        </GlassCard>
      </div>
    </section>
  );
};

export default About;

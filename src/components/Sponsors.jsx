import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Cpu, 
  ShieldCheck, 
  Cloud, 
  Boxes, 
  Code2, 
  Zap, 
  Globe, 
  Terminal, 
  Rocket, 
  Laptop,
  Handshake
} from 'lucide-react';
import SectionTitle from './ui/SectionTitle';
import { sponsorService } from '../services/sponsor';

/**
 * Sponsor Tier Data Configuration
 */
const SPONSOR_TIERS = [
  {
    tier: 'Platinum Sponsors',
    badge: 'Title & Tier 1 Partners',
    badgeColor: 'border-cyan-400/40 text-cyan-300 bg-cyan-500/10',
    gridCols: 'grid-cols-1 sm:grid-cols-3',
    cardPadding: 'p-8',
    sponsors: [
      { id: 'plat-1', name: 'NEXTGEN AI', category: 'Title AI Sponsor', icon: Cpu, accent: 'from-cyan-400 to-blue-600' },
      { id: 'plat-2', name: 'CYBERVANGUARD', category: 'Security Sponsor', icon: ShieldCheck, accent: 'from-blue-500 to-purple-600' },
      { id: 'plat-3', name: 'CLOUDSCALE', category: 'Cloud Infrastructure', icon: Cloud, accent: 'from-purple-400 to-cyan-500' }
    ]
  },
  {
    tier: 'Gold Sponsors',
    badge: 'Tech & Tooling Partners',
    badgeColor: 'border-amber-400/40 text-amber-300 bg-amber-500/10',
    gridCols: 'grid-cols-1 sm:grid-cols-3',
    cardPadding: 'p-6',
    sponsors: [
      { id: 'gold-1', name: 'POLYGONX', category: 'Web3 & Blockchain', icon: Boxes, accent: 'from-purple-400 to-pink-500' },
      { id: 'gold-2', name: 'DEVPULSE', category: 'Developer Tools', icon: Code2, accent: 'from-emerald-400 to-teal-600' },
      { id: 'gold-3', name: 'BYTEFORGE', category: 'AI Compute Platform', icon: Zap, accent: 'from-amber-400 to-yellow-500' }
    ]
  },
  {
    tier: 'Community Partners',
    badge: 'Ecosystem & Hacker Networks',
    badgeColor: 'border-purple-400/40 text-purple-300 bg-purple-500/10',
    gridCols: 'grid-cols-2 sm:grid-cols-4',
    cardPadding: 'p-5',
    sponsors: [
      { id: 'comm-1', name: 'OpenSource India', category: 'Community Network', icon: Globe, accent: 'from-blue-400 to-indigo-500' },
      { id: 'comm-2', name: 'CodeCraft', category: 'Student Guild', icon: Terminal, accent: 'from-cyan-400 to-teal-500' },
      { id: 'comm-3', name: 'HackNation', category: 'Global Hackers', icon: Rocket, accent: 'from-pink-500 to-rose-500' },
      { id: 'comm-4', name: 'GeekForge', category: 'Tech Ecosystem', icon: Laptop, accent: 'from-purple-400 to-cyan-400' }
    ]
  }
];

const Sponsors = () => {
  const [tiers, setTiers] = useState(SPONSOR_TIERS);

  useEffect(() => {
    const fetchSponsors = async () => {
      try {
        const liveSponsors = await sponsorService.getSponsors();
        if (liveSponsors && liveSponsors.length > 0) {
          // Dynamic custom tier mapping if live sponsors are present
          const customTier = {
            tier: 'Featured Sponsors',
            badge: 'Verified Event Sponsors',
            badgeColor: 'border-cyan-400/40 text-cyan-300 bg-cyan-500/10',
            gridCols: 'grid-cols-1 sm:grid-cols-3',
            cardPadding: 'p-6',
            sponsors: liveSponsors.map((s) => ({
              id: s.id,
              name: s.name,
              category: s.tier || 'Sponsor',
              icon: Handshake,
              accent: 'from-cyan-400 to-blue-600',
            })),
          };
          setTiers([customTier, ...SPONSOR_TIERS]);
        }
      } catch (err) {
        console.warn('Using preset sponsor tiers fallback');
      }
    };
    fetchSponsors();
  }, []);
  return (
    <section id="sponsors" className="section-container relative z-10 overflow-hidden">
      {/* Background Ambient Lights */}
      <div className="absolute top-1/3 left-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-600/10 rounded-full blur-[140px] pointer-events-none" />

      {/* Section Header */}
      <SectionTitle 
        badge="Backed by Leaders"
        title="SPONSORS & PARTNERS"
        subtitle="Empowered by industry pioneers, leading tech brands, and vibrant developer communities."
      />

      {/* Sponsor Tiers Showcase */}
      <div className="space-y-12 max-w-5xl mx-auto">
        {tiers.map((tierGroup, tIdx) => (
          <motion.div
            key={tierGroup.tier}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.6, delay: tIdx * 0.15 }}
            className="flex flex-col items-center"
          >
            {/* Tier Header Badge */}
            <div className="flex items-center gap-3 mb-6">
              <span className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider border shadow-[0_0_15px_rgba(0,229,255,0.1)] ${tierGroup.badgeColor}`}>
                {tierGroup.tier}
              </span>
            </div>

            {/* Logo Placeholder Cards Grid */}
            <div className={`grid ${tierGroup.gridCols} gap-6 w-full`}>
              {tierGroup.sponsors.map((sponsor) => {
                const Icon = sponsor.icon;

                return (
                  <div
                    key={sponsor.id}
                    className={`
                      sponsor-card relative rounded-2xl ${tierGroup.cardPadding}
                      bg-[#0B1120]/80 backdrop-blur-xl
                      border border-white/10
                      flex flex-col items-center justify-center text-center
                      cursor-pointer group
                    `}
                  >
                    {/* Glowing Top Glare */}
                    <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-cyan-400/40 to-transparent rounded-t-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                    {/* Logo Icon & Name Container */}
                    <div className="flex items-center justify-center gap-3 mb-2">
                      <div className={`p-2.5 rounded-xl bg-gradient-to-br ${sponsor.accent} text-white shadow-md`}>
                        <Icon className="w-6 h-6" />
                      </div>
                      <span className="text-lg font-black tracking-wider text-white font-mono">
                        {sponsor.name}
                      </span>
                    </div>

                    {/* Sponsor Category Text */}
                    <span className="text-[11px] font-medium text-slate-400 tracking-wide">
                      {sponsor.category}
                    </span>
                  </div>
                );
              })}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Become a Sponsor CTA Banner */}
      <motion.div
        initial={{ opacity: 0, y: 25 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="mt-16 max-w-3xl mx-auto rounded-2xl p-8 bg-gradient-to-r from-cyan-500/10 via-blue-600/10 to-purple-600/10 border border-cyan-500/20 text-center relative overflow-hidden backdrop-blur-xl"
      >
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-left sm:text-left">
          <div className="flex items-center gap-4">
            <div className="p-3.5 rounded-2xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 shrink-0">
              <Handshake className="w-7 h-7" />
            </div>
            <div>
              <h4 className="text-lg font-bold text-white">Interested in Sponsoring ZAYATHON?</h4>
              <p className="text-slate-400 text-xs sm:text-sm">Connect with 500+ top engineering talent and showcase your platform.</p>
            </div>
          </div>
          <a
            href="#contact"
            className="neon-button px-5 py-2.5 rounded-xl text-xs font-bold text-white uppercase tracking-wider shrink-0 transition-transform hover:scale-105"
          >
            Partner With Us
          </a>
        </div>
      </motion.div>
    </section>
  );
};

export default Sponsors;

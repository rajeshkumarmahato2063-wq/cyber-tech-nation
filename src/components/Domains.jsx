import React from 'react';
import { motion } from 'framer-motion';
import {
  Bot,
  Cpu,
  ShieldCheck,
  Activity,
  Coins,
  Building2,
  Sprout,
  Truck,
  Lightbulb,
  ArrowUpRight
} from 'lucide-react';
import SectionTitle from './ui/SectionTitle';

/**
 * Innovation Domains Data
 */
const DOMAINS_DATA = [
  {
    id: 'agentic-ai',
    title: 'Agentic AI',
    description: 'Autonomous AI agents built for adaptive reasoning, multi-step planning, and complex workflow execution.',
    icon: Bot,
    badge: 'AI Frontier',
    glowColor: 'cyan',
    accentBorder: 'group-hover:border-cyan-400/50',
    accentBg: 'group-hover:bg-cyan-500/10',
    accentText: 'text-cyan-400',
    shadowGlow: 'group-hover:shadow-[0_10px_35px_-5px_rgba(0,229,255,0.3)]'
  },
  {
    id: 'robotics-autonomous',
    title: 'Robotics & Autonomous Systems',
    description: 'Next-gen drone navigation, automated robotics, and real-time edge processing for physical systems.',
    icon: Cpu,
    badge: 'Embedded Systems',
    glowColor: 'blue',
    accentBorder: 'group-hover:border-blue-400/50',
    accentBg: 'group-hover:bg-blue-500/10',
    accentText: 'text-blue-400',
    shadowGlow: 'group-hover:shadow-[0_10px_35px_-5px_rgba(37,99,235,0.3)]'
  },
  {
    id: 'cybersecurity',
    title: 'Cybersecurity',
    description: 'Zero-trust architectures, quantum-safe encryption, real-time threat intelligence, and AI defense.',
    icon: ShieldCheck,
    badge: 'Security & Privacy',
    glowColor: 'purple',
    accentBorder: 'group-hover:border-purple-400/50',
    accentBg: 'group-hover:bg-purple-500/10',
    accentText: 'text-purple-400',
    shadowGlow: 'group-hover:shadow-[0_10px_35px_-5px_rgba(124,58,237,0.3)]'
  },
  {
    id: 'healthtech-medai',
    title: 'HealthTech & MedAI',
    description: 'Predictive diagnostic models, wearable telemetry, and smart healthcare accessibility solutions.',
    icon: Activity,
    badge: 'BioTech & Health',
    glowColor: 'cyan',
    accentBorder: 'group-hover:border-cyan-400/50',
    accentBg: 'group-hover:bg-cyan-500/10',
    accentText: 'text-cyan-400',
    shadowGlow: 'group-hover:shadow-[0_10px_35px_-5px_rgba(0,229,255,0.3)]'
  },
  {
    id: 'fintech-blockchain',
    title: 'FinTech & Blockchain',
    description: 'Decentralized finance protocols, smart contract security, cross-border payments, and Web3 identity.',
    icon: Coins,
    badge: 'DeFi & Web3',
    glowColor: 'blue',
    accentBorder: 'group-hover:border-blue-400/50',
    accentBg: 'group-hover:bg-blue-500/10',
    accentText: 'text-blue-400',
    shadowGlow: 'group-hover:shadow-[0_10px_35px_-5px_rgba(37,99,235,0.3)]'
  },
  {
    id: 'smart-cities-iot',
    title: 'Smart Cities & IoT',
    description: 'Connected urban infrastructure, intelligent grid management, and low-latency telemetry networks.',
    icon: Building2,
    badge: 'IoT & Smart Grid',
    glowColor: 'purple',
    accentBorder: 'group-hover:border-purple-400/50',
    accentBg: 'group-hover:bg-purple-500/10',
    accentText: 'text-purple-400',
    shadowGlow: 'group-hover:shadow-[0_10px_35px_-5px_rgba(124,58,237,0.3)]'
  },
  {
    id: 'agritech',
    title: 'Agritech',
    description: 'Precision farming systems, AI crop yield predictions, autonomous irrigation, and sustainable food tech.',
    icon: Sprout,
    badge: 'Sustainability',
    glowColor: 'cyan',
    accentBorder: 'group-hover:border-cyan-400/50',
    accentBg: 'group-hover:bg-cyan-500/10',
    accentText: 'text-cyan-400',
    shadowGlow: 'group-hover:shadow-[0_10px_35px_-5px_rgba(0,229,255,0.3)]'
  },
  {
    id: 'transportation-logistics',
    title: 'Transportation & Logistics',
    description: 'AI fleet optimization, supply chain transparency, dynamic routing, and green mobility solutions.',
    icon: Truck,
    badge: 'Smart Mobility',
    glowColor: 'blue',
    accentBorder: 'group-hover:border-blue-400/50',
    accentBg: 'group-hover:bg-blue-500/10',
    accentText: 'text-blue-400',
    shadowGlow: 'group-hover:shadow-[0_10px_35px_-5px_rgba(37,99,235,0.3)]'
  },
  {
    id: 'open-innovation',
    title: 'Open Innovation',
    description: 'Unrestricted wildcard track for moonshot ideas, novel hardware hacks, and cross-domain breakthroughs.',
    icon: Lightbulb,
    badge: 'Wildcard Track',
    glowColor: 'purple',
    accentBorder: 'group-hover:border-purple-400/50',
    accentBg: 'group-hover:bg-purple-500/10',
    accentText: 'text-purple-400',
    shadowGlow: 'group-hover:shadow-[0_10px_35px_-5px_rgba(124,58,237,0.3)]'
  }
];

/**
 * Container Animation Variants
 */
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
};

/**
 * Card Item Animation Variants
 */
const cardVariants = {
  hidden: { opacity: 0, y: 35 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.25, 0.1, 0.25, 1.0]
    }
  }
};

const Domains = () => {
  return (
    <section id="domains" className="section-container relative z-10 overflow-hidden">
      {/* Background Cyber Glow Orbs */}
      <div className="absolute top-1/2 left-0 -translate-y-1/2 w-96 h-96 bg-cyan-500/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-600/10 rounded-full blur-[140px] pointer-events-none" />

      {/* Section Header */}
      <SectionTitle 
        badge="Innovation Frontiers"
        title="INNOVATION DOMAINS"
        subtitle="Explore our 9 high-impact technology tracks designed to empower hackers to solve real-world challenges."
      />

      {/* Domains Responsive Grid */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-50px' }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8"
      >
        {DOMAINS_DATA.map((domain, index) => {
          const Icon = domain.icon;

          return (
            <motion.div
              key={domain.id}
              variants={cardVariants}
              whileHover={{ y: -8, scale: 1.02 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
              className={`
                group relative rounded-2xl p-7
                bg-[#0B1120]/75 backdrop-blur-xl
                border border-white/10
                shadow-[0_8px_32px_0_rgba(0,0,0,0.4)]
                transition-all duration-300 ease-out
                flex flex-col justify-between cursor-pointer
                ${domain.accentBorder}
                ${domain.shadowGlow}
              `}
            >
              {/* Subtle top border neon glare */}
              <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-cyan-400/40 to-transparent rounded-t-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              
              {/* Radial Hover Spotlight inside card */}
              <div className="absolute inset-0 rounded-2xl bg-radial from-cyan-500/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

              <div>
                {/* Top Badge & Icon Header */}
                <div className="flex items-center justify-between mb-6">
                  {/* Rotating Neon Glow Icon Container */}
                  <div className={`
                    relative p-3.5 rounded-xl
                    bg-white/5 border border-white/10
                    shadow-[0_0_15px_rgba(0,0,0,0.3)]
                    transition-all duration-300
                    ${domain.accentBg} ${domain.accentText}
                  `}>
                    <Icon className="w-7 h-7 transition-transform duration-300 ease-out group-hover:rotate-12 group-hover:scale-110" />
                  </div>

                  {/* Domain Category Badge */}
                  <span className="text-[11px] font-semibold tracking-wider uppercase px-3 py-1 rounded-full bg-white/5 text-slate-300 border border-white/10 group-hover:border-cyan-500/30 group-hover:text-cyan-300 transition-colors duration-300">
                    {domain.badge}
                  </span>
                </div>

                {/* Domain Title */}
                <h3 className="text-xl font-bold text-white mb-3 tracking-tight group-hover:text-cyan-300 transition-colors duration-300 flex items-center gap-1.5">
                  {domain.title}
                </h3>

                {/* Domain One-Line Description */}
                <p className="text-slate-400 text-sm leading-relaxed font-normal mb-6">
                  {domain.description}
                </p>
              </div>

              {/* Bottom Card Action Link */}
              <div className="pt-4 border-t border-white/5 flex items-center justify-between text-xs font-semibold text-slate-400 group-hover:text-cyan-400 transition-colors duration-300">
                <span className="tracking-wide">Explore Track Details</span>
                <ArrowUpRight className="w-4 h-4 transform group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-300" />
              </div>
            </motion.div>
          );
        })}
      </motion.div>
    </section>
  );
};

export default Domains;

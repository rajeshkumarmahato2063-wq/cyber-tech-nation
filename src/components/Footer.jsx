import React from 'react';
import { motion } from 'framer-motion';
import { 
  Terminal, 
  Heart, 
  Mail, 
  Phone, 
  MapPin, 
  Twitter, 
  Linkedin, 
  Github, 
  Disc as Discord, 
  Instagram,
  ArrowUp
} from 'lucide-react';

/**
 * Quick Links Navigation Items
 */
const QUICK_LINKS = [
  { name: 'Home', href: '#hero' },
  { name: 'About', href: '#about' },
  { name: 'Domains', href: '#domains' },
  { name: 'Timeline', href: '#timeline' },
  { name: 'Prizes', href: '#prizes' },
  { name: 'Sponsors', href: '#sponsors' },
  { name: 'Organizing Team', href: '#team' },
  { name: 'Registration', href: '#register' },
  { name: 'FAQ', href: '#faq' },
  { name: 'Contact', href: '#contact' }
];

/**
 * Social Network Links
 */
const SOCIAL_LINKS = [
  { name: 'Twitter', icon: Twitter, href: 'https://twitter.com' },
  { name: 'LinkedIn', icon: Linkedin, href: 'https://linkedin.com' },
  { name: 'GitHub', icon: Github, href: 'https://github.com' },
  { name: 'Discord', icon: Discord, href: 'https://discord.com' },
  { name: 'Instagram', icon: Instagram, href: 'https://instagram.com' }
];

const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="relative bg-[#030612] text-slate-400 border-t border-white/10 overflow-hidden pt-16 pb-8 z-10">
      {/* Background Top Cyan Glow Accent */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[1px] bg-gradient-to-r from-transparent via-cyan-400/50 to-transparent" />
      <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[600px] h-[200px] bg-cyan-500/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-white/10">
          
          {/* Col 1 & 2: Brand Logo & Description */}
          <div className="lg:col-span-2 space-y-4">
            <a href="#hero" className="inline-flex items-center gap-2.5">
              <div className="p-2.5 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 shadow-[0_0_20px_rgba(0,229,255,0.3)]">
                <Terminal className="w-6 h-6" />
              </div>
              <span className="text-2xl font-black tracking-wider text-white font-mono">
                ZAYA<span className="text-cyan-400">THON</span>
              </span>
            </a>

            <p className="text-slate-400 text-sm leading-relaxed max-w-sm font-normal">
              Empowering global developers, visionaries, and AI researchers to build moonshot projects across 9 innovation tracks.
            </p>

            {/* Social Icons Bar */}
            <div className="pt-2 flex items-center gap-3">
              {SOCIAL_LINKS.map((social) => {
                const Icon = social.icon;
                return (
                  <a
                    key={social.name}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.name}
                    className="p-2.5 rounded-xl bg-white/5 hover:bg-cyan-500/20 text-slate-400 hover:text-cyan-300 border border-white/10 hover:border-cyan-500/30 transition-all duration-300 hover:scale-110"
                  >
                    <Icon className="w-4 h-4" />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Col 3: Quick Navigation Links */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4 border-l-2 border-cyan-400 pl-3">
              Quick Links
            </h4>
            <ul className="space-y-2.5 text-xs font-medium">
              {QUICK_LINKS.slice(0, 5).map((link) => (
                <li key={link.name}>
                  <a href={link.href} className="hover:text-cyan-300 transition-colors flex items-center gap-1.5">
                    <span className="w-1 h-1 rounded-full bg-cyan-400 opacity-60" />
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 4: Additional Navigation */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4 border-l-2 border-blue-500 pl-3">
              Event Info
            </h4>
            <ul className="space-y-2.5 text-xs font-medium">
              {QUICK_LINKS.slice(5).map((link) => (
                <li key={link.name}>
                  <a href={link.href} className="hover:text-cyan-300 transition-colors flex items-center gap-1.5">
                    <span className="w-1 h-1 rounded-full bg-blue-400 opacity-60" />
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 5: Contact Info */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4 border-l-2 border-purple-500 pl-3">
              Get in Touch
            </h4>
            <div className="space-y-3 text-xs">
              <div className="flex items-start gap-2.5">
                <Mail className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                <span className="text-slate-300 font-mono">support@zayathon.tech</span>
              </div>
              <div className="flex items-start gap-2.5">
                <Phone className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                <span className="text-slate-300 font-mono">+91 98765 43210</span>
              </div>
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                <span className="text-slate-300">ZAYATHON Tech Arena, Delhi NCR</span>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Bar: Copyright & Scroll to Top */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-medium text-slate-500">
          <div>
            © 2026 ZAYATHON. All rights reserved.
          </div>

          <div className="flex items-center gap-1.5 text-slate-400">
            <span>Made with</span>
            <Heart className="w-4 h-4 text-rose-500 fill-rose-500 inline animate-pulse" />
            <span>for Global Innovators & Hackers</span>
          </div>

          <button
            onClick={scrollToTop}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-cyan-500/20 text-slate-300 hover:text-cyan-300 border border-white/10 hover:border-cyan-500/30 transition-all duration-300 hover:scale-105"
          >
            <span>Back to Top</span>
            <ArrowUp className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

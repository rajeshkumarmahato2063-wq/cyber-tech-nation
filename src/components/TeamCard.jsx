import React from 'react';
import { motion } from 'framer-motion';
import { Linkedin, Github, User } from 'lucide-react';

/**
 * Reusable TeamCard Component
 */
const TeamCard = ({ member, index }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 35 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.5, delay: index * 0.12 }}
      whileHover={{ y: -8, scale: 1.02 }}
      className={`
        group relative rounded-2xl p-6
        bg-[#0B1120]/80 backdrop-blur-xl
        border border-white/10
        shadow-[0_8px_32px_0_rgba(0,0,0,0.37)]
        hover:border-cyan-400/50 hover:shadow-[0_12px_35px_-5px_rgba(0,229,255,0.25)]
        transition-all duration-300
        flex flex-col items-center text-center
      `}
    >
      {/* Top Border Glow Glare */}
      <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-cyan-400/40 to-transparent rounded-t-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      {/* Circular Avatar Placeholder */}
      <div className="relative mb-5">
        {/* Pulsing Avatar Outer Ring */}
        <div className="absolute -inset-1.5 rounded-full bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 opacity-0 group-hover:opacity-100 blur-sm transition-opacity duration-500 pointer-events-none" />

        <div className={`
          relative w-24 h-24 rounded-full
          bg-gradient-to-tr ${member.avatarGradient || 'from-cyan-600/30 via-blue-600/20 to-purple-600/30'}
          border-2 border-white/20 group-hover:border-cyan-400
          flex items-center justify-center
          shadow-lg overflow-hidden transition-all duration-300
        `}>
          {member.avatarUrl ? (
            <img src={member.avatarUrl} alt={member.name} className="w-full h-full object-cover" />
          ) : (
            <span className="text-2xl font-black tracking-widest text-cyan-300 font-mono">
              {member.initials}
            </span>
          )}
        </div>
      </div>

      {/* Member Name */}
      <h3 className="text-xl font-bold text-white tracking-tight mb-1 group-hover:text-cyan-300 transition-colors duration-300">
        {member.name}
      </h3>

      {/* Member Role Badge */}
      <span className="px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 mb-3 shadow-[0_0_12px_rgba(0,229,255,0.1)]">
        {member.role}
      </span>

      {/* Bio / Description */}
      {member.bio && (
        <p className="text-slate-400 text-xs leading-relaxed font-normal mb-5 max-w-xs">
          {member.bio}
        </p>
      )}

      {/* Social Links Header (LinkedIn) */}
      <div className="pt-4 border-t border-white/10 w-full flex items-center justify-center gap-3">
        <a
          href={member.linkedin || 'https://linkedin.com'}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`${member.name} LinkedIn Profile`}
          className="p-2.5 rounded-xl bg-white/5 hover:bg-cyan-500/20 text-slate-300 hover:text-cyan-400 border border-white/10 hover:border-cyan-500/40 transition-all duration-300 hover:scale-110"
        >
          <Linkedin className="w-4 h-4" />
        </a>
        
        {member.github && (
          <a
            href={member.github}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`${member.name} GitHub Profile`}
            className="p-2.5 rounded-xl bg-white/5 hover:bg-purple-500/20 text-slate-300 hover:text-purple-400 border border-white/10 hover:border-purple-500/40 transition-all duration-300 hover:scale-110"
          >
            <Github className="w-4 h-4" />
          </a>
        )}
      </div>
    </motion.div>
  );
};

export default TeamCard;

import React from 'react';
import { Star, Linkedin, Video, Calendar, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';

/**
 * Premium Cyber-Themed Mentor Card Component
 */
const MentorCard = ({ mentor, onBookSession, onViewDetails }) => {
  const {
    id,
    name,
    photo,
    company,
    role_title,
    expertise = [],
    experience,
    linkedin,
    availability = 'Available Today',
    rating = 4.9,
    reviews_count = 12,
    bio
  } = mentor;

  return (
    <motion.div
      whileHover={{ y: -6, transition: { duration: 0.2 } }}
      className="relative group bg-[#0B1120]/80 backdrop-blur-xl border border-white/10 hover:border-cyan-500/40 rounded-2xl p-6 flex flex-col justify-between shadow-[0_4px_25px_rgba(0,0,0,0.4)] hover:shadow-[0_0_30px_rgba(0,229,255,0.15)] transition-all duration-300"
    >
      {/* Status Glow Pill */}
      <div className="absolute top-4 right-4 flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-mono">
        <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
        <span>{availability}</span>
      </div>

      <div>
        {/* Mentor Profile Header */}
        <div className="flex items-center gap-4 mb-4">
          <div className="relative">
            <img
              src={photo || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400'}
              alt={name}
              className="w-16 h-16 rounded-2xl object-cover border-2 border-cyan-500/30 group-hover:border-cyan-400 transition-colors shadow-lg"
            />
            <div className="absolute -bottom-1 -right-1 bg-[#050816] p-1 rounded-full text-cyan-400">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>

          <div>
            <h3 className="text-lg font-bold text-white group-hover:text-cyan-300 transition-colors flex items-center gap-2">
              {name}
            </h3>
            <p className="text-xs font-mono text-cyan-400 font-medium">
              {role_title} <span className="text-slate-500">@</span> <span className="text-slate-200">{company}</span>
            </p>
            <div className="flex items-center gap-3 mt-1 text-xs text-slate-400 font-mono">
              <span className="flex items-center gap-1 text-amber-400 font-bold">
                <Star className="w-3.5 h-3.5 fill-amber-400" />
                {rating} ({reviews_count})
              </span>
              <span>•</span>
              <span>{experience} exp</span>
            </div>
          </div>
        </div>

        {/* Bio */}
        <p className="text-xs text-slate-300 line-clamp-2 mb-4 leading-relaxed">
          {bio}
        </p>

        {/* Expertise Tags */}
        <div className="flex flex-wrap gap-1.5 mb-6">
          {expertise.map((item, idx) => (
            <span
              key={idx}
              className="px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-[11px] font-mono text-slate-300 group-hover:border-cyan-500/20 group-hover:text-cyan-200 transition-colors"
            >
              {item}
            </span>
          ))}
        </div>
      </div>

      {/* Action Footer */}
      <div className="pt-4 border-t border-white/10 flex items-center justify-between gap-3">
        {linkedin && (
          <a
            href={linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2.5 rounded-xl bg-white/5 hover:bg-cyan-500/10 border border-white/10 hover:border-cyan-500/30 text-slate-400 hover:text-cyan-400 transition-all"
            title="LinkedIn Profile"
          >
            <Linkedin className="w-4 h-4" />
          </a>
        )}

        <div className="flex items-center gap-2 flex-1">
          {onViewDetails && (
            <button
              onClick={() => onViewDetails(id)}
              className="px-3 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-mono text-slate-300 font-semibold transition-all flex-1 text-center"
            >
              Profile
            </button>
          )}

          <button
            onClick={() => onBookSession ? onBookSession(mentor) : null}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-mono text-xs font-semibold shadow-[0_0_15px_rgba(0,229,255,0.3)] hover:shadow-[0_0_25px_rgba(0,229,255,0.5)] transition-all flex items-center justify-center gap-1.5 flex-1"
          >
            <Calendar className="w-3.5 h-3.5" />
            Book Session
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default MentorCard;

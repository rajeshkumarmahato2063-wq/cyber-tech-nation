import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, GraduationCap, Send, CheckCircle2 } from 'lucide-react';
import SkillBadge from './SkillBadge';

const AIRecommendationCard = ({ recommendation, onConnect }) => {
  const { profile, score, matchReasons } = recommendation;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ y: -4 }}
      className="glass-card rounded-2xl p-5 border border-cyan-500/30 flex flex-col justify-between relative overflow-hidden group hover:shadow-[0_0_30px_rgba(0,229,255,0.2)]"
    >
      {/* Glow highlight */}
      <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-cyan-500/20 to-purple-500/20 rounded-bl-full pointer-events-none" />

      <div>
        {/* Header with Match % Badge */}
        <div className="flex items-start justify-between gap-2 mb-3">
          <div className="flex items-center gap-3">
            <img
              src={profile.photo_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'}
              alt={profile.full_name}
              className="w-12 h-12 rounded-xl object-cover border border-cyan-500/40"
            />
            <div>
              <h4 className="font-title font-bold text-base text-white group-hover:text-cyan-300 transition-colors">
                {profile.full_name}
              </h4>
              <p className="text-xs text-slate-400 font-mono flex items-center gap-1">
                <GraduationCap className="w-3 h-3 text-cyan-400" />
                <span>{profile.college}</span>
              </p>
            </div>
          </div>

          <div className="px-3 py-1 rounded-xl bg-gradient-to-r from-cyan-500/20 to-purple-500/20 border border-cyan-500/40 text-cyan-300 font-mono text-xs font-bold flex items-center gap-1 shadow-inner">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-spin" />
            <span>{score}% Match</span>
          </div>
        </div>

        {/* AI Rationale List */}
        <div className="mb-4 bg-white/5 p-2.5 rounded-xl border border-white/5 space-y-1 text-[11px] font-mono">
          <div className="text-[10px] text-slate-400 uppercase tracking-wider mb-1 flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-purple-400" /> Why Recommended
          </div>
          {matchReasons && matchReasons.map((reason, idx) => (
            <div key={idx} className="flex items-center gap-1.5 text-slate-300">
              <CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0" />
              <span>{reason}</span>
            </div>
          ))}
        </div>

        {/* Skills */}
        <div className="mb-4">
          <div className="flex flex-wrap gap-1.5">
            {profile.skills && profile.skills.map((sk, idx) => (
              <SkillBadge key={idx} skill={sk} size="xs" variant="purple" />
            ))}
          </div>
        </div>
      </div>

      {/* Action Footer */}
      <div className="pt-3 border-t border-white/10 flex items-center justify-between mt-auto">
        <span className="text-[11px] font-mono text-purple-300">
          Domain: {profile.preferred_domain || 'AI'}
        </span>

        <button
          onClick={() => onConnect && onConnect(profile)}
          className="neon-button px-4 py-1.5 rounded-xl text-xs font-mono font-bold text-white flex items-center gap-1.5 cursor-pointer"
        >
          <Send className="w-3 h-3" />
          <span>Quick Connect</span>
        </button>
      </div>
    </motion.div>
  );
};

export default AIRecommendationCard;

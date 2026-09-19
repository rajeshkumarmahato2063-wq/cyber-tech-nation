import React from 'react';
import { motion } from 'framer-motion';
import { User, GraduationCap, Briefcase, Globe, Github, Linkedin, Send, Flag, Sparkles } from 'lucide-react';
import SkillBadge from './SkillBadge';

const ProfileCard = ({ profile, onSendRequest, onReport, currentUser }) => {
  const isSelf = currentUser && (currentUser.id === profile.user_id || currentUser.user_id === profile.user_id);

  const getExperienceColor = (exp) => {
    switch (exp) {
      case 'Lead': return 'purple';
      case 'Advanced': return 'cyan';
      case 'Intermediate': return 'emerald';
      case 'Beginner': return 'amber';
      default: return 'cyan';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.3 }}
      className="glass-card rounded-2xl p-5 border border-white/10 flex flex-col justify-between relative overflow-hidden group hover:border-cyan-500/40"
    >
      {/* Top Ambient Glow */}
      <div className="absolute -top-16 -right-16 w-32 h-32 bg-cyan-500/10 rounded-full blur-2xl group-hover:bg-cyan-500/20 transition-all pointer-events-none" />

      <div>
        {/* Profile Header */}
        <div className="flex items-start gap-4 mb-4">
          <div className="relative shrink-0">
            {profile.photo_url ? (
              <img
                src={profile.photo_url}
                alt={profile.full_name}
                className="w-14 h-14 rounded-2xl object-cover border border-cyan-500/30 p-0.5 shadow-lg"
              />
            ) : (
              <div className="w-14 h-14 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 font-bold text-xl">
                {profile.full_name?.charAt(0) || 'U'}
              </div>
            )}
            <span
              className={`absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full border-2 border-[#0B1120] ${
                profile.status === 'matched' ? 'bg-amber-400' : 'bg-emerald-400 animate-pulse'
              }`}
              title={`Status: ${profile.status || 'Active'}`}
            />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-1">
              <h3 className="font-title font-bold text-base lg:text-lg text-white truncate group-hover:text-cyan-300 transition-colors">
                {profile.full_name}
              </h3>
              <SkillBadge
                skill={profile.experience || 'Intermediate'}
                variant={getExperienceColor(profile.experience)}
                size="xs"
              />
            </div>

            <p className="text-xs text-slate-400 flex items-center gap-1 mt-0.5 truncate font-mono">
              <GraduationCap className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
              <span className="truncate">{profile.college || 'Engineering College'}</span>
            </p>

            <p className="text-[11px] text-slate-400 font-mono mt-0.5 truncate">
              {profile.department ? `${profile.department} • ` : ''}{profile.year || '3rd Year'}
            </p>
          </div>
        </div>

        {/* Bio */}
        {profile.short_bio && (
          <p className="text-xs text-slate-300 line-clamp-2 mb-3 leading-relaxed">
            {profile.short_bio}
          </p>
        )}

        {/* Domain & Availability Meta */}
        <div className="grid grid-cols-2 gap-2 mb-3 bg-white/5 p-2 rounded-xl border border-white/5 text-[11px] font-mono">
          <div>
            <span className="text-slate-400 block text-[10px]">Domain:</span>
            <span className="text-cyan-300 font-medium truncate block">
              {profile.preferred_domain || 'Open Domain'}
            </span>
          </div>
          <div>
            <span className="text-slate-400 block text-[10px]">Looking For:</span>
            <span className="text-purple-300 font-medium truncate block">
              {profile.looking_for || 'Either'}
            </span>
          </div>
        </div>

        {/* Skills Tag List */}
        <div className="mb-4">
          <div className="text-[10px] text-slate-400 uppercase tracking-wider font-mono mb-1.5 flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-cyan-400" /> Core Skills
          </div>
          <div className="flex flex-wrap gap-1.5">
            {profile.skills && profile.skills.length > 0 ? (
              profile.skills.slice(0, 5).map((sk, idx) => (
                <SkillBadge key={idx} skill={sk} size="xs" variant={idx % 2 === 0 ? 'cyan' : 'purple'} />
              ))
            ) : (
              <span className="text-xs text-slate-400 italic">No skills listed</span>
            )}
            {profile.skills && profile.skills.length > 5 && (
              <span className="text-[10px] text-slate-400 font-mono self-center">
                +{profile.skills.length - 5} more
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Footer Actions & Links */}
      <div className="pt-3 border-t border-white/10 flex items-center justify-between gap-2 mt-auto">
        <div className="flex items-center gap-2">
          {profile.github_url && (
            <a
              href={profile.github_url}
              target="_blank"
              rel="noreferrer"
              className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 hover:text-cyan-400 transition-colors"
              title="GitHub Profile"
            >
              <Github className="w-3.5 h-3.5" />
            </a>
          )}
          {profile.linkedin_url && (
            <a
              href={profile.linkedin_url}
              target="_blank"
              rel="noreferrer"
              className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 hover:text-cyan-400 transition-colors"
              title="LinkedIn Profile"
            >
              <Linkedin className="w-3.5 h-3.5" />
            </a>
          )}
          {profile.portfolio_url && (
            <a
              href={profile.portfolio_url}
              target="_blank"
              rel="noreferrer"
              className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 hover:text-cyan-400 transition-colors"
              title="Portfolio Website"
            >
              <Globe className="w-3.5 h-3.5" />
            </a>
          )}

          {/* Report Icon */}
          <button
            onClick={() => onReport && onReport(profile)}
            className="p-1.5 rounded-lg bg-white/5 hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 transition-colors"
            title="Report Profile"
          >
            <Flag className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Action Button */}
        {!isSelf ? (
          <button
            onClick={() => onSendRequest && onSendRequest(profile)}
            className="px-3.5 py-1.5 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 text-cyan-300 hover:text-cyan-200 text-xs font-mono font-semibold flex items-center gap-1.5 transition-all cursor-pointer shadow-[0_0_15px_rgba(0,229,255,0.1)] hover:shadow-[0_0_20px_rgba(0,229,255,0.3)]"
          >
            <Send className="w-3 h-3" />
            <span>Join Request</span>
          </button>
        ) : (
          <span className="text-[11px] font-mono text-cyan-400 bg-cyan-500/10 px-2 py-1 rounded-lg border border-cyan-500/20">
            Your Profile
          </span>
        )}
      </div>
    </motion.div>
  );
};

export default ProfileCard;

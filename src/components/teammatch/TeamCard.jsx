import React from 'react';
import { motion } from 'framer-motion';
import { Users, Shield, ArrowRight, MessageSquare, Sparkles } from 'lucide-react';
import SkillBadge from './SkillBadge';

const TeamCard = ({ team, onJoinTeam, onOpenChat, currentUser }) => {
  const isLeader = currentUser && (currentUser.id === team.leader_id || currentUser.user_id === team.leader_id);
  const slotsLeft = team.max_members - (team.current_members_count || 1);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.3 }}
      className="glass-card rounded-2xl p-5 border border-white/10 flex flex-col justify-between relative overflow-hidden group hover:border-purple-500/40"
    >
      <div className="absolute -top-16 -right-16 w-32 h-32 bg-purple-500/10 rounded-full blur-2xl group-hover:bg-purple-500/20 transition-all pointer-events-none" />

      <div>
        {/* Team Header */}
        <div className="flex items-start justify-between gap-2 mb-3">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="p-1.5 rounded-lg bg-purple-500/10 border border-purple-500/30 text-purple-400">
                <Shield className="w-4 h-4" />
              </span>
              <h3 className="font-title font-bold text-base lg:text-lg text-white group-hover:text-purple-300 transition-colors truncate">
                {team.team_name}
              </h3>
            </div>
            <p className="text-xs font-mono text-cyan-300 flex items-center gap-1">
              <span>Domain: {team.domain}</span>
            </p>
          </div>

          <span
            className={`px-2.5 py-1 rounded-full text-[10px] font-mono font-semibold uppercase tracking-wider shrink-0 ${
              slotsLeft > 0
                ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-400'
                : 'bg-rose-500/10 border border-rose-500/30 text-rose-400'
            }`}
          >
            {slotsLeft > 0 ? `${slotsLeft} Slots Left` : 'Team Full'}
          </span>
        </div>

        {/* Leader Info */}
        <div className="flex items-center gap-2 mb-3 bg-white/5 p-2 rounded-xl border border-white/5 text-xs">
          <img
            src={team.leader_photo || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100'}
            alt={team.leader_name}
            className="w-6 h-6 rounded-full object-cover border border-purple-500/30"
          />
          <span className="text-slate-300 font-mono text-[11px]">
            Leader: <strong className="text-white">{team.leader_name || 'Hackathon Host'}</strong>
          </span>
        </div>

        {/* Team Description */}
        <p className="text-xs text-slate-300 line-clamp-2 mb-3 leading-relaxed">
          {team.description || 'Working on innovative cyber solutions for ZayaThon.'}
        </p>

        {/* Required Skills */}
        <div className="mb-4">
          <div className="text-[10px] text-slate-400 uppercase tracking-wider font-mono mb-1.5 flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-purple-400" /> Looking For Skills
          </div>
          <div className="flex flex-wrap gap-1.5">
            {team.required_skills && team.required_skills.length > 0 ? (
              team.required_skills.map((sk, idx) => (
                <SkillBadge key={idx} skill={sk} size="xs" variant="purple" />
              ))
            ) : (
              <span className="text-xs text-slate-400 italic">Open to all skills</span>
            )}
          </div>
        </div>
      </div>

      {/* Footer Stats & Actions */}
      <div className="pt-3 border-t border-white/10 flex items-center justify-between gap-2 mt-auto">
        <div className="flex items-center gap-1.5 text-xs text-slate-400 font-mono">
          <Users className="w-4 h-4 text-cyan-400" />
          <span>{team.current_members_count || 1} / {team.max_members || 4} Members</span>
        </div>

        <div className="flex items-center gap-2">
          {onOpenChat && (
            <button
              onClick={() => onOpenChat(team)}
              className="p-2 rounded-xl bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/30 text-purple-300 transition-colors cursor-pointer"
              title="Open Private Team Chat"
            >
              <MessageSquare className="w-3.5 h-3.5" />
            </button>
          )}

          {!isLeader ? (
            <button
              onClick={() => onJoinTeam && onJoinTeam(team)}
              disabled={slotsLeft <= 0}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-mono font-semibold flex items-center gap-1 transition-all cursor-pointer ${
                slotsLeft > 0
                  ? 'bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/30 text-purple-300 hover:text-purple-200 shadow-[0_0_15px_rgba(124,58,237,0.1)]'
                  : 'bg-white/5 border border-white/10 text-slate-500 cursor-not-allowed'
              }`}
            >
              <span>Join Team</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          ) : (
            <span className="text-[11px] font-mono text-purple-400 bg-purple-500/10 px-2 py-1 rounded-lg border border-purple-500/20">
              Your Team
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default TeamCard;

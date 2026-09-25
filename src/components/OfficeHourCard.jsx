import React from 'react';
import { Users, Clock, Video, Radio, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

/**
 * Live Office Hour Room Card Component
 */
const OfficeHourCard = ({ session, onJoinSession }) => {
  const {
    id,
    mentor_name = 'Dr. Alex Mercer',
    mentor_company = 'OpenAI',
    mentor_photo,
    topic = 'Scaling Agentic AI Workflows in Production',
    participant_count = 18,
    max_participants = 50,
    status = 'live',
    meeting_link = 'https://meet.google.com/zaya-ai-room'
  } = session;

  const isLive = status === 'live';

  return (
    <motion.div
      whileHover={{ y: -4 }}
      className={`relative p-6 rounded-3xl backdrop-blur-2xl border transition-all duration-300 shadow-xl ${
        isLive
          ? 'bg-gradient-to-br from-[#0B1120] via-[#050816] to-[#0A1733] border-emerald-500/40 shadow-[0_0_30px_rgba(16,185,129,0.15)]'
          : 'bg-[#0B1120]/80 border-white/10'
      }`}
    >
      {/* Live Badge Header */}
      <div className="flex items-center justify-between gap-2 mb-4">
        {isLive ? (
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono font-bold">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <Radio className="w-3.5 h-3.5" />
            <span>LIVE NOW</span>
          </div>
        ) : (
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-300 text-xs font-mono">
            <Clock className="w-3.5 h-3.5" />
            <span>UPCOMING ROOM</span>
          </div>
        )}

        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-slate-300 text-xs font-mono">
          <Users className="w-3.5 h-3.5 text-cyan-400" />
          <span>{participant_count} / {max_participants} Attending</span>
        </div>
      </div>

      {/* Mentor Info */}
      <div className="flex items-center gap-3 mb-3">
        <img
          src={mentor_photo || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400'}
          alt={mentor_name}
          className="w-12 h-12 rounded-2xl object-cover border border-cyan-500/30"
        />
        <div>
          <h4 className="text-sm font-bold text-white">{mentor_name}</h4>
          <p className="text-xs font-mono text-cyan-400">{mentor_company}</p>
        </div>
      </div>

      {/* Topic Title */}
      <h3 className="text-base font-bold text-slate-100 group-hover:text-cyan-300 transition-colors mb-4 line-clamp-2">
        {topic}
      </h3>

      {/* Action Footer */}
      <div className="pt-4 border-t border-white/10 flex items-center justify-between gap-3">
        <div className="text-xs font-mono text-slate-400 flex items-center gap-1">
          <Clock className="w-3.5 h-3.5 text-slate-500" />
          <span>{isLive ? '45 mins remaining' : 'Starts in 2 hours'}</span>
        </div>

        <a
          href={meeting_link}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => onJoinSession ? onJoinSession(id) : null}
          className={`px-5 py-2.5 rounded-2xl text-xs font-mono font-bold flex items-center gap-2 transition-all cursor-pointer ${
            isLive
              ? 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-[0_0_20px_rgba(16,185,129,0.4)]'
              : 'bg-white/10 hover:bg-white/20 text-white border border-white/10'
          }`}
        >
          <Video className="w-4 h-4" />
          {isLive ? 'Join Live Room' : 'Set Reminder'}
        </a>
      </div>
    </motion.div>
  );
};

export default OfficeHourCard;

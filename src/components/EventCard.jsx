import React from 'react';
import { Calendar, MapPin, Trophy, Users, ArrowRight, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

const EventCard = ({ event, onViewDetails, onRegister, layout = 'grid' }) => {
  const isLive = event.status === 'live';
  const isCompleted = event.status === 'completed' || event.status === 'archived';
  const isDraft = event.status === 'draft';

  const getStatusBadge = () => {
    if (isLive) {
      return (
        <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 text-xs font-mono font-bold flex items-center gap-1.5 shadow-[0_0_15px_rgba(16,185,129,0.3)]">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" /> LIVE NOW
        </span>
      );
    }
    if (isCompleted) {
      return (
        <span className="px-3 py-1 rounded-full bg-slate-500/20 text-slate-300 border border-slate-500/40 text-xs font-mono font-bold">
          COMPLETED
        </span>
      );
    }
    if (isDraft) {
      return (
        <span className="px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 text-xs font-mono font-bold">
          DRAFT
        </span>
      );
    }
    return (
      <span className="px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 text-xs font-mono font-bold">
        UPCOMING
      </span>
    );
  };

  const formattedStartDate = event.start_date
    ? new Date(event.start_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    : 'TBA';

  if (layout === 'list') {
    return (
      <motion.div
        whileHover={{ y: -3, scale: 1.005 }}
        className="group relative p-5 rounded-2xl bg-[#0B1120]/90 border border-white/10 hover:border-cyan-500/50 shadow-xl transition-all duration-300 flex flex-col sm:flex-row items-center gap-6"
      >
        <div className="relative w-full sm:w-48 h-32 rounded-xl overflow-hidden shrink-0">
          <img
            src={event.banner_image || 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=800&q=80'}
            alt={event.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />
          <div className="absolute top-2 left-2">{getStatusBadge()}</div>
        </div>

        <div className="flex-1 space-y-2 text-left">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold font-mono text-white group-hover:text-cyan-400 transition-colors">
              {event.name}
            </h3>
            <span className="text-xs font-mono text-purple-400 font-semibold">{event.prize_pool} Pool</span>
          </div>

          <p className="text-xs text-cyan-300 font-semibold">{event.theme}</p>
          <p className="text-xs text-slate-400 line-clamp-2">{event.description}</p>

          <div className="flex flex-wrap items-center gap-4 pt-2 text-[11px] font-mono text-slate-400 border-t border-white/5">
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-cyan-400" /> {formattedStartDate}
            </span>
            <span className="flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-purple-400" /> {event.venue}
            </span>
            <span className="flex items-center gap-1">
              <Users className="w-3.5 h-3.5 text-emerald-400" /> Max {event.max_teams} Teams
            </span>
          </div>
        </div>

        <div className="flex sm:flex-col gap-2 shrink-0 w-full sm:w-auto">
          <button
            onClick={() => onViewDetails(event.slug)}
            className="flex-1 px-4 py-2 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/20 text-xs font-mono font-bold transition-all flex items-center justify-center gap-1 cursor-pointer"
          >
            <span>Details</span> <ArrowRight className="w-3.5 h-3.5" />
          </button>
          {!isCompleted && (
            <button
              onClick={() => onRegister(event)}
              className="flex-1 px-4 py-2 rounded-xl neon-button text-white text-xs font-mono font-bold transition-all cursor-pointer"
            >
              Register
            </button>
          )}
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      whileHover={{ y: -6, scale: 1.01 }}
      className="group relative rounded-3xl bg-[#0B1120]/90 border border-white/10 hover:border-cyan-500/50 shadow-[0_10px_30px_rgba(0,0,0,0.5)] hover:shadow-[0_0_40px_rgba(0,229,255,0.25)] transition-all duration-300 flex flex-col overflow-hidden"
    >
      {/* Banner Image Container */}
      <div className="relative h-48 w-full overflow-hidden">
        <img
          src={event.banner_image || 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=800&q=80'}
          alt={event.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0B1120] via-[#0B1120]/30 to-transparent" />
        <div className="absolute top-4 left-4 z-10">{getStatusBadge()}</div>
        <div className="absolute top-4 right-4 z-10 p-2 rounded-xl bg-black/60 backdrop-blur-md border border-white/10 text-cyan-400 font-mono text-xs font-bold flex items-center gap-1">
          <Trophy className="w-3.5 h-3.5 text-amber-400" /> {event.prize_pool}
        </div>
      </div>

      {/* Card Content Body */}
      <div className="p-6 flex-1 flex flex-col justify-between space-y-4 font-sans text-left">
        <div className="space-y-2">
          <div className="flex items-center gap-1.5 text-xs text-cyan-400 font-mono font-semibold">
            <Sparkles className="w-3.5 h-3.5" /> {event.theme}
          </div>
          <h3 className="text-xl font-bold font-mono text-white group-hover:text-cyan-300 transition-colors leading-snug">
            {event.name}
          </h3>
          <p className="text-xs text-slate-400 leading-relaxed line-clamp-3">
            {event.description}
          </p>
        </div>

        {/* Info Pill Grid */}
        <div className="grid grid-cols-2 gap-2 text-[11px] font-mono text-slate-300 pt-3 border-t border-white/10">
          <div className="flex items-center gap-1.5 bg-white/5 p-2 rounded-xl">
            <Calendar className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
            <span className="truncate">{formattedStartDate}</span>
          </div>
          <div className="flex items-center gap-1.5 bg-white/5 p-2 rounded-xl">
            <MapPin className="w-3.5 h-3.5 text-purple-400 shrink-0" />
            <span className="truncate">{event.venue}</span>
          </div>
        </div>

        {/* Card Footer Actions */}
        <div className="pt-2 flex items-center gap-2">
          <button
            onClick={() => onViewDetails(event.slug)}
            className="flex-1 py-2.5 rounded-xl bg-white/5 border border-white/10 text-cyan-400 hover:bg-cyan-500/10 font-mono text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <span>Explore Event</span> <ArrowRight className="w-3.5 h-3.5" />
          </button>
          {!isCompleted && (
            <button
              onClick={() => onRegister(event)}
              className="py-2.5 px-4 rounded-xl neon-button text-white font-mono text-xs font-bold transition-all cursor-pointer shrink-0"
            >
              Register
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default EventCard;

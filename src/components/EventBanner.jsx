import React from 'react';
import { Rocket, Calendar, MapPin, Trophy, Users, ShieldAlert, Share2 } from 'lucide-react';
import { motion } from 'framer-motion';

const EventBanner = ({ event, onRegister, onShare }) => {
  if (!event) return null;

  const formattedDates = event.start_date && event.end_date
    ? `${new Date(event.start_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${new Date(event.end_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`
    : 'Dates To Be Announced';

  const isCompleted = event.status === 'completed' || event.status === 'archived';

  return (
    <div className="relative min-h-[60vh] flex items-center justify-center pt-24 pb-16 px-6 overflow-hidden">
      {/* Background Image with Ambient Glow Overlays */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <img
          src={event.banner_image || 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1600&q=80'}
          alt={event.name}
          className="w-full h-full object-cover opacity-25 filter blur-[2px] scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#050816]/70 via-[#050816]/90 to-[#050816]" />
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-cyan-500/15 rounded-full blur-[100px] pointer-events-none" />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto text-center space-y-6">
        {/* Status Badge & Theme Pill */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-wrap items-center justify-center gap-3"
        >
          <span className="px-4 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/40 text-cyan-400 font-mono text-xs font-bold uppercase tracking-wider shadow-[0_0_20px_rgba(0,229,255,0.3)]">
            🚀 {event.theme || 'Flagship Hackathon'}
          </span>
          <span
            className={`px-3 py-1.5 rounded-full text-xs font-mono font-bold uppercase ${
              event.status === 'live'
                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                : isCompleted
                ? 'bg-slate-500/20 text-slate-300 border border-slate-500/40'
                : 'bg-purple-500/20 text-purple-300 border border-purple-500/40'
            }`}
          >
            {event.status || 'Upcoming'}
          </span>
        </motion.div>

        {/* Event Title */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-4xl sm:text-6xl lg:text-7xl font-extrabold font-title tracking-tight text-white leading-tight"
        >
          <span className="bg-gradient-to-r from-white via-cyan-100 to-cyan-400 bg-clip-text text-transparent">
            {event.name}
          </span>
        </motion.h1>

        {/* Event Description */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed"
        >
          {event.description}
        </motion.p>

        {/* Event Highlights Metric Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-3xl mx-auto font-mono text-xs pt-4"
        >
          <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md flex flex-col items-center justify-center">
            <Calendar className="w-5 h-5 text-cyan-400 mb-1" />
            <span className="text-slate-400 text-[10px]">EVENT DATES</span>
            <span className="text-white font-bold text-center">{formattedDates}</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md flex flex-col items-center justify-center">
            <Trophy className="w-5 h-5 text-amber-400 mb-1" />
            <span className="text-slate-400 text-[10px]">PRIZE POOL</span>
            <span className="text-white font-bold">{event.prize_pool || '$10,000+'}</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md flex flex-col items-center justify-center">
            <MapPin className="w-5 h-5 text-purple-400 mb-1" />
            <span className="text-slate-400 text-[10px]">LOCATION / VENUE</span>
            <span className="text-white font-bold truncate max-w-[120px]">{event.venue}</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md flex flex-col items-center justify-center">
            <Users className="w-5 h-5 text-emerald-400 mb-1" />
            <span className="text-slate-400 text-[10px]">MAX TEAMS</span>
            <span className="text-white font-bold">{event.max_teams || 100} Teams</span>
          </div>
        </motion.div>

        {/* Action CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="flex flex-wrap items-center justify-center gap-4 pt-4"
        >
          {!isCompleted && (
            <button
              onClick={() => onRegister(event)}
              className="neon-button px-8 py-4 rounded-2xl font-mono text-sm font-bold uppercase tracking-wider text-white flex items-center gap-2 cursor-pointer shadow-[0_0_30px_rgba(0,229,255,0.4)]"
            >
              <Rocket className="w-5 h-5" /> Register Team Now
            </button>
          )}

          <button
            onClick={onShare}
            className="px-6 py-4 rounded-2xl bg-white/5 border border-white/10 text-slate-300 hover:text-white hover:bg-white/10 font-mono text-sm font-bold transition-all flex items-center gap-2 cursor-pointer"
          >
            <Share2 className="w-4 h-4 text-cyan-400" /> Share Event
          </button>
        </motion.div>
      </div>
    </div>
  );
};

export default EventBanner;

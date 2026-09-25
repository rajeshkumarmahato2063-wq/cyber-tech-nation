import React from 'react';
import { Video, Users, Clock, Radio, Sparkles, ArrowLeft } from 'lucide-react';
import OfficeHourCard from '../../components/OfficeHourCard';
import useMentor from '../../hooks/useMentor';

/**
 * Live Office Hours Page (/office-hours)
 */
const OfficeHoursPage = ({ user, onNavigate }) => {
  const { officeHours, loading } = useMentor(user);

  const liveRooms = officeHours.filter(s => s.status === 'live');
  const upcomingRooms = officeHours.filter(s => s.status !== 'live');

  return (
    <div className="min-h-screen bg-[#050816] text-white pt-24 pb-20 px-4 sm:px-6 lg:px-8 max-w-[1440px] mx-auto space-y-10 font-sans">
      {/* Top Bar */}
      <button
        onClick={() => onNavigate ? onNavigate('/mentors') : null}
        className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-mono text-cyan-400 flex items-center gap-2 transition-all"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Mentor Hub
      </button>

      {/* Hero Banner */}
      <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-br from-[#0B1120] via-[#050816] to-[#0A261D] border border-emerald-500/30 space-y-4 shadow-[0_0_50px_rgba(16,185,129,0.15)]">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-mono text-xs font-semibold">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          <Radio className="w-4 h-4" />
          <span>24/7 Live Mentor Broadcast Rooms</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
          Live Mentor Office Hours & Drop-Ins
        </h1>

        <p className="text-xs sm:text-sm text-slate-300 font-mono max-w-2xl leading-relaxed">
          Drop in live with technical experts to troubleshoot architecture bottlenecks, clarify hackathon judging rubrics, and listen to real-time code reviews.
        </p>
      </div>

      {/* Live Active Rooms Section */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-emerald-400 animate-ping" />
            Currently Live Broadcast Rooms ({liveRooms.length})
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {liveRooms.map((room) => (
            <OfficeHourCard
              key={room.id}
              session={room}
              onJoinSession={() => {}}
            />
          ))}
        </div>
      </div>

      {/* Upcoming Schedule Section */}
      <div className="space-y-6 pt-6 border-t border-white/10">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <Clock className="w-5 h-5 text-purple-400" />
          Upcoming Scheduled Office Hours
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {upcomingRooms.map((room) => (
            <OfficeHourCard
              key={room.id}
              session={room}
              onJoinSession={() => {}}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default OfficeHoursPage;

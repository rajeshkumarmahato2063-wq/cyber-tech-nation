import React, { useState, useEffect } from 'react';
import { Clock, MapPin, CheckCircle2, PlayCircle, CircleAlert } from 'lucide-react';
import { getEventSchedule } from '../services/liveOps';

/**
 * Dynamic Live Event Schedule Component
 */
export default function EventSchedule() {
  const [schedule, setSchedule] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSchedule();
  }, []);

  const loadSchedule = async () => {
    setLoading(true);
    try {
      const data = await getEventSchedule();
      setSchedule(data);
    } catch (err) {
      console.warn('Schedule error:', err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'completed':
        return (
          <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-[10px] uppercase font-bold flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" /> Done
          </span>
        );
      case 'ongoing':
        return (
          <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 text-[10px] uppercase font-bold flex items-center gap-1 animate-pulse">
            <PlayCircle className="w-3 h-3 text-cyan-400" /> Live Now
          </span>
        );
      default:
        return (
          <span className="px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-400 border border-slate-700 text-[10px] uppercase font-semibold flex items-center gap-1">
            <Clock className="w-3 h-3" /> Upcoming
          </span>
        );
    }
  };

  if (loading) {
    return (
      <div className="p-8 text-center text-slate-400 font-mono text-xs">
        Loading live event schedule...
      </div>
    );
  }

  return (
    <div className="space-y-4 font-sans text-xs">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold text-white font-mono uppercase tracking-wider flex items-center gap-2">
          <Clock className="w-4 h-4 text-cyan-400" /> Dynamic Hackathon Agenda
        </h3>
        <span className="text-[11px] text-slate-400 font-mono">Synced with Live Operations</span>
      </div>

      <div className="relative border-l-2 border-cyan-500/30 ml-3 pl-6 space-y-6">
        {schedule.map((item, idx) => {
          const isOngoing = item.status === 'ongoing';
          return (
            <div
              key={item.id || idx}
              className={`relative p-4 rounded-2xl border transition-all ${
                isOngoing
                  ? 'bg-cyan-950/30 border-cyan-500/50 shadow-[0_0_20px_rgba(6,182,212,0.15)] ring-1 ring-cyan-500/40'
                  : 'bg-white/5 border-white/10 hover:border-white/20'
              }`}
            >
              {/* Timeline Marker Dot */}
              <div
                className={`absolute -left-[31px] top-4 w-4 h-4 rounded-full border-2 ${
                  isOngoing
                    ? 'bg-cyan-400 border-cyan-200 ring-4 ring-cyan-500/30 animate-pulse'
                    : item.status === 'completed'
                    ? 'bg-emerald-500 border-emerald-300'
                    : 'bg-[#0B1120] border-slate-600'
                }`}
              />

              <div className="flex items-start justify-between gap-3 mb-1.5">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-cyan-400">{item.time_label}</span>
                  <span className="text-slate-500">•</span>
                  <span className="font-semibold text-white text-sm">{item.activity}</span>
                </div>
                {getStatusBadge(item.status)}
              </div>

              {item.description && (
                <p className="text-slate-300 text-xs mt-1 mb-2 leading-relaxed">{item.description}</p>
              )}

              {item.location && (
                <div className="flex items-center gap-1.5 text-[11px] text-slate-400 font-mono mt-2">
                  <MapPin className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                  <span>{item.location}</span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

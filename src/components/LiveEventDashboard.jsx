import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Clock, Users, Award, Bell, Activity, RefreshCw, Calendar, Image, BarChart3, Radio } from 'lucide-react';
import Countdown from './Countdown';
import LeaderboardTable from './LeaderboardTable';
import EventSchedule from './EventSchedule';
import EventGallery from './EventGallery';
import CertificateSection from './CertificateSection';
import AttendanceAnalytics from './admin/AttendanceAnalytics';
import { adminService } from '../services/admin';
import { getAnnouncements } from '../services/announcements';
import { getEventState } from '../services/liveOps';

/**
 * Public Live Event Dashboard & Operations Arena Modal Container
 */
const LiveEventDashboard = ({ isOpen, onClose, user }) => {
  const [activeTab, setActiveTab] = useState('leaderboard'); // 'leaderboard' | 'schedule' | 'gallery' | 'certificates' | 'analytics'
  const [stats, setStats] = useState({ totalRegistrations: 0, checkedInRegistrations: 0, approvedRegistrations: 0 });
  const [announcements, setAnnouncements] = useState([]);
  const [eventState, setEventState] = useState({ phase: 'checkin', status: 'active', current_activity: 'Hacking in Progress' });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      loadLiveData();
    }
  }, [isOpen]);

  const loadLiveData = async () => {
    setLoading(true);
    try {
      const s = await adminService.getDashboardStats();
      const a = await getAnnouncements();
      const st = await getEventState();
      setStats(s);
      setAnnouncements(a);
      setEventState(st);
    } catch (err) {
      console.warn('Live data fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  const tabs = [
    { id: 'leaderboard', label: 'Live Leaderboard', icon: Award },
    { id: 'schedule', label: 'Event Schedule', icon: Calendar },
    { id: 'gallery', label: 'Photo Gallery', icon: Image },
    { id: 'certificates', label: 'Certificates', icon: Award },
    { id: 'analytics', label: 'Attendance Stats', icon: BarChart3 }
  ];

  const getPhaseColor = (phase) => {
    switch (phase) {
      case 'hacking':
        return 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40';
      case 'judging':
        return 'bg-purple-500/20 text-purple-300 border-purple-500/40';
      case 'results':
        return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40';
      default:
        return 'bg-amber-500/20 text-amber-300 border-amber-500/40';
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-xl overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="relative w-full max-w-6xl bg-[#070C1A] border border-cyan-500/40 rounded-3xl p-5 sm:p-7 shadow-[0_0_60px_rgba(0,229,255,0.2)] my-6 max-h-[92vh] flex flex-col font-sans"
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-white/10 shrink-0">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
                <Activity className="w-6 h-6 animate-pulse" />
              </div>
              <div>
                <h2 className="text-xl sm:text-2xl font-bold font-mono tracking-tight text-white flex flex-wrap items-center gap-2">
                  ZAYATHON Live Broadcast Arena
                  <span className={`text-xs px-2.5 py-0.5 rounded-full border font-semibold uppercase flex items-center gap-1 ${getPhaseColor(eventState.phase)}`}>
                    <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                    Phase: {eventState.phase}
                  </span>
                </h2>
                <p className="text-xs text-slate-400">Realtime hackathon countdown, leaderboards, schedule, photos & certificates</p>
              </div>
            </div>

            <div className="flex items-center gap-2 sm:gap-3">
              <button
                onClick={loadLiveData}
                className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-cyan-400 hover:bg-cyan-500/10 transition-all"
                title="Sync Live Feed"
              >
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              </button>
              <button
                onClick={onClose}
                className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-slate-400 hover:text-white hover:bg-white/10 transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Navigation Tab Bar */}
          <div className="flex items-center gap-2 border-b border-white/10 py-3 overflow-x-auto font-mono text-xs shrink-0">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-3.5 py-2 rounded-xl border flex items-center gap-2 transition-all shrink-0 ${
                    activeTab === tab.id
                      ? 'bg-cyan-500/20 border-cyan-500/50 text-cyan-300 font-bold shadow-[0_0_15px_rgba(6,182,212,0.15)]'
                      : 'bg-white/5 border-white/10 text-slate-400 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto space-y-6 pt-4 pr-1 font-mono text-xs">
            {/* Live Stats Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10">
                <div className="text-slate-400 text-[11px]">Total Hackers</div>
                <div className="text-xl font-bold text-white">{stats.totalRegistrations}</div>
              </div>
              <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30">
                <div className="text-emerald-400 text-[11px]">Checked-In Onsite</div>
                <div className="text-xl font-bold text-emerald-300">{stats.checkedInRegistrations}</div>
              </div>
              <div className="p-3.5 rounded-2xl bg-cyan-500/10 border border-cyan-500/30">
                <div className="text-cyan-400 text-[11px]">Approved Teams</div>
                <div className="text-xl font-bold text-cyan-300">{stats.approvedRegistrations}</div>
              </div>
              <div className="p-3.5 rounded-2xl bg-purple-500/10 border border-purple-500/30">
                <div className="text-purple-400 text-[11px]">Current Activity</div>
                <div className="text-xs font-bold text-purple-200 truncate">{eventState.current_activity || 'Hacking Sprint'}</div>
              </div>
            </div>

            {/* Countdown Banner */}
            <div className="p-5 rounded-3xl bg-gradient-to-r from-cyan-950/40 via-[#0B1120] to-purple-950/40 border border-cyan-500/30 text-center space-y-2">
              <h3 className="text-xs font-bold text-cyan-400 uppercase tracking-wider">Sprint Deadline Countdown</h3>
              <div className="scale-90 transform-gpu">
                <Countdown targetDate="2026-12-03T18:00:00" />
              </div>
            </div>

            {/* Tab Views */}
            {activeTab === 'leaderboard' && <LeaderboardTable />}
            {activeTab === 'schedule' && <EventSchedule />}
            {activeTab === 'gallery' && <EventGallery isAdmin={false} />}
            {activeTab === 'certificates' && <CertificateSection user={user} />}
            {activeTab === 'analytics' && <AttendanceAnalytics />}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default LiveEventDashboard;

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Clock, Users, QrCode, Award, Bell, Activity, RefreshCw } from 'lucide-react';
import Countdown from './Countdown';
import LeaderboardTable from './LeaderboardTable';
import { adminService } from '../services/admin';
import { getAnnouncements } from '../services/announcements';

/**
 * Public Live Event Dashboard Modal Container
 */
const LiveEventDashboard = ({ isOpen, onClose }) => {
  const [stats, setStats] = useState({ totalRegistrations: 0, checkedInRegistrations: 0, approvedRegistrations: 0 });
  const [announcements, setAnnouncements] = useState([]);
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
      setStats(s);
      setAnnouncements(a);
    } catch (err) {
      console.warn('Live data fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/85 backdrop-blur-xl overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="relative w-full max-w-6xl bg-[#070C1A] border border-cyan-500/40 rounded-3xl p-6 sm:p-8 shadow-[0_0_60px_rgba(0,229,255,0.2)] my-8 max-h-[90vh] flex flex-col font-sans"
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-5 border-b border-white/10 shrink-0">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
                <Activity className="w-7 h-7" />
              </div>
              <div>
                <h2 className="text-2xl font-bold font-mono tracking-tight text-white flex items-center gap-2">
                  ZAYATHON Live Broadcast Arena
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-semibold uppercase flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" /> Live
                  </span>
                </h2>
                <p className="text-xs text-slate-400">Realtime hackathon countdown, leaderboards, check-ins & judge scoring</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={loadLiveData}
                className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-cyan-400 hover:bg-cyan-500/10 transition-all"
                title="Sync Live Feed"
              >
                <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
              </button>
              <button
                onClick={onClose}
                className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-slate-400 hover:text-white hover:bg-white/10 transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto space-y-6 pt-5 pr-1 font-mono text-xs">
            {/* Live Stats Row */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                <div className="text-slate-400">Total Hackers</div>
                <div className="text-2xl font-bold text-white">{stats.totalRegistrations}</div>
              </div>
              <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30">
                <div className="text-emerald-400">Checked-In Onsite</div>
                <div className="text-2xl font-bold text-emerald-300">{stats.checkedInRegistrations}</div>
              </div>
              <div className="p-4 rounded-2xl bg-cyan-500/10 border border-cyan-500/30">
                <div className="text-cyan-400">Approved Teams</div>
                <div className="text-2xl font-bold text-cyan-300">{stats.approvedRegistrations}</div>
              </div>
              <div className="p-4 rounded-2xl bg-purple-500/10 border border-purple-500/30">
                <div className="text-purple-400">Active Notices</div>
                <div className="text-2xl font-bold text-purple-300">{announcements.length}</div>
              </div>
            </div>

            {/* Countdown Banner */}
            <div className="p-6 rounded-3xl bg-gradient-to-r from-cyan-950/40 via-[#0B1120] to-purple-950/40 border border-cyan-500/30 text-center space-y-3">
              <h3 className="text-sm font-bold text-cyan-400 uppercase tracking-wider">Sprint Deadline Countdown</h3>
              <div className="scale-90 transform-gpu">
                <Countdown targetDate="2026-12-03T18:00:00" />
              </div>
            </div>

            {/* Live Leaderboard Table Component */}
            <LeaderboardTable />
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default LiveEventDashboard;

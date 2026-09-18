import React, { useState, useEffect } from 'react';
import { Users, UserCheck, UserX, Clock, BarChart3, RefreshCw } from 'lucide-react';
import { getAttendanceAnalytics } from '../../services/liveOps';

/**
 * Real-time Attendance Analytics & Hourly Distribution Component
 */
export default function AttendanceAnalytics() {
  const [data, setData] = useState({
    total: 0,
    checkedInCount: 0,
    absentCount: 0,
    hourlyData: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const result = await getAttendanceAnalytics();
      setData(result);
    } catch (err) {
      console.warn('Analytics error:', err);
    } finally {
      setLoading(false);
    }
  };

  const percentage = data.total > 0 ? Math.round((data.checkedInCount / data.total) * 100) : 0;
  const maxHourly = Math.max(...data.hourlyData.map(d => d.count), 1);

  return (
    <div className="space-y-6 font-sans text-xs text-white">
      <div className="flex items-center justify-between pb-3 border-b border-white/10">
        <div>
          <h3 className="text-sm font-bold font-mono tracking-wider text-cyan-400 uppercase flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-cyan-400" /> Attendance Analytics & Velocity
          </h3>
          <p className="text-[11px] text-slate-400">Onsite registration statistics, absent counts, and hourly arrival trends.</p>
        </div>
        <button
          onClick={loadData}
          className="p-2 rounded-xl bg-white/5 border border-white/10 text-cyan-400 hover:bg-cyan-500/10"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 font-mono">
        <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-1">
          <div className="text-slate-400 text-[11px] flex items-center justify-between">
            <span>Total Registrations</span>
            <Users className="w-4 h-4 text-slate-400" />
          </div>
          <div className="text-2xl font-bold text-white">{data.total}</div>
          <div className="text-[10px] text-slate-400">Approved participants</div>
        </div>

        <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 space-y-1">
          <div className="text-emerald-400 text-[11px] flex items-center justify-between">
            <span>Checked-In Onsite</span>
            <UserCheck className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-bold text-emerald-300">{data.checkedInCount} ({percentage}%)</div>
          <div className="text-[10px] text-emerald-400/80">Badges issued</div>
        </div>

        <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 space-y-1">
          <div className="text-rose-400 text-[11px] flex items-center justify-between">
            <span>Pending / Absent</span>
            <UserX className="w-4 h-4 text-rose-400" />
          </div>
          <div className="text-2xl font-bold text-rose-300">{data.absentCount}</div>
          <div className="text-[10px] text-rose-400/80">Awaiting arrival</div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2">
        <div className="flex items-center justify-between text-xs font-mono">
          <span className="text-slate-300">Overall Attendance Progress</span>
          <span className="text-cyan-400 font-bold">{percentage}%</span>
        </div>
        <div className="w-full h-3 bg-black/50 rounded-full overflow-hidden border border-white/10 p-0.5">
          <div
            className="h-full bg-gradient-to-r from-cyan-500 to-emerald-400 rounded-full transition-all duration-700"
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>

      {/* Hourly Bar Chart */}
      <div className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="text-xs font-bold text-white font-mono uppercase flex items-center gap-1.5">
            <Clock className="w-4 h-4 text-cyan-400" /> Hourly Check-in Arrival Chart
          </h4>
          <span className="text-[10px] text-slate-400 font-mono">Check-in Count vs Time Window</span>
        </div>

        <div className="h-44 flex items-end justify-between gap-3 pt-6 pb-2 px-2 border-b border-white/10">
          {data.hourlyData.map((item, idx) => {
            const heightPct = Math.round((item.count / maxHourly) * 100);
            return (
              <div key={idx} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
                <span className="text-[10px] font-mono text-cyan-300 font-bold opacity-0 group-hover:opacity-100 transition-opacity">
                  {item.count}
                </span>
                <div
                  className="w-full max-w-[40px] bg-gradient-to-t from-cyan-600 to-cyan-400 rounded-t-lg transition-all duration-500 group-hover:from-emerald-500 group-hover:to-cyan-300"
                  style={{ height: `${Math.max(heightPct, 6)}%` }}
                />
                <span className="text-[10px] font-mono text-slate-400">{item.time}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

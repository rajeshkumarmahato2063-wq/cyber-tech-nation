import React, { useState, useEffect } from 'react';
import { QrCode, Search, CheckCircle, AlertTriangle, RefreshCw, UserCheck, Clock } from 'lucide-react';
import { performCheckIn, getCheckInStats } from '../../services/checkin';

/**
 * Organizer QR Scanner & Attendance Check-In Panel
 */
const CheckInScanner = ({ registrations = [], onRefresh }) => {
  const [searchInput, setSearchInput] = useState('');
  const [scanning, setScanning] = useState(false);
  const [checkInResult, setCheckInResult] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');
  const [stats, setStats] = useState({ totalRegistrations: 0, checkedInCount: 0, percentage: 0 });

  useEffect(() => {
    loadStats();
  }, [registrations]);

  const loadStats = async () => {
    const s = await getCheckInStats();
    setStats(s);
  };

  const handleManualCheckIn = async (regId) => {
    setScanning(true);
    setCheckInResult(null);
    setErrorMsg('');

    try {
      const result = await performCheckIn(regId, null, 'Manual');
      setCheckInResult(result);
      if (onRefresh) onRefresh();
      loadStats();
    } catch (err) {
      setErrorMsg(err.message || 'Check-in failed');
    } finally {
      setScanning(false);
    }
  };

  const filteredRegistrations = registrations.filter((r) => {
    if (!searchInput.trim()) return r.status === 'approved';
    const term = searchInput.toLowerCase();
    return (
      r.id.toLowerCase().includes(term) ||
      (r.teams?.team_name || '').toLowerCase().includes(term) ||
      (r.project_title || '').toLowerCase().includes(term)
    );
  });

  return (
    <div className="space-y-6 font-mono text-xs">
      {/* Top Attendance Stats Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-1">
          <div className="text-slate-400">Total Approved Teams</div>
          <div className="text-2xl font-bold text-white">{stats.totalRegistrations}</div>
        </div>
        <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 space-y-1">
          <div className="text-emerald-400">Checked-In Attendees</div>
          <div className="text-2xl font-bold text-emerald-300">{stats.checkedInCount} ({stats.percentage}%)</div>
        </div>
        <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 space-y-1">
          <div className="text-amber-400">Pending Check-In</div>
          <div className="text-2xl font-bold text-amber-300">{stats.pendingCheckIn}</div>
        </div>
      </div>

      {/* Result Notification */}
      {checkInResult && (
        <div className={`p-4 rounded-2xl border flex items-center justify-between gap-3 ${
          checkInResult.alreadyCheckedIn
            ? 'bg-amber-500/15 border-amber-500/40 text-amber-300'
            : 'bg-emerald-500/15 border-emerald-500/40 text-emerald-300'
        }`}>
          <div className="flex items-center gap-3">
            <CheckCircle className="w-6 h-6 shrink-0" />
            <div>
              <div className="font-bold text-sm">{checkInResult.message}</div>
              <div className="text-[11px] opacity-80">Registered ID: {checkInResult.registration?.id}</div>
            </div>
          </div>
          <button onClick={() => setCheckInResult(null)} className="text-xs underline opacity-80">Dismiss</button>
        </div>
      )}

      {errorMsg && (
        <div className="p-4 rounded-2xl bg-rose-500/15 border border-rose-500/40 text-rose-300 flex items-center gap-3">
          <AlertTriangle className="w-5 h-5 shrink-0 text-rose-400" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Manual Search & Quick Check-In List */}
      <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-4">
        <div className="flex items-center justify-between gap-4">
          <h3 className="font-bold text-cyan-400 text-sm flex items-center gap-2">
            <UserCheck className="w-4 h-4" /> Approved Registrations Desk Check-In
          </h3>

          <div className="relative w-64">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search team or reg ID..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="w-full bg-black/40 border border-white/10 rounded-xl pl-9 pr-3 py-1.5 text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-400"
            />
          </div>
        </div>

        <div className="divide-y divide-white/5 border border-white/10 rounded-xl overflow-hidden max-h-80 overflow-y-auto">
          {filteredRegistrations.length === 0 ? (
            <div className="p-6 text-center text-slate-500">No matching approved teams found.</div>
          ) : (
            filteredRegistrations.map((r) => (
              <div key={r.id} className="p-3 bg-white/5 hover:bg-white/10 transition-all flex items-center justify-between">
                <div>
                  <div className="font-bold text-white text-sm">{r.teams?.team_name || 'Individual Team'}</div>
                  <div className="text-slate-400 text-[11px]">{r.innovation_domain} • Project: {r.project_title}</div>
                </div>

                <div className="flex items-center gap-3">
                  {r.checked_in ? (
                    <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 font-bold flex items-center gap-1 text-[11px]">
                      <CheckCircle className="w-3.5 h-3.5" /> Checked In ({new Date(r.check_in_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })})
                    </span>
                  ) : (
                    <button
                      onClick={() => handleManualCheckIn(r.id)}
                      disabled={scanning}
                      className="px-3 py-1.5 rounded-xl bg-cyan-500 text-[#050816] font-bold hover:bg-cyan-400 transition-all flex items-center gap-1 cursor-pointer"
                    >
                      {scanning ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <QrCode className="w-3.5 h-3.5" />} Check In
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default CheckInScanner;

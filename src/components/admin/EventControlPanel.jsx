import React, { useState, useEffect } from 'react';
import { Play, Pause, Lock, ShieldAlert, Award, CheckCircle, Radio, Megaphone, Loader2 } from 'lucide-react';
import { getEventState, updateEventState } from '../../services/liveOps';

/**
 * Admin Master Control Panel for Live Event Operations
 */
export default function EventControlPanel() {
  const [state, setState] = useState({
    phase: 'checkin',
    status: 'active',
    current_activity: 'Onsite Check-in & Team Setup',
    registrations_locked: false,
    judging_open: false,
    results_published: false,
    emergency_broadcast: { enabled: false, title: '', message: '', level: 'info' }
  });
  const [loading, setLoading] = useState(false);
  const [broadcastForm, setBroadcastForm] = useState({
    enabled: false,
    title: 'VENUE ANNOUNCEMENT',
    message: '',
    level: 'info'
  });

  useEffect(() => {
    loadState();
  }, []);

  const loadState = async () => {
    try {
      const s = await getEventState();
      setState(s);
      if (s.emergency_broadcast) {
        setBroadcastForm(s.emergency_broadcast);
      }
    } catch (err) {
      console.warn('Error loading state:', err);
    }
  };

  const handleUpdateField = async (field, value) => {
    setLoading(true);
    try {
      const updated = await updateEventState({ [field]: value });
      setState(updated);
    } catch (err) {
      alert('Failed to update event state: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSendBroadcast = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const updated = await updateEventState({
        emergency_broadcast: { ...broadcastForm, enabled: true }
      });
      setState(updated);
      alert('Emergency Broadcast dispatched to all live screens!');
    } catch (err) {
      alert('Broadcast error: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleClearBroadcast = async () => {
    setLoading(true);
    try {
      const updated = await updateEventState({
        emergency_broadcast: { enabled: false, title: '', message: '', level: 'info' }
      });
      setState(updated);
      setBroadcastForm({ enabled: false, title: '', message: '', level: 'info' });
    } catch (err) {
      alert('Clear broadcast error: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const phases = [
    { id: 'registration', label: '1. Registration' },
    { id: 'checkin', label: '2. Check-in' },
    { id: 'hacking', label: '3. Hacking' },
    { id: 'judging', label: '4. Judging' },
    { id: 'results', label: '5. Results' },
    { id: 'ended', label: '6. Event Ended' }
  ];

  return (
    <div className="space-y-6 font-sans text-xs text-white">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-white/10">
        <div>
          <h3 className="text-sm font-bold font-mono tracking-wider text-cyan-400 uppercase flex items-center gap-2">
            <Radio className="w-4 h-4 animate-pulse text-red-400" /> Live Event Operations Control Panel
          </h3>
          <p className="text-[11px] text-slate-400">Master controls to toggle phases, broadcasts, lock registrations, and trigger judging.</p>
        </div>
        {loading && <Loader2 className="w-5 h-5 text-cyan-400 animate-spin" />}
      </div>

      {/* Phase Switcher */}
      <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-3">
        <label className="block text-xs font-mono uppercase text-slate-300 font-bold">Current Event Phase</label>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2">
          {phases.map((p) => (
            <button
              key={p.id}
              onClick={() => handleUpdateField('phase', p.id)}
              className={`p-2.5 rounded-xl border text-center transition-all font-mono text-[11px] ${
                state.phase === p.id
                  ? 'bg-cyan-500/20 border-cyan-500/50 text-cyan-300 font-bold shadow-[0_0_15px_rgba(6,182,212,0.2)]'
                  : 'bg-black/30 border-white/10 text-slate-400 hover:text-white hover:bg-white/10'
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* Action Toggles Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Toggle Status */}
        <div className="p-4 rounded-2xl bg-white/5 border border-white/10 flex flex-col justify-between space-y-3">
          <div>
            <div className="text-xs font-bold text-slate-300 mb-1">Event Status</div>
            <p className="text-[11px] text-slate-400">Pause or resume the main hackathon countdown timer.</p>
          </div>
          <button
            onClick={() => handleUpdateField('status', state.status === 'active' ? 'paused' : 'active')}
            className={`w-full py-2 rounded-xl border font-bold font-mono text-xs uppercase flex items-center justify-center gap-2 transition-all ${
              state.status === 'active'
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 hover:bg-amber-500/30'
                : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 hover:bg-emerald-500/30'
            }`}
          >
            {state.status === 'active' ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            {state.status === 'active' ? 'Pause Event' : 'Resume Event'}
          </button>
        </div>

        {/* Lock Registrations */}
        <div className="p-4 rounded-2xl bg-white/5 border border-white/10 flex flex-col justify-between space-y-3">
          <div>
            <div className="text-xs font-bold text-slate-300 mb-1">Registration Gate</div>
            <p className="text-[11px] text-slate-400">Lock new participant submissions instantly.</p>
          </div>
          <button
            onClick={() => handleUpdateField('registrations_locked', !state.registrations_locked)}
            className={`w-full py-2 rounded-xl border font-bold font-mono text-xs uppercase flex items-center justify-center gap-2 transition-all ${
              state.registrations_locked
                ? 'bg-red-500/20 text-red-300 border-red-500/40 hover:bg-red-500/30'
                : 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40 hover:bg-cyan-500/30'
            }`}
          >
            <Lock className="w-4 h-4" />
            {state.registrations_locked ? 'Registrations Locked' : 'Lock Registrations'}
          </button>
        </div>

        {/* Judging & Results */}
        <div className="p-4 rounded-2xl bg-white/5 border border-white/10 flex flex-col justify-between space-y-3">
          <div>
            <div className="text-xs font-bold text-slate-300 mb-1">Judging & Results</div>
            <p className="text-[11px] text-slate-400">Open evaluation portals or reveal live scores.</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => handleUpdateField('judging_open', !state.judging_open)}
              className={`flex-1 py-2 rounded-xl border font-bold font-mono text-[10px] uppercase transition-all ${
                state.judging_open
                  ? 'bg-purple-500/20 text-purple-300 border-purple-500/40'
                  : 'bg-white/5 text-slate-300 border-white/10'
              }`}
            >
              Judging: {state.judging_open ? 'OPEN' : 'CLOSED'}
            </button>
            <button
              onClick={() => handleUpdateField('results_published', !state.results_published)}
              className={`flex-1 py-2 rounded-xl border font-bold font-mono text-[10px] uppercase transition-all ${
                state.results_published
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                  : 'bg-white/5 text-slate-300 border-white/10'
              }`}
            >
              Results: {state.results_published ? 'PUBLIC' : 'HIDDEN'}
            </button>
          </div>
        </div>
      </div>

      {/* Emergency Broadcast Dispatch Form */}
      <form onSubmit={handleSendBroadcast} className="p-5 rounded-2xl bg-gradient-to-r from-red-950/30 via-slate-900 to-amber-950/30 border border-red-500/30 space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="font-bold text-red-400 font-mono text-xs uppercase flex items-center gap-2">
            <Megaphone className="w-4 h-4 text-red-400 animate-bounce" /> Emergency Broadcast Dispatcher
          </h4>
          {state.emergency_broadcast?.enabled && (
            <button
              type="button"
              onClick={handleClearBroadcast}
              className="px-2.5 py-1 rounded-lg bg-red-500/20 text-red-300 border border-red-500/40 text-[10px] uppercase font-bold"
            >
              Clear Active Broadcast
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="block text-slate-400 mb-1 text-[11px]">Notice Title</label>
            <input
              type="text"
              required
              value={broadcastForm.title}
              onChange={(e) => setBroadcastForm({ ...broadcastForm, title: e.target.value })}
              className="w-full bg-black/50 border border-white/10 rounded-xl px-3 py-2 text-white font-mono"
              placeholder="e.g. WIFI CREDENTIALS"
            />
          </div>
          <div className="sm:col-span-2">
            <label className="block text-slate-400 mb-1 text-[11px]">Broadcast Message</label>
            <input
              type="text"
              required
              value={broadcastForm.message}
              onChange={(e) => setBroadcastForm({ ...broadcastForm, message: e.target.value })}
              className="w-full bg-black/50 border border-white/10 rounded-xl px-3 py-2 text-white font-mono"
              placeholder="e.g. WiFi SSIDs: ZayaThon_5G (Password: Hack2026!)"
            />
          </div>
        </div>

        <div className="flex items-center justify-between gap-3 pt-1">
          <div className="flex items-center gap-2">
            <label className="text-slate-400 text-[11px]">Priority Level:</label>
            {['info', 'warning', 'urgent'].map((lvl) => (
              <button
                key={lvl}
                type="button"
                onClick={() => setBroadcastForm({ ...broadcastForm, level: lvl })}
                className={`px-2.5 py-1 rounded-lg border text-[10px] uppercase font-bold transition-all ${
                  broadcastForm.level === lvl
                    ? lvl === 'urgent'
                      ? 'bg-red-500/30 text-red-300 border-red-500'
                      : lvl === 'warning'
                      ? 'bg-amber-500/30 text-amber-300 border-amber-500'
                      : 'bg-cyan-500/30 text-cyan-300 border-cyan-500'
                    : 'bg-black/30 border-white/10 text-slate-400'
                }`}
              >
                {lvl}
              </button>
            ))}
          </div>

          <button
            type="submit"
            className="px-4 py-2 rounded-xl bg-red-500 text-white font-bold text-xs uppercase font-mono tracking-wider hover:bg-red-600 transition-all shadow-lg flex items-center gap-1.5"
          >
            <Radio className="w-3.5 h-3.5" /> Push Broadcast
          </button>
        </div>
      </form>
    </div>
  );
}

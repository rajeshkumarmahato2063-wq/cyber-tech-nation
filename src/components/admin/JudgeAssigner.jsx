import React, { useState, useEffect } from 'react';
import { ShieldCheck, UserPlus, RefreshCw, Award } from 'lucide-react';
import { getAllJudges, assignJudgeToRegistration } from '../../services/judge';

/**
 * Admin Judge Assignment Component
 */
const JudgeAssigner = ({ registrations = [], onRefresh }) => {
  const [judges, setJudges] = useState([]);
  const [selectedJudge, setSelectedJudge] = useState('');
  const [selectedReg, setSelectedReg] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadJudgesList();
  }, []);

  const loadJudgesList = async () => {
    const list = await getAllJudges();
    setJudges(list);
    if (list.length > 0) setSelectedJudge(list[0].id);
    if (registrations.length > 0) setSelectedReg(registrations[0].id);
  };

  const handleAssign = async (e) => {
    e.preventDefault();
    if (!selectedJudge || !selectedReg) return;

    setSubmitting(true);
    try {
      await assignJudgeToRegistration(selectedJudge, selectedReg);
      alert('Judge successfully assigned to team!');
      if (onRefresh) onRefresh();
    } catch (err) {
      alert(err.message || 'Assignment failed');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-4 font-mono text-xs">
      <h3 className="font-bold text-cyan-400 text-sm flex items-center gap-2">
        <UserPlus className="w-4 h-4" /> Judge Team Assignment Desk
      </h3>

      <form onSubmit={handleAssign} className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div>
          <label className="text-slate-400 block mb-1">Select Judge</label>
          <select
            value={selectedJudge}
            onChange={(e) => setSelectedJudge(e.target.value)}
            className="w-full bg-[#050816] border border-white/12 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-cyan-400"
          >
            {judges.length === 0 ? (
              <option value="">No users with role="judge"</option>
            ) : (
              judges.map((j) => (
                <option key={j.id} value={j.id}>{j.full_name} ({j.email})</option>
              ))
            )}
          </select>
        </div>

        <div>
          <label className="text-slate-400 block mb-1">Select Project / Team</label>
          <select
            value={selectedReg}
            onChange={(e) => setSelectedReg(e.target.value)}
            className="w-full bg-[#050816] border border-white/12 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-cyan-400"
          >
            {registrations.map((r) => (
              <option key={r.id} value={r.id}>
                {r.teams?.team_name || 'Hacker'} - {r.project_title}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-end">
          <button
            type="submit"
            disabled={submitting || judges.length === 0}
            className="w-full py-2 rounded-xl bg-cyan-500 text-[#050816] font-bold hover:bg-cyan-400 transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-[0_0_15px_rgba(0,229,255,0.3)]"
          >
            {submitting ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Award className="w-3.5 h-3.5" />} Assign Judge
          </button>
        </div>
      </form>
    </div>
  );
};

export default JudgeAssigner;

import React, { useState, useEffect } from 'react';
import { Trophy, Medal, Award, Search, RefreshCw, Layers } from 'lucide-react';
import { getLeaderboardData } from '../services/leaderboard';
import useRealtime from '../hooks/useRealtime';

/**
 * Realtime Public & Admin Leaderboard Table Component
 */
const LeaderboardTable = () => {
  const [leaderboard, setLeaderboard] = useState([]);
  const [domainFilter, setDomainFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadLeaderboard();
  }, [domainFilter]);

  // Subscribe to realtime judge_scores table updates
  useRealtime('judge_scores', () => {
    loadLeaderboard();
  });

  const loadLeaderboard = async () => {
    setLoading(true);
    try {
      const data = await getLeaderboardData(domainFilter);
      setLeaderboard(data);
    } catch (err) {
      console.warn('Leaderboard fetch warning:', err.message);
    } finally {
      setLoading(false);
    }
  };

  const filteredList = leaderboard.filter((item) => {
    if (!searchTerm.trim()) return true;
    const term = searchTerm.toLowerCase();
    return (
      item.teamName.toLowerCase().includes(term) ||
      item.projectTitle.toLowerCase().includes(term) ||
      item.college.toLowerCase().includes(term)
    );
  });

  return (
    <div className="space-y-6 font-mono text-xs">
      {/* Top Controls & Search Bar */}
      <div className="p-4 rounded-2xl bg-white/5 border border-white/10 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400">
            <Trophy className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              Live Hackathon Standings
            </h3>
            <p className="text-[11px] text-slate-400">Realtime judge score aggregation across all 9 innovation tracks</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Domain Selector */}
          <select
            value={domainFilter}
            onChange={(e) => setDomainFilter(e.target.value)}
            className="bg-[#050816] border border-white/12 rounded-xl px-3 py-1.5 text-white focus:outline-none focus:border-cyan-400 text-xs"
          >
            <option value="all">All Domains</option>
            <option value="Agentic AI">Agentic AI</option>
            <option value="Robotics">Robotics & IoT</option>
            <option value="Cybersecurity">Cybersecurity</option>
            <option value="Web3 & FinTech">Web3 & FinTech</option>
            <option value="Smart Cities">Smart Cities</option>
          </select>

          {/* Search Bar */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search team or college..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-black/40 border border-white/12 rounded-xl pl-8 pr-3 py-1.5 text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-400 text-xs"
            />
          </div>

          <button
            onClick={loadLeaderboard}
            className="p-1.5 rounded-xl bg-white/5 border border-white/10 text-cyan-400 hover:bg-white/10"
            title="Refresh Leaderboard"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Leaderboard Roster Table */}
      <div className="border border-white/10 rounded-2xl overflow-hidden bg-white/5 shadow-[0_8px_32px_0_rgba(0,0,0,0.37)]">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-white/5 border-b border-white/10 text-slate-300 text-[11px]">
              <th className="p-3.5 text-center">Rank</th>
              <th className="p-3.5">Team & Institution</th>
              <th className="p-3.5">Track / Domain</th>
              <th className="p-3.5">Project Title</th>
              <th className="p-3.5 text-right">Avg Score</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5 text-slate-300">
            {filteredList.length === 0 ? (
              <tr>
                <td colSpan={5} className="p-8 text-center text-slate-500">
                  {loading ? 'Calculating realtime scores...' : 'No judge scores recorded yet.'}
                </td>
              </tr>
            ) : (
              filteredList.map((item) => (
                <tr
                  key={item.rank + item.teamName}
                  className={`hover:bg-white/5 transition-colors ${
                    item.rank === 1
                      ? 'bg-amber-500/10 font-bold'
                      : item.rank === 2
                      ? 'bg-slate-300/10'
                      : item.rank === 3
                      ? 'bg-amber-700/10'
                      : ''
                  }`}
                >
                  <td className="p-3.5 text-center font-bold">
                    {item.rank === 1 && <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-amber-400 text-black font-extrabold shadow-[0_0_12px_rgba(251,191,36,0.6)]">1</span>}
                    {item.rank === 2 && <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-slate-300 text-black font-extrabold">2</span>}
                    {item.rank === 3 && <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-amber-700 text-white font-extrabold">3</span>}
                    {item.rank > 3 && <span className="text-slate-400 font-bold">#{item.rank}</span>}
                  </td>
                  <td className="p-3.5">
                    <div className="font-bold text-white text-sm">{item.teamName}</div>
                    <div className="text-[10px] text-cyan-400">{item.college}</div>
                  </td>
                  <td className="p-3.5">
                    <span className="px-2.5 py-1 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/20 text-[10px]">
                      {item.domain}
                    </span>
                  </td>
                  <td className="p-3.5 text-slate-300">{item.projectTitle}</td>
                  <td className="p-3.5 text-right font-extrabold text-base text-cyan-400">
                    {item.totalScore} <span className="text-xs text-slate-500 font-normal">pts</span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default LeaderboardTable;

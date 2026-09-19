import React, { useState } from 'react';
import { Trophy, Award, Star, Flame, Sparkles, ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';

const LeaderboardPage = ({ onViewPortfolio }) => {
  const [metric, setMetric] = useState('points'); // 'points' | 'hackathons' | 'certificates' | 'projects'

  const leaderboardData = [
    { rank: 1, name: 'Rajesh Kumar Mahato', username: 'rajesh-mahato', points: 1450, hackathons: 5, certificates: 5, projects: 8, college: 'Institute of Engineering & Technology', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80' },
    { rank: 2, name: 'John Doe', username: 'john-doe', points: 1120, hackathons: 4, certificates: 3, projects: 5, college: 'Tech University Arena', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80' },
    { rank: 3, name: 'Sarah Chen', username: 'sarah-chen', points: 980, hackathons: 3, certificates: 3, projects: 4, college: 'Global Science Institute', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80' },
    { rank: 4, name: 'Alex Rivera', username: 'alex-rivera', points: 870, hackathons: 3, certificates: 2, projects: 4, college: 'Cyber Engineering College', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80' },
    { rank: 5, name: 'Elena Rostova', username: 'elena-r', points: 760, hackathons: 2, certificates: 2, projects: 3, college: 'National Polytechnic', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=400&q=80' }
  ];

  const sortedData = [...leaderboardData].sort((a, b) => {
    if (metric === 'points') return b.points - a.points;
    if (metric === 'hackathons') return b.hackathons - a.hackathons;
    if (metric === 'certificates') return b.certificates - a.certificates;
    return b.projects - a.projects;
  });

  return (
    <div className="min-h-screen pt-28 pb-20 px-6 max-w-6xl mx-auto space-y-10 font-sans text-left">
      {/* Header Banner */}
      <div className="space-y-3 pb-6 border-b border-white/10">
        <div className="flex items-center gap-2 text-cyan-400 font-mono text-xs font-bold uppercase tracking-widest">
          <Flame className="w-4 h-4 text-amber-400" /> Community Hall of Fame
        </div>
        <h1 className="text-4xl sm:text-6xl font-extrabold font-mono text-white tracking-tight">
          Hacker Leaderboard
        </h1>
        <p className="text-slate-400 text-sm max-w-xl">
          Track top hackers ranked by hackathons joined, verified certificates earned, projects built, and community points.
        </p>
      </div>

      {/* Metric Selector Tabs */}
      <div className="flex items-center gap-2 bg-[#0B1120] p-1.5 rounded-2xl border border-white/10 max-w-xl font-mono text-xs">
        <button
          onClick={() => setMetric('points')}
          className={`flex-1 py-2 rounded-xl transition-all font-bold cursor-pointer ${
            metric === 'points' ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30' : 'text-slate-400 hover:text-white'
          }`}
        >
          🏆 Points
        </button>
        <button
          onClick={() => setMetric('hackathons')}
          className={`flex-1 py-2 rounded-xl transition-all font-bold cursor-pointer ${
            metric === 'hackathons' ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30' : 'text-slate-400 hover:text-white'
          }`}
        >
          🚀 Hackathons
        </button>
        <button
          onClick={() => setMetric('certificates')}
          className={`flex-1 py-2 rounded-xl transition-all font-bold cursor-pointer ${
            metric === 'certificates' ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30' : 'text-slate-400 hover:text-white'
          }`}
        >
          🎖️ Certificates
        </button>
        <button
          onClick={() => setMetric('projects')}
          className={`flex-1 py-2 rounded-xl transition-all font-bold cursor-pointer ${
            metric === 'projects' ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30' : 'text-slate-400 hover:text-white'
          }`}
        >
          💻 Projects
        </button>
      </div>

      {/* Top 3 Podium */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2 font-mono">
        {sortedData.slice(0, 3).map((hacker, idx) => (
          <motion.div
            key={hacker.username}
            whileHover={{ y: -6 }}
            className={`p-6 rounded-3xl bg-[#0B1120] border text-center space-y-3 relative overflow-hidden ${
              idx === 0 ? 'border-amber-500/50 shadow-[0_0_30px_rgba(245,158,11,0.3)]' :
              idx === 1 ? 'border-slate-400/50 shadow-[0_0_30px_rgba(203,213,225,0.2)]' :
              'border-amber-700/50 shadow-[0_0_30px_rgba(217,119,6,0.2)]'
            }`}
          >
            <div className="w-20 h-20 rounded-2xl overflow-hidden mx-auto border-2 border-cyan-400">
              <img src={hacker.avatar} alt={hacker.name} className="w-full h-full object-cover" />
            </div>

            <div className="space-y-1">
              <span className="text-xs font-bold text-amber-400 block">
                {idx === 0 ? '🥇 1st Place' : idx === 1 ? '🥈 2nd Place' : '🥉 3rd Place'}
              </span>
              <h3 className="text-lg font-bold text-white">{hacker.name}</h3>
              <p className="text-xs text-cyan-400">{hacker.college}</p>
            </div>

            <div className="pt-2 border-t border-white/10 text-xs font-bold text-white flex justify-around">
              <div><span className="text-slate-400 block text-[10px]">POINTS</span>{hacker.points}</div>
              <div><span className="text-slate-400 block text-[10px]">EVENTS</span>{hacker.hackathons}</div>
              <div><span className="text-slate-400 block text-[10px]">CERTS</span>{hacker.certificates}</div>
            </div>

            <button
              onClick={() => onViewPortfolio(hacker.username)}
              className="w-full py-2 rounded-xl bg-white/5 border border-white/10 text-cyan-300 hover:bg-cyan-500/10 font-bold transition-all cursor-pointer text-xs"
            >
              View Portfolio
            </button>
          </motion.div>
        ))}
      </div>

      {/* Full Leaderboard Data Table */}
      <div className="border border-white/10 rounded-3xl overflow-hidden bg-[#0B1120] font-mono text-xs">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-white/5 border-b border-white/10 text-slate-300">
              <th className="p-4">Rank</th>
              <th className="p-4">Hacker Candidate</th>
              <th className="p-4">College / Institution</th>
              <th className="p-4 text-center">Hackathons</th>
              <th className="p-4 text-center">Certificates</th>
              <th className="p-4 text-center">Projects</th>
              <th className="p-4 text-right">Points</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5 text-slate-300">
            {sortedData.map((hacker, idx) => (
              <tr key={hacker.username} className="hover:bg-white/5 transition-colors">
                <td className="p-4 font-bold text-white">#{idx + 1}</td>
                <td className="p-4 font-bold text-cyan-300">
                  <button onClick={() => onViewPortfolio(hacker.username)} className="hover:underline cursor-pointer">
                    {hacker.name}
                  </button>
                </td>
                <td className="p-4 text-slate-400">{hacker.college}</td>
                <td className="p-4 text-center font-bold text-white">{hacker.hackathons}</td>
                <td className="p-4 text-center font-bold text-purple-300">{hacker.certificates}</td>
                <td className="p-4 text-center font-bold text-emerald-300">{hacker.projects}</td>
                <td className="p-4 text-right font-extrabold text-amber-400">{hacker.points} PTS</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default LeaderboardPage;

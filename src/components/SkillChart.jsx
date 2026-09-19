import React from 'react';
import { Cpu, Sparkles, BookOpen, Rocket, Target } from 'lucide-react';
import { motion } from 'framer-motion';

const SkillChart = ({ skills = [], recommendations = null }) => {
  const skillLevels = skills.map((s, idx) => ({
    name: s,
    level: 80 + ((idx * 7) % 20)
  }));

  return (
    <div className="space-y-6 font-sans text-left">
      {/* Skill Proficiency Progress Bars */}
      <div className="p-6 rounded-3xl bg-[#0B1120] border border-white/10 space-y-4">
        <div className="flex items-center gap-2 text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider">
          <Cpu className="w-4 h-4" /> Technical Proficiency Breakdown
        </div>

        <div className="space-y-3 font-mono text-xs">
          {skillLevels.map((sk) => (
            <div key={sk.name} className="space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-white font-bold">{sk.name}</span>
                <span className="text-cyan-400 text-[11px]">{sk.level}%</span>
              </div>
              <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${sk.level}%` }}
                  transition={{ duration: 1 }}
                  className="h-full bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full"
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* AI Recommendations Panel */}
      {recommendations && (
        <div className="p-6 rounded-3xl bg-[#070C1A] border border-cyan-500/30 space-y-4">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <div className="flex items-center gap-2 text-xs font-mono font-bold text-purple-400 uppercase tracking-wider">
              <Sparkles className="w-4 h-4" /> AI Career & Skill Copilot
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30 font-bold">
              AI Powered
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-mono text-xs">
            {/* Recommended Skills */}
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2">
              <span className="text-amber-400 font-bold flex items-center gap-1.5">
                <Target className="w-3.5 h-3.5" /> High-Impact Missing Skills
              </span>
              {recommendations.missingSkills?.map((m) => (
                <div key={m.name} className="p-2 rounded-xl bg-white/5 space-y-0.5">
                  <span className="text-white font-bold block">{m.name}</span>
                  <span className="text-slate-400 text-[10px] leading-tight block">{m.reason}</span>
                </div>
              ))}
            </div>

            {/* Recommended Courses */}
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2">
              <span className="text-cyan-400 font-bold flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5" /> Learning Resources
              </span>
              {recommendations.learningResources?.map((res) => (
                <a
                  key={res.title}
                  href={res.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 hover:bg-cyan-500/20 block truncate"
                >
                  <span className="font-bold block truncate">{res.title}</span>
                  <span className="text-slate-400 text-[10px] block">{res.type}</span>
                </a>
              ))}
            </div>

            {/* Career Match */}
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2">
              <span className="text-emerald-400 font-bold flex items-center gap-1.5">
                <Rocket className="w-3.5 h-3.5" /> Recommended Career Paths
              </span>
              {recommendations.careerPaths?.map((c) => (
                <div key={c.title} className="p-2 rounded-xl bg-white/5 space-y-0.5">
                  <div className="flex items-center justify-between text-white font-bold">
                    <span>{c.title}</span>
                    <span className="text-emerald-400 text-[10px]">{c.match} Match</span>
                  </div>
                  <span className="text-slate-400 text-[10px] block">Key Skill: {c.keySkill}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SkillChart;

import React from 'react';
import { Sparkles, Check, Zap } from 'lucide-react';
import { motion } from 'framer-motion';

/**
 * AI Resume & Skill Match Score Component
 */
const MatchScore = ({ score = 92, candidateSkills = [], requiredSkills = [] }) => {
  const matched = requiredSkills.filter(req =>
    candidateSkills.some(c => c.toLowerCase().includes(req.toLowerCase()) || req.toLowerCase().includes(c.toLowerCase()))
  );

  return (
    <div className="p-4 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 space-y-3 font-mono text-xs">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-cyan-300 font-bold">
          <Sparkles className="w-4 h-4 text-cyan-400" />
          <span>AI Resume Match Score</span>
        </div>
        <span className="text-base font-black text-cyan-400">{score}%</span>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-white/10 h-2 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${score}%` }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 h-full rounded-full"
        />
      </div>

      {/* Skill Overlap Breakdown */}
      {requiredSkills.length > 0 && (
        <div className="pt-2 border-t border-cyan-500/20 space-y-1">
          <div className="text-[11px] text-slate-400">Skill Overlap ({matched.length}/{requiredSkills.length}):</div>
          <div className="flex flex-wrap gap-1">
            {requiredSkills.map((req, idx) => {
              const isMatch = matched.includes(req);
              return (
                <span
                  key={idx}
                  className={`px-2 py-0.5 rounded text-[10px] flex items-center gap-1 ${
                    isMatch
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-bold'
                      : 'bg-white/5 text-slate-500 border border-white/5'
                  }`}
                >
                  {isMatch && <Check className="w-3 h-3 text-emerald-400" />}
                  {req}
                </span>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default MatchScore;

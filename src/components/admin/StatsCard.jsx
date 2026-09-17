import React from 'react';

/**
 * Reusable Metric Stats Card with Cyber Glow
 */
const StatsCard = ({ title, count, icon: Icon, color = 'cyan', subtitle }) => {
  const colorMap = {
    cyan: 'bg-cyan-500/10 border-cyan-500/20 text-cyan-400',
    yellow: 'bg-yellow-500/10 border-yellow-500/20 text-yellow-400',
    emerald: 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400',
    rose: 'bg-rose-500/10 border-rose-500/20 text-rose-400',
    purple: 'bg-purple-500/10 border-purple-500/20 text-purple-400',
    blue: 'bg-blue-500/10 border-blue-500/20 text-blue-400',
  };

  return (
    <div className={`p-4 rounded-2xl border ${colorMap[color] || colorMap.cyan} space-y-1 font-mono transition-transform hover:scale-[1.02]`}>
      <div className="text-xs font-semibold flex items-center justify-between opacity-80">
        <span>{title}</span>
        {Icon && <Icon className="w-4 h-4 shrink-0" />}
      </div>
      <div className="text-2xl font-extrabold tracking-tight text-white">{count}</div>
      {subtitle && <div className="text-[10px] text-slate-400 opacity-75">{subtitle}</div>}
    </div>
  );
};

export default StatsCard;

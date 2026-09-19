import React from 'react';

/**
 * Cyber-styled Skill Badge component with optional remove icon
 */
const SkillBadge = ({ skill, variant = 'cyan', onRemove, size = 'sm' }) => {
  const variants = {
    cyan: 'bg-cyan-500/10 border-cyan-500/30 text-cyan-300 hover:border-cyan-500/60',
    purple: 'bg-purple-500/10 border-purple-500/30 text-purple-300 hover:border-purple-500/60',
    emerald: 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300 hover:border-emerald-500/60',
    amber: 'bg-amber-500/10 border-amber-500/30 text-amber-300 hover:border-amber-500/60',
    rose: 'bg-rose-500/10 border-rose-500/30 text-rose-300 hover:border-rose-500/60'
  };

  const sizes = {
    xs: 'px-2 py-0.5 text-[10px]',
    sm: 'px-2.5 py-1 text-xs',
    md: 'px-3 py-1.5 text-sm'
  };

  const activeStyle = variants[variant] || variants.cyan;
  const sizeStyle = sizes[size] || sizes.sm;

  return (
    <span className={`inline-flex items-center gap-1 font-mono font-medium border rounded-lg backdrop-blur-md transition-all ${activeStyle} ${sizeStyle}`}>
      <span>{skill}</span>
      {onRemove && (
        <button
          type="button"
          onClick={onRemove}
          className="hover:text-white focus:outline-none ml-1 font-bold cursor-pointer"
        >
          ×
        </button>
      )}
    </span>
  );
};

export default SkillBadge;

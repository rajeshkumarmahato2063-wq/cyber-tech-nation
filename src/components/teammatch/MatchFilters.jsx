import React from 'react';
import { Search, Filter, RotateCcw } from 'lucide-react';

const MatchFilters = ({ filters, onFilterChange, onReset }) => {
  const skillsList = ['All', 'React', 'AI', 'ML', 'Web3', 'UI/UX', 'Python', 'Java', 'Next.js', 'Solidity', 'TailwindCSS'];
  const collegesList = ['All', 'IIT Bombay', 'BITS Pilani', 'Delhi Technological University', 'NIT Trichy', 'VIT Vellore', 'SRM Institute'];
  const domainsList = ['All', 'AI / Machine Learning', 'Web3 & Fintech', 'Healthcare & Biotech', 'IoT & Cyber Security', 'EdTech', 'Open Innovation'];
  const experienceList = ['All', 'Beginner', 'Intermediate', 'Advanced', 'Lead'];
  const lookingForList = ['All', 'Team', 'Members', 'Either'];

  return (
    <div className="glass-card rounded-2xl p-4 lg:p-5 border border-white/10 mb-8 space-y-4">
      {/* Search & Top Actions */}
      <div className="flex flex-col md:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-cyan-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder="Search by participant name, skill, college or keyword..."
            value={filters.search || ''}
            onChange={(e) => onFilterChange('search', e.target.value)}
            className="cyber-input pl-10 pr-4 py-2.5 text-xs lg:text-sm font-mono w-full"
          />
        </div>

        <button
          onClick={onReset}
          className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-mono text-slate-300 hover:text-white flex items-center gap-2 transition-all cursor-pointer w-full md:w-auto justify-center"
        >
          <RotateCcw className="w-3.5 h-3.5 text-cyan-400" />
          <span>Reset Filters</span>
        </button>
      </div>

      {/* Multi-Select Filters Row */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2.5 pt-2 border-t border-white/5">
        {/* Skill Filter */}
        <div>
          <label className="block text-[10px] font-mono text-slate-400 uppercase tracking-wider mb-1">
            Skill
          </label>
          <select
            value={filters.skill || 'All'}
            onChange={(e) => onFilterChange('skill', e.target.value)}
            className="cyber-input py-1.5 px-2.5 text-xs font-mono bg-[#0B1120]"
          >
            {skillsList.map((sk) => (
              <option key={sk} value={sk}>{sk}</option>
            ))}
          </select>
        </div>

        {/* Domain Filter */}
        <div>
          <label className="block text-[10px] font-mono text-slate-400 uppercase tracking-wider mb-1">
            Domain
          </label>
          <select
            value={filters.domain || 'All'}
            onChange={(e) => onFilterChange('domain', e.target.value)}
            className="cyber-input py-1.5 px-2.5 text-xs font-mono bg-[#0B1120]"
          >
            {domainsList.map((dom) => (
              <option key={dom} value={dom}>{dom}</option>
            ))}
          </select>
        </div>

        {/* Experience Filter */}
        <div>
          <label className="block text-[10px] font-mono text-slate-400 uppercase tracking-wider mb-1">
            Experience
          </label>
          <select
            value={filters.experience || 'All'}
            onChange={(e) => onFilterChange('experience', e.target.value)}
            className="cyber-input py-1.5 px-2.5 text-xs font-mono bg-[#0B1120]"
          >
            {experienceList.map((exp) => (
              <option key={exp} value={exp}>{exp}</option>
            ))}
          </select>
        </div>

        {/* College Filter */}
        <div>
          <label className="block text-[10px] font-mono text-slate-400 uppercase tracking-wider mb-1">
            College
          </label>
          <select
            value={filters.college || 'All'}
            onChange={(e) => onFilterChange('college', e.target.value)}
            className="cyber-input py-1.5 px-2.5 text-xs font-mono bg-[#0B1120]"
          >
            {collegesList.map((col) => (
              <option key={col} value={col}>{col}</option>
            ))}
          </select>
        </div>

        {/* Looking For Filter */}
        <div>
          <label className="block text-[10px] font-mono text-slate-400 uppercase tracking-wider mb-1">
            Looking For
          </label>
          <select
            value={filters.lookingFor || 'All'}
            onChange={(e) => onFilterChange('lookingFor', e.target.value)}
            className="cyber-input py-1.5 px-2.5 text-xs font-mono bg-[#0B1120]"
          >
            {lookingForList.map((lf) => (
              <option key={lf} value={lf}>{lf}</option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};

export default MatchFilters;

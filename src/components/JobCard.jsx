import React from 'react';
import { Briefcase, MapPin, DollarSign, Clock, Building, Sparkles, ArrowUpRight } from 'lucide-react';
import { motion } from 'framer-motion';

/**
 * Cyber-Themed Job Posting Card Component
 */
const JobCard = ({ job, onApply, onViewDetails, matchScore = 92 }) => {
  const {
    id,
    title = 'AI Security Research Intern',
    company_name = 'CyberShield AI',
    company_logo,
    type = 'Internship',
    location = 'Remote',
    stipend_salary = '$4,500/mo',
    required_skills = ['Python', 'PyTorch', 'Agentic AI'],
    experience_level = 'Internship',
    deadline,
    applicants_count = 38
  } = job;

  return (
    <motion.div
      whileHover={{ y: -6, transition: { duration: 0.2 } }}
      className="relative group bg-[#0B1120]/80 backdrop-blur-xl border border-white/10 hover:border-cyan-500/40 rounded-3xl p-6 flex flex-col justify-between shadow-[0_4px_25px_rgba(0,0,0,0.4)] hover:shadow-[0_0_30px_rgba(0,229,255,0.15)] transition-all duration-300"
    >
      {/* Top Type & Match Score Badge */}
      <div className="flex items-center justify-between gap-2 mb-4">
        <span className={`px-3 py-1 rounded-full text-xs font-mono font-bold ${
          type === 'Internship'
            ? 'bg-purple-500/10 border border-purple-500/30 text-purple-300'
            : 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-300'
        }`}>
          {type}
        </span>

        {matchScore && (
          <div className="flex items-center gap-1 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 font-mono text-xs font-bold shadow-[0_0_10px_rgba(0,229,255,0.2)]">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>{matchScore}% Match</span>
          </div>
        )}
      </div>

      <div>
        {/* Company Header */}
        <div className="flex items-start gap-3.5 mb-4">
          <img
            src={company_logo || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=200'}
            alt={company_name}
            className="w-12 h-12 rounded-2xl object-cover border border-cyan-500/30 group-hover:border-cyan-400 transition-colors shadow-lg shrink-0"
          />
          <div>
            <h3 className="text-base font-bold text-white group-hover:text-cyan-300 transition-colors line-clamp-1">
              {title}
            </h3>
            <p className="text-xs font-mono text-slate-400 flex items-center gap-1 mt-0.5">
              <Building className="w-3.5 h-3.5 text-cyan-400" />
              <span>{company_name}</span>
            </p>
          </div>
        </div>

        {/* Details Grid */}
        <div className="grid grid-cols-2 gap-2 mb-4 text-xs font-mono text-slate-300">
          <div className="flex items-center gap-1.5 p-2 rounded-xl bg-white/5 border border-white/5">
            <MapPin className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
            <span className="truncate">{location}</span>
          </div>
          <div className="flex items-center gap-1.5 p-2 rounded-xl bg-white/5 border border-white/5">
            <DollarSign className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span className="font-bold text-emerald-300 truncate">{stipend_salary}</span>
          </div>
        </div>

        {/* Required Skills Badges */}
        <div className="flex flex-wrap gap-1.5 mb-6">
          {required_skills.slice(0, 4).map((skill, idx) => (
            <span
              key={idx}
              className="px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-[11px] font-mono text-slate-300 group-hover:border-cyan-500/20 group-hover:text-cyan-200 transition-colors"
            >
              {skill}
            </span>
          ))}
        </div>
      </div>

      {/* Action Footer */}
      <div className="pt-4 border-t border-white/10 flex items-center justify-between gap-3">
        <div className="text-[11px] font-mono text-slate-400">
          <span>{applicants_count} applicants</span>
        </div>

        <div className="flex items-center gap-2">
          {onViewDetails && (
            <button
              onClick={() => onViewDetails(id)}
              className="px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-mono text-slate-300 font-semibold transition-all"
            >
              Details
            </button>
          )}

          <button
            onClick={() => onApply ? onApply(job) : null}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-mono text-xs font-bold shadow-[0_0_15px_rgba(0,229,255,0.3)] hover:shadow-[0_0_25px_rgba(0,229,255,0.5)] transition-all flex items-center gap-1 cursor-pointer"
          >
            <span>Apply Now</span>
            <ArrowUpRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default JobCard;

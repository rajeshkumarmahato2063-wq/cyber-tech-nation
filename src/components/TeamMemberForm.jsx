import React from 'react';
import { motion } from 'framer-motion';
import { User, Mail, GraduationCap, Trash2 } from 'lucide-react';

/**
 * Reusable TeamMemberForm Component
 * 
 * @param {Object} props
 * @param {Object} props.member - Member data object { id, name, email, department }
 * @param {number} props.index - Member index (0-based)
 * @param {Function} props.onChange - Handler for member input updates
 * @param {Function} props.onRemove - Handler to remove member
 * @param {Object} [props.errors={}] - Validation errors for this member
 */
const TeamMemberForm = ({ member, index, onChange, onRemove, errors = {} }) => {
  const memberNum = index + 2; // Member 1 is Team Leader

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="relative rounded-2xl p-6 bg-white/[0.03] border border-white/10 hover:border-cyan-500/30 transition-all duration-300 mb-6"
    >
      {/* Header: Member Title & Remove Button */}
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-white/10">
        <div className="flex items-center gap-2">
          <span className="w-7 h-7 rounded-lg bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 flex items-center justify-center text-xs font-bold font-mono">
            #{memberNum}
          </span>
          <h4 className="text-base font-bold text-white tracking-tight">
            Team Member {memberNum}
          </h4>
        </div>

        <button
          type="button"
          onClick={() => onRemove(member.id)}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 text-xs font-semibold transition-all duration-200"
        >
          <Trash2 className="w-3.5 h-3.5" />
          Remove
        </button>
      </div>

      {/* Input Fields Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Member Name */}
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
            <User className="w-3.5 h-3.5 text-cyan-400" /> Full Name <span className="text-rose-400">*</span>
          </label>
          <input
            type="text"
            placeholder="e.g. John Doe"
            value={member.name}
            onChange={(e) => onChange(member.id, 'name', e.target.value)}
            className={`cyber-input ${errors.name ? 'input-error' : ''}`}
          />
          {errors.name && (
            <span className="block text-[11px] text-rose-400 mt-1 font-medium">
              {errors.name}
            </span>
          )}
        </div>

        {/* Member Email */}
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
            <Mail className="w-3.5 h-3.5 text-cyan-400" /> Email Address <span className="text-rose-400">*</span>
          </label>
          <input
            type="email"
            placeholder="member@college.edu"
            value={member.email}
            onChange={(e) => onChange(member.id, 'email', e.target.value)}
            className={`cyber-input ${errors.email ? 'input-error' : ''}`}
          />
          {errors.email && (
            <span className="block text-[11px] text-rose-400 mt-1 font-medium">
              {errors.email}
            </span>
          )}
        </div>

        {/* Member Department */}
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
            <GraduationCap className="w-3.5 h-3.5 text-cyan-400" /> Department <span className="text-rose-400">*</span>
          </label>
          <input
            type="text"
            placeholder="e.g. Computer Science"
            value={member.department}
            onChange={(e) => onChange(member.id, 'department', e.target.value)}
            className={`cyber-input ${errors.department ? 'input-error' : ''}`}
          />
          {errors.department && (
            <span className="block text-[11px] text-rose-400 mt-1 font-medium">
              {errors.department}
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default TeamMemberForm;

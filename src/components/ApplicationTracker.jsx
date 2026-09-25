import React from 'react';
import { CheckCircle2, Clock, Calendar, Award, XCircle, FileText } from 'lucide-react';
import { motion } from 'framer-motion';

/**
 * Candidate Application Status Tracker Component
 */
const ApplicationTracker = ({ application }) => {
  const {
    id,
    jobs,
    status = 'Applied',
    match_score = 92,
    created_at,
    resume_url
  } = application || {};

  const steps = [
    { key: 'Applied', label: 'Applied', icon: FileText },
    { key: 'Under Review', label: 'Under Review', icon: Clock },
    { key: 'Shortlisted', label: 'Shortlisted', icon: CheckCircle2 },
    { key: 'Interview Scheduled', label: 'Interview', icon: Calendar },
    { key: 'Offer Extended', label: 'Offer Extended', icon: Award }
  ];

  const getStepStatus = (stepKey) => {
    if (status === 'Rejected') return 'rejected';
    const statusOrder = ['Applied', 'Under Review', 'Shortlisted', 'Interview Scheduled', 'Offer Extended'];
    const currentIdx = statusOrder.indexOf(status);
    const stepIdx = statusOrder.indexOf(stepKey);

    if (stepIdx < currentIdx) return 'completed';
    if (stepIdx === currentIdx) return 'current';
    return 'upcoming';
  };

  return (
    <div className="p-6 rounded-3xl bg-[#0B1120]/90 backdrop-blur-xl border border-white/10 space-y-6 shadow-xl">
      {/* Header Info */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
        <div>
          <h3 className="text-base font-bold text-white">
            {jobs?.title || 'Job Position'}
          </h3>
          <p className="text-xs font-mono text-cyan-400 mt-0.5">
            {jobs?.company_name || 'Company'} • <span className="text-slate-300">{jobs?.type}</span> • <span className="text-emerald-400 font-bold">{jobs?.stipend_salary}</span>
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className={`px-3 py-1 rounded-full text-xs font-mono font-bold ${
            status === 'Rejected'
              ? 'bg-rose-500/10 border border-rose-500/30 text-rose-400'
              : status === 'Offer Extended'
              ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-300'
              : 'bg-cyan-500/10 border border-cyan-500/30 text-cyan-300'
          }`}>
            Status: {status}
          </span>

          <span className="px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-300 font-mono text-xs font-bold">
            {match_score}% Match
          </span>
        </div>
      </div>

      {/* Progress Timeline Stepper */}
      {status === 'Rejected' ? (
        <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300 font-mono text-xs flex items-center gap-3">
          <XCircle className="w-5 h-5 text-rose-400 shrink-0" />
          <span>Application state updated to Rejected by hiring team. Keep applying to other top hackathon partner roles!</span>
        </div>
      ) : (
        <div className="relative py-2">
          <div className="grid grid-cols-5 gap-2 relative z-10">
            {steps.map((step) => {
              const state = getStepStatus(step.key);
              const Icon = step.icon;

              return (
                <div key={step.key} className="flex flex-col items-center text-center space-y-2">
                  <div className={`w-10 h-10 rounded-2xl flex items-center justify-center transition-all ${
                    state === 'completed'
                      ? 'bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.3)]'
                      : state === 'current'
                      ? 'bg-cyan-500/20 border-2 border-cyan-400 text-cyan-300 animate-pulse shadow-[0_0_20px_rgba(0,229,255,0.4)]'
                      : 'bg-white/5 border border-white/10 text-slate-500'
                  }`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <span className={`text-[11px] font-mono leading-tight ${
                    state === 'current' ? 'text-cyan-300 font-bold' : state === 'completed' ? 'text-slate-200' : 'text-slate-500'
                  }`}>
                    {step.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Footer details */}
      <div className="pt-2 flex items-center justify-between text-xs font-mono text-slate-400 border-t border-white/5">
        <span>Applied on {new Date(created_at).toLocaleDateString()}</span>
        {resume_url && (
          <a
            href={resume_url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-cyan-400 hover:underline"
          >
            View Submitted Resume
          </a>
        )}
      </div>
    </div>
  );
};

export default ApplicationTracker;

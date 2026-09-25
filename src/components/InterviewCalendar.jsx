import React from 'react';
import { Calendar, Clock, Video, User, CheckCircle2, XCircle } from 'lucide-react';
import { motion } from 'framer-motion';

/**
 * Interview Scheduler & Calendar Card Component
 */
const InterviewCalendar = ({ interviews = [], onCancelInterview }) => {
  if (!interviews || interviews.length === 0) {
    return (
      <div className="p-12 rounded-3xl bg-[#0B1120] border border-white/10 text-center font-mono space-y-4">
        <Calendar className="w-8 h-8 text-cyan-400 mx-auto animate-pulse" />
        <p className="text-slate-400 text-xs">No interviews scheduled yet. Recruiters will send interview invitations here upon application shortlisting.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {interviews.map((item, idx) => {
        const isCancelled = item.status === 'Cancelled';

        return (
          <motion.div
            key={item.id || idx}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`p-6 rounded-3xl border backdrop-blur-xl transition-all space-y-4 shadow-xl ${
              isCancelled
                ? 'bg-[#0B1120]/40 border-white/5 opacity-60'
                : 'bg-[#0B1120]/90 border-cyan-500/30'
            }`}
          >
            {/* Header */}
            <div className="flex items-center justify-between gap-4 border-b border-white/10 pb-4">
              <div className="flex items-center gap-2">
                <span className={`px-3 py-1 rounded-full text-xs font-mono font-bold ${
                  isCancelled
                    ? 'bg-rose-500/10 text-rose-400 border border-rose-500/30'
                    : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                }`}>
                  {isCancelled ? 'Cancelled' : 'Scheduled'}
                </span>
                <span className="text-xs font-mono text-cyan-300 font-bold">
                  {new Date(item.scheduled_at).toLocaleString()} ({item.duration_mins || 30} Mins)
                </span>
              </div>

              <div className="text-xs font-mono text-slate-400 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-cyan-400" />
                <span>Confirmed</span>
              </div>
            </div>

            {/* Candidate & Interviewer Details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <h4 className="text-base font-bold text-white">{item.job_title}</h4>
                <p className="text-xs font-mono text-slate-400 mt-0.5">
                  Candidate: <span className="text-cyan-300 font-bold">{item.candidate_name}</span>
                </p>
              </div>

              <div>
                <p className="text-xs font-mono text-slate-400">
                  Interviewer: <span className="text-white font-bold">{item.interviewer_name}</span>
                </p>
                {item.notes && (
                  <p className="text-[11px] font-mono text-slate-300 mt-1 italic line-clamp-1">
                    "{item.notes}"
                  </p>
                )}
              </div>
            </div>

            {/* Action Footer */}
            <div className="pt-4 border-t border-white/10 flex items-center justify-between gap-3">
              {!isCancelled ? (
                <>
                  <a
                    href={item.meeting_link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-5 py-2.5 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-mono text-xs font-bold flex items-center gap-2 shadow-[0_0_15px_rgba(16,185,129,0.3)] transition-all"
                  >
                    <Video className="w-4 h-4" />
                    Join Google Meet Interview
                  </a>

                  {onCancelInterview && (
                    <button
                      onClick={() => onCancelInterview(item.id)}
                      className="px-3 py-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 font-mono text-xs flex items-center gap-1"
                    >
                      <XCircle className="w-4 h-4" />
                      Cancel
                    </button>
                  )}
                </>
              ) : (
                <span className="text-xs font-mono text-slate-500">Interview session cancelled</span>
              )}
            </div>
          </motion.div>
        );
      })}
    </div>
  );
};

export default InterviewCalendar;

import React from 'react';
import { Calendar, Clock, Video, ArrowLeft, Sparkles } from 'lucide-react';
import InterviewCalendar from '../../components/InterviewCalendar';
import useJobs from '../../hooks/useJobs';

/**
 * Dedicated Interview Scheduler Page (/interviews)
 */
const InterviewsPage = ({ user, onNavigate }) => {
  const { interviews, cancelInterview } = useJobs(user);

  return (
    <div className="min-h-screen bg-[#050816] text-white pt-24 pb-20 px-4 sm:px-6 lg:px-8 max-w-[1200px] mx-auto space-y-8 font-sans">
      {/* Top Nav Back */}
      <button
        onClick={() => onNavigate ? onNavigate('/jobs') : null}
        className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-mono text-cyan-400 flex items-center gap-2 transition-all"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Jobs Hub
      </button>

      {/* Hero Banner */}
      <div className="p-8 sm:p-10 rounded-3xl bg-gradient-to-br from-[#0B1120] via-[#050816] to-[#0E2820] border border-emerald-500/30 space-y-4 shadow-2xl">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-mono text-xs font-semibold">
          <Calendar className="w-3.5 h-3.5" />
          <span>Real-Time Interview Calendar & Meeting Manager</span>
        </div>

        <h1 className="text-3xl font-extrabold text-white tracking-tight">
          Scheduled Tech Candidate Interviews
        </h1>

        <p className="text-xs sm:text-sm text-slate-300 font-mono max-w-2xl leading-relaxed">
          Access your Google Meet video links, review interviewer agenda notes, and prepare for live candidate screenings.
        </p>
      </div>

      {/* Calendar List */}
      <div className="space-y-6">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <Clock className="w-5 h-5 text-emerald-400" />
          Upcoming Scheduled Interviews ({interviews.length})
        </h2>

        <InterviewCalendar
          interviews={interviews}
          onCancelInterview={cancelInterview}
        />
      </div>
    </div>
  );
};

export default InterviewsPage;

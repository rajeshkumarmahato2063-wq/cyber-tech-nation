import React from 'react';
import { Briefcase, ArrowLeft, Clock, Sparkles } from 'lucide-react';
import ApplicationTracker from '../../components/ApplicationTracker';
import useJobs from '../../hooks/useJobs';

/**
 * Candidate Dashboard - My Applications Page (/my-applications)
 */
const ApplicationsPage = ({ user, onNavigate }) => {
  const { userApplications, loading } = useJobs(user);

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

      {/* Header Banner */}
      <div className="p-8 sm:p-10 rounded-3xl bg-gradient-to-br from-[#0B1120] via-[#050816] to-[#0D243F] border border-cyan-500/30 space-y-4 shadow-2xl">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 font-mono text-xs font-semibold">
          <Briefcase className="w-3.5 h-3.5" />
          <span>Candidate Application Command Center</span>
        </div>

        <h1 className="text-3xl font-extrabold text-white tracking-tight">
          Track Your Job Applications & Interview Invitations
        </h1>
        <p className="text-xs sm:text-sm text-slate-300 font-mono max-w-2xl leading-relaxed">
          Monitor your real-time candidate status, review recruiter feedback, and view scheduled interview slots.
        </p>
      </div>

      {/* Applications List */}
      <div className="space-y-6">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <Clock className="w-5 h-5 text-cyan-400" />
          Submitted Applications ({userApplications.length})
        </h2>

        {userApplications.length === 0 ? (
          <div className="p-12 rounded-3xl bg-[#0B1120] border border-white/10 text-center space-y-4 font-mono">
            <Sparkles className="w-8 h-8 text-cyan-400 mx-auto animate-bounce" />
            <p className="text-slate-400 text-xs">You have not submitted any job applications yet.</p>
            <button
              onClick={() => onNavigate ? onNavigate('/jobs') : null}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-xs font-bold shadow-lg"
            >
              Explore Open Tech Jobs
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {userApplications.map((app) => (
              <ApplicationTracker key={app.id} application={app} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ApplicationsPage;

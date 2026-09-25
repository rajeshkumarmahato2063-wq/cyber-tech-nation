import React, { useState, useEffect } from 'react';
import { ArrowLeft, Building, MapPin, DollarSign, Clock, CheckCircle2, Sparkles, Send, FileText, Globe, ShieldCheck, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import MatchScore from '../../components/MatchScore';
import useJobs from '../../hooks/useJobs';

/**
 * Single Job Details & Application Page (/job/:id)
 */
const JobDetailsPage = ({ jobId, user, onBack, onNavigate }) => {
  const { getJobById, applyJob, actionLoading, calculateMatchScore } = useJobs(user);
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);

  const [resumeUrl, setResumeUrl] = useState('https://zayathon.dev/resumes/candidate-resume.pdf');
  const [coverNote, setCoverNote] = useState('');
  const [portfolioUrl, setPortfolioUrl] = useState('https://zayathon.dev/profile/rajesh-mahato');
  const [submittedApp, setSubmittedApp] = useState(null);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const data = await getJobById(jobId);
      setJob(data);
      setLoading(false);
    };
    load();
  }, [jobId, getJobById]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#050816] text-white pt-24 pb-20 flex items-center justify-center font-mono text-cyan-400 text-xs">
        Loading Job Specifications...
      </div>
    );
  }

  if (!job) {
    return (
      <div className="min-h-screen bg-[#050816] text-white pt-24 pb-20 text-center font-mono space-y-4">
        <p className="text-rose-400">Job position not found.</p>
        <button
          onClick={onBack || (() => onNavigate('/jobs'))}
          className="px-4 py-2 rounded-xl bg-white/10 text-white text-xs"
        >
          Return to Jobs Hub
        </button>
      </div>
    );
  }

  const matchScore = calculateMatchScore(['React', 'JavaScript', 'Python', 'Tailwind CSS'], job.required_skills);

  const handleApply = async (e) => {
    e.preventDefault();
    if (actionLoading) return;

    const res = await applyJob({
      jobId: job.id,
      resumeUrl,
      coverNote,
      portfolioUrl,
      requiredSkills: job.required_skills
    });

    if (res) {
      setSubmittedApp(res);
    }
  };

  return (
    <div className="min-h-screen bg-[#050816] text-white pt-24 pb-20 px-4 sm:px-6 lg:px-8 max-w-[1200px] mx-auto space-y-8 font-sans">
      {/* Top Back Nav */}
      <button
        onClick={onBack || (() => onNavigate('/jobs'))}
        className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-mono text-cyan-400 flex items-center gap-2 transition-all"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Job Listings
      </button>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Job Spec & Company Overview */}
        <div className="lg:col-span-7 space-y-6">
          <div className="p-8 rounded-3xl bg-[#0B1120]/80 backdrop-blur-2xl border border-white/10 space-y-6 shadow-2xl">
            {/* Header */}
            <div className="flex items-start gap-4 pb-6 border-b border-white/10">
              <img
                src={job.company_logo || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=200'}
                alt={job.company_name}
                className="w-16 h-16 rounded-2xl object-cover border-2 border-cyan-500/40"
              />
              <div>
                <span className="px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 font-mono text-xs font-bold">
                  {job.type}
                </span>
                <h1 className="text-2xl font-extrabold text-white mt-2">{job.title}</h1>
                <p className="text-xs font-mono text-cyan-400 flex items-center gap-1 mt-0.5">
                  <Building className="w-3.5 h-3.5" />
                  <span>{job.company_name}</span>
                </p>
              </div>
            </div>

            {/* Quick Metrics */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs font-mono">
              <div className="p-3 rounded-2xl bg-white/5 border border-white/5">
                <span className="text-slate-400 block mb-1">Stipend / Salary</span>
                <span className="text-emerald-400 font-extrabold text-sm">{job.stipend_salary}</span>
              </div>
              <div className="p-3 rounded-2xl bg-white/5 border border-white/5">
                <span className="text-slate-400 block mb-1">Location</span>
                <span className="text-white font-bold">{job.location}</span>
              </div>
              <div className="p-3 rounded-2xl bg-white/5 border border-white/5">
                <span className="text-slate-400 block mb-1">Experience</span>
                <span className="text-purple-300 font-bold">{job.experience_level}</span>
              </div>
            </div>

            {/* Job Description */}
            <div>
              <h3 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider mb-2">Role Summary</h3>
              <p className="text-xs text-slate-300 font-mono leading-relaxed">{job.description}</p>
            </div>

            {/* Required Skills */}
            <div>
              <h3 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider mb-2">Required Skills & Stack</h3>
              <div className="flex flex-wrap gap-2">
                {job.required_skills?.map((skill, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-mono"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: AI Match Score & Application Form */}
        <div className="lg:col-span-5 space-y-6">
          {/* AI Match Score Widget */}
          <MatchScore
            score={matchScore}
            candidateSkills={['React', 'JavaScript', 'Python', 'Tailwind CSS']}
            requiredSkills={job.required_skills || []}
          />

          {/* Application Form */}
          {submittedApp ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="p-8 bg-[#0B1120] border border-emerald-500/40 rounded-3xl text-center space-y-4 shadow-2xl"
            >
              <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 mx-auto flex items-center justify-center">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-white">Application Submitted!</h3>
              <p className="text-xs font-mono text-slate-300">
                The hiring team at <span className="text-cyan-300 font-bold">{job.company_name}</span> has received your application.
              </p>

              <button
                onClick={() => onNavigate ? onNavigate('/my-applications') : null}
                className="w-full py-3 rounded-2xl bg-cyan-500/20 text-cyan-300 font-mono text-xs font-bold"
              >
                Track Status in Candidate Dashboard
              </button>
            </motion.div>
          ) : (
            <div className="p-6 rounded-3xl bg-[#0B1120]/90 border border-white/10 space-y-4 shadow-2xl">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Send className="w-4 h-4 text-cyan-400" />
                Submit Direct Candidate Application
              </h3>

              <form onSubmit={handleApply} className="space-y-4">
                <div>
                  <label className="block text-xs font-mono text-slate-300 mb-1">Resume Link (PDF URL)</label>
                  <input
                    type="url"
                    required
                    value={resumeUrl}
                    onChange={(e) => setResumeUrl(e.target.value)}
                    placeholder="https://..."
                    className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-xs font-mono text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-slate-300 mb-1">Portfolio / Profile Link</label>
                  <input
                    type="url"
                    value={portfolioUrl}
                    onChange={(e) => setPortfolioUrl(e.target.value)}
                    placeholder="https://..."
                    className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-xs font-mono text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-slate-300 mb-1">Cover Note & Relevant Hackathon Projects</label>
                  <textarea
                    rows="3"
                    required
                    value={coverNote}
                    onChange={(e) => setCoverNote(e.target.value)}
                    placeholder="Describe how your project submission at ZayaThon maps to this job..."
                    className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-xs font-mono text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
                  />
                </div>

                <button
                  type="submit"
                  disabled={actionLoading}
                  className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-mono text-xs font-bold shadow-[0_0_20px_rgba(0,229,255,0.3)] transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  {actionLoading ? 'Submitting Application...' : 'Submit One-Click Application'}
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default JobDetailsPage;

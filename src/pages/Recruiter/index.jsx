import React, { useState } from 'react';
import { Building2, Plus, Users, Search, Bookmark, Calendar, CheckCircle2, XCircle, ArrowLeft, Award, FileText, Send, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import useJobs from '../../hooks/useJobs';

/**
 * Recruiter Portal & Candidate Management Dashboard (/recruiter/dashboard)
 */
const RecruiterDashboard = ({ user, onNavigate }) => {
  const {
    jobs,
    recruiterApplicants,
    bookmarks,
    postJob,
    changeAppStatus,
    scheduleUserInterview,
    toggleBookmark,
    actionLoading
  } = useJobs(user);

  const [activeTab, setActiveTab] = useState('applicants'); // 'applicants' | 'post-job' | 'bookmarks'
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('All');

  // Post Job Form State
  const [jobTitle, setJobTitle] = useState('');
  const [companyName, setCompanyName] = useState('CyberShield AI');
  const [type, setType] = useState('Internship');
  const [location, setLocation] = useState('Remote');
  const [stipendSalary, setStipendSalary] = useState('$4,500/mo');
  const [skills, setSkills] = useState('React, Python, Agentic AI');
  const [experienceLevel, setExperienceLevel] = useState('Internship');
  const [description, setDescription] = useState('');

  // Interview Modal State
  const [interviewingApp, setInterviewingApp] = useState(null);
  const [interviewDate, setInterviewDate] = useState('Today at 03:00 PM');
  const [interviewNotes, setInterviewNotes] = useState('Technical architecture screening & live coding demo.');

  const handlePostJob = async (e) => {
    e.preventDefault();
    if (!jobTitle || actionLoading) return;

    await postJob({
      companyId: 'c1000000-0000-0000-0000-000000000001',
      companyName,
      companyLogo: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=200',
      title: jobTitle,
      type,
      location,
      stipendSalary,
      requiredSkills: skills.split(',').map(s => s.trim()).filter(Boolean),
      experienceLevel,
      description
    });

    setJobTitle('');
    setDescription('');
    setActiveTab('applicants');
  };

  const handleScheduleInterviewSubmit = async (e) => {
    e.preventDefault();
    if (!interviewingApp) return;

    await scheduleUserInterview({
      applicationId: interviewingApp.id,
      jobId: interviewingApp.job_id,
      candidateId: interviewingApp.applicant_id,
      jobTitle: interviewingApp.jobs?.title || interviewingApp.job_title || 'Software Role',
      candidateName: interviewingApp.applicant_name,
      scheduledAt: new Date(Date.now() + 86400 * 1000 * 2).toISOString(),
      notes: interviewNotes
    });

    setInterviewingApp(null);
  };

  const filteredApplicants = recruiterApplicants.filter(a => {
    if (selectedStatus !== 'All' && a.status !== selectedStatus) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return a.applicant_name.toLowerCase().includes(q) || (a.jobs?.title || '').toLowerCase().includes(q);
    }
    return true;
  });

  return (
    <div className="min-h-screen bg-[#050816] text-white pt-24 pb-20 px-4 sm:px-6 lg:px-8 max-w-[1440px] mx-auto space-y-10 font-sans">
      {/* Top Nav Back */}
      <button
        onClick={() => onNavigate ? onNavigate('/jobs') : null}
        className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-mono text-cyan-400 flex items-center gap-2 transition-all"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Jobs Hub
      </button>

      {/* Header Banner */}
      <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-br from-[#0B1120] via-[#050816] to-[#250F44] border border-purple-500/30 space-y-4 shadow-2xl">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-300 font-mono text-xs font-semibold">
          <Building2 className="w-3.5 h-3.5" />
          <span>Verified Recruiter & Hiring Portal</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
          Recruit Top Hackathon Candidates
        </h1>
        <p className="text-xs sm:text-sm text-slate-300 font-mono max-w-2xl leading-relaxed">
          Review participant portfolios, shortlist top 1% candidates using AI match scores, post hiring roles, and schedule interviews with 1 click.
        </p>

        {/* Tab Buttons */}
        <div className="flex items-center gap-3 pt-4 overflow-x-auto no-scrollbar">
          <button
            onClick={() => setActiveTab('applicants')}
            className={`px-5 py-2.5 rounded-2xl text-xs font-mono font-bold transition-all flex items-center gap-2 ${
              activeTab === 'applicants'
                ? 'bg-purple-500/20 border border-purple-500/40 text-purple-300 shadow-[0_0_15px_rgba(168,85,247,0.2)]'
                : 'bg-white/5 text-slate-400 hover:text-white'
            }`}
          >
            <Users className="w-4 h-4" />
            Manage Applicants ({recruiterApplicants.length})
          </button>

          <button
            onClick={() => setActiveTab('post-job')}
            className={`px-5 py-2.5 rounded-2xl text-xs font-mono font-bold transition-all flex items-center gap-2 ${
              activeTab === 'post-job'
                ? 'bg-purple-500/20 border border-purple-500/40 text-purple-300 shadow-[0_0_15px_rgba(168,85,247,0.2)]'
                : 'bg-white/5 text-slate-400 hover:text-white'
            }`}
          >
            <Plus className="w-4 h-4" />
            Post New Role
          </button>

          <button
            onClick={() => setActiveTab('bookmarks')}
            className={`px-5 py-2.5 rounded-2xl text-xs font-mono font-bold transition-all flex items-center gap-2 ${
              activeTab === 'bookmarks'
                ? 'bg-purple-500/20 border border-purple-500/40 text-purple-300 shadow-[0_0_15px_rgba(168,85,247,0.2)]'
                : 'bg-white/5 text-slate-400 hover:text-white'
            }`}
          >
            <Bookmark className="w-4 h-4 text-amber-400" />
            Bookmarked Candidates ({bookmarks.length})
          </button>
        </div>
      </div>

      {/* TAB 1: MANAGE APPLICANTS */}
      {activeTab === 'applicants' && (
        <div className="space-y-6">
          {/* Filters Bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-[#0B1120]/60 p-4 rounded-2xl border border-white/10">
            <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto no-scrollbar text-xs font-mono">
              {['All', 'Applied', 'Shortlisted', 'Interview Scheduled', 'Offer Extended'].map((st) => (
                <button
                  key={st}
                  onClick={() => setSelectedStatus(st)}
                  className={`px-3 py-1.5 rounded-xl transition-all whitespace-nowrap ${
                    selectedStatus === st
                      ? 'bg-purple-500/20 border border-purple-500/40 text-purple-300 font-bold'
                      : 'bg-white/5 text-slate-400 hover:text-white'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>

            <div className="relative w-full sm:w-64">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search candidate name..."
                className="w-full pl-9 pr-4 py-2 rounded-xl bg-white/5 border border-white/10 text-xs font-mono text-white placeholder-slate-500 focus:outline-none focus:border-purple-400"
              />
            </div>
          </div>

          {/* Applicants Table / Grid */}
          <div className="space-y-4">
            {filteredApplicants.map((app) => (
              <div
                key={app.id}
                className="p-6 rounded-3xl bg-[#0B1120]/90 backdrop-blur-xl border border-white/10 space-y-4 shadow-xl"
              >
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
                  <div className="flex items-center gap-3">
                    <img
                      src={app.applicant_photo || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100'}
                      alt={app.applicant_name}
                      className="w-12 h-12 rounded-2xl object-cover border border-purple-500/30"
                    />
                    <div>
                      <h3 className="text-base font-bold text-white flex items-center gap-2">
                        {app.applicant_name}
                        <span className="text-xs font-mono font-normal text-purple-300 bg-purple-500/10 px-2.5 py-0.5 rounded-full border border-purple-500/30">
                          {app.match_score || 92}% Match
                        </span>
                      </h3>
                      <p className="text-xs font-mono text-cyan-400">
                        Applying for: <span className="text-white font-bold">{app.jobs?.title || app.job_title}</span>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => toggleBookmark(app)}
                      className="p-2 rounded-xl bg-white/5 hover:bg-amber-500/10 border border-white/10 hover:border-amber-500/30 text-slate-400 hover:text-amber-400 transition-all text-xs"
                      title="Bookmark Candidate"
                    >
                      <Bookmark className="w-4 h-4" />
                    </button>

                    <a
                      href={app.resume_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-mono text-cyan-300 font-bold flex items-center gap-1.5"
                    >
                      <FileText className="w-3.5 h-3.5" />
                      Resume
                    </a>

                    <a
                      href={app.portfolio_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-mono text-purple-300 font-bold"
                    >
                      Portfolio
                    </a>
                  </div>
                </div>

                {/* Cover Note */}
                <div className="text-xs text-slate-300 font-mono bg-white/5 p-3 rounded-2xl border border-white/5 leading-relaxed">
                  "{app.cover_note}"
                </div>

                {/* Status & Quick Action Buttons */}
                <div className="pt-2 flex flex-wrap items-center justify-between gap-3 font-mono text-xs">
                  <div className="flex items-center gap-2">
                    <span className="text-slate-400">Current Status:</span>
                    <span className="font-bold text-cyan-300">{app.status}</span>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => changeAppStatus(app.id, 'Shortlisted', app.applicant_id, app.jobs?.title || app.job_title)}
                      className="px-3 py-1.5 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 font-bold flex items-center gap-1"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Shortlist
                    </button>

                    <button
                      onClick={() => setInterviewingApp(app)}
                      className="px-3 py-1.5 rounded-xl bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/30 text-purple-300 font-bold flex items-center gap-1"
                    >
                      <Calendar className="w-3.5 h-3.5" />
                      Schedule Interview
                    </button>

                    <button
                      onClick={() => changeAppStatus(app.id, 'Offer Extended', app.applicant_id, app.jobs?.title || app.job_title)}
                      className="px-3 py-1.5 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 text-cyan-300 font-bold flex items-center gap-1"
                    >
                      <Award className="w-3.5 h-3.5" />
                      Extend Offer
                    </button>

                    <button
                      onClick={() => changeAppStatus(app.id, 'Rejected', app.applicant_id, app.jobs?.title || app.job_title)}
                      className="px-3 py-1.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 flex items-center gap-1"
                    >
                      <XCircle className="w-3.5 h-3.5" />
                      Reject
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: POST NEW JOB FORM */}
      {activeTab === 'post-job' && (
        <div className="max-w-2xl p-8 rounded-3xl bg-[#0B1120] border border-purple-500/30 space-y-6 shadow-2xl">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Plus className="w-5 h-5 text-purple-400" />
            Publish New Hiring Role
          </h2>

          <form onSubmit={handlePostJob} className="space-y-4 font-mono text-xs">
            <div>
              <label className="block text-slate-300 mb-1">Job Title</label>
              <input
                type="text"
                required
                value={jobTitle}
                onChange={(e) => setJobTitle(e.target.value)}
                placeholder="e.g. AI Security Research Intern"
                className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-purple-400"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-300 mb-1">Role Type</label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#050816] border border-white/10 text-white focus:outline-none"
                >
                  <option value="Internship">Internship</option>
                  <option value="Full-Time">Full-Time</option>
                  <option value="Contract">Contract</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-300 mb-1">Stipend / Salary</label>
                <input
                  type="text"
                  required
                  value={stipendSalary}
                  onChange={(e) => setStipendSalary(e.target.value)}
                  placeholder="$4,500/mo or $135,000/yr"
                  className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-purple-400"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-300 mb-1">Required Skills (Comma-separated)</label>
              <input
                type="text"
                value={skills}
                onChange={(e) => setSkills(e.target.value)}
                placeholder="React, Python, Supabase, PyTorch"
                className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-purple-400"
              />
            </div>

            <div>
              <label className="block text-slate-300 mb-1">Role Description & Responsibilities</label>
              <textarea
                rows="4"
                required
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Detail role expectations and hackathon project integration..."
                className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-purple-400"
              />
            </div>

            <button
              type="submit"
              disabled={actionLoading}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold shadow-lg cursor-pointer"
            >
              {actionLoading ? 'Publishing Job...' : 'Publish Hiring Role Live'}
            </button>
          </form>
        </div>
      )}

      {/* TAB 3: BOOKMARKS */}
      {activeTab === 'bookmarks' && (
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Bookmark className="w-5 h-5 text-amber-400" />
            Saved Candidate Bookmarks ({bookmarks.length})
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {bookmarks.map((bm) => (
              <div key={bm.id} className="p-5 rounded-2xl bg-[#0B1120] border border-white/10 font-mono text-xs space-y-2">
                <div className="text-sm font-bold text-white">{bm.candidate_name}</div>
                <div className="text-slate-400">{bm.notes}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SCHEDULE INTERVIEW MODAL */}
      {interviewingApp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="p-6 rounded-3xl bg-[#0B1120] border border-purple-500/40 w-full max-w-md space-y-4 font-mono text-xs shadow-2xl"
          >
            <h3 className="text-base font-bold text-white">
              Schedule Interview with {interviewingApp.applicant_name}
            </h3>

            <form onSubmit={handleScheduleInterviewSubmit} className="space-y-3">
              <div>
                <label className="block text-slate-300 mb-1">Meeting Time Slot</label>
                <input
                  type="text"
                  value={interviewDate}
                  onChange={(e) => setInterviewDate(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white"
                />
              </div>

              <div>
                <label className="block text-slate-300 mb-1">Notes / Instructions</label>
                <textarea
                  rows="3"
                  value={interviewNotes}
                  onChange={(e) => setInterviewNotes(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setInterviewingApp(null)}
                  className="flex-1 py-2.5 rounded-xl bg-white/5 text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-purple-600 text-white font-bold"
                >
                  Send Invitation
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default RecruiterDashboard;

import React, { useState } from 'react';
import { Award, Github, Presentation, FileText, Sparkles, CheckCircle2, AlertTriangle, ArrowRight, Loader2, ArrowLeft, Star } from 'lucide-react';
import { motion } from 'framer-motion';
import useMentor from '../../hooks/useMentor';

/**
 * AI Project Review Workspace (/ai-review)
 */
const AIReviewPage = ({ user, onNavigate }) => {
  const { aiReviews, submitProjectReview, reviewLoading } = useMentor(user);

  const [teamName, setTeamName] = useState('');
  const [githubRepo, setGithubRepo] = useState('');
  const [pptLink, setPptLink] = useState('');
  const [projectDescription, setProjectDescription] = useState('');
  const [activeReview, setActiveReview] = useState(aiReviews[0] || null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!githubRepo || reviewLoading) return;

    const review = await submitProjectReview({
      teamName,
      githubRepo,
      pptLink,
      projectDescription
    });

    if (review) {
      setActiveReview(review);
    }
  };

  return (
    <div className="min-h-screen bg-[#050816] text-white pt-24 pb-20 px-4 sm:px-6 lg:px-8 max-w-[1440px] mx-auto space-y-10 font-sans">
      {/* Top Back Navigation */}
      <button
        onClick={() => onNavigate ? onNavigate('/mentors') : null}
        className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-mono text-cyan-400 flex items-center gap-2 transition-all"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Mentor Hub
      </button>

      {/* Hero Banner */}
      <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-br from-[#0B1120] via-[#050816] to-[#1E113A] border border-purple-500/30 space-y-4 shadow-[0_0_50px_rgba(168,85,247,0.15)]">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-300 font-mono text-xs font-semibold">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Automated AI Pitch & Code Audit Engine</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
          AI Project Review & Rubric Evaluator
        </h1>

        <p className="text-xs sm:text-sm text-slate-300 font-mono max-w-2xl leading-relaxed">
          Submit your GitHub repository, presentation slides, and project summary to receive instant AI scoring on presentation quality, innovation novelty, and technical architecture.
        </p>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Form Column */}
        <div className="lg:col-span-5 p-6 sm:p-8 rounded-3xl bg-[#0B1120]/90 backdrop-blur-2xl border border-white/10 space-y-6 shadow-2xl">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Award className="w-5 h-5 text-purple-400" />
            Upload Project Submission
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-mono text-slate-300 mb-1">Team / Project Name</label>
              <input
                type="text"
                required
                value={teamName}
                onChange={(e) => setTeamName(e.target.value)}
                placeholder="e.g. CyberKnights"
                className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-xs font-mono text-white placeholder-slate-500 focus:outline-none focus:border-purple-400"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-slate-300 mb-1 flex items-center gap-1.5">
                <Github className="w-3.5 h-3.5 text-cyan-400" />
                GitHub Repository URL
              </label>
              <input
                type="url"
                required
                value={githubRepo}
                onChange={(e) => setGithubRepo(e.target.value)}
                placeholder="https://github.com/username/repository"
                className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-xs font-mono text-white placeholder-slate-500 focus:outline-none focus:border-purple-400"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-slate-300 mb-1 flex items-center gap-1.5">
                <Presentation className="w-3.5 h-3.5 text-amber-400" />
                Presentation Link / PPT URL
              </label>
              <input
                type="url"
                value={pptLink}
                onChange={(e) => setPptLink(e.target.value)}
                placeholder="https://slides.google.com/..."
                className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-xs font-mono text-white placeholder-slate-500 focus:outline-none focus:border-purple-400"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-slate-300 mb-1 flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-emerald-400" />
                Project Description & Innovation Overview
              </label>
              <textarea
                rows="4"
                required
                value={projectDescription}
                onChange={(e) => setProjectDescription(e.target.value)}
                placeholder="Explain the problem statement, technical stack, agentic features, and real-world impact..."
                className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-xs font-mono text-white placeholder-slate-500 focus:outline-none focus:border-purple-400"
              />
            </div>

            <button
              type="submit"
              disabled={reviewLoading}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-mono text-xs font-bold shadow-[0_0_20px_rgba(168,85,247,0.3)] transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              {reviewLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-purple-200" />
                  Analyzing Code & Pitch Deck...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  Generate AI Project Review
                </>
              )}
            </button>
          </form>
        </div>

        {/* Right Output Column */}
        <div className="lg:col-span-7 space-y-6">
          {activeReview ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              className="p-8 rounded-3xl bg-[#0B1120]/90 border border-purple-500/40 space-y-6 shadow-2xl"
            >
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div>
                  <h3 className="text-xl font-bold text-white">{activeReview.team_name}</h3>
                  <a
                    href={activeReview.github_repo}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs font-mono text-cyan-400 hover:underline flex items-center gap-1 mt-1"
                  >
                    <Github className="w-3.5 h-3.5" />
                    {activeReview.github_repo}
                  </a>
                </div>

                <div className="text-right">
                  <div className="text-2xl font-black text-purple-300 font-mono">
                    {activeReview.overall_score} / 100
                  </div>
                  <div className="text-[10px] font-mono text-slate-400 uppercase">Overall AI Rubric Score</div>
                </div>
              </div>

              {/* Score Breakdown Bars */}
              <div className="grid grid-cols-2 gap-4 font-mono text-xs">
                <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
                  <div className="text-slate-400 mb-1">Presentation Score</div>
                  <div className="text-lg font-bold text-amber-400">{activeReview.presentation_score} / 100</div>
                </div>

                <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
                  <div className="text-slate-400 mb-1">Innovation Score</div>
                  <div className="text-lg font-bold text-cyan-400">{activeReview.innovation_score} / 100</div>
                </div>
              </div>

              {/* Strengths */}
              <div className="space-y-2">
                <h4 className="text-xs font-mono text-emerald-400 font-bold uppercase tracking-wider flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4" />
                  Identified Strengths
                </h4>
                <div className="space-y-2">
                  {activeReview.strengths?.map((str, idx) => (
                    <div key={idx} className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs font-mono text-slate-200">
                      {str}
                    </div>
                  ))}
                </div>
              </div>

              {/* Weaknesses & Gaps */}
              <div className="space-y-2">
                <h4 className="text-xs font-mono text-rose-400 font-bold uppercase tracking-wider flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4" />
                  Areas for Improvement
                </h4>
                <div className="space-y-2">
                  {activeReview.weaknesses?.map((wk, idx) => (
                    <div key={idx} className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-xs font-mono text-slate-200">
                      {wk}
                    </div>
                  ))}
                </div>
              </div>

              {/* Actionable Suggestions */}
              <div className="space-y-2">
                <h4 className="text-xs font-mono text-cyan-300 font-bold uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4" />
                  Actionable Mentor Recommendations
                </h4>
                <div className="space-y-2">
                  {activeReview.improvement_suggestions?.map((sug, idx) => (
                    <div key={idx} className="p-3 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-xs font-mono text-slate-200 flex items-start gap-2">
                      <ArrowRight className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
                      <span>{sug}</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          ) : (
            <div className="p-12 rounded-3xl bg-[#0B1120] border border-white/10 text-center font-mono space-y-4">
              <Sparkles className="w-8 h-8 text-purple-400 mx-auto animate-bounce" />
              <p className="text-slate-400 text-xs">Fill out the project details on the left to generate your instant AI evaluation report.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AIReviewPage;

import React, { useState } from 'react';
import { Star, CheckCircle, MessageSquare, ArrowRight, Send, Award, ListChecks } from 'lucide-react';
import { motion } from 'framer-motion';

/**
 * Mentor Feedback Card & Submission Component
 */
const FeedbackCard = ({
  feedbackList = [],
  onSubmitFeedback,
  isMentorOrAdmin = false
}) => {
  const [projectTitle, setProjectTitle] = useState('');
  const [comments, setComments] = useState('');
  const [rating, setRating] = useState(5.0);
  const [suggestions, setSuggestions] = useState('');
  const [nextSteps, setNextSteps] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!comments.trim()) return;

    if (onSubmitFeedback) {
      onSubmitFeedback({
        projectTitle,
        comments,
        rating: Number(rating),
        suggestions: suggestions.split('\n').filter(Boolean),
        nextSteps: nextSteps.split('\n').filter(Boolean)
      });
    }

    setComments('');
    setSuggestions('');
    setNextSteps('');
  };

  const sampleFeedback = feedbackList.length > 0 ? feedbackList : [
    {
      id: 'fb-1',
      mentor_name: 'Dr. Alex Mercer',
      mentor_company: 'OpenAI',
      project_title: 'AegisAI - Autonomous Incident Response Engine',
      rating: 4.9,
      comments: 'Outstanding agentic AI architecture! The state machine recovery mechanism shows enterprise-grade robustness under extreme load tests.',
      suggestions: [
        'Add fallback webhooks for legacy notification channels.',
        'Benchmark inference speed under 100 concurrent websocket connections.'
      ],
      next_steps: [
        'Finalize live video demo walkthrough.',
        'Deploy production build to Vercel/Supabase Edge.'
      ],
      created_at: '2 hours ago'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Mentor Submission Form (If user is mentor/admin) */}
      {isMentorOrAdmin && (
        <div className="p-6 bg-[#0B1120] border border-cyan-500/30 rounded-3xl space-y-4 shadow-xl">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Award className="w-5 h-5 text-cyan-400" />
            Submit Official Mentor Feedback
          </h3>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-mono text-slate-300 mb-1">Project Name</label>
              <input
                type="text"
                required
                value={projectTitle}
                onChange={(e) => setProjectTitle(e.target.value)}
                placeholder="Team / Project Title"
                className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-xs font-mono text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-slate-300 mb-1">Detailed Comments</label>
              <textarea
                rows="3"
                required
                value={comments}
                onChange={(e) => setComments(e.target.value)}
                placeholder="Provide constructive assessment of project execution and design..."
                className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-xs font-mono text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-mono text-slate-300 mb-1">Suggestions (1 per line)</label>
                <textarea
                  rows="2"
                  value={suggestions}
                  onChange={(e) => setSuggestions(e.target.value)}
                  placeholder="Suggested code or architectural improvements..."
                  className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-xs font-mono text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-300 mb-1">Next Action Steps (1 per line)</label>
                <textarea
                  rows="2"
                  value={nextSteps}
                  onChange={(e) => setNextSteps(e.target.value)}
                  placeholder="Immediate priority tasks before pitch demo..."
                  className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-xs font-mono text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
                />
              </div>
            </div>

            <button
              type="submit"
              className="py-3 px-6 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-mono text-xs font-bold shadow-[0_0_15px_rgba(0,229,255,0.3)] hover:shadow-[0_0_25px_rgba(0,229,255,0.5)] transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Send className="w-4 h-4" />
              Publish Feedback to Team
            </button>
          </form>
        </div>
      )}

      {/* Published Feedback List */}
      <div className="space-y-4">
        {sampleFeedback.map((fb, idx) => (
          <motion.div
            key={fb.id || idx}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-6 bg-[#0B1120]/80 backdrop-blur-xl border border-white/10 rounded-3xl shadow-xl space-y-4"
          >
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div>
                <h4 className="text-base font-bold text-white flex items-center gap-2">
                  {fb.project_title}
                </h4>
                <p className="text-xs font-mono text-cyan-400 mt-0.5">
                  Reviewed by <span className="font-bold text-white">{fb.mentor_name}</span> ({fb.mentor_company})
                </p>
              </div>

              <div className="flex items-center gap-1 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 font-mono text-xs font-bold">
                <Star className="w-3.5 h-3.5 fill-amber-400" />
                <span>{fb.rating} / 5.0</span>
              </div>
            </div>

            {/* Comments */}
            <div className="text-xs text-slate-300 font-mono leading-relaxed bg-white/5 p-4 rounded-2xl border border-white/5">
              <MessageSquare className="w-4 h-4 text-cyan-400 mb-2 inline-block mr-2" />
              "{fb.comments}"
            </div>

            {/* Suggestions & Next Steps */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              {fb.suggestions && fb.suggestions.length > 0 && (
                <div className="space-y-2">
                  <h5 className="text-xs font-mono text-cyan-300 font-bold flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5" />
                    Key Suggestions
                  </h5>
                  <ul className="space-y-1.5">
                    {fb.suggestions.map((sug, sIdx) => (
                      <li key={sIdx} className="text-[11px] font-mono text-slate-300 flex items-start gap-2">
                        <ArrowRight className="w-3 h-3 text-cyan-400 shrink-0 mt-0.5" />
                        <span>{sug}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {fb.next_steps && fb.next_steps.length > 0 && (
                <div className="space-y-2">
                  <h5 className="text-xs font-mono text-emerald-400 font-bold flex items-center gap-1.5">
                    <ListChecks className="w-3.5 h-3.5" />
                    Actionable Next Steps
                  </h5>
                  <ul className="space-y-1.5">
                    {fb.next_steps.map((ns, nIdx) => (
                      <li key={nIdx} className="text-[11px] font-mono text-slate-300 flex items-start gap-2">
                        <CheckCircle className="w-3 h-3 text-emerald-400 shrink-0 mt-0.5" />
                        <span>{ns}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default FeedbackCard;

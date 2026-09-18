import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Award, FileText, Presentation, Users, RefreshCw, ShieldAlert, CheckCircle2 } from 'lucide-react';
import { getAssignedTeamsForJudge } from '../services/judge';
import JudgeScoreCard from './JudgeScoreCard';

/**
 * ZAYATHON Judge Portal Dashboard Modal
 */
const JudgePortal = ({ isOpen, onClose, user }) => {
  const [assignedList, setAssignedList] = useState([]);
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen && user?.id) {
      loadAssignedTeams();
    }
  }, [isOpen, user]);

  const loadAssignedTeams = async () => {
    if (!user?.id) return;
    setLoading(true);
    try {
      const list = await getAssignedTeamsForJudge(user.id);
      setAssignedList(list);
      if (list.length > 0 && !selectedAssignment) {
        setSelectedAssignment(list[0]);
      }
    } catch (err) {
      console.warn('Judge portal load error:', err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  const currentReg = selectedAssignment?.registration;
  const team = currentReg?.teams;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/85 backdrop-blur-xl overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="relative w-full max-w-5xl bg-[#070C1A] border border-cyan-500/40 rounded-3xl p-6 sm:p-8 shadow-[0_0_60px_rgba(0,229,255,0.2)] my-8 max-h-[90vh] flex flex-col font-sans"
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-5 border-b border-white/10 shrink-0">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
                <Award className="w-7 h-7" />
              </div>
              <div>
                <h2 className="text-2xl font-bold font-mono tracking-tight text-white flex items-center gap-2">
                  Judge Command Center
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 font-semibold">
                    Judge Portal
                  </span>
                </h2>
                <p className="text-xs text-slate-400">Evaluate assigned hacker projects, slide decks & scoring rubrics</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={loadAssignedTeams}
                className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-cyan-400 hover:bg-cyan-500/10 transition-all"
                title="Refresh Assigned Teams"
              >
                <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
              </button>
              <button
                onClick={onClose}
                className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-slate-400 hover:text-white hover:bg-white/10 transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Body Content */}
          {loading ? (
            <div className="py-16 text-center text-slate-400 font-mono text-sm flex items-center justify-center gap-2">
              <RefreshCw className="w-5 h-5 animate-spin text-cyan-400" /> Fetching assigned projects...
            </div>
          ) : assignedList.length === 0 ? (
            <div className="py-16 text-center space-y-4 font-mono">
              <ShieldAlert className="w-12 h-12 text-slate-500 mx-auto" />
              <h3 className="text-lg font-bold text-white">No Teams Assigned Yet</h3>
              <p className="text-xs text-slate-400 max-w-md mx-auto">
                Organizers are currently mapping project submissions to jury panels. Please check back shortly.
              </p>
            </div>
          ) : (
            <div className="flex-1 overflow-hidden grid grid-cols-1 lg:grid-cols-3 gap-6 pt-5">
              {/* Left Column: Assigned Teams List */}
              <div className="space-y-3 font-mono text-xs overflow-y-auto pr-1 border-r border-white/10">
                <h3 className="font-bold text-cyan-400 uppercase tracking-wider text-[11px]">Assigned Projects ({assignedList.length})</h3>
                {assignedList.map((item) => {
                  const isSelected = selectedAssignment?.assignmentId === item.assignmentId;
                  const isEvaluated = Boolean(item.scores);

                  return (
                    <button
                      key={item.assignmentId}
                      onClick={() => setSelectedAssignment(item)}
                      className={`w-full text-left p-4 rounded-2xl border transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-cyan-500/15 border-cyan-400 text-white shadow-[0_0_20px_rgba(0,229,255,0.2)]'
                          : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-sm text-white truncate">{item.registration?.teams?.team_name || 'Team Participant'}</span>
                        {isEvaluated ? (
                          <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold">
                            {item.scores.total_score} pts
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30 text-[10px]">
                            Pending
                          </span>
                        )}
                      </div>

                      <div className="text-[11px] text-cyan-400 font-semibold mt-1">{item.registration?.innovation_domain}</div>
                      <div className="text-[10px] text-slate-400 truncate mt-0.5">{item.registration?.project_title}</div>
                    </button>
                  );
                })}
              </div>

              {/* Right 2 Columns: Project Details & Scorecard */}
              {currentReg && (
                <div className="lg:col-span-2 overflow-y-auto space-y-5 pr-1 font-mono text-xs">
                  {/* Team & Track Banner */}
                  <div className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 font-bold uppercase text-[10px]">
                        {currentReg.innovation_domain}
                      </span>
                      <span className="text-slate-400 text-[11px]">College: <strong className="text-white">{team?.college || 'N/A'}</strong></span>
                    </div>

                    <h3 className="text-xl font-bold text-white tracking-tight">{currentReg.project_title}</h3>
                    <p className="text-slate-300 leading-relaxed text-xs">{currentReg.project_description}</p>
                  </div>

                  {/* Artifact Links */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {currentReg.proposal_url ? (
                      <a
                        href={currentReg.proposal_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-3.5 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center gap-3 text-cyan-300 hover:bg-cyan-500/20 transition-all"
                      >
                        <FileText className="w-5 h-5 text-cyan-400 shrink-0" />
                        <div className="truncate">
                          <span className="font-bold block">View Proposal PDF</span>
                          <span className="text-[10px] text-slate-400 underline">Open in new tab</span>
                        </div>
                      </a>
                    ) : (
                      <div className="p-3.5 rounded-xl bg-white/5 text-slate-500 flex items-center gap-2">
                        <FileText className="w-4 h-4" /> No proposal attached
                      </div>
                    )}

                    {currentReg.ppt_url ? (
                      <a
                        href={currentReg.ppt_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-3.5 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center gap-3 text-purple-300 hover:bg-purple-500/20 transition-all"
                      >
                        <Presentation className="w-5 h-5 text-purple-400 shrink-0" />
                        <div className="truncate">
                          <span className="font-bold block">View Slide Deck (PPT)</span>
                          <span className="text-[10px] text-slate-400 underline">Open presentation</span>
                        </div>
                      </a>
                    ) : (
                      <div className="p-3.5 rounded-xl bg-white/5 text-slate-500 flex items-center gap-2">
                        <Presentation className="w-4 h-4" /> No PPT attached
                      </div>
                    )}
                  </div>

                  {/* Integrated Scorecard */}
                  <JudgeScoreCard
                    judgeId={user.id}
                    registration={currentReg}
                    existingScore={selectedAssignment.scores}
                    onScoreSubmitted={loadAssignedTeams}
                  />
                </div>
              )}
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default JudgePortal;

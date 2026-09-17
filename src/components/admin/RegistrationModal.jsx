import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Check, FileText, Presentation, Users, ShieldCheck } from 'lucide-react';

/**
 * Registration Details Inspection Modal
 */
const RegistrationModal = ({ registration, isOpen, onClose, onStatusUpdate }) => {
  if (!isOpen || !registration) return null;

  const team = registration.teams;
  const members = team?.team_members || [];

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="relative w-full max-w-2xl bg-[#0B1120] border border-cyan-500/40 rounded-3xl p-6 sm:p-8 shadow-[0_0_60px_rgba(0,229,255,0.25)] my-8 font-mono text-xs"
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-2 rounded-xl bg-white/5 border border-white/10 text-slate-400 hover:text-white hover:bg-white/10 transition-all"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Modal Header */}
          <div className="border-b border-white/10 pb-4 mb-5">
            <span className="text-[10px] text-cyan-400 font-bold uppercase tracking-widest block mb-1">
              Registration Inspection
            </span>
            <h3 className="text-xl font-bold text-white">{registration.project_title}</h3>
            <div className="text-cyan-300 text-xs mt-1">{registration.innovation_domain}</div>
          </div>

          <div className="space-y-4">
            {/* Team Summary */}
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2">
              <div className="text-cyan-400 font-bold uppercase tracking-wider text-[11px]">Team Overview</div>
              <div className="grid grid-cols-2 gap-2 text-slate-300">
                <div>
                  <span className="text-slate-500 block text-[10px]">Team Name:</span>
                  <span className="font-bold text-white">{team?.team_name || 'Individual'}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px]">College:</span>
                  <span className="font-bold text-white">{team?.college || 'N/A'}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px]">Current Status:</span>
                  <span className="font-bold uppercase text-yellow-400">{registration.status}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px]">Submitted:</span>
                  <span className="text-slate-300">{new Date(registration.created_at).toLocaleString()}</span>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-1">
              <div className="text-cyan-400 font-bold uppercase tracking-wider text-[11px]">Project Description</div>
              <p className="text-slate-300 text-xs leading-relaxed">{registration.project_description}</p>
            </div>

            {/* Uploaded Documents */}
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-3">
              <div className="text-purple-400 font-bold uppercase tracking-wider text-[11px]">Attached Documents</div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {registration.proposal_url ? (
                  <a
                    href={registration.proposal_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center gap-3 text-cyan-300 hover:bg-cyan-500/20 transition-all"
                  >
                    <FileText className="w-5 h-5 text-cyan-400 shrink-0" />
                    <div>
                      <span className="font-bold block">Proposal PDF</span>
                      <span className="text-[10px] text-slate-400 underline">Open Document</span>
                    </div>
                  </a>
                ) : (
                  <div className="p-3 rounded-xl bg-white/5 text-slate-500">No proposal PDF attached</div>
                )}

                {registration.ppt_url ? (
                  <a
                    href={registration.ppt_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center gap-3 text-purple-300 hover:bg-purple-500/20 transition-all"
                  >
                    <Presentation className="w-5 h-5 text-purple-400 shrink-0" />
                    <div>
                      <span className="font-bold block">Presentation PPT</span>
                      <span className="text-[10px] text-slate-400 underline">Open Presentation</span>
                    </div>
                  </a>
                ) : (
                  <div className="p-3 rounded-xl bg-white/5 text-slate-500">No PPT attached</div>
                )}
              </div>
            </div>

            {/* Team Members Roster */}
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2">
              <div className="text-cyan-400 font-bold uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                <Users className="w-4 h-4" /> Team Roster ({members.length} Members)
              </div>
              <div className="space-y-1.5">
                {members.map((m) => (
                  <div key={m.id} className="p-2.5 rounded-xl bg-white/5 flex items-center justify-between text-xs">
                    <div>
                      <span className="font-bold text-white">{m.full_name}</span>
                      <span className="text-slate-400 text-[11px] block">{m.email} • {m.phone}</span>
                    </div>
                    <span className="text-purple-400 text-[11px]">{m.department} ({m.year})</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Quick Action Footer */}
          <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between">
            <span className="text-slate-400 text-[11px]">Change Status:</span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  onStatusUpdate(registration.id, 'approved');
                  onClose();
                }}
                className="px-4 py-2 rounded-xl bg-emerald-500 text-white font-bold hover:bg-emerald-600 transition-colors flex items-center gap-1.5"
              >
                <Check className="w-4 h-4" /> Approve Entry
              </button>
              <button
                onClick={() => {
                  onStatusUpdate(registration.id, 'rejected');
                  onClose();
                }}
                className="px-4 py-2 rounded-xl bg-rose-500 text-white font-bold hover:bg-rose-600 transition-colors flex items-center gap-1.5"
              >
                <X className="w-4 h-4" /> Reject Entry
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default RegistrationModal;

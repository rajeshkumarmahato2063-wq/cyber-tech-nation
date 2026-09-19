import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Flag, AlertTriangle, CheckCircle2 } from 'lucide-react';

const REASON_OPTIONS = ['Fake Profile', 'Spam', 'Harassment', 'Inappropriate Content', 'Other'];

const ReportModal = ({ isOpen, onClose, targetProfile, targetTeam, onSubmitReport, user }) => {
  const [reason, setReason] = useState('Fake Profile');
  const [details, setDetails] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (onSubmitReport) {
        await onSubmitReport({
          reporter_id: user?.id || 'u1',
          reported_user: targetProfile?.user_id || targetProfile?.id,
          team_id: targetTeam?.id,
          reason,
          details
        });
      }
      setSubmitted(true);
      setTimeout(() => {
        setSubmitted(false);
        onClose();
      }, 1200);
    } catch (err) {
      console.error('Report submission error:', err);
    } finally {
      setSubmitting(false);
    }
  };

  const targetName = targetProfile?.full_name || targetTeam?.team_name || 'Item';

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="glass-card rounded-2xl border border-white/10 w-full max-w-lg p-6 relative shadow-2xl"
        >
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          {submitted ? (
            <div className="py-8 text-center space-y-3">
              <CheckCircle2 className="w-16 h-16 text-emerald-400 mx-auto animate-bounce" />
              <h3 className="font-title font-bold text-xl text-white">Report Received</h3>
              <p className="text-xs text-slate-300 font-mono">
                ZayaThon platform admins will investigate this report immediately.
              </p>
            </div>
          ) : (
            <>
              <div className="flex items-center gap-2 mb-4">
                <Flag className="w-5 h-5 text-rose-400" />
                <h3 className="font-title font-bold text-lg text-white">
                  Report <span className="text-rose-300">{targetName}</span>
                </h3>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-mono text-slate-300 mb-1">Reason for Report *</label>
                  <select
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    className="cyber-input py-2 text-xs font-sans bg-[#0B1120]"
                  >
                    {REASON_OPTIONS.map(r => (
                      <option key={r} value={r}>{r}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-mono text-slate-300 mb-1">Additional Details</label>
                  <textarea
                    rows={4}
                    value={details}
                    onChange={(e) => setDetails(e.target.value)}
                    placeholder="Provide specific information regarding why this profile/team violates hackathon rules..."
                    className="cyber-input py-2.5 px-3 text-xs font-sans resize-none"
                  />
                </div>

                <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-[11px] font-mono text-rose-300 flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5 text-rose-400" />
                  <span>
                    Submitting false reports may result in account penalties.
                  </span>
                </div>

                <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-mono text-slate-300"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="px-5 py-2 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 border border-rose-500/40 text-rose-300 text-xs font-mono font-bold flex items-center gap-1.5"
                  >
                    <Flag className="w-3.5 h-3.5" />
                    <span>{submitting ? 'Submitting...' : 'Submit Report'}</span>
                  </button>
                </div>
              </form>
            </>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default ReportModal;

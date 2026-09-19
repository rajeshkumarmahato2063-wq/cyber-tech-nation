import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, CheckCircle2, XCircle, AlertCircle } from 'lucide-react';

const JoinRequestModal = ({ isOpen, onClose, targetProfile, targetTeam, onSubmitRequest }) => {
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (onSubmitRequest) {
        await onSubmitRequest({
          targetProfile,
          targetTeam,
          message
        });
      }
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        setMessage('');
        onClose();
      }, 1200);
    } catch (err) {
      console.error('Request error:', err);
    } finally {
      setSubmitting(false);
    }
  };

  const recipientName = targetProfile?.full_name || targetTeam?.team_name || 'Teammate';

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="glass-card rounded-2xl border border-white/10 w-full max-w-lg p-6 relative overflow-hidden shadow-2xl"
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          {success ? (
            <div className="py-8 text-center space-y-3">
              <CheckCircle2 className="w-16 h-16 text-emerald-400 mx-auto animate-bounce" />
              <h3 className="font-title font-bold text-xl text-white">Join Request Sent!</h3>
              <p className="text-xs text-slate-300 font-mono">
                {recipientName} has been notified. Check your requests dashboard for updates.
              </p>
            </div>
          ) : (
            <>
              <div className="flex items-center gap-2 mb-4">
                <Send className="w-5 h-5 text-cyan-400" />
                <h3 className="font-title font-bold text-lg text-white">
                  Send Join Request to <span className="text-cyan-300">{recipientName}</span>
                </h3>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-mono text-slate-300 mb-1.5">
                    Introductory Note / Message (Optional)
                  </label>
                  <textarea
                    rows={4}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Hi! I saw your profile/team on ZayaThon and would love to collaborate..."
                    className="cyber-input py-2.5 px-3 text-xs font-sans resize-none"
                  />
                </div>

                <div className="p-3 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-[11px] font-mono text-cyan-300 flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>
                    Sending a request will open real-time notifications for both participants.
                  </span>
                </div>

                <div className="flex items-center justify-end gap-3 pt-3 border-t border-white/10">
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
                    className="neon-button px-5 py-2 rounded-xl text-xs font-mono font-bold text-white flex items-center gap-1.5"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>{submitting ? 'Sending...' : 'Send Request'}</span>
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

export default JoinRequestModal;

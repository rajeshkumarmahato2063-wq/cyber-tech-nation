import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Lock, Mail, User, Phone, LogIn, UserPlus, KeyRound, Sparkles } from 'lucide-react';
import Button from './ui/Button';
import { authService } from '../services/auth';

/**
 * Cyber-Tech Auth Modal (Login / Sign Up / Forgot Password)
 */
const AuthModal = ({ isOpen, onClose, initialMode = 'login', onAuthSuccess }) => {
  const [mode, setMode] = useState(initialMode); // 'login' | 'signup' | 'forgot'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState('user');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');
    setSuccessMsg('');

    try {
      if (mode === 'signup') {
        if (!fullName.trim() || !email.trim() || !password.trim()) {
          throw new Error('Please fill in all required fields.');
        }
        await authService.signUp({ email, password, fullName, phone, role });
        setSuccessMsg('Account created successfully! Check your email for verification.');
        setTimeout(() => {
          if (onAuthSuccess) onAuthSuccess();
          onClose();
        }, 1500);
      } else if (mode === 'login') {
        if (!email.trim() || !password.trim()) {
          throw new Error('Please enter your email and password.');
        }
        const data = await authService.signIn({ email, password });
        setSuccessMsg(`Welcome back, ${data.profile?.full_name || email}!`);
        setTimeout(() => {
          if (onAuthSuccess) onAuthSuccess(data);
          onClose();
        }, 1200);
      } else if (mode === 'forgot') {
        if (!email.trim()) {
          throw new Error('Please enter your account email address.');
        }
        await authService.resetPassword(email);
        setSuccessMsg('Password reset link sent to your email.');
      }
    } catch (err) {
      setErrorMsg(err.message || 'Authentication failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="relative w-full max-w-md bg-[#0B1120]/95 border border-cyan-500/30 rounded-3xl p-6 sm:p-8 shadow-[0_0_50px_rgba(0,229,255,0.25)] overflow-hidden"
        >
          {/* Top Glow Orb */}
          <div className="absolute -top-24 -right-24 w-48 h-48 bg-cyan-500/20 rounded-full blur-3xl pointer-events-none" />

          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-2 rounded-xl bg-white/5 border border-white/10 text-slate-400 hover:text-white hover:bg-white/10 transition-all"
            aria-label="Close Auth Modal"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Header */}
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 rounded-2xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 shadow-[0_0_20px_rgba(0,229,255,0.3)]">
              {mode === 'signup' ? (
                <UserPlus className="w-6 h-6" />
              ) : mode === 'forgot' ? (
                <KeyRound className="w-6 h-6" />
              ) : (
                <LogIn className="w-6 h-6" />
              )}
            </div>
            <div>
              <h3 className="text-xl font-bold font-mono tracking-tight text-white flex items-center gap-2">
                {mode === 'signup' ? 'Create Account' : mode === 'forgot' ? 'Reset Password' : 'Hacker Login'}
                <Sparkles className="w-4 h-4 text-cyan-400" />
              </h3>
              <p className="text-xs text-slate-400">
                {mode === 'signup'
                  ? 'Join ZAYATHON 2026 Developer Portal'
                  : mode === 'forgot'
                  ? 'We will send a reset link to your email'
                  : 'Access your team dashboard & project status'}
              </p>
            </div>
          </div>

          {/* Alerts */}
          {errorMsg && (
            <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-mono">
              ⚠️ {errorMsg}
            </div>
          )}
          {successMsg && (
            <div className="mb-4 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-mono">
              ✅ {successMsg}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'signup' && (
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Full Name</label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    required
                    placeholder="Alex Morgan"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="cyber-input pl-10"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="email"
                  required
                  placeholder="hacker@zayathon.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="cyber-input pl-10"
                />
              </div>
            </div>

            {mode !== 'forgot' && (
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="password"
                    required
                    placeholder="••••••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="cyber-input pl-10"
                  />
                </div>
              </div>
            )}

            {mode === 'signup' && (
              <>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Phone Number (Optional)</label>
                  <div className="relative">
                    <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="tel"
                      placeholder="+91 9876543210"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="cyber-input pl-10"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Account Role</label>
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="cyber-input"
                  >
                    <option value="user">Participant (Hacker)</option>
                    <option value="organizer">Organizer</option>
                    <option value="admin">Administrator</option>
                  </select>
                </div>
              </>
            )}

            <Button
              type="submit"
              disabled={loading}
              variant="primary"
              className="w-full justify-center mt-2 !py-3"
            >
              {loading
                ? 'Processing...'
                : mode === 'signup'
                ? 'Create Hacker Account'
                : mode === 'forgot'
                ? 'Send Reset Link'
                : 'Sign In'}
            </Button>
          </form>

          {/* Mode Switchers */}
          <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between text-xs text-slate-400">
            {mode === 'login' ? (
              <>
                <button
                  type="button"
                  onClick={() => setMode('forgot')}
                  className="hover:text-cyan-400 transition-colors"
                >
                  Forgot Password?
                </button>
                <button
                  type="button"
                  onClick={() => setMode('signup')}
                  className="text-cyan-400 font-semibold hover:underline"
                >
                  Sign Up Free
                </button>
              </>
            ) : (
              <button
                type="button"
                onClick={() => setMode('login')}
                className="text-cyan-400 font-semibold hover:underline mx-auto"
              >
                ← Back to Login
              </button>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default AuthModal;

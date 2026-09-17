import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, Trophy, Copy, ArrowRight, X, Sparkles } from 'lucide-react';

/**
 * Reusable Canvas Confetti Component
 */
const ConfettiCanvas = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const colors = ['#00E5FF', '#2563EB', '#7C3AED', '#FFD700', '#10B981'];
    const particles = [];

    for (let i = 0; i < 120; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height - canvas.height,
        size: Math.random() * 8 + 4,
        color: colors[Math.floor(Math.random() * colors.length)],
        speedY: Math.random() * 3 + 2,
        speedX: Math.random() * 2 - 1,
        rotation: Math.random() * 360,
        rotationSpeed: Math.random() * 6 - 3
      });
    }

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach((p) => {
        p.y += p.speedY;
        p.x += p.speedX;
        p.rotation += p.rotationSpeed;

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rotation * Math.PI) / 180);
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
        ctx.restore();

        if (p.y > canvas.height) {
          p.y = -10;
          p.x = Math.random() * canvas.width;
        }
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-50"
    />
  );
};

/**
 * SuccessModal Component
 * 
 * @param {Object} props
 * @param {boolean} props.isOpen
 * @param {Function} props.onClose
 * @param {Object} props.registrationData
 */
const SuccessModal = ({ isOpen, onClose, registrationData }) => {
  const [copied, setCopied] = React.useState(false);

  if (!isOpen) return null;

  const handleCopyId = () => {
    if (registrationData?.regId) {
      navigator.clipboard.writeText(registrationData.regId);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
        {/* Confetti Animation Effect */}
        <ConfettiCanvas />

        {/* Modal Backdrop Overlay */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-[#050816]/80 backdrop-blur-md"
        />

        {/* Modal Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.85, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.85, y: 30 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className={`
            relative w-full max-w-lg rounded-3xl p-8
            bg-[#0B1120]/95 backdrop-blur-2xl
            border border-cyan-500/30
            shadow-[0_20px_60px_-15px_rgba(0,229,255,0.3)]
            z-50 text-center overflow-hidden
          `}
        >
          {/* Top Glare */}
          <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent rounded-t-3xl" />

          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-2 rounded-full bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Animated Glowing Success Badge */}
          <div className="relative inline-flex items-center justify-center mb-6">
            <div className="absolute w-20 h-20 rounded-full bg-cyan-400/20 animate-ping pointer-events-none" />
            <div className="relative w-16 h-16 rounded-full bg-gradient-to-tr from-cyan-500 to-blue-600 border-2 border-cyan-300 flex items-center justify-center text-white shadow-[0_0_30px_rgba(0,229,255,0.6)]">
              <CheckCircle2 className="w-10 h-10 stroke-[2.5]" />
            </div>
          </div>

          {/* Headline */}
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-semibold uppercase tracking-wider bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 mb-3">
            <Sparkles className="w-3.5 h-3.5" /> Registration Confirmed
          </span>

          <h3 className="text-2xl sm:text-3xl font-extrabold text-white mb-2 tracking-tight">
            YOU ARE IN THE RACE!
          </h3>

          <p className="text-slate-300 text-sm leading-relaxed mb-6 max-w-md mx-auto">
            Congratulations! Your team registration for <strong className="text-cyan-300">ZAYATHON</strong> has been successfully submitted.
          </p>

          {/* Registration Details Card */}
          <div className="rounded-2xl p-5 bg-white/5 border border-white/10 text-left space-y-3 mb-6">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <span className="text-xs font-medium text-slate-400">Registration Pass ID</span>
              <div className="flex items-center gap-2">
                <code className="text-sm font-bold font-mono text-cyan-400">
                  {registrationData?.regId || 'ZYT-2026-8942'}
                </code>
                <button
                  onClick={handleCopyId}
                  className="p-1 rounded bg-white/10 hover:bg-cyan-500/20 text-slate-300 hover:text-cyan-300 transition-colors"
                  title="Copy ID"
                >
                  <Copy className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <div>
                <span className="text-slate-400 block">Team Name:</span>
                <span className="font-semibold text-white truncate block">
                  {registrationData?.teamName || 'Cyber Knights'}
                </span>
              </div>
              <div>
                <span className="text-slate-400 block">Track Domain:</span>
                <span className="font-semibold text-cyan-300 truncate block">
                  {registrationData?.domain || 'Agentic AI'}
                </span>
              </div>
              <div>
                <span className="text-slate-400 block">Team Leader:</span>
                <span className="font-semibold text-white truncate block">
                  {registrationData?.leaderName || 'Leader Name'}
                </span>
              </div>
              <div>
                <span className="text-slate-400 block">Total Members:</span>
                <span className="font-semibold text-white truncate block">
                  {registrationData?.totalMembers || 1} Member(s)
                </span>
              </div>
            </div>
            {copied && (
              <span className="block text-[11px] text-emerald-400 font-medium text-center pt-1">
                Copied Pass ID to clipboard!
              </span>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <button
              onClick={onClose}
              className="w-full neon-button py-3 px-6 rounded-xl font-bold text-sm text-white uppercase tracking-wider flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(0,229,255,0.4)]"
            >
              Back to Home <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default SuccessModal;

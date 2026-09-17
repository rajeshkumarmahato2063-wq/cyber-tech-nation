import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Terminal, Sparkles } from 'lucide-react';

const BOOT_LOGS = [
  'Initializing Cyber-Tech Architecture...',
  'Loading 9 Innovation Domains...',
  'Encrypting Neural Data Streams...',
  'Connecting Hacker Portal Nodes...',
  'ZAYATHON 2026 Ready.'
];

const Loader = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);
  const [logIndex, setLogIndex] = useState(0);
  const onCompleteRef = useRef(onComplete);

  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          setTimeout(() => {
            if (onCompleteRef.current) onCompleteRef.current();
          }, 200);
          return 100;
        }
        return prev + 15;
      });
    }, 40);

    // Guaranteed safety timeout to unlock UI after 1.2s max
    const fallbackTimer = setTimeout(() => {
      clearInterval(timer);
      setProgress(100);
      if (onCompleteRef.current) onCompleteRef.current();
    }, 1200);

    return () => {
      clearInterval(timer);
      clearTimeout(fallbackTimer);
    };
  }, []);

  useEffect(() => {
    if (progress < 25) setLogIndex(0);
    else if (progress < 50) setLogIndex(1);
    else if (progress < 75) setLogIndex(2);
    else if (progress < 95) setLogIndex(3);
    else setLogIndex(4);
  }, [progress]);

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4, ease: 'easeInOut' }}
      className="fixed inset-0 z-[100] bg-[#030612] flex flex-col items-center justify-center p-6 select-none overflow-hidden"
    >
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-cyan-500/15 rounded-full blur-[140px] pointer-events-none animate-pulse-glow" />

      <motion.div
        initial={{ scale: 0.85, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="flex items-center gap-3 mb-8"
      >
        <div className="p-3.5 rounded-2xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 shadow-[0_0_30px_rgba(0,229,255,0.4)] animate-pulse">
          <Terminal className="w-9 h-9" />
        </div>
        <h1 className="text-4xl sm:text-5xl font-black font-mono tracking-wider text-white">
          ZAYA<span className="text-cyan-400">THON</span>
        </h1>
      </motion.div>

      <div className="w-full max-w-md bg-white/5 border border-white/10 rounded-full h-3 p-0.5 relative overflow-hidden mb-4 shadow-[0_0_20px_rgba(0,0,0,0.5)]">
        <motion.div
          className="h-full bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 rounded-full shadow-[0_0_15px_rgba(0,229,255,0.8)]"
          style={{ width: `${progress}%` }}
          transition={{ ease: 'easeOut' }}
        />
      </div>

      <div className="w-full max-w-md flex items-center justify-between text-xs font-mono mb-2">
        <span className="text-cyan-400 font-semibold flex items-center gap-1">
          <Sparkles className="w-3.5 h-3.5 animate-spin" /> {BOOT_LOGS[logIndex]}
        </span>
        <span className="text-white font-bold">{progress}%</span>
      </div>
    </motion.div>
  );
};

export default Loader;

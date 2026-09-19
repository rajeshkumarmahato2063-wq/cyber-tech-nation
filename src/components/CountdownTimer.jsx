import React, { useState, useEffect } from 'react';
import { Clock, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';

const CountdownTimer = ({ targetDate, title = 'Registration Closes In' }) => {
  const calculateTimeLeft = () => {
    const diff = new Date(targetDate) - new Date();
    if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0, expired: true };

    return {
      days: Math.floor(diff / (1000 * 60 * 60 * 24)),
      hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((diff / 1000 / 60) % 60),
      seconds: Math.floor((diff / 1000) % 60),
      expired: false
    };
  };

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, [targetDate]);

  if (timeLeft.expired) {
    return (
      <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-center font-mono text-xs flex items-center justify-center gap-2 my-4">
        <AlertCircle className="w-4 h-4" /> Registration has officially closed or event phase completed.
      </div>
    );
  }

  const timeUnits = [
    { label: 'DAYS', value: timeLeft.days },
    { label: 'HOURS', value: timeLeft.hours },
    { label: 'MINUTES', value: timeLeft.minutes },
    { label: 'SECONDS', value: timeLeft.seconds }
  ];

  return (
    <div className="py-6 px-4 rounded-3xl bg-[#0B1120]/80 border border-cyan-500/30 backdrop-blur-md shadow-[0_0_40px_rgba(0,229,255,0.15)] max-w-2xl mx-auto my-6 text-center space-y-4 font-mono">
      <div className="flex items-center justify-center gap-2 text-cyan-400 text-xs font-bold uppercase tracking-widest">
        <Clock className="w-4 h-4 animate-pulse" />
        <span>{title}</span>
      </div>

      <div className="grid grid-cols-4 gap-3 sm:gap-4 max-w-md mx-auto">
        {timeUnits.map((unit, idx) => (
          <motion.div
            key={unit.label}
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            className="p-3 sm:p-4 rounded-2xl bg-[#050816] border border-cyan-500/40 shadow-inner flex flex-col items-center justify-center"
          >
            <span className="text-2xl sm:text-4xl font-extrabold font-title text-white">
              {String(unit.value).padStart(2, '0')}
            </span>
            <span className="text-[9px] sm:text-[11px] text-slate-400 font-bold mt-1 tracking-wider">
              {unit.label}
            </span>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default CountdownTimer;

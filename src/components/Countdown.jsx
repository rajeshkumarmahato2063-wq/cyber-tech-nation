import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

/**
 * Reusable Countdown Timer Component for ZAYATHON 2026
 * Counts down to September 17, 2026 (Hackathon Launch Date)
 */
const Countdown = ({ targetDate = '2026-09-17T09:00:00+05:30' }) => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const difference = +new Date(targetDate) - +new Date();
      
      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, [targetDate]);

  const timeUnits = [
    { label: 'Days', value: timeLeft.days, color: 'text-cyan-400', border: 'border-cyan-500/30' },
    { label: 'Hours', value: timeLeft.hours, color: 'text-blue-400', border: 'border-blue-500/30' },
    { label: 'Minutes', value: timeLeft.minutes, color: 'text-purple-400', border: 'border-purple-500/30' },
    { label: 'Seconds', value: timeLeft.seconds, color: 'text-pink-400', border: 'border-pink-500/30' },
  ];

  const formatNumber = (num) => String(num).padStart(2, '0');

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.4 }}
      className="w-full max-w-xl my-6"
    >
      <div className="grid grid-cols-4 gap-3 sm:gap-4">
        {timeUnits.map((unit, index) => (
          <motion.div
            key={unit.label}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, delay: 0.5 + index * 0.1 }}
            className={`
              relative flex flex-col items-center justify-center p-3 sm:p-4 rounded-2xl
              bg-[#0B1120]/80 backdrop-blur-xl border ${unit.border}
              shadow-[0_4px_25px_rgba(0,0,0,0.4)] hover:shadow-[0_0_20px_rgba(0,229,255,0.2)]
              transition-all duration-300 group
            `}
          >
            {/* Top glare line */}
            <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent rounded-t-2xl pointer-events-none" />

            <div className={`text-2xl sm:text-4xl font-extrabold font-mono tracking-wider ${unit.color} drop-shadow-[0_0_10px_rgba(0,229,255,0.3)]`}>
              {formatNumber(unit.value)}
            </div>
            <div className="text-[10px] sm:text-xs font-semibold uppercase tracking-widest text-slate-400 mt-1">
              {unit.label}
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default Countdown;

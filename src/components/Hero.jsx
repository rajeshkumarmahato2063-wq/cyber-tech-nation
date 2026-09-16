import React from 'react';
import { Rocket } from 'lucide-react';
import { motion } from 'framer-motion';

/**
 * Hero Component Placeholder
 */
const Hero = () => {
  return (
    <section className="min-h-[70vh] flex flex-col items-center justify-center text-center p-8 border-b border-white/5 relative overflow-hidden">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="flex flex-col items-center gap-4 max-w-3xl"
      >
        <Rocket className="w-16 h-16 text-purple-500 animate-bounce" />
        <h1 className="text-5xl font-extrabold tracking-tight bg-gradient-to-r from-purple-400 via-pink-500 to-cyan-400 bg-clip-text text-transparent">
          ZAYATHON 2026
        </h1>
        <p className="text-xl text-gray-300">
          The Ultimate National Level College Hackathon
        </p>
        <span className="text-xs uppercase tracking-widest text-purple-400 bg-purple-500/10 px-4 py-1.5 rounded-full border border-purple-500/20">
          Hero Section Placeholder
        </span>
      </motion.div>
    </section>
  );
};

export default Hero;

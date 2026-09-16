import React from 'react';
import { BarChart3 } from 'lucide-react';

/**
 * Stats Component Placeholder
 */
const Stats = () => {
  return (
    <section className="py-16 px-6 border-b border-white/5 flex flex-col items-center text-center bg-white/[0.01]">
      <div className="flex items-center gap-2 text-2xl font-bold text-pink-400 mb-4">
        <BarChart3 className="w-6 h-6" />
        <h2>Hackathon Stats</h2>
      </div>
      <p className="text-gray-400 max-w-xl">Stats Section Placeholder</p>
    </section>
  );
};

export default Stats;

import React from 'react';
import { Award } from 'lucide-react';

/**
 * Sponsors Component Placeholder
 */
const Sponsors = () => {
  return (
    <section className="py-16 px-6 border-b border-white/5 flex flex-col items-center text-center bg-white/[0.01]">
      <div className="flex items-center gap-2 text-2xl font-bold text-indigo-400 mb-4">
        <Award className="w-6 h-6" />
        <h2>Sponsors & Partners</h2>
      </div>
      <p className="text-gray-400 max-w-xl">Sponsors Section Placeholder</p>
    </section>
  );
};

export default Sponsors;

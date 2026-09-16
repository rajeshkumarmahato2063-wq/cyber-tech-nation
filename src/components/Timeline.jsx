import React from 'react';
import { Calendar } from 'lucide-react';

/**
 * Timeline Component Placeholder
 */
const Timeline = () => {
  return (
    <section className="py-16 px-6 border-b border-white/5 flex flex-col items-center text-center bg-white/[0.01]">
      <div className="flex items-center gap-2 text-2xl font-bold text-cyan-400 mb-4">
        <Calendar className="w-6 h-6" />
        <h2>Event Schedule & Timeline</h2>
      </div>
      <p className="text-gray-400 max-w-xl">Timeline Section Placeholder</p>
    </section>
  );
};

export default Timeline;

import React from 'react';
import { Users } from 'lucide-react';

/**
 * Team Component Placeholder
 */
const Team = () => {
  return (
    <section className="py-16 px-6 border-b border-white/5 flex flex-col items-center text-center">
      <div className="flex items-center gap-2 text-2xl font-bold text-teal-400 mb-4">
        <Users className="w-6 h-6" />
        <h2>Organizing Team</h2>
      </div>
      <p className="text-gray-400 max-w-xl">Team Section Placeholder</p>
    </section>
  );
};

export default Team;

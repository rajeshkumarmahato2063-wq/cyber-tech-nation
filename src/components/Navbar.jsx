import React from 'react';
import { Terminal } from 'lucide-react';

/**
 * Navbar Component Placeholder
 */
const Navbar = () => {
  return (
    <nav className="w-full py-4 px-6 border-b border-white/10 bg-[#050816]/80 backdrop-blur-md sticky top-0 z-50 flex items-center justify-between">
      <div className="flex items-center gap-2 text-xl font-bold tracking-wider text-purple-400">
        <Terminal className="w-6 h-6 text-cyan-400" />
        <span>ZAYATHON</span>
      </div>
      <div className="text-sm text-gray-400">Navbar Section</div>
    </nav>
  );
};

export default Navbar;

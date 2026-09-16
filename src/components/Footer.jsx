import React from 'react';
import { Heart } from 'lucide-react';

/**
 * Footer Component Placeholder
 */
const Footer = () => {
  return (
    <footer className="py-8 px-6 border-t border-white/10 bg-[#03050d] text-center text-gray-500 text-sm flex flex-col sm:flex-row items-center justify-between gap-4">
      <div>© 2026 ZAYATHON. All rights reserved.</div>
      <div className="flex items-center gap-1 text-gray-400">
        <span>Made with</span>
        <Heart className="w-4 h-4 text-red-500 fill-red-500 inline" />
        <span>for Innovators</span>
      </div>
    </footer>
  );
};

export default Footer;

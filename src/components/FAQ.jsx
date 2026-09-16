import React from 'react';
import { HelpCircle } from 'lucide-react';

/**
 * FAQ Component Placeholder
 */
const FAQ = () => {
  return (
    <section className="py-16 px-6 border-b border-white/5 flex flex-col items-center text-center">
      <div className="flex items-center gap-2 text-2xl font-bold text-amber-400 mb-4">
        <HelpCircle className="w-6 h-6" />
        <h2>Frequently Asked Questions</h2>
      </div>
      <p className="text-gray-400 max-w-xl">FAQ Section Placeholder</p>
    </section>
  );
};

export default FAQ;

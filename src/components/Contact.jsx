import React from 'react';
import { Mail } from 'lucide-react';

/**
 * Contact Component Placeholder
 */
const Contact = () => {
  return (
    <section className="py-16 px-6 border-b border-white/5 flex flex-col items-center text-center bg-white/[0.01]">
      <div className="flex items-center gap-2 text-2xl font-bold text-sky-400 mb-4">
        <Mail className="w-6 h-6" />
        <h2>Contact Us</h2>
      </div>
      <p className="text-gray-400 max-w-xl">Contact Section Placeholder</p>
    </section>
  );
};

export default Contact;

import React from 'react';
import { UserPlus } from 'lucide-react';

/**
 * Register Component Placeholder
 */
const Register = () => {
  return (
    <section className="py-16 px-6 border-b border-white/5 flex flex-col items-center text-center bg-white/[0.01]">
      <div className="flex items-center gap-2 text-2xl font-bold text-emerald-400 mb-4">
        <UserPlus className="w-6 h-6" />
        <h2>Register Now</h2>
      </div>
      <p className="text-gray-400 max-w-xl">Register Section Placeholder</p>
    </section>
  );
};

export default Register;

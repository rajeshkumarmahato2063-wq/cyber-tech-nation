import React from 'react';
import { motion } from 'framer-motion';
import { User, Users, ClipboardCheck, CheckCircle2 } from 'lucide-react';

/**
 * Step Configuration Meta
 */
const STEP_ITEMS = [
  { id: 1, title: 'Team Leader', icon: User, short: 'Leader' },
  { id: 2, title: 'Team Members', icon: Users, short: 'Members' },
  { id: 3, title: 'Review Details', icon: ClipboardCheck, short: 'Review' },
  { id: 4, title: 'Confirmation', icon: CheckCircle2, short: 'Done' }
];

/**
 * Reusable RegistrationStepper Component
 */
const RegistrationStepper = ({ currentStep }) => {
  // Progress percentage (0% for step 1, 33.3% step 2, 66.6% step 3, 100% step 4)
  const progressPercent = ((currentStep - 1) / (STEP_ITEMS.length - 1)) * 100;

  return (
    <div className="w-full max-w-3xl mx-auto mb-10 px-2">
      <div className="relative flex items-center justify-between">
        {/* Background Track Line */}
        <div className="absolute top-1/2 left-0 right-0 -translate-y-1/2 h-1 bg-white/10 rounded-full z-0 pointer-events-none" />

        {/* Animated Glowing Active Progress Line */}
        <motion.div
          className="absolute top-1/2 left-0 -translate-y-1/2 h-1 bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 rounded-full z-0 shadow-[0_0_15px_rgba(0,229,255,0.7)]"
          initial={{ width: '0%' }}
          animate={{ width: `${progressPercent}%` }}
          transition={{ duration: 0.5, ease: 'easeInOut' }}
        />

        {/* Step Nodes */}
        {STEP_ITEMS.map((step) => {
          const isCompleted = currentStep > step.id;
          const isActive = currentStep === step.id;
          const Icon = step.icon;

          return (
            <div key={step.id} className="relative z-10 flex flex-col items-center">
              {/* Step Circle Node */}
              <motion.div
                initial={false}
                animate={{
                  scale: isActive ? 1.15 : 1,
                  borderColor: isCompleted || isActive ? 'rgba(0, 229, 255, 1)' : 'rgba(255, 255, 255, 0.15)',
                  backgroundColor: isCompleted ? '#00E5FF' : (isActive ? '#0B1120' : '#050816')
                }}
                transition={{ duration: 0.3 }}
                className={`
                  w-10 h-10 sm:w-12 sm:h-12 rounded-full border-2
                  flex items-center justify-center font-bold text-sm sm:text-base
                  transition-shadow duration-300
                  ${isActive ? 'shadow-[0_0_20px_rgba(0,229,255,0.7)] text-cyan-400 border-cyan-400 ring-4 ring-cyan-500/20' : ''}
                  ${isCompleted ? 'text-[#050816] shadow-[0_0_15px_rgba(0,229,255,0.4)]' : ''}
                  ${!isActive && !isCompleted ? 'text-slate-500 border-white/10' : ''}
                `}
              >
                {isCompleted ? (
                  <CheckCircle2 className="w-6 h-6 stroke-[2.5]" />
                ) : (
                  <Icon className="w-5 h-5 sm:w-6 sm:h-6" />
                )}
              </motion.div>

              {/* Step Label */}
              <span className={`
                mt-2 text-xs font-medium tracking-tight transition-colors duration-300 text-center
                ${isActive ? 'text-cyan-300 font-bold' : (isCompleted ? 'text-slate-300' : 'text-slate-500')}
              `}>
                <span className="hidden sm:inline">{step.title}</span>
                <span className="sm:hidden">{step.short}</span>
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default RegistrationStepper;

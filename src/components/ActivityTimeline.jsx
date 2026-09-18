import React from 'react';
import { CheckCircle, Clock, FileText, QrCode, Award, ShieldCheck } from 'lucide-react';

/**
 * Team Registration Lifecycle Activity Timeline Component
 */
const ActivityTimeline = ({ registration }) => {
  if (!registration) return null;

  const status = registration.status || 'pending';
  const checkedIn = registration.checked_in;
  const proposalUploaded = Boolean(registration.proposal_url);
  const pptUploaded = Boolean(registration.ppt_url);

  const steps = [
    {
      title: 'Registration Entry Created',
      desc: `Registered team for "${registration.innovation_domain}" track.`,
      date: new Date(registration.created_at || Date.now()).toLocaleDateString(),
      icon: Clock,
      completed: true
    },
    {
      title: 'Project Proposal Uploaded',
      desc: proposalUploaded ? 'Proposal PDF submitted for initial technical screening.' : 'Awaiting proposal PDF upload.',
      icon: FileText,
      completed: proposalUploaded
    },
    {
      title: 'Presentation Deck Attached',
      desc: pptUploaded ? 'Slide deck (PPT) uploaded.' : 'Awaiting slide deck attachment.',
      icon: FileText,
      completed: pptUploaded
    },
    {
      title: 'Jury Status Decision',
      desc: status === 'approved' ? 'Registration APPROVED by Organizing Jury.' : status === 'rejected' ? 'Registration REJECTED.' : 'Currently Under Review / Pending.',
      icon: ShieldCheck,
      completed: status === 'approved'
    },
    {
      title: 'Onsite Event Check-in',
      desc: checkedIn ? 'Checked in at desk.' : 'Scan QR pass at entry desk on day of event.',
      icon: QrCode,
      completed: checkedIn
    },
    {
      title: 'Certificate of Award Issued',
      desc: status === 'approved' ? 'Official Certificate generated & verified.' : 'Certificate unlocks upon approval.',
      icon: Award,
      completed: status === 'approved'
    }
  ];

  return (
    <div className="p-5 rounded-3xl bg-[#050816] border border-cyan-500/30 space-y-4 font-mono text-xs">
      <h3 className="font-bold text-cyan-400 uppercase tracking-wider text-sm flex items-center gap-2">
        <Clock className="w-4 h-4" /> Registration Activity Lifecycle
      </h3>

      <div className="space-y-3 relative pl-4 border-l border-white/10">
        {steps.map((step, idx) => {
          const Icon = step.icon;
          return (
            <div key={idx} className="relative group">
              <div className={`absolute -left-[23px] top-0 w-3.5 h-3.5 rounded-full border ${
                step.completed ? 'bg-cyan-400 border-cyan-400 shadow-[0_0_10px_#00E5FF]' : 'bg-[#050816] border-slate-600'
              }`} />

              <div className="space-y-0.5">
                <div className={`font-bold flex items-center gap-2 ${step.completed ? 'text-white' : 'text-slate-500'}`}>
                  <span>{step.title}</span>
                  {step.completed && <CheckCircle className="w-3.5 h-3.5 text-cyan-400" />}
                </div>
                <p className="text-slate-400 text-[11px] leading-relaxed">{step.desc}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ActivityTimeline;

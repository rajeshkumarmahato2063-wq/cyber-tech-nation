import React from 'react';
import { Clock, CheckCircle2, PlayCircle, Calendar } from 'lucide-react';
import { motion } from 'framer-motion';

const TimelineSection = ({ scheduleItems = [] }) => {
  const defaultSchedule = [
    {
      time_label: 'Day 1 • 09:00 AM',
      activity: 'Participant Check-in & Badge Claim',
      location: 'Grand Entrance Hub',
      description: 'Check in with your QR pass, receive developer swags, and grab breakfast.',
      status: 'completed'
    },
    {
      time_label: 'Day 1 • 10:00 AM',
      activity: 'Opening Ceremony & Track Release',
      location: 'Main Auditorium',
      description: 'Keynote presentation, sponsor challenge breakdown, and rule release.',
      status: 'ongoing'
    },
    {
      time_label: 'Day 1 • 11:00 AM',
      activity: 'Hacking Sprint Commences',
      location: 'Cyber Labs & Discord',
      description: '24-hour non-stop building timer starts. Mentors available on demand.',
      status: 'upcoming'
    },
    {
      time_label: 'Day 2 • 12:00 PM',
      activity: 'Code Freeze & Project Submission',
      location: 'ZayaThon Portal',
      description: 'Repositories frozen. Final demo video, GitHub link and pitch deck uploaded.',
      status: 'upcoming'
    },
    {
      time_label: 'Day 2 • 02:00 PM',
      activity: 'Live Pitching & Judging Round',
      location: 'Evaluation Pods',
      description: 'Teams present live demo before industry judges and track sponsors.',
      status: 'upcoming'
    },
    {
      time_label: 'Day 2 • 05:00 PM',
      activity: 'Winner Announcement & Awards',
      location: 'Main Arena',
      description: 'Prize distribution, runner-up awards, and closing ceremony.',
      status: 'upcoming'
    }
  ];

  const items = scheduleItems.length > 0 ? scheduleItems : defaultSchedule;

  return (
    <section className="py-12 px-6 max-w-4xl mx-auto space-y-8 font-sans">
      <div className="text-center space-y-3">
        <span className="px-4 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 font-mono text-xs font-bold uppercase tracking-widest">
          📅 Event Schedule
        </span>
        <h2 className="text-3xl sm:text-5xl font-extrabold font-mono text-white tracking-tight">
          Timeline & Milestones
        </h2>
        <p className="text-slate-400 text-sm max-w-md mx-auto">
          Track upcoming hackathon phases, mentoring hours, submission deadlines, and pitching rounds.
        </p>
      </div>

      <div className="relative border-l-2 border-cyan-500/30 ml-4 sm:ml-8 pl-6 sm:pl-8 space-y-8 text-left font-mono">
        {items.map((item, idx) => {
          const isCompleted = item.status === 'completed';
          const isOngoing = item.status === 'ongoing';

          return (
            <motion.div
              key={idx}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="relative group"
            >
              {/* Timeline Icon Node Dot */}
              <div className="absolute -left-[35px] sm:-left-[43px] top-1 w-6 h-6 rounded-full bg-[#050816] border-2 border-cyan-400 flex items-center justify-center text-cyan-400 shadow-[0_0_15px_rgba(0,229,255,0.4)]">
                {isCompleted ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                ) : isOngoing ? (
                  <PlayCircle className="w-4 h-4 text-cyan-400 animate-pulse" />
                ) : (
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                )}
              </div>

              {/* Event Schedule Item Card */}
              <div className={`p-5 rounded-2xl bg-[#0B1120]/90 border ${isOngoing ? 'border-cyan-500/60 shadow-[0_0_20px_rgba(0,229,255,0.2)]' : 'border-white/10'} space-y-2 backdrop-blur-md`}>
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="text-xs font-bold text-cyan-400 flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5" /> {item.time_label}
                  </span>
                  <span className={`text-[10px] px-2.5 py-0.5 rounded-full font-bold uppercase ${
                    isCompleted ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' :
                    isOngoing ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 animate-pulse' :
                    'bg-white/5 text-slate-400 border border-white/10'
                  }`}>
                    {item.status || 'Upcoming'}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-white group-hover:text-cyan-300 transition-colors">
                  {item.activity}
                </h3>

                {item.location && (
                  <span className="text-xs text-purple-400 font-semibold block">📍 {item.location}</span>
                )}

                {item.description && (
                  <p className="text-xs text-slate-400 leading-relaxed font-sans">{item.description}</p>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
};

export default TimelineSection;

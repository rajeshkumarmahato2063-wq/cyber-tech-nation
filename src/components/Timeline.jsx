import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, FileText, Users, Code, Trophy } from 'lucide-react';
import SectionTitle from './ui/SectionTitle';
import TimelineItem from './TimelineItem';

/**
 * Event Timeline Milestones Data
 */
const TIMELINE_EVENTS = [
  {
    id: 'registration-opens',
    phase: 'Phase 01',
    title: 'Registration Opens',
    date: 'Oct 15, 2026',
    description: 'Global hacker registration officially opens. Register individually or form teams to set up your ZAYATHON portal profile.',
    icon: Calendar,
    status: 'completed',
    highlights: ['Team & Solo Registration', 'Portal Onboarding', 'Global Hacker Pool']
  },
  {
    id: 'problem-statements-released',
    phase: 'Phase 02',
    title: 'Problem Statements Released',
    date: 'Nov 01, 2026',
    description: 'Comprehensive domain challenge prompts, technical rubrics, datasets, and API documentation are published worldwide.',
    icon: FileText,
    status: 'completed',
    highlights: ['9 Domain Prompts', 'API & Dataset Access', 'Scoring Rubric']
  },
  {
    id: 'team-selection',
    phase: 'Phase 03',
    title: 'Team Selection',
    date: 'Nov 15, 2026',
    description: 'Team formation deadline and initial proposal evaluation. Shortlisted teams are notified and paired with expert mentors.',
    icon: Users,
    status: 'active',
    highlights: ['Proposal Screening', 'Mentor Pairing', 'Team Roster Lock']
  },
  {
    id: 'hackathon-begins',
    phase: 'Phase 04',
    title: 'Hackathon Begins',
    date: 'Dec 01, 2026',
    description: '48-hour continuous virtual & onsite coding sprint commences. Access 24/7 mentor sessions, live keynotes, and tech support.',
    icon: Code,
    status: 'upcoming',
    highlights: ['48-Hour Sprint', 'Live Workshops', '24/7 Tech Mentors']
  },
  {
    id: 'final-judging',
    phase: 'Phase 05',
    title: 'Final Judging & Demo Day',
    date: 'Dec 03, 2026',
    description: 'Project submissions close. Top finalist teams pitch live to VC partners, industry executives, and jury panel. Champions crowned.',
    icon: Trophy,
    status: 'upcoming',
    highlights: ['Live Demo Pitch', 'VC & Executive Panel', '$50K Prize Awards']
  }
];

const Timeline = () => {
  return (
    <section id="timeline" className="section-container relative z-10 overflow-hidden">
      {/* Background Cyber Ambient Blur Orbs */}
      <div className="absolute top-1/3 right-0 w-96 h-96 bg-blue-600/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-10 left-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-[140px] pointer-events-none" />

      {/* Section Header */}
      <SectionTitle 
        badge="Event Schedule"
        title="INTERACTIVE TIMELINE"
        subtitle="Track key dates, milestones, and deliverables from initial registration to the grand final demo day."
      />

      {/* Main Timeline Container */}
      <div className="relative max-w-5xl mx-auto pt-4 pb-8">
        {/* Glowing Animated Vertical Line */}
        <motion.div 
          initial={{ scaleY: 0 }}
          whileInView={{ scaleY: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.2, ease: 'easeOut' }}
          className="absolute left-6 md:left-1/2 -translate-x-1/2 top-4 bottom-12 w-1 timeline-line rounded-full z-0 origin-top"
        />

        {/* Outer ambient glow behind vertical line */}
        <div className="absolute left-6 md:left-1/2 -translate-x-1/2 top-4 bottom-12 w-3 bg-cyan-400/20 blur-sm rounded-full z-0 pointer-events-none" />

        {/* Timeline Items List */}
        <div className="relative z-10">
          {TIMELINE_EVENTS.map((event, index) => (
            <TimelineItem
              key={event.id}
              item={event}
              index={index}
              isLast={index === TIMELINE_EVENTS.length - 1}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Timeline;

import React from 'react';
import SectionTitle from './ui/SectionTitle';
import TeamCard from './TeamCard';

/**
 * Organizing Team Data Configuration
 */
const TEAM_MEMBERS = [
  {
    id: 'rahul-kumar-yadav',
    name: 'Rahul Kumar Yadav',
    role: 'Lead Organizer',
    initials: 'RY',
    avatarGradient: 'from-cyan-500/30 via-blue-600/30 to-indigo-600/40',
    bio: 'Directing overall hackathon vision, strategy, and partner execution for ZAYATHON.',
    linkedin: 'https://linkedin.com/in/rahulkumaryadav',
    github: 'https://github.com/rahulkumaryadav'
  },
  {
    id: 'aditya-chaurasiya',
    name: 'Aditya Chaurasiya',
    role: 'Technical Head',
    initials: 'AC',
    avatarGradient: 'from-blue-500/30 via-cyan-500/30 to-teal-500/40',
    bio: 'Architecting developer infrastructure, track problem statements, and evaluation systems.',
    linkedin: 'https://linkedin.com/in/adityachaurasiya',
    github: 'https://github.com/adityachaurasiya'
  },
  {
    id: 'akash-adhikari',
    name: 'Akash Adhikari',
    role: 'Operations Lead',
    initials: 'AA',
    avatarGradient: 'from-purple-500/30 via-indigo-600/30 to-blue-600/40',
    bio: 'Managing event logistics, schedule orchestration, and mentor coordination.',
    linkedin: 'https://linkedin.com/in/akashadhikari',
    github: 'https://github.com/akashadhikari'
  },
  {
    id: 'priya-sharma',
    name: 'Priya Sharma',
    role: 'Design & UX Lead',
    initials: 'PS',
    avatarGradient: 'from-pink-500/30 via-purple-500/30 to-cyan-500/40',
    bio: 'Crafting dark cyber-tech visuals, UI design systems, and digital assets.',
    linkedin: 'https://linkedin.com/in/priyasharma',
    github: 'https://github.com/priyasharma'
  },
  {
    id: 'siddharth-verma',
    name: 'Siddharth Verma',
    role: 'Outreach & Partnerships',
    initials: 'SV',
    avatarGradient: 'from-amber-500/30 via-orange-500/30 to-red-500/40',
    bio: 'Leading sponsor relations, community outreach, and partner integrations.',
    linkedin: 'https://linkedin.com/in/siddharthverma',
    github: 'https://github.com/siddharthverma'
  },
  {
    id: 'ananya-das',
    name: 'Ananya Das',
    role: 'Community & Logistics',
    initials: 'AD',
    avatarGradient: 'from-emerald-500/30 via-teal-500/30 to-cyan-500/40',
    bio: 'Fostering hacker community experience, support channels, and participant onboardings.',
    linkedin: 'https://linkedin.com/in/ananyadas',
    github: 'https://github.com/ananyadas'
  }
];

const Team = () => {
  return (
    <section id="team" className="section-container relative z-10 overflow-hidden">
      {/* Background Cyber Ambient Lights */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-purple-600/10 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute bottom-0 left-10 w-96 h-96 bg-cyan-500/10 rounded-full blur-[140px] pointer-events-none" />

      {/* Section Header */}
      <SectionTitle 
        badge="Meet the Builders"
        title="ORGANIZING TEAM"
        subtitle="The passionate minds, technical leads, and community builders bringing ZAYATHON to life."
      />

      {/* 6-Card Team Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 max-w-6xl mx-auto pt-2">
        {TEAM_MEMBERS.map((member, index) => (
          <TeamCard key={member.id} member={member} index={index} />
        ))}
      </div>
    </section>
  );
};

export default Team;

import React from 'react';
import { Trophy, Award, Medal, Sparkles } from 'lucide-react';
import SectionTitle from './ui/SectionTitle';
import PrizeCard from './PrizeCard';

/**
 * Prize Pool Data Configuration
 */
const PRIZES_DATA = [
  {
    id: 'first-prize',
    title: 'First Prize',
    amount: '₹3,000',
    subtitle: 'Grand Champion Trophy & Cash Reward',
    badge: '1st Winner',
    icon: Trophy,
    theme: 'gold',
    isFeatured: true,
    perks: [
      '₹3,000 Cash Reward',
      'Grand Winner Trophy & Gold Medals',
      'Direct Internship Opportunities',
      'Premium Swag Kits & Certificates'
    ]
  },
  {
    id: 'second-prize',
    title: 'Second Prize',
    amount: '₹2,000',
    subtitle: 'Runner-Up Award & Cash Reward',
    badge: '2nd Runner-Up',
    icon: Award,
    theme: 'silver',
    isFeatured: false,
    perks: [
      '₹2,000 Cash Reward',
      'Silver Medals & Honor Plaque',
      'Internship Interview Shortlisting',
      'Runner-Up Certificate & Swag'
    ]
  },
  {
    id: 'third-prize',
    title: 'Third Prize',
    amount: '₹1,000',
    subtitle: 'Second Runner-Up Award',
    badge: '3rd Place',
    icon: Medal,
    theme: 'bronze',
    isFeatured: false,
    perks: [
      '₹1,000 Cash Reward',
      'Bronze Medals & Recognition',
      'Fast-track Partner Application',
      'Merit Certificate & Swag'
    ]
  },
  {
    id: 'special-rewards',
    title: 'Special Rewards',
    amount: null,
    subtitle: 'For High-Performing Hackers & Teams',
    badge: 'All Participants',
    icon: Sparkles,
    theme: 'special',
    isFeatured: false,
    perks: [
      'Internship Opportunities with Partner Startups',
      'Verifiable Digital Certificates of Participation',
      'Goodies: Stickers, Badges & Cloud Credits',
      'Exclusive ZAYATHON Cyber Swag Kits'
    ]
  }
];

const Prizes = () => {
  return (
    <section id="prizes" className="section-container relative z-10 overflow-hidden">
      {/* Ambient Background Radial Glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[700px] bg-cyan-500/10 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute bottom-0 right-10 w-96 h-96 bg-amber-500/10 rounded-full blur-[140px] pointer-events-none" />

      {/* Section Header */}
      <SectionTitle 
        badge="Rewards & Cash Pool"
        title="PRIZES & SPECIAL REWARDS"
        subtitle="Compete for cash bounties, exclusive internship offers, premium swag kits, and verified credentials."
      />

      {/* 4-Card Responsive Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 pt-4">
        {PRIZES_DATA.map((prize, index) => (
          <PrizeCard key={prize.id} prize={prize} index={index} />
        ))}
      </div>
    </section>
  );
};

export default Prizes;

import React, { useState, useEffect } from 'react';
import { ArrowLeft, Share2, Check } from 'lucide-react';
import useEvent from '../../hooks/useEvent';
import EventBanner from '../../components/EventBanner';
import CountdownTimer from '../../components/CountdownTimer';
import TimelineSection from '../../components/TimelineSection';
import PrizeSection from '../../components/PrizeSection';
import Sponsors from '../../components/Sponsors';
import FAQ from '../../components/FAQ';

const EventDetailsPage = ({ slug, onBack, onOpenRegister }) => {
  const { currentEvent, loading, error } = useEvent(slug);
  const [copied, setCopied] = useState(false);

  if (loading) {
    return (
      <div className="min-h-screen pt-32 pb-20 px-6 text-center font-mono text-cyan-400 text-sm animate-pulse">
        Loading event details...
      </div>
    );
  }

  const event = currentEvent || {
    name: 'ZayaThon 2026',
    slug: 'zayathon-2026',
    theme: 'Next-Gen AI & Cyber Security Hackathon',
    description: 'The premier flagship national hackathon empowering creators to build groundbreaking software.',
    prize_pool: '$15,000 USD',
    venue: 'Main Campus Arena & Discord',
    registration_deadline: new Date(Date.now() + 24 * 3600 * 1000).toISOString(),
    status: 'live'
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-[#050816] text-[#F8FAFC] pb-24 space-y-12">
      {/* Top Floating Back & Navigation Header */}
      <div className="max-w-7xl mx-auto px-6 pt-24 pb-2 flex items-center justify-between font-mono text-xs z-20 relative">
        <button
          onClick={onBack}
          className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-slate-300 hover:text-white hover:bg-white/10 transition-all flex items-center gap-2 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4 text-cyan-400" /> Back to All Events
        </button>

        {copied && (
          <span className="px-3 py-1 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 text-xs font-bold flex items-center gap-1">
            <Check className="w-3.5 h-3.5" /> Event Link Copied!
          </span>
        )}
      </div>

      {/* 1. Event Hero Banner */}
      <EventBanner
        event={event}
        onRegister={onOpenRegister}
        onShare={handleShare}
      />

      {/* 2. Live Countdown Timer */}
      {event.registration_deadline && event.status !== 'completed' && (
        <div className="px-6">
          <CountdownTimer
            targetDate={event.registration_deadline}
            title={event.status === 'live' ? 'Hackathon Live Phase In Progress' : 'Registration Closes In'}
          />
        </div>
      )}

      {/* 3. Event Schedule Timeline */}
      <TimelineSection />

      {/* 4. Prize Pool Breakdown */}
      <PrizeSection prizePool={event.prize_pool} />

      {/* 5. Sponsors */}
      <Sponsors />

      {/* 6. Frequently Asked Questions */}
      <FAQ />

      {/* Bottom Floating CTA Bar */}
      {event.status !== 'completed' && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 bg-[#0B1120]/90 border border-cyan-500/40 px-6 py-3 rounded-full backdrop-blur-xl shadow-[0_0_30px_rgba(0,229,255,0.3)] flex items-center gap-4 font-mono">
          <span className="text-xs text-white font-bold hidden sm:inline">
            Ready to build for <span className="text-cyan-400">{event.name}</span>?
          </span>
          <button
            onClick={() => onOpenRegister(event)}
            className="neon-button px-6 py-2 rounded-full text-xs font-bold uppercase text-white tracking-wider cursor-pointer"
          >
            Register Now
          </button>
        </div>
      )}
    </div>
  );
};

export default EventDetailsPage;

import React, { useState, useEffect } from 'react';
import { ArrowLeft, Star, Linkedin, ShieldCheck, Calendar, Clock, Video, CheckCircle2, Award } from 'lucide-react';
import { motion } from 'framer-motion';
import BookingCalendar from '../../components/BookingCalendar';
import useMentor from '../../hooks/useMentor';

/**
 * Detailed Mentor Profile Page (/mentor/:id)
 */
const MentorDetailsPage = ({ mentorId, user, onBack, onNavigate }) => {
  const { fetchMentorById, bookSession, bookingLoading } = useMentor(user);
  const [mentor, setMentor] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const data = await fetchMentorById(mentorId);
      setMentor(data);
      setLoading(false);
    };
    load();
  }, [mentorId, fetchMentorById]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#050816] text-white pt-24 pb-20 flex items-center justify-center font-mono text-cyan-400 text-xs">
        Loading Mentor Profile...
      </div>
    );
  }

  if (!mentor) {
    return (
      <div className="min-h-screen bg-[#050816] text-white pt-24 pb-20 text-center font-mono space-y-4">
        <p className="text-rose-400">Mentor profile not found.</p>
        <button
          onClick={onBack || (() => onNavigate('/mentors'))}
          className="px-4 py-2 rounded-xl bg-white/10 text-white text-xs"
        >
          Return to Mentors
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050816] text-white pt-24 pb-20 px-4 sm:px-6 lg:px-8 max-w-[1200px] mx-auto space-y-8 font-sans">
      {/* Top Back Navigation */}
      <button
        onClick={onBack || (() => onNavigate('/mentors'))}
        className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-mono text-cyan-400 flex items-center gap-2 transition-all"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Mentor Hub
      </button>

      {/* Main Profile Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Profile Info & Bio */}
        <div className="lg:col-span-5 space-y-6">
          <div className="p-8 rounded-3xl bg-[#0B1120]/80 backdrop-blur-2xl border border-white/10 space-y-6 shadow-2xl">
            <div className="relative w-32 h-32 mx-auto">
              <img
                src={mentor.photo || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400'}
                alt={mentor.name}
                className="w-full h-full rounded-3xl object-cover border-2 border-cyan-500/40 shadow-xl"
              />
              <div className="absolute -bottom-2 -right-2 p-2 rounded-2xl bg-cyan-500 text-slate-950 shadow-lg">
                <ShieldCheck className="w-5 h-5" />
              </div>
            </div>

            <div className="text-center space-y-1">
              <h2 className="text-2xl font-extrabold text-white">{mentor.name}</h2>
              <p className="text-xs font-mono text-cyan-400 font-bold">{mentor.role_title}</p>
              <p className="text-xs font-mono text-slate-400">{mentor.company}</p>
            </div>

            {/* Badges Bar */}
            <div className="flex items-center justify-center gap-4 py-3 border-y border-white/10 text-xs font-mono">
              <div className="flex items-center gap-1 text-amber-400 font-bold">
                <Star className="w-4 h-4 fill-amber-400" />
                <span>{mentor.rating} ({mentor.reviews_count || 12} reviews)</span>
              </div>
              <span>•</span>
              <div className="text-slate-300">{mentor.experience} Exp</div>
            </div>

            {/* Bio */}
            <div>
              <h3 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider mb-2">About Mentor</h3>
              <p className="text-xs text-slate-300 font-mono leading-relaxed">{mentor.bio}</p>
            </div>

            {/* Expertise */}
            <div>
              <h3 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider mb-2">Core Expertise</h3>
              <div className="flex flex-wrap gap-2">
                {mentor.expertise?.map((skill, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-mono"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* LinkedIn Link */}
            {mentor.linkedin && (
              <a
                href={mentor.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 text-white font-mono text-xs font-bold transition-all flex items-center justify-center gap-2"
              >
                <Linkedin className="w-4 h-4 text-cyan-400" />
                Connect on LinkedIn
              </a>
            )}
          </div>
        </div>

        {/* Right Column: Booking Calendar Component */}
        <div className="lg:col-span-7 space-y-6">
          <div className="space-y-2">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Calendar className="w-5 h-5 text-cyan-400" />
              Book 1-on-1 Mentorship Slot
            </h2>
            <p className="text-xs text-slate-400 font-mono">
              Select your preferred date and time slot to receive personalized project guidance and architecture advice.
            </p>
          </div>

          <BookingCalendar
            mentor={mentor}
            onBookSession={bookSession}
            loading={bookingLoading}
          />
        </div>
      </div>
    </div>
  );
};

export default MentorDetailsPage;

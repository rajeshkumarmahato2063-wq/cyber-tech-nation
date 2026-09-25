import React, { useState } from 'react';
import { Calendar, Clock, Video, XCircle, CheckCircle2, User, Search, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import BookingCalendar from '../../components/BookingCalendar';
import useMentor from '../../hooks/useMentor';

/**
 * Session Booking Portal Page (/book-session)
 */
const BookingPage = ({ user, onNavigate }) => {
  const {
    mentors,
    userBookings,
    bookSession,
    cancelSession,
    bookingLoading
  } = useMentor(user);

  const [selectedMentor, setSelectedMentor] = useState(mentors[0] || null);
  const [activeTab, setActiveTab] = useState('book'); // 'book' | 'my-bookings'

  return (
    <div className="min-h-screen bg-[#050816] text-white pt-24 pb-20 px-4 sm:px-6 lg:px-8 max-w-[1440px] mx-auto space-y-10 font-sans">
      {/* Header Banner */}
      <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-br from-[#0B1120] via-[#050816] to-[#0E244A] border border-white/10 space-y-4 shadow-2xl">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 font-mono text-xs font-semibold">
          <Calendar className="w-3.5 h-3.5" />
          <span>1-on-1 Mentor Session Booking Portal</span>
        </div>

        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          Reserve Expert Technical Mentorship
        </h1>
        <p className="text-xs sm:text-sm text-slate-300 font-mono max-w-2xl leading-relaxed">
          Select a mentor, pick a 30-minute slot, and join instant Google Meet / Zoom rooms to accelerate your hackathon build.
        </p>

        {/* Tab Selector */}
        <div className="flex items-center gap-3 pt-4">
          <button
            onClick={() => setActiveTab('book')}
            className={`px-5 py-2.5 rounded-2xl text-xs font-mono font-bold transition-all ${
              activeTab === 'book'
                ? 'bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 shadow-[0_0_15px_rgba(0,229,255,0.2)]'
                : 'bg-white/5 text-slate-400 hover:text-white'
            }`}
          >
            ➕ Book New Session
          </button>

          <button
            onClick={() => setActiveTab('my-bookings')}
            className={`px-5 py-2.5 rounded-2xl text-xs font-mono font-bold transition-all flex items-center gap-2 ${
              activeTab === 'my-bookings'
                ? 'bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 shadow-[0_0_15px_rgba(0,229,255,0.2)]'
                : 'bg-white/5 text-slate-400 hover:text-white'
            }`}
          >
            <Clock className="w-4 h-4" />
            My Booked Sessions ({userBookings.length})
          </button>
        </div>
      </div>

      {activeTab === 'book' ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Mentor Selection List */}
          <div className="lg:col-span-5 space-y-4">
            <h3 className="text-sm font-mono font-bold text-slate-300 uppercase tracking-wider">
              1. Choose a Mentor
            </h3>

            <div className="space-y-3 max-h-[600px] overflow-y-auto no-scrollbar pr-1">
              {mentors.map((m) => (
                <div
                  key={m.id}
                  onClick={() => setSelectedMentor(m)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center gap-4 ${
                    selectedMentor?.id === m.id
                      ? 'bg-cyan-500/10 border-cyan-500/50 text-white shadow-[0_0_20px_rgba(0,229,255,0.15)]'
                      : 'bg-[#0B1120]/80 border-white/10 hover:border-white/20 text-slate-300'
                  }`}
                >
                  <img
                    src={m.photo || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400'}
                    alt={m.name}
                    className="w-12 h-12 rounded-xl object-cover border border-cyan-500/30 shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-bold truncate text-white">{m.name}</div>
                    <div className="text-xs font-mono text-cyan-400 truncate">{m.role_title} @ {m.company}</div>
                    <div className="text-[11px] font-mono text-slate-400 mt-0.5">{m.availability}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Calendar & Booking Form */}
          <div className="lg:col-span-7 space-y-4">
            <h3 className="text-sm font-mono font-bold text-slate-300 uppercase tracking-wider">
              2. Select Slot & Topic
            </h3>

            <BookingCalendar
              mentor={selectedMentor || mentors[0]}
              onBookSession={bookSession}
              loading={bookingLoading}
            />
          </div>
        </div>
      ) : (
        /* MY BOOKINGS TAB */
        <div className="space-y-6">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Clock className="w-5 h-5 text-cyan-400" />
            Your Scheduled Mentor Sessions
          </h2>

          {userBookings.length === 0 ? (
            <div className="p-12 rounded-3xl bg-[#0B1120] border border-white/10 text-center space-y-4 font-mono">
              <p className="text-slate-400 text-sm">You have no active session bookings yet.</p>
              <button
                onClick={() => setActiveTab('book')}
                className="px-6 py-2.5 rounded-xl bg-cyan-500/20 text-cyan-300 text-xs font-bold"
              >
                Book Your First Session
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {userBookings.map((b) => (
                <div
                  key={b.id}
                  className={`p-6 rounded-3xl border space-y-4 backdrop-blur-xl ${
                    b.status === 'cancelled'
                      ? 'bg-[#0B1120]/40 border-white/5 opacity-60'
                      : 'bg-[#0B1120]/90 border-cyan-500/30 shadow-xl'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className={`px-3 py-1 rounded-full text-xs font-mono font-bold ${
                      b.status === 'cancelled'
                        ? 'bg-rose-500/10 text-rose-400 border border-rose-500/30'
                        : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                    }`}>
                      {b.status === 'cancelled' ? 'Cancelled' : 'Confirmed'}
                    </span>

                    <span className="text-xs font-mono text-cyan-300 font-bold">{b.slot_time}</span>
                  </div>

                  <div>
                    <h4 className="text-base font-bold text-white">{b.topic || 'Mentorship Session'}</h4>
                    <p className="text-xs font-mono text-slate-400 mt-1">
                      Mentor ID: {b.mentor_id || 'Assigned Mentor'}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-white/10 flex items-center justify-between gap-3">
                    {b.status !== 'cancelled' ? (
                      <>
                        <a
                          href={b.meeting_link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-mono text-xs font-bold flex items-center gap-1.5 shadow-lg"
                        >
                          <Video className="w-4 h-4" />
                          Join Meeting
                        </a>

                        <button
                          onClick={() => cancelSession(b.id)}
                          className="px-3 py-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 font-mono text-xs flex items-center gap-1"
                        >
                          <XCircle className="w-4 h-4" />
                          Cancel
                        </button>
                      </>
                    ) : (
                      <span className="text-xs font-mono text-slate-500">Booking cancelled</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default BookingPage;

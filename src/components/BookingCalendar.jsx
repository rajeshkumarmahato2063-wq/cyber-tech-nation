import React, { useState } from 'react';
import { Calendar, Clock, Video, CheckCircle2, User, Sparkles, MessageSquare } from 'lucide-react';
import { motion } from 'framer-motion';

/**
 * Session Booking Calendar Component
 */
const BookingCalendar = ({
  mentor,
  onBookSession,
  loading = false
}) => {
  const [selectedDate, setSelectedDate] = useState('Today');
  const [selectedSlot, setSelectedSlot] = useState('02:00 PM');
  const [topic, setTopic] = useState('');
  const [notes, setNotes] = useState('');
  const [successBooking, setSuccessBooking] = useState(null);

  const dates = [
    { label: 'Today', value: 'Today' },
    { label: 'Tomorrow', value: 'Tomorrow' },
    { label: 'Friday, Sep 26', value: 'Friday' },
    { label: 'Saturday, Sep 27', value: 'Saturday' }
  ];

  const timeSlots = [
    '09:00 AM',
    '10:30 AM',
    '01:00 PM',
    '02:00 PM',
    '04:30 PM',
    '06:00 PM',
    '08:00 PM'
  ];

  const handleBooking = async (e) => {
    e.preventDefault();
    if (!selectedSlot || loading) return;

    const slotIso = `${selectedDate} at ${selectedSlot}`;
    const res = await onBookSession({
      mentorId: mentor?.id,
      mentorName: mentor?.name,
      slotTime: slotIso,
      topic: topic || 'Hackathon Architecture Review',
      notes
    });

    if (res) {
      setSuccessBooking(res);
    }
  };

  if (successBooking) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="p-8 bg-[#0B1120] border border-cyan-500/40 rounded-3xl text-center space-y-6 shadow-[0_0_30px_rgba(0,229,255,0.2)]"
      >
        <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 mx-auto flex items-center justify-center">
          <CheckCircle2 className="w-8 h-8" />
        </div>

        <div>
          <h3 className="text-xl font-extrabold text-white">Session Confirmed!</h3>
          <p className="text-xs font-mono text-cyan-300 mt-1">
            Your 1-on-1 session with <span className="font-bold text-white">{mentor?.name}</span> is scheduled.
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-white/5 border border-white/10 text-left font-mono text-xs space-y-2">
          <div className="flex justify-between text-slate-400">
            <span>Time Slot:</span>
            <span className="text-cyan-300 font-bold">{successBooking.slot_time}</span>
          </div>
          <div className="flex justify-between text-slate-400">
            <span>Topic:</span>
            <span className="text-white font-bold">{successBooking.topic}</span>
          </div>
          <div className="flex justify-between text-slate-400 items-center">
            <span>Meeting Link:</span>
            <a
              href={successBooking.meeting_link}
              target="_blank"
              rel="noopener noreferrer"
              className="text-emerald-400 font-bold underline flex items-center gap-1"
            >
              <Video className="w-3.5 h-3.5" />
              Join Google Meet
            </a>
          </div>
        </div>

        <button
          onClick={() => setSuccessBooking(null)}
          className="w-full py-3 rounded-2xl bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 font-mono text-xs font-bold hover:bg-cyan-500/30 transition-all"
        >
          Book Another Session
        </button>
      </motion.div>
    );
  }

  return (
    <div className="p-6 bg-[#0B1120]/90 backdrop-blur-2xl border border-white/10 rounded-3xl shadow-2xl space-y-6">
      {/* Mentor Mini Header */}
      {mentor && (
        <div className="flex items-center gap-4 pb-4 border-b border-white/10">
          <img
            src={mentor.photo || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400'}
            alt={mentor.name}
            className="w-12 h-12 rounded-xl object-cover border border-cyan-500/40"
          />
          <div>
            <h4 className="text-sm font-bold text-white">{mentor.name}</h4>
            <p className="text-xs font-mono text-cyan-400">{mentor.role_title} @ {mentor.company}</p>
          </div>
        </div>
      )}

      <form onSubmit={handleBooking} className="space-y-5">
        {/* Date Selector */}
        <div>
          <label className="block text-xs font-mono text-slate-300 mb-2 flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-cyan-400" />
            Select Date
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {dates.map((d) => (
              <button
                key={d.value}
                type="button"
                onClick={() => setSelectedDate(d.value)}
                className={`py-2 px-3 rounded-xl text-xs font-mono transition-all text-center ${
                  selectedDate === d.value
                    ? 'bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 font-bold shadow-[0_0_10px_rgba(0,229,255,0.2)]'
                    : 'bg-white/5 border border-white/10 text-slate-400 hover:text-white'
                }`}
              >
                {d.label}
              </button>
            ))}
          </div>
        </div>

        {/* Time Slot Grid */}
        <div>
          <label className="block text-xs font-mono text-slate-300 mb-2 flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-cyan-400" />
            Available Time Slots
          </label>
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
            {timeSlots.map((slot) => (
              <button
                key={slot}
                type="button"
                onClick={() => setSelectedSlot(slot)}
                className={`py-2 px-3 rounded-xl text-xs font-mono transition-all text-center ${
                  selectedSlot === slot
                    ? 'bg-gradient-to-r from-cyan-500 to-blue-600 border border-cyan-400 text-white font-bold shadow-[0_0_15px_rgba(0,229,255,0.3)]'
                    : 'bg-white/5 border border-white/10 text-slate-300 hover:border-white/20'
                }`}
              >
                {slot}
              </button>
            ))}
          </div>
        </div>

        {/* Discussion Topic Input */}
        <div>
          <label className="block text-xs font-mono text-slate-300 mb-1 flex items-center gap-1.5">
            <MessageSquare className="w-3.5 h-3.5 text-cyan-400" />
            Session Topic
          </label>
          <input
            type="text"
            required
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="e.g., Code Review & Architecture Optimization"
            className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 focus:border-cyan-400 text-xs font-mono text-white placeholder-slate-500 focus:outline-none"
          />
        </div>

        {/* Additional Notes */}
        <div>
          <label className="block text-xs font-mono text-slate-300 mb-1">
            Additional Notes (Optional)
          </label>
          <textarea
            rows="2"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Share GitHub link or specific questions for the mentor..."
            className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 focus:border-cyan-400 text-xs font-mono text-white placeholder-slate-500 focus:outline-none"
          />
        </div>

        {/* Submit Booking Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-mono text-xs font-bold shadow-[0_0_20px_rgba(0,229,255,0.3)] hover:shadow-[0_0_30px_rgba(0,229,255,0.5)] transition-all flex items-center justify-center gap-2 cursor-pointer"
        >
          <Calendar className="w-4 h-4" />
          {loading ? 'Confirming Booking...' : 'Confirm 1-on-1 Session Booking'}
        </button>
      </form>
    </div>
  );
};

export default BookingCalendar;

import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { sendNotification } from './notifications';

// Local storage key for offline session persistence
const LOCAL_BOOKINGS_KEY = 'zayathon_user_bookings';

export const MOCK_OFFICE_HOURS = [
  {
    id: 'b2000000-0000-0000-0000-000000000001',
    mentor_id: 'a1000000-0000-0000-0000-000000000001',
    mentor_name: 'Dr. Alex Mercer',
    mentor_company: 'OpenAI',
    mentor_photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400',
    topic: 'Scaling Agentic AI Workflows in Production',
    type: 'office_hours',
    start_time: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
    end_time: new Date(Date.now() + 45 * 60 * 1000).toISOString(),
    meeting_link: 'https://meet.google.com/zaya-ai-room',
    max_participants: 50,
    participant_count: 18,
    status: 'live'
  },
  {
    id: 'b2000000-0000-0000-0000-000000000002',
    mentor_id: 'a1000000-0000-0000-0000-000000000002',
    mentor_name: 'Elena Rostova',
    mentor_company: 'ConsenSys',
    mentor_photo: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=400',
    topic: 'Auditing Smart Contracts & ZK-Rollup Proofs',
    type: 'office_hours',
    start_time: new Date(Date.now() + 2 * 3600 * 1000).toISOString(),
    end_time: new Date(Date.now() + 3 * 3600 * 1000).toISOString(),
    meeting_link: 'https://meet.google.com/zaya-web3-room',
    max_participants: 40,
    participant_count: 12,
    status: 'upcoming'
  },
  {
    id: 'b2000000-0000-0000-0000-000000000003',
    mentor_id: 'a1000000-0000-0000-0000-000000000003',
    mentor_name: 'Sophia Lin',
    mentor_company: 'AWS',
    mentor_photo: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=400',
    topic: 'Building Low Latency Realtime Backends with Supabase',
    type: 'office_hours',
    start_time: new Date(Date.now() + 5 * 3600 * 1000).toISOString(),
    end_time: new Date(Date.now() + 6 * 3600 * 1000).toISOString(),
    meeting_link: 'https://meet.google.com/zaya-cloud-room',
    max_participants: 60,
    participant_count: 24,
    status: 'upcoming'
  }
];

/**
 * Fetch bookings for current user
 */
export const getUserBookings = async (userId) => {
  if (!isSupabaseConfigured() || !userId) {
    try {
      const stored = localStorage.getItem(LOCAL_BOOKINGS_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  }

  try {
    const { data, error } = await supabase
      .from('mentor_bookings')
      .select('*, mentors(name, photo, company, role_title)')
      .eq('user_id', userId)
      .order('slot_time', { ascending: true });

    if (error) throw error;
    return data || [];
  } catch (err) {
    console.warn('[Booking Service] Fetch bookings error:', err.message);
    const stored = localStorage.getItem(LOCAL_BOOKINGS_KEY);
    return stored ? JSON.parse(stored) : [];
  }
};

/**
 * Book a 1-on-1 Session with a Mentor
 */
export const bookMentorSession = async ({
  mentorId,
  mentorName,
  userId,
  userName,
  userEmail,
  slotTime,
  topic,
  notes
}) => {
  const meetingLink = `https://meet.google.com/zaya-mentor-${Math.floor(1000 + Math.random() * 9000)}`;

  const newBookingPayload = {
    id: `bk-${Date.now()}`,
    mentor_id: mentorId,
    user_id: userId || 'anon-user',
    user_name: userName || 'Participant',
    user_email: userEmail || 'user@zayathon.dev',
    slot_time: slotTime,
    topic: topic || 'Project Guidance',
    notes: notes || '',
    meeting_link: meetingLink,
    status: 'confirmed',
    created_at: new Date().toISOString()
  };

  if (isSupabaseConfigured()) {
    try {
      const { data, error } = await supabase
        .from('mentor_bookings')
        .insert([{
          mentor_id: mentorId,
          user_id: userId,
          user_name: userName,
          user_email: userEmail,
          slot_time: slotTime,
          topic,
          notes,
          meeting_link: meetingLink,
          status: 'confirmed'
        }])
        .select('*, mentors(name, photo, company)')
        .single();

      if (!error && data) {
        // Send Realtime notification
        if (userId) {
          await sendNotification({
            userId,
            title: '🎉 Session Booking Confirmed!',
            message: `Your 1-on-1 mentor session with ${mentorName || 'your mentor'} for "${topic}" is scheduled.`,
            type: 'success',
            link: '/book-session'
          });
        }
        return data;
      }
    } catch (err) {
      console.warn('[Booking Service] Supabase insert failed, fallback to local:', err.message);
    }
  }

  // Local Storage Fallback
  try {
    const existing = JSON.parse(localStorage.getItem(LOCAL_BOOKINGS_KEY) || '[]');
    const updated = [newBookingPayload, ...existing];
    localStorage.setItem(LOCAL_BOOKINGS_KEY, JSON.stringify(updated));

    if (userId) {
      sendNotification({
        userId,
        title: '🎉 Session Booking Confirmed!',
        message: `Your session with ${mentorName || 'mentor'} is scheduled.`,
        type: 'success',
        link: '/book-session'
      });
    }
  } catch (err) {
    console.error('[Booking Service] Local storage save error:', err);
  }

  return newBookingPayload;
};

/**
 * Cancel a Booking
 */
export const cancelBooking = async (bookingId, userId = null) => {
  if (isSupabaseConfigured()) {
    try {
      await supabase
        .from('mentor_bookings')
        .update({ status: 'cancelled' })
        .eq('id', bookingId);
    } catch (err) {
      console.warn('[Booking Service] Cancel booking error:', err.message);
    }
  }

  // Also update local storage fallback
  try {
    const existing = JSON.parse(localStorage.getItem(LOCAL_BOOKINGS_KEY) || '[]');
    const updated = existing.map(b => b.id === bookingId ? { ...b, status: 'cancelled' } : b);
    localStorage.setItem(LOCAL_BOOKINGS_KEY, JSON.stringify(updated));
  } catch (e) {
    console.warn(e);
  }

  if (userId) {
    sendNotification({
      userId,
      title: 'Booking Cancelled',
      message: 'Your mentor session booking has been cancelled.',
      type: 'info',
      link: '/book-session'
    });
  }

  return true;
};

/**
 * Fetch Office Hours Rooms
 */
export const getOfficeHoursSessions = async () => {
  if (!isSupabaseConfigured()) return MOCK_OFFICE_HOURS;

  try {
    const { data, error } = await supabase
      .from('mentor_sessions')
      .select('*, mentors(name, photo, company)')
      .eq('type', 'office_hours')
      .order('start_time', { ascending: true });

    if (error || !data || data.length === 0) return MOCK_OFFICE_HOURS;

    return data.map(item => ({
      ...item,
      mentor_name: item.mentors?.name || 'Mentor',
      mentor_company: item.mentors?.company || 'Expert',
      mentor_photo: item.mentors?.photo || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400'
    }));
  } catch (err) {
    console.warn('[Booking Service] Get office hours error:', err.message);
    return MOCK_OFFICE_HOURS;
  }
};

/**
 * Join an Office Hour Room
 */
export const joinOfficeHourSession = async (sessionId) => {
  if (isSupabaseConfigured()) {
    try {
      await supabase.rpc('increment_participant_count', { session_id_param: sessionId });
    } catch (err) {
      console.warn('[Booking Service] Increment participant error:', err.message);
    }
  }
  return true;
};

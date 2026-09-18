import { supabase, isSupabaseConfigured } from '../lib/supabase';

/**
 * Live Event Operations & Master State Service
 */

// Default local state fallback when offline or Supabase isn't configured
const defaultEventState = {
  phase: 'checkin', // 'registration' | 'checkin' | 'hacking' | 'judging' | 'results' | 'ended'
  status: 'active',
  current_activity: 'Opening Ceremony & Team Registration',
  emergency_broadcast: {
    enabled: false,
    title: 'VENUE ANNOUNCEMENT',
    message: 'High-speed WiFi network: ZayaThon_5G (Pass: Hack2026!)',
    level: 'info' // 'info' | 'warning' | 'urgent'
  },
  registrations_locked: false,
  judging_open: false,
  results_published: false
};

const defaultSchedule = [
  { id: '1', time_label: '09:00 AM', activity: 'Onsite Check-in & Badge Claim', location: 'Main Entrance Hub', description: 'Participants receive access badges and swags.', status: 'completed', order_index: 1 },
  { id: '2', time_label: '10:00 AM', activity: 'Opening Ceremony & Keynote', location: 'Grand Auditorium', description: 'Welcome address, problem statement overview and rule release.', status: 'ongoing', order_index: 2 },
  { id: '3', time_label: '11:00 AM', activity: 'Hacking Sprint Begins', location: 'Cyber Lab 1 & 2', description: '24-hour hacking timer commences. Mentors available on call.', status: 'upcoming', order_index: 3 },
  { id: '4', time_label: '04:00 PM', activity: 'Mid-way Mentor Checkpoint', location: 'Virtual Booths', description: 'Optional code review and technical guidance session with judges.', status: 'upcoming', order_index: 4 },
  { id: '5', time_label: '06:00 PM', activity: 'Final Submission & Pitch Preparation', location: 'Online Portal', description: 'Repositories frozen. Final deck and video demos uploaded.', status: 'upcoming', order_index: 5 },
  { id: '6', time_label: '07:30 PM', activity: 'Grand Pitch & Judging Round', location: 'Main Stage', description: 'Top shortlisted teams pitch live before the judging panel.', status: 'upcoming', order_index: 6 },
  { id: '7', time_label: '09:00 PM', activity: 'Winner Announcement & Awards', location: 'Grand Auditorium', description: 'Prize distribution, certificates and closing remarks.', status: 'upcoming', order_index: 7 }
];

const defaultGallery = [
  { id: 'g1', title: 'Grand Keynote Stage', image_url: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&auto=format&fit=crop&q=80', category: 'Ceremony', caption: 'Keynote presentation at ZayaThon 2026' },
  { id: 'g2', title: 'Late Night Hacking Sprint', image_url: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=800&auto=format&fit=crop&q=80', category: 'Hacking', caption: 'Teams building AI solutions under neon glow' },
  { id: 'g3', title: 'Mentor Technical Review', image_url: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=800&auto=format&fit=crop&q=80', category: 'Hacking', caption: 'Senior architect giving feedback on project architecture' },
  { id: 'g4', title: 'Grand Pitch Finale', image_url: 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=800&auto=format&fit=crop&q=80', category: 'Demos', caption: 'Finalists presenting pitch to judge panel' }
];

/**
 * Fetch Current Live Event State
 */
export const getEventState = async () => {
  if (!isSupabaseConfigured()) return defaultEventState;

  try {
    const { data, error } = await supabase
      .from('event_state')
      .select('*')
      .limit(1)
      .single();

    if (error && error.code !== 'PGRST116') throw error;
    return data || defaultEventState;
  } catch (err) {
    console.warn('[LiveOps] Error fetching event state:', err.message);
    return defaultEventState;
  }
};

/**
 * Update Event State Controls (Phase, Status, Flags)
 */
export const updateEventState = async (updates) => {
  if (!isSupabaseConfigured()) {
    Object.assign(defaultEventState, updates);
    return defaultEventState;
  }

  try {
    // Check if state row exists
    const { data: existing } = await supabase.from('event_state').select('id').limit(1).single();
    
    if (existing) {
      const { data, error } = await supabase
        .from('event_state')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', existing.id)
        .select()
        .single();
      if (error) throw error;
      return data;
    } else {
      const { data, error } = await supabase
        .from('event_state')
        .insert([{ ...defaultEventState, ...updates }])
        .select()
        .single();
      if (error) throw error;
      return data;
    }
  } catch (err) {
    console.error('[LiveOps] Error updating event state:', err.message);
    throw err;
  }
};

/**
 * Fetch Dynamic Event Schedule
 */
export const getEventSchedule = async () => {
  if (!isSupabaseConfigured()) return defaultSchedule;

  try {
    const { data, error } = await supabase
      .from('event_schedule')
      .select('*')
      .order('order_index', { ascending: true });

    if (error) throw error;
    return data?.length > 0 ? data : defaultSchedule;
  } catch (err) {
    console.warn('[LiveOps] Error fetching schedule:', err.message);
    return defaultSchedule;
  }
};

/**
 * Fetch Event Gallery Images
 */
export const getGalleryImages = async () => {
  if (!isSupabaseConfigured()) return defaultGallery;

  try {
    const { data, error } = await supabase
      .from('gallery')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data?.length > 0 ? data : defaultGallery;
  } catch (err) {
    console.warn('[LiveOps] Error fetching gallery:', err.message);
    return defaultGallery;
  }
};

/**
 * Add Photo to Gallery
 */
export const addGalleryImage = async (item) => {
  if (!isSupabaseConfigured()) {
    const newItem = { id: `g_${Date.now()}`, ...item, created_at: new Date().toISOString() };
    defaultGallery.unshift(newItem);
    return newItem;
  }

  try {
    const { data, error } = await supabase
      .from('gallery')
      .insert([item])
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (err) {
    console.error('[LiveOps] Error uploading photo:', err.message);
    throw err;
  }
};

/**
 * Fetch Hourly Attendance Analytics
 */
export const getAttendanceAnalytics = async () => {
  try {
    const { data, error } = await supabase
      .from('registrations')
      .select('checked_in, check_in_time, status, teams(team_name)');

    if (error || !data) throw error || new Error('No data');

    const total = data.length;
    const checkedIn = data.filter(d => d.checked_in);
    const absent = total - checkedIn.length;

    // Hourly buckets (09:00, 10:00, 11:00, 12:00, 13:00, 14:00, 15:00)
    const hourlyMap = { '09:00': 0, '10:00': 0, '11:00': 0, '12:00': 0, '13:00': 0, '14:00+': 0 };
    checkedIn.forEach(item => {
      if (!item.check_in_time) return;
      const hour = new Date(item.check_in_time).getHours();
      if (hour <= 9) hourlyMap['09:00']++;
      else if (hour === 10) hourlyMap['10:00']++;
      else if (hour === 11) hourlyMap['11:00']++;
      else if (hour === 12) hourlyMap['12:00']++;
      else if (hour === 13) hourlyMap['13:00']++;
      else hourlyMap['14:00+']++;
    });

    return {
      total,
      checkedInCount: checkedIn.length,
      absentCount: absent,
      hourlyData: Object.entries(hourlyMap).map(([time, count]) => ({ time, count }))
    };
  } catch (err) {
    return {
      total: 48,
      checkedInCount: 38,
      absentCount: 10,
      hourlyData: [
        { time: '09:00', count: 12 },
        { time: '10:00', count: 18 },
        { time: '11:00', count: 5 },
        { time: '12:00', count: 3 },
        { time: '13:00', count: 0 },
        { time: '14:00+', count: 0 }
      ]
    };
  }
};

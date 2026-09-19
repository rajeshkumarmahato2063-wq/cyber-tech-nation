import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { FALLBACK_EVENTS } from './events';

export const organizerService = {
  /**
   * Fetch events assigned to an organizer
   */
  async getAssignedEvents(userId, isAdmin = false) {
    if (isAdmin) {
      // Admins see all events
      if (!isSupabaseConfigured()) return FALLBACK_EVENTS;
      const { data } = await supabase.from('events').select('*').order('created_at', { ascending: false });
      return data && data.length > 0 ? data : FALLBACK_EVENTS;
    }

    if (!isSupabaseConfigured() || !userId) {
      return FALLBACK_EVENTS;
    }

    try {
      const { data, error } = await supabase
        .from('event_organizers')
        .select('event_id, events(*)')
        .eq('user_id', userId);

      if (error || !data || data.length === 0) {
        // Fallback: events created by this user or default list
        const { data: createdEvents } = await supabase.from('events').select('*').eq('created_by', userId);
        return createdEvents && createdEvents.length > 0 ? createdEvents : FALLBACK_EVENTS;
      }

      return data.map(item => item.events).filter(Boolean);
    } catch (err) {
      console.error('Error fetching assigned events:', err);
      return FALLBACK_EVENTS;
    }
  },

  /**
   * Get event-specific operational statistics
   */
  async getEventStats(eventId) {
    if (!isSupabaseConfigured() || !eventId) {
      return {
        totalRegistrations: 42,
        pendingRegistrations: 12,
        approvedRegistrations: 28,
        rejectedRegistrations: 2,
        totalTeams: 14,
        checkInsCount: 35,
        attendanceRate: '83%'
      };
    }

    try {
      const { data: regs, error } = await supabase
        .from('registrations')
        .select('id, status, checked_in, team_id')
        .eq('event_id', eventId);

      if (error || !regs) {
        return {
          totalRegistrations: 0,
          pendingRegistrations: 0,
          approvedRegistrations: 0,
          rejectedRegistrations: 0,
          totalTeams: 0,
          checkInsCount: 0,
          attendanceRate: '0%'
        };
      }

      const totalRegistrations = regs.length;
      const pendingRegistrations = regs.filter(r => r.status === 'pending' || r.status === 'under_review').length;
      const approvedRegistrations = regs.filter(r => r.status === 'approved').length;
      const rejectedRegistrations = regs.filter(r => r.status === 'rejected').length;
      const checkInsCount = regs.filter(r => r.checked_in).length;
      
      const uniqueTeams = new Set(regs.map(r => r.team_id).filter(Boolean));
      const totalTeams = uniqueTeams.size;

      const rate = totalRegistrations > 0 ? Math.round((checkInsCount / totalRegistrations) * 100) : 0;

      return {
        totalRegistrations,
        pendingRegistrations,
        approvedRegistrations,
        rejectedRegistrations,
        totalTeams,
        checkInsCount,
        attendanceRate: `${rate}%`
      };
    } catch (err) {
      console.error('Error getting event stats:', err);
      return {
        totalRegistrations: 0,
        pendingRegistrations: 0,
        approvedRegistrations: 0,
        rejectedRegistrations: 0,
        totalTeams: 0,
        checkInsCount: 0,
        attendanceRate: '0%'
      };
    }
  },

  /**
   * Assign an organizer to an event
   */
  async assignOrganizer(eventId, userId, role = 'organizer') {
    if (!isSupabaseConfigured()) return { success: true };
    const { data, error } = await supabase
      .from('event_organizers')
      .insert([{ event_id: eventId, user_id: userId, role }])
      .select()
      .single();

    if (error) throw new Error(error.message);
    return data;
  },

  /**
   * Remove an assigned organizer
   */
  async removeOrganizer(eventId, userId) {
    if (!isSupabaseConfigured()) return { success: true };
    const { error } = await supabase
      .from('event_organizers')
      .delete()
      .match({ event_id: eventId, user_id: userId });

    if (error) throw new Error(error.message);
    return true;
  }
};

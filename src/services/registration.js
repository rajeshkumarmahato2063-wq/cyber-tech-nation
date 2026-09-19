import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { uploadService } from './upload';

/**
 * Registration Service - Handles event-specific hackathon registrations and file uploads
 */
export const registrationService = {
  /**
   * Upload proposal PDF document
   */
  async uploadProposalFile(file, userId) {
    return await uploadService.uploadProposal(file, userId);
  },

  /**
   * Upload presentation PPT PDF document
   */
  async uploadPptFile(file, userId) {
    return await uploadService.uploadPpt(file, userId);
  },

  /**
   * Create a new hackathon registration for a specific event
   */
  async createRegistration({
    userId,
    teamId,
    eventId,
    innovationDomain,
    projectTitle,
    projectDescription,
    proposalFile,
    pptFile,
  }) {
    const defaultEventId = 'a0000000-0000-0000-0000-000000000001';
    const targetEventId = eventId || defaultEventId;

    if (!isSupabaseConfigured()) {
      return {
        id: `mock-reg-${Date.now()}`,
        user_id: userId,
        team_id: teamId,
        event_id: targetEventId,
        innovation_domain: innovationDomain,
        project_title: projectTitle,
        project_description: projectDescription,
        status: 'pending',
        created_at: new Date().toISOString(),
      };
    }

    // Upload files if provided
    let proposalUrl = null;
    let pptUrl = null;

    if (proposalFile && typeof proposalFile !== 'string') {
      proposalUrl = await uploadService.uploadProposal(proposalFile, userId || 'anon');
    } else if (typeof proposalFile === 'string') {
      proposalUrl = proposalFile;
    }

    if (pptFile && typeof pptFile !== 'string') {
      pptUrl = await uploadService.uploadPpt(pptFile, userId || 'anon');
    } else if (typeof pptFile === 'string') {
      pptUrl = pptFile;
    }

    const { data, error } = await supabase
      .from('registrations')
      .insert([
        {
          user_id: userId || null,
          team_id: teamId || null,
          event_id: targetEventId,
          innovation_domain: innovationDomain,
          project_title: projectTitle,
          project_description: projectDescription,
          proposal_url: proposalUrl,
          ppt_url: pptUrl,
          status: 'pending',
        },
      ])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  /**
   * Get registration for current user (optional eventId parameter)
   */
  async getUserRegistration(userId, eventId = null) {
    if (!isSupabaseConfigured() || !userId) return null;
    let query = supabase
      .from('registrations')
      .select('*, teams(*, team_members(*)), events(*)')
      .eq('user_id', userId);

    if (eventId) {
      query = query.eq('event_id', eventId);
    }

    const { data, error } = await query.order('created_at', { ascending: false });

    if (error || !data || data.length === 0) return null;
    return data[0];
  },

  /**
   * Get ALL registrations for a user across multiple events
   */
  async getAllUserRegistrations(userId) {
    if (!isSupabaseConfigured() || !userId) return [];
    try {
      const { data, error } = await supabase
        .from('registrations')
        .select('*, teams(*, team_members(*)), events(*)')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error || !data) return [];
      return data;
    } catch (err) {
      console.warn('Error getting all registrations:', err);
      return [];
    }
  },

  /**
   * Realtime subscription for registration status updates
   */
  subscribeToRegistrationStatus(userId, callback) {
    if (!isSupabaseConfigured() || !userId) return { unsubscribe: () => {} };

    const channel = supabase
      .channel(`reg-status-${userId}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'registrations',
          filter: `user_id=eq.${userId}`,
        },
        (payload) => {
          callback(payload.new);
        }
      )
      .subscribe();

    return {
      unsubscribe: () => supabase.removeChannel(channel),
    };
  }
};

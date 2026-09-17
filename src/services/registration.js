import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { uploadService } from './upload';

/**
 * Registration Service - Handles hackathon registrations and file uploads
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
   * Create a new hackathon registration
   */
  async createRegistration({
    userId,
    teamId,
    innovationDomain,
    projectTitle,
    projectDescription,
    proposalFile,
    pptFile,
  }) {
    if (!isSupabaseConfigured()) {
      return {
        id: 'mock-reg-id',
        user_id: userId,
        team_id: teamId,
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
   * Get registration for current user
   */
  async getUserRegistration(userId) {
    if (!isSupabaseConfigured() || !userId) return null;
    const { data, error } = await supabase
      .from('registrations')
      .select('*, teams(*, team_members(*))')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .maybeSingle();

    if (error) return null;
    return data;
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

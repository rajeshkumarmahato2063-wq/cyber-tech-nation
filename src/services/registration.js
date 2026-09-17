import { supabase, isSupabaseConfigured } from '../lib/supabase';

/**
 * Registration Service - Handles hackathon registrations and file uploads
 */
export const registrationService = {
  /**
   * Upload proposal PDF document to Supabase Storage
   */
  async uploadProposalFile(file, userId) {
    if (!isSupabaseConfigured() || !file) return null;
    const fileExt = file.name.split('.').pop();
    const fileName = `${userId || 'anon'}_proposal_${Date.now()}.${fileExt}`;
    const filePath = `proposals/${fileName}`;

    const { error: uploadErr } = await supabase.storage
      .from('proposals')
      .upload(filePath, file, { upsert: true });

    if (uploadErr) throw uploadErr;

    const { data } = supabase.storage
      .from('proposals')
      .getPublicUrl(filePath);

    return data.publicUrl;
  },

  /**
   * Upload presentation PPT file to Supabase Storage
   */
  async uploadPptFile(file, userId) {
    if (!isSupabaseConfigured() || !file) return null;
    const fileExt = file.name.split('.').pop();
    const fileName = `${userId || 'anon'}_ppt_${Date.now()}.${fileExt}`;
    const filePath = `ppts/${fileName}`;

    const { error: uploadErr } = await supabase.storage
      .from('ppts')
      .upload(filePath, file, { upsert: true });

    if (uploadErr) throw uploadErr;

    const { data } = supabase.storage
      .from('ppts')
      .getPublicUrl(filePath);

    return data.publicUrl;
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
      proposalUrl = await this.uploadProposalFile(proposalFile, userId);
    } else if (typeof proposalFile === 'string') {
      proposalUrl = proposalFile;
    }

    if (pptFile && typeof pptFile !== 'string') {
      pptUrl = await this.uploadPptFile(pptFile, userId);
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

import { supabase, isSupabaseConfigured } from '../lib/supabase';

/**
 * Admin Service - Handles admin statistics, registration management, and realtime subscriptions
 */
export const adminService = {
  /**
   * Get total metrics and stats for Admin Dashboard
   */
  async getDashboardStats() {
    if (!isSupabaseConfigured()) {
      return {
        totalRegistrations: 128,
        pendingRegistrations: 42,
        approvedRegistrations: 76,
        rejectedRegistrations: 10,
        totalTeams: 34,
        totalContacts: 18,
      };
    }

    const [regsRes, teamsRes, contactsRes] = await Promise.all([
      supabase.from('registrations').select('status', { count: 'exact' }),
      supabase.from('teams').select('id', { count: 'exact' }),
      supabase.from('contacts').select('id', { count: 'exact' }),
    ]);

    const regs = regsRes.data || [];
    const totalRegistrations = regs.length;
    const pendingRegistrations = regs.filter((r) => r.status === 'pending').length;
    const approvedRegistrations = regs.filter((r) => r.status === 'approved').length;
    const rejectedRegistrations = regs.filter((r) => r.status === 'rejected').length;
    const totalTeams = teamsRes.count || 0;
    const totalContacts = contactsRes.count || 0;

    return {
      totalRegistrations,
      pendingRegistrations,
      approvedRegistrations,
      rejectedRegistrations,
      totalTeams,
      totalContacts,
    };
  },

  /**
   * Get Analytics data (Domain breakdown, status distribution, college stats)
   */
  async getAnalyticsData() {
    if (!isSupabaseConfigured()) {
      return {
        domainBreakdown: [
          { domain: 'Agentic AI', count: 45 },
          { domain: 'Robotics', count: 30 },
          { domain: 'Cybersecurity', count: 25 },
          { domain: 'Web3 & FinTech', count: 18 },
          { domain: 'Smart Cities', count: 10 },
        ],
        statusDistribution: [
          { status: 'Approved', count: 76 },
          { status: 'Pending', count: 42 },
          { status: 'Rejected', count: 10 },
        ],
      };
    }

    const { data: regs } = await supabase
      .from('registrations')
      .select('innovation_domain, status');

    const domainCounts = {};
    const statusCounts = { Approved: 0, Pending: 0, Rejected: 0 };

    (regs || []).forEach((r) => {
      const d = r.innovation_domain || 'Open Innovation';
      domainCounts[d] = (domainCounts[d] || 0) + 1;

      if (r.status === 'approved') statusCounts.Approved++;
      else if (r.status === 'rejected') statusCounts.Rejected++;
      else statusCounts.Pending++;
    });

    const domainBreakdown = Object.keys(domainCounts).map((domain) => ({
      domain,
      count: domainCounts[domain],
    }));

    const statusDistribution = [
      { status: 'Approved', count: statusCounts.Approved },
      { status: 'Pending', count: statusCounts.Pending },
      { status: 'Rejected', count: statusCounts.Rejected },
    ];

    return { domainBreakdown, statusDistribution };
  },

  /**
   * Get all registrations with optional filter & pagination
   */
  async getAllRegistrations({ status = 'all', domain = 'all', search = '', limit = 50, offset = 0 } = {}) {
    if (!isSupabaseConfigured()) return { registrations: [], count: 0 };

    let query = supabase
      .from('registrations')
      .select('*, profiles(*), teams(*, team_members(*))', { count: 'exact' })
      .order('created_at', { ascending: false });

    if (status !== 'all') {
      query = query.eq('status', status);
    }
    if (domain !== 'all') {
      query = query.eq('innovation_domain', domain);
    }
    if (search && search.trim()) {
      query = query.or(`project_title.ilike.%${search.trim()}%,innovation_domain.ilike.%${search.trim()}%`);
    }

    query = query.range(offset, offset + limit - 1);

    const { data, error, count } = await query;
    if (error) throw error;
    return { registrations: data || [], count: count || 0 };
  },

  /**
   * Update registration status (approve/reject/pending)
   */
  async updateRegistrationStatus(id, status) {
    if (!isSupabaseConfigured() || !id) return null;
    const { data, error } = await supabase
      .from('registrations')
      .update({ status })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  /**
   * Delete registration by ID
   */
  async deleteRegistration(id) {
    if (!isSupabaseConfigured() || !id) return true;
    const { error } = await supabase
      .from('registrations')
      .delete()
      .eq('id', id);

    if (error) throw error;
    return true;
  },

  /**
   * Get all teams with members
   */
  async getAllTeams() {
    if (!isSupabaseConfigured()) return [];
    const { data, error } = await supabase
      .from('teams')
      .select('*, profiles(*), team_members(*)')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  /**
   * Subscribe to admin realtime table updates
   */
  subscribeToAdminRealtime(callback) {
    if (!isSupabaseConfigured()) return { unsubscribe: () => {} };

    const channel = supabase
      .channel('admin-realtime')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'registrations' }, () => callback())
      .on('postgres_changes', { event: '*', schema: 'public', table: 'contacts' }, () => callback())
      .on('postgres_changes', { event: '*', schema: 'public', table: 'teams' }, () => callback())
      .on('postgres_changes', { event: '*', schema: 'public', table: 'profiles' }, () => callback())
      .subscribe();

    return {
      unsubscribe: () => supabase.removeChannel(channel),
    };
  }
};

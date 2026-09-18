import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { generateRegistrationQR, formatQRData } from './qr';
import { sendEmailNotification } from './email';
import { logAuditAction } from './audit';

/**
 * Admin Service - Production Ready
 * Handles admin statistics, registration approval workflows, QR generation, email automation & audit logs
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
        underReviewRegistrations: 15,
        approvedRegistrations: 76,
        rejectedRegistrations: 10,
        checkedInRegistrations: 52,
        totalTeams: 34,
        totalContacts: 18,
      };
    }

    const [regsRes, teamsRes, contactsRes] = await Promise.all([
      supabase.from('registrations').select('status, checked_in', { count: 'exact' }),
      supabase.from('teams').select('id', { count: 'exact' }),
      supabase.from('contacts').select('id', { count: 'exact' }),
    ]);

    const regs = regsRes.data || [];
    const totalRegistrations = regs.length;
    const pendingRegistrations = regs.filter((r) => r.status === 'pending').length;
    const underReviewRegistrations = regs.filter((r) => r.status === 'under_review').length;
    const approvedRegistrations = regs.filter((r) => r.status === 'approved').length;
    const rejectedRegistrations = regs.filter((r) => r.status === 'rejected').length;
    const checkedInRegistrations = regs.filter((r) => r.checked_in).length;
    const totalTeams = teamsRes.count || 0;
    const totalContacts = contactsRes.count || 0;

    return {
      totalRegistrations,
      pendingRegistrations,
      underReviewRegistrations,
      approvedRegistrations,
      rejectedRegistrations,
      checkedInRegistrations,
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
          { status: 'Under Review', count: 15 },
          { status: 'Pending', count: 42 },
          { status: 'Rejected', count: 10 },
        ],
      };
    }

    const { data: regs } = await supabase
      .from('registrations')
      .select('innovation_domain, status, checked_in');

    const domainCounts = {};
    const statusCounts = { Approved: 0, 'Under Review': 0, Pending: 0, Rejected: 0 };

    (regs || []).forEach((r) => {
      const d = r.innovation_domain || 'Open Innovation';
      domainCounts[d] = (domainCounts[d] || 0) + 1;

      if (r.status === 'approved') statusCounts.Approved++;
      else if (r.status === 'under_review') statusCounts['Under Review']++;
      else if (r.status === 'rejected') statusCounts.Rejected++;
      else statusCounts.Pending++;
    });

    const domainBreakdown = Object.keys(domainCounts).map((domain) => ({
      domain,
      count: domainCounts[domain],
    }));

    const statusDistribution = [
      { status: 'Approved', count: statusCounts.Approved },
      { status: 'Under Review', count: statusCounts['Under Review'] },
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
   * Update registration status (approve/reject/under_review/pending) with QR generation & Email notification
   */
  async updateRegistrationStatus(id, status, statusNotes = '', awardType = 'Participant') {
    if (!isSupabaseConfigured() || !id) return null;

    // 1. Fetch full registration record
    const { data: reg, error: fetchErr } = await supabase
      .from('registrations')
      .select('*, profiles(*), teams(*, team_members(*))')
      .eq('id', id)
      .single();

    if (fetchErr) throw fetchErr;

    const updatePayload = {
      status,
      status_notes: statusNotes,
      award_type: awardType
    };

    // 2. If approved, generate QR code payload & Data URL
    if (status === 'approved') {
      const qrData = formatQRData(reg);
      const qrUrl = await generateRegistrationQR(qrData);
      updatePayload.qr_code_data = qrData;
      updatePayload.qr_code_url = qrUrl;

      // Auto-create certificate entry if missing
      await supabase.from('certificates').upsert([{
        registration_id: id,
        certificate_number: `ZAYA-2026-${id.substring(0, 8).toUpperCase()}`,
        recipient_name: reg.profiles?.full_name || reg.teams?.team_name || 'Participant',
        team_name: reg.teams?.team_name || 'Individual Team',
        domain: reg.innovation_domain,
        award_type: awardType
      }], { onConflict: 'registration_id' });
    }

    // 3. Update database record
    const { data, error } = await supabase
      .from('registrations')
      .update(updatePayload)
      .eq('id', id)
      .select('*, profiles(*), teams(*)')
      .single();

    if (error) throw error;

    // 4. Send Email Notification to Participant
    const recipientEmail = reg.profiles?.email || reg.teams?.team_members?.[0]?.email;
    if (recipientEmail) {
      let subject = `ZAYATHON 2026: Registration Status Update (${status.toUpperCase()})`;
      let message = `Your team registration status for "${reg.project_title}" has been updated to ${status.toUpperCase()}.`;
      let badgeColor = status === 'approved' ? '#00E5FF' : status === 'rejected' ? '#F43F5E' : '#EAB308';

      if (status === 'approved') {
        message = `Congratulations! Your team project "${reg.project_title}" in the domain "${reg.innovation_domain}" has been APPROVED for ZAYATHON 2026. Your official Event QR Code is now available in your Participant Dashboard.`;
      } else if (status === 'rejected') {
        message = `Thank you for your submission for ZAYATHON 2026. After careful evaluation, your project "${reg.project_title}" was not selected for this edition. Notes: ${statusNotes || 'N/A'}`;
      }

      sendEmailNotification({
        recipientEmail,
        recipientName: reg.profiles?.full_name || 'Participant',
        templateName: `REGISTRATION_${status.toUpperCase()}`,
        subject,
        message,
        badgeText: `STATUS: ${status.toUpperCase()}`,
        badgeColor
      });
    }

    // 5. Audit Logging
    await logAuditAction({
      action: `REGISTRATION_STATUS_${status.toUpperCase()}`,
      entityType: 'registration',
      entityId: id,
      details: { status, statusNotes, awardType }
    });

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

    await logAuditAction({
      action: 'REGISTRATION_DELETED',
      entityType: 'registration',
      entityId: id
    });

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
      .on('postgres_changes', { event: '*', schema: 'public', table: 'announcements' }, () => callback())
      .on('postgres_changes', { event: '*', schema: 'public', table: 'checkins' }, () => callback())
      .subscribe();

    return {
      unsubscribe: () => supabase.removeChannel(channel),
    };
  }
};


import { supabase, isSupabaseConfigured } from '../lib/supabase';

/**
 * Team Service - Handles team creation, member additions, and team queries
 */
export const teamService = {
  /**
   * Check if team name already exists
   */
  async checkDuplicateTeamName(teamName) {
    if (!isSupabaseConfigured() || !teamName) return false;
    const { data, error } = await supabase
      .from('teams')
      .select('id')
      .ilike('team_name', teamName.trim())
      .maybeSingle();

    if (error && error.code !== 'PGRST116') throw error;
    return Boolean(data);
  },

  /**
   * Create a new team
   */
  async createTeam({ teamName, college, leaderId }) {
    if (!isSupabaseConfigured()) {
      return { id: 'mock-team-id', team_name: teamName, college, leader_id: leaderId };
    }

    // Check duplicate team name first
    const exists = await this.checkDuplicateTeamName(teamName);
    if (exists) {
      throw new Error(`Team name "${teamName}" is already taken. Please choose another name.`);
    }

    const { data, error } = await supabase
      .from('teams')
      .insert([
        {
          team_name: teamName.trim(),
          college: college.trim(),
          leader_id: leaderId || null,
        }
      ])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  /**
   * Add members to a team
   */
  async addTeamMembers(teamId, members = []) {
    if (!isSupabaseConfigured() || !teamId || members.length === 0) {
      return members;
    }

    const formattedMembers = members.map((m) => ({
      team_id: teamId,
      full_name: m.fullName || m.full_name || '',
      email: m.email || '',
      phone: m.phone || '',
      department: m.department || '',
      year: m.year || '',
    }));

    const { data, error } = await supabase
      .from('team_members')
      .insert(formattedMembers)
      .select();

    if (error) throw error;
    return data;
  },

  /**
   * Remove member from team
   */
  async removeTeamMember(memberId) {
    if (!isSupabaseConfigured() || !memberId) return true;
    const { error } = await supabase
      .from('team_members')
      .delete()
      .eq('id', memberId);

    if (error) throw error;
    return true;
  },

  /**
   * Get team details with all members
   */
  async getTeamDetails(teamId) {
    if (!isSupabaseConfigured() || !teamId) return null;
    const { data: team, error: teamErr } = await supabase
      .from('teams')
      .select('*, team_members(*)')
      .eq('id', teamId)
      .single();

    if (teamErr) throw teamErr;
    return team;
  },

  /**
   * Get team created by a specific user (leader)
   */
  async getUserTeam(leaderId) {
    if (!isSupabaseConfigured() || !leaderId) return null;
    const { data, error } = await supabase
      .from('teams')
      .select('*, team_members(*)')
      .eq('leader_id', leaderId)
      .maybeSingle();

    if (error) return null;
    return data;
  }
};

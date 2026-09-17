import { supabase, isSupabaseConfigured } from '../lib/supabase';

/**
 * User Service - Handles admin user profile management and role updates
 */
export const userService = {
  /**
   * Fetch all user profiles (Admin)
   */
  async getAllUsers() {
    if (!isSupabaseConfigured()) return [];
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  /**
   * Update user role (user, organizer, admin)
   */
  async updateUserRole(userId, newRole) {
    if (!isSupabaseConfigured() || !userId) return null;

    // Safety check: Prevent demoting the last remaining admin
    if (newRole !== 'admin') {
      const { data: admins } = await supabase
        .from('profiles')
        .select('id')
        .eq('role', 'admin');

      if (admins && admins.length <= 1 && admins[0].id === userId) {
        throw new Error('Action blocked: Cannot demote the last remaining administrator account.');
      }
    }

    const { data, error } = await supabase
      .from('profiles')
      .update({ role: newRole })
      .eq('id', userId)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  /**
   * Delete user profile (Admin)
   */
  async deleteUser(userId) {
    if (!isSupabaseConfigured() || !userId) return true;
    const { error } = await supabase
      .from('profiles')
      .delete()
      .eq('id', userId);

    if (error) throw error;
    return true;
  }
};

import { supabase, isSupabaseConfigured } from '../lib/supabase';

/**
 * Auth Service - Handles authentication, session state, and profile fetch
 */
export const authService = {
  /**
   * User Sign Up
   */
  async signUp({ email, password, fullName, phone, role = 'user' }) {
    if (!isSupabaseConfigured()) {
      return {
        user: { id: 'mock-user-1', email, user_metadata: { full_name: fullName, role } },
        session: { access_token: 'mock-token' },
        error: null,
      };
    }

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
          phone,
          role,
        },
      },
    });

    if (error) throw error;
    return data;
  },

  /**
   * User Sign In / Login
   */
  async signIn({ email, password }) {
    if (!isSupabaseConfigured()) {
      const mockProfile = { id: 'mock-user-1', email, full_name: email.split('@')[0], role: email.includes('admin') ? 'admin' : 'user' };
      return {
        user: mockProfile,
        session: { access_token: 'mock-token' },
        profile: mockProfile,
        error: null,
      };
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;

    // Fetch user profile
    const profile = await this.getUserProfile(data.user.id);
    return { ...data, profile };
  },

  /**
   * User Sign Out / Logout
   */
  async signOut() {
    if (!isSupabaseConfigured()) return { error: null };
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    return { error: null };
  },

  /**
   * Send Password Reset Email
   */
  async resetPassword(email) {
    if (!isSupabaseConfigured()) return { error: null };
    const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    if (error) throw error;
    return data;
  },

  /**
   * Get Current Session User
   */
  async getCurrentUser() {
    if (!isSupabaseConfigured()) return null;
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user) return null;

    const profile = await this.getUserProfile(session.user.id);
    return { ...session.user, profile };
  },

  /**
   * Get Profile from public.profiles
   */
  async getUserProfile(userId) {
    if (!isSupabaseConfigured() || !userId) return null;
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .maybeSingle();

    if (error) {
      console.warn('Error fetching profile:', error.message);
      return null;
    }
    return data;
  },

  /**
   * Listen to Auth State Changes
   */
  onAuthStateChange(callback) {
    if (!isSupabaseConfigured()) {
      return { unsubscribe: () => {} };
    }
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      let profile = null;
      if (session?.user) {
        profile = await this.getUserProfile(session.user.id);
      }
      callback(event, session, profile);
    });
    return subscription;
  }
};

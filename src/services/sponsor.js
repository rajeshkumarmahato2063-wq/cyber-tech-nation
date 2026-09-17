import { supabase, isSupabaseConfigured } from '../lib/supabase';

/**
 * Sponsor Service - Handles public sponsor retrieval and admin sponsor management
 */
export const sponsorService = {
  /**
   * Fetch all active sponsors
   */
  async getSponsors() {
    if (!isSupabaseConfigured()) return null;
    const { data, error } = await supabase
      .from('sponsors')
      .select('*')
      .order('display_order', { ascending: true });

    if (error) {
      console.warn('Sponsors query fallback:', error.message);
      return null;
    }
    return data;
  },

  /**
   * Add a new sponsor (Admin)
   */
  async addSponsor({ name, logoUrl, website, tier = 'Gold', displayOrder = 0 }) {
    if (!isSupabaseConfigured()) return null;
    const { data, error } = await supabase
      .from('sponsors')
      .insert([
        {
          name,
          logo_url: logoUrl,
          website,
          tier,
          display_order: displayOrder,
        },
      ])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  /**
   * Delete sponsor by ID (Admin)
   */
  async deleteSponsor(id) {
    if (!isSupabaseConfigured() || !id) return true;
    const { error } = await supabase
      .from('sponsors')
      .delete()
      .eq('id', id);

    if (error) throw error;
    return true;
  }
};

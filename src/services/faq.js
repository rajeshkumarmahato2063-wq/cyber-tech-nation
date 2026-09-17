import { supabase, isSupabaseConfigured } from '../lib/supabase';

/**
 * FAQ Service - Handles public FAQ retrieval and admin FAQ management
 */
export const faqService = {
  /**
   * Fetch all active FAQs
   */
  async getFAQs() {
    if (!isSupabaseConfigured()) return null;
    const { data, error } = await supabase
      .from('faq')
      .select('*')
      .order('display_order', { ascending: true });

    if (error) {
      console.warn('FAQ query fallback:', error.message);
      return null;
    }
    return data;
  },

  /**
   * Add a new FAQ entry (Admin)
   */
  async addFAQ({ question, answer, displayOrder = 0 }) {
    if (!isSupabaseConfigured()) return null;
    const { data, error } = await supabase
      .from('faq')
      .insert([
        {
          question,
          answer,
          display_order: displayOrder,
        },
      ])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  /**
   * Delete FAQ entry by ID (Admin)
   */
  async deleteFAQ(id) {
    if (!isSupabaseConfigured() || !id) return true;
    const { error } = await supabase
      .from('faq')
      .delete()
      .eq('id', id);

    if (error) throw error;
    return true;
  }
};

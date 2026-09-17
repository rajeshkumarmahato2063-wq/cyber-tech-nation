import { supabase, isSupabaseConfigured } from '../lib/supabase';

/**
 * Contact Service - Handles inquiry submissions and admin contact retrieval
 */
export const contactService = {
  /**
   * Submit a new contact message
   */
  async submitContactMessage({ name, email, subject, message }) {
    if (!isSupabaseConfigured()) {
      return { id: 'mock-contact-id', name, email, subject, message, created_at: new Date().toISOString() };
    }

    const { data, error } = await supabase
      .from('contacts')
      .insert([
        {
          name: name.trim(),
          email: email.trim(),
          subject: subject.trim(),
          message: message.trim(),
        }
      ])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  /**
   * Get all submitted contact messages (Admin)
   */
  async getContactMessages() {
    if (!isSupabaseConfigured()) return [];
    const { data, error } = await supabase
      .from('contacts')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  }
};

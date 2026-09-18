import { supabase } from '../lib/supabase';

/**
 * Real-time Announcements Service
 */

export const getAnnouncements = async () => {
  try {
    const { data, error } = await supabase
      .from('announcements')
      .select('*')
      .order('is_pinned', { ascending: false })
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (err) {
    console.warn('[Announcements Service] Error fetching announcements:', err.message);
    return [];
  }
};

export const createAnnouncement = async (payload) => {
  const { data, error } = await supabase
    .from('announcements')
    .insert([payload])
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const updateAnnouncement = async (id, payload) => {
  const { data, error } = await supabase
    .from('announcements')
    .update({ ...payload, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const deleteAnnouncement = async (id) => {
  const { error } = await supabase
    .from('announcements')
    .delete()
    .eq('id', id);

  if (error) throw error;
  return true;
};

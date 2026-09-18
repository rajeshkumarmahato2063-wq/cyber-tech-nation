import { supabase, isSupabaseConfigured } from '../lib/supabase';

/**
 * In-App Notification Center Service
 */

/**
 * Get user notifications list
 * @param {string} userId 
 */
export const getUserNotifications = async (userId) => {
  if (!isSupabaseConfigured() || !userId) return [];

  try {
    const { data, error } = await supabase
      .from('notifications')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (err) {
    console.warn('[Notifications Service] Error fetching notifications:', err.message);
    return [];
  }
};

/**
 * Send in-app notification to a user
 */
export const sendNotification = async ({ userId, title, message, type = 'info', link = null }) => {
  if (!isSupabaseConfigured() || !userId) return null;

  try {
    const { data, error } = await supabase
      .from('notifications')
      .insert([{
        user_id: userId,
        title,
        message,
        type,
        link,
        read: false
      }])
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (err) {
    console.warn('[Notifications Service] Error sending notification:', err.message);
    return null;
  }
};

/**
 * Mark a notification as read
 */
export const markNotificationRead = async (id) => {
  if (!isSupabaseConfigured() || !id) return;

  try {
    await supabase
      .from('notifications')
      .update({ read: true })
      .eq('id', id);
  } catch (err) {
    console.warn('[Notifications Service] Error marking notification read:', err.message);
  }
};

/**
 * Delete a notification
 */
export const deleteNotification = async (id) => {
  if (!isSupabaseConfigured() || !id) return;

  try {
    await supabase
      .from('notifications')
      .delete()
      .eq('id', id);
  } catch (err) {
    console.warn('[Notifications Service] Error deleting notification:', err.message);
  }
};

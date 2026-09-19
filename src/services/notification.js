import { supabase, isSupabaseConfigured } from '../lib/supabase';

let MOCK_NOTIFICATIONS = [
  {
    id: 'n1',
    user_id: 'u1',
    title: 'New Teammate Recommendation',
    message: 'Priya Patel (BITS Pilani) shares your interest in Web3 & AI.',
    type: 'recommendation',
    is_read: false,
    created_at: new Date(Date.now() - 600000).toISOString()
  },
  {
    id: 'n2',
    user_id: 'u1',
    title: 'Join Request Received',
    message: 'Rohan Mehta requested to join your team "Neural Matrix".',
    type: 'join_request',
    is_read: false,
    created_at: new Date(Date.now() - 3600000).toISOString()
  }
];

export const notificationService = {
  // Fetch Notifications for current user
  async getUserNotifications(userId) {
    if (!userId) return [];

    if (!isSupabaseConfigured()) {
      return MOCK_NOTIFICATIONS.filter(n => n.user_id === userId || n.user_id === 'u1');
    }

    try {
      const { data, error } = await supabase
        .from('team_match_notifications')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (err) {
      return MOCK_NOTIFICATIONS.filter(n => n.user_id === userId || n.user_id === 'u1');
    }
  },

  // Create Notification
  async createNotification(notificationData) {
    const notif = {
      id: `n_${Date.now()}`,
      is_read: false,
      created_at: new Date().toISOString(),
      ...notificationData
    };

    if (!isSupabaseConfigured()) {
      MOCK_NOTIFICATIONS.unshift(notif);
      return notif;
    }

    try {
      const { data, error } = await supabase
        .from('team_match_notifications')
        .insert(notificationData)
        .select()
        .single();
      if (error) throw error;
      return data;
    } catch (err) {
      MOCK_NOTIFICATIONS.unshift(notif);
      return notif;
    }
  },

  // Mark notification as read
  async markAsRead(notificationId) {
    if (!isSupabaseConfigured()) {
      const item = MOCK_NOTIFICATIONS.find(n => n.id === notificationId);
      if (item) item.is_read = true;
      return item;
    }

    const { data, error } = await supabase
      .from('team_match_notifications')
      .update({ is_read: true })
      .eq('id', notificationId)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Real-time Notification Subscription
  subscribeToNotifications(userId, onNotification) {
    if (!isSupabaseConfigured() || !userId) {
      return { unsubscribe: () => {} };
    }

    const channel = supabase
      .channel(`notifications_${userId}`)
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'team_match_notifications',
        filter: `user_id=eq.${userId}`
      }, (payload) => {
        onNotification(payload.new);
      })
      .subscribe();

    return channel;
  }
};

export default notificationService;

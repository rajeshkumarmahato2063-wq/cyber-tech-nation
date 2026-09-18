import { useState, useEffect } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { getUserNotifications, markNotificationRead, deleteNotification } from '../services/notifications';

/**
 * Custom Hook for Realtime User In-App Notification Stream
 * @param {string} userId 
 */
export const useNotifications = (userId) => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (!userId || !isSupabaseConfigured()) return;

    // 1. Initial fetch
    loadNotifications();

    // 2. Realtime listener
    const channel = supabase
      .channel(`user-notifications-${userId}`)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'notifications', filter: `user_id=eq.${userId}` }, () => {
        loadNotifications();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId]);

  const loadNotifications = async () => {
    if (!userId) {
      setNotifications([]);
      setUnreadCount(0);
      return;
    }
    try {
      const list = await getUserNotifications(userId);
      const safeList = Array.isArray(list) ? list : [];
      setNotifications(safeList);
      setUnreadCount(safeList.filter((n) => Boolean(n && !n.read)).length);
    } catch (err) {
      console.warn('[useNotifications] Fallback:', err);
      setNotifications([]);
      setUnreadCount(0);
    }
  };

  const handleMarkRead = async (id) => {
    await markNotificationRead(id);
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
    setUnreadCount(prev => Math.max(0, prev - 1));
  };

  const handleDelete = async (id) => {
    await deleteNotification(id);
    setNotifications(prev => prev.filter(n => n.id !== id));
    setUnreadCount(prev => notifications.find(n => n.id === id && !n.read) ? Math.max(0, prev - 1) : prev);
  };

  return {
    notifications,
    unreadCount,
    markRead: handleMarkRead,
    deleteNotification: handleDelete,
    refreshNotifications: loadNotifications
  };
};

export default useNotifications;

import React, { useState, useEffect } from 'react';
import { Bell, Check, Sparkles, UserPlus, MessageSquare, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import notificationService from '../../services/notification';

const NotificationBell = ({ user, onOpenRequests }) => {
  const [notifications, setNotifications] = useState([]);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (!user) return;
    const userId = user.id || 'u1';

    const loadNotifications = async () => {
      const items = await notificationService.getUserNotifications(userId);
      setNotifications(items);
    };
    loadNotifications();

    const sub = notificationService.subscribeToNotifications(userId, (newNotif) => {
      setNotifications(prev => [newNotif, ...prev]);
    });

    return () => {
      if (sub && sub.unsubscribe) sub.unsubscribe();
    };
  }, [user]);

  const unreadCount = notifications.filter(n => !n.is_read).length;

  const handleMarkAsRead = async (id) => {
    await notificationService.markAsRead(id);
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, is_read: true } : n));
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'join_request': return <UserPlus className="w-4 h-4 text-cyan-400" />;
      case 'recommendation': return <Sparkles className="w-4 h-4 text-purple-400" />;
      case 'chat_message': return <MessageSquare className="w-4 h-4 text-emerald-400" />;
      default: return <Bell className="w-4 h-4 text-cyan-400" />;
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white relative transition-all cursor-pointer"
        title="Team Match Notifications"
      >
        <Bell className="w-4 h-4" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-cyan-500 text-[10px] font-mono font-bold text-black flex items-center justify-center animate-pulse">
            {unreadCount}
          </span>
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="absolute right-0 mt-2 w-80 lg:w-96 glass-card rounded-2xl p-4 border border-white/10 shadow-2xl z-50 text-xs font-sans"
          >
            <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-3">
              <h4 className="font-title font-bold text-sm text-white flex items-center gap-1.5">
                <Bell className="w-4 h-4 text-cyan-400" /> Notifications
              </h4>
              <span className="text-[10px] font-mono text-cyan-300 bg-cyan-500/10 px-2 py-0.5 rounded-full">
                {unreadCount} Unread
              </span>
            </div>

            <div className="max-h-72 overflow-y-auto space-y-2">
              {notifications.length === 0 ? (
                <div className="py-6 text-center text-slate-400 font-mono text-xs">
                  No new notifications yet.
                </div>
              ) : (
                notifications.map((notif) => (
                  <div
                    key={notif.id}
                    onClick={() => handleMarkAsRead(notif.id)}
                    className={`p-3 rounded-xl border transition-all cursor-pointer ${
                      notif.is_read
                        ? 'bg-white/5 border-white/5 text-slate-400'
                        : 'bg-cyan-500/10 border-cyan-500/30 text-white'
                    }`}
                  >
                    <div className="flex items-start gap-2.5">
                      <div className="mt-0.5">{getNotificationIcon(notif.type)}</div>
                      <div className="flex-1 min-w-0">
                        <div className="font-bold text-xs truncate text-cyan-300">{notif.title}</div>
                        <p className="text-[11px] text-slate-300 mt-0.5 line-clamp-2">{notif.message}</p>
                        <span className="text-[9px] font-mono text-slate-400 block mt-1">
                          {new Date(notif.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {onOpenRequests && (
              <div className="pt-3 mt-3 border-t border-white/10 text-center">
                <button
                  onClick={() => {
                    setIsOpen(false);
                    onOpenRequests();
                  }}
                  className="text-xs font-mono text-cyan-300 hover:text-cyan-200 underline cursor-pointer"
                >
                  Manage All Join Requests & Teams →
                </button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default NotificationBell;

import React, { useState } from 'react';
import { Bell, Check, Trash2, ShieldAlert } from 'lucide-react';
import useNotifications from '../hooks/useNotifications';

/**
 * In-App Notification Bell & Inbox Dropdown Component
 */
const NotificationBell = ({ user }) => {
  const [open, setOpen] = useState(false);
  const { notifications, unreadCount, markRead, deleteNotification } = useNotifications(user?.id);

  if (!user) return null;

  const safeNotifications = Array.isArray(notifications) ? notifications : [];

  return (
    <div className="relative font-mono">
      <button
        onClick={() => setOpen(!open)}
        className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-cyan-400 hover:bg-white/10 transition-all relative cursor-pointer"
        aria-label="Notifications"
        title="View Notifications"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-cyan-400 text-[#050816] font-bold text-[10px] flex items-center justify-center animate-pulse shadow-[0_0_10px_#00E5FF]">
            {unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-[#070C1A] border border-cyan-500/40 rounded-2xl p-4 shadow-[0_0_40px_rgba(0,229,255,0.25)] z-50 text-xs">
          <div className="flex items-center justify-between pb-3 border-b border-white/10">
            <span className="font-bold text-white flex items-center gap-1.5">
              <Bell className="w-4 h-4 text-cyan-400" /> Notifications Inbox
            </span>
            <span className="text-[10px] text-cyan-400 font-semibold">{unreadCount} Unread</span>
          </div>

          <div className="space-y-2 mt-3 max-h-72 overflow-y-auto pr-1">
            {safeNotifications.length === 0 ? (
              <div className="p-6 text-center text-slate-500 text-[11px]">No notifications in inbox.</div>
            ) : (
              safeNotifications.map((item) => (
                <div
                  key={item.id}
                  className={`p-3 rounded-xl border transition-all space-y-1.5 ${
                    item.read
                      ? 'bg-white/5 border-white/5 opacity-70'
                      : 'bg-cyan-500/10 border-cyan-500/30'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white text-xs">{item.title}</span>
                    <div className="flex items-center gap-1">
                      {!item.read && (
                        <button
                          onClick={() => markRead(item.id)}
                          className="p-1 rounded bg-white/10 text-emerald-400 hover:bg-white/20"
                          title="Mark Read"
                        >
                          <Check className="w-3 h-3" />
                        </button>
                      )}
                      <button
                        onClick={() => deleteNotification(item.id)}
                        className="p-1 rounded bg-white/10 text-rose-400 hover:bg-white/20"
                        title="Delete"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                  <p className="text-slate-300 text-[11px] leading-relaxed">{item.message}</p>
                  <div className="text-[9px] text-slate-500">{new Date(item.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationBell;

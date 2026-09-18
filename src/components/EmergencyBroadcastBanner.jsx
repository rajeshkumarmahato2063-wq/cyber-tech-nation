import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertOctagon, Wifi, MapPin, ShieldAlert, X, Volume2 } from 'lucide-react';
import { getEventState } from '../services/liveOps';
import { supabase } from '../lib/supabase';

/**
 * Global Emergency Broadcast Banner Component
 * Displays urgent event notices (WiFi pass, venue updates, emergency alerts)
 */
export default function EmergencyBroadcastBanner() {
  const [broadcast, setBroadcast] = useState(null);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    fetchBroadcast();

    // Subscribe to realtime event_state changes
    const channel = supabase
      .channel('emergency_broadcast_channel')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'event_state' }, (payload) => {
        if (payload.new && payload.new.emergency_broadcast) {
          setBroadcast(payload.new.emergency_broadcast);
          setDismissed(false);
        }
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchBroadcast = async () => {
    try {
      const state = await getEventState();
      if (state?.emergency_broadcast?.enabled) {
        setBroadcast(state.emergency_broadcast);
      }
    } catch (err) {
      // Ignore fallback
    }
  };

  if (!broadcast || !broadcast.enabled || dismissed) return null;

  const getIcon = () => {
    switch (broadcast.level) {
      case 'urgent':
        return <AlertOctagon className="w-5 h-5 text-red-400 animate-pulse" />;
      case 'warning':
        return <ShieldAlert className="w-5 h-5 text-amber-400" />;
      default:
        return <Volume2 className="w-5 h-5 text-cyan-400" />;
    }
  };

  const getStyle = () => {
    switch (broadcast.level) {
      case 'urgent':
        return 'bg-gradient-to-r from-red-950/90 via-rose-900/90 to-red-950/90 border-red-500/60 text-red-200 shadow-[0_0_30px_rgba(239,68,68,0.4)]';
      case 'warning':
        return 'bg-gradient-to-r from-amber-950/90 via-yellow-900/90 to-amber-950/90 border-amber-500/60 text-amber-200 shadow-[0_0_30px_rgba(245,158,11,0.4)]';
      default:
        return 'bg-gradient-to-r from-cyan-950/90 via-blue-900/90 to-purple-950/90 border-cyan-500/60 text-cyan-200 shadow-[0_0_30px_rgba(6,182,212,0.4)]';
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: -50, opacity: 0 }}
        className={`fixed top-0 left-0 right-0 z-[999999] border-b backdrop-blur-md px-4 py-3 font-sans text-xs sm:text-sm flex items-center justify-between gap-3 ${getStyle()}`}
      >
        <div className="max-w-6xl mx-auto w-full flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-black/40 border border-white/10 shrink-0">
              {getIcon()}
            </div>
            <div>
              <span className="font-bold tracking-wider uppercase mr-2 text-white flex-inline items-center gap-1">
                🚨 {broadcast.title || 'EMERGENCY BROADCAST'}:
              </span>
              <span className="font-medium">{broadcast.message}</span>
            </div>
          </div>

          <button
            onClick={() => setDismissed(true)}
            className="p-1.5 rounded-lg bg-black/40 border border-white/20 hover:bg-white/10 text-white transition-all shrink-0"
            title="Dismiss Announcement"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

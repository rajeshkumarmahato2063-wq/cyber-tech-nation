import { useEffect } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

/**
 * Reusable Supabase Realtime Subscription Hook
 * @param {string} table - Database table name
 * @param {Function} callback - Event trigger callback
 */

export const useRealtime = (table, callback) => {
  useEffect(() => {
    if (!isSupabaseConfigured() || !table) return;

    const channel = supabase
      .channel(`realtime-${table}`)
      .on('postgres_changes', { event: '*', schema: 'public', table }, (payload) => {
        if (callback) callback(payload);
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [table, callback]);
};

export default useRealtime;

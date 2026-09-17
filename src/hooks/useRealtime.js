import { useEffect } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

/**
 * Custom useRealtime Hook - Listens to Supabase Realtime channel updates
 * 
 * @param {Array<string>} tables List of table names to listen to
 * @param {Function} onUpdate Callback function when changes occur
 */
export const useRealtime = (tables = ['registrations', 'contacts', 'teams'], onUpdate) => {
  useEffect(() => {
    if (!isSupabaseConfigured() || !tables || tables.length === 0 || typeof onUpdate !== 'function') {
      return;
    }

    const channelName = `realtime-${tables.join('-')}-${Date.now()}`;
    let channel = supabase.channel(channelName);

    tables.forEach((table) => {
      channel = channel.on(
        'postgres_changes',
        { event: '*', schema: 'public', table },
        (payload) => {
          onUpdate(payload);
        }
      );
    });

    channel.subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [tables, onUpdate]);
};

export default useRealtime;

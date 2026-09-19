import { useState, useEffect, useCallback } from 'react';
import { eventService, FALLBACK_EVENTS } from '../services/events';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

export function useEvent(slug = null) {
  const [events, setEvents] = useState(FALLBACK_EVENTS);
  const [currentEvent, setCurrentEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const loadEvents = useCallback(async () => {
    setLoading(true);
    try {
      const data = await eventService.getEvents(statusFilter, searchTerm);
      setEvents(data);
    } catch (err) {
      setError(err.message);
      setEvents(FALLBACK_EVENTS);
    } finally {
      setLoading(false);
    }
  }, [statusFilter, searchTerm]);

  const loadEventBySlug = useCallback(async (targetSlug) => {
    if (!targetSlug) return;
    setLoading(true);
    try {
      const data = await eventService.getEventBySlug(targetSlug);
      setCurrentEvent(data);
    } catch (err) {
      setError(err.message);
      const fallback = FALLBACK_EVENTS.find(e => e.slug === targetSlug) || FALLBACK_EVENTS[0];
      setCurrentEvent(fallback);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadEvents();
  }, [loadEvents]);

  useEffect(() => {
    if (slug) {
      loadEventBySlug(slug);
    }
  }, [slug, loadEventBySlug]);

  // Realtime subscription for event changes
  useEffect(() => {
    if (!isSupabaseConfigured()) return;

    const channel = supabase
      .channel('events-realtime-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'events' }, () => {
        loadEvents();
        if (slug) loadEventBySlug(slug);
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [loadEvents, loadEventBySlug, slug]);

  return {
    events,
    currentEvent,
    loading,
    error,
    statusFilter,
    setStatusFilter,
    searchTerm,
    setSearchTerm,
    refreshEvents: loadEvents,
    refreshCurrentEvent: () => loadEventBySlug(slug)
  };
}

export default useEvent;

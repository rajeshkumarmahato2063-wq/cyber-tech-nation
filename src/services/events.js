import { supabase, isSupabaseConfigured } from '../lib/supabase';

// Fallback Mock Events for offline/demo modes
export const FALLBACK_EVENTS = [
  {
    id: 'a0000000-0000-0000-0000-000000000001',
    name: 'ZayaThon 2026',
    slug: 'zayathon-2026',
    theme: 'Next-Gen AI & Cyber Security Hackathon',
    description: 'The premier flagship national hackathon empowering creators, engineers, and visionaries to build groundbreaking software.',
    banner_image: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1200&q=80',
    start_date: new Date(Date.now() - 24 * 3600 * 1000).toISOString(),
    end_date: new Date(Date.now() + 48 * 3600 * 1000).toISOString(),
    registration_deadline: new Date(Date.now() + 12 * 3600 * 1000).toISOString(),
    venue: 'Main Campus Arena & Discord',
    prize_pool: '$15,000 USD',
    max_teams: 150,
    status: 'live',
    created_at: new Date().toISOString()
  },
  {
    id: 'a0000000-0000-0000-0000-000000000002',
    name: 'AI Sprint 2027',
    slug: 'ai-sprint-2027',
    theme: 'Generative AI & LLM Agentic Workflows',
    description: '48-hour intensive building challenge focusing on LLMs, autonomous agents, and computer vision innovation.',
    banner_image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80',
    start_date: new Date(Date.now() + 30 * 24 * 3600 * 1000).toISOString(),
    end_date: new Date(Date.now() + 32 * 24 * 3600 * 1000).toISOString(),
    registration_deadline: new Date(Date.now() + 25 * 24 * 3600 * 1000).toISOString(),
    venue: 'Virtual Innovation Hub',
    prize_pool: '$10,000 USD',
    max_teams: 100,
    status: 'published',
    created_at: new Date().toISOString()
  },
  {
    id: 'a0000000-0000-0000-0000-000000000003',
    name: 'Web3 HackFest 2025',
    slug: 'web3-hackfest',
    theme: 'DeFi, Smart Contracts & Zero Knowledge Proofs',
    description: 'Our inaugural blockchain hackathon where 80+ teams built decentralized financial infrastructure and privacy protocols.',
    banner_image: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?auto=format&fit=crop&w=1200&q=80',
    start_date: new Date(Date.now() - 90 * 24 * 3600 * 1000).toISOString(),
    end_date: new Date(Date.now() - 88 * 24 * 3600 * 1000).toISOString(),
    registration_deadline: new Date(Date.now() - 95 * 24 * 3600 * 1000).toISOString(),
    venue: 'Crypto Convention Hub',
    prize_pool: '$25,000 USD',
    max_teams: 80,
    status: 'completed',
    created_at: new Date().toISOString()
  }
];

export const eventService = {
  /**
   * Fetch all events with optional status or search filter
   */
  async getEvents(status = 'all', search = '') {
    if (!isSupabaseConfigured()) {
      let filtered = [...FALLBACK_EVENTS];
      if (status !== 'all') {
        filtered = filtered.filter(e => e.status === status);
      }
      if (search) {
        filtered = filtered.filter(e =>
          e.name.toLowerCase().includes(search.toLowerCase()) ||
          e.theme.toLowerCase().includes(search.toLowerCase())
        );
      }
      return filtered;
    }

    try {
      let query = supabase.from('events').select('*').order('created_at', { ascending: false });
      if (status !== 'all') {
        query = query.eq('status', status);
      }
      if (search) {
        query = query.ilike('name', `%${search}%`);
      }
      const { data, error } = await query;
      if (error || !data || data.length === 0) {
        console.warn('Supabase events fetch warning, falling back:', error?.message);
        return FALLBACK_EVENTS;
      }
      return data;
    } catch (err) {
      console.error('Error fetching events:', err);
      return FALLBACK_EVENTS;
    }
  },

  /**
   * Get single event by slug
   */
  async getEventBySlug(slug) {
    if (!isSupabaseConfigured()) {
      return FALLBACK_EVENTS.find(e => e.slug === slug) || FALLBACK_EVENTS[0];
    }
    try {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .eq('slug', slug)
        .single();
      
      if (error || !data) {
        const found = FALLBACK_EVENTS.find(e => e.slug === slug);
        return found || FALLBACK_EVENTS[0];
      }
      return data;
    } catch (err) {
      return FALLBACK_EVENTS.find(e => e.slug === slug) || FALLBACK_EVENTS[0];
    }
  },

  /**
   * Create new hackathon event
   */
  async createEvent(eventData) {
    const slug = eventData.slug || eventData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const payload = {
      name: eventData.name,
      slug,
      theme: eventData.theme || 'Innovate & Build',
      description: eventData.description || '',
      banner_image: eventData.banner_image || 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1200&q=80',
      start_date: eventData.start_date || new Date().toISOString(),
      end_date: eventData.end_date || new Date(Date.now() + 48 * 3600 * 1000).toISOString(),
      registration_deadline: eventData.registration_deadline || new Date(Date.now() + 24 * 3600 * 1000).toISOString(),
      venue: eventData.venue || 'Online Arena',
      prize_pool: eventData.prize_pool || '$5,000 USD',
      max_teams: parseInt(eventData.max_teams || 100, 10),
      status: eventData.status || 'draft',
      created_by: eventData.created_by || null
    };

    if (!isSupabaseConfigured()) {
      const newEvent = { ...payload, id: `mock-${Date.now()}`, created_at: new Date().toISOString() };
      FALLBACK_EVENTS.unshift(newEvent);
      return newEvent;
    }

    const { data, error } = await supabase.from('events').insert([payload]).select().single();
    if (error) throw new Error(error.message);
    return data;
  },

  /**
   * Edit event details
   */
  async updateEvent(id, updates) {
    if (!isSupabaseConfigured()) {
      const idx = FALLBACK_EVENTS.findIndex(e => e.id === id);
      if (idx !== -1) {
        FALLBACK_EVENTS[idx] = { ...FALLBACK_EVENTS[idx], ...updates, updated_at: new Date().toISOString() };
        return FALLBACK_EVENTS[idx];
      }
      return updates;
    }

    const { data, error } = await supabase
      .from('events')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();

    if (error) throw new Error(error.message);
    return data;
  },

  /**
   * Publish or unpublish an event
   */
  async setPublishStatus(id, status) {
    return this.updateEvent(id, { status });
  },

  /**
   * Duplicate previous event as a template/new event
   */
  async duplicateEvent(eventId, newName) {
    const source = await this.getEventBySlug(eventId) || FALLBACK_EVENTS[0];
    const name = newName || `${source.name} (Copy)`;
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') + `-${Date.now().toString().slice(-4)}`;

    const newEventData = {
      ...source,
      id: undefined,
      name,
      slug,
      status: 'draft',
      created_at: undefined
    };

    return this.createEvent(newEventData);
  },

  /**
   * Archive completed event
   */
  async archiveEvent(id) {
    return this.updateEvent(id, { status: 'archived' });
  },

  /**
   * Fetch event templates
   */
  async getTemplates() {
    if (!isSupabaseConfigured()) {
      return [
        {
          id: 'tmpl-1',
          title: 'AI & Machine Learning Hackathon Template',
          description: 'Pre-configured timeline, sponsors, prizes and FAQs for AI code sprints.',
          timeline_data: [
            { time_label: '09:00 AM', activity: 'Registration & Check-in' },
            { time_label: '10:00 AM', activity: 'Keynote & AI Problem Statement Release' },
            { time_label: '11:00 AM', activity: 'Hacking Sprint Commences' },
            { time_label: '06:00 PM', activity: 'Final Submissions & Pitching' }
          ]
        },
        {
          id: 'tmpl-2',
          title: 'Web3 & Blockchain HackFest Template',
          description: 'Full stack decentralized application template with smart contract evaluation standards.',
          timeline_data: [
            { time_label: '10:00 AM', activity: 'Opening Ceremony & Bounty Briefing' },
            { time_label: '11:00 AM', activity: 'Smart Contract Workshop' },
            { time_label: '05:00 PM', activity: 'Live Pitching Session' }
          ]
        }
      ];
    }

    try {
      const { data, error } = await supabase.from('event_templates').select('*');
      if (error || !data) return [];
      return data;
    } catch {
      return [];
    }
  }
};

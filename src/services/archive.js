import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { FALLBACK_EVENTS } from './events';

export const archiveService = {
  /**
   * Fetch list of completed and archived hackathons
   */
  async getArchivedEvents() {
    if (!isSupabaseConfigured()) {
      return FALLBACK_EVENTS.filter(e => e.status === 'completed' || e.status === 'archived');
    }

    try {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .in('status', ['completed', 'archived'])
        .order('end_date', { ascending: false });

      if (error || !data || data.length === 0) {
        return FALLBACK_EVENTS.filter(e => e.status === 'completed' || e.status === 'archived');
      }

      return data;
    } catch (err) {
      console.error('Error fetching archive events:', err);
      return FALLBACK_EVENTS.filter(e => e.status === 'completed' || e.status === 'archived');
    }
  },

  /**
   * Fetch detailed archive assets (winners, gallery, highlights)
   */
  async getArchiveDetails(eventId) {
    const mockDetails = {
      winners: [
        {
          rank: '1st Place',
          team_name: 'Quantum Guard',
          project_title: 'Decentralized ZK Threat Detection Protocol',
          domain: 'Cyber Security & Web3',
          members: ['Alex Rivera', 'Sarah Chen', 'Marcus Vance'],
          prize: '$12,000 USD'
        },
        {
          rank: '2nd Place',
          team_name: 'Neural Mesh',
          project_title: 'Autonomous Edge AI Multi-Agent Network',
          domain: 'Artificial Intelligence',
          members: ['David Kim', 'Elena Rostova'],
          prize: '$8,000 USD'
        },
        {
          rank: '3rd Place',
          team_name: 'BioPulse',
          project_title: 'Predictive Medical Diagnostic Vision Engine',
          domain: 'HealthTech & AI',
          members: ['Rohan Sharma', 'Priya Patel', 'Leo Zhang'],
          prize: '$5,000 USD'
        }
      ],
      gallery: [
        {
          id: 'gal-1',
          title: 'Opening Ceremony Keynote',
          image_url: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=800&q=80',
          category: 'Ceremony',
          caption: 'Over 500 hackers attending the grand keynote presentation.'
        },
        {
          id: 'gal-2',
          title: 'Midnight Coding Sprint',
          image_url: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=800&q=80',
          category: 'Hacking',
          caption: 'Teams collaborating during the 24-hour hacking phase.'
        },
        {
          id: 'gal-3',
          title: 'Winner Trophy Presentation',
          image_url: 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=800&q=80',
          category: 'Winners',
          caption: 'Team Quantum Guard accepting the Grand Prize trophy.'
        }
      ],
      stats: {
        total_participants: 450,
        total_projects_submitted: 92,
        total_prizes_distributed: '$25,000 USD',
        certificates_issued: 420
      }
    };

    if (!isSupabaseConfigured() || !eventId) {
      return mockDetails;
    }

    try {
      const { data: gallery } = await supabase.from('event_gallery').select('*').eq('event_id', eventId);
      return {
        ...mockDetails,
        gallery: gallery && gallery.length > 0 ? gallery : mockDetails.gallery
      };
    } catch {
      return mockDetails;
    }
  }
};

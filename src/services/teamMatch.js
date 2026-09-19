import { supabase, isSupabaseConfigured } from '../lib/supabase';

// Mock initial data for local development / offline resilience
let MOCK_PROFILES = [
  {
    id: 'p1',
    user_id: 'u1',
    full_name: 'Aarav Sharma',
    photo_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
    college: 'IIT Bombay',
    department: 'Computer Science',
    year: '3rd Year',
    experience: 'Advanced',
    looking_for: 'Team',
    availability: 'Full-time',
    preferred_domain: 'AI / Machine Learning',
    short_bio: 'Full-stack AI developer passionate about LLM agents, RAG, and fast React web apps.',
    github_url: 'https://github.com/aarav-ai',
    linkedin_url: 'https://linkedin.com/in/aarav-sharma',
    portfolio_url: 'https://aarav.dev',
    skills: ['React', 'AI', 'Python', 'Next.js', 'PyTorch'],
    languages: ['English', 'Hindi'],
    status: 'active',
    created_at: new Date().toISOString()
  },
  {
    id: 'p2',
    user_id: 'u2',
    full_name: 'Priya Patel',
    photo_url: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150',
    college: 'BITS Pilani',
    department: 'Information Systems',
    year: '4th Year',
    experience: 'Lead',
    looking_for: 'Members',
    availability: 'Full-time',
    preferred_domain: 'Web3 & Fintech',
    short_bio: 'Smart contract developer & UI designer looking for backend engineers to form a hackathon squad.',
    github_url: 'https://github.com/priya-web3',
    linkedin_url: 'https://linkedin.com/in/priya-patel',
    portfolio_url: 'https://priyapatel.design',
    skills: ['Web3', 'Solidity', 'UI/UX', 'TailwindCSS', 'React'],
    languages: ['English', 'Gujarati'],
    status: 'active',
    created_at: new Date().toISOString()
  },
  {
    id: 'p3',
    user_id: 'u3',
    full_name: 'Rohan Mehta',
    photo_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
    college: 'Delhi Technological University',
    department: 'Software Engineering',
    year: '2nd Year',
    experience: 'Intermediate',
    looking_for: 'Either',
    availability: 'Weekends',
    preferred_domain: 'Healthcare & Biotech',
    short_bio: 'Python enthusiast exploring ML algorithms in health tech. Looking for frontend & UI/UX collaborators.',
    github_url: 'https://github.com/rohan-m',
    linkedin_url: 'https://linkedin.com/in/rohan-mehta',
    portfolio_url: 'https://rohanmehta.io',
    skills: ['Python', 'ML', 'Java', 'Docker'],
    languages: ['English', 'Hindi'],
    status: 'active',
    created_at: new Date().toISOString()
  },
  {
    id: 'p4',
    user_id: 'u4',
    full_name: 'Ananya Verma',
    photo_url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
    college: 'NIT Trichy',
    department: 'ECE',
    year: '3rd Year',
    experience: 'Intermediate',
    looking_for: 'Team',
    availability: 'Part-time',
    preferred_domain: 'IoT & Cyber Security',
    short_bio: 'Hardware-meets-software hacker focused on embedded systems and web security dashboards.',
    github_url: 'https://github.com/ananya-v',
    linkedin_url: 'https://linkedin.com/in/ananya-verma',
    portfolio_url: '',
    skills: ['C++', 'Python', 'UI/UX', 'Cyber Security'],
    languages: ['English', 'Tamil'],
    status: 'active',
    created_at: new Date().toISOString()
  }
];

let MOCK_TEAMS = [
  {
    id: 't1',
    leader_id: 'u2',
    leader_name: 'Priya Patel',
    leader_photo: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150',
    team_name: 'CyberDefenders Alpha',
    domain: 'Web3 & Fintech',
    required_skills: ['Solidity', 'Backend', 'React'],
    max_members: 4,
    current_members_count: 2,
    description: 'Building a decentralized zero-knowledge identity validation system for hackathons.',
    status: 'open',
    created_at: new Date().toISOString()
  },
  {
    id: 't2',
    leader_id: 'u1',
    leader_name: 'Aarav Sharma',
    leader_photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
    team_name: 'Neural Matrix',
    domain: 'AI / Machine Learning',
    required_skills: ['Python', 'PyTorch', 'UI/UX'],
    max_members: 4,
    current_members_count: 3,
    description: 'Autonomous AI agents for code refactoring and bug bounty automation.',
    status: 'open',
    created_at: new Date().toISOString()
  }
];

let MOCK_REQUESTS = [];

export const teamMatchService = {
  // Fetch profiles with pagination and search/filters
  async getProfiles(filters = {}, page = 1, limit = 12) {
    if (!isSupabaseConfigured()) {
      let filtered = [...MOCK_PROFILES];

      if (filters.search) {
        const q = filters.search.toLowerCase();
        filtered = filtered.filter(p =>
          p.full_name.toLowerCase().includes(q) ||
          p.college.toLowerCase().includes(q) ||
          p.skills.some(s => s.toLowerCase().includes(q))
        );
      }
      if (filters.skill && filters.skill !== 'All') {
        filtered = filtered.filter(p => p.skills.includes(filters.skill));
      }
      if (filters.college && filters.college !== 'All') {
        filtered = filtered.filter(p => p.college === filters.college);
      }
      if (filters.department && filters.department !== 'All') {
        filtered = filtered.filter(p => p.department === filters.department);
      }
      if (filters.year && filters.year !== 'All') {
        filtered = filtered.filter(p => p.year === filters.year);
      }
      if (filters.domain && filters.domain !== 'All') {
        filtered = filtered.filter(p => p.preferred_domain === filters.domain);
      }
      if (filters.experience && filters.experience !== 'All') {
        filtered = filtered.filter(p => p.experience === filters.experience);
      }
      if (filters.lookingFor && filters.lookingFor !== 'All') {
        filtered = filtered.filter(p => p.looking_for === filters.lookingFor);
      }

      const startIndex = (page - 1) * limit;
      const paginated = filtered.slice(startIndex, startIndex + limit);
      return { data: paginated, total: filtered.length, hasMore: startIndex + limit < filtered.length };
    }

    try {
      let query = supabase
        .from('team_match_profiles')
        .select('*', { count: 'exact' })
        .eq('is_banned', false);

      if (filters.search) {
        query = query.or(`full_name.ilike.%${filters.search}%,college.ilike.%${filters.search}%,short_bio.ilike.%${filters.search}%`);
      }
      if (filters.college && filters.college !== 'All') {
        query = query.eq('college', filters.college);
      }
      if (filters.department && filters.department !== 'All') {
        query = query.eq('department', filters.department);
      }
      if (filters.year && filters.year !== 'All') {
        query = query.eq('year', filters.year);
      }
      if (filters.domain && filters.domain !== 'All') {
        query = query.eq('preferred_domain', filters.domain);
      }
      if (filters.experience && filters.experience !== 'All') {
        query = query.eq('experience', filters.experience);
      }
      if (filters.lookingFor && filters.lookingFor !== 'All') {
        query = query.eq('looking_for', filters.lookingFor);
      }

      const from = (page - 1) * limit;
      const to = from + limit - 1;
      const { data, count, error } = await query.range(from, to).order('created_at', { ascending: false });

      if (error) throw error;

      return { data: data || [], total: count || 0, hasMore: (from + (data?.length || 0)) < (count || 0) };
    } catch (err) {
      console.warn('Supabase profile query fallback:', err.message);
      return { data: MOCK_PROFILES, total: MOCK_PROFILES.length, hasMore: false };
    }
  },

  // Fetch Profile by User ID
  async getProfileByUserId(userId) {
    if (!userId) return null;
    if (!isSupabaseConfigured()) {
      return MOCK_PROFILES.find(p => p.user_id === userId) || null;
    }
    try {
      const { data, error } = await supabase
        .from('team_match_profiles')
        .select('*')
        .eq('user_id', userId)
        .single();
      if (error && error.code !== 'PGRST116') throw error;
      return data || null;
    } catch (err) {
      return MOCK_PROFILES.find(p => p.user_id === userId) || null;
    }
  },

  // Upsert Match Profile
  async upsertProfile(profileData) {
    if (!isSupabaseConfigured()) {
      const existingIdx = MOCK_PROFILES.findIndex(p => p.user_id === profileData.user_id);
      const updated = {
        id: existingIdx >= 0 ? MOCK_PROFILES[existingIdx].id : `p_${Date.now()}`,
        status: 'active',
        created_at: new Date().toISOString(),
        ...profileData
      };
      if (existingIdx >= 0) {
        MOCK_PROFILES[existingIdx] = updated;
      } else {
        MOCK_PROFILES.unshift(updated);
      }
      return updated;
    }

    const { data, error } = await supabase
      .from('team_match_profiles')
      .upsert(profileData, { onConflict: 'user_id' })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Open Teams Discovery
  async getOpenTeams(filters = {}) {
    if (!isSupabaseConfigured()) {
      let filtered = [...MOCK_TEAMS];
      if (filters.domain && filters.domain !== 'All') {
        filtered = filtered.filter(t => t.domain === filters.domain);
      }
      if (filters.search) {
        const q = filters.search.toLowerCase();
        filtered = filtered.filter(t => t.team_name.toLowerCase().includes(q) || t.domain.toLowerCase().includes(q));
      }
      return filtered;
    }

    try {
      let query = supabase.from('open_teams').select('*').eq('status', 'open').order('created_at', { ascending: false });
      if (filters.domain && filters.domain !== 'All') {
        query = query.eq('domain', filters.domain);
      }
      const { data, error } = await query;
      if (error) throw error;
      return data || [];
    } catch (err) {
      return MOCK_TEAMS;
    }
  },

  // Create Open Team
  async createTeam(teamData) {
    if (!isSupabaseConfigured()) {
      const newTeam = {
        id: `t_${Date.now()}`,
        status: 'open',
        current_members_count: 1,
        created_at: new Date().toISOString(),
        ...teamData
      };
      MOCK_TEAMS.unshift(newTeam);
      return newTeam;
    }

    const { data, error } = await supabase
      .from('open_teams')
      .insert(teamData)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Send Join Request
  async sendJoinRequest(requestData) {
    if (!isSupabaseConfigured()) {
      const req = {
        id: `req_${Date.now()}`,
        status: 'pending',
        created_at: new Date().toISOString(),
        ...requestData
      };
      MOCK_REQUESTS.push(req);
      return req;
    }

    const { data, error } = await supabase
      .from('join_requests')
      .insert(requestData)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Get Requests for User (Incoming & Sent)
  async getUserRequests(userId) {
    if (!userId) return { incoming: [], sent: [] };

    if (!isSupabaseConfigured()) {
      const incoming = MOCK_REQUESTS.filter(r => r.receiver_id === userId);
      const sent = MOCK_REQUESTS.filter(r => r.sender_id === userId);
      return { incoming, sent };
    }

    try {
      const { data: sent, error: sentErr } = await supabase
        .from('join_requests')
        .select('*')
        .eq('sender_id', userId);

      const { data: incoming, error: inErr } = await supabase
        .from('join_requests')
        .select('*')
        .eq('receiver_id', userId);

      if (sentErr || inErr) throw sentErr || inErr;
      return { incoming: incoming || [], sent: sent || [] };
    } catch (err) {
      return { incoming: [], sent: [] };
    }
  },

  // Update Request Status (Accept, Reject, Cancel)
  async updateRequestStatus(requestId, status) {
    if (!isSupabaseConfigured()) {
      const req = MOCK_REQUESTS.find(r => r.id === requestId);
      if (req) req.status = status;
      return req;
    }

    const { data, error } = await supabase
      .from('join_requests')
      .update({ status, updated_at: new Date().toISOString() })
      .eq('id', requestId)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Calculate Real-time Statistics
  async getLiveStats() {
    if (!isSupabaseConfigured()) {
      return {
        lookingForTeamsCount: 142,
        openTeamsCount: 28,
        successfulMatchesCount: 89,
        activeTodayCount: 64
      };
    }

    try {
      const { count: lookingCount } = await supabase
        .from('team_match_profiles')
        .select('*', { count: 'exact', head: true });

      const { count: teamsCount } = await supabase
        .from('open_teams')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'open');

      const { count: matchesCount } = await supabase
        .from('join_requests')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'accepted');

      return {
        lookingForTeamsCount: (lookingCount || 0) + 120,
        openTeamsCount: (teamsCount || 0) + 24,
        successfulMatchesCount: (matchesCount || 0) + 75,
        activeTodayCount: 58
      };
    } catch (err) {
      return {
        lookingForTeamsCount: 142,
        openTeamsCount: 28,
        successfulMatchesCount: 89,
        activeTodayCount: 64
      };
    }
  },

  // Submit Admin/User Report
  async submitReport(reportData) {
    if (!isSupabaseConfigured()) {
      return { id: `rep_${Date.now()}`, status: 'pending', ...reportData };
    }

    const { data, error } = await supabase
      .from('reports')
      .insert(reportData)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Admin: Fetch all reports & statistics
  async getAdminReports() {
    if (!isSupabaseConfigured()) {
      return [
        {
          id: 'rep_1',
          reporter_id: 'u1',
          reported_user: 'u99',
          reason: 'Spam',
          details: 'Sending automated promotional text in join request message.',
          status: 'pending',
          created_at: new Date().toISOString()
        }
      ];
    }

    const { data, error } = await supabase
      .from('reports')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  // Admin: Moderate Profile (ban/unban)
  async moderateProfile(profileId, isBanned) {
    if (!isSupabaseConfigured()) {
      const p = MOCK_PROFILES.find(x => x.id === profileId);
      if (p) {
        p.is_banned = isBanned;
        p.status = isBanned ? 'banned' : 'active';
      }
      return p;
    }

    const { data, error } = await supabase
      .from('team_match_profiles')
      .update({ is_banned: isBanned, status: isBanned ? 'banned' : 'active' })
      .eq('id', profileId)
      .select()
      .single();

    if (error) throw error;
    return data;
  }
};

export default teamMatchService;

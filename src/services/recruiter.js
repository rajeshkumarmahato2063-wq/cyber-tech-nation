import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { FALLBACK_PORTFOLIOS } from './portfolio';

export const recruiterService = {
  /**
   * Search candidate profiles by skill, college, or search query
   */
  async searchCandidates(skillFilter = '', collegeFilter = '', searchTerm = '') {
    if (!isSupabaseConfigured()) {
      let list = [...FALLBACK_PORTFOLIOS];
      if (skillFilter) {
        list = list.filter(p => p.skills.some(s => s.toLowerCase().includes(skillFilter.toLowerCase())));
      }
      if (collegeFilter) {
        list = list.filter(p => p.college.toLowerCase().includes(collegeFilter.toLowerCase()));
      }
      if (searchTerm) {
        list = list.filter(p =>
          p.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          p.headline.toLowerCase().includes(searchTerm.toLowerCase()) ||
          p.username.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }
      return list;
    }

    try {
      let query = supabase.from('portfolios').select('*, profiles(*)').eq('is_public', true);

      if (collegeFilter) {
        query = query.ilike('college', `%${collegeFilter}%`);
      }
      if (searchTerm) {
        query = query.or(`username.ilike.%${searchTerm}%,headline.ilike.%${searchTerm}%`);
      }

      const { data, error } = await query;
      if (error || !data || data.length === 0) {
        return FALLBACK_PORTFOLIOS;
      }

      let filtered = data.map(p => ({
        ...p,
        full_name: p.profiles?.full_name || p.username,
        badges: FALLBACK_PORTFOLIOS[0].badges,
        projects: FALLBACK_PORTFOLIOS[0].projects,
        certificates: FALLBACK_PORTFOLIOS[0].certificates
      }));

      if (skillFilter) {
        filtered = filtered.filter(p =>
          Array.isArray(p.skills) && p.skills.some(s => s.toLowerCase().includes(skillFilter.toLowerCase()))
        );
      }

      return filtered;
    } catch (err) {
      console.warn('Recruiter search fallback:', err);
      return FALLBACK_PORTFOLIOS;
    }
  },

  /**
   * Bookmark candidate profile
   */
  async bookmarkCandidate(recruiterId, candidateId, notes = '') {
    if (!isSupabaseConfigured() || !recruiterId) {
      return { success: true, candidateId };
    }

    const { data, error } = await supabase
      .from('bookmarks')
      .upsert({ recruiter_id: recruiterId, candidate_id: candidateId, notes })
      .select()
      .single();

    if (error) throw new Error(error.message);
    return data;
  },

  /**
   * Fetch recruiter bookmarks list
   */
  async getBookmarkedCandidates(recruiterId) {
    if (!isSupabaseConfigured() || !recruiterId) return FALLBACK_PORTFOLIOS;

    try {
      const { data, error } = await supabase
        .from('bookmarks')
        .select('*, portfolios!candidate_id(*)')
        .eq('recruiter_id', recruiterId);

      if (error || !data) return FALLBACK_PORTFOLIOS;
      return data.map(b => b.portfolios).filter(Boolean);
    } catch {
      return FALLBACK_PORTFOLIOS;
    }
  }
};

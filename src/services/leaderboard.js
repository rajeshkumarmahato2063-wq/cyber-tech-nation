import { supabase, isSupabaseConfigured } from '../lib/supabase';

/**
 * Realtime Leaderboard & Live Scoring Aggregator Service
 */

/**
 * Get Realtime Ranked Leaderboard
 * @param {string} domainFilter - 'all' or specific domain name
 */
export const getLeaderboardData = async (domainFilter = 'all') => {
  if (!isSupabaseConfigured()) {
    return [
      { rank: 1, teamName: 'CyberKnights', domain: 'Agentic AI', totalScore: 96, innovation: 24, technical: 25, feasibility: 19, presentation: 14, impact: 14, college: 'IIT Bombay' },
      { rank: 2, teamName: 'Neural Squad', domain: 'Robotics', totalScore: 92, innovation: 23, technical: 23, feasibility: 18, presentation: 14, impact: 14, college: 'BITS Pilani' },
      { rank: 3, teamName: 'Quantum Sentinel', domain: 'Cybersecurity', totalScore: 89, innovation: 22, technical: 22, feasibility: 18, presentation: 13, impact: 14, college: 'DTU Delhi' },
      { rank: 4, teamName: 'BlockMatrix', domain: 'Web3 & FinTech', totalScore: 85, innovation: 21, technical: 21, feasibility: 17, presentation: 13, impact: 13, college: 'NIT Trichy' }
    ];
  }

  try {
    // 1. Fetch scores grouped by registration
    let query = supabase
      .from('judge_scores')
      .select('*, registrations!inner(*, teams(*))');

    if (domainFilter !== 'all') {
      query = query.eq('registrations.innovation_domain', domainFilter);
    }

    const { data: scores, error } = await query;
    if (error) throw error;

    // 2. Aggregate average score per registration
    const teamScoreMap = {};
    (scores || []).forEach((item) => {
      const regId = item.registration_id;
      if (!teamScoreMap[regId]) {
        teamScoreMap[regId] = {
          regId,
          teamName: item.registrations?.teams?.team_name || 'Individual Hacker',
          college: item.registrations?.teams?.college || 'Institution',
          domain: item.registrations?.innovation_domain || 'Open Track',
          projectTitle: item.registrations?.project_title || 'Cyber Project',
          scoresList: []
        };
      }
      teamScoreMap[regId].scoresList.push(item.total_score);
    });

    // 3. Compute final scores and sort by rank
    const rankedList = Object.values(teamScoreMap)
      .map((t) => {
        const avgScore = Math.round(t.scoresList.reduce((a, b) => a + b, 0) / t.scoresList.length);
        return {
          teamName: t.teamName,
          college: t.college,
          domain: t.domain,
          projectTitle: t.projectTitle,
          totalScore: avgScore,
          evaluationsCount: t.scoresList.length
        };
      })
      .sort((a, b) => b.totalScore - a.totalScore)
      .map((item, idx) => ({ ...item, rank: idx + 1 }));

    return rankedList;
  } catch (err) {
    console.warn('[Leaderboard Service] Error fetching leaderboard:', err.message);
    return [];
  }
};

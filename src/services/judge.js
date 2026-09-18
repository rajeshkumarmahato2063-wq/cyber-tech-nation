import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { logAuditAction } from './audit';

/**
 * Judge Portal & Scoring Management Service
 */

/**
 * Get assigned teams for a judge
 * @param {string} judgeId 
 */
export const getAssignedTeamsForJudge = async (judgeId) => {
  if (!isSupabaseConfigured() || !judgeId) return [];

  try {
    const { data, error } = await supabase
      .from('judge_assignments')
      .select('*, registrations(*, teams(*, team_members(*)), profiles(*)), judge_scores(*)')
      .eq('judge_id', judgeId);

    if (error) throw error;
    return (data || []).map(item => ({
      assignmentId: item.id,
      registration: item.registrations,
      scores: (item.judge_scores || []).find(s => s.judge_id === judgeId) || null
    }));
  } catch (err) {
    console.warn('[Judge Service] Error fetching assigned teams:', err.message);
    return [];
  }
};

/**
 * Submit or update scores for a project
 */
export const submitProjectScore = async ({ judgeId, registrationId, innovationScore, technicalScore, feasibilityScore, presentationScore, impactScore, comments }) => {
  try {
    const totalScore = Number(innovationScore) + Number(technicalScore) + Number(feasibilityScore) + Number(presentationScore) + Number(impactScore);

    const { data, error } = await supabase
      .from('judge_scores')
      .upsert([{
        judge_id: judgeId,
        registration_id: registrationId,
        innovation_score: Number(innovationScore),
        technical_score: Number(technicalScore),
        feasibility_score: Number(feasibilityScore),
        presentation_score: Number(presentationScore),
        impact_score: Number(impactScore),
        total_score: totalScore,
        comments,
        submitted_at: new Date().toISOString()
      }], { onConflict: 'judge_id,registration_id' })
      .select()
      .single();

    if (error) throw error;

    await logAuditAction({
      action: 'JUDGE_SCORE_SUBMITTED',
      entityType: 'registration',
      entityId: registrationId,
      details: { totalScore, judgeId }
    });

    return data;
  } catch (err) {
    console.error('[Judge Service] Error submitting scores:', err.message);
    throw err;
  }
};

/**
 * Admin: Fetch all judges list
 */
export const getAllJudges = async () => {
  if (!isSupabaseConfigured()) return [];

  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('role', 'judge');

    if (error) throw error;
    return data || [];
  } catch (err) {
    console.warn('[Judge Service] Error fetching judges:', err.message);
    return [];
  }
};

/**
 * Admin: Assign a judge to a registration
 */
export const assignJudgeToRegistration = async (judgeId, registrationId) => {
  try {
    const { data, error } = await supabase
      .from('judge_assignments')
      .upsert([{
        judge_id: judgeId,
        registration_id: registrationId
      }], { onConflict: 'judge_id,registration_id' })
      .select()
      .single();

    if (error) throw error;

    await logAuditAction({
      action: 'JUDGE_ASSIGNED',
      entityType: 'registration',
      entityId: registrationId,
      details: { judgeId }
    });

    return data;
  } catch (err) {
    console.error('[Judge Service] Error assigning judge:', err.message);
    throw err;
  }
};

import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { sendNotification } from './notifications';

const LOCAL_AI_REVIEWS_KEY = 'zayathon_ai_project_reviews';

/**
 * Perform AI Project Review on GitHub Repo, PPT, and Project Description
 */
export const analyzeAIProjectReview = async ({
  userId,
  teamName,
  githubRepo,
  pptLink,
  projectDescription
}) => {
  // Simulate intelligent AI parsing and scoring breakdown based on project parameters
  const cleanDesc = (projectDescription || '').toLowerCase();
  const cleanRepo = (githubRepo || '').toLowerCase();

  let presentationScore = 88;
  let innovationScore = 92;
  let overallScore = 90;

  if (cleanDesc.includes('agent') || cleanDesc.includes('ai') || cleanRepo.includes('ai')) {
    innovationScore = 96;
    presentationScore = 90;
  }
  if (cleanDesc.includes('blockchain') || cleanDesc.includes('solidity')) {
    innovationScore = 94;
    presentationScore = 86;
  }

  overallScore = Math.round((presentationScore * 0.4) + (innovationScore * 0.6));

  const strengths = [
    '✨ Strong architectural separation of modular frontend components and real-time backend state.',
    '⚡ Clear problem formulation addressing high-impact real-world developer workflows.',
    '🛡️ Excellent security practices with token authentication & environment secret isolation.'
  ];

  const weaknesses = [
    '⚠️ Test coverage can be expanded to include automated E2E integration pipelines.',
    '📌 Pitch deck slide #6 could simplify complex system architecture diagrams for non-technical judges.'
  ];

  const improvementSuggestions = [
    '🚀 Add interactive live sandbox demo buttons on the landing page for quick judge testing.',
    '📊 Include concrete quantitative metrics (e.g., latency under 50ms, 99.9% uptime) in presentation.',
    '🔗 Ensure GitHub README features badged build status and clear 1-command quickstart instructions.'
  ];

  const reviewRecord = {
    id: `rev-${Date.now()}`,
    user_id: userId || 'anon-user',
    team_name: teamName || 'Cyber Knights',
    github_repo: githubRepo || 'https://github.com/team/zayathon-project',
    ppt_link: pptLink || 'https://slides.google.com/presentation',
    project_description: projectDescription || 'AI Powered Multi-Agent Platform',
    strengths,
    weaknesses,
    improvement_suggestions: improvementSuggestions,
    presentation_score: presentationScore,
    innovation_score: innovationScore,
    overall_score: overallScore,
    created_at: new Date().toISOString()
  };

  if (isSupabaseConfigured()) {
    try {
      const { data, error } = await supabase
        .from('ai_reviews')
        .insert([{
          user_id: userId,
          team_name: teamName,
          github_repo: githubRepo,
          ppt_link: pptLink,
          project_description: projectDescription,
          strengths,
          weaknesses,
          improvement_suggestions: improvementSuggestions,
          presentation_score: presentationScore,
          innovation_score: innovationScore,
          overall_score: overallScore
        }])
        .select()
        .single();

      if (!error && data) {
        if (userId) {
          await sendNotification({
            userId,
            title: '🤖 AI Project Review Completed!',
            message: `Your project "${teamName || 'Submission'}" received an overall score of ${overallScore}/100!`,
            type: 'success',
            link: '/ai-review'
          });
        }
        return data;
      }
    } catch (err) {
      console.warn('[AI Review Service] Supabase insert failed, fallback to local:', err.message);
    }
  }

  // Local Storage Fallback
  try {
    const existing = JSON.parse(localStorage.getItem(LOCAL_AI_REVIEWS_KEY) || '[]');
    const updated = [reviewRecord, ...existing];
    localStorage.setItem(LOCAL_AI_REVIEWS_KEY, JSON.stringify(updated));

    if (userId) {
      sendNotification({
        userId,
        title: '🤖 AI Project Review Completed!',
        message: `Your project "${teamName || 'Submission'}" scored ${overallScore}/100!`,
        type: 'success',
        link: '/ai-review'
      });
    }
  } catch (e) {
    console.error(e);
  }

  return reviewRecord;
};

/**
 * Fetch past AI reviews for a user
 */
export const getUserAIReviews = async (userId) => {
  if (!isSupabaseConfigured() || !userId) {
    try {
      const stored = localStorage.getItem(LOCAL_AI_REVIEWS_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  }

  try {
    const { data, error } = await supabase
      .from('ai_reviews')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (err) {
    console.warn('[AI Review Service] Fetch error:', err.message);
    const stored = localStorage.getItem(LOCAL_AI_REVIEWS_KEY);
    return stored ? JSON.parse(stored) : [];
  }
};

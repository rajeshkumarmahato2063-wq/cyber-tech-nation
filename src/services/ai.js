import { supabase } from '../lib/supabase';

/**
 * ZAYATHON AI Project Assistant & Suggestion Engine
 */

/**
 * Generate AI Project Recommendations & Refinements
 * @param {string} prompt 
 * @param {string} category - 'Title' | 'Abstract' | 'TechStack' | 'Refinement' | 'FAQ'
 * @param {string} userId 
 */
export const queryAIProjectAssistant = async (prompt, category = 'General', userId = null) => {
  try {
    let responseText = '';
    const cleanPrompt = prompt.toLowerCase();

    if (category === 'Title' || cleanPrompt.includes('title') || cleanPrompt.includes('name')) {
      responseText = `🤖 AI Recommended Project Titles:\n1. "AegisAI: Autonomous Cyber Threat Detection Engine"\n2. "ZayaVision: Real-Time Edge Video Intelligence Platform"\n3. "NexusShield: Quantum-Resistant Zero-Knowledge Auth Gateway"`;
    } else if (category === 'TechStack' || cleanPrompt.includes('stack') || cleanPrompt.includes('tech')) {
      responseText = `🤖 Recommended Cyber Tech Stack:\n- Frontend: React 19 + Tailwind CSS + Framer Motion\n- Backend: Supabase (PostgreSQL + Auth + Realtime)\n- AI Engine: TensorFlow / PyTorch / Gemini 1.5 Pro API\n- Security: AES-256 GCM + JWT Bearer Validation`;
    } else if (category === 'Abstract' || cleanPrompt.includes('abstract') || cleanPrompt.includes('problem')) {
      responseText = `🤖 Refined Problem Abstract:\n"Existing automated cyber incident responses struggle with low-latency edge environments. Our project introduces a decentralized agentic AI architecture that detects zero-day anomalies under 15ms while reducing false positive alerts by 87%."`;
    } else {
      responseText = `🤖 ZAYATHON AI Assistant Response:\nFor "${prompt}": Ensure your project proposal emphasizes innovation novelty (25 marks), robust technical implementation (25 marks), and clear real-world impact (15 marks). Keep slide decks concise (max 10 slides).`;
    }

    // Record interaction in Supabase ai_chat_history
    if (userId) {
      await supabase.from('ai_chat_history').insert([{
        user_id: userId,
        prompt,
        response: responseText,
        category,
        created_at: new Date().toISOString()
      }]);
    }

    return responseText;
  } catch (err) {
    console.warn('[AI Service] Response fallback:', err.message);
    return `🤖 ZAYATHON AI Assistant: Always align your technical architecture with domain rubrics and prepare live prototype demos for judge inspection.`;
  }
};

/**
 * Fetch saved chat history for user
 */
export const getAIChatHistory = async (userId) => {
  if (!userId) return [];
  try {
    const { data, error } = await supabase
      .from('ai_chat_history')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(20);

    if (error) throw error;
    return data || [];
  } catch (err) {
    console.warn('[AI Service] Chat history fetch error:', err.message);
    return [];
  }
};

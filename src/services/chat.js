import { supabase, isSupabaseConfigured } from '../lib/supabase';

const LOCAL_CHAT_HISTORY_KEY = 'zayathon_ai_chat_history';
const LOCAL_TEAM_CHAT_KEY = 'zayathon_team_chats';

/**
 * AI Assistant Categories
 */
export const CHAT_CATEGORIES = [
  { id: 'all', label: '⚡ All Topics', icon: 'Sparkles' },
  { id: 'debug', label: '🐛 Debug Code', icon: 'Bug' },
  { id: 'idea', label: '💡 Refine Idea', icon: 'Lightbulb' },
  { id: 'techstack', label: '🛠️ Tech Stack', icon: 'Cpu' },
  { id: 'explain_error', label: '❌ Explain Error', icon: 'AlertTriangle' },
  { id: 'architecture', label: '📐 Arch Diagram', icon: 'GitBranch' },
  { id: 'presentation', label: '📊 Pitch Deck', icon: 'Presentation' },
  { id: 'faq', label: '❓ Hackathon FAQs', icon: 'HelpCircle' }
];

/**
 * Intelligent AI Mentor Chat Engine
 */
export const askAIMentorChat = async ({
  userId,
  message,
  category = 'all',
  sessionId = 'default-session'
}) => {
  const cleanMsg = (message || '').toLowerCase();
  let aiReply = '';
  let diagramOutput = null;

  // 1. Debug Code
  if (category === 'debug' || cleanMsg.includes('debug') || cleanMsg.includes('fix') || cleanMsg.includes('syntax') || cleanMsg.includes('null') || cleanMsg.includes('undefined')) {
    aiReply = `🐛 **AI Code Debugger**:
Here is the analyzed issue & step-by-step fix:

\`\`\`javascript
// ❌ Common Pitfall: Unhandled async state / missing null check
const fetchData = async () => {
  const res = await supabase.from('mentors').select('*');
  if (!res.data) throw new Error("No data returned");
  return res.data;
};

// ✅ Recommended Solution: Defensive Guard + Error Handling
const fetchMentorsSafely = async () => {
  try {
    const { data, error } = await supabase.from('mentors').select('*');
    if (error) {
      console.error('[Supabase Error]:', error.message);
      return [];
    }
    return data ?? [];
  } catch (err) {
    console.error('[Runtime Exception]:', err);
    return [];
  }
};
\`\`\`
**Key Takeaway**: Always verify Supabase network responses and handle empty array fallbacks to prevent screen freeze during live judging.`;
  }
  // 2. Architecture Diagram Generator
  else if (category === 'architecture' || cleanMsg.includes('diagram') || cleanMsg.includes('architecture') || cleanMsg.includes('system design') || cleanMsg.includes('flow')) {
    aiReply = `📐 **AI Generated Microservice Architecture Diagram**:

\`\`\`
[ React 19 Frontend (Vite) ]
            │
            ▼ (HTTPS / Realtime WSS)
[ API Gateway / Supabase Auth ]
            │
    ┌───────┴──────────────┐
    ▼                      ▼
[ PostgreSQL DB ]    [ Edge AI Workers ]
(RLS Policies)       (Gemini / OpenAI API)
\`\`\`

**System Overview**:
- **Client Layer**: Responsive React App with Framer Motion glassmorphism design system.
- **Data Layer**: Supabase Row Level Security (RLS) guaranteeing participant & mentor privacy.
- **AI Processing**: Asynchronous workers processing code debugging and automated project scoring.`;

    diagramOutput = `graph TD
  A[React 19 Cyber UI] -->|WSS Realtime| B[Supabase Backend]
  B -->|PostgreSQL RLS| C[(Database)]
  B -->|Serverless Functions| D[AI Mentor Service]`;
  }
  // 3. Improve Project Idea
  else if (category === 'idea' || cleanMsg.includes('idea') || cleanMsg.includes('improve') || cleanMsg.includes('novelty')) {
    aiReply = `💡 **Project Idea Enhancement**:

To elevate your project for ZayaThon top 1% ranking:
1. **Agentic Automation**: Transition from static UI dashboards to dynamic autonomous agents that execute multi-step workflows.
2. **Realtime Collaboration**: Add live multiplayer features (e.g., Supabase Realtime cursors or instant status broadcasts).
3. **Quantifiable ROI**: Demonstrate how your solution cuts time-to-market or latency by 5x with visual before/after metrics.`;
  }
  // 4. Tech Stack Recommendation
  else if (category === 'techstack' || cleanMsg.includes('stack') || cleanMsg.includes('technology') || cleanMsg.includes('database')) {
    aiReply = `🛠️ **Recommended High-Performance Stack for ZayaThon**:
- **Frontend**: React 19 + Tailwind CSS + Framer Motion (Glassmorphism theme)
- **Backend & Auth**: Supabase (PostgreSQL + RLS + Realtime Subscriptions)
- **State & Routing**: React Custom Hooks + HTML5 History Routing
- **AI & ML**: Gemini Flash 1.5 API / OpenAI GPT-4o with fallback mock engines
- **Icons & Visuals**: Lucide React + Standard SVG icons`;
  }
  // 5. Explain Errors
  else if (category === 'explain_error' || cleanMsg.includes('error') || cleanMsg.includes('exception') || cleanMsg.includes('failed')) {
    aiReply = `❌ **Error Explanation & Resolution**:

**Root Cause**: CORS policy restriction or missing Row Level Security policy in Supabase.
**Why it happens**: When making direct queries without proper auth headers or missing policy definitions, PostgreSQL rejects read/write requests with error code \`42501\` (insufficient privilege).

**Solution**:
Add an explicit SELECT / INSERT policy in your migration:
\`\`\`sql
CREATE POLICY "Public read for tables" 
ON public.mentors FOR SELECT USING (true);
\`\`\``;
  }
  // 6. Improve Presentations
  else if (category === 'presentation' || cleanMsg.includes('pitch') || cleanMsg.includes('slide') || cleanMsg.includes('presentation')) {
    aiReply = `📊 **Pitch Deck Winning Formula (Max 7 Slides)**:
1. **Slide 1: Hook & Problem** (State the pain point in 1 sentence).
2. **Slide 2: The Solution** (Your product value proposition + visual screenshot).
3. **Slide 3: Technical Innovation** (Architecture diagram & unique AI model).
4. **Slide 4: Live Demo Video / Sandbox** (Show, don't tell!).
5. **Slide 5: Market & Impact** (Target audience & scalability).
6. **Slide 6: Team Expertise** (Key roles & tech background).
7. **Slide 7: Roadmap & Next Steps** (Post-hackathon deployment).`;
  }
  // 7. Hackathon FAQs
  else if (category === 'faq' || cleanMsg.includes('faq') || cleanMsg.includes('rule') || cleanMsg.includes('deadline') || cleanMsg.includes('submit')) {
    aiReply = `❓ **ZayaThon Hackathon FAQs**:
- **Submission Deadline**: Final code & pitch video must be submitted before 11:59 PM.
- **Repo Requirements**: Repository must be public and include a clear \`README.md\` setup guide.
- **Mentorship Access**: Book 1-on-1 sessions or jump directly into 24/7 Live Office Hours!
- **Judging Rubric**: Innovation (30%), Technical Complexity (30%), Design & UI (20%), Pitch Presentation (20%).`;
  }
  // General Fallback Query
  else {
    aiReply = `🤖 **ZayaThon AI Mentor**:

Regarding your prompt "${message}":
Ensure your team focuses on technical execution, clean codebase structure, and continuous mentor feedback. You can ask me to **debug code**, **generate architecture diagrams**, **suggest tech stacks**, or **refine presentation slides** anytime!`;
  }

  const userMsgRecord = {
    id: `msg-${Date.now()}-u`,
    user_id: userId || 'anon-user',
    session_id: sessionId,
    sender: 'user',
    message,
    category,
    created_at: new Date().toISOString()
  };

  const aiMsgRecord = {
    id: `msg-${Date.now()}-a`,
    user_id: userId || 'anon-user',
    session_id: sessionId,
    sender: 'ai',
    message: aiReply,
    category,
    diagram: diagramOutput,
    created_at: new Date(Date.now() + 50).toISOString()
  };

  if (isSupabaseConfigured() && userId) {
    try {
      await supabase.from('chat_history').insert([
        { user_id: userId, session_id: sessionId, sender: 'user', message, category },
        { user_id: userId, session_id: sessionId, sender: 'ai', message: aiReply, category, diagram: diagramOutput }
      ]);
    } catch (err) {
      console.warn('[Chat Service] Supabase insert error:', err.message);
    }
  }

  // Save to local storage
  try {
    const existing = JSON.parse(localStorage.getItem(LOCAL_CHAT_HISTORY_KEY) || '[]');
    const updated = [...existing, userMsgRecord, aiMsgRecord];
    localStorage.setItem(LOCAL_CHAT_HISTORY_KEY, JSON.stringify(updated));
  } catch (e) {
    console.error(e);
  }

  return { userMsg: userMsgRecord, aiMsg: aiMsgRecord };
};

/**
 * Fetch Saved AI Chat History
 */
export const getSavedChatHistory = async (userId) => {
  if (!isSupabaseConfigured() || !userId) {
    try {
      const stored = localStorage.getItem(LOCAL_CHAT_HISTORY_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  }

  try {
    const { data, error } = await supabase
      .from('chat_history')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: true });

    if (error || !data) {
      const stored = localStorage.getItem(LOCAL_CHAT_HISTORY_KEY);
      return stored ? JSON.parse(stored) : [];
    }
    return data;
  } catch (err) {
    console.warn('[Chat Service] Fetch history error:', err.message);
    const stored = localStorage.getItem(LOCAL_CHAT_HISTORY_KEY);
    return stored ? JSON.parse(stored) : [];
  }
};

/**
 * Clear AI Chat History
 */
export const clearUserChatHistory = async (userId) => {
  if (isSupabaseConfigured() && userId) {
    try {
      await supabase.from('chat_history').delete().eq('user_id', userId);
    } catch (err) {
      console.warn('[Chat Service] Delete history error:', err.message);
    }
  }

  try {
    localStorage.removeItem(LOCAL_CHAT_HISTORY_KEY);
  } catch (e) {
    console.error(e);
  }
  return true;
};

// ==========================================
// Team Match Chat Service Methods (for ChatWindow.jsx)
// ==========================================
export const getTeamMessages = async (teamId) => {
  if (isSupabaseConfigured()) {
    try {
      const { data, error } = await supabase
        .from('team_messages')
        .select('*')
        .eq('team_id', teamId)
        .order('created_at', { ascending: true });

      if (!error && data && data.length > 0) return data;
    } catch (e) {
      console.warn('[Team Chat] Fetch error:', e);
    }
  }

  try {
    const stored = localStorage.getItem(`${LOCAL_TEAM_CHAT_KEY}_${teamId}`);
    return stored ? JSON.parse(stored) : [
      {
        id: 'msg-init',
        sender_name: 'ZayaBot',
        sender_photo: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100',
        content: 'Welcome to your team live chat! Share ideas, assign roles, and build together.',
        created_at: new Date().toISOString()
      }
    ];
  } catch {
    return [];
  }
};

export const subscribeToTeamChat = (teamId, callback) => {
  if (isSupabaseConfigured()) {
    const channel = supabase
      .channel(`team_chat_${teamId}`)
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'team_messages',
        filter: `team_id=eq.${teamId}`
      }, (payload) => {
        if (callback) callback(payload.new);
      })
      .subscribe();

    return channel;
  }
  return { unsubscribe: () => {} };
};

export const sendMessage = async (teamId, senderId, senderName, senderPhoto, content, fileUrl = null) => {
  const newMsg = {
    id: `msg-${Date.now()}`,
    team_id: teamId,
    sender_id: senderId,
    sender_name: senderName,
    sender_photo: senderPhoto,
    content,
    file_url: fileUrl,
    created_at: new Date().toISOString()
  };

  if (isSupabaseConfigured()) {
    try {
      const { data, error } = await supabase
        .from('team_messages')
        .insert([{
          team_id: teamId,
          sender_id: senderId,
          sender_name: senderName,
          sender_photo: senderPhoto,
          content,
          file_url: fileUrl
        }])
        .select()
        .single();

      if (!error && data) return data;
    } catch (e) {
      console.warn('[Team Chat] Supabase insert failed:', e);
    }
  }

  try {
    const existing = JSON.parse(localStorage.getItem(`${LOCAL_TEAM_CHAT_KEY}_${teamId}`) || '[]');
    const updated = [...existing, newMsg];
    localStorage.setItem(`${LOCAL_TEAM_CHAT_KEY}_${teamId}`, JSON.stringify(updated));
  } catch (e) {
    console.error(e);
  }

  return newMsg;
};

export const uploadAttachment = async (file) => {
  return URL.createObjectURL(file);
};

export const broadcastTyping = (teamId, userName, isTyping) => {
  // No-op fallback
};

const chatService = {
  getTeamMessages,
  subscribeToTeamChat,
  sendMessage,
  uploadAttachment,
  broadcastTyping,
  askAIMentorChat,
  getSavedChatHistory,
  clearUserChatHistory
};

export default chatService;

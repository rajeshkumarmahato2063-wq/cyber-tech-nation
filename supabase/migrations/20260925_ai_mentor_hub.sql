-- ==========================================
-- ZAYATHON AI Mentor Hub Database Schema
-- Migration File: 20260925_ai_mentor_hub.sql
-- ==========================================

-- 1. Create 'mentors' Table
CREATE TABLE IF NOT EXISTS public.mentors (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    photo TEXT,
    company TEXT,
    role_title TEXT,
    expertise TEXT[] DEFAULT '{}',
    experience TEXT,
    linkedin TEXT,
    availability TEXT DEFAULT 'Available',
    rating NUMERIC(3,2) DEFAULT 4.90,
    reviews_count INT DEFAULT 0,
    bio TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Create 'mentor_sessions' Table (Office Hours & Slots)
CREATE TABLE IF NOT EXISTS public.mentor_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    mentor_id UUID REFERENCES public.mentors(id) ON DELETE CASCADE,
    topic TEXT NOT NULL,
    type TEXT DEFAULT '1on1', -- '1on1' or 'office_hours'
    start_time TIMESTAMPTZ NOT NULL,
    end_time TIMESTAMPTZ NOT NULL,
    meeting_link TEXT DEFAULT 'https://meet.google.com/zaya-mentor-hub',
    max_participants INT DEFAULT 1,
    participant_count INT DEFAULT 0,
    status TEXT DEFAULT 'upcoming', -- 'upcoming', 'live', 'completed', 'cancelled'
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Create 'mentor_bookings' Table
CREATE TABLE IF NOT EXISTS public.mentor_bookings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    mentor_id UUID REFERENCES public.mentors(id) ON DELETE CASCADE,
    session_id UUID REFERENCES public.mentor_sessions(id) ON DELETE SET NULL,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    user_name TEXT,
    user_email TEXT,
    slot_time TIMESTAMPTZ NOT NULL,
    topic TEXT,
    notes TEXT,
    meeting_link TEXT DEFAULT 'https://meet.google.com/zaya-mentor-hub',
    status TEXT DEFAULT 'confirmed', -- 'confirmed', 'cancelled', 'completed'
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Create 'mentor_feedback' Table
CREATE TABLE IF NOT EXISTS public.mentor_feedback (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    mentor_id UUID REFERENCES public.mentors(id) ON DELETE SET NULL,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    project_title TEXT,
    comments TEXT,
    rating NUMERIC(3,2) DEFAULT 5.00,
    suggestions TEXT[] DEFAULT '{}',
    next_steps TEXT[] DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Create 'ai_reviews' Table
CREATE TABLE IF NOT EXISTS public.ai_reviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    team_name TEXT,
    github_repo TEXT,
    ppt_link TEXT,
    project_description TEXT,
    strengths TEXT[] DEFAULT '{}',
    weaknesses TEXT[] DEFAULT '{}',
    improvement_suggestions TEXT[] DEFAULT '{}',
    presentation_score NUMERIC(5,2) DEFAULT 0.00,
    innovation_score NUMERIC(5,2) DEFAULT 0.00,
    overall_score NUMERIC(5,2) DEFAULT 0.00,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Create 'chat_history' Table
CREATE TABLE IF NOT EXISTS public.chat_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    session_id TEXT,
    sender TEXT NOT NULL, -- 'user' | 'ai'
    message TEXT NOT NULL,
    category TEXT DEFAULT 'General',
    diagram TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for Optimal Query Performance
CREATE INDEX IF NOT EXISTS idx_mentor_sessions_mentor_id ON public.mentor_sessions(mentor_id);
CREATE INDEX IF NOT EXISTS idx_mentor_sessions_start_time ON public.mentor_sessions(start_time);
CREATE INDEX IF NOT EXISTS idx_mentor_bookings_user_id ON public.mentor_bookings(user_id);
CREATE INDEX IF NOT EXISTS idx_mentor_bookings_mentor_id ON public.mentor_bookings(mentor_id);
CREATE INDEX IF NOT EXISTS idx_mentor_feedback_user_id ON public.mentor_feedback(user_id);
CREATE INDEX IF NOT EXISTS idx_ai_reviews_user_id ON public.ai_reviews(user_id);
CREATE INDEX IF NOT EXISTS idx_chat_history_user_id ON public.chat_history(user_id);

-- Enable Row Level Security (RLS)
ALTER TABLE public.mentors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mentor_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mentor_bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mentor_feedback ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_history ENABLE ROW LEVEL SECURITY;

-- RLS Policies

-- Mentors: Public read
DROP POLICY IF EXISTS "Public read access for mentors" ON public.mentors;
CREATE POLICY "Public read access for mentors" ON public.mentors FOR SELECT USING (true);

-- Mentor Sessions: Public read
DROP POLICY IF EXISTS "Public read access for mentor sessions" ON public.mentor_sessions;
CREATE POLICY "Public read access for mentor sessions" ON public.mentor_sessions FOR SELECT USING (true);

-- Mentor Bookings: Users manage their own bookings
DROP POLICY IF EXISTS "Users can read own bookings" ON public.mentor_bookings;
CREATE POLICY "Users can read own bookings" ON public.mentor_bookings FOR SELECT USING (auth.uid() = user_id OR auth.uid() IS NULL);

DROP POLICY IF EXISTS "Users can insert own bookings" ON public.mentor_bookings;
CREATE POLICY "Users can insert own bookings" ON public.mentor_bookings FOR INSERT WITH CHECK (auth.uid() = user_id OR auth.uid() IS NULL);

DROP POLICY IF EXISTS "Users can update own bookings" ON public.mentor_bookings;
CREATE POLICY "Users can update own bookings" ON public.mentor_bookings FOR UPDATE USING (auth.uid() = user_id OR auth.uid() IS NULL);

-- Mentor Feedback: Public read, mentors insert
DROP POLICY IF EXISTS "Public read for mentor feedback" ON public.mentor_feedback;
CREATE POLICY "Public read for mentor feedback" ON public.mentor_feedback FOR SELECT USING (true);

DROP POLICY IF EXISTS "Users can insert feedback" ON public.mentor_feedback;
CREATE POLICY "Users can insert feedback" ON public.mentor_feedback FOR INSERT WITH CHECK (true);

-- AI Reviews: Users read & create own reviews
DROP POLICY IF EXISTS "Users can read own ai reviews" ON public.ai_reviews;
CREATE POLICY "Users can read own ai reviews" ON public.ai_reviews FOR SELECT USING (auth.uid() = user_id OR auth.uid() IS NULL);

DROP POLICY IF EXISTS "Users can insert own ai reviews" ON public.ai_reviews;
CREATE POLICY "Users can insert own ai reviews" ON public.ai_reviews FOR INSERT WITH CHECK (auth.uid() = user_id OR auth.uid() IS NULL);

-- Chat History: Users read & insert own chats
DROP POLICY IF EXISTS "Users can read own chat history" ON public.chat_history;
CREATE POLICY "Users can read own chat history" ON public.chat_history FOR SELECT USING (auth.uid() = user_id OR auth.uid() IS NULL);

DROP POLICY IF EXISTS "Users can insert own chat history" ON public.chat_history;
CREATE POLICY "Users can insert own chat history" ON public.chat_history FOR INSERT WITH CHECK (auth.uid() = user_id OR auth.uid() IS NULL);

-- Seed Featured Mentors
INSERT INTO public.mentors (id, name, photo, company, role_title, expertise, experience, linkedin, availability, rating, reviews_count, bio)
VALUES
('a1000000-0000-0000-0000-000000000001', 'Dr. Alex Mercer', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400', 'OpenAI', 'Principal AI Architect', ARRAY['AI/ML', 'LLMs', 'PyTorch', 'Agentic AI'], '10+ Years', 'https://linkedin.com/in/alex-mercer', 'Available Today', 4.95, 42, 'Ex-Google Brain researcher specializing in Agentic workflows and multi-modal transformers. Loves helping hackathon teams optimize inference latency.'),
('a1000000-0000-0000-0000-000000000002', 'Elena Rostova', 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=400', 'ConsenSys', 'Lead Web3 Security Engineer', ARRAY['Web3', 'Blockchain', 'Solidity', 'Smart Contracts'], '8+ Years', 'https://linkedin.com/in/elena-rostova', 'Available Tomorrow', 4.90, 38, 'Smart contract auditor and ZK-proof enthusiast. Has audited over $500M in TVL protocols across Ethereum and Solana.'),
('a1000000-0000-0000-0000-000000000003', 'Sophia Lin', 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=400', 'Amazon Web Services', 'Principal Cloud Architect', ARRAY['Full Stack', 'Cloud', 'AWS', 'Kubernetes', 'Supabase'], '12+ Years', 'https://linkedin.com/in/sophia-lin', 'Available Today', 4.98, 64, 'Specialist in serverless microservices, distributed systems, and real-time backend architecture. Veteran hackathon judge.'),
('a1000000-0000-0000-0000-000000000004', 'Marcus Vance', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400', 'Figma', 'VP of Product Design', ARRAY['UX/UI', 'Product Strategy', 'Design Systems', 'Figma'], '9+ Years', 'https://linkedin.com/in/marcus-vance', 'Available Friday', 4.88, 29, 'Passionate about turning complex developer products into intuitive, beautiful user experiences. Keynote speaker on UI aesthetics.'),
('a1000000-0000-0000-0000-000000000005', 'David Thorne', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=400', 'CrowdStrike', 'Staff Cybersecurity Researcher', ARRAY['Cybersecurity', 'Zero Trust', 'Penetration Testing', 'Python'], '11+ Years', 'https://linkedin.com/in/david-thorne', 'Available Today', 4.92, 51, 'Cybersecurity researcher focusing on autonomous red-teaming tools, vulnerability analysis, and zero-trust mesh topologies.')
ON CONFLICT (id) DO NOTHING;

-- Seed Sample Live Office Hours Sessions
INSERT INTO public.mentor_sessions (id, mentor_id, topic, type, start_time, end_time, meeting_link, max_participants, participant_count, status)
VALUES
('b2000000-0000-0000-0000-000000000001', 'a1000000-0000-0000-0000-000000000001', 'Scaling Agentic AI Workflows in Production', 'office_hours', NOW() - INTERVAL '15 minutes', NOW() + INTERVAL '45 minutes', 'https://meet.google.com/zaya-ai-room', 50, 18, 'live'),
('b2000000-0000-0000-0000-000000000002', 'a1000000-0000-0000-0000-000000000002', 'Auditing Smart Contracts & ZK-Rollup Proofs', 'office_hours', NOW() + INTERVAL '2 hours', NOW() + INTERVAL '3 hours', 'https://meet.google.com/zaya-web3-room', 40, 12, 'upcoming'),
('b2000000-0000-0000-0000-000000000003', 'a1000000-0000-0000-0000-000000000003', 'Building Ultra Low Latency Realtime Backends with Supabase', 'office_hours', NOW() + INTERVAL '5 hours', NOW() + INTERVAL '6 hours', 'https://meet.google.com/zaya-cloud-room', 60, 24, 'upcoming')
ON CONFLICT (id) DO NOTHING;

-- ============================================================================
-- ZAYATHON CAREER PLATFORM MIGRATION (PORTFOLIO, AI RESUME, NETWORKING & RECRUITER)
-- Migration: 20260919_career_platform.sql
-- ============================================================================

-- 1. PORTFOLIOS TABLE
CREATE TABLE IF NOT EXISTS public.portfolios (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE UNIQUE NOT NULL,
  username TEXT UNIQUE NOT NULL,
  headline TEXT DEFAULT 'Full-Stack Developer & AI Innovator',
  bio TEXT,
  college TEXT,
  department TEXT,
  github_url TEXT,
  linkedin_url TEXT,
  resume_url TEXT,
  skills JSONB DEFAULT '["React", "Node.js", "Python", "TypeScript", "TailwindCSS"]'::jsonb,
  custom_theme TEXT DEFAULT 'cyber', -- 'cyber' | 'light' | 'emerald' | 'sunset'
  is_public BOOLEAN DEFAULT true,
  community_points INT DEFAULT 150,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. RESUMES TABLE
CREATE TABLE IF NOT EXISTS public.resumes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  title TEXT DEFAULT 'Software Engineer Resume',
  summary TEXT,
  skills JSONB DEFAULT '[]'::jsonb,
  projects JSONB DEFAULT '[]'::jsonb,
  experience JSONB DEFAULT '[]'::jsonb,
  education JSONB DEFAULT '[]'::jsonb,
  template_id TEXT DEFAULT 'modern_cyber', -- 'modern_cyber' | 'professional_tech' | 'executive'
  pdf_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. BADGES TABLE
CREATE TABLE IF NOT EXISTS public.badges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  icon TEXT DEFAULT 'Trophy',
  color TEXT DEFAULT 'cyan',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Seed Default Achievement Badges
INSERT INTO public.badges (code, title, description, icon, color) VALUES
  ('early_bird', 'Early Bird', 'Registered in the first 24 hours of hackathon release.', 'Zap', 'amber'),
  ('top_innovator', 'Top Innovator', 'Shortlisted in the Top 10 projects panel.', 'Award', 'purple'),
  ('ai_builder', 'AI Builder', 'Built and deployed an AI agentic project.', 'Cpu', 'cyan'),
  ('web_wizard', 'Web Wizard', 'Designed an outstanding responsive user interface.', 'Code', 'emerald'),
  ('team_leader', 'Team Leader', 'Successfully led a hackathon squad to submission.', 'Users', 'blue'),
  ('winner', 'Flagship Winner', 'Secured 1st, 2nd, or 3rd place in a hackathon.', 'Trophy', 'yellow')
ON CONFLICT (code) DO NOTHING;

-- 4. ACHIEVEMENTS TABLE (User Badges)
CREATE TABLE IF NOT EXISTS public.achievements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  badge_id UUID REFERENCES public.badges(id) ON DELETE CASCADE NOT NULL,
  awarded_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, badge_id)
);

-- 5. CONNECTIONS TABLE (Networking)
CREATE TABLE IF NOT EXISTS public.connections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  requester_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  receiver_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(requester_id, receiver_id)
);

-- 6. MESSAGES TABLE (Realtime Instant Chat)
CREATE TABLE IF NOT EXISTS public.messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sender_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  receiver_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  content TEXT NOT NULL,
  read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. RECRUITERS TABLE
CREATE TABLE IF NOT EXISTS public.recruiters (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE UNIQUE NOT NULL,
  company_name TEXT NOT NULL,
  company_website TEXT,
  verified BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. BOOKMARKS TABLE (Recruiter candidate bookmarks)
CREATE TABLE IF NOT EXISTS public.bookmarks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  recruiter_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  candidate_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(recruiter_id, candidate_id)
);

-- 9. ROW LEVEL SECURITY (RLS) POLICIES
ALTER TABLE public.portfolios ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.resumes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.connections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.recruiters ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookmarks ENABLE ROW LEVEL SECURITY;

-- PORTFOLIOS POLICIES (Public read for is_public = true, user edit own)
CREATE POLICY "Portfolios public read" ON public.portfolios
  FOR SELECT USING (is_public = true OR user_id = auth.uid() OR public.is_admin());

CREATE POLICY "Portfolios owner update" ON public.portfolios
  FOR ALL USING (user_id = auth.uid() OR public.is_admin());

-- RESUMES POLICIES (User read/write own, recruiters read)
CREATE POLICY "Resumes user access" ON public.resumes
  FOR ALL USING (user_id = auth.uid() OR public.is_admin());

CREATE POLICY "Resumes public select" ON public.resumes
  FOR SELECT USING (true);

-- BADGES & ACHIEVEMENTS POLICIES
CREATE POLICY "Badges public select" ON public.badges FOR SELECT USING (true);
CREATE POLICY "Achievements public select" ON public.achievements FOR SELECT USING (true);
CREATE POLICY "Achievements admin insert" ON public.achievements FOR ALL USING (public.is_admin());

-- CONNECTIONS POLICIES
CREATE POLICY "Connections user read" ON public.connections
  FOR SELECT USING (requester_id = auth.uid() OR receiver_id = auth.uid() OR public.is_admin());

CREATE POLICY "Connections user insert" ON public.connections
  FOR INSERT WITH CHECK (requester_id = auth.uid() OR public.is_admin());

CREATE POLICY "Connections user update" ON public.connections
  FOR UPDATE USING (requester_id = auth.uid() OR receiver_id = auth.uid() OR public.is_admin());

-- MESSAGES POLICIES
CREATE POLICY "Messages participants read" ON public.messages
  FOR SELECT USING (sender_id = auth.uid() OR receiver_id = auth.uid() OR public.is_admin());

CREATE POLICY "Messages sender insert" ON public.messages
  FOR INSERT WITH CHECK (sender_id = auth.uid() OR public.is_admin());

-- RECRUITERS & BOOKMARKS POLICIES
CREATE POLICY "Recruiters public select" ON public.recruiters FOR SELECT USING (true);
CREATE POLICY "Bookmarks recruiter manage" ON public.bookmarks FOR ALL USING (recruiter_id = auth.uid() OR public.is_admin());

-- 10. REALTIME PUBLICATION SETUP
ALTER PUBLICATION supabase_realtime ADD TABLE public.portfolios;
ALTER PUBLICATION supabase_realtime ADD TABLE public.connections;
ALTER PUBLICATION supabase_realtime ADD TABLE public.messages;
ALTER PUBLICATION supabase_realtime ADD TABLE public.achievements;

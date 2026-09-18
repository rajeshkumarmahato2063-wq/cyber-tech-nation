-- ============================================================================
-- ZAYATHON 2026 - JUDGE PORTAL, AI ASSISTANT & REALTIME LEADERBOARD MIGRATION
-- ============================================================================

-- 1. UPDATE PROFILES ROLE CHECK TO INCLUDE 'judge'
ALTER TABLE public.profiles DROP CONSTRAINT IF EXISTS profiles_role_check;
ALTER TABLE public.profiles ADD CONSTRAINT profiles_role_check 
  CHECK (role IN ('user', 'organizer', 'admin', 'judge'));

-- 2. JUDGES TABLE
CREATE TABLE IF NOT EXISTS public.judges (
  id UUID PRIMARY KEY REFERENCES public.profiles(id) ON DELETE CASCADE,
  domain_expertise TEXT,
  organization TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. JUDGE ASSIGNMENTS TABLE
CREATE TABLE IF NOT EXISTS public.judge_assignments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  judge_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  registration_id UUID REFERENCES public.registrations(id) ON DELETE CASCADE NOT NULL,
  assigned_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(judge_id, registration_id)
);

-- 4. JUDGE SCORES TABLE
CREATE TABLE IF NOT EXISTS public.judge_scores (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  judge_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  registration_id UUID REFERENCES public.registrations(id) ON DELETE CASCADE NOT NULL,
  innovation_score INT DEFAULT 0 CHECK (innovation_score BETWEEN 0 AND 25),
  technical_score INT DEFAULT 0 CHECK (technical_score BETWEEN 0 AND 25),
  feasibility_score INT DEFAULT 0 CHECK (feasibility_score BETWEEN 0 AND 20),
  presentation_score INT DEFAULT 0 CHECK (presentation_score BETWEEN 0 AND 15),
  impact_score INT DEFAULT 0 CHECK (impact_score BETWEEN 0 AND 15),
  total_score INT DEFAULT 0,
  comments TEXT,
  is_final BOOLEAN DEFAULT false,
  submitted_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(judge_id, registration_id)
);

-- Trigger to calculate total_score on Insert/Update
CREATE OR REPLACE FUNCTION calculate_judge_total_score()
RETURNS TRIGGER AS $$
BEGIN
  NEW.total_score := COALESCE(NEW.innovation_score, 0) + 
                     COALESCE(NEW.technical_score, 0) + 
                     COALESCE(NEW.feasibility_score, 0) + 
                     COALESCE(NEW.presentation_score, 0) + 
                     COALESCE(NEW.impact_score, 0);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_calc_score ON public.judge_scores;
CREATE TRIGGER trg_calc_score
  BEFORE INSERT OR UPDATE ON public.judge_scores
  FOR EACH ROW EXECUTE FUNCTION calculate_judge_total_score();

-- 5. AI CHAT HISTORY TABLE
CREATE TABLE IF NOT EXISTS public.ai_chat_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  prompt TEXT NOT NULL,
  response TEXT NOT NULL,
  category TEXT DEFAULT 'General',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Helper Function: Is Judge
CREATE OR REPLACE FUNCTION public.is_judge()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role IN ('judge', 'admin', 'organizer')
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================================
-- RLS POLICIES FOR JUDGING & AI TABLES
-- ============================================================================
ALTER TABLE public.judges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.judge_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.judge_scores ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_chat_history ENABLE ROW LEVEL SECURITY;

-- JUDGES POLICIES
CREATE POLICY "Judges read policy" ON public.judges
  FOR SELECT USING (true);

CREATE POLICY "Judges admin manage policy" ON public.judges
  FOR ALL USING (public.is_admin());

-- JUDGE ASSIGNMENTS POLICIES (Admin manage, Judge read own assignments)
CREATE POLICY "Assignments admin manage" ON public.judge_assignments
  FOR ALL USING (public.is_admin());

CREATE POLICY "Assignments judge read" ON public.judge_assignments
  FOR SELECT USING (auth.uid() = judge_id OR public.is_admin());

-- JUDGE SCORES POLICIES (Judge read/write own scores, Admin full access, Public read summary)
CREATE POLICY "Scores admin manage" ON public.judge_scores
  FOR ALL USING (public.is_admin());

CREATE POLICY "Scores judge insert update" ON public.judge_scores
  FOR ALL USING (auth.uid() = judge_id);

CREATE POLICY "Scores public read" ON public.judge_scores
  FOR SELECT USING (true);

-- AI CHAT HISTORY POLICIES (User manage own chat history)
CREATE POLICY "AI chat user manage" ON public.ai_chat_history
  FOR ALL USING (auth.uid() = user_id OR public.is_admin());

-- ============================================================================
-- REALTIME PUBLICATION SETUP FOR NEW TABLES
-- ============================================================================
ALTER PUBLICATION supabase_realtime ADD TABLE public.judge_scores;
ALTER PUBLICATION supabase_realtime ADD TABLE public.judge_assignments;
ALTER PUBLICATION supabase_realtime ADD TABLE public.ai_chat_history;

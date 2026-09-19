-- ============================================================================
-- ZAYATHON MULTI-EVENT PLATFORM SCHEMA MIGRATION
-- Migration: 20260919_multi_event_platform.sql
-- Enables multi-event management, event templates, event archives, organizer scoping & RLS
-- ============================================================================

-- 1. EVENTS TABLE
CREATE TABLE IF NOT EXISTS public.events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  theme TEXT,
  description TEXT,
  banner_image TEXT,
  start_date TIMESTAMPTZ,
  end_date TIMESTAMPTZ,
  registration_deadline TIMESTAMPTZ,
  venue TEXT DEFAULT 'Online & Main Campus Arena',
  prize_pool TEXT DEFAULT '$10,000+',
  max_teams INT DEFAULT 100,
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'live', 'completed', 'archived')),
  created_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. EVENT ORGANIZERS ASSIGNMENT TABLE
CREATE TABLE IF NOT EXISTS public.event_organizers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID REFERENCES public.events(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  role TEXT DEFAULT 'organizer',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(event_id, user_id)
);

-- 3. EVENT SPONSORS TABLE (Event-specific)
CREATE TABLE IF NOT EXISTS public.event_sponsors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID REFERENCES public.events(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  logo_url TEXT NOT NULL,
  website TEXT,
  tier TEXT DEFAULT 'Gold' CHECK (tier IN ('Title', 'Platinum', 'Gold', 'Silver', 'Community', 'Media')),
  display_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. EVENT FAQS TABLE (Event-specific)
CREATE TABLE IF NOT EXISTS public.event_faqs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID REFERENCES public.events(id) ON DELETE CASCADE NOT NULL,
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  display_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. EVENT GALLERY TABLE (Event-specific)
CREATE TABLE IF NOT EXISTS public.event_gallery (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID REFERENCES public.events(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  image_url TEXT NOT NULL,
  category TEXT DEFAULT 'Ceremony',
  caption TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. EVENT TEMPLATES TABLE
CREATE TABLE IF NOT EXISTS public.event_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  timeline_data JSONB DEFAULT '[]'::jsonb,
  faq_data JSONB DEFAULT '[]'::jsonb,
  sponsor_data JSONB DEFAULT '[]'::jsonb,
  prize_data JSONB DEFAULT '[]'::jsonb,
  settings JSONB DEFAULT '{}'::jsonb,
  created_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. UPDATE EXISTING TABLES WITH event_id FOREIGN KEY
ALTER TABLE public.registrations ADD COLUMN IF NOT EXISTS event_id UUID REFERENCES public.events(id) ON DELETE SET NULL;
ALTER TABLE public.teams ADD COLUMN IF NOT EXISTS event_id UUID REFERENCES public.events(id) ON DELETE SET NULL;
ALTER TABLE public.announcements ADD COLUMN IF NOT EXISTS event_id UUID REFERENCES public.events(id) ON DELETE SET NULL;
ALTER TABLE public.checkins ADD COLUMN IF NOT EXISTS event_id UUID REFERENCES public.events(id) ON DELETE SET NULL;

DO $$ 
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'judge_assignments') THEN
    ALTER TABLE public.judge_assignments ADD COLUMN IF NOT EXISTS event_id UUID REFERENCES public.events(id) ON DELETE SET NULL;
  END IF;
END $$;

-- 8. SEED DEFAULT ZAYATHON 2026 EVENT AND LINK EXISTING DATA
INSERT INTO public.events (id, name, slug, theme, description, banner_image, start_date, end_date, registration_deadline, venue, prize_pool, max_teams, status)
VALUES (
  'a0000000-0000-0000-0000-000000000001',
  'ZayaThon 2026',
  'zayathon-2026',
  'Next-Gen AI & Cyber Security Hackathon',
  'The premier flagship national hackathon empowering creators, engineers, and visionaries to build groundbreaking software.',
  'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1200&q=80',
  NOW() - INTERVAL '1 day',
  NOW() + INTERVAL '2 days',
  NOW() + INTERVAL '12 hours',
  'Main Campus Arena & Discord',
  '$15,000 USD',
  150,
  'live'
) ON CONFLICT (slug) DO NOTHING;

-- Seed Sample Event 2: AI Sprint 2027
INSERT INTO public.events (id, name, slug, theme, description, banner_image, start_date, end_date, registration_deadline, venue, prize_pool, max_teams, status)
VALUES (
  'a0000000-0000-0000-0000-000000000002',
  'AI Sprint 2027',
  'ai-sprint-2027',
  'Generative AI & LLM Agentic Workflows',
  '48-hour intensive building challenge focusing on LLMs, autonomous agents, and computer vision innovation.',
  'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80',
  NOW() + INTERVAL '30 days',
  NOW() + INTERVAL '32 days',
  NOW() + INTERVAL '25 days',
  'Virtual Innovation Hub',
  '$10,000 USD',
  100,
  'published'
) ON CONFLICT (slug) DO NOTHING;

-- Seed Sample Event 3: Web3 HackFest
INSERT INTO public.events (id, name, slug, theme, description, banner_image, start_date, end_date, registration_deadline, venue, prize_pool, max_teams, status)
VALUES (
  'a0000000-0000-0000-0000-000000000003',
  'Web3 HackFest 2025',
  'web3-hackfest',
  'DeFi, Smart Contracts & Zero Knowledge Proofs',
  'Our inaugural blockchain hackathon where 80+ teams built decentralized financial infrastructure and privacy protocols.',
  'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?auto=format&fit=crop&w=1200&q=80',
  NOW() - INTERVAL '90 days',
  NOW() - INTERVAL '88 days',
  NOW() - INTERVAL '95 days',
  'Crypto Convention Hub',
  '$25,000 USD',
  80,
  'completed'
) ON CONFLICT (slug) DO NOTHING;

-- BACKFILL EXISTING ROWS TO DEFAULT ZAYATHON 2026 EVENT
UPDATE public.registrations SET event_id = 'a0000000-0000-0000-0000-000000000001' WHERE event_id IS NULL;
UPDATE public.teams SET event_id = 'a0000000-0000-0000-0000-000000000001' WHERE event_id IS NULL;
UPDATE public.announcements SET event_id = 'a0000000-0000-0000-0000-000000000001' WHERE event_id IS NULL;
UPDATE public.checkins SET event_id = 'a0000000-0000-0000-0000-000000000001' WHERE event_id IS NULL;

DO $$ 
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'judge_assignments') THEN
    UPDATE public.judge_assignments SET event_id = 'a0000000-0000-0000-0000-000000000001' WHERE event_id IS NULL;
  END IF;
END $$;

-- 9. HELPER FUNCTIONS FOR ORGANIZER ACCESS CONTROL
CREATE OR REPLACE FUNCTION public.is_event_organizer(e_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  ) OR EXISTS (
    SELECT 1 FROM public.events
    WHERE id = e_id AND created_by = auth.uid()
  ) OR EXISTS (
    SELECT 1 FROM public.event_organizers
    WHERE event_id = e_id AND user_id = auth.uid()
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 10. ROW LEVEL SECURITY (RLS) POLICIES
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.event_organizers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.event_sponsors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.event_faqs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.event_gallery ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.event_templates ENABLE ROW LEVEL SECURITY;

-- EVENTS POLICIES
CREATE POLICY "Events public select" ON public.events
  FOR SELECT USING (status IN ('published', 'live', 'completed', 'archived') OR public.is_admin() OR public.is_event_organizer(id));

CREATE POLICY "Events admin manage" ON public.events
  FOR ALL USING (public.is_admin() OR public.is_event_organizer(id));

-- EVENT ORGANIZERS POLICIES
CREATE POLICY "Event organizers select" ON public.event_organizers
  FOR SELECT USING (user_id = auth.uid() OR public.is_admin());

CREATE POLICY "Event organizers admin manage" ON public.event_organizers
  FOR ALL USING (public.is_admin());

-- EVENT SPONSORS POLICIES
CREATE POLICY "Event sponsors public select" ON public.event_sponsors
  FOR SELECT USING (true);

CREATE POLICY "Event sponsors admin manage" ON public.event_sponsors
  FOR ALL USING (public.is_admin() OR public.is_event_organizer(event_id));

-- EVENT FAQS POLICIES
CREATE POLICY "Event faqs public select" ON public.event_faqs
  FOR SELECT USING (true);

CREATE POLICY "Event faqs admin manage" ON public.event_faqs
  FOR ALL USING (public.is_admin() OR public.is_event_organizer(event_id));

-- EVENT GALLERY POLICIES
CREATE POLICY "Event gallery public select" ON public.event_gallery
  FOR SELECT USING (true);

CREATE POLICY "Event gallery admin manage" ON public.event_gallery
  FOR ALL USING (public.is_admin() OR public.is_event_organizer(event_id));

-- EVENT TEMPLATES POLICIES
CREATE POLICY "Event templates select" ON public.event_templates
  FOR SELECT USING (public.is_admin() OR EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'organizer')));

CREATE POLICY "Event templates manage" ON public.event_templates
  FOR ALL USING (public.is_admin());

-- 11. REALTIME PUBLICATION SETUP FOR MULTI-EVENT TABLES
ALTER PUBLICATION supabase_realtime ADD TABLE public.events;
ALTER PUBLICATION supabase_realtime ADD TABLE public.event_organizers;
ALTER PUBLICATION supabase_realtime ADD TABLE public.event_sponsors;
ALTER PUBLICATION supabase_realtime ADD TABLE public.event_faqs;
ALTER PUBLICATION supabase_realtime ADD TABLE public.event_gallery;

-- ============================================================================
-- ZAYATHON 2026 SUPABASE DATABASE SCHEMA MIGRATION
-- Production Ready: PostgreSQL Schema, Triggers, RLS Policies, Storage & Realtime
-- ============================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. PROFILES TABLE (Linked to auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  role TEXT DEFAULT 'user' CHECK (role IN ('user', 'organizer', 'admin')),
  phone TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. TEAMS TABLE
CREATE TABLE IF NOT EXISTS public.teams (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  team_name TEXT UNIQUE NOT NULL,
  leader_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  college TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. TEAM MEMBERS TABLE
CREATE TABLE IF NOT EXISTS public.team_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  team_id UUID REFERENCES public.teams(id) ON DELETE CASCADE NOT NULL,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  department TEXT NOT NULL,
  year TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. REGISTRATIONS TABLE
CREATE TABLE IF NOT EXISTS public.registrations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  team_id UUID REFERENCES public.teams(id) ON DELETE SET NULL,
  innovation_domain TEXT NOT NULL,
  project_title TEXT NOT NULL,
  project_description TEXT NOT NULL,
  proposal_url TEXT,
  ppt_url TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. SPONSORS TABLE
CREATE TABLE IF NOT EXISTS public.sponsors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  logo_url TEXT NOT NULL,
  website TEXT,
  tier TEXT DEFAULT 'Gold' CHECK (tier IN ('Title', 'Platinum', 'Gold', 'Silver', 'Community', 'Media')),
  display_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. FAQ TABLE
CREATE TABLE IF NOT EXISTS public.faq (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  display_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. CONTACTS TABLE
CREATE TABLE IF NOT EXISTS public.contacts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- AUTOMATIC PROFILE CREATION TRIGGER ON USER SIGNUP
-- ============================================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, email, role, phone)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', SPLIT_PART(NEW.email, '@', 1)),
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'role', 'user'),
    COALESCE(NEW.raw_user_meta_data->>'phone', '')
  )
  ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    full_name = EXCLUDED.full_name;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sponsors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.faq ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contacts ENABLE ROW LEVEL SECURITY;

-- Helper Function: Is Admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role IN ('admin', 'organizer')
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- PROFILES POLICIES
CREATE POLICY "Profiles read policy" ON public.profiles
  FOR SELECT USING (auth.uid() = id OR public.is_admin());

CREATE POLICY "Profiles update policy" ON public.profiles
  FOR UPDATE USING (auth.uid() = id OR public.is_admin());

-- TEAMS POLICIES
CREATE POLICY "Teams read policy" ON public.teams
  FOR SELECT USING (true);

CREATE POLICY "Teams insert policy" ON public.teams
  FOR INSERT WITH CHECK (auth.uid() = leader_id OR public.is_admin());

CREATE POLICY "Teams update policy" ON public.teams
  FOR UPDATE USING (auth.uid() = leader_id OR public.is_admin());

CREATE POLICY "Teams delete policy" ON public.teams
  FOR DELETE USING (auth.uid() = leader_id OR public.is_admin());

-- TEAM MEMBERS POLICIES
CREATE POLICY "Team members read policy" ON public.team_members
  FOR SELECT USING (true);

CREATE POLICY "Team members insert policy" ON public.team_members
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.teams
      WHERE id = team_id AND (leader_id = auth.uid() OR public.is_admin())
    )
  );

CREATE POLICY "Team members update policy" ON public.team_members
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.teams
      WHERE id = team_id AND (leader_id = auth.uid() OR public.is_admin())
    )
  );

CREATE POLICY "Team members delete policy" ON public.team_members
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM public.teams
      WHERE id = team_id AND (leader_id = auth.uid() OR public.is_admin())
    )
  );

-- REGISTRATIONS POLICIES
CREATE POLICY "Registrations read policy" ON public.registrations
  FOR SELECT USING (auth.uid() = user_id OR public.is_admin());

CREATE POLICY "Registrations insert policy" ON public.registrations
  FOR INSERT WITH CHECK (auth.uid() = user_id OR public.is_admin());

CREATE POLICY "Registrations update policy" ON public.registrations
  FOR UPDATE USING (auth.uid() = user_id OR public.is_admin());

CREATE POLICY "Registrations delete policy" ON public.registrations
  FOR DELETE USING (public.is_admin());

-- SPONSORS POLICIES (Public read, Admin manage)
CREATE POLICY "Sponsors read policy" ON public.sponsors
  FOR SELECT USING (true);

CREATE POLICY "Sponsors admin manage policy" ON public.sponsors
  FOR ALL USING (public.is_admin());

-- FAQ POLICIES (Public read, Admin manage)
CREATE POLICY "FAQ read policy" ON public.faq
  FOR SELECT USING (true);

CREATE POLICY "FAQ admin manage policy" ON public.faq
  FOR ALL USING (public.is_admin());

-- CONTACTS POLICIES (Public insert, Admin read/manage)
CREATE POLICY "Contacts public insert policy" ON public.contacts
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Contacts admin select policy" ON public.contacts
  FOR SELECT USING (public.is_admin());

CREATE POLICY "Contacts admin manage policy" ON public.contacts
  FOR ALL USING (public.is_admin());

-- ============================================================================
-- STORAGE BUCKETS SETUP & SECURITY POLICIES
-- ============================================================================
INSERT INTO storage.buckets (id, name, public) VALUES
  ('proposals', 'proposals', true),
  ('ppts', 'ppts', true),
  ('sponsor-logos', 'sponsor-logos', true),
  ('avatars', 'avatars', true)
ON CONFLICT (id) DO NOTHING;

-- Public Storage Access Policies
CREATE POLICY "Public Storage Read Policy" ON storage.objects
  FOR SELECT USING (true);

CREATE POLICY "Authenticated Storage Upload Policy" ON storage.objects
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Storage Admin Manage Policy" ON storage.objects
  FOR ALL USING (public.is_admin());

-- ============================================================================
-- REALTIME PUBLICATION SETUP
-- ============================================================================
ALTER PUBLICATION supabase_realtime ADD TABLE public.registrations;
ALTER PUBLICATION supabase_realtime ADD TABLE public.contacts;
ALTER PUBLICATION supabase_realtime ADD TABLE public.teams;

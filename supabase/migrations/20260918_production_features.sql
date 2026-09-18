-- ============================================================================
-- ZAYATHON 2026 - PRODUCTION FEATURES SCHEMA MIGRATION
-- Phase 1 - 12: Registration Approval, QR System, Certificates, Check-ins,
-- Announcements, Audit Logs, Security RLS, Realtime & Storage Buckets
-- ============================================================================

-- 1. UPDATE REGISTRATIONS TABLE WITH WORKFLOW & QR COLUMNS
ALTER TABLE public.registrations DROP CONSTRAINT IF EXISTS registrations_status_check;
ALTER TABLE public.registrations ADD CONSTRAINT registrations_status_check 
  CHECK (status IN ('pending', 'under_review', 'approved', 'rejected'));

ALTER TABLE public.registrations
  ADD COLUMN IF NOT EXISTS status_notes TEXT,
  ADD COLUMN IF NOT EXISTS qr_code_data TEXT,
  ADD COLUMN IF NOT EXISTS qr_code_url TEXT,
  ADD COLUMN IF NOT EXISTS checked_in BOOLEAN DEFAULT false,
  ADD COLUMN IF NOT EXISTS check_in_time TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS award_type TEXT DEFAULT 'Participant' CHECK (award_type IN ('Participant', 'Winner', 'Runner-up', 'Special Award'));

-- 2. ANNOUNCEMENTS TABLE
CREATE TABLE IF NOT EXISTS public.announcements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  category TEXT DEFAULT 'General' CHECK (category IN ('General', 'Schedule', 'Rules', 'Urgent')),
  is_pinned BOOLEAN DEFAULT false,
  created_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. CHECKINS TABLE
CREATE TABLE IF NOT EXISTS public.checkins (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  registration_id UUID REFERENCES public.registrations(id) ON DELETE CASCADE NOT NULL,
  scanned_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  method TEXT DEFAULT 'QR' CHECK (method IN ('QR', 'Manual')),
  check_in_time TIMESTAMPTZ DEFAULT NOW()
);

-- 4. CERTIFICATES TABLE
CREATE TABLE IF NOT EXISTS public.certificates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  registration_id UUID REFERENCES public.registrations(id) ON DELETE CASCADE NOT NULL,
  certificate_number TEXT UNIQUE NOT NULL,
  recipient_name TEXT NOT NULL,
  team_name TEXT NOT NULL,
  domain TEXT NOT NULL,
  award_type TEXT DEFAULT 'Participant' CHECK (award_type IN ('Participant', 'Winner', 'Runner-up', 'Special Award')),
  issue_date DATE DEFAULT CURRENT_DATE,
  pdf_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. AUDIT LOGS TABLE
CREATE TABLE IF NOT EXISTS public.audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  user_email TEXT,
  action TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id TEXT,
  details JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. EMAIL LOGS TABLE
CREATE TABLE IF NOT EXISTS public.email_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  recipient_email TEXT NOT NULL,
  subject TEXT NOT NULL,
  template_name TEXT NOT NULL,
  status TEXT DEFAULT 'sent' CHECK (status IN ('pending', 'sent', 'failed')),
  sent_at TIMESTAMPTZ DEFAULT NOW(),
  payload JSONB DEFAULT '{}'::jsonb
);

-- ============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES FOR NEW TABLES
-- ============================================================================
ALTER TABLE public.announcements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.checkins ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.certificates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.email_logs ENABLE ROW LEVEL SECURITY;

-- ANNOUNCEMENTS POLICIES (Public/Authenticated read, Admin write)
CREATE POLICY "Announcements public read" ON public.announcements
  FOR SELECT USING (true);

CREATE POLICY "Announcements admin insert" ON public.announcements
  FOR INSERT WITH CHECK (public.is_admin());

CREATE POLICY "Announcements admin update" ON public.announcements
  FOR UPDATE USING (public.is_admin());

CREATE POLICY "Announcements admin delete" ON public.announcements
  FOR DELETE USING (public.is_admin());

-- CHECKINS POLICIES (Admin manage, User read own)
CREATE POLICY "Checkins admin manage" ON public.checkins
  FOR ALL USING (public.is_admin());

CREATE POLICY "Checkins participant select" ON public.checkins
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.registrations r
      WHERE r.id = registration_id AND r.user_id = auth.uid()
    )
  );

-- CERTIFICATES POLICIES (Participant read own, Admin manage all)
CREATE POLICY "Certificates admin manage" ON public.certificates
  FOR ALL USING (public.is_admin());

CREATE POLICY "Certificates participant read" ON public.certificates
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.registrations r
      WHERE r.id = registration_id AND (r.user_id = auth.uid() OR public.is_admin())
    )
  );

-- AUDIT LOGS POLICIES (Admin only)
CREATE POLICY "Audit logs admin only" ON public.audit_logs
  FOR ALL USING (public.is_admin());

-- EMAIL LOGS POLICIES (Admin only)
CREATE POLICY "Email logs admin only" ON public.email_logs
  FOR ALL USING (public.is_admin());

-- ============================================================================
-- STORAGE BUCKET CREATION FOR CERTIFICATES & TEAM LOGOS
-- ============================================================================
INSERT INTO storage.buckets (id, name, public) VALUES
  ('certificates', 'certificates', true),
  ('logos', 'logos', true)
ON CONFLICT (id) DO NOTHING;

-- ============================================================================
-- REALTIME PUBLICATION SETUP FOR NEW TABLES
-- ============================================================================
ALTER PUBLICATION supabase_realtime ADD TABLE public.announcements;
ALTER PUBLICATION supabase_realtime ADD TABLE public.checkins;
ALTER PUBLICATION supabase_realtime ADD TABLE public.certificates;
ALTER PUBLICATION supabase_realtime ADD TABLE public.audit_logs;

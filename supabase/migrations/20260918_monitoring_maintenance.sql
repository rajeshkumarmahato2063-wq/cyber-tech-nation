-- ============================================================================
-- ZAYATHON 2026 - MONITORING, NOTIFICATIONS & MAINTENANCE MIGRATION
-- ============================================================================

-- 1. NOTIFICATIONS TABLE
CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT DEFAULT 'info' CHECK (type IN ('info', 'success', 'warning', 'urgent')),
  read BOOLEAN DEFAULT false,
  link TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. SYSTEM SETTINGS TABLE (Maintenance mode, registrations toggle, event config)
CREATE TABLE IF NOT EXISTS public.system_settings (
  key TEXT PRIMARY KEY,
  value JSONB NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert default system settings
INSERT INTO public.system_settings (key, value) VALUES
  ('maintenance_mode', '{"enabled": false, "message": "System under routine maintenance."}'::jsonb),
  ('registrations_enabled', '{"enabled": true, "reason": "Registrations open"}'::jsonb),
  ('event_dates', '{"start_date": "2026-12-01", "end_date": "2026-12-03"}'::jsonb)
ON CONFLICT (key) DO NOTHING;

-- 3. MAINTENANCE LOGS TABLE
CREATE TABLE IF NOT EXISTS public.maintenance_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  enabled_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  reason TEXT,
  started_at TIMESTAMPTZ DEFAULT NOW(),
  ended_at TIMESTAMPTZ
);

-- 4. BACKUPS TABLE
CREATE TABLE IF NOT EXISTS public.backups (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  backup_type TEXT DEFAULT 'daily' CHECK (backup_type IN ('daily', 'weekly', 'manual')),
  status TEXT DEFAULT 'completed' CHECK (status IN ('pending', 'completed', 'failed')),
  file_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert initial backup record
INSERT INTO public.backups (backup_type, status) VALUES ('daily', 'completed') ON CONFLICT DO NOTHING;

-- 5. ANALYTICS SNAPSHOTS TABLE
CREATE TABLE IF NOT EXISTS public.analytics_snapshots (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  snapshot_date DATE DEFAULT CURRENT_DATE,
  total_registrations INT DEFAULT 0,
  total_checked_in INT DEFAULT 0,
  average_score NUMERIC DEFAULT 0,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- RLS POLICIES FOR NOTIFICATIONS & MAINTENANCE
-- ============================================================================
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.system_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.maintenance_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.backups ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.analytics_snapshots ENABLE ROW LEVEL SECURITY;

-- NOTIFICATIONS POLICIES (Users manage own notifications)
CREATE POLICY "User notifications policy" ON public.notifications
  FOR ALL USING (auth.uid() = user_id OR public.is_admin());

-- SYSTEM SETTINGS POLICIES (Public read settings, Admin manage)
CREATE POLICY "Settings public read" ON public.system_settings
  FOR SELECT USING (true);

CREATE POLICY "Settings admin manage" ON public.system_settings
  FOR ALL USING (public.is_admin());

-- MAINTENANCE, BACKUPS & ANALYTICS POLICIES (Admin only)
CREATE POLICY "Maintenance admin only" ON public.maintenance_logs
  FOR ALL USING (public.is_admin());

CREATE POLICY "Backups admin only" ON public.backups
  FOR ALL USING (public.is_admin());

CREATE POLICY "Analytics admin only" ON public.analytics_snapshots
  FOR ALL USING (public.is_admin());

-- ============================================================================
-- REALTIME PUBLICATION SETUP FOR NOTIFICATIONS & SETTINGS
-- ============================================================================
ALTER PUBLICATION supabase_realtime ADD TABLE public.notifications;
ALTER PUBLICATION supabase_realtime ADD TABLE public.system_settings;

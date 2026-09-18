-- Migration: Live Event Operations Module Schema
-- Created: 2026-09-18

-- 1. Event State Table (Phase, Emergency Broadcast & Master Controls)
CREATE TABLE IF NOT EXISTS public.event_state (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  phase TEXT NOT NULL DEFAULT 'checkin', -- 'registration' | 'checkin' | 'hacking' | 'judging' | 'results' | 'ended'
  status TEXT NOT NULL DEFAULT 'active', -- 'active' | 'paused' | 'locked'
  current_activity TEXT DEFAULT 'Hacking in Progress',
  emergency_broadcast JSONB DEFAULT '{"enabled": false, "title": "", "message": "", "level": "info"}'::jsonb,
  registrations_locked BOOLEAN DEFAULT false,
  judging_open BOOLEAN DEFAULT false,
  results_published BOOLEAN DEFAULT false,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Seed initial event state if empty
INSERT INTO public.event_state (phase, status, current_activity)
SELECT 'checkin', 'active', 'Onsite Check-in & Team Setup'
WHERE NOT EXISTS (SELECT 1 FROM public.event_state);

-- 2. Event Schedule Table
CREATE TABLE IF NOT EXISTS public.event_schedule (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  time_label TEXT NOT NULL,
  activity TEXT NOT NULL,
  location TEXT DEFAULT 'Main Arena',
  description TEXT,
  status TEXT DEFAULT 'upcoming', -- 'completed' | 'ongoing' | 'upcoming'
  order_index INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Seed initial schedule items
INSERT INTO public.event_schedule (time_label, activity, location, description, status, order_index)
SELECT '09:00 AM', 'Onsite Check-in & Badge Claim', 'Main Entrance Hub', 'Participants arrive, receive access badges and swags.', 'completed', 1
WHERE NOT EXISTS (SELECT 1 FROM public.event_schedule WHERE order_index = 1);

INSERT INTO public.event_schedule (time_label, activity, location, description, status, order_index)
SELECT '10:00 AM', 'Opening Ceremony & Keynote', 'Grand Auditorium', 'Welcome address, problem statement overview and rule release.', 'ongoing', 2
WHERE NOT EXISTS (SELECT 1 FROM public.event_schedule WHERE order_index = 2);

INSERT INTO public.event_schedule (time_label, activity, location, description, status, order_index)
SELECT '11:00 AM', 'Hacking Sprint Begins', 'Cyber Lab 1 & 2', '24-hour hacking timer commences. Mentors available on call.', 'upcoming', 3
WHERE NOT EXISTS (SELECT 1 FROM public.event_schedule WHERE order_index = 3);

INSERT INTO public.event_schedule (time_label, activity, location, description, status, order_index)
SELECT '04:00 PM', 'Mid-way Mentor Checkpoint', 'Virtual Booths', 'Optional code review and technical guidance session with judges.', 'upcoming', 4
WHERE NOT EXISTS (SELECT 1 FROM public.event_schedule WHERE order_index = 4);

INSERT INTO public.event_schedule (time_label, activity, location, description, status, order_index)
SELECT '06:00 PM', 'Final Submission & Pitch Preparation', 'Online Portal', 'Repositories frozen. Final deck and video demos uploaded.', 'upcoming', 5
WHERE NOT EXISTS (SELECT 1 FROM public.event_schedule WHERE order_index = 5);

INSERT INTO public.event_schedule (time_label, activity, location, description, status, order_index)
SELECT '07:30 PM', 'Grand Pitch & Judging Round', 'Main Stage', 'Top shortlisted teams pitch live before the judging panel.', 'upcoming', 6
WHERE NOT EXISTS (SELECT 1 FROM public.event_schedule WHERE order_index = 6);

INSERT INTO public.event_schedule (time_label, activity, location, description, status, order_index)
SELECT '09:00 PM', 'Winner Announcement & Awards', 'Grand Auditorium', 'Prize distribution, certificates and closing remarks.', 'upcoming', 7
WHERE NOT EXISTS (SELECT 1 FROM public.event_schedule WHERE order_index = 7);

-- 3. Event Photo Gallery Table
CREATE TABLE IF NOT EXISTS public.gallery (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  image_url TEXT NOT NULL,
  category TEXT DEFAULT 'Ceremony', -- 'Ceremony' | 'Hacking' | 'Demos' | 'Winners'
  caption TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Realtime for live tables
ALTER PUBLICATION supabase_realtime ADD TABLE public.event_state;
ALTER PUBLICATION supabase_realtime ADD TABLE public.announcements;
ALTER PUBLICATION supabase_realtime ADD TABLE public.event_schedule;

-- RLS Policies
ALTER TABLE public.event_state ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.event_schedule ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gallery ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read event_state" ON public.event_state FOR SELECT USING (true);
CREATE POLICY "Allow admin write event_state" ON public.event_state FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Allow public read event_schedule" ON public.event_schedule FOR SELECT USING (true);
CREATE POLICY "Allow admin write event_schedule" ON public.event_schedule FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Allow public read gallery" ON public.gallery FOR SELECT USING (true);
CREATE POLICY "Allow admin write gallery" ON public.gallery FOR ALL USING (auth.role() = 'authenticated');

-- SQL Migration for ZayaThon Team Match Hub
-- File: supabase/migrations/20260919_team_match_hub.sql

-- Enable UUID extension if not enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Create team_match_profiles table
CREATE TABLE IF NOT EXISTS public.team_match_profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE NOT NULL,
  full_name TEXT NOT NULL,
  photo_url TEXT,
  college TEXT NOT NULL,
  department TEXT,
  year TEXT,
  experience TEXT CHECK (experience IN ('Beginner', 'Intermediate', 'Advanced', 'Lead')),
  looking_for TEXT CHECK (looking_for IN ('Team', 'Members', 'Either')) DEFAULT 'Either',
  availability TEXT CHECK (availability IN ('Full-time', 'Part-time', 'Evenings', 'Weekends')) DEFAULT 'Full-time',
  preferred_domain TEXT,
  short_bio TEXT,
  github_url TEXT,
  linkedin_url TEXT,
  portfolio_url TEXT,
  languages TEXT[],
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'matched', 'busy', 'banned')),
  is_banned BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Create skills master table
CREATE TABLE IF NOT EXISTS public.skills (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT UNIQUE NOT NULL,
  category TEXT DEFAULT 'general',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Seed default popular skills
INSERT INTO public.skills (name, category) VALUES
  ('React', 'Frontend'),
  ('AI', 'AI/ML'),
  ('ML', 'AI/ML'),
  ('Web3', 'Blockchain'),
  ('UI/UX', 'Design'),
  ('Python', 'Backend'),
  ('Java', 'Backend'),
  ('Node.js', 'Backend'),
  ('TypeScript', 'Frontend'),
  ('Next.js', 'Frontend'),
  ('TailwindCSS', 'Frontend'),
  ('Flutter', 'Mobile'),
  ('Solidity', 'Blockchain'),
  ('DevOps', 'Cloud')
ON CONFLICT (name) DO NOTHING;

-- 3. Create profile_skills join table
CREATE TABLE IF NOT EXISTS public.profile_skills (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  profile_id UUID REFERENCES public.team_match_profiles(id) ON DELETE CASCADE NOT NULL,
  skill_id UUID REFERENCES public.skills(id) ON DELETE CASCADE NOT NULL,
  UNIQUE(profile_id, skill_id)
);

-- 4. Create open_teams table
CREATE TABLE IF NOT EXISTS public.open_teams (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  leader_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  team_name TEXT NOT NULL,
  domain TEXT NOT NULL,
  required_skills TEXT[] DEFAULT '{}',
  max_members INTEGER DEFAULT 4,
  current_members_count INTEGER DEFAULT 1,
  description TEXT,
  status TEXT DEFAULT 'open' CHECK (status IN ('open', 'full', 'closed')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Create team_members table for tracking team rosters
CREATE TABLE IF NOT EXISTS public.team_members (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  team_id UUID REFERENCES public.open_teams(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role TEXT DEFAULT 'member' CHECK (role IN ('leader', 'member')),
  joined_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(team_id, user_id)
);

-- 6. Create join_requests table
CREATE TABLE IF NOT EXISTS public.join_requests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  sender_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  receiver_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  team_id UUID REFERENCES public.open_teams(id) ON DELETE CASCADE,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected', 'cancelled')),
  message TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. Create team_chats table
CREATE TABLE IF NOT EXISTS public.team_chats (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  team_id UUID REFERENCES public.open_teams(id) ON DELETE CASCADE UNIQUE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. Create team_messages table
CREATE TABLE IF NOT EXISTS public.team_messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  chat_id UUID REFERENCES public.team_chats(id) ON DELETE CASCADE NOT NULL,
  sender_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  message TEXT NOT NULL,
  file_url TEXT,
  file_type TEXT,
  read_by UUID[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. Create reports table
CREATE TABLE IF NOT EXISTS public.reports (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  reporter_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  reported_user UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  team_id UUID REFERENCES public.open_teams(id) ON DELETE CASCADE,
  reason TEXT NOT NULL CHECK (reason IN ('Fake Profile', 'Spam', 'Harassment', 'Inappropriate Content', 'Other')),
  details TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'investigating', 'resolved', 'dismissed')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 10. Create team_match_notifications table
CREATE TABLE IF NOT EXISTS public.team_match_notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT DEFAULT 'info' CHECK (type IN ('join_request', 'request_accepted', 'request_rejected', 'recommendation', 'team_full', 'chat_message', 'info')),
  link TEXT,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- INDEXES for performance
CREATE INDEX IF NOT EXISTS idx_tmp_user_id ON public.team_match_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_tmp_college ON public.team_match_profiles(college);
CREATE INDEX IF NOT EXISTS idx_tmp_domain ON public.team_match_profiles(preferred_domain);
CREATE INDEX IF NOT EXISTS idx_tmp_experience ON public.team_match_profiles(experience);
CREATE INDEX IF NOT EXISTS idx_open_teams_leader ON public.open_teams(leader_id);
CREATE INDEX IF NOT EXISTS idx_open_teams_domain ON public.open_teams(domain);
CREATE INDEX IF NOT EXISTS idx_join_req_sender ON public.join_requests(sender_id);
CREATE INDEX IF NOT EXISTS idx_join_req_receiver ON public.join_requests(receiver_id);
CREATE INDEX IF NOT EXISTS idx_join_req_team ON public.join_requests(team_id);
CREATE INDEX IF NOT EXISTS idx_team_msg_chat ON public.team_messages(chat_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user ON public.team_match_notifications(user_id);

-- ROW LEVEL SECURITY (RLS) POLICIES

ALTER TABLE public.team_match_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profile_skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.open_teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.join_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.team_chats ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.team_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.team_match_notifications ENABLE ROW LEVEL SECURITY;

-- 1. Profiles Policies
CREATE POLICY "Public profiles are viewable by everyone" ON public.team_match_profiles
  FOR SELECT USING (true);

CREATE POLICY "Users can insert their own profile" ON public.team_match_profiles
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile" ON public.team_match_profiles
  FOR UPDATE USING (auth.uid() = user_id);

-- 2. Skills & Profile Skills Policies
CREATE POLICY "Skills viewable by everyone" ON public.skills FOR SELECT USING (true);
CREATE POLICY "Profile skills viewable by everyone" ON public.profile_skills FOR SELECT USING (true);
CREATE POLICY "Users insert profile skills" ON public.profile_skills FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM public.team_match_profiles WHERE id = profile_id AND user_id = auth.uid())
);
CREATE POLICY "Users delete profile skills" ON public.profile_skills FOR DELETE USING (
  EXISTS (SELECT 1 FROM public.team_match_profiles WHERE id = profile_id AND user_id = auth.uid())
);

-- 3. Open Teams Policies
CREATE POLICY "Open teams viewable by everyone" ON public.open_teams FOR SELECT USING (true);
CREATE POLICY "Users can create open team" ON public.open_teams FOR INSERT WITH CHECK (auth.uid() = leader_id);
CREATE POLICY "Team leader can update open team" ON public.open_teams FOR UPDATE USING (auth.uid() = leader_id);
CREATE POLICY "Team leader can delete open team" ON public.open_teams FOR DELETE USING (auth.uid() = leader_id);

-- 4. Team Members Policies
CREATE POLICY "Team members viewable by everyone" ON public.team_members FOR SELECT USING (true);
CREATE POLICY "Users or leader can manage team members" ON public.team_members FOR ALL USING (
  auth.uid() = user_id OR EXISTS (SELECT 1 FROM public.open_teams WHERE id = team_id AND leader_id = auth.uid())
);

-- 5. Join Requests Policies
CREATE POLICY "Users view relevant join requests" ON public.join_requests FOR SELECT USING (
  auth.uid() = sender_id OR auth.uid() = receiver_id OR EXISTS (
    SELECT 1 FROM public.open_teams WHERE id = team_id AND leader_id = auth.uid()
  )
);
CREATE POLICY "Users insert join requests" ON public.join_requests FOR INSERT WITH CHECK (auth.uid() = sender_id);
CREATE POLICY "Relevant users update join requests" ON public.join_requests FOR UPDATE USING (
  auth.uid() = sender_id OR auth.uid() = receiver_id OR EXISTS (
    SELECT 1 FROM public.open_teams WHERE id = team_id AND leader_id = auth.uid()
  )
);

-- 6. Team Chat & Messages Policies
CREATE POLICY "Team members view team chat" ON public.team_chats FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.team_members WHERE team_id = public.team_chats.team_id AND user_id = auth.uid())
  OR EXISTS (SELECT 1 FROM public.open_teams WHERE id = public.team_chats.team_id AND leader_id = auth.uid())
);

CREATE POLICY "Team members view team messages" ON public.team_messages FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.team_chats tc
    JOIN public.team_members tm ON tm.team_id = tc.team_id
    WHERE tc.id = chat_id AND tm.user_id = auth.uid()
  )
  OR EXISTS (
    SELECT 1 FROM public.team_chats tc
    JOIN public.open_teams ot ON ot.id = tc.team_id
    WHERE tc.id = chat_id AND ot.leader_id = auth.uid()
  )
);

CREATE POLICY "Team members insert team messages" ON public.team_messages FOR INSERT WITH CHECK (
  auth.uid() = sender_id AND (
    EXISTS (
      SELECT 1 FROM public.team_chats tc
      JOIN public.team_members tm ON tm.team_id = tc.team_id
      WHERE tc.id = chat_id AND tm.user_id = auth.uid()
    )
    OR EXISTS (
      SELECT 1 FROM public.team_chats tc
      JOIN public.open_teams ot ON ot.id = tc.team_id
      WHERE tc.id = chat_id AND ot.leader_id = auth.uid()
    )
  )
);

-- 7. Reports Policies
CREATE POLICY "Users insert reports" ON public.reports FOR INSERT WITH CHECK (auth.uid() = reporter_id);
CREATE POLICY "Users view own reports" ON public.reports FOR SELECT USING (auth.uid() = reporter_id);

-- 8. Notifications Policies
CREATE POLICY "Users view own notifications" ON public.team_match_notifications FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users update own notifications" ON public.team_match_notifications FOR UPDATE USING (auth.uid() = user_id);

-- SUPABASE STORAGE BUCKET CREATION (FOR AVATARS AND ATTACHMENTS)
INSERT INTO storage.buckets (id, name, public) 
VALUES ('team_match_assets', 'team_match_assets', true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Public Read Access for team_match_assets" 
ON storage.objects FOR SELECT USING (bucket_id = 'team_match_assets');

CREATE POLICY "Authenticated users upload to team_match_assets" 
ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'team_match_assets' AND auth.role() = 'authenticated');

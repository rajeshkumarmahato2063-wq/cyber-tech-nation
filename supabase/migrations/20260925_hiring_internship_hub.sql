-- ==========================================
-- ZAYATHON Hiring & Internship Hub Schema
-- Migration File: 20260925_hiring_internship_hub.sql
-- ==========================================

-- 1. Create 'companies' Table
CREATE TABLE IF NOT EXISTS public.companies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    name TEXT NOT NULL,
    logo TEXT,
    website TEXT,
    location TEXT DEFAULT 'San Francisco, CA',
    industry TEXT DEFAULT 'Artificial Intelligence',
    employee_count TEXT DEFAULT '50-200 Employees',
    description TEXT,
    verified BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Create 'jobs' Table
CREATE TABLE IF NOT EXISTS public.jobs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID REFERENCES public.companies(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    company_name TEXT NOT NULL,
    company_logo TEXT,
    type TEXT NOT NULL DEFAULT 'Internship', -- 'Internship' | 'Full-Time' | 'Contract'
    location TEXT DEFAULT 'Remote',
    stipend_salary TEXT NOT NULL, -- e.g. '$3,500/mo' or '$135,000/yr'
    required_skills TEXT[] DEFAULT '{}',
    experience_level TEXT DEFAULT 'Entry Level', -- 'Internship', 'Entry Level', 'Mid-Level', 'Senior'
    deadline TIMESTAMPTZ,
    description TEXT,
    status TEXT DEFAULT 'active', -- 'active' | 'closed'
    applicants_count INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Create 'job_applications' Table
CREATE TABLE IF NOT EXISTS public.job_applications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    job_id UUID REFERENCES public.jobs(id) ON DELETE CASCADE,
    applicant_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    applicant_name TEXT NOT NULL,
    applicant_email TEXT NOT NULL,
    applicant_photo TEXT,
    resume_url TEXT,
    cover_note TEXT,
    portfolio_url TEXT,
    match_score INT DEFAULT 85,
    status TEXT DEFAULT 'Applied', -- 'Applied' | 'Under Review' | 'Shortlisted' | 'Interview Scheduled' | 'Offer Extended' | 'Rejected'
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Create 'interviews' Table
CREATE TABLE IF NOT EXISTS public.interviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    application_id UUID REFERENCES public.job_applications(id) ON DELETE CASCADE,
    job_id UUID REFERENCES public.jobs(id) ON DELETE CASCADE,
    candidate_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    recruiter_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    job_title TEXT NOT NULL,
    candidate_name TEXT NOT NULL,
    interviewer_name TEXT NOT NULL,
    scheduled_at TIMESTAMPTZ NOT NULL,
    duration_mins INT DEFAULT 30,
    meeting_link TEXT DEFAULT 'https://meet.google.com/zaya-job-interview',
    notes TEXT,
    status TEXT DEFAULT 'Scheduled', -- 'Scheduled' | 'Completed' | 'Cancelled'
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Create 'candidate_bookmarks' Table
CREATE TABLE IF NOT EXISTS public.candidate_bookmarks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    recruiter_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    candidate_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    candidate_name TEXT NOT NULL,
    candidate_skills TEXT[] DEFAULT '{}',
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Create 'recruiter_messages' Table
CREATE TABLE IF NOT EXISTS public.recruiter_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    sender_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    receiver_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    application_id UUID REFERENCES public.job_applications(id) ON DELETE SET NULL,
    sender_name TEXT NOT NULL,
    message TEXT NOT NULL,
    read BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for Fast Query Performance
CREATE INDEX IF NOT EXISTS idx_jobs_company_id ON public.jobs(company_id);
CREATE INDEX IF NOT EXISTS idx_jobs_type ON public.jobs(type);
CREATE INDEX IF NOT EXISTS idx_job_applications_job_id ON public.job_applications(job_id);
CREATE INDEX IF NOT EXISTS idx_job_applications_applicant_id ON public.job_applications(applicant_id);
CREATE INDEX IF NOT EXISTS idx_interviews_candidate_id ON public.interviews(candidate_id);
CREATE INDEX IF NOT EXISTS idx_interviews_recruiter_id ON public.interviews(recruiter_id);

-- Enable Row Level Security (RLS)
ALTER TABLE public.companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.job_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.interviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.candidate_bookmarks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.recruiter_messages ENABLE ROW LEVEL SECURITY;

-- RLS Policies

-- Companies & Jobs: Public read access
DROP POLICY IF EXISTS "Public read companies" ON public.companies;
CREATE POLICY "Public read companies" ON public.companies FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public read jobs" ON public.jobs;
CREATE POLICY "Public read jobs" ON public.jobs FOR SELECT USING (true);

DROP POLICY IF EXISTS "Recruiters insert jobs" ON public.jobs;
CREATE POLICY "Recruiters insert jobs" ON public.jobs FOR INSERT WITH CHECK (true);

-- Job Applications: Applicants read & insert own applications, recruiters access company applications
DROP POLICY IF EXISTS "Users read own applications" ON public.job_applications;
CREATE POLICY "Users read own applications" ON public.job_applications FOR SELECT USING (auth.uid() = applicant_id OR auth.uid() IS NULL);

DROP POLICY IF EXISTS "Users insert own applications" ON public.job_applications;
CREATE POLICY "Users insert own applications" ON public.job_applications FOR INSERT WITH CHECK (auth.uid() = applicant_id OR auth.uid() IS NULL);

DROP POLICY IF EXISTS "Update application status" ON public.job_applications;
CREATE POLICY "Update application status" ON public.job_applications FOR UPDATE USING (true);

-- Interviews: Candidates & recruiters read own interviews
DROP POLICY IF EXISTS "Read interviews" ON public.interviews;
CREATE POLICY "Read interviews" ON public.interviews FOR SELECT USING (auth.uid() = candidate_id OR auth.uid() = recruiter_id OR auth.uid() IS NULL);

DROP POLICY IF EXISTS "Insert interviews" ON public.interviews;
CREATE POLICY "Insert interviews" ON public.interviews FOR INSERT WITH CHECK (true);

-- Recruiter Messages: Read & insert messages
DROP POLICY IF EXISTS "Read messages" ON public.recruiter_messages;
CREATE POLICY "Read messages" ON public.recruiter_messages FOR SELECT USING (auth.uid() = sender_id OR auth.uid() = receiver_id OR auth.uid() IS NULL);

DROP POLICY IF EXISTS "Insert messages" ON public.recruiter_messages;
CREATE POLICY "Insert messages" ON public.recruiter_messages FOR INSERT WITH CHECK (true);

-- Seed Companies
INSERT INTO public.companies (id, name, logo, website, location, industry, employee_count, description, verified)
VALUES
('c1000000-0000-0000-0000-000000000001', 'CyberShield AI', 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=200', 'https://cybershield.ai', 'San Francisco, CA (Remote)', 'Cybersecurity & AI', '100-250 Employees', 'Pioneering autonomous threat intelligence and agentic security patch deployment for enterprise infrastructure.', true),
('c1000000-0000-0000-0000-000000000002', 'Nexus Robotics', 'https://images.unsplash.com/photo-1535378917042-10a22c95931a?auto=format&fit=crop&q=80&w=200', 'https://nexusrobotics.io', 'Austin, TX (Remote)', 'Autonomous Robotics & ML', '500+ Employees', 'Building next-generation computer vision and edge neural processing units for industrial robotics.', true),
('c1000000-0000-0000-0000-000000000003', 'Solana Labs Tech', 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?auto=format&fit=crop&q=80&w=200', 'https://solanalabs.com', 'New York, NY (Remote)', 'Web3 & Decentralized Systems', '200+ Employees', 'Empowering high-throughput blockchain networks and zero-knowledge cryptographic protocol engineering.', true),
('c1000000-0000-0000-0000-000000000004', 'CloudScale Systems', 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=200', 'https://cloudscale.dev', 'Seattle, WA (Hybrid)', 'Cloud Infrastructure & DevOps', '1,000+ Employees', 'Architecting serverless data mesh architectures and real-time distributed database clustering.', true)
ON CONFLICT (id) DO NOTHING;

-- Seed Jobs
INSERT INTO public.jobs (id, company_id, title, company_name, company_logo, type, location, stipend_salary, required_skills, experience_level, deadline, description, applicants_count)
VALUES
('j1000000-0000-0000-0000-000000000001', 'c1000000-0000-0000-0000-000000000001', 'AI Security Research Intern', 'CyberShield AI', 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=200', 'Internship', 'Remote', '$4,500/mo', ARRAY['Python', 'PyTorch', 'Agentic AI', 'Cybersecurity'], 'Internship', NOW() + INTERVAL '30 days', 'Join our core AI research group to develop automated vulnerability detection agents and red-teaming transformer models.', 38),
('j1000000-0000-0000-0000-000000000002', 'c1000000-0000-0000-0000-000000000002', 'Full Stack React & Supabase Engineer', 'Nexus Robotics', 'https://images.unsplash.com/photo-1535378917042-10a22c95931a?auto=format&fit=crop&q=80&w=200', 'Full-Time', 'Austin, TX (Remote)', '$135,000/yr', ARRAY['React 19', 'Tailwind CSS', 'Supabase', 'TypeScript'], 'Entry Level', NOW() + INTERVAL '45 days', 'Architect mission-critical tele-operation web dashboards with sub-30ms websocket latency using React 19 and real-time data pipelines.', 54),
('j1000000-0000-0000-0000-000000000003', 'c1000000-0000-0000-0000-000000000003', 'Smart Contract Security Auditor', 'Solana Labs Tech', 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?auto=format&fit=crop&q=80&w=200', 'Full-Time', 'Remote', '$150,000/yr', ARRAY['Solidity', 'Rust', 'ZK-Proofs', 'Smart Contracts'], 'Mid-Level', NOW() + INTERVAL '20 days', 'Audit high-volume smart contracts, build zero-knowledge verifiers, and collaborate directly with top web3 hackathon winners.', 29),
('j1000000-0000-0000-0000-000000000004', 'c1000000-0000-0000-0000-000000000004', 'DevOps & Cloud Infrastructure Intern', 'CloudScale Systems', 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=200', 'Internship', 'Seattle, WA (Remote)', '$4,000/mo', ARRAY['Docker', 'Kubernetes', 'AWS', 'Terraform'], 'Internship', NOW() + INTERVAL '15 days', 'Build continuous integration pipelines and automated Kubernetes cluster deployment setups for enterprise cloud customers.', 42)
ON CONFLICT (id) DO NOTHING;

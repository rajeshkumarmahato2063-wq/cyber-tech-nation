import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { sendNotification } from './notifications';

export const MOCK_JOBS = [
  {
    id: 'j1000000-0000-0000-0000-000000000001',
    company_id: 'c1000000-0000-0000-0000-000000000001',
    title: 'AI Security Research Intern',
    company_name: 'CyberShield AI',
    company_logo: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=200',
    type: 'Internship',
    location: 'Remote',
    stipend_salary: '$4,500/mo',
    required_skills: ['Python', 'PyTorch', 'Agentic AI', 'Cybersecurity'],
    experience_level: 'Internship',
    deadline: new Date(Date.now() + 30 * 86400 * 1000).toISOString(),
    description: 'Join our core AI research group to develop automated vulnerability detection agents and red-teaming transformer models.',
    applicants_count: 38,
    created_at: new Date().toISOString()
  },
  {
    id: 'j1000000-0000-0000-0000-000000000002',
    company_id: 'c1000000-0000-0000-0000-000000000002',
    title: 'Full Stack React & Supabase Engineer',
    company_name: 'Nexus Robotics',
    company_logo: 'https://images.unsplash.com/photo-1535378917042-10a22c95931a?auto=format&fit=crop&q=80&w=200',
    type: 'Full-Time',
    location: 'Austin, TX (Remote)',
    stipend_salary: '$135,000/yr',
    required_skills: ['React 19', 'Tailwind CSS', 'Supabase', 'TypeScript'],
    experience_level: 'Entry Level',
    deadline: new Date(Date.now() + 45 * 86400 * 1000).toISOString(),
    description: 'Architect mission-critical tele-operation web dashboards with sub-30ms websocket latency using React 19 and real-time data pipelines.',
    applicants_count: 54,
    created_at: new Date().toISOString()
  },
  {
    id: 'j1000000-0000-0000-0000-000000000003',
    company_id: 'c1000000-0000-0000-0000-000000000003',
    title: 'Smart Contract Security Auditor',
    company_name: 'Solana Labs Tech',
    company_logo: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?auto=format&fit=crop&q=80&w=200',
    type: 'Full-Time',
    location: 'Remote',
    stipend_salary: '$150,000/yr',
    required_skills: ['Solidity', 'Rust', 'ZK-Proofs', 'Smart Contracts'],
    experience_level: 'Mid-Level',
    deadline: new Date(Date.now() + 20 * 86400 * 1000).toISOString(),
    description: 'Audit high-volume smart contracts, build zero-knowledge verifiers, and collaborate directly with top web3 hackathon winners.',
    applicants_count: 29,
    created_at: new Date().toISOString()
  },
  {
    id: 'j1000000-0000-0000-0000-000000000004',
    company_id: 'c1000000-0000-0000-0000-000000000004',
    title: 'DevOps & Cloud Infrastructure Intern',
    company_name: 'CloudScale Systems',
    company_logo: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=200',
    type: 'Internship',
    location: 'Seattle, WA (Remote)',
    stipend_salary: '$4,000/mo',
    required_skills: ['Docker', 'Kubernetes', 'AWS', 'Terraform'],
    experience_level: 'Internship',
    deadline: new Date(Date.now() + 15 * 86400 * 1000).toISOString(),
    description: 'Build continuous integration pipelines and automated Kubernetes cluster deployment setups for enterprise cloud customers.',
    applicants_count: 42,
    created_at: new Date().toISOString()
  }
];

const LOCAL_APPLICATIONS_KEY = 'zayathon_job_applications';

/**
 * Fetch Jobs with Filters
 */
export const getJobs = async (filters = {}) => {
  const { type = 'All', location = 'All', searchQuery = '' } = filters;

  if (!isSupabaseConfigured()) {
    let result = MOCK_JOBS;
    if (type !== 'All') {
      result = result.filter(j => j.type.toLowerCase() === type.toLowerCase());
    }
    if (location !== 'All') {
      result = result.filter(j => j.location.toLowerCase().includes(location.toLowerCase()));
    }
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(j => j.title.toLowerCase().includes(q) || j.company_name.toLowerCase().includes(q) || j.required_skills.some(s => s.toLowerCase().includes(q)));
    }
    return result;
  }

  try {
    let query = supabase.from('jobs').select('*, companies(name, logo, industry, location)').order('created_at', { ascending: false });

    if (type && type !== 'All') query = query.eq('type', type);

    const { data, error } = await query;
    if (error || !data || data.length === 0) return MOCK_JOBS;

    let result = data;
    if (location && location !== 'All') {
      result = result.filter(j => j.location.toLowerCase().includes(location.toLowerCase()));
    }
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(j => j.title.toLowerCase().includes(q) || j.company_name.toLowerCase().includes(q) || (Array.isArray(j.required_skills) && j.required_skills.some(s => s.toLowerCase().includes(q))));
    }
    return result;
  } catch (err) {
    console.warn('[Jobs Service] Fetch error:', err.message);
    return MOCK_JOBS;
  }
};

/**
 * Fetch Single Job By ID
 */
export const getJobById = async (id) => {
  if (!isSupabaseConfigured() || !id) {
    return MOCK_JOBS.find(j => j.id === id) || MOCK_JOBS[0];
  }

  try {
    const { data, error } = await supabase
      .from('jobs')
      .select('*, companies(id, name, logo, website, description, location, industry, employee_count)')
      .eq('id', id)
      .single();

    if (error || !data) return MOCK_JOBS.find(j => j.id === id) || MOCK_JOBS[0];
    return data;
  } catch (err) {
    console.warn('[Jobs Service] Get job by id error:', err.message);
    return MOCK_JOBS.find(j => j.id === id) || MOCK_JOBS[0];
  }
};

/**
 * Apply for a Job Position
 */
export const applyForJob = async ({
  jobId,
  applicantId,
  applicantName,
  applicantEmail,
  applicantPhoto,
  resumeUrl,
  coverNote,
  portfolioUrl,
  matchScore = 92
}) => {
  const applicationPayload = {
    id: `app-${Date.now()}`,
    job_id: jobId,
    applicant_id: applicantId || 'anon-applicant',
    applicant_name: applicantName || 'Participant',
    applicant_email: applicantEmail || 'candidate@zayathon.dev',
    applicant_photo: applicantPhoto || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100',
    resume_url: resumeUrl || 'https://zayathon.dev/resumes/candidate-resume.pdf',
    cover_note: coverNote || 'Excited to bring my hackathon project & React expertise to this role!',
    portfolio_url: portfolioUrl || 'https://zayathon.dev/profile/rajesh-mahato',
    match_score: matchScore,
    status: 'Applied',
    created_at: new Date().toISOString()
  };

  if (isSupabaseConfigured()) {
    try {
      const { data, error } = await supabase
        .from('job_applications')
        .insert([{
          job_id: jobId,
          applicant_id: applicantId,
          applicant_name: applicantName,
          applicant_email: applicantEmail,
          applicant_photo: applicantPhoto,
          resume_url: resumeUrl,
          cover_note: coverNote,
          portfolio_url: portfolioUrl,
          match_score: matchScore,
          status: 'Applied'
        }])
        .select('*, jobs(title, company_name, stipend_salary, type)')
        .single();

      if (!error && data) {
        if (applicantId) {
          await sendNotification({
            userId: applicantId,
            title: '🚀 Application Submitted Successfully!',
            message: `Your application for "${data.jobs?.title || 'Job Position'}" at ${data.jobs?.company_name || 'the company'} was received.`,
            type: 'success',
            link: '/my-applications'
          });
        }
        return data;
      }
    } catch (err) {
      console.warn('[Jobs Service] Apply failed on Supabase:', err.message);
    }
  }

  // Local storage fallback
  try {
    const existing = JSON.parse(localStorage.getItem(LOCAL_APPLICATIONS_KEY) || '[]');
    const updated = [applicationPayload, ...existing];
    localStorage.setItem(LOCAL_APPLICATIONS_KEY, JSON.stringify(updated));

    if (applicantId) {
      sendNotification({
        userId: applicantId,
        title: '🚀 Application Submitted!',
        message: 'Your job application has been submitted successfully.',
        type: 'success',
        link: '/my-applications'
      });
    }
  } catch (e) {
    console.error(e);
  }

  return applicationPayload;
};

/**
 * Fetch Candidate's Job Applications
 */
export const getUserApplications = async (applicantId) => {
  if (!isSupabaseConfigured() || !applicantId) {
    try {
      const stored = localStorage.getItem(LOCAL_APPLICATIONS_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  }

  try {
    const { data, error } = await supabase
      .from('job_applications')
      .select('*, jobs(id, title, company_name, company_logo, location, stipend_salary, type)')
      .eq('applicant_id', applicantId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (err) {
    console.warn('[Jobs Service] Fetch user applications error:', err.message);
    const stored = localStorage.getItem(LOCAL_APPLICATIONS_KEY);
    return stored ? JSON.parse(stored) : [];
  }
};

/**
 * AI Match Score Algorithm
 */
export const calculateMatchScore = (candidateSkills = [], requiredSkills = []) => {
  if (!requiredSkills || requiredSkills.length === 0) return 88;
  const normalizedCandidate = candidateSkills.map(s => s.toLowerCase());
  const matches = requiredSkills.filter(req => normalizedCandidate.some(c => c.includes(req.toLowerCase()) || req.toLowerCase().includes(c)));

  const ratio = matches.length / requiredSkills.length;
  const score = Math.min(99, Math.max(72, Math.round(75 + ratio * 24)));
  return score;
};

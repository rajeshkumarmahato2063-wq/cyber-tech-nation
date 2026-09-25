import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { sendNotification } from './notifications';

export const MOCK_APPLICANTS = [
  {
    id: 'app-1',
    job_id: 'j1000000-0000-0000-0000-000000000001',
    applicant_id: 'u1',
    applicant_name: 'Rajesh Mahato',
    applicant_email: 'rajesh@zayathon.dev',
    applicant_photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100',
    resume_url: 'https://zayathon.dev/resumes/rajesh.pdf',
    cover_note: 'Built a top 1% agentic cybersecurity threat engine at ZayaThon. Expert in React 19, Supabase, and Python.',
    portfolio_url: 'https://zayathon.dev/profile/rajesh-mahato',
    match_score: 96,
    status: 'Shortlisted',
    job_title: 'AI Security Research Intern',
    company_name: 'CyberShield AI',
    created_at: new Date(Date.now() - 3600 * 1000 * 5).toISOString()
  },
  {
    id: 'app-2',
    job_id: 'j1000000-0000-0000-0000-000000000002',
    applicant_id: 'u2',
    applicant_name: 'Sophia Chen',
    applicant_email: 'sophia@zayathon.dev',
    applicant_photo: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100',
    resume_url: 'https://zayathon.dev/resumes/sophia.pdf',
    cover_note: 'Specialist in low-latency real-time dashboards and multi-tenant PostgreSQL RLS architectures.',
    portfolio_url: 'https://zayathon.dev/profile/sophia-chen',
    match_score: 92,
    status: 'Under Review',
    job_title: 'Full Stack React & Supabase Engineer',
    company_name: 'Nexus Robotics',
    created_at: new Date(Date.now() - 3600 * 1000 * 12).toISOString()
  },
  {
    id: 'app-3',
    job_id: 'j1000000-0000-0000-0000-000000000003',
    applicant_id: 'u3',
    applicant_name: 'Alex Rivera',
    applicant_email: 'alex@zayathon.dev',
    applicant_photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100',
    resume_url: 'https://zayathon.dev/resumes/alex.pdf',
    cover_note: 'Audited 12+ Solidity protocols and built zero-knowledge rollup proofs on Solana.',
    portfolio_url: 'https://zayathon.dev/profile/alex-rivera',
    match_score: 88,
    status: 'Interview Scheduled',
    job_title: 'Smart Contract Security Auditor',
    company_name: 'Solana Labs Tech',
    created_at: new Date(Date.now() - 3600 * 1000 * 24).toISOString()
  }
];

const LOCAL_BOOKMARKS_KEY = 'zayathon_candidate_bookmarks';

/**
 * Fetch Applicants for Recruiter Dashboard
 */
export const getRecruiterApplicants = async (companyId = null) => {
  if (!isSupabaseConfigured()) return MOCK_APPLICANTS;

  try {
    const { data, error } = await supabase
      .from('job_applications')
      .select('*, jobs(title, company_name, stipend_salary, type)')
      .order('created_at', { ascending: false });

    if (error || !data || data.length === 0) return MOCK_APPLICANTS;
    return data;
  } catch (err) {
    console.warn('[Recruiter Service] Fetch applicants error:', err.message);
    return MOCK_APPLICANTS;
  }
};

/**
 * Update Candidate Application Status (Shortlist, Reject, Schedule Interview, etc.)
 */
export const updateApplicationStatus = async (applicationId, status, candidateId = null, jobTitle = 'Role') => {
  if (isSupabaseConfigured()) {
    try {
      await supabase
        .from('job_applications')
        .update({ status })
        .eq('id', applicationId);
    } catch (err) {
      console.warn('[Recruiter Service] Update status error:', err.message);
    }
  }

  // Trigger realtime notification to candidate
  if (candidateId) {
    let notificationTitle = `Application Status Updated: ${status}`;
    let notificationType = 'info';

    if (status === 'Shortlisted') {
      notificationTitle = '🎉 Congratulations! You have been Shortlisted!';
      notificationType = 'success';
    } else if (status === 'Interview Scheduled') {
      notificationTitle = '📅 Interview Scheduled!';
      notificationType = 'success';
    } else if (status === 'Offer Extended') {
      notificationTitle = '🏆 Official Job Offer Extended!';
      notificationType = 'success';
    }

    sendNotification({
      userId: candidateId,
      title: notificationTitle,
      message: `Your application status for "${jobTitle}" has been updated to "${status}".`,
      type: notificationType,
      link: '/my-applications'
    });
  }

  return true;
};

/**
 * Bookmark Candidate Profile
 */
export const bookmarkCandidate = async ({ recruiterId, candidateId, candidateName, candidateSkills, notes }) => {
  const bookmarkPayload = {
    id: `bm-${Date.now()}`,
    recruiter_id: recruiterId || 'rec-1',
    candidate_id: candidateId,
    candidate_name: candidateName,
    candidate_skills: candidateSkills || [],
    notes: notes || 'High match score candidate',
    created_at: new Date().toISOString()
  };

  if (isSupabaseConfigured()) {
    try {
      const { data, error } = await supabase
        .from('candidate_bookmarks')
        .insert([bookmarkPayload])
        .select()
        .single();

      if (!error && data) return data;
    } catch (err) {
      console.warn('[Recruiter Service] Bookmark error:', err.message);
    }
  }

  try {
    const existing = JSON.parse(localStorage.getItem(LOCAL_BOOKMARKS_KEY) || '[]');
    const updated = [bookmarkPayload, ...existing];
    localStorage.setItem(LOCAL_BOOKMARKS_KEY, JSON.stringify(updated));
  } catch (e) {
    console.error(e);
  }

  return bookmarkPayload;
};

/**
 * Fetch Bookmarked Candidates
 */
export const getBookmarkedCandidates = async (recruiterId) => {
  if (!isSupabaseConfigured()) {
    try {
      const stored = localStorage.getItem(LOCAL_BOOKMARKS_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  }

  try {
    const { data, error } = await supabase
      .from('candidate_bookmarks')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (err) {
    console.warn('[Recruiter Service] Fetch bookmarks error:', err.message);
    const stored = localStorage.getItem(LOCAL_BOOKMARKS_KEY);
    return stored ? JSON.parse(stored) : [];
  }
};

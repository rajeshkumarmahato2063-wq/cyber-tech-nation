import { useState, useEffect, useCallback } from 'react';
import { getJobs, getJobById, applyForJob, getUserApplications, calculateMatchScore } from '../services/jobs';
import { getCompanies, getCompanyById, createCompanyProfile, createJobPosting } from '../services/company';
import { getRecruiterApplicants, updateApplicationStatus, bookmarkCandidate, getBookmarkedCandidates } from '../services/recruiter';
import { scheduleInterview, getUserInterviews, cancelInterview } from '../services/interview';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

/**
 * Custom Hook for ZayaThon Company Hiring & Internship Hub
 */
export const useJobs = (user = null) => {
  const [jobs, setJobs] = useState([]);
  const [featuredJobs, setFeaturedJobs] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [userApplications, setUserApplications] = useState([]);
  const [recruiterApplicants, setRecruiterApplicants] = useState([]);
  const [interviews, setInterviews] = useState([]);
  const [bookmarks, setBookmarks] = useState([]);

  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState(null);

  // Load jobs & companies
  const fetchHubData = useCallback(async (filters = {}) => {
    try {
      setLoading(true);
      const [jobsList, companyList] = await Promise.all([
        getJobs(filters),
        getCompanies()
      ]);

      setJobs(jobsList);
      setFeaturedJobs(jobsList.slice(0, 3));
      setCompanies(companyList);
    } catch (err) {
      console.warn('[useJobs] Fetch error:', err.message);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  // Load candidate/recruiter specific data
  const fetchUserData = useCallback(async () => {
    if (!user?.id) return;
    try {
      const [apps, recApps, userInts, userBms] = await Promise.all([
        getUserApplications(user.id),
        getRecruiterApplicants(),
        getUserInterviews(user.id),
        getBookmarkedCandidates(user.id)
      ]);

      setUserApplications(apps);
      setRecruiterApplicants(recApps);
      setInterviews(userInts);
      setBookmarks(userBms);
    } catch (err) {
      console.warn('[useJobs] User data error:', err.message);
    }
  }, [user?.id]);

  useEffect(() => {
    fetchHubData();
  }, [fetchHubData]);

  useEffect(() => {
    fetchUserData();
  }, [fetchUserData]);

  // Realtime subscriptions
  useEffect(() => {
    if (!isSupabaseConfigured()) return;

    const channel = supabase
      .channel('hiring_hub_realtime')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'job_applications' },
        () => {
          if (user?.id) getUserApplications(user.id).then(setUserApplications);
          getRecruiterApplicants().then(setRecruiterApplicants);
        }
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'interviews' },
        () => {
          if (user?.id) getUserInterviews(user.id).then(setInterviews);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user?.id]);

  // Actions
  const applyJob = async ({ jobId, resumeUrl, coverNote, portfolioUrl, requiredSkills = [] }) => {
    try {
      setActionLoading(true);
      const score = calculateMatchScore(['React', 'JavaScript', 'Python', 'Tailwind CSS'], requiredSkills);

      const app = await applyForJob({
        jobId,
        applicantId: user?.id,
        applicantName: user?.profile?.full_name || user?.email?.split('@')[0] || 'Candidate',
        applicantEmail: user?.email || 'candidate@zayathon.dev',
        applicantPhoto: user?.profile?.photo_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100',
        resumeUrl,
        coverNote,
        portfolioUrl,
        matchScore: score
      });

      setUserApplications(prev => [app, ...prev]);
      return app;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setActionLoading(false);
    }
  };

  const postJob = async (jobData) => {
    try {
      setActionLoading(true);
      const newJob = await createJobPosting(jobData);
      setJobs(prev => [newJob, ...prev]);
      return newJob;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setActionLoading(false);
    }
  };

  const changeAppStatus = async (applicationId, status, candidateId, jobTitle) => {
    await updateApplicationStatus(applicationId, status, candidateId, jobTitle);
    setRecruiterApplicants(prev => prev.map(a => a.id === applicationId ? { ...a, status } : a));
  };

  const scheduleUserInterview = async (data) => {
    try {
      setActionLoading(true);
      const meeting = await scheduleInterview({
        ...data,
        recruiterId: user?.id,
        interviewerName: user?.profile?.full_name || 'Hiring Manager'
      });
      setInterviews(prev => [meeting, ...prev]);
      return meeting;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setActionLoading(false);
    }
  };

  const toggleBookmark = async (candidate) => {
    const bm = await bookmarkCandidate({
      recruiterId: user?.id,
      candidateId: candidate.id || candidate.applicant_id,
      candidateName: candidate.applicant_name,
      candidateSkills: candidate.skills || ['React', 'Python'],
      notes: candidate.notes || 'High match score candidate'
    });
    setBookmarks(prev => [bm, ...prev]);
  };

  return {
    jobs,
    featuredJobs,
    companies,
    userApplications,
    recruiterApplicants,
    interviews,
    bookmarks,
    loading,
    actionLoading,
    error,
    fetchHubData,
    getJobById,
    getCompanyById,
    applyJob,
    postJob,
    changeAppStatus,
    scheduleUserInterview,
    cancelInterview,
    toggleBookmark,
    calculateMatchScore
  };
};

export default useJobs;

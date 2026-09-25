import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { sendNotification } from './notifications';
import { updateApplicationStatus } from './recruiter';

export const MOCK_INTERVIEWS = [
  {
    id: 'int-1',
    application_id: 'app-1',
    job_id: 'j1000000-0000-0000-0000-000000000001',
    candidate_id: 'u1',
    recruiter_id: 'rec-1',
    job_title: 'AI Security Research Intern',
    candidate_name: 'Rajesh Mahato',
    interviewer_name: 'Dr. Alex Mercer (Head of CyberShield AI)',
    scheduled_at: new Date(Date.now() + 86400 * 1000 * 2).toISOString(),
    duration_mins: 45,
    meeting_link: 'https://meet.google.com/zaya-cybershield-interview',
    notes: 'Technical architecture deep dive & agentic AI workflow live whiteboard demo.',
    status: 'Scheduled',
    created_at: new Date().toISOString()
  }
];

const LOCAL_INTERVIEWS_KEY = 'zayathon_interviews';

/**
 * Schedule New Interview
 */
export const scheduleInterview = async ({
  applicationId,
  jobId,
  candidateId,
  recruiterId,
  jobTitle,
  candidateName,
  interviewerName,
  scheduledAt,
  durationMins = 30,
  notes
}) => {
  const meetingLink = `https://meet.google.com/zaya-interview-${Math.floor(1000 + Math.random() * 9000)}`;

  const interviewPayload = {
    id: `int-${Date.now()}`,
    application_id: applicationId,
    job_id: jobId,
    candidate_id: candidateId || 'anon-candidate',
    recruiter_id: recruiterId || 'anon-recruiter',
    job_title: jobTitle || 'Hiring Role',
    candidate_name: candidateName || 'Candidate',
    interviewer_name: interviewerName || 'Engineering Hiring Lead',
    scheduled_at: scheduledAt,
    duration_mins: durationMins,
    meeting_link: meetingLink,
    notes: notes || 'Initial technical screening & culture alignment interview',
    status: 'Scheduled',
    created_at: new Date().toISOString()
  };

  if (isSupabaseConfigured()) {
    try {
      const { data, error } = await supabase
        .from('interviews')
        .insert([{
          application_id: applicationId,
          job_id: jobId,
          candidate_id: candidateId,
          recruiter_id: recruiterId,
          job_title: jobTitle,
          candidate_name: candidateName,
          interviewer_name: interviewerName,
          scheduled_at: scheduledAt,
          duration_mins: durationMins,
          meeting_link: meetingLink,
          notes: notes,
          status: 'Scheduled'
        }])
        .select()
        .single();

      if (!error && data) {
        // Also update application status
        if (applicationId) {
          await updateApplicationStatus(applicationId, 'Interview Scheduled', candidateId, jobTitle);
        }
        return data;
      }
    } catch (err) {
      console.warn('[Interview Service] Schedule error:', err.message);
    }
  }

  // Local Storage Fallback
  try {
    const existing = JSON.parse(localStorage.getItem(LOCAL_INTERVIEWS_KEY) || '[]');
    const updated = [interviewPayload, ...existing];
    localStorage.setItem(LOCAL_INTERVIEWS_KEY, JSON.stringify(updated));

    if (candidateId) {
      sendNotification({
        userId: candidateId,
        title: '📅 Interview Scheduled!',
        message: `Your interview for "${jobTitle}" has been scheduled for ${new Date(scheduledAt).toLocaleString()}.`,
        type: 'success',
        link: '/interviews'
      });
    }

    if (applicationId) {
      updateApplicationStatus(applicationId, 'Interview Scheduled', candidateId, jobTitle);
    }
  } catch (e) {
    console.error(e);
  }

  return interviewPayload;
};

/**
 * Fetch Interviews for Candidate or Recruiter
 */
export const getUserInterviews = async (userId) => {
  if (!isSupabaseConfigured() || !userId) {
    try {
      const stored = localStorage.getItem(LOCAL_INTERVIEWS_KEY);
      return stored ? JSON.parse(stored) : MOCK_INTERVIEWS;
    } catch {
      return MOCK_INTERVIEWS;
    }
  }

  try {
    const { data, error } = await supabase
      .from('interviews')
      .select('*')
      .or(`candidate_id.eq.${userId},recruiter_id.eq.${userId}`)
      .order('scheduled_at', { ascending: true });

    if (error || !data || data.length === 0) {
      const stored = localStorage.getItem(LOCAL_INTERVIEWS_KEY);
      return stored ? JSON.parse(stored) : MOCK_INTERVIEWS;
    }
    return data;
  } catch (err) {
    console.warn('[Interview Service] Fetch user interviews error:', err.message);
    return MOCK_INTERVIEWS;
  }
};

/**
 * Cancel an Interview
 */
export const cancelInterview = async (interviewId, userId = null) => {
  if (isSupabaseConfigured()) {
    try {
      await supabase
        .from('interviews')
        .update({ status: 'Cancelled' })
        .eq('id', interviewId);
    } catch (err) {
      console.warn('[Interview Service] Cancel error:', err.message);
    }
  }

  try {
    const existing = JSON.parse(localStorage.getItem(LOCAL_INTERVIEWS_KEY) || '[]');
    const updated = existing.map(i => i.id === interviewId ? { ...i, status: 'Cancelled' } : i);
    localStorage.setItem(LOCAL_INTERVIEWS_KEY, JSON.stringify(updated));
  } catch (e) {
    console.error(e);
  }

  if (userId) {
    sendNotification({
      userId,
      title: 'Interview Cancelled',
      message: 'An interview session has been cancelled.',
      type: 'info',
      link: '/interviews'
    });
  }

  return true;
};

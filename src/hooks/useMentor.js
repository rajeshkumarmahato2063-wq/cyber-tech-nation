import { useState, useEffect, useCallback } from 'react';
import { getMentors, getMentorById, getMentorHubStats } from '../services/mentor';
import { getUserBookings, bookMentorSession, cancelBooking, getOfficeHoursSessions } from '../services/booking';
import { analyzeAIProjectReview, getUserAIReviews } from '../services/aiReview';
import { askAIMentorChat, getSavedChatHistory, clearUserChatHistory } from '../services/chat';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

/**
 * Comprehensive Custom Hook for ZayaThon AI Mentor Hub
 */
export const useMentor = (user = null) => {
  const [mentors, setMentors] = useState([]);
  const [featuredMentors, setFeaturedMentors] = useState([]);
  const [officeHours, setOfficeHours] = useState([]);
  const [userBookings, setUserBookings] = useState([]);
  const [aiReviews, setAiReviews] = useState([]);
  const [chatHistory, setChatHistory] = useState([]);
  const [stats, setStats] = useState(null);

  const [loading, setLoading] = useState(true);
  const [chatLoading, setChatLoading] = useState(false);
  const [reviewLoading, setReviewLoading] = useState(false);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [error, setError] = useState(null);

  // Load core mentor data & stats
  const fetchMentorData = useCallback(async (category = 'All') => {
    try {
      setLoading(true);
      const [mentorList, officeList, hubStats] = await Promise.all([
        getMentors(category),
        getOfficeHoursSessions(),
        getMentorHubStats()
      ]);

      setMentors(mentorList);
      setFeaturedMentors(mentorList.slice(0, 3));
      setOfficeHours(officeList);
      setStats(hubStats);
    } catch (err) {
      console.warn('[useMentor] Error fetching mentor data:', err.message);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  // Load user specific bookings, AI reviews & chat history
  const fetchUserData = useCallback(async () => {
    if (!user?.id) return;
    try {
      const [bookings, reviews, chats] = await Promise.all([
        getUserBookings(user.id),
        getUserAIReviews(user.id),
        getSavedChatHistory(user.id)
      ]);
      setUserBookings(bookings);
      setAiReviews(reviews);
      setChatHistory(chats);
    } catch (err) {
      console.warn('[useMentor] Error fetching user data:', err.message);
    }
  }, [user?.id]);

  useEffect(() => {
    fetchMentorData();
  }, [fetchMentorData]);

  useEffect(() => {
    fetchUserData();
  }, [fetchUserData]);

  // Realtime Subscriptions for Bookings & Office Hours
  useEffect(() => {
    if (!isSupabaseConfigured()) return;

    const channel = supabase
      .channel('mentor_hub_realtime')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'mentor_bookings' },
        () => {
          if (user?.id) getUserBookings(user.id).then(setUserBookings);
        }
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'mentor_sessions' },
        () => {
          getOfficeHoursSessions().then(setOfficeHours);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user?.id]);

  // Actions
  const bookSession = async ({ mentorId, mentorName, slotTime, topic, notes }) => {
    try {
      setBookingLoading(true);
      const booking = await bookMentorSession({
        mentorId,
        mentorName,
        userId: user?.id,
        userName: user?.profile?.full_name || user?.email?.split('@')[0] || 'Participant',
        userEmail: user?.email || 'participant@zayathon.dev',
        slotTime,
        topic,
        notes
      });
      setUserBookings(prev => [booking, ...prev]);
      return booking;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setBookingLoading(false);
    }
  };

  const cancelSession = async (bookingId) => {
    try {
      await cancelBooking(bookingId, user?.id);
      setUserBookings(prev => prev.map(b => b.id === bookingId ? { ...b, status: 'cancelled' } : b));
    } catch (err) {
      setError(err.message);
    }
  };

  const submitProjectReview = async ({ teamName, githubRepo, pptLink, projectDescription }) => {
    try {
      setReviewLoading(true);
      const review = await analyzeAIProjectReview({
        userId: user?.id,
        teamName,
        githubRepo,
        pptLink,
        projectDescription
      });
      setAiReviews(prev => [review, ...prev]);
      return review;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setReviewLoading(false);
    }
  };

  const askAIChat = async (message, category = 'all') => {
    try {
      setChatLoading(true);
      const { userMsg, aiMsg } = await askAIMentorChat({
        userId: user?.id,
        message,
        category
      });
      setChatHistory(prev => [...prev, userMsg, aiMsg]);
      return { userMsg, aiMsg };
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setChatLoading(false);
    }
  };

  const clearChat = async () => {
    await clearUserChatHistory(user?.id);
    setChatHistory([]);
  };

  return {
    mentors,
    featuredMentors,
    officeHours,
    userBookings,
    aiReviews,
    chatHistory,
    stats,
    loading,
    chatLoading,
    reviewLoading,
    bookingLoading,
    error,
    fetchMentorData,
    fetchMentorById: getMentorById,
    bookSession,
    cancelSession,
    submitProjectReview,
    askAIChat,
    clearChat
  };
};

export default useMentor;

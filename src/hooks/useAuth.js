import { useState, useEffect, useCallback } from 'react';
import { authService } from '../services/auth';

/**
 * Custom useAuth Hook - Provides session persistence, user profile, loading state & auth actions
 */
export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Refresh current user and profile state
  const refreshUser = useCallback(async () => {
    try {
      setLoading(true);
      const currentUser = await authService.getCurrentUser();
      if (currentUser) {
        setUser(currentUser);
        setProfile(currentUser.profile || null);
      } else {
        setUser(null);
        setProfile(null);
      }
    } catch (err) {
      console.warn('useAuth refresh error:', err.message);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshUser();

    const subscription = authService.onAuthStateChange(async (event, currentSession, currentProfile) => {
      setSession(currentSession);
      if (currentSession?.user) {
        setUser({ ...currentSession.user, profile: currentProfile });
        setProfile(currentProfile);
      } else {
        setUser(null);
        setProfile(null);
      }
      setLoading(false);
    });

    return () => {
      if (subscription && typeof subscription.unsubscribe === 'function') {
        subscription.unsubscribe();
      }
    };
  }, [refreshUser]);

  const signUp = async (credentials) => {
    setError(null);
    try {
      const res = await authService.signUp(credentials);
      return res;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const signIn = async (credentials) => {
    setError(null);
    try {
      const res = await authService.signIn(credentials);
      if (res.user) {
        setUser({ ...res.user, profile: res.profile });
        setProfile(res.profile);
      }
      return res;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const signOut = async () => {
    setError(null);
    try {
      await authService.signOut();
      setUser(null);
      setProfile(null);
      setSession(null);
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const resetPassword = async (email) => {
    setError(null);
    try {
      return await authService.resetPassword(email);
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const isAuthenticated = Boolean(user);
  const isAdmin = profile?.role === 'admin' || profile?.role === 'organizer' || user?.user_metadata?.role === 'admin';

  return {
    user,
    profile,
    session,
    loading,
    error,
    isAuthenticated,
    isAdmin,
    signUp,
    signIn,
    signOut,
    resetPassword,
    refreshUser,
  };
};

export default useAuth;

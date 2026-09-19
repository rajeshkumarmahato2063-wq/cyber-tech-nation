import { useState, useEffect, useCallback } from 'react';
import { portfolioService } from '../services/portfolio';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

export function usePortfolio(username = 'rajesh-mahato') {
  const [portfolio, setPortfolio] = useState(null);
  const [recommendations, setRecommendations] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadPortfolio = useCallback(async (targetUsername) => {
    setLoading(true);
    try {
      const data = await portfolioService.getPortfolioByUsername(targetUsername || username);
      setPortfolio(data);
      const recs = portfolioService.getAISkillRecommendations(data?.skills || []);
      setRecommendations(recs);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [username]);

  useEffect(() => {
    loadPortfolio(username);
  }, [username, loadPortfolio]);

  // Realtime subscription for portfolio changes
  useEffect(() => {
    if (!isSupabaseConfigured()) return;

    const channel = supabase
      .channel('portfolio-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'portfolios' }, () => {
        loadPortfolio(username);
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [username, loadPortfolio]);

  return {
    portfolio,
    recommendations,
    loading,
    error,
    refreshPortfolio: () => loadPortfolio(username)
  };
}

export default usePortfolio;

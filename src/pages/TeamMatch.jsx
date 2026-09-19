import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Users, Shield, UserPlus, Search, CheckCircle2, Star, MessageSquare, ShieldAlert, Rocket, Trophy, Activity, AlertCircle } from 'lucide-react';

import teamMatchService from '../services/teamMatch';
import recommendationService from '../services/recommendation';
import ProfileCard from '../components/teammatch/ProfileCard';
import TeamCard from '../components/teammatch/TeamCard';
import MatchFilters from '../components/teammatch/MatchFilters';
import JoinRequestModal from '../components/teammatch/JoinRequestModal';
import ChatWindow from '../components/teammatch/ChatWindow';
import AIRecommendationCard from '../components/teammatch/AIRecommendationCard';
import CreateProfileModal from '../components/teammatch/CreateProfileModal';
import CreateTeamModal from '../components/teammatch/CreateTeamModal';
import ReportModal from '../components/teammatch/ReportModal';
import useAuth from '../hooks/useAuth';

const TeamMatchPage = () => {
  const { user, profile: authProfile, isAdmin } = useAuth();

  // State
  const [activeTab, setActiveTab] = useState('profiles'); // 'profiles' | 'teams' | 'ai' | 'requests' | 'admin'
  const [profiles, setProfiles] = useState([]);
  const [teams, setTeams] = useState([]);
  const [aiRecommendations, setAiRecommendations] = useState([]);
  const [userRequests, setUserRequests] = useState({ incoming: [], sent: [] });
  const [stats, setStats] = useState({
    lookingForTeamsCount: 142,
    openTeamsCount: 28,
    successfulMatchesCount: 89,
    activeTodayCount: 64
  });

  const [filters, setFilters] = useState({
    search: '',
    skill: 'All',
    college: 'All',
    department: 'All',
    year: 'All',
    domain: 'All',
    experience: 'All',
    lookingFor: 'All'
  });

  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(true);
  const [userMatchProfile, setUserMatchProfile] = useState(null);

  // Modals state
  const [createProfileOpen, setCreateProfileOpen] = useState(false);
  const [createTeamOpen, setCreateTeamOpen] = useState(false);
  const [joinRequestModal, setJoinRequestModal] = useState({ isOpen: false, targetProfile: null, targetTeam: null });
  const [chatWindow, setChatWindow] = useState({ isOpen: false, team: null });
  const [reportModal, setReportModal] = useState({ isOpen: false, targetProfile: null, targetTeam: null });
  const [adminReports, setAdminReports] = useState([]);

  // Load User Profile & Stats
  useEffect(() => {
    const initData = async () => {
      setLoading(true);
      try {
        const liveStats = await teamMatchService.getLiveStats();
        setStats(liveStats);

        if (user) {
          const myProfile = await teamMatchService.getProfileByUserId(user.id);
          setUserMatchProfile(myProfile);

          const reqs = await teamMatchService.getUserRequests(user.id);
          setUserRequests(reqs);

          const recs = await recommendationService.getRecommendations(myProfile, 4);
          setAiRecommendations(recs);
        } else {
          const recs = await recommendationService.getRecommendations(null, 4);
          setAiRecommendations(recs);
        }
      } catch (err) {
        console.error('Team match init error:', err);
      } finally {
        setLoading(false);
      }
    };
    initData();
  }, [user]);

  // Load Profiles & Teams whenever filters or page change
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const { data: profileList, hasMore: more } = await teamMatchService.getProfiles(filters, page, 12);
        setProfiles(profileList);
        setHasMore(more);

        const openTeamsList = await teamMatchService.getOpenTeams(filters);
        setTeams(openTeamsList);
      } catch (err) {
        console.error('Load match data error:', err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [filters, page]);

  // Filter Handlers
  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setPage(1);
  };

  const handleResetFilters = () => {
    setFilters({
      search: '',
      skill: 'All',
      college: 'All',
      department: 'All',
      year: 'All',
      domain: 'All',
      experience: 'All',
      lookingFor: 'All'
    });
    setPage(1);
  };

  // Profile Upsert
  const handleSaveProfile = async (profileData) => {
    const updated = await teamMatchService.upsertProfile(profileData);
    setUserMatchProfile(updated);
    setProfiles(prev => [updated, ...prev.filter(p => p.id !== updated.id)]);
  };

  // Team Create
  const handleCreateTeam = async (teamData) => {
    const newTeam = await teamMatchService.createTeam(teamData);
    setTeams(prev => [newTeam, ...prev]);
  };

  // Join Request Submit
  const handleSendJoinRequestSubmit = async ({ targetProfile, targetTeam, message }) => {
    await teamMatchService.sendJoinRequest({
      sender_id: user?.id || 'u1',
      receiver_id: targetProfile?.user_id || targetTeam?.leader_id,
      team_id: targetTeam?.id,
      message
    });
  };

  // Request Action (Accept, Reject, Cancel)
  const handleRequestStatusChange = async (requestId, status) => {
    await teamMatchService.updateRequestStatus(requestId, status);
    if (user) {
      const reqs = await teamMatchService.getUserRequests(user.id);
      setUserRequests(reqs);
    }
  };

  // Report Submit
  const handleReportSubmit = async (reportData) => {
    await teamMatchService.submitReport(reportData);
  };

  // Admin Reports Load
  useEffect(() => {
    if (isAdmin && activeTab === 'admin') {
      teamMatchService.getAdminReports().then(reps => setAdminReports(reps));
    }
  }, [isAdmin, activeTab]);

  return (
    <div className="min-h-screen bg-[#050816] text-white pt-24 pb-20 relative overflow-hidden">
      {/* Dynamic Cyber Ambient Background Elements */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none animate-pulse-glow" />
      <div className="absolute top-1/3 right-10 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl pointer-events-none animate-pulse-glow" />

      <div className="max-w-[1440px] mx-auto px-4 lg:px-8 relative z-10 space-y-10">

        {/* HERO SECTION */}
        <div className="text-center max-w-4xl mx-auto space-y-4 pt-4">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 font-mono text-xs font-semibold shadow-[0_0_20px_rgba(0,229,255,0.2)]"
          >
            <Sparkles className="w-4 h-4 text-cyan-400" />
            <span>ZAYATHON REAL-TIME TEAM MATCH HUB</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="font-title text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight"
          >
            Assemble Your High-Performance <br />
            <span className="gradient-text">Hackathon Squad</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-slate-300 text-sm sm:text-base font-sans max-w-2xl mx-auto leading-relaxed"
          >
            Connect with AI developers, Web3 engineers, and UI/UX designers across top universities in real time. Filter by skills, innovation domain, and college diversity.
          </motion.p>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              onClick={() => setCreateProfileOpen(true)}
              className="neon-button px-6 py-3 rounded-xl text-xs sm:text-sm font-mono font-bold text-white flex items-center gap-2 cursor-pointer shadow-lg"
            >
              <UserPlus className="w-4 h-4" />
              <span>{userMatchProfile ? 'Edit Match Profile' : 'Create Match Profile'}</span>
            </button>

            <button
              onClick={() => setCreateTeamOpen(true)}
              className="px-6 py-3 rounded-xl bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/30 text-purple-300 text-xs sm:text-sm font-mono font-bold flex items-center gap-2 transition-all cursor-pointer shadow-[0_0_20px_rgba(124,58,237,0.2)]"
            >
              <Shield className="w-4 h-4 text-purple-400" />
              <span>Host Open Team</span>
            </button>
          </div>
        </div>

        {/* LIVE STATISTICS BANNER */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <motion.div
            whileHover={{ y: -3 }}
            className="glass-card rounded-2xl p-4 lg:p-5 border border-white/10 flex items-center gap-4"
          >
            <div className="p-3 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <div className="text-xl lg:text-2xl font-mono font-bold text-white">
                {stats.lookingForTeamsCount}
              </div>
              <div className="text-[11px] font-mono text-slate-400">People Looking for Teams</div>
            </div>
          </motion.div>

          <motion.div
            whileHover={{ y: -3 }}
            className="glass-card rounded-2xl p-4 lg:p-5 border border-white/10 flex items-center gap-4"
          >
            <div className="p-3 rounded-xl bg-purple-500/10 border border-purple-500/30 text-purple-400">
              <Shield className="w-6 h-6" />
            </div>
            <div>
              <div className="text-xl lg:text-2xl font-mono font-bold text-white">
                {stats.openTeamsCount}
              </div>
              <div className="text-[11px] font-mono text-slate-400">Open Teams</div>
            </div>
          </motion.div>

          <motion.div
            whileHover={{ y: -3 }}
            className="glass-card rounded-2xl p-4 lg:p-5 border border-white/10 flex items-center gap-4"
          >
            <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
              <Trophy className="w-6 h-6" />
            </div>
            <div>
              <div className="text-xl lg:text-2xl font-mono font-bold text-white">
                {stats.successfulMatchesCount}
              </div>
              <div className="text-[11px] font-mono text-slate-400">Successful Matches</div>
            </div>
          </motion.div>

          <motion.div
            whileHover={{ y: -3 }}
            className="glass-card rounded-2xl p-4 lg:p-5 border border-white/10 flex items-center gap-4"
          >
            <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400">
              <Activity className="w-6 h-6" />
            </div>
            <div>
              <div className="text-xl lg:text-2xl font-mono font-bold text-white">
                {stats.activeTodayCount}
              </div>
              <div className="text-[11px] font-mono text-slate-400">Active Today</div>
            </div>
          </motion.div>
        </div>

        {/* SMART FILTERS */}
        <MatchFilters
          filters={filters}
          onFilterChange={handleFilterChange}
          onReset={handleResetFilters}
        />

        {/* MAIN TAB SWITCHER */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-4">
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setActiveTab('profiles')}
              className={`px-4 py-2 rounded-xl text-xs lg:text-sm font-mono font-bold transition-all cursor-pointer flex items-center gap-2 ${
                activeTab === 'profiles'
                  ? 'bg-cyan-500/10 border border-cyan-500/40 text-cyan-300 shadow-[0_0_15px_rgba(0,229,255,0.2)]'
                  : 'bg-white/5 border border-white/10 text-slate-400 hover:text-white'
              }`}
            >
              <Users className="w-4 h-4" />
              <span>Participant Profiles ({profiles.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('teams')}
              className={`px-4 py-2 rounded-xl text-xs lg:text-sm font-mono font-bold transition-all cursor-pointer flex items-center gap-2 ${
                activeTab === 'teams'
                  ? 'bg-purple-500/10 border border-purple-500/40 text-purple-300 shadow-[0_0_15px_rgba(124,58,237,0.2)]'
                  : 'bg-white/5 border border-white/10 text-slate-400 hover:text-white'
              }`}
            >
              <Shield className="w-4 h-4" />
              <span>Open Teams ({teams.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('ai')}
              className={`px-4 py-2 rounded-xl text-xs lg:text-sm font-mono font-bold transition-all cursor-pointer flex items-center gap-2 ${
                activeTab === 'ai'
                  ? 'bg-gradient-to-r from-cyan-500/20 to-purple-500/20 border border-cyan-500/40 text-cyan-300 shadow-[0_0_20px_rgba(0,229,255,0.3)]'
                  : 'bg-white/5 border border-white/10 text-slate-400 hover:text-white'
              }`}
            >
              <Sparkles className="w-4 h-4 text-cyan-400 animate-pulse" />
              <span>AI Recommended ({aiRecommendations.length})</span>
            </button>

            {user && (
              <button
                onClick={() => setActiveTab('requests')}
                className={`px-4 py-2 rounded-xl text-xs lg:text-sm font-mono font-bold transition-all cursor-pointer flex items-center gap-2 ${
                  activeTab === 'requests'
                    ? 'bg-emerald-500/10 border border-emerald-500/40 text-emerald-300 shadow-[0_0_15px_rgba(16,185,129,0.2)]'
                    : 'bg-white/5 border border-white/10 text-slate-400 hover:text-white'
                }`}
              >
                <MessageSquare className="w-4 h-4" />
                <span>My Requests & Chats</span>
              </button>
            )}

            {isAdmin && (
              <button
                onClick={() => setActiveTab('admin')}
                className={`px-4 py-2 rounded-xl text-xs lg:text-sm font-mono font-bold transition-all cursor-pointer flex items-center gap-2 ${
                  activeTab === 'admin'
                    ? 'bg-rose-500/10 border border-rose-500/40 text-rose-300 shadow-[0_0_15px_rgba(244,63,94,0.2)]'
                    : 'bg-white/5 border border-white/10 text-rose-400 hover:text-rose-300'
                }`}
              >
                <ShieldAlert className="w-4 h-4" />
                <span>Admin Moderation</span>
              </button>
            )}
          </div>
        </div>

        {/* TAB CONTENTS */}

        {/* 1. PARTICIPANT PROFILES GRID */}
        {activeTab === 'profiles' && (
          <div>
            {profiles.length === 0 ? (
              <div className="glass-card rounded-2xl p-12 text-center space-y-3 font-mono">
                <Search className="w-12 h-12 text-cyan-400 mx-auto opacity-50" />
                <h3 className="text-lg font-bold text-white">No Profiles Found</h3>
                <p className="text-xs text-slate-400">Try adjusting your filters or search keywords.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                {profiles.map(p => (
                  <ProfileCard
                    key={p.id}
                    profile={p}
                    currentUser={user}
                    onSendRequest={(prof) => setJoinRequestModal({ isOpen: true, targetProfile: prof, targetTeam: null })}
                    onReport={(prof) => setReportModal({ isOpen: true, targetProfile: prof, targetTeam: null })}
                  />
                ))}
              </div>
            )}

            {/* Pagination / Infinite Scroll Trigger */}
            {hasMore && (
              <div className="text-center pt-8">
                <button
                  onClick={() => setPage(prev => prev + 1)}
                  className="px-6 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-mono text-cyan-300 transition-all cursor-pointer"
                >
                  Load More Profiles ↓
                </button>
              </div>
            )}
          </div>
        )}

        {/* 2. OPEN TEAMS GRID */}
        {activeTab === 'teams' && (
          <div>
            {teams.length === 0 ? (
              <div className="glass-card rounded-2xl p-12 text-center space-y-3 font-mono">
                <Shield className="w-12 h-12 text-purple-400 mx-auto opacity-50" />
                <h3 className="text-lg font-bold text-white">No Open Teams Found</h3>
                <p className="text-xs text-slate-400">Be the first to host an open team listing!</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {teams.map(t => (
                  <TeamCard
                    key={t.id}
                    team={t}
                    currentUser={user}
                    onJoinTeam={(tm) => setJoinRequestModal({ isOpen: true, targetProfile: null, targetTeam: tm })}
                    onOpenChat={(tm) => setChatWindow({ isOpen: true, team: tm })}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* 3. AI RECOMMENDATION CARDS */}
        {activeTab === 'ai' && (
          <div className="space-y-4">
            <div className="p-4 rounded-2xl bg-gradient-to-r from-cyan-500/10 via-purple-500/10 to-transparent border border-cyan-500/30 flex items-center gap-3">
              <Sparkles className="w-6 h-6 text-cyan-400 shrink-0 animate-spin" />
              <div>
                <h4 className="font-title font-bold text-sm text-white">
                  Recommended for You
                </h4>
                <p className="text-xs font-mono text-slate-300">
                  AI match scores analyze skill alignment, domain affinity, experience balance, and college diversity.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
              {aiRecommendations.map((rec, idx) => (
                <AIRecommendationCard
                  key={idx}
                  recommendation={rec}
                  onConnect={(prof) => setJoinRequestModal({ isOpen: true, targetProfile: prof, targetTeam: null })}
                />
              ))}
            </div>
          </div>
        )}

        {/* 4. MY REQUESTS & TEAMS */}
        {activeTab === 'requests' && user && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Sent Requests */}
              <div className="glass-card rounded-2xl p-5 border border-white/10 space-y-3">
                <h3 className="font-title font-bold text-base text-white flex items-center gap-2">
                  <UserPlus className="w-4 h-4 text-cyan-400" /> Sent Join Requests
                </h3>

                {userRequests.sent.length === 0 ? (
                  <p className="text-xs text-slate-400 font-mono py-4">No sent requests yet.</p>
                ) : (
                  userRequests.sent.map(req => (
                    <div key={req.id} className="p-3 rounded-xl bg-white/5 border border-white/5 flex items-center justify-between text-xs font-mono">
                      <div>
                        <div className="text-cyan-300 font-bold">Request to join team</div>
                        <div className="text-[11px] text-slate-400">{req.message || 'No message provided.'}</div>
                      </div>
                      <span className={`px-2.5 py-1 rounded-full text-[10px] uppercase font-bold ${
                        req.status === 'accepted' ? 'bg-emerald-500/20 text-emerald-300' :
                        req.status === 'rejected' ? 'bg-rose-500/20 text-rose-300' : 'bg-amber-500/20 text-amber-300'
                      }`}>
                        {req.status}
                      </span>
                    </div>
                  ))
                )}
              </div>

              {/* Incoming Requests */}
              <div className="glass-card rounded-2xl p-5 border border-white/10 space-y-3">
                <h3 className="font-title font-bold text-base text-white flex items-center gap-2">
                  <Users className="w-4 h-4 text-purple-400" /> Incoming Team Join Requests
                </h3>

                {userRequests.incoming.length === 0 ? (
                  <p className="text-xs text-slate-400 font-mono py-4">No incoming requests right now.</p>
                ) : (
                  userRequests.incoming.map(req => (
                    <div key={req.id} className="p-3 rounded-xl bg-white/5 border border-white/5 flex items-center justify-between text-xs font-mono">
                      <div>
                        <div className="text-purple-300 font-bold">Incoming Request</div>
                        <div className="text-[11px] text-slate-300">{req.message || 'Wants to join your squad!'}</div>
                      </div>

                      {req.status === 'pending' ? (
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleRequestStatusChange(req.id, 'accepted')}
                            className="px-2.5 py-1 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 text-[11px]"
                          >
                            Accept
                          </button>
                          <button
                            onClick={() => handleRequestStatusChange(req.id, 'rejected')}
                            className="px-2.5 py-1 rounded-lg bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 text-[11px]"
                          >
                            Reject
                          </button>
                        </div>
                      ) : (
                        <span className="text-[10px] uppercase font-bold text-slate-400">{req.status}</span>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}

        {/* 5. ADMIN MODERATION PANEL */}
        {activeTab === 'admin' && isAdmin && (
          <div className="glass-card rounded-2xl p-6 border border-rose-500/30 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <h3 className="font-title font-bold text-lg text-rose-300 flex items-center gap-2">
                <ShieldAlert className="w-5 h-5 text-rose-400" /> Admin Moderation Center
              </h3>
              <span className="text-xs font-mono text-slate-400">Manage flags & reports</span>
            </div>

            <div className="space-y-3">
              {adminReports.length === 0 ? (
                <p className="text-xs text-slate-400 font-mono py-4">Zero reports pending moderation.</p>
              ) : (
                adminReports.map(rep => (
                  <div key={rep.id} className="p-3.5 rounded-xl bg-white/5 border border-white/10 flex flex-col md:flex-row items-start md:items-center justify-between gap-3 text-xs font-mono">
                    <div>
                      <div className="text-rose-400 font-bold">Reason: {rep.reason}</div>
                      <div className="text-slate-300">{rep.details}</div>
                      <div className="text-[10px] text-slate-400 mt-1">Status: {rep.status}</div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => teamMatchService.moderateProfile(rep.reported_user, true)}
                        className="px-3 py-1.5 rounded-lg bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 text-xs font-bold"
                      >
                        Ban User
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* SUCCESS STORIES SECTION */}
        <div className="pt-10 border-t border-white/10 space-y-6">
          <div className="text-center space-y-2">
            <h2 className="font-title font-bold text-2xl lg:text-3xl text-white">
              Success Stories from <span className="gradient-text">Previous ZayaThon Hackathons</span>
            </h2>
            <p className="text-xs lg:text-sm font-mono text-slate-400">
              Participants who met through Team Match Hub and won prize tracks.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className="glass-card rounded-2xl p-5 border border-white/10 space-y-3">
              <div className="flex items-center gap-1 text-amber-400">
                <Star className="w-4 h-4 fill-amber-400" />
                <Star className="w-4 h-4 fill-amber-400" />
                <Star className="w-4 h-4 fill-amber-400" />
                <Star className="w-4 h-4 fill-amber-400" />
                <Star className="w-4 h-4 fill-amber-400" />
              </div>
              <p className="text-xs text-slate-300 italic leading-relaxed">
                "I was looking for a Solidity developer 12 hours before the deadline. Found Priya through ZayaThon Team Match and won 1st Place in Web3!"
              </p>
              <div className="text-xs font-mono font-bold text-cyan-300">— Aarav S. & Priya P.</div>
            </div>

            <div className="glass-card rounded-2xl p-5 border border-white/10 space-y-3">
              <div className="flex items-center gap-1 text-amber-400">
                <Star className="w-4 h-4 fill-amber-400" />
                <Star className="w-4 h-4 fill-amber-400" />
                <Star className="w-4 h-4 fill-amber-400" />
                <Star className="w-4 h-4 fill-amber-400" />
                <Star className="w-4 h-4 fill-amber-400" />
              </div>
              <p className="text-xs text-slate-300 italic leading-relaxed">
                "The AI Teammate Suggestion accurately paired our team with an ML engineer from DTU. The private real-time chat made collaboration effortless."
              </p>
              <div className="text-xs font-mono font-bold text-purple-300">— Team Neural Matrix</div>
            </div>

            <div className="glass-card rounded-2xl p-5 border border-white/10 space-y-3">
              <div className="flex items-center gap-1 text-amber-400">
                <Star className="w-4 h-4 fill-amber-400" />
                <Star className="w-4 h-4 fill-amber-400" />
                <Star className="w-4 h-4 fill-amber-400" />
                <Star className="w-4 h-4 fill-amber-400" />
                <Star className="w-4 h-4 fill-amber-400" />
              </div>
              <p className="text-xs text-slate-300 italic leading-relaxed">
                "Cross-college team creation allowed us to combine hardware sensors with a React UI. Highly recommend creating a profile early!"
              </p>
              <div className="text-xs font-mono font-bold text-emerald-300">— Ananya V.</div>
            </div>
          </div>
        </div>

      </div>

      {/* ALL MODALS */}
      <CreateProfileModal
        isOpen={createProfileOpen}
        onClose={() => setCreateProfileOpen(false)}
        existingProfile={userMatchProfile}
        onSave={handleSaveProfile}
        user={user}
      />

      <CreateTeamModal
        isOpen={createTeamOpen}
        onClose={() => setCreateTeamOpen(false)}
        onCreateTeam={handleCreateTeam}
        user={user}
      />

      <JoinRequestModal
        isOpen={joinRequestModal.isOpen}
        onClose={() => setJoinRequestModal({ isOpen: false, targetProfile: null, targetTeam: null })}
        targetProfile={joinRequestModal.targetProfile}
        targetTeam={joinRequestModal.targetTeam}
        onSubmitRequest={handleSendJoinRequestSubmit}
      />

      <ChatWindow
        isOpen={chatWindow.isOpen}
        onClose={() => setChatWindow({ isOpen: false, team: null })}
        team={chatWindow.team}
        currentUser={user}
      />

      <ReportModal
        isOpen={reportModal.isOpen}
        onClose={() => setReportModal({ isOpen: false, targetProfile: null, targetTeam: null })}
        targetProfile={reportModal.targetProfile}
        targetTeam={reportModal.targetTeam}
        onSubmitReport={handleReportSubmit}
        user={user}
      />
    </div>
  );
};

export default TeamMatchPage;

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Users, Calendar, Video, Bot, Award, Star, Search, Filter, Sparkles, ArrowRight, ShieldCheck, CheckCircle2, MessageSquare } from 'lucide-react';
import MentorCard from '../../components/MentorCard';
import AIChat from '../../components/AIChat';
import OfficeHourCard from '../../components/OfficeHourCard';
import FeedbackCard from '../../components/FeedbackCard';
import useMentor from '../../hooks/useMentor';

/**
 * Main Mentor Ecosystem Landing Page (/mentors)
 */
const MentorsPage = ({ user, onNavigate }) => {
  const {
    mentors,
    featuredMentors,
    officeHours,
    stats,
    chatHistory,
    loading,
    chatLoading,
    askAIChat,
    clearChat,
    fetchMentorData
  } = useMentor(user);

  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('mentors'); // 'mentors' | 'ai-assistant' | 'office-hours' | 'feedback'

  const categories = [
    'All',
    'AI/ML',
    'Web3',
    'Full Stack',
    'Cybersecurity',
    'UX/UI'
  ];

  const handleCategorySelect = (cat) => {
    setSelectedCategory(cat);
    fetchMentorData(cat);
  };

  const filteredMentors = mentors.filter(m => {
    const nameMatch = m.name.toLowerCase().includes(searchQuery.toLowerCase());
    const companyMatch = m.company.toLowerCase().includes(searchQuery.toLowerCase());
    const roleMatch = m.role_title.toLowerCase().includes(searchQuery.toLowerCase());
    return nameMatch || companyMatch || roleMatch;
  });

  return (
    <div className="min-h-screen bg-[#050816] text-white pt-24 pb-20 px-4 sm:px-6 lg:px-8 max-w-[1440px] mx-auto space-y-16 font-sans">
      {/* Hero Section */}
      <div className="relative rounded-3xl overflow-hidden p-8 sm:p-12 lg:p-16 border border-white/10 bg-gradient-to-br from-[#0B1120] via-[#050816] to-[#0D1F3D] shadow-[0_10px_50px_rgba(0,0,0,0.8)]">
        {/* Glow Effects */}
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 font-mono text-xs font-semibold">
            <Sparkles className="w-4 h-4 animate-spin" />
            <span>ZAYATHON AI & Human Mentorship Ecosystem</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight bg-gradient-to-r from-white via-cyan-100 to-cyan-400 bg-clip-text text-transparent leading-tight">
            Accelerate Your Project with World-Class Mentors
          </h1>

          <p className="text-sm sm:text-base text-slate-300 font-mono leading-relaxed">
            Chat 24/7 with our AI Mentor Assistant, book 1-on-1 office hours with industry architects from Google, OpenAI, AWS, and ConsenSys, and get detailed code reviews.
          </p>

          {/* Quick Nav Action Buttons */}
          <div className="flex flex-wrap gap-4 pt-4">
            <button
              onClick={() => setActiveTab('ai-assistant')}
              className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-mono text-xs font-bold shadow-[0_0_20px_rgba(0,229,255,0.4)] transition-all flex items-center gap-2 cursor-pointer"
            >
              <Bot className="w-4 h-4" />
              Launch AI Assistant
            </button>

            <button
              onClick={() => onNavigate ? onNavigate('/book-session') : null}
              className="px-6 py-3.5 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/10 text-white font-mono text-xs font-bold transition-all flex items-center gap-2 cursor-pointer"
            >
              <Calendar className="w-4 h-4 text-cyan-400" />
              Book 1-on-1 Session
            </button>

            <button
              onClick={() => onNavigate ? onNavigate('/ai-review') : null}
              className="px-6 py-3.5 rounded-2xl bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/30 text-purple-300 font-mono text-xs font-bold transition-all flex items-center gap-2 cursor-pointer"
            >
              <Award className="w-4 h-4 text-purple-400" />
              AI Project Review
            </button>
          </div>
        </div>

        {/* Stats Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-12 pt-8 border-t border-white/10">
          <div className="p-4 rounded-2xl bg-white/5 border border-white/5 text-center">
            <div className="text-2xl font-black text-cyan-400 font-mono">{stats?.totalMentors || 50}+</div>
            <div className="text-xs text-slate-400 font-mono mt-1">Expert Mentors</div>
          </div>
          <div className="p-4 rounded-2xl bg-white/5 border border-white/5 text-center">
            <div className="text-2xl font-black text-emerald-400 font-mono">{stats?.sessionsBooked || 1200}+</div>
            <div className="text-xs text-slate-400 font-mono mt-1">Sessions Booked</div>
          </div>
          <div className="p-4 rounded-2xl bg-white/5 border border-white/5 text-center">
            <div className="text-2xl font-black text-amber-400 font-mono">{stats?.avgRating || 4.9}/5.0</div>
            <div className="text-xs text-slate-400 font-mono mt-1">Average Rating</div>
          </div>
          <div className="p-4 rounded-2xl bg-white/5 border border-white/5 text-center">
            <div className="text-2xl font-black text-purple-400 font-mono">{stats?.successRate || '98%'}</div>
            <div className="text-xs text-slate-400 font-mono mt-1">Project Success Rate</div>
          </div>
        </div>
      </div>

      {/* Interactive Tabs Header */}
      <div className="flex items-center justify-between border-b border-white/10 pb-4 overflow-x-auto no-scrollbar gap-4">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('mentors')}
            className={`px-5 py-2.5 rounded-2xl text-xs font-mono font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'mentors'
                ? 'bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 shadow-[0_0_15px_rgba(0,229,255,0.2)]'
                : 'bg-white/5 text-slate-400 hover:text-white'
            }`}
          >
            <Users className="w-4 h-4" />
            Human Mentors
          </button>

          <button
            onClick={() => setActiveTab('ai-assistant')}
            className={`px-5 py-2.5 rounded-2xl text-xs font-mono font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'ai-assistant'
                ? 'bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 shadow-[0_0_15px_rgba(0,229,255,0.2)]'
                : 'bg-white/5 text-slate-400 hover:text-white'
            }`}
          >
            <Bot className="w-4 h-4 text-cyan-400" />
            AI Mentor Assistant
          </button>

          <button
            onClick={() => onNavigate ? onNavigate('/office-hours') : setActiveTab('office-hours')}
            className={`px-5 py-2.5 rounded-2xl text-xs font-mono font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'office-hours'
                ? 'bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 shadow-[0_0_15px_rgba(16,185,129,0.2)]'
                : 'bg-white/5 text-slate-400 hover:text-white'
            }`}
          >
            <Video className="w-4 h-4 text-emerald-400" />
            Live Office Hours
          </button>

          <button
            onClick={() => setActiveTab('feedback')}
            className={`px-5 py-2.5 rounded-2xl text-xs font-mono font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'feedback'
                ? 'bg-purple-500/20 border border-purple-500/40 text-purple-300 shadow-[0_0_15px_rgba(168,85,247,0.2)]'
                : 'bg-white/5 text-slate-400 hover:text-white'
            }`}
          >
            <MessageSquare className="w-4 h-4 text-purple-400" />
            Mentor Feedback
          </button>
        </div>

        <button
          onClick={() => onNavigate ? onNavigate('/ai-review') : null}
          className="px-4 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-mono text-xs font-bold hover:shadow-[0_0_15px_rgba(168,85,247,0.4)] transition-all shrink-0"
        >
          🚀 Try AI Review
        </button>
      </div>

      {/* TAB CONTENT 1: HUMAN MENTORS GRID */}
      {activeTab === 'mentors' && (
        <div className="space-y-8">
          {/* Category Filter Pills & Search */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-[#0B1120]/60 p-4 rounded-2xl border border-white/10">
            <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto no-scrollbar">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => handleCategorySelect(cat)}
                  className={`px-4 py-2 rounded-xl text-xs font-mono font-medium transition-all whitespace-nowrap ${
                    selectedCategory === cat
                      ? 'bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 font-bold'
                      : 'bg-white/5 border border-white/5 text-slate-400 hover:text-white'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            <div className="relative w-full sm:w-64">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by mentor name or role..."
                className="w-full pl-9 pr-4 py-2 rounded-xl bg-white/5 border border-white/10 text-xs font-mono text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
              />
            </div>
          </div>

          {/* Mentors Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredMentors.map((mentor) => (
              <MentorCard
                key={mentor.id}
                mentor={mentor}
                onBookSession={(m) => onNavigate ? onNavigate('/book-session') : null}
                onViewDetails={(id) => onNavigate ? onNavigate(`/mentor/${id}`) : null}
              />
            ))}
          </div>
        </div>
      )}

      {/* TAB CONTENT 2: AI MENTOR CHATBOT */}
      {activeTab === 'ai-assistant' && (
        <AIChat
          chatHistory={chatHistory}
          onSendMessage={askAIChat}
          onClearChat={clearChat}
          loading={chatLoading}
        />
      )}

      {/* TAB CONTENT 3: LIVE OFFICE HOURS */}
      {activeTab === 'office-hours' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Video className="w-5 h-5 text-emerald-400" />
              Active Live Mentor Office Hours
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {officeHours.map((session) => (
              <OfficeHourCard
                key={session.id}
                session={session}
                onJoinSession={() => {}}
              />
            ))}
          </div>
        </div>
      )}

      {/* TAB CONTENT 4: MENTOR FEEDBACK SHOWCASE */}
      {activeTab === 'feedback' && (
        <FeedbackCard
          feedbackList={[]}
          isMentorOrAdmin={user?.profile?.role === 'mentor' || user?.profile?.role === 'admin'}
        />
      )}

      {/* Success Stories & Testimonials */}
      <div className="p-8 sm:p-10 rounded-3xl bg-[#0B1120]/80 border border-white/10 space-y-6">
        <h3 className="text-xl font-bold text-white flex items-center gap-2">
          <Star className="w-5 h-5 text-amber-400 fill-amber-400" />
          Participant Success Stories
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-5 rounded-2xl bg-white/5 border border-white/5 space-y-3">
            <div className="flex items-center gap-1 text-amber-400 text-xs">
              {[...Array(5)].map((_, i) => <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />)}
            </div>
            <p className="text-xs text-slate-300 font-mono italic leading-relaxed">
              "Dr. Alex Mercer’s 1-on-1 session helped our team optimize our agentic LLM context length. We ended up winning 1st place in the AI domain!"
            </p>
            <div className="text-xs font-bold text-cyan-300 font-mono">— Team NeuralShield</div>
          </div>

          <div className="p-5 rounded-2xl bg-white/5 border border-white/5 space-y-3">
            <div className="flex items-center gap-1 text-amber-400 text-xs">
              {[...Array(5)].map((_, i) => <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />)}
            </div>
            <p className="text-xs text-slate-300 font-mono italic leading-relaxed">
              "The AI Project Review feature gave us instant feedback on our pitch deck structure. The presentation score rubric was spot on!"
            </p>
            <div className="text-xs font-bold text-cyan-300 font-mono">— Team ZeroKnowledge</div>
          </div>

          <div className="p-5 rounded-2xl bg-white/5 border border-white/5 space-y-3">
            <div className="flex items-center gap-1 text-amber-400 text-xs">
              {[...Array(5)].map((_, i) => <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />)}
            </div>
            <p className="text-xs text-slate-300 font-mono italic leading-relaxed">
              "Joined Sophia Lin's live office hours 2 hours before submission. She helped us fix a breaking Supabase RLS policy in 5 minutes."
            </p>
            <div className="text-xs font-bold text-cyan-300 font-mono">— Team CyberForge</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MentorsPage;

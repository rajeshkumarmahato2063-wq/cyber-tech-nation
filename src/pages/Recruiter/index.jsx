import React, { useState, useEffect } from 'react';
import { Search, Filter, Bookmark, Briefcase, Sparkles, Building, Download } from 'lucide-react';
import { recruiterService } from '../../services/recruiter';
import PortfolioCard from '../../components/PortfolioCard';
import { resumeService } from '../../services/resume';

const RecruiterDashboardPage = ({ onViewPortfolio }) => {
  const [candidates, setCandidates] = useState([]);
  const [bookmarkedIds, setBookmarkedIds] = useState(new Set());
  const [skillFilter, setSkillFilter] = useState('');
  const [collegeFilter, setCollegeFilter] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('all'); // 'all' | 'bookmarked'
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCandidates();
  }, [skillFilter, collegeFilter, searchTerm]);

  const loadCandidates = async () => {
    setLoading(true);
    try {
      const list = await recruiterService.searchCandidates(skillFilter, collegeFilter, searchTerm);
      setCandidates(list);
    } catch (err) {
      console.warn('Candidate search error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleBookmark = (candidate) => {
    setBookmarkedIds((prev) => {
      const next = new Set(prev);
      if (next.has(candidate.id)) next.delete(candidate.id);
      else next.add(candidate.id);
      return next;
    });
  };

  const handleDownloadResume = async (candidate) => {
    const resumeData = await resumeService.getUserResume(candidate.user_id);
    await resumeService.downloadResumePDF(resumeData);
  };

  const displayedCandidates = activeTab === 'bookmarked'
    ? candidates.filter(c => bookmarkedIds.has(c.id))
    : candidates;

  return (
    <div className="min-h-screen pt-28 pb-20 px-6 max-w-7xl mx-auto space-y-8 font-sans text-left">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-white/10">
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-cyan-400 font-mono text-xs font-bold uppercase tracking-widest">
            <Briefcase className="w-4 h-4" /> Recruiter Candidate Portal
          </div>
          <h1 className="text-4xl sm:text-6xl font-extrabold font-mono text-white tracking-tight">
            Discover Tech Talent
          </h1>
          <p className="text-slate-400 text-sm max-w-xl">
            Browse verified hackathon participants, filter by specialized skill sets or universities, inspect public portfolios, and download ATS resumes.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center bg-[#0B1120] p-1.5 rounded-2xl border border-white/10 font-mono text-xs">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-4 py-2 rounded-xl transition-all cursor-pointer font-bold ${
              activeTab === 'all' ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30' : 'text-slate-400 hover:text-white'
            }`}
          >
            All Candidates ({candidates.length})
          </button>
          <button
            onClick={() => setActiveTab('bookmarked')}
            className={`px-4 py-2 rounded-xl transition-all cursor-pointer font-bold flex items-center gap-1.5 ${
              activeTab === 'bookmarked' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Bookmark className="w-3.5 h-3.5" /> Bookmarked ({bookmarkedIds.size})
          </button>
        </div>
      </div>

      {/* Filter Control Bar */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 bg-[#0B1120] p-4 rounded-3xl border border-white/10 font-mono text-xs">
        {/* Search Term */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search candidate name or title..."
            className="w-full bg-[#050816] border border-white/10 rounded-2xl pl-10 pr-4 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
          />
        </div>

        {/* Skill Filter */}
        <div className="relative">
          <Sparkles className="w-4 h-4 text-cyan-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={skillFilter}
            onChange={(e) => setSkillFilter(e.target.value)}
            placeholder="Filter by skill (e.g. React, Python, AI)..."
            className="w-full bg-[#050816] border border-white/10 rounded-2xl pl-10 pr-4 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
          />
        </div>

        {/* College Filter */}
        <div className="relative">
          <Building className="w-4 h-4 text-purple-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={collegeFilter}
            onChange={(e) => setCollegeFilter(e.target.value)}
            placeholder="Filter by university/college..."
            className="w-full bg-[#050816] border border-white/10 rounded-2xl pl-10 pr-4 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
          />
        </div>
      </div>

      {/* Candidate Cards Grid */}
      {loading ? (
        <div className="py-20 text-center text-slate-400 font-mono text-sm animate-pulse">
          Searching hacker candidates...
        </div>
      ) : displayedCandidates.length === 0 ? (
        <div className="p-12 text-center rounded-3xl bg-white/5 border border-white/10 space-y-2 font-mono">
          <Filter className="w-8 h-8 text-cyan-400 mx-auto" />
          <h3 className="text-base font-bold text-white">No Candidate Profiles Found</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Try adjusting your search criteria or clearing skill filters.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayedCandidates.map((candidate) => (
            <PortfolioCard
              key={candidate.id}
              candidate={candidate}
              onViewPortfolio={onViewPortfolio}
              onDownloadResume={handleDownloadResume}
              onBookmark={handleBookmark}
              isBookmarked={bookmarkedIds.has(candidate.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default RecruiterDashboardPage;

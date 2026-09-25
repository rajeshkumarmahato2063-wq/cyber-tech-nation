import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Briefcase, Search, Filter, Building2, DollarSign, MapPin, Sparkles, ArrowRight, ShieldCheck, CheckCircle2, Award, Users } from 'lucide-react';
import JobCard from '../../components/JobCard';
import CompanyCard from '../../components/CompanyCard';
import useJobs from '../../hooks/useJobs';

/**
 * Main Hiring & Internship Hub Landing Page (/jobs)
 */
const JobsPage = ({ user, onNavigate }) => {
  const {
    jobs,
    featuredJobs,
    companies,
    loading,
    applyJob,
    fetchHubData
  } = useJobs(user);

  const [selectedType, setSelectedType] = useState('All');
  const [selectedLocation, setSelectedLocation] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('jobs'); // 'jobs' | 'companies'

  const jobTypes = ['All', 'Internship', 'Full-Time', 'Remote'];

  const handleFilterChange = (type) => {
    setSelectedType(type);
    fetchHubData({ type, location: selectedLocation, searchQuery });
  };

  const filteredJobs = jobs.filter(j => {
    if (selectedType === 'Remote' && !j.location.toLowerCase().includes('remote')) return false;
    if (selectedType !== 'All' && selectedType !== 'Remote' && j.type.toLowerCase() !== selectedType.toLowerCase()) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const titleMatch = j.title.toLowerCase().includes(q);
      const companyMatch = j.company_name.toLowerCase().includes(q);
      const skillMatch = Array.isArray(j.required_skills) && j.required_skills.some(s => s.toLowerCase().includes(q));
      return titleMatch || companyMatch || skillMatch;
    }
    return true;
  });

  return (
    <div className="min-h-screen bg-[#050816] text-white pt-24 pb-20 px-4 sm:px-6 lg:px-8 max-w-[1440px] mx-auto space-y-14 font-sans">
      {/* Hero Banner */}
      <div className="relative rounded-3xl overflow-hidden p-8 sm:p-12 lg:p-16 border border-white/10 bg-gradient-to-br from-[#0B1120] via-[#050816] to-[#1F0D3D] shadow-[0_10px_50px_rgba(0,0,0,0.8)]">
        {/* Glow Effects */}
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 font-mono text-xs font-semibold">
            <Sparkles className="w-4 h-4 animate-spin" />
            <span>ZAYATHON Direct Company Hiring & Internship Hub</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight bg-gradient-to-r from-white via-cyan-100 to-purple-400 bg-clip-text text-transparent leading-tight">
            Land High-Stipend Tech Internships & Roles
          </h1>

          <p className="text-sm sm:text-base text-slate-300 font-mono leading-relaxed">
            Recruiters from OpenAI, ConsenSys, CyberShield AI, and Nexus Robotics recruit ZayaThon participants based on real hackathon submissions, AI resume scores, and verified skill badges.
          </p>

          {/* Quick Action Buttons */}
          <div className="flex flex-wrap gap-4 pt-2">
            <button
              onClick={() => onNavigate ? onNavigate('/my-applications') : null}
              className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-mono text-xs font-bold shadow-[0_0_20px_rgba(0,229,255,0.4)] transition-all flex items-center gap-2 cursor-pointer"
            >
              <Briefcase className="w-4 h-4" />
              My Job Applications
            </button>

            <button
              onClick={() => onNavigate ? onNavigate('/recruiter/dashboard') : null}
              className="px-6 py-3.5 rounded-2xl bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/30 text-purple-300 font-mono text-xs font-bold transition-all flex items-center gap-2 cursor-pointer"
            >
              <Building2 className="w-4 h-4 text-purple-400" />
              Recruiter Dashboard
            </button>

            <button
              onClick={() => onNavigate ? onNavigate('/interviews') : null}
              className="px-6 py-3.5 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/10 text-white font-mono text-xs font-bold transition-all flex items-center gap-2 cursor-pointer"
            >
              <Award className="w-4 h-4 text-emerald-400" />
              Interview Schedule
            </button>
          </div>
        </div>

        {/* Live Statistics Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-12 pt-8 border-t border-white/10">
          <div className="p-4 rounded-2xl bg-white/5 border border-white/5 text-center">
            <div className="text-2xl font-black text-cyan-400 font-mono">150+</div>
            <div className="text-xs text-slate-400 font-mono mt-1">Open Tech Roles</div>
          </div>
          <div className="p-4 rounded-2xl bg-white/5 border border-white/5 text-center">
            <div className="text-2xl font-black text-purple-400 font-mono">45+</div>
            <div className="text-xs text-slate-400 font-mono mt-1">Hiring Partners</div>
          </div>
          <div className="p-4 rounded-2xl bg-white/5 border border-white/5 text-center">
            <div className="text-2xl font-black text-emerald-400 font-mono">$1.2M+</div>
            <div className="text-xs text-slate-400 font-mono mt-1">Total Stipends Paid</div>
          </div>
          <div className="p-4 rounded-2xl bg-white/5 border border-white/5 text-center">
            <div className="text-2xl font-black text-amber-400 font-mono">85%</div>
            <div className="text-xs text-slate-400 font-mono mt-1">Participant Placement Rate</div>
          </div>
        </div>
      </div>

      {/* Tabs Header */}
      <div className="flex items-center justify-between border-b border-white/10 pb-4 overflow-x-auto no-scrollbar gap-4">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('jobs')}
            className={`px-5 py-2.5 rounded-2xl text-xs font-mono font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'jobs'
                ? 'bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 shadow-[0_0_15px_rgba(0,229,255,0.2)]'
                : 'bg-white/5 text-slate-400 hover:text-white'
            }`}
          >
            <Briefcase className="w-4 h-4" />
            Explore Job Postings ({filteredJobs.length})
          </button>

          <button
            onClick={() => setActiveTab('companies')}
            className={`px-5 py-2.5 rounded-2xl text-xs font-mono font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'companies'
                ? 'bg-purple-500/20 border border-purple-500/40 text-purple-300 shadow-[0_0_15px_rgba(168,85,247,0.2)]'
                : 'bg-white/5 text-slate-400 hover:text-white'
            }`}
          >
            <Building2 className="w-4 h-4 text-purple-400" />
            Company Spotlight ({companies.length})
          </button>
        </div>
      </div>

      {/* TAB 1: JOBS GRID & FILTERS */}
      {activeTab === 'jobs' && (
        <div className="space-y-8">
          {/* Search & Filter Bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-[#0B1120]/60 p-4 rounded-2xl border border-white/10">
            <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto no-scrollbar">
              {jobTypes.map((t) => (
                <button
                  key={t}
                  onClick={() => handleFilterChange(t)}
                  className={`px-4 py-2 rounded-xl text-xs font-mono font-medium transition-all whitespace-nowrap ${
                    selectedType === t
                      ? 'bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 font-bold'
                      : 'bg-white/5 border border-white/5 text-slate-400 hover:text-white'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>

            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search jobs by title or skills..."
                className="w-full pl-9 pr-4 py-2 rounded-xl bg-white/5 border border-white/10 text-xs font-mono text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
              />
            </div>
          </div>

          {/* Jobs Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredJobs.map((j) => (
              <JobCard
                key={j.id}
                job={j}
                onApply={(jobItem) => onNavigate ? onNavigate(`/job/${jobItem.id}`) : null}
                onViewDetails={(id) => onNavigate ? onNavigate(`/job/${id}`) : null}
              />
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: COMPANY SPOTLIGHT GRID */}
      {activeTab === 'companies' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {companies.map((c) => (
            <CompanyCard
              key={c.id}
              company={c}
              onViewCompany={(id) => onNavigate ? onNavigate(`/company/${id}`) : null}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default JobsPage;

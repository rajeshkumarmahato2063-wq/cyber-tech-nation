import React, { useState, useEffect } from 'react';
import { ArrowLeft, Building2, MapPin, Users, Globe, ShieldCheck, Briefcase } from 'lucide-react';
import JobCard from '../../components/JobCard';
import useJobs from '../../hooks/useJobs';

/**
 * Single Company Profile Page (/company/:id)
 */
const CompanyPage = ({ companyId, user, onBack, onNavigate }) => {
  const { getCompanyById, jobs } = useJobs(user);
  const [company, setCompany] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const data = await getCompanyById(companyId);
      setCompany(data);
      setLoading(false);
    };
    load();
  }, [companyId, getCompanyById]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#050816] text-white pt-24 pb-20 flex items-center justify-center font-mono text-cyan-400 text-xs">
        Loading Company Profile...
      </div>
    );
  }

  if (!company) {
    return (
      <div className="min-h-screen bg-[#050816] text-white pt-24 pb-20 text-center font-mono space-y-4">
        <p className="text-rose-400">Company profile not found.</p>
        <button
          onClick={onBack || (() => onNavigate('/jobs'))}
          className="px-4 py-2 rounded-xl bg-white/10 text-white text-xs"
        >
          Return to Jobs Hub
        </button>
      </div>
    );
  }

  const companyJobs = jobs.filter(j => j.company_id === company.id || j.company_name?.toLowerCase() === company.name?.toLowerCase());

  return (
    <div className="min-h-screen bg-[#050816] text-white pt-24 pb-20 px-4 sm:px-6 lg:px-8 max-w-[1200px] mx-auto space-y-8 font-sans">
      {/* Top Back Nav */}
      <button
        onClick={onBack || (() => onNavigate('/jobs'))}
        className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-mono text-cyan-400 flex items-center gap-2 transition-all"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Jobs Hub
      </button>

      {/* Company Header Card */}
      <div className="p-8 sm:p-10 rounded-3xl bg-[#0B1120]/80 backdrop-blur-2xl border border-white/10 space-y-6 shadow-2xl">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 border-b border-white/10 pb-6">
          <div className="flex items-center gap-4">
            <img
              src={company.logo || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=200'}
              alt={company.name}
              className="w-20 h-20 rounded-2xl object-cover border-2 border-cyan-500/40"
            />
            <div>
              <h1 className="text-2xl font-extrabold text-white flex items-center gap-2">
                {company.name}
                {company.verified && <ShieldCheck className="w-5 h-5 text-cyan-400" />}
              </h1>
              <p className="text-xs font-mono text-cyan-400 mt-1">{company.industry}</p>
            </div>
          </div>

          {company.website && (
            <a
              href={company.website}
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-2.5 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-mono text-cyan-300 font-bold flex items-center gap-2"
            >
              <Globe className="w-4 h-4" />
              Visit Official Website
            </a>
          )}
        </div>

        {/* Info Pills */}
        <div className="flex flex-wrap gap-4 text-xs font-mono text-slate-300">
          <span className="flex items-center gap-1.5 p-2.5 rounded-xl bg-white/5 border border-white/5">
            <MapPin className="w-4 h-4 text-cyan-400" />
            {company.location}
          </span>
          <span className="flex items-center gap-1.5 p-2.5 rounded-xl bg-white/5 border border-white/5">
            <Users className="w-4 h-4 text-purple-400" />
            {company.employee_count}
          </span>
          <span className="flex items-center gap-1.5 p-2.5 rounded-xl bg-white/5 border border-white/5">
            <Briefcase className="w-4 h-4 text-emerald-400" />
            {companyJobs.length} Open Postings
          </span>
        </div>

        {/* Description */}
        <div>
          <h3 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider mb-2">Company Overview</h3>
          <p className="text-xs text-slate-300 font-mono leading-relaxed">{company.description}</p>
        </div>
      </div>

      {/* Open Roles Section */}
      <div className="space-y-6">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <Briefcase className="w-5 h-5 text-cyan-400" />
          Active Hiring Positions ({companyJobs.length})
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {companyJobs.map((job) => (
            <JobCard
              key={job.id}
              job={job}
              onApply={(j) => onNavigate ? onNavigate(`/job/${j.id}`) : null}
              onViewDetails={(id) => onNavigate ? onNavigate(`/job/${id}`) : null}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default CompanyPage;

import React from 'react';
import { Building2, MapPin, Users, Globe, ShieldCheck, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

/**
 * Company Spotlight Card Component
 */
const CompanyCard = ({ company, onViewCompany }) => {
  const {
    id,
    name = 'CyberShield AI',
    logo,
    website = 'https://cybershield.ai',
    location = 'San Francisco, CA',
    industry = 'Cybersecurity & AI',
    employee_count = '100-250 Employees',
    description = 'Pioneering autonomous threat intelligence and agentic security patch deployment.',
    verified = true,
    open_roles_count = 5
  } = company;

  return (
    <motion.div
      whileHover={{ y: -4 }}
      className="p-6 rounded-3xl bg-[#0B1120]/80 backdrop-blur-xl border border-white/10 hover:border-cyan-500/40 space-y-4 shadow-xl transition-all duration-300 flex flex-col justify-between"
    >
      <div>
        {/* Header */}
        <div className="flex items-center justify-between gap-3 mb-4">
          <div className="flex items-center gap-3">
            <img
              src={logo || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=200'}
              alt={name}
              className="w-14 h-14 rounded-2xl object-cover border border-cyan-500/30"
            />
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-1.5">
                {name}
                {verified && <ShieldCheck className="w-4 h-4 text-cyan-400" />}
              </h3>
              <p className="text-xs font-mono text-cyan-400">{industry}</p>
            </div>
          </div>

          <span className="px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 font-mono text-xs font-bold">
            {open_roles_count} Roles
          </span>
        </div>

        {/* Location & Employee Count */}
        <div className="flex flex-wrap gap-2 mb-3 text-xs font-mono text-slate-400">
          <span className="flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5 text-cyan-400" />
            {location}
          </span>
          <span>•</span>
          <span className="flex items-center gap-1">
            <Users className="w-3.5 h-3.5 text-slate-500" />
            {employee_count}
          </span>
        </div>

        {/* Description */}
        <p className="text-xs text-slate-300 font-mono line-clamp-3 leading-relaxed mb-4">
          {description}
        </p>
      </div>

      {/* Action Footer */}
      <div className="pt-4 border-t border-white/10 flex items-center justify-between gap-3">
        {website && (
          <a
            href={website}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs font-mono text-cyan-400 hover:underline flex items-center gap-1"
          >
            <Globe className="w-3.5 h-3.5" />
            Website
          </a>
        )}

        <button
          onClick={() => onViewCompany ? onViewCompany(id) : null}
          className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white font-mono text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ml-auto"
        >
          <span>View Jobs</span>
          <ArrowRight className="w-3.5 h-3.5 text-cyan-400" />
        </button>
      </div>
    </motion.div>
  );
};

export default CompanyCard;

import React from 'react';
import { ExternalLink, Github, Linkedin, Award, Download, Bookmark, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

const PortfolioCard = ({ candidate, onViewPortfolio, onDownloadResume, onBookmark, isBookmarked = false }) => {
  const photo = candidate.profile_photo || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80';

  return (
    <motion.div
      whileHover={{ y: -6, scale: 1.01 }}
      className="group relative rounded-3xl bg-[#0B1120]/90 border border-white/10 hover:border-cyan-500/50 p-6 shadow-xl hover:shadow-[0_0_40px_rgba(0,229,255,0.2)] transition-all duration-300 flex flex-col justify-between space-y-4 font-sans text-left"
    >
      {/* Header Profile Info */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="relative w-14 h-14 rounded-2xl overflow-hidden border-2 border-cyan-500/40 shrink-0 shadow-[0_0_15px_rgba(0,229,255,0.3)]">
            <img src={photo} alt={candidate.full_name || candidate.username} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
          </div>

          <div>
            <h3 className="text-lg font-bold font-mono text-white group-hover:text-cyan-300 transition-colors flex items-center gap-1.5">
              {candidate.full_name || candidate.username}
            </h3>
            <p className="text-xs text-cyan-400 font-mono">{candidate.headline || 'Full-Stack Innovator'}</p>
            <p className="text-[11px] text-slate-400">{candidate.college}</p>
          </div>
        </div>

        {onBookmark && (
          <button
            onClick={() => onBookmark(candidate)}
            className={`p-2 rounded-xl border transition-all cursor-pointer ${
              isBookmarked
                ? 'bg-amber-500/20 text-amber-400 border-amber-500/40'
                : 'bg-white/5 text-slate-400 border-white/10 hover:text-white hover:bg-white/10'
            }`}
            title={isBookmarked ? 'Bookmarked Candidate' : 'Bookmark Candidate'}
          >
            <Bookmark className="w-4 h-4 fill-current" />
          </button>
        )}
      </div>

      {/* Bio snippet */}
      <p className="text-xs text-slate-300 leading-relaxed line-clamp-2">
        {candidate.bio || 'Hacker proficient in AI algorithms, web architecture, and smart contract innovation.'}
      </p>

      {/* Skill Pills */}
      <div className="flex flex-wrap gap-1.5 pt-1">
        {Array.isArray(candidate.skills) && candidate.skills.slice(0, 5).map((skill) => (
          <span key={skill} className="px-2.5 py-1 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 font-mono text-[10px] font-bold">
            {skill}
          </span>
        ))}
        {Array.isArray(candidate.skills) && candidate.skills.length > 5 && (
          <span className="px-2 py-1 rounded-lg bg-white/5 border border-white/10 text-slate-400 font-mono text-[10px]">
            +{candidate.skills.length - 5}
          </span>
        )}
      </div>

      {/* Footer Social & Action Buttons */}
      <div className="pt-3 border-t border-white/10 flex items-center justify-between gap-2 font-mono text-xs">
        <div className="flex items-center gap-2">
          {candidate.github_url && (
            <a href={candidate.github_url} target="_blank" rel="noopener noreferrer" className="p-2 rounded-xl bg-white/5 border border-white/10 text-slate-300 hover:text-white hover:bg-white/10">
              <Github className="w-4 h-4" />
            </a>
          )}
          {candidate.linkedin_url && (
            <a href={candidate.linkedin_url} target="_blank" rel="noopener noreferrer" className="p-2 rounded-xl bg-white/5 border border-white/10 text-cyan-400 hover:bg-cyan-500/10">
              <Linkedin className="w-4 h-4" />
            </a>
          )}
        </div>

        <div className="flex items-center gap-2">
          {onDownloadResume && (
            <button
              onClick={() => onDownloadResume(candidate)}
              className="px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-slate-300 hover:text-white hover:bg-white/10 font-bold flex items-center gap-1 cursor-pointer"
              title="Download ATS Resume"
            >
              <Download className="w-3.5 h-3.5 text-cyan-400" /> Resume
            </button>
          )}

          <button
            onClick={() => onViewPortfolio(candidate.username)}
            className="px-4 py-2 rounded-xl neon-button text-white font-bold flex items-center gap-1 cursor-pointer"
          >
            <span>Portfolio</span> <ExternalLink className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default PortfolioCard;

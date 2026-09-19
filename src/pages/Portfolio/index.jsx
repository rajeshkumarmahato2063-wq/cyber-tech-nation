import React, { useState } from 'react';
import { Github, Linkedin, ExternalLink, Download, Share2, Sparkles, Trophy, Award, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import usePortfolio from '../../hooks/usePortfolio';
import BadgeGrid from '../../components/BadgeGrid';
import SkillChart from '../../components/SkillChart';
import ConnectionButton from '../../components/ConnectionButton';
import { resumeService } from '../../services/resume';

const PortfolioPage = ({ username = 'rajesh-mahato', currentUser, onOpenChat }) => {
  const { portfolio, recommendations, loading } = usePortfolio(username);
  const [theme, setTheme] = useState('cyber');
  const [copied, setCopied] = useState(false);

  if (loading) {
    return (
      <div className="min-h-screen pt-32 pb-20 px-6 text-center font-mono text-cyan-400 text-sm animate-pulse">
        Loading participant portfolio...
      </div>
    );
  }

  const p = portfolio || {
    username: 'rajesh-mahato',
    full_name: 'Rajesh Kumar Mahato',
    headline: 'Lead AI Engineer & Full-Stack Architect',
    bio: 'Passionate developer building autonomous AI agents and scalable cloud architectures.',
    college: 'Institute of Engineering & Technology',
    department: 'Computer Science & AI',
    profile_photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    github_url: 'https://github.com/rajeshkumarmahato2063-wq',
    linkedin_url: 'https://linkedin.com/in/rajeshkumarmahato',
    skills: ['React', 'Node.js', 'Python', 'Agentic AI', 'Supabase', 'TypeScript', 'TailwindCSS'],
    badges: [],
    projects: [],
    certificates: []
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadResume = async () => {
    const resumeData = await resumeService.getUserResume(p.user_id);
    await resumeService.downloadResumePDF(resumeData);
  };

  return (
    <div className={`min-h-screen pt-28 pb-20 px-6 max-w-6xl mx-auto space-y-10 font-sans text-left transition-colors ${
      theme === 'emerald' ? 'theme-emerald' : theme === 'sunset' ? 'theme-sunset' : ''
    }`}>
      {/* Top Bar with Theme Switcher & Share */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-white/10 font-mono text-xs">
        <div className="flex items-center gap-2">
          <span className="text-slate-400 font-bold">PORTFOLIO THEME:</span>
          <button
            onClick={() => setTheme('cyber')}
            className={`px-3 py-1 rounded-xl font-bold cursor-pointer ${theme === 'cyber' ? 'bg-cyan-500 text-black' : 'bg-white/5 text-slate-300'}`}
          >
            Cyber Dark
          </button>
          <button
            onClick={() => setTheme('emerald')}
            className={`px-3 py-1 rounded-xl font-bold cursor-pointer ${theme === 'emerald' ? 'bg-emerald-500 text-black' : 'bg-white/5 text-slate-300'}`}
          >
            Emerald
          </button>
          <button
            onClick={() => setTheme('sunset')}
            className={`px-3 py-1 rounded-xl font-bold cursor-pointer ${theme === 'sunset' ? 'bg-amber-500 text-black' : 'bg-white/5 text-slate-300'}`}
          >
            Sunset
          </button>
        </div>

        <div className="flex items-center gap-3">
          {copied && (
            <span className="text-emerald-400 font-bold flex items-center gap-1">
              <CheckCircle className="w-3.5 h-3.5" /> URL Copied!
            </span>
          )}
          <button
            onClick={handleShare}
            className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-slate-300 hover:text-white hover:bg-white/10 font-bold flex items-center gap-1.5 cursor-pointer"
          >
            <Share2 className="w-4 h-4 text-cyan-400" /> Share Portfolio
          </button>

          <ConnectionButton
            currentUserId={currentUser?.id}
            targetUserId={p.user_id}
            onOpenChat={onOpenChat}
          />
        </div>
      </div>

      {/* Hero Profile Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-8 rounded-3xl bg-[#0B1120] border border-cyan-500/40 shadow-[0_0_50px_rgba(0,229,255,0.15)] flex flex-col md:flex-row items-center gap-8 relative overflow-hidden"
      >
        <div className="relative w-36 h-36 rounded-3xl overflow-hidden border-4 border-cyan-500/40 shrink-0 shadow-[0_0_30px_rgba(0,229,255,0.4)]">
          <img src={p.profile_photo} alt={p.full_name} className="w-full h-full object-cover" />
        </div>

        <div className="space-y-3 flex-1 text-center md:text-left">
          <div className="space-y-1">
            <span className="px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 font-mono text-xs font-bold uppercase tracking-wider">
              ⚡ Verified Hacker Portfolio
            </span>
            <h1 className="text-3xl sm:text-5xl font-extrabold font-mono text-white tracking-tight mt-1">{p.full_name}</h1>
            <p className="text-sm font-mono text-cyan-300 font-semibold">{p.headline}</p>
            <p className="text-xs text-slate-400 font-mono">{p.college} • {p.department}</p>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed max-w-2xl">{p.bio}</p>

          <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 pt-2 font-mono text-xs">
            {p.github_url && (
              <a href={p.github_url} target="_blank" rel="noopener noreferrer" className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-slate-300 hover:text-white flex items-center gap-1.5 font-bold">
                <Github className="w-4 h-4 text-cyan-400" /> GitHub Profile
              </a>
            )}
            {p.linkedin_url && (
              <a href={p.linkedin_url} target="_blank" rel="noopener noreferrer" className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-cyan-400 hover:bg-cyan-500/10 flex items-center gap-1.5 font-bold">
                <Linkedin className="w-4 h-4" /> LinkedIn
              </a>
            )}
            <button
              onClick={handleDownloadResume}
              className="px-4 py-2 rounded-xl neon-button text-white font-bold flex items-center gap-1.5 cursor-pointer shadow-[0_0_20px_rgba(0,229,255,0.3)]"
            >
              <Download className="w-4 h-4" /> Download ATS Resume
            </button>
          </div>
        </div>
      </motion.div>

      {/* Achievement Badges Grid */}
      <BadgeGrid badges={p.badges} />

      {/* Technical Skill Proficiency & AI Copilot */}
      <SkillChart skills={p.skills} recommendations={recommendations} />

      {/* Hackathon Projects Showcase */}
      <div className="space-y-4">
        <h3 className="text-xl font-bold font-mono text-white flex items-center gap-2">
          <Trophy className="w-5 h-5 text-amber-400" /> Hackathon Projects Showcase
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {p.projects?.map((proj, idx) => (
            <div key={idx} className="p-6 rounded-3xl bg-[#0B1120] border border-white/10 space-y-3 shadow-xl">
              <span className="text-[10px] px-2.5 py-1 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 font-mono font-bold uppercase">
                {proj.domain}
              </span>
              <h4 className="text-xl font-bold font-mono text-white">{proj.title}</h4>
              <p className="text-xs text-slate-400 leading-relaxed">{proj.description}</p>
              {proj.link && (
                <a href={proj.link} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-xs font-mono text-cyan-400 hover:underline font-bold">
                  View Repository <ExternalLink className="w-3.5 h-3.5" />
                </a>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PortfolioPage;

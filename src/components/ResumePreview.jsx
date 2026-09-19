import React from 'react';
import { Download, FileText, CheckCircle2 } from 'lucide-react';

const ResumePreview = ({ resumeData, onDownloadPDF, templateId = 'modern_cyber' }) => {
  if (!resumeData) return null;

  return (
    <div className="p-8 rounded-3xl bg-[#070C1A] border border-cyan-500/40 shadow-[0_0_50px_rgba(0,229,255,0.15)] font-sans space-y-6 text-left max-w-3xl mx-auto">
      {/* Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-cyan-500/30 font-mono">
        <div>
          <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 uppercase font-bold">
            ATS-Optimized Template: {templateId.replace('_', ' ')}
          </span>
          <h2 className="text-2xl font-bold text-white mt-1">{resumeData.name || 'Candidate Name'}</h2>
          <p className="text-xs text-slate-400">{resumeData.email} • {resumeData.phone} • {resumeData.college}</p>
        </div>

        <button
          onClick={onDownloadPDF}
          className="neon-button px-5 py-2.5 rounded-xl font-mono text-xs font-bold uppercase text-white flex items-center gap-2 cursor-pointer shadow-[0_0_20px_rgba(0,229,255,0.3)]"
        >
          <Download className="w-4 h-4" /> Download Resume PDF
        </button>
      </div>

      {/* Summary */}
      <div className="space-y-1">
        <h4 className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider">Professional Summary</h4>
        <p className="text-xs text-slate-300 leading-relaxed bg-white/5 p-3 rounded-xl border border-white/5">
          {resumeData.summary}
        </p>
      </div>

      {/* Skills */}
      <div className="space-y-2">
        <h4 className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider">Technical Skills</h4>
        <div className="flex flex-wrap gap-1.5 font-mono text-xs">
          {Array.isArray(resumeData.skills) && resumeData.skills.map((skill) => (
            <span key={skill} className="px-2.5 py-1 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-[11px] font-semibold">
              {skill}
            </span>
          ))}
        </div>
      </div>

      {/* Experience & Hackathons */}
      <div className="space-y-3">
        <h4 className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider">Experience & Hackathon Sprints</h4>
        {Array.isArray(resumeData.experience) && resumeData.experience.map((exp, idx) => (
          <div key={idx} className="p-3.5 rounded-2xl bg-white/5 border border-white/10 space-y-1 text-xs">
            <div className="flex items-center justify-between font-mono">
              <span className="font-bold text-white">{exp.role} — <span className="text-cyan-300">{exp.company}</span></span>
              <span className="text-slate-400 text-[10px]">{exp.duration}</span>
            </div>
            <p className="text-slate-300 text-[11px] leading-relaxed">{exp.details}</p>
          </div>
        ))}
      </div>

      {/* Key Projects */}
      <div className="space-y-3">
        <h4 className="text-xs font-mono font-bold text-purple-400 uppercase tracking-wider">Key Projects</h4>
        {Array.isArray(resumeData.projects) && resumeData.projects.map((proj, idx) => (
          <div key={idx} className="p-3.5 rounded-2xl bg-white/5 border border-white/10 space-y-1 text-xs">
            <div className="font-bold text-white font-mono">{proj.title}</div>
            <div className="text-[10px] text-cyan-400 font-mono">Stack: {proj.technologies}</div>
            <p className="text-slate-300 text-[11px] leading-relaxed">{proj.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ResumePreview;

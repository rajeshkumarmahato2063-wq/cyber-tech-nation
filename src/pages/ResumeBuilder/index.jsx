import React, { useState, useEffect } from 'react';
import { Sparkles, Download, RefreshCw, FileText, CheckCircle, Wand2, Layers } from 'lucide-react';
import { resumeService, RESUME_TEMPLATES } from '../../services/resume';
import ResumePreview from '../../components/ResumePreview';

const ResumeBuilderPage = ({ user }) => {
  const [resumeData, setResumeData] = useState(null);
  const [selectedTemplate, setSelectedTemplate] = useState('modern_cyber');
  const [loading, setLoading] = useState(true);
  const [enhancingSection, setEnhancingSection] = useState(null);

  useEffect(() => {
    loadResume();
  }, [user]);

  const loadResume = async () => {
    setLoading(true);
    try {
      const data = await resumeService.getUserResume(user?.id);
      setResumeData(data);
    } catch (err) {
      console.warn('Resume load error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleEnhanceWithAI = (section) => {
    setEnhancingSection(section);
    setTimeout(() => {
      if (resumeData) {
        const enhanced = resumeService.enhanceContentWithAI(section, resumeData[section]);
        setResumeData(prev => ({ ...prev, [section]: enhanced }));
      }
      setEnhancingSection(null);
    }, 600);
  };

  const handleDownloadPDF = async () => {
    if (!resumeData) return;
    await resumeService.downloadResumePDF({ ...resumeData, template_id: selectedTemplate });
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-32 pb-20 px-6 text-center font-mono text-cyan-400 text-sm animate-pulse">
        Loading AI Resume Builder...
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-28 pb-20 px-6 max-w-7xl mx-auto space-y-10 font-sans text-left">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-white/10">
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-cyan-400 font-mono text-xs font-bold uppercase tracking-widest">
            <Sparkles className="w-4 h-4" /> AI Resume Generator
          </div>
          <h1 className="text-4xl sm:text-6xl font-extrabold font-mono text-white tracking-tight">
            ATS Resume Builder
          </h1>
          <p className="text-slate-400 text-sm max-w-xl">
            Auto-generate ATS-optimized engineering resumes, apply AI prompts, choose templates, and export PDF documents.
          </p>
        </div>

        <button
          onClick={handleDownloadPDF}
          className="neon-button px-8 py-3.5 rounded-2xl font-mono text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2 shrink-0 cursor-pointer shadow-[0_0_25px_rgba(0,229,255,0.4)]"
        >
          <Download className="w-4 h-4" /> Export Resume PDF
        </button>
      </div>

      {/* Template Selection Tabs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-mono text-xs">
        {RESUME_TEMPLATES.map((tmpl) => (
          <button
            key={tmpl.id}
            onClick={() => setSelectedTemplate(tmpl.id)}
            className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
              selectedTemplate === tmpl.id
                ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/50 shadow-[0_0_20px_rgba(0,229,255,0.2)]'
                : 'bg-white/5 border-white/10 text-slate-400 hover:text-white'
            }`}
          >
            <div className="font-bold text-white text-sm flex items-center justify-between">
              <span>{tmpl.name}</span>
              {selectedTemplate === tmpl.id && <CheckCircle className="w-4 h-4 text-cyan-400" />}
            </div>
            <p className="text-[11px] text-slate-400 mt-1">{tmpl.description}</p>
          </button>
        ))}
      </div>

      {/* Main Grid: Form Controls Left, Live Preview Right */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        {/* Left Form Controls */}
        <div className="p-6 rounded-3xl bg-[#0B1120] border border-white/10 space-y-6 font-mono text-xs">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <FileText className="w-4 h-4 text-cyan-400" /> Resume Editor
            </h3>
            <span className="text-[10px] text-slate-400">Auto-Synced from Profile</span>
          </div>

          {/* Candidate Name & Title */}
          <div className="space-y-3">
            <div>
              <label className="text-slate-400 block mb-1">Full Name</label>
              <input
                type="text"
                value={resumeData?.name || ''}
                onChange={(e) => setResumeData({ ...resumeData, name: e.target.value })}
                className="w-full bg-[#050816] border border-white/10 rounded-xl p-2.5 text-white"
              />
            </div>

            {/* AI Summary Enhancer */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-slate-400">Professional Summary</label>
                <button
                  type="button"
                  onClick={() => handleEnhanceWithAI('summary')}
                  className="px-2.5 py-1 rounded-lg bg-purple-500/20 text-purple-300 border border-purple-500/40 text-[10px] font-bold flex items-center gap-1 cursor-pointer"
                >
                  <Wand2 className="w-3 h-3" /> {enhancingSection === 'summary' ? 'Enhancing...' : 'Enhance with AI'}
                </button>
              </div>
              <textarea
                rows={4}
                value={resumeData?.summary || ''}
                onChange={(e) => setResumeData({ ...resumeData, summary: e.target.value })}
                className="w-full bg-[#050816] border border-white/10 rounded-xl p-2.5 text-white leading-relaxed"
              />
            </div>

            {/* Skills */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-slate-400">Technical Skills (Comma Separated)</label>
                <button
                  type="button"
                  onClick={() => handleEnhanceWithAI('skills')}
                  className="px-2.5 py-1 rounded-lg bg-purple-500/20 text-purple-300 border border-purple-500/40 text-[10px] font-bold flex items-center gap-1 cursor-pointer"
                >
                  <Wand2 className="w-3 h-3" /> {enhancingSection === 'skills' ? 'Enhancing...' : 'AI Skill Boost'}
                </button>
              </div>
              <input
                type="text"
                value={Array.isArray(resumeData?.skills) ? resumeData.skills.join(', ') : resumeData?.skills || ''}
                onChange={(e) => setResumeData({ ...resumeData, skills: e.target.value.split(',').map(s => s.trim()) })}
                className="w-full bg-[#050816] border border-white/10 rounded-xl p-2.5 text-white"
              />
            </div>
          </div>
        </div>

        {/* Right Live ATS Resume Preview */}
        <ResumePreview
          resumeData={resumeData}
          templateId={selectedTemplate}
          onDownloadPDF={handleDownloadPDF}
        />
      </div>
    </div>
  );
};

export default ResumeBuilderPage;

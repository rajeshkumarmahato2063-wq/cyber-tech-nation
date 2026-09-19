import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, User, GraduationCap, Briefcase, Code, Globe, Sparkles, Check } from 'lucide-react';

const SKILL_OPTIONS = ['React', 'AI', 'ML', 'Web3', 'UI/UX', 'Python', 'Java', 'Next.js', 'Solidity', 'TailwindCSS', 'Node.js', 'TypeScript', 'Flutter', 'DevOps'];
const DOMAIN_OPTIONS = ['AI / Machine Learning', 'Web3 & Fintech', 'Healthcare & Biotech', 'IoT & Cyber Security', 'EdTech', 'Open Innovation'];
const EXPERIENCE_OPTIONS = ['Beginner', 'Intermediate', 'Advanced', 'Lead'];
const AVAILABILITY_OPTIONS = ['Full-time', 'Part-time', 'Evenings', 'Weekends'];

const CreateProfileModal = ({ isOpen, onClose, existingProfile, onSave, user }) => {
  const [formData, setFormData] = useState({
    full_name: '',
    photo_url: '',
    college: '',
    department: '',
    year: '3rd Year',
    experience: 'Intermediate',
    looking_for: 'Either',
    availability: 'Full-time',
    preferred_domain: 'AI / Machine Learning',
    short_bio: '',
    github_url: '',
    linkedin_url: '',
    portfolio_url: '',
    skills: ['React', 'AI'],
    languages: ['English', 'Hindi']
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (existingProfile) {
      setFormData(existingProfile);
    } else if (user) {
      setFormData(prev => ({
        ...prev,
        full_name: user.profile?.full_name || user.email?.split('@')[0] || '',
        photo_url: user.profile?.avatar_url || ''
      }));
    }
  }, [existingProfile, user]);

  if (!isOpen) return null;

  const toggleSkill = (sk) => {
    setFormData(prev => {
      const skills = prev.skills || [];
      if (skills.includes(sk)) {
        return { ...prev, skills: skills.filter(s => s !== sk) };
      } else {
        return { ...prev, skills: [...skills, sk] };
      }
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await onSave({
        ...formData,
        user_id: user?.id || 'u1'
      });
      onClose();
    } catch (err) {
      console.error('Save profile error:', err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="glass-card rounded-2xl border border-white/10 w-full max-w-2xl p-6 relative shadow-2xl my-8"
        >
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2 mb-6">
            <Sparkles className="w-6 h-6 text-cyan-400" />
            <div>
              <h3 className="font-title font-bold text-xl text-white">
                {existingProfile ? 'Edit Your Match Profile' : 'Create Team Match Profile'}
              </h3>
              <p className="text-xs font-mono text-slate-400">
                Let fellow hackathon participants discover your skills and domain interests.
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Grid 1: Basic Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-mono text-slate-300 mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  value={formData.full_name}
                  onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                  placeholder="e.g. Rajesh Mahato"
                  className="cyber-input py-2 text-xs font-sans"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-300 mb-1">Profile Photo URL</label>
                <input
                  type="url"
                  value={formData.photo_url}
                  onChange={(e) => setFormData({ ...formData, photo_url: e.target.value })}
                  placeholder="https://images.unsplash.com/..."
                  className="cyber-input py-2 text-xs font-sans"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-300 mb-1">College / University *</label>
                <input
                  type="text"
                  required
                  value={formData.college}
                  onChange={(e) => setFormData({ ...formData, college: e.target.value })}
                  placeholder="e.g. IIT Bombay"
                  className="cyber-input py-2 text-xs font-sans"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-300 mb-1">Department</label>
                <input
                  type="text"
                  value={formData.department}
                  onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                  placeholder="e.g. Computer Science"
                  className="cyber-input py-2 text-xs font-sans"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-300 mb-1">Year of Study</label>
                <select
                  value={formData.year}
                  onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                  className="cyber-input py-2 text-xs font-sans bg-[#0B1120]"
                >
                  <option value="1st Year">1st Year</option>
                  <option value="2nd Year">2nd Year</option>
                  <option value="3rd Year">3rd Year</option>
                  <option value="4th Year">4th Year</option>
                  <option value="Postgraduate">Postgraduate</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-300 mb-1">Experience Level</label>
                <select
                  value={formData.experience}
                  onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                  className="cyber-input py-2 text-xs font-sans bg-[#0B1120]"
                >
                  {EXPERIENCE_OPTIONS.map(exp => (
                    <option key={exp} value={exp}>{exp}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Grid 2: Matching Preferences */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-mono text-slate-300 mb-1">Preferred Domain</label>
                <select
                  value={formData.preferred_domain}
                  onChange={(e) => setFormData({ ...formData, preferred_domain: e.target.value })}
                  className="cyber-input py-2 text-xs font-sans bg-[#0B1120]"
                >
                  {DOMAIN_OPTIONS.map(dom => (
                    <option key={dom} value={dom}>{dom}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-300 mb-1">Looking For</label>
                <select
                  value={formData.looking_for}
                  onChange={(e) => setFormData({ ...formData, looking_for: e.target.value })}
                  className="cyber-input py-2 text-xs font-sans bg-[#0B1120]"
                >
                  <option value="Team">Join a Team</option>
                  <option value="Members">Find Members</option>
                  <option value="Either">Either Team or Members</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-300 mb-1">Availability</label>
                <select
                  value={formData.availability}
                  onChange={(e) => setFormData({ ...formData, availability: e.target.value })}
                  className="cyber-input py-2 text-xs font-sans bg-[#0B1120]"
                >
                  {AVAILABILITY_OPTIONS.map(av => (
                    <option key={av} value={av}>{av}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Skills Selector */}
            <div>
              <label className="block text-xs font-mono text-slate-300 mb-1.5">
                Skills & Tech Stack (Select Multiple)
              </label>
              <div className="flex flex-wrap gap-1.5 p-3 rounded-xl bg-white/5 border border-white/10 max-h-32 overflow-y-auto">
                {SKILL_OPTIONS.map(sk => {
                  const selected = (formData.skills || []).includes(sk);
                  return (
                    <button
                      key={sk}
                      type="button"
                      onClick={() => toggleSkill(sk)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-mono flex items-center gap-1 transition-all cursor-pointer ${
                        selected
                          ? 'bg-cyan-500/20 border border-cyan-500/50 text-cyan-300 font-bold'
                          : 'bg-white/5 border border-white/10 text-slate-400 hover:text-white'
                      }`}
                    >
                      {selected && <Check className="w-3 h-3 text-cyan-400" />}
                      <span>{sk}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Short Bio */}
            <div>
              <label className="block text-xs font-mono text-slate-300 mb-1">Short Bio</label>
              <textarea
                rows={3}
                value={formData.short_bio}
                onChange={(e) => setFormData({ ...formData, short_bio: e.target.value })}
                placeholder="Share your hackathon passion, past projects, or ideal teammate persona..."
                className="cyber-input py-2 text-xs font-sans resize-none"
              />
            </div>

            {/* Social Links */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-mono text-slate-300 mb-1">GitHub URL</label>
                <input
                  type="url"
                  value={formData.github_url}
                  onChange={(e) => setFormData({ ...formData, github_url: e.target.value })}
                  placeholder="https://github.com/..."
                  className="cyber-input py-2 text-xs font-sans"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-300 mb-1">LinkedIn URL</label>
                <input
                  type="url"
                  value={formData.linkedin_url}
                  onChange={(e) => setFormData({ ...formData, linkedin_url: e.target.value })}
                  placeholder="https://linkedin.com/in/..."
                  className="cyber-input py-2 text-xs font-sans"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-300 mb-1">Portfolio URL</label>
                <input
                  type="url"
                  value={formData.portfolio_url}
                  onChange={(e) => setFormData({ ...formData, portfolio_url: e.target.value })}
                  placeholder="https://myportfolio.dev"
                  className="cyber-input py-2 text-xs font-sans"
                />
              </div>
            </div>

            {/* Submit Actions */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-mono text-slate-300"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="neon-button px-6 py-2 rounded-xl text-xs font-mono font-bold text-white flex items-center gap-1.5"
              >
                <Sparkles className="w-4 h-4" />
                <span>{submitting ? 'Saving Profile...' : 'Publish Match Profile'}</span>
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default CreateProfileModal;

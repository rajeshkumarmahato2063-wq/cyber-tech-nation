import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Shield, Plus, Check } from 'lucide-react';

const SKILL_OPTIONS = ['React', 'AI', 'ML', 'Web3', 'UI/UX', 'Python', 'Java', 'Next.js', 'Solidity', 'TailwindCSS', 'Node.js', 'TypeScript', 'Flutter', 'DevOps'];
const DOMAIN_OPTIONS = ['AI / Machine Learning', 'Web3 & Fintech', 'Healthcare & Biotech', 'IoT & Cyber Security', 'EdTech', 'Open Innovation'];

const CreateTeamModal = ({ isOpen, onClose, onCreateTeam, user }) => {
  const [teamName, setTeamName] = useState('');
  const [domain, setDomain] = useState('AI / Machine Learning');
  const [requiredSkills, setRequiredSkills] = useState(['Python', 'React']);
  const [maxMembers, setMaxMembers] = useState(4);
  const [description, setDescription] = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (!isOpen) return null;

  const toggleSkill = (sk) => {
    if (requiredSkills.includes(sk)) {
      setRequiredSkills(prev => prev.filter(s => s !== sk));
    } else {
      setRequiredSkills(prev => [...prev, sk]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await onCreateTeam({
        team_name: teamName,
        domain,
        required_skills: requiredSkills,
        max_members: parseInt(maxMembers, 10),
        description,
        leader_id: user?.id || 'u1',
        leader_name: user?.profile?.full_name || user?.email?.split('@')[0] || 'Team Leader',
        leader_photo: user?.profile?.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'
      });
      onClose();
    } catch (err) {
      console.error('Create team error:', err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="glass-card rounded-2xl border border-white/10 w-full max-w-lg p-6 relative shadow-2xl"
        >
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2 mb-4">
            <Shield className="w-6 h-6 text-purple-400" />
            <div>
              <h3 className="font-title font-bold text-xl text-white">Host an Open Team</h3>
              <p className="text-xs font-mono text-slate-400">
                Post your team listing so hackathon participants can apply to join.
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-mono text-slate-300 mb-1">Team Name *</label>
              <input
                type="text"
                required
                value={teamName}
                onChange={(e) => setTeamName(e.target.value)}
                placeholder="e.g. CyberDefenders Alpha"
                className="cyber-input py-2 text-xs font-sans"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-mono text-slate-300 mb-1">Innovation Domain</label>
                <select
                  value={domain}
                  onChange={(e) => setDomain(e.target.value)}
                  className="cyber-input py-2 text-xs font-sans bg-[#0B1120]"
                >
                  {DOMAIN_OPTIONS.map(d => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-300 mb-1">Max Team Size</label>
                <select
                  value={maxMembers}
                  onChange={(e) => setMaxMembers(e.target.value)}
                  className="cyber-input py-2 text-xs font-sans bg-[#0B1120]"
                >
                  <option value={2}>2 Members</option>
                  <option value={3}>3 Members</option>
                  <option value={4}>4 Members</option>
                  <option value={5}>5 Members</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono text-slate-300 mb-1.5">
                Required Teammate Skills
              </label>
              <div className="flex flex-wrap gap-1.5 p-2.5 rounded-xl bg-white/5 border border-white/10 max-h-28 overflow-y-auto">
                {SKILL_OPTIONS.map(sk => {
                  const selected = requiredSkills.includes(sk);
                  return (
                    <button
                      key={sk}
                      type="button"
                      onClick={() => toggleSkill(sk)}
                      className={`px-2 py-0.5 rounded-lg text-xs font-mono flex items-center gap-1 transition-all cursor-pointer ${
                        selected
                          ? 'bg-purple-500/20 border border-purple-500/50 text-purple-300 font-bold'
                          : 'bg-white/5 border border-white/10 text-slate-400'
                      }`}
                    >
                      {selected && <Check className="w-3 h-3 text-purple-400" />}
                      <span>{sk}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono text-slate-300 mb-1">Project Description / Vision</label>
              <textarea
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Briefly describe your project idea or what problem your team aims to solve..."
                className="cyber-input py-2 text-xs font-sans resize-none"
              />
            </div>

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
                <Plus className="w-4 h-4" />
                <span>{submitting ? 'Creating Team...' : 'Post Open Team'}</span>
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default CreateTeamModal;

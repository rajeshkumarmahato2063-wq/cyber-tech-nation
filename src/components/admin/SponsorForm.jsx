import React, { useState } from 'react';
import { Plus, Trash2, Award, ExternalLink, Image } from 'lucide-react';
import { sponsorService } from '../../services/sponsor';

/**
 * Sponsor Form & CRUD Manager Component
 */
const SponsorForm = ({ sponsors = [], onRefresh }) => {
  const [name, setName] = useState('');
  const [logoUrl, setLogoUrl] = useState('');
  const [website, setWebsite] = useState('');
  const [tier, setTier] = useState('Gold');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !logoUrl) return;

    setLoading(true);
    try {
      await sponsorService.addSponsor({ name, logoUrl, website, tier });
      setName('');
      setLogoUrl('');
      setWebsite('');
      setTier('Gold');
      if (onRefresh) onRefresh();
    } catch (err) {
      alert(`Add sponsor error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this sponsor entry?')) {
      try {
        await sponsorService.deleteSponsor(id);
        if (onRefresh) onRefresh();
      } catch (err) {
        alert(`Delete sponsor error: ${err.message}`);
      }
    }
  };

  return (
    <div className="space-y-6 font-mono text-xs">
      {/* Create Form */}
      <form onSubmit={handleSubmit} className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-4">
        <h4 className="text-sm font-bold text-cyan-400 flex items-center gap-2">
          <Award className="w-4 h-4" /> Add New Sponsor Partner
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-slate-300 mb-1 font-semibold">Sponsor Brand Name *</label>
            <input
              type="text"
              required
              placeholder="e.g. NextGen AI"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="cyber-input"
            />
          </div>

          <div>
            <label className="block text-slate-300 mb-1 font-semibold">Sponsor Tier *</label>
            <select value={tier} onChange={(e) => setTier(e.target.value)} className="cyber-input">
              <option value="Title">Title Sponsor</option>
              <option value="Platinum">Platinum</option>
              <option value="Gold">Gold</option>
              <option value="Silver">Silver</option>
              <option value="Community">Community Partner</option>
              <option value="Media">Media Partner</option>
            </select>
          </div>

          <div>
            <label className="block text-slate-300 mb-1 font-semibold">Logo Image URL *</label>
            <input
              type="url"
              required
              placeholder="https://example.com/logo.png"
              value={logoUrl}
              onChange={(e) => setLogoUrl(e.target.value)}
              className="cyber-input"
            />
          </div>

          <div>
            <label className="block text-slate-300 mb-1 font-semibold">Website Link (Optional)</label>
            <input
              type="url"
              placeholder="https://sponsorbrand.com"
              value={website}
              onChange={(e) => setWebsite(e.target.value)}
              className="cyber-input"
            />
          </div>
        </div>

        {/* Image Preview if provided */}
        {logoUrl && (
          <div className="p-3 rounded-xl bg-black/40 border border-white/10 flex items-center gap-3">
            <span className="text-slate-400 text-[10px]">Logo Preview:</span>
            <img src={logoUrl} alt="Preview" className="h-8 object-contain rounded-md" onError={(e) => (e.target.style.display = 'none')} />
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="px-6 py-2.5 rounded-xl bg-cyan-500 text-[#050816] font-bold text-xs uppercase tracking-wider flex items-center gap-2"
        >
          <Plus className="w-4 h-4" /> {loading ? 'Saving...' : 'Add Sponsor'}
        </button>
      </form>

      {/* Sponsors List */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {sponsors.map((s) => (
          <div key={s.id} className="p-4 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between">
            <div className="space-y-1">
              <div className="font-bold text-white text-sm flex items-center gap-2">
                {s.name}
                {s.website && (
                  <a href={s.website} target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-cyan-400">
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-300 font-bold border border-cyan-500/20">
                {s.tier}
              </span>
            </div>

            <button onClick={() => handleDelete(s.id)} className="p-2 text-rose-400 hover:bg-rose-500/20 rounded-xl transition-colors">
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SponsorForm;

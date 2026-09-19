import React, { useState, useEffect } from 'react';
import { Trophy, Award, Image, ShieldCheck, Sparkles, ExternalLink, Download } from 'lucide-react';
import { motion } from 'framer-motion';
import { archiveService } from '../../services/archive';

const EventArchivePage = () => {
  const [archivedEvents, setArchivedEvents] = useState([]);
  const [selectedEventId, setSelectedEventId] = useState(null);
  const [archiveDetails, setArchiveDetails] = useState(null);
  const [activeTab, setActiveTab] = useState('winners'); // 'winners' | 'gallery' | 'stats'
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadArchiveEvents();
  }, []);

  const loadArchiveEvents = async () => {
    setLoading(true);
    try {
      const list = await archiveService.getArchivedEvents();
      setArchivedEvents(list);
      if (list.length > 0) {
        setSelectedEventId(list[0].id);
        const details = await archiveService.getArchiveDetails(list[0].id);
        setArchiveDetails(details);
      }
    } catch (err) {
      console.warn('Archive load error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectEvent = async (id) => {
    setSelectedEventId(id);
    const details = await archiveService.getArchiveDetails(id);
    setArchiveDetails(details);
  };

  return (
    <div className="min-h-screen pt-28 pb-20 px-6 max-w-7xl mx-auto space-y-10 font-sans text-left">
      {/* Header Title */}
      <div className="space-y-3 pb-6 border-b border-white/10">
        <div className="flex items-center gap-2 text-cyan-400 font-mono text-xs font-bold uppercase tracking-widest">
          <Sparkles className="w-4 h-4" /> Legacy Hall of Fame
        </div>
        <h1 className="text-4xl sm:text-6xl font-extrabold font-mono text-white tracking-tight">
          Event Archive & Winners
        </h1>
        <p className="text-slate-400 text-sm max-w-2xl">
          Explore past ZayaThon hackathons, award-winning project submissions, photo galleries, and verified participant certificates.
        </p>
      </div>

      {/* Archived Events Switcher Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 font-mono text-xs">
        {archivedEvents.map((evt) => (
          <button
            key={evt.id}
            onClick={() => handleSelectEvent(evt.id)}
            className={`px-5 py-2.5 rounded-2xl transition-all whitespace-nowrap cursor-pointer font-bold ${
              selectedEventId === evt.id
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-[0_0_20px_rgba(0,229,255,0.25)]'
                : 'bg-white/5 border border-white/10 text-slate-400 hover:text-white'
            }`}
          >
            🏆 {evt.name}
          </button>
        ))}
      </div>

      {/* Archive Detail View Tabs */}
      <div className="flex items-center gap-2 bg-[#0B1120] p-1.5 rounded-2xl border border-white/10 max-w-md font-mono text-xs">
        <button
          onClick={() => setActiveTab('winners')}
          className={`flex-1 py-2 rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
            activeTab === 'winners' ? 'bg-cyan-500/20 text-cyan-400 font-bold border border-cyan-500/30' : 'text-slate-400 hover:text-white'
          }`}
        >
          <Trophy className="w-3.5 h-3.5" /> Hall of Winners
        </button>
        <button
          onClick={() => setActiveTab('gallery')}
          className={`flex-1 py-2 rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
            activeTab === 'gallery' ? 'bg-cyan-500/20 text-cyan-400 font-bold border border-cyan-500/30' : 'text-slate-400 hover:text-white'
          }`}
        >
          <Image className="w-3.5 h-3.5" /> Photo Gallery
        </button>
        <button
          onClick={() => setActiveTab('stats')}
          className={`flex-1 py-2 rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
            activeTab === 'stats' ? 'bg-cyan-500/20 text-cyan-400 font-bold border border-cyan-500/30' : 'text-slate-400 hover:text-white'
          }`}
        >
          <ShieldCheck className="w-3.5 h-3.5" /> Highlights
        </button>
      </div>

      {/* 1. WINNERS TAB */}
      {activeTab === 'winners' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 font-sans">
          {archiveDetails?.winners?.map((w, idx) => (
            <motion.div
              key={w.team_name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="p-6 rounded-3xl bg-[#0B1120] border border-cyan-500/30 shadow-[0_10px_30px_rgba(0,0,0,0.5)] space-y-4 flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="px-3 py-1 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/40 text-xs font-mono font-bold">
                    🥇 {w.rank}
                  </span>
                  <span className="text-xs font-mono font-bold text-cyan-400">{w.prize}</span>
                </div>

                <h3 className="text-2xl font-bold font-mono text-white">{w.team_name}</h3>
                <p className="text-xs font-semibold text-cyan-300">{w.project_title}</p>
                <div className="text-[11px] font-mono text-purple-400">{w.domain}</div>

                <div className="space-y-1.5 pt-2 border-t border-white/10 text-xs text-slate-300 font-mono">
                  <span className="text-slate-400 text-[10px] block">ROSTER:</span>
                  {w.members.map((m) => (
                    <div key={m} className="flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" /> {m}
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* 2. PHOTO GALLERY TAB */}
      {activeTab === 'gallery' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 pt-4 font-sans">
          {archiveDetails?.gallery?.map((img) => (
            <motion.div
              key={img.id}
              whileHover={{ scale: 1.02 }}
              className="group relative rounded-3xl overflow-hidden bg-[#0B1120] border border-white/10 space-y-2 shadow-xl"
            >
              <img src={img.image_url} alt={img.title} className="w-full h-56 object-cover group-hover:scale-105 transition-transform duration-500" />
              <div className="p-4 space-y-1">
                <div className="text-xs font-mono font-bold text-cyan-400">{img.category}</div>
                <h4 className="font-bold text-white text-sm">{img.title}</h4>
                <p className="text-slate-400 text-xs leading-relaxed">{img.caption}</p>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* 3. HIGHLIGHTS & STATS TAB */}
      {activeTab === 'stats' && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 font-mono text-center">
          <div className="p-6 rounded-3xl bg-[#0B1120] border border-cyan-500/30 space-y-2">
            <div className="text-3xl font-extrabold text-white">{archiveDetails?.stats?.total_participants}</div>
            <div className="text-xs text-slate-400">Total Hackers</div>
          </div>
          <div className="p-6 rounded-3xl bg-[#0B1120] border border-cyan-500/30 space-y-2">
            <div className="text-3xl font-extrabold text-cyan-400">{archiveDetails?.stats?.total_projects_submitted}</div>
            <div className="text-xs text-slate-400">Projects Built</div>
          </div>
          <div className="p-6 rounded-3xl bg-[#0B1120] border border-cyan-500/30 space-y-2">
            <div className="text-3xl font-extrabold text-amber-400">{archiveDetails?.stats?.total_prizes_distributed}</div>
            <div className="text-xs text-slate-400">Prizes Distributed</div>
          </div>
          <div className="p-6 rounded-3xl bg-[#0B1120] border border-cyan-500/30 space-y-2">
            <div className="text-3xl font-extrabold text-purple-400">{archiveDetails?.stats?.certificates_issued}</div>
            <div className="text-xs text-slate-400">Certificates Issued</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EventArchivePage;

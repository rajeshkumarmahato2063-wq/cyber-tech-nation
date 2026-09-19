import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Copy, Archive, Globe, EyeOff, Calendar, MapPin, Trophy, Users, RefreshCw } from 'lucide-react';
import { eventService } from '../../services/events';

const EventsManager = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);

  const [form, setForm] = useState({
    name: '',
    theme: '',
    description: '',
    banner_image: '',
    start_date: '',
    end_date: '',
    registration_deadline: '',
    venue: '',
    prize_pool: '',
    max_teams: 100,
    status: 'draft'
  });

  useEffect(() => {
    loadEventsList();
  }, []);

  const loadEventsList = async () => {
    setLoading(true);
    try {
      const list = await eventService.getEvents('all');
      setEvents(list);
    } catch (err) {
      console.warn('Events load error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenCreate = () => {
    setEditingEvent(null);
    setForm({
      name: '',
      theme: 'AI & Software Innovation',
      description: '',
      banner_image: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1200&q=80',
      start_date: new Date().toISOString().slice(0, 16),
      end_date: new Date(Date.now() + 48 * 3600 * 1000).toISOString().slice(0, 16),
      registration_deadline: new Date(Date.now() + 24 * 3600 * 1000).toISOString().slice(0, 16),
      venue: 'Main Campus & Virtual',
      prize_pool: '$10,000 USD',
      max_teams: 100,
      status: 'draft'
    });
    setShowModal(true);
  };

  const handleOpenEdit = (evt) => {
    setEditingEvent(evt);
    setForm({
      name: evt.name,
      theme: evt.theme || '',
      description: evt.description || '',
      banner_image: evt.banner_image || '',
      start_date: evt.start_date ? new Date(evt.start_date).toISOString().slice(0, 16) : '',
      end_date: evt.end_date ? new Date(evt.end_date).toISOString().slice(0, 16) : '',
      registration_deadline: evt.registration_deadline ? new Date(evt.registration_deadline).toISOString().slice(0, 16) : '',
      venue: evt.venue || '',
      prize_pool: evt.prize_pool || '',
      max_teams: evt.max_teams || 100,
      status: evt.status || 'draft'
    });
    setShowModal(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      if (editingEvent) {
        await eventService.updateEvent(editingEvent.id, form);
      } else {
        await eventService.createEvent(form);
      }
      setShowModal(false);
      loadEventsList();
    } catch (err) {
      alert(`Save error: ${err.message}`);
    }
  };

  const handleTogglePublish = async (evt) => {
    const nextStatus = evt.status === 'published' || evt.status === 'live' ? 'draft' : 'published';
    try {
      await eventService.setPublishStatus(evt.id, nextStatus);
      loadEventsList();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleDuplicate = async (evt) => {
    try {
      await eventService.duplicateEvent(evt.slug, `${evt.name} Copy`);
      loadEventsList();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleArchive = async (evt) => {
    if (window.confirm(`Archive "${evt.name}"? Completed events remain visible in the archive.`)) {
      try {
        await eventService.archiveEvent(evt.id);
        loadEventsList();
      } catch (err) {
        alert(err.message);
      }
    }
  };

  return (
    <div className="space-y-4 font-mono text-xs text-left">
      {/* Top Header */}
      <div className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/10">
        <div>
          <h3 className="text-base font-bold text-white">Event & Hackathon Catalog</h3>
          <p className="text-slate-400 text-[11px]">Create new hackathons, publish/unpublish, duplicate templates & archive.</p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={loadEventsList}
            className="p-2 rounded-xl bg-white/5 border border-white/10 text-cyan-400 hover:bg-cyan-500/10"
            title="Refresh List"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>

          <button
            onClick={handleOpenCreate}
            className="px-4 py-2 rounded-xl bg-cyan-500 text-[#050816] font-bold flex items-center gap-1.5 shadow-[0_0_15px_rgba(0,229,255,0.3)] cursor-pointer"
          >
            <Plus className="w-4 h-4" /> Create Hackathon
          </button>
        </div>
      </div>

      {/* Events List Grid */}
      {loading ? (
        <div className="p-8 text-center text-slate-400">Loading platform events...</div>
      ) : events.length === 0 ? (
        <div className="p-8 text-center text-slate-400">No events found. Click Create Hackathon above.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {events.map((evt) => (
            <div key={evt.id} className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-3 relative">
              <div className="flex items-start justify-between">
                <div>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                    evt.status === 'live' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40' :
                    evt.status === 'published' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40' :
                    evt.status === 'completed' || evt.status === 'archived' ? 'bg-slate-500/20 text-slate-400' :
                    'bg-amber-500/20 text-amber-300'
                  }`}>
                    {evt.status}
                  </span>
                  <h4 className="font-bold text-white text-base mt-1">{evt.name}</h4>
                  <p className="text-cyan-400 text-xs">{evt.theme}</p>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => handleTogglePublish(evt)}
                    className="p-1.5 rounded-lg bg-white/5 text-cyan-400 hover:bg-cyan-500/10"
                    title={evt.status === 'published' ? 'Unpublish' : 'Publish'}
                  >
                    {evt.status === 'published' ? <EyeOff className="w-3.5 h-3.5" /> : <Globe className="w-3.5 h-3.5" />}
                  </button>
                  <button
                    onClick={() => handleOpenEdit(evt)}
                    className="p-1.5 rounded-lg bg-white/5 text-purple-400 hover:bg-purple-500/10"
                    title="Edit Event"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDuplicate(evt)}
                    className="p-1.5 rounded-lg bg-white/5 text-amber-400 hover:bg-amber-500/10"
                    title="Duplicate Template"
                  >
                    <Copy className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleArchive(evt)}
                    className="p-1.5 rounded-lg bg-white/5 text-slate-400 hover:bg-rose-500/10"
                    title="Archive Event"
                  >
                    <Archive className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <p className="text-slate-400 text-xs line-clamp-2">{evt.description}</p>

              <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-300 pt-2 border-t border-white/5">
                <div>Prize: <span className="text-white font-bold">{evt.prize_pool}</span></div>
                <div>Venue: <span className="text-white font-bold">{evt.venue}</span></div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal Form */}
      {showModal && (
        <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="w-full max-w-xl bg-[#0B1120] border border-cyan-500/40 rounded-3xl p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-bold text-white">
              {editingEvent ? 'Edit Hackathon Event' : 'Create New Hackathon Event'}
            </h3>

            <form onSubmit={handleSave} className="space-y-3">
              <div>
                <label className="text-slate-400 block mb-1">Event Name</label>
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full bg-[#050816] border border-white/10 rounded-xl p-2.5 text-white"
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Theme / Slogan</label>
                <input
                  type="text"
                  value={form.theme}
                  onChange={(e) => setForm({ ...form, theme: e.target.value })}
                  className="w-full bg-[#050816] border border-white/10 rounded-xl p-2.5 text-white"
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Description</label>
                <textarea
                  rows={3}
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className="w-full bg-[#050816] border border-white/10 rounded-xl p-2.5 text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-slate-400 block mb-1">Prize Pool</label>
                  <input
                    type="text"
                    value={form.prize_pool}
                    onChange={(e) => setForm({ ...form, prize_pool: e.target.value })}
                    className="w-full bg-[#050816] border border-white/10 rounded-xl p-2.5 text-white"
                  />
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">Max Teams</label>
                  <input
                    type="number"
                    value={form.max_teams}
                    onChange={(e) => setForm({ ...form, max_teams: e.target.value })}
                    className="w-full bg-[#050816] border border-white/10 rounded-xl p-2.5 text-white"
                  />
                </div>
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Venue / Platform</label>
                <input
                  type="text"
                  value={form.venue}
                  onChange={(e) => setForm({ ...form, venue: e.target.value })}
                  className="w-full bg-[#050816] border border-white/10 rounded-xl p-2.5 text-white"
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Banner Image URL</label>
                <input
                  type="text"
                  value={form.banner_image}
                  onChange={(e) => setForm({ ...form, banner_image: e.target.value })}
                  className="w-full bg-[#050816] border border-white/10 rounded-xl p-2.5 text-white"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 rounded-xl bg-white/5 text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-xl bg-cyan-500 text-[#050816] font-bold"
                >
                  Save Event
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default EventsManager;

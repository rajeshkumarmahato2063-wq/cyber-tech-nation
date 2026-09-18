import React, { useState, useEffect } from 'react';
import { Bell, Plus, Pin, Trash2, Edit3, Send } from 'lucide-react';
import { getAnnouncements, createAnnouncement, updateAnnouncement, deleteAnnouncement } from '../../services/announcements';

/**
 * Admin Announcements Management Panel
 */
const AnnouncementsManager = () => {
  const [list, setList] = useState([]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('General');
  const [isPinned, setIsPinned] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadList();
  }, []);

  const loadList = async () => {
    const data = await getAnnouncements();
    setList(data);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    setSubmitting(true);
    try {
      await createAnnouncement({
        title,
        content,
        category,
        is_pinned: isPinned
      });

      setTitle('');
      setContent('');
      setIsPinned(false);
      loadList();
    } catch (err) {
      alert(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleTogglePin = async (item) => {
    try {
      await updateAnnouncement(item.id, { is_pinned: !item.is_pinned });
      loadList();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this announcement notice?')) {
      try {
        await deleteAnnouncement(id);
        loadList();
      } catch (err) {
        alert(err.message);
      }
    }
  };

  return (
    <div className="space-y-6 font-mono text-xs">
      {/* Create Announcement Form */}
      <form onSubmit={handleSubmit} className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-4">
        <h3 className="text-sm font-bold text-cyan-400 flex items-center gap-2">
          <Bell className="w-4 h-4" /> Broadcast Event Announcement
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="sm:col-span-2">
            <input
              type="text"
              placeholder="Announcement Title..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="w-full bg-black/40 border border-white/12 rounded-xl px-4 py-2 text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-400"
            />
          </div>
          <div>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full bg-[#050816] border border-white/12 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-cyan-400"
            >
              <option value="General">General Notice</option>
              <option value="Schedule">Schedule Update</option>
              <option value="Rules">Rules & Guidelines</option>
              <option value="Urgent">Urgent Broadcast</option>
            </select>
          </div>
        </div>

        <div>
          <textarea
            placeholder="Write clear notice content for all hackathon participants..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={3}
            required
            className="w-full bg-black/40 border border-white/12 rounded-xl p-3 text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-400"
          />
        </div>

        <div className="flex items-center justify-between">
          <label className="flex items-center gap-2 text-slate-300 cursor-pointer">
            <input
              type="checkbox"
              checked={isPinned}
              onChange={(e) => setIsPinned(e.target.checked)}
              className="accent-cyan-400 rounded"
            />
            <span>Pin Announcement to Top</span>
          </label>

          <button
            type="submit"
            disabled={submitting}
            className="px-5 py-2 rounded-xl bg-cyan-500 text-[#050816] font-bold hover:bg-cyan-400 transition-all flex items-center gap-1.5 cursor-pointer shadow-[0_0_15px_rgba(0,229,255,0.3)]"
          >
            <Send className="w-4 h-4" /> Broadcast Notice
          </button>
        </div>
      </form>

      {/* Announcements Roster */}
      <div className="space-y-3">
        <h4 className="font-bold text-slate-300 text-sm">Published Announcements ({list.length})</h4>

        {list.length === 0 ? (
          <div className="p-6 text-center text-slate-500 rounded-2xl bg-white/5">No announcements published yet.</div>
        ) : (
          list.map((item) => (
            <div key={item.id} className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-white text-sm">{item.title}</span>
                  <span className="px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 text-[10px]">
                    {item.category}
                  </span>
                  {item.is_pinned && (
                    <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30 text-[10px]">
                      PINNED
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleTogglePin(item)}
                    className="p-1.5 rounded-lg bg-white/5 text-amber-400 hover:bg-white/10"
                    title="Toggle Pin"
                  >
                    <Pin className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="p-1.5 rounded-lg bg-rose-500/20 text-rose-400 hover:bg-rose-500/30"
                    title="Delete"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <p className="text-slate-300 text-xs leading-relaxed">{item.content}</p>
              <div className="text-[10px] text-slate-500">{new Date(item.created_at).toLocaleString()}</div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default AnnouncementsManager;

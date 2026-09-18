import React, { useState, useEffect } from 'react';
import { Image, Filter, Plus, X, Maximize2 } from 'lucide-react';
import { getGalleryImages, addGalleryImage } from '../services/liveOps';

/**
 * Event Photo Gallery & Highlights Component with Lightbox
 */
export default function EventGallery({ isAdmin = false }) {
  const [images, setImages] = useState([]);
  const [selectedFilter, setSelectedFilter] = useState('All');
  const [activeLightbox, setActiveLightbox] = useState(null);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [newImage, setNewImage] = useState({ title: '', image_url: '', category: 'Ceremony', caption: '' });

  useEffect(() => {
    loadGallery();
  }, []);

  const loadGallery = async () => {
    try {
      const data = await getGalleryImages();
      setImages(data);
    } catch (err) {
      console.warn('Gallery error:', err);
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!newImage.title || !newImage.image_url) return;
    try {
      await addGalleryImage(newImage);
      await loadGallery();
      setShowUploadModal(false);
      setNewImage({ title: '', image_url: '', category: 'Ceremony', caption: '' });
    } catch (err) {
      alert('Error uploading photo: ' + err.message);
    }
  };

  const categories = ['All', 'Ceremony', 'Hacking', 'Demos', 'Winners'];

  const filteredImages = selectedFilter === 'All'
    ? images
    : images.filter(img => img.category?.toLowerCase() === selectedFilter.toLowerCase());

  return (
    <div className="space-y-4 font-sans text-xs">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="text-sm font-bold text-white font-mono uppercase tracking-wider flex items-center gap-2">
            <Image className="w-4 h-4 text-cyan-400" /> Event Highlights Gallery
          </h3>
          <p className="text-[11px] text-slate-400">Captured moments from ZayaThon 2026 live streams</p>
        </div>

        <div className="flex items-center gap-2">
          {isAdmin && (
            <button
              onClick={() => setShowUploadModal(true)}
              className="px-3 py-1.5 rounded-xl bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 hover:bg-cyan-500/30 transition-all font-mono text-xs flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" /> Upload Photo
            </button>
          )}
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 font-mono text-[11px]">
        <Filter className="w-3.5 h-3.5 text-slate-400 shrink-0 mr-1" />
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedFilter(cat)}
            className={`px-3 py-1 rounded-xl border transition-all shrink-0 ${
              selectedFilter === cat
                ? 'bg-cyan-500/20 border-cyan-500/40 text-cyan-300 font-bold'
                : 'bg-white/5 border-white/10 text-slate-400 hover:text-white'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Photos Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {filteredImages.map((img) => (
          <div
            key={img.id}
            onClick={() => setActiveLightbox(img)}
            className="group relative rounded-2xl overflow-hidden border border-white/10 bg-black/40 cursor-pointer transition-all hover:border-cyan-500/50 hover:shadow-[0_0_20px_rgba(6,182,212,0.2)]"
          >
            <div className="aspect-video w-full overflow-hidden bg-slate-900">
              <img
                src={img.image_url}
                alt={img.title}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                loading="lazy"
              />
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-3 flex flex-col justify-end">
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-500/30 text-cyan-200 border border-cyan-500/40 w-max mb-1 uppercase">
                {img.category}
              </span>
              <div className="text-white font-bold text-xs flex items-center justify-between">
                <span>{img.title}</span>
                <Maximize2 className="w-3.5 h-3.5 text-cyan-400" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Lightbox Modal */}
      {activeLightbox && (
        <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
          <div className="relative max-w-4xl w-full bg-[#070C1A] border border-cyan-500/40 rounded-3xl overflow-hidden shadow-2xl p-4">
            <button
              onClick={() => setActiveLightbox(null)}
              className="absolute top-4 right-4 p-2 rounded-xl bg-black/60 border border-white/20 text-white hover:bg-white/20 z-10"
            >
              <X className="w-5 h-5" />
            </button>
            <img
              src={activeLightbox.image_url}
              alt={activeLightbox.title}
              className="w-full max-h-[75vh] object-contain rounded-xl"
            />
            <div className="p-4 space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 uppercase">
                  {activeLightbox.category}
                </span>
                <h4 className="text-base font-bold text-white">{activeLightbox.title}</h4>
              </div>
              {activeLightbox.caption && (
                <p className="text-xs text-slate-300">{activeLightbox.caption}</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <form onSubmit={handleUpload} className="w-full max-w-md bg-[#090E1A] border border-cyan-500/40 rounded-2xl p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h4 className="font-bold text-white text-sm">Upload Event Photo</h4>
              <button type="button" onClick={() => setShowUploadModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div>
              <label className="block text-slate-400 mb-1">Title</label>
              <input
                type="text"
                required
                value={newImage.title}
                onChange={(e) => setNewImage({ ...newImage, title: e.target.value })}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white"
                placeholder="e.g. Opening Ceremony Speech"
              />
            </div>
            <div>
              <label className="block text-slate-400 mb-1">Image URL</label>
              <input
                type="url"
                required
                value={newImage.image_url}
                onChange={(e) => setNewImage({ ...newImage, image_url: e.target.value })}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white"
                placeholder="https://..."
              />
            </div>
            <div>
              <label className="block text-slate-400 mb-1">Category</label>
              <select
                value={newImage.category}
                onChange={(e) => setNewImage({ ...newImage, category: e.target.value })}
                className="w-full bg-[#0B1120] border border-white/10 rounded-xl px-3 py-2 text-white"
              >
                <option value="Ceremony">Ceremony</option>
                <option value="Hacking">Hacking</option>
                <option value="Demos">Demos</option>
                <option value="Winners">Winners</option>
              </select>
            </div>
            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-cyan-500 text-black font-bold text-xs uppercase tracking-wider hover:bg-cyan-400 transition-all"
            >
              Upload Image
            </button>
          </form>
        </div>
      )}
    </div>
  );
}

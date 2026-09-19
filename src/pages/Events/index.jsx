import React, { useState } from 'react';
import { Search, LayoutGrid, List, Sparkles, Filter, PlusCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import useEvent from '../../hooks/useEvent';
import EventCard from '../../components/EventCard';

const EventsPage = ({ onViewEventDetails, onOpenRegister, onOpenCreateEvent, isAdminOrOrganizer }) => {
  const [layoutMode, setLayoutMode] = useState('grid'); // 'grid' | 'list'
  const { events, loading, statusFilter, setStatusFilter, searchTerm, setSearchTerm } = useEvent();

  const categories = [
    { label: 'All Hackathons', value: 'all' },
    { label: '⚡ Live Now', value: 'live' },
    { label: '🚀 Upcoming', value: 'published' },
    { label: '🏆 Completed', value: 'completed' }
  ];

  return (
    <div className="min-h-screen pt-28 pb-20 px-6 max-w-7xl mx-auto space-y-10 font-sans text-left">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-white/10">
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-cyan-400 font-mono text-xs font-bold uppercase tracking-widest">
            <Sparkles className="w-4 h-4" /> Multi-Event SaaS Platform
          </div>
          <h1 className="text-4xl sm:text-6xl font-extrabold font-mono text-white tracking-tight">
            Explore Hackathons
          </h1>
          <p className="text-slate-400 text-sm max-w-xl">
            Browse upcoming code sprints, participate in live innovation competitions, or view past winners.
          </p>
        </div>

        {/* Organizer / Admin Create Event Button */}
        {isAdminOrOrganizer && (
          <button
            onClick={onOpenCreateEvent}
            className="neon-button px-6 py-3 rounded-2xl font-mono text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2 shrink-0 cursor-pointer shadow-[0_0_25px_rgba(0,229,255,0.3)]"
          >
            <PlusCircle className="w-4 h-4" /> Create New Hackathon
          </button>
        )}
      </div>

      {/* Search & Filtering Control Bar */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-[#0B1120]/80 p-4 rounded-3xl border border-white/10 backdrop-blur-xl">
        {/* Category Filters */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 font-mono text-xs">
          {categories.map((cat) => (
            <button
              key={cat.value}
              onClick={() => setStatusFilter(cat.value)}
              className={`px-4 py-2 rounded-xl transition-all whitespace-nowrap cursor-pointer ${
                statusFilter === cat.value
                  ? 'bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/40 shadow-[0_0_15px_rgba(0,229,255,0.2)]'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Search Bar & Grid/List View Controls */}
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search hackathons..."
              className="w-full bg-[#050816] border border-white/10 rounded-2xl pl-10 pr-4 py-2 text-xs font-mono text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div className="flex items-center bg-[#050816] p-1 rounded-2xl border border-white/10 text-slate-400">
            <button
              onClick={() => setLayoutMode('grid')}
              className={`p-2 rounded-xl transition-all ${layoutMode === 'grid' ? 'bg-cyan-500/20 text-cyan-400' : 'hover:text-white'}`}
              title="Grid View"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setLayoutMode('list')}
              className={`p-2 rounded-xl transition-all ${layoutMode === 'list' ? 'bg-cyan-500/20 text-cyan-400' : 'hover:text-white'}`}
              title="List View"
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Events Grid / List Display */}
      {loading ? (
        <div className="py-20 text-center text-slate-400 font-mono text-sm animate-pulse">
          Loading hackathons...
        </div>
      ) : events.length === 0 ? (
        <div className="p-12 text-center rounded-3xl bg-white/5 border border-white/10 space-y-3">
          <Filter className="w-8 h-8 text-cyan-400 mx-auto" />
          <h3 className="text-lg font-bold text-white font-mono">No Hackathons Found</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            No events match your search or status filter. Try clearing filters or creating a new hackathon.
          </p>
        </div>
      ) : (
        <motion.div
          layout
          className={
            layoutMode === 'grid'
              ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
              : 'space-y-4'
          }
        >
          {events.map((event) => (
            <EventCard
              key={event.id}
              event={event}
              layout={layoutMode}
              onViewDetails={onViewEventDetails}
              onRegister={onOpenRegister}
            />
          ))}
        </motion.div>
      )}
    </div>
  );
};

export default EventsPage;

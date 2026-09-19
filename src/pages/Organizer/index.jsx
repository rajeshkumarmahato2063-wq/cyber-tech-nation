import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  Layers,
  Clock,
  CheckCircle,
  XCircle,
  Users,
  Bell,
  RefreshCw,
  PlusCircle,
  QrCode,
  FileCheck,
  Award,
  Copy
} from 'lucide-react';
import { motion } from 'framer-motion';
import { organizerService } from '../../services/organizer';
import { eventService } from '../../services/events';
import RegistrationTable from '../../components/admin/RegistrationTable';
import RegistrationModal from '../../components/admin/RegistrationModal';
import CheckInScanner from '../../components/admin/CheckInScanner';
import AnnouncementsManager from '../../components/admin/AnnouncementsManager';
import useAdmin from '../../hooks/useAdmin';

const OrganizerDashboardPage = ({ user }) => {
  const [assignedEvents, setAssignedEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [eventStats, setEventStats] = useState({
    totalRegistrations: 0,
    pendingRegistrations: 0,
    approvedRegistrations: 0,
    rejectedRegistrations: 0,
    totalTeams: 0,
    checkInsCount: 0,
    attendanceRate: '0%'
  });

  const [activeTab, setActiveTab] = useState('registrations'); // 'registrations' | 'checkin' | 'announcements' | 'settings'
  const [selectedReg, setSelectedReg] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const isAdmin = user?.profile?.role === 'admin';

  const {
    registrations,
    statusFilter,
    setStatusFilter,
    domainFilter,
    setDomainFilter,
    searchTerm,
    setSearchTerm,
    refreshAdminData,
    updateRegistrationStatus,
    deleteRegistration
  } = useAdmin();

  useEffect(() => {
    loadAssignedEvents();
  }, [user]);

  const loadAssignedEvents = async () => {
    setLoading(true);
    try {
      const eventsList = await organizerService.getAssignedEvents(user?.id, isAdmin);
      setAssignedEvents(eventsList);
      if (eventsList.length > 0) {
        setSelectedEvent(eventsList[0]);
        const stats = await organizerService.getEventStats(eventsList[0].id);
        setEventStats(stats);
      }
    } catch (err) {
      console.warn('Error loading assigned events:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectEvent = async (evt) => {
    setSelectedEvent(evt);
    const stats = await organizerService.getEventStats(evt.id);
    setEventStats(stats);
  };

  const handleDuplicate = async () => {
    if (!selectedEvent) return;
    try {
      const dup = await eventService.duplicateEvent(selectedEvent.slug, `${selectedEvent.name} Copy`);
      alert(`Event duplicated successfully as "${dup.name}"!`);
      loadAssignedEvents();
    } catch (err) {
      alert(err.message);
    }
  };

  const filteredRegistrations = registrations.filter(r =>
    !selectedEvent || !r.event_id || r.event_id === selectedEvent.id
  );

  return (
    <div className="min-h-screen pt-28 pb-20 px-6 max-w-7xl mx-auto space-y-8 font-sans text-left">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-3xl font-extrabold font-mono text-white flex items-center gap-2">
              Organizer Command Hub
              <span className="text-xs px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 font-semibold">
                Event Scoped
              </span>
            </h1>
            <p className="text-xs text-slate-400">Manage assigned hackathons, registrations, attendance, and live announcements.</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={loadAssignedEvents}
            className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-cyan-400 hover:bg-cyan-500/10 transition-all cursor-pointer"
            title="Refresh Data"
          >
            <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
          </button>

          {selectedEvent && (
            <button
              onClick={handleDuplicate}
              className="px-4 py-2.5 rounded-xl bg-purple-500/10 border border-purple-500/30 text-purple-300 hover:bg-purple-500/20 font-mono text-xs font-bold transition-all flex items-center gap-2 cursor-pointer"
            >
              <Copy className="w-4 h-4" /> Duplicate as Template
            </button>
          )}
        </div>
      </div>

      {/* Assigned Event Selector Bar */}
      <div className="p-4 rounded-3xl bg-[#0B1120] border border-cyan-500/30 space-y-3 font-mono">
        <span className="text-xs text-slate-400 font-bold uppercase tracking-wider block">SELECT ASSIGNED HACKATHON:</span>
        <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
          {assignedEvents.map((evt) => (
            <button
              key={evt.id}
              onClick={() => handleSelectEvent(evt)}
              className={`px-4 py-2 rounded-xl transition-all whitespace-nowrap cursor-pointer font-bold ${
                selectedEvent?.id === evt.id
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-[0_0_15px_rgba(0,229,255,0.2)]'
                  : 'bg-white/5 border border-white/10 text-slate-400 hover:text-white'
              }`}
            >
              🎯 {evt.name} ({evt.status})
            </button>
          ))}
        </div>
      </div>

      {/* Event Metrics Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 font-mono">
        <div className="p-4 rounded-2xl bg-[#0B1120] border border-cyan-500/30 space-y-1">
          <div className="text-xs text-slate-400">Total Regs</div>
          <div className="text-2xl font-bold text-white">{eventStats.totalRegistrations}</div>
        </div>

        <div className="p-4 rounded-2xl bg-[#0B1120] border border-yellow-500/30 space-y-1">
          <div className="text-xs text-yellow-400">Pending Review</div>
          <div className="text-2xl font-bold text-yellow-300">{eventStats.pendingRegistrations}</div>
        </div>

        <div className="p-4 rounded-2xl bg-[#0B1120] border border-emerald-500/30 space-y-1">
          <div className="text-xs text-emerald-400">Approved</div>
          <div className="text-2xl font-bold text-emerald-300">{eventStats.approvedRegistrations}</div>
        </div>

        <div className="p-4 rounded-2xl bg-[#0B1120] border border-rose-500/30 space-y-1">
          <div className="text-xs text-rose-400">Rejected</div>
          <div className="text-2xl font-bold text-rose-300">{eventStats.rejectedRegistrations}</div>
        </div>

        <div className="p-4 rounded-2xl bg-[#0B1120] border border-purple-500/30 space-y-1">
          <div className="text-xs text-purple-400">Total Teams</div>
          <div className="text-2xl font-bold text-purple-300">{eventStats.totalTeams}</div>
        </div>

        <div className="p-4 rounded-2xl bg-[#0B1120] border border-blue-500/30 space-y-1">
          <div className="text-xs text-blue-400">Attendance Rate</div>
          <div className="text-2xl font-bold text-blue-300">{eventStats.attendanceRate}</div>
        </div>
      </div>

      {/* Navigation Tab Bar */}
      <div className="flex items-center gap-2 bg-[#0B1120] p-1.5 rounded-2xl border border-white/10 max-w-xl font-mono text-xs">
        <button
          onClick={() => setActiveTab('registrations')}
          className={`flex-1 py-2 rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
            activeTab === 'registrations' ? 'bg-cyan-500/20 text-cyan-400 font-bold border border-cyan-500/30' : 'text-slate-400 hover:text-white'
          }`}
        >
          <FileCheck className="w-3.5 h-3.5" /> Registrations ({filteredRegistrations.length})
        </button>

        <button
          onClick={() => setActiveTab('checkin')}
          className={`flex-1 py-2 rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
            activeTab === 'checkin' ? 'bg-cyan-500/20 text-cyan-400 font-bold border border-cyan-500/30' : 'text-slate-400 hover:text-white'
          }`}
        >
          <QrCode className="w-3.5 h-3.5" /> Attendance Pass Scanner
        </button>

        <button
          onClick={() => setActiveTab('announcements')}
          className={`flex-1 py-2 rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
            activeTab === 'announcements' ? 'bg-cyan-500/20 text-cyan-400 font-bold border border-cyan-500/30' : 'text-slate-400 hover:text-white'
          }`}
        >
          <Bell className="w-3.5 h-3.5" /> Live Notices
        </button>
      </div>

      {/* Content View */}
      {activeTab === 'registrations' && (
        <RegistrationTable
          registrations={filteredRegistrations}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
          domainFilter={domainFilter}
          setDomainFilter={setDomainFilter}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          onInspect={(reg) => {
            setSelectedReg(reg);
            setIsModalOpen(true);
          }}
          onStatusUpdate={updateRegistrationStatus}
          onDelete={deleteRegistration}
        />
      )}

      {activeTab === 'checkin' && (
        <CheckInScanner registrations={filteredRegistrations} onRefresh={refreshAdminData} />
      )}

      {activeTab === 'announcements' && (
        <AnnouncementsManager />
      )}

      <RegistrationModal
        registration={selectedReg}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onStatusUpdate={updateRegistrationStatus}
      />
    </div>
  );
};

export default OrganizerDashboardPage;

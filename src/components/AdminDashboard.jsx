import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  ShieldAlert,
  Users,
  CheckCircle,
  XCircle,
  Clock,
  Layers,
  MessageSquare,
  Award,
  RefreshCw,
  Shield,
  UserCheck,
} from 'lucide-react';
import useAdmin from '../hooks/useAdmin';
import AdminSidebar from './admin/AdminSidebar';
import StatsCard from './admin/StatsCard';
import RegistrationTable from './admin/RegistrationTable';
import RegistrationModal from './admin/RegistrationModal';
import SponsorForm from './admin/SponsorForm';
import FAQEditor from './admin/FAQEditor';
import AnalyticsCharts from './admin/AnalyticsCharts';
import CheckInScanner from './admin/CheckInScanner';
import AnnouncementsManager from './admin/AnnouncementsManager';
import AuditLogsViewer from './admin/AuditLogsViewer';


/**
 * Organizer & Admin Command Center Modal Container
 */
const AdminDashboard = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'registrations' | 'teams' | 'users' | 'contacts' | 'faqs' | 'sponsors'
  const [selectedReg, setSelectedReg] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const {
    stats,
    analytics,
    registrations,
    teams,
    users,
    contacts,
    faqs,
    sponsors,
    loading,
    statusFilter,
    setStatusFilter,
    domainFilter,
    setDomainFilter,
    searchTerm,
    setSearchTerm,
    refreshAdminData,
    updateRegistrationStatus,
    deleteRegistration,
    updateUserRole,
    deleteUser,
  } = useAdmin();

  if (!isOpen) return null;

  const handleInspectReg = (reg) => {
    setSelectedReg(reg);
    setIsModalOpen(true);
  };

  const handleRoleChange = async (userId, currentRole) => {
    const nextRole = currentRole === 'admin' ? 'user' : 'admin';
    if (window.confirm(`Change role of user to "${nextRole}"?`)) {
      try {
        await updateUserRole(userId, nextRole);
      } catch (err) {
        alert(err.message);
      }
    }
  };

  const handleDeleteUserAccount = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user profile?')) {
      try {
        await deleteUser(userId);
      } catch (err) {
        alert(err.message);
      }
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="relative w-full max-w-6xl bg-[#070C1A] border border-cyan-500/40 rounded-3xl p-6 sm:p-8 shadow-[0_0_60px_rgba(0,229,255,0.2)] my-8 max-h-[90vh] flex flex-col font-sans"
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-5 border-b border-white/10 shrink-0">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
                <ShieldAlert className="w-7 h-7" />
              </div>
              <div>
                <h2 className="text-2xl font-bold font-mono tracking-tight text-white flex items-center gap-2">
                  ZAYATHON Command Center
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30 font-sans font-semibold">
                    Admin
                  </span>
                </h2>
                <p className="text-xs text-slate-400">Realtime registration tracking, team rosters & platform controls</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={refreshAdminData}
                className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-cyan-400 hover:bg-cyan-500/10 transition-all"
                title="Sync Live Data"
              >
                <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
              </button>
              <button
                onClick={onClose}
                className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-slate-400 hover:text-white hover:bg-white/10 transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Realtime Stats Metric Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 my-5 shrink-0">
            <StatsCard title="Total Regs" count={stats.totalRegistrations} icon={Layers} color="cyan" />
            <StatsCard title="Pending" count={stats.pendingRegistrations} icon={Clock} color="yellow" />
            <StatsCard title="Approved" count={stats.approvedRegistrations} icon={CheckCircle} color="emerald" />
            <StatsCard title="Rejected" count={stats.rejectedRegistrations} icon={XCircle} color="rose" />
            <StatsCard title="Total Teams" count={stats.totalTeams} icon={Users} color="purple" />
            <StatsCard title="Inquiries" count={stats.totalContacts} icon={MessageSquare} color="blue" />
          </div>

          {/* Navigation Tab Bar Component */}
          <AdminSidebar
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            counts={{
              registrations: registrations.length,
              teams: teams.length,
              users: users.length,
              contacts: contacts.length,
            }}
          />

          {/* Main Content Viewport */}
          <div className="flex-1 overflow-y-auto pt-4 pr-1 space-y-4">
            {/* 1. OVERVIEW & ANALYTICS TAB */}
            {activeTab === 'overview' && (
              <AnalyticsCharts analytics={analytics} stats={stats} />
            )}

            {/* 2. REGISTRATIONS DATA TABLE TAB */}
            {activeTab === 'registrations' && (
              <RegistrationTable
                registrations={registrations}
                statusFilter={statusFilter}
                setStatusFilter={setStatusFilter}
                domainFilter={domainFilter}
                setDomainFilter={setDomainFilter}
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                onInspect={handleInspectReg}
                onStatusUpdate={updateRegistrationStatus}
                onDelete={deleteRegistration}
              />
            )}

            {/* 3. EVENT CHECK-IN SCANNER TAB */}
            {activeTab === 'checkin' && (
              <CheckInScanner registrations={registrations} onRefresh={refreshAdminData} />
            )}

            {/* 4. ANNOUNCEMENTS BROADCAST TAB */}
            {activeTab === 'announcements' && (
              <AnnouncementsManager />
            )}

            {/* 5. AUDIT LOGS TRAIL TAB */}
            {activeTab === 'audit' && (
              <AuditLogsViewer />
            )}

            {/* 6. TEAMS ROSTER TAB */}
            {activeTab === 'teams' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-mono text-xs">
                {teams.length === 0 ? (
                  <div className="col-span-2 p-8 text-center text-slate-400">No teams created yet.</div>
                ) : (
                  teams.map((t) => (
                    <div key={t.id} className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-3">
                      <div className="flex items-center justify-between border-b border-white/10 pb-3">
                        <div>
                          <h4 className="font-bold text-white text-base">{t.team_name}</h4>
                          <p className="text-xs text-cyan-400">{t.college}</p>
                        </div>
                        <span className="text-[10px] px-2.5 py-1 rounded-full bg-cyan-500/10 text-cyan-300">
                          {t.team_members?.length || 0} Members
                        </span>
                      </div>

                      <div className="space-y-2">
                        <div className="text-slate-400 font-semibold">Roster:</div>
                        {t.team_members?.map((m) => (
                          <div key={m.id} className="p-2.5 rounded-xl bg-white/5 flex items-center justify-between">
                            <div>
                              <div className="font-semibold text-white">{m.full_name}</div>
                              <div className="text-slate-400 text-[11px]">{m.email} • {m.phone}</div>
                            </div>
                            <div className="text-purple-400 text-[11px]">{m.department} ({m.year})</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {/* 7. USERS MANAGEMENT TAB */}
            {activeTab === 'users' && (
              <div className="border border-white/10 rounded-2xl overflow-hidden bg-white/5 font-mono text-xs">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-white/5 border-b border-white/10 text-slate-300">
                      <th className="p-3.5">User Profile</th>
                      <th className="p-3.5">Email</th>
                      <th className="p-3.5">Role</th>
                      <th className="p-3.5">Joined Date</th>
                      <th className="p-3.5 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5 text-slate-300">
                    {users.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="p-8 text-center text-slate-400">No user profiles registered yet.</td>
                      </tr>
                    ) : (
                      users.map((u) => (
                        <tr key={u.id} className="hover:bg-white/5 transition-colors">
                          <td className="p-3.5 font-bold text-white">{u.full_name || 'Hacker User'}</td>
                          <td className="p-3.5 text-slate-300">{u.email}</td>
                          <td className="p-3.5">
                            <span
                              className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${
                                u.role === 'admin'
                                  ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40'
                                  : 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                              }`}
                            >
                              {u.role || 'user'}
                            </span>
                          </td>
                          <td className="p-3.5 text-slate-400">{new Date(u.created_at).toLocaleDateString()}</td>
                          <td className="p-3.5 text-right space-x-2">
                            <button
                              onClick={() => handleRoleChange(u.id, u.role)}
                              className="px-3 py-1.5 rounded-lg bg-white/5 text-cyan-400 hover:bg-cyan-500/20 transition-colors"
                              title="Toggle Role"
                            >
                              <UserCheck className="w-3.5 h-3.5 inline mr-1" /> Toggle Role
                            </button>
                            <button
                              onClick={() => handleDeleteUserAccount(u.id)}
                              className="px-2.5 py-1.5 rounded-lg bg-rose-500/20 text-rose-400 hover:bg-rose-500/30 transition-colors"
                              title="Delete Profile"
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            )}

            {/* 8. CONTACT INQUIRIES TAB */}
            {activeTab === 'contacts' && (
              <div className="space-y-3 font-mono text-xs">
                {contacts.length === 0 ? (
                  <div className="p-8 text-center text-slate-400">No contact messages received.</div>
                ) : (
                  contacts.map((c) => (
                    <div key={c.id} className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-white text-sm">{c.name} ({c.email})</span>
                        <span className="text-slate-500">{new Date(c.created_at).toLocaleString()}</span>
                      </div>
                      <div className="text-cyan-400 font-semibold">{c.subject}</div>
                      <p className="text-slate-300 leading-relaxed bg-black/30 p-3 rounded-xl">{c.message}</p>
                    </div>
                  ))
                )}
              </div>
            )}

            {/* 9. MANAGE FAQS TAB */}
            {activeTab === 'faqs' && (
              <FAQEditor faqs={faqs} onRefresh={refreshAdminData} />
            )}

            {/* 10. MANAGE SPONSORS TAB */}
            {activeTab === 'sponsors' && (
              <SponsorForm sponsors={sponsors} onRefresh={refreshAdminData} />
            )}
          </div>

          {/* Registration Details Inspector Modal */}
          <RegistrationModal
            registration={selectedReg}
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            onStatusUpdate={updateRegistrationStatus}
          />
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default AdminDashboard;

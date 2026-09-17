import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  ShieldAlert,
  Users,
  CheckCircle,
  XCircle,
  Clock,
  Layers,
  Search,
  MessageSquare,
  HelpCircle,
  Award,
  Trash2,
  Check,
  RefreshCw,
} from 'lucide-react';
import { adminService } from '../services/admin';
import { faqService } from '../services/faq';
import { sponsorService } from '../services/sponsor';
import { contactService } from '../services/contact';

const AdminDashboard = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState('registrations'); // 'registrations' | 'teams' | 'contacts' | 'faqs' | 'sponsors'
  const [stats, setStats] = useState({
    totalRegistrations: 0,
    pendingRegistrations: 0,
    approvedRegistrations: 0,
    rejectedRegistrations: 0,
    totalTeams: 0,
    totalContacts: 0,
  });
  const [registrations, setRegistrations] = useState([]);
  const [teams, setTeams] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [faqs, setFaqs] = useState([]);
  const [sponsors, setSponsors] = useState([]);
  const [loading, setLoading] = useState(false);

  // Filters & Search
  const [statusFilter, setStatusFilter] = useState('all');
  const [domainFilter, setDomainFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Forms
  const [newFaq, setNewFaq] = useState({ question: '', answer: '' });
  const [newSponsor, setNewSponsor] = useState({ name: '', logoUrl: '', website: '', tier: 'Gold' });

  useEffect(() => {
    if (isOpen) {
      loadData();
      const subscription = adminService.subscribeToAdminRealtime(() => {
        loadData();
      });
      return () => subscription.unsubscribe();
    }
  }, [isOpen, statusFilter, domainFilter, searchTerm]);

  const loadData = async () => {
    setLoading(true);
    try {
      const statsData = await adminService.getDashboardStats();
      setStats(statsData);

      const regRes = await adminService.getAllRegistrations({
        status: statusFilter,
        domain: domainFilter,
        search: searchTerm,
      });
      setRegistrations(regRes.registrations || regRes || []);

      const teamsData = await adminService.getAllTeams();
      setTeams(teamsData);

      const contactsData = await contactService.getContactMessages();
      setContacts(contactsData);

      const faqsData = await faqService.getFAQs();
      if (faqsData) setFaqs(faqsData);

      const sponsorsData = await sponsorService.getSponsors();
      if (sponsorsData) setSponsors(sponsorsData);
    } catch (err) {
      console.error('Error loading admin data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (id, status) => {
    try {
      await adminService.updateRegistrationStatus(id, status);
      loadData();
    } catch (err) {
      alert(`Status update failed: ${err.message}`);
    }
  };

  const handleDeleteReg = async (id) => {
    if (window.confirm('Are you sure you want to delete this registration entry?')) {
      try {
        await adminService.deleteRegistration(id);
        loadData();
      } catch (err) {
        alert(`Delete failed: ${err.message}`);
      }
    }
  };

  const handleAddFaq = async (e) => {
    e.preventDefault();
    if (!newFaq.question || !newFaq.answer) return;
    try {
      await faqService.addFAQ(newFaq);
      setNewFaq({ question: '', answer: '' });
      loadData();
    } catch (err) {
      alert(`Add FAQ failed: ${err.message}`);
    }
  };

  const handleDeleteFaq = async (id) => {
    try {
      await faqService.deleteFAQ(id);
      loadData();
    } catch (err) {
      alert(`Delete FAQ failed: ${err.message}`);
    }
  };

  const handleAddSponsor = async (e) => {
    e.preventDefault();
    if (!newSponsor.name || !newSponsor.logoUrl) return;
    try {
      await sponsorService.addSponsor(newSponsor);
      setNewSponsor({ name: '', logoUrl: '', website: '', tier: 'Gold' });
      loadData();
    } catch (err) {
      alert(`Add sponsor failed: ${err.message}`);
    }
  };

  const handleDeleteSponsor = async (id) => {
    try {
      await sponsorService.deleteSponsor(id);
      loadData();
    } catch (err) {
      alert(`Delete sponsor failed: ${err.message}`);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="relative w-full max-w-6xl bg-[#070C1A] border border-cyan-500/40 rounded-3xl p-6 sm:p-8 shadow-[0_0_60px_rgba(0,229,255,0.2)] my-8 max-h-[90vh] flex flex-col"
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-6 border-b border-white/10 shrink-0">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
                <ShieldAlert className="w-7 h-7" />
              </div>
              <div>
                <h2 className="text-2xl font-bold font-mono tracking-tight text-white flex items-center gap-2">
                  ZAYATHON Command Center
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30">
                    Admin
                  </span>
                </h2>
                <p className="text-xs text-slate-400">Manage registrations, teams, feedback, FAQs & Sponsors</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={loadData}
                className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-cyan-400 hover:bg-cyan-500/10 transition-all"
                title="Refresh Live Data"
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

          {/* Metric Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 my-6 shrink-0">
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
              <div className="text-slate-400 text-xs font-mono mb-1 flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-cyan-400" /> Total Regs
              </div>
              <div className="text-2xl font-bold text-white">{stats.totalRegistrations}</div>
            </div>

            <div className="p-4 rounded-2xl bg-yellow-500/10 border border-yellow-500/20">
              <div className="text-yellow-400 text-xs font-mono mb-1 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5" /> Pending
              </div>
              <div className="text-2xl font-bold text-yellow-300">{stats.pendingRegistrations}</div>
            </div>

            <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20">
              <div className="text-emerald-400 text-xs font-mono mb-1 flex items-center gap-1.5">
                <CheckCircle className="w-3.5 h-3.5" /> Approved
              </div>
              <div className="text-2xl font-bold text-emerald-300">{stats.approvedRegistrations}</div>
            </div>

            <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20">
              <div className="text-rose-400 text-xs font-mono mb-1 flex items-center gap-1.5">
                <XCircle className="w-3.5 h-3.5" /> Rejected
              </div>
              <div className="text-2xl font-bold text-rose-300">{stats.rejectedRegistrations}</div>
            </div>

            <div className="p-4 rounded-2xl bg-purple-500/10 border border-purple-500/20">
              <div className="text-purple-400 text-xs font-mono mb-1 flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5" /> Total Teams
              </div>
              <div className="text-2xl font-bold text-purple-300">{stats.totalTeams}</div>
            </div>

            <div className="p-4 rounded-2xl bg-blue-500/10 border border-blue-500/20">
              <div className="text-blue-400 text-xs font-mono mb-1 flex items-center gap-1.5">
                <MessageSquare className="w-3.5 h-3.5" /> Inquiries
              </div>
              <div className="text-2xl font-bold text-blue-300">{stats.totalContacts}</div>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex flex-wrap items-center gap-2 pb-4 border-b border-white/10 shrink-0">
            <button
              onClick={() => setActiveTab('registrations')}
              className={`px-4 py-2 rounded-xl text-xs font-mono font-semibold transition-all ${
                activeTab === 'registrations'
                  ? 'bg-cyan-500 text-[#050816] shadow-[0_0_15px_rgba(0,229,255,0.4)]'
                  : 'bg-white/5 text-slate-300 hover:bg-white/10'
              }`}
            >
              Registrations ({registrations.length})
            </button>
            <button
              onClick={() => setActiveTab('teams')}
              className={`px-4 py-2 rounded-xl text-xs font-mono font-semibold transition-all ${
                activeTab === 'teams'
                  ? 'bg-cyan-500 text-[#050816] shadow-[0_0_15px_rgba(0,229,255,0.4)]'
                  : 'bg-white/5 text-slate-300 hover:bg-white/10'
              }`}
            >
              Teams ({teams.length})
            </button>
            <button
              onClick={() => setActiveTab('contacts')}
              className={`px-4 py-2 rounded-xl text-xs font-mono font-semibold transition-all ${
                activeTab === 'contacts'
                  ? 'bg-cyan-500 text-[#050816] shadow-[0_0_15px_rgba(0,229,255,0.4)]'
                  : 'bg-white/5 text-slate-300 hover:bg-white/10'
              }`}
            >
              Contacts ({contacts.length})
            </button>
            <button
              onClick={() => setActiveTab('faqs')}
              className={`px-4 py-2 rounded-xl text-xs font-mono font-semibold transition-all ${
                activeTab === 'faqs'
                  ? 'bg-cyan-500 text-[#050816] shadow-[0_0_15px_rgba(0,229,255,0.4)]'
                  : 'bg-white/5 text-slate-300 hover:bg-white/10'
              }`}
            >
              Manage FAQs
            </button>
            <button
              onClick={() => setActiveTab('sponsors')}
              className={`px-4 py-2 rounded-xl text-xs font-mono font-semibold transition-all ${
                activeTab === 'sponsors'
                  ? 'bg-cyan-500 text-[#050816] shadow-[0_0_15px_rgba(0,229,255,0.4)]'
                  : 'bg-white/5 text-slate-300 hover:bg-white/10'
              }`}
            >
              Manage Sponsors
            </button>
          </div>

          {/* Tab Content */}
          <div className="flex-1 overflow-y-auto pt-4 space-y-4 pr-1">
            {/* 1. REGISTRATIONS TAB */}
            {activeTab === 'registrations' && (
              <div className="space-y-4">
                {/* Search & Filters */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="relative">
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Search project title..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="cyber-input pl-10"
                    />
                  </div>

                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="cyber-input"
                  >
                    <option value="all">Filter Status: All</option>
                    <option value="pending">Pending</option>
                    <option value="approved">Approved</option>
                    <option value="rejected">Rejected</option>
                  </select>

                  <select
                    value={domainFilter}
                    onChange={(e) => setDomainFilter(e.target.value)}
                    className="cyber-input"
                  >
                    <option value="all">Filter Track: All Domains</option>
                    <option value="AI & Machine Learning">AI & Machine Learning</option>
                    <option value="Web3 & Blockchain">Web3 & Blockchain</option>
                    <option value="Cybersecurity">Cybersecurity</option>
                    <option value="Cloud & DevOps">Cloud & DevOps</option>
                    <option value="IoT & Hardware">IoT & Hardware</option>
                  </select>
                </div>

                {/* Table */}
                <div className="border border-white/10 rounded-2xl overflow-hidden bg-white/5">
                  <table className="w-full text-left border-collapse text-xs font-mono">
                    <thead>
                      <tr className="bg-white/5 border-b border-white/10 text-slate-300">
                        <th className="p-3.5">Project & Track</th>
                        <th className="p-3.5">Team & College</th>
                        <th className="p-3.5">Files</th>
                        <th className="p-3.5">Status</th>
                        <th className="p-3.5 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5 text-slate-300">
                      {registrations.length === 0 ? (
                        <tr>
                          <td colSpan={5} className="p-8 text-center text-slate-400">
                            No registration records found.
                          </td>
                        </tr>
                      ) : (
                        registrations.map((reg) => (
                          <tr key={reg.id} className="hover:bg-white/5 transition-colors">
                            <td className="p-3.5">
                              <div className="font-bold text-white text-sm">{reg.project_title}</div>
                              <div className="text-[#00E5FF] text-[11px]">{reg.innovation_domain}</div>
                            </td>
                            <td className="p-3.5">
                              <div className="font-semibold text-slate-200">
                                {reg.teams?.team_name || 'Individual'}
                              </div>
                              <div className="text-slate-400 text-[11px]">{reg.teams?.college || 'N/A'}</div>
                            </td>
                            <td className="p-3.5 space-y-1">
                              {reg.proposal_url && (
                                <a
                                  href={reg.proposal_url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="block text-cyan-400 underline hover:text-cyan-300"
                                >
                                  📄 Proposal PDF
                                </a>
                              )}
                              {reg.ppt_url && (
                                <a
                                  href={reg.ppt_url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="block text-purple-400 underline hover:text-purple-300"
                                >
                                  📊 PPT Deck
                                </a>
                              )}
                              {!reg.proposal_url && !reg.ppt_url && (
                                <span className="text-slate-500">None</span>
                              )}
                            </td>
                            <td className="p-3.5">
                              <span
                                className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${
                                  reg.status === 'approved'
                                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                                    : reg.status === 'rejected'
                                    ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40'
                                    : 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/40'
                                }`}
                              >
                                {reg.status}
                              </span>
                            </td>
                            <td className="p-3.5 text-right space-x-1">
                              <button
                                onClick={() => handleStatusUpdate(reg.id, 'approved')}
                                className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 transition-colors"
                                title="Approve"
                              >
                                <Check className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleStatusUpdate(reg.id, 'rejected')}
                                className="p-1.5 rounded-lg bg-rose-500/20 text-rose-400 hover:bg-rose-500/30 transition-colors"
                                title="Reject"
                              >
                                <X className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleDeleteReg(reg.id)}
                                className="p-1.5 rounded-lg bg-white/5 text-slate-400 hover:text-rose-400 hover:bg-rose-500/20 transition-colors"
                                title="Delete Entry"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* 2. TEAMS TAB */}
            {activeTab === 'teams' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {teams.length === 0 ? (
                  <div className="col-span-2 p-8 text-center text-slate-400 font-mono">No teams created yet.</div>
                ) : (
                  teams.map((t) => (
                    <div key={t.id} className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-3">
                      <div className="flex items-center justify-between border-b border-white/10 pb-3">
                        <div>
                          <h4 className="font-bold text-white text-base">{t.team_name}</h4>
                          <p className="text-xs text-cyan-400">{t.college}</p>
                        </div>
                        <span className="text-[10px] px-2.5 py-1 rounded-full bg-cyan-500/10 text-cyan-300 font-mono">
                          {t.team_members?.length || 0} Members
                        </span>
                      </div>

                      <div className="space-y-2">
                        <div className="text-xs text-slate-400 font-mono font-semibold">Roster:</div>
                        {t.team_members?.map((m) => (
                          <div key={m.id} className="p-2.5 rounded-xl bg-white/5 text-xs font-mono flex items-center justify-between">
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

            {/* 3. CONTACTS TAB */}
            {activeTab === 'contacts' && (
              <div className="space-y-3">
                {contacts.length === 0 ? (
                  <div className="p-8 text-center text-slate-400 font-mono">No contact submissions yet.</div>
                ) : (
                  contacts.map((c) => (
                    <div key={c.id} className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2 text-xs font-mono">
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

            {/* 4. MANAGING FAQS TAB */}
            {activeTab === 'faqs' && (
              <div className="space-y-6">
                <form onSubmit={handleAddFaq} className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-3">
                  <h4 className="text-sm font-bold text-cyan-400 font-mono">Add New FAQ</h4>
                  <input
                    type="text"
                    placeholder="Question..."
                    value={newFaq.question}
                    onChange={(e) => setNewFaq({ ...newFaq, question: e.target.value })}
                    className="cyber-input"
                  />
                  <textarea
                    placeholder="Answer..."
                    rows={2}
                    value={newFaq.answer}
                    onChange={(e) => setNewFaq({ ...newFaq, answer: e.target.value })}
                    className="cyber-input"
                  />
                  <button type="submit" className="px-5 py-2.5 rounded-xl bg-cyan-500 text-[#050816] font-bold text-xs font-mono">
                    + Save FAQ
                  </button>
                </form>

                <div className="space-y-3">
                  {faqs.map((f) => (
                    <div key={f.id} className="p-4 rounded-2xl bg-white/5 border border-white/10 flex items-start justify-between text-xs font-mono">
                      <div className="space-y-1">
                        <div className="font-bold text-white">{f.question}</div>
                        <div className="text-slate-300">{f.answer}</div>
                      </div>
                      <button onClick={() => handleDeleteFaq(f.id)} className="text-rose-400 p-2 hover:bg-rose-500/20 rounded-lg">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 5. MANAGING SPONSORS TAB */}
            {activeTab === 'sponsors' && (
              <div className="space-y-6">
                <form onSubmit={handleAddSponsor} className="p-4 rounded-2xl bg-white/5 border border-white/10 grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <h4 className="col-span-2 text-sm font-bold text-cyan-400 font-mono">Add New Sponsor</h4>
                  <input
                    type="text"
                    placeholder="Sponsor Name"
                    value={newSponsor.name}
                    onChange={(e) => setNewSponsor({ ...newSponsor, name: e.target.value })}
                    className="cyber-input"
                  />
                  <input
                    type="url"
                    placeholder="Logo URL"
                    value={newSponsor.logoUrl}
                    onChange={(e) => setNewSponsor({ ...newSponsor, logoUrl: e.target.value })}
                    className="cyber-input"
                  />
                  <input
                    type="url"
                    placeholder="Website URL"
                    value={newSponsor.website}
                    onChange={(e) => setNewSponsor({ ...newSponsor, website: e.target.value })}
                    className="cyber-input"
                  />
                  <select
                    value={newSponsor.tier}
                    onChange={(e) => setNewSponsor({ ...newSponsor, tier: e.target.value })}
                    className="cyber-input"
                  >
                    <option value="Title">Title Sponsor</option>
                    <option value="Platinum">Platinum</option>
                    <option value="Gold">Gold</option>
                    <option value="Silver">Silver</option>
                    <option value="Community">Community</option>
                  </select>
                  <button type="submit" className="col-span-2 px-5 py-2.5 rounded-xl bg-cyan-500 text-[#050816] font-bold text-xs font-mono">
                    + Add Sponsor
                  </button>
                </form>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {sponsors.map((s) => (
                    <div key={s.id} className="p-3.5 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between text-xs font-mono">
                      <div>
                        <div className="font-bold text-white">{s.name}</div>
                        <div className="text-cyan-400 text-[10px]">{s.tier}</div>
                      </div>
                      <button onClick={() => handleDeleteSponsor(s.id)} className="text-rose-400 p-2 hover:bg-rose-500/20 rounded-lg">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default AdminDashboard;

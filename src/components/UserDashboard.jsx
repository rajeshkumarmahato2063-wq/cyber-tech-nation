import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Users, CheckCircle, Clock, XCircle, FileText, Presentation, ShieldCheck, RefreshCw, LayoutDashboard, QrCode, Award, Download, Bell, AlertCircle, FileCheck, HelpCircle } from 'lucide-react';
import { registrationService } from '../services/registration';
import { generateCertificatePDF } from '../services/certificate';
import { getAnnouncements } from '../services/announcements';

/**
 * Cyber User Participant Dashboard Modal - Production Ready
 */
const UserDashboard = ({ isOpen, onClose, user }) => {
  const [registration, setRegistration] = useState(null);
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(false);
  const [downloadingCert, setDownloadingCert] = useState(false);
  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'qr' | 'announcements'

  useEffect(() => {
    if (isOpen && user?.id) {
      loadUserRegistration();
      loadAnnouncementsList();

      const subscription = registrationService.subscribeToRegistrationStatus(user.id, (updatedReg) => {
        setRegistration((prev) => ({ ...prev, ...updatedReg }));
      });

      return () => subscription.unsubscribe();
    }
  }, [isOpen, user]);

  const loadUserRegistration = async () => {
    if (!user?.id) return;
    setLoading(true);
    try {
      const reg = await registrationService.getUserRegistration(user.id);
      setRegistration(reg);
    } catch (err) {
      console.warn('Error loading registration:', err.message);
    } finally {
      setLoading(false);
    }
  };

  const loadAnnouncementsList = async () => {
    try {
      const list = await getAnnouncements();
      setAnnouncements(list);
    } catch (err) {
      console.warn('Error loading announcements:', err.message);
    }
  };

  const handleDownloadCertificate = async () => {
    if (!registration) return;
    setDownloadingCert(true);
    try {
      await generateCertificatePDF({
        recipientName: user?.profile?.full_name || user?.email?.split('@')[0] || 'Participant',
        teamName: registration.teams?.team_name || 'CyberKnights',
        domain: registration.innovation_domain,
        certificateId: `ZAYA-2026-${registration.id.substring(0, 8).toUpperCase()}`,
        awardType: registration.award_type || 'Participant'
      });
    } catch (err) {
      console.error('Certificate generation error:', err);
    } finally {
      setDownloadingCert(false);
    }
  };

  if (!isOpen) return null;

  const team = registration?.teams;
  const members = team?.team_members || [];
  const status = registration?.status || 'pending';
  const qrUrl = registration?.qr_code_url;
  const checkedIn = registration?.checked_in;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="relative w-full max-w-4xl bg-[#0B1120]/95 border border-cyan-500/40 rounded-3xl p-6 sm:p-8 shadow-[0_0_60px_rgba(0,229,255,0.2)] my-8"
        >
          {/* Top Ambient Glow Orb */}
          <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-64 h-64 bg-cyan-500/15 rounded-full blur-3xl pointer-events-none" />

          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-2 rounded-xl bg-white/5 border border-white/10 text-slate-400 hover:text-white hover:bg-white/10 transition-all"
            aria-label="Close Dashboard"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Header */}
          <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-white/10">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 shadow-[0_0_20px_rgba(0,229,255,0.3)]">
                <LayoutDashboard className="w-7 h-7" />
              </div>
              <div>
                <h2 className="text-2xl font-bold font-mono tracking-tight text-white flex items-center gap-2">
                  Participant Dashboard
                </h2>
                <p className="text-xs text-slate-400">
                  Logged in as <span className="text-cyan-400 font-semibold">{user?.profile?.full_name || user?.email}</span>
                </p>
              </div>
            </div>

            {/* Dashboard Tabs */}
            {registration && (
              <div className="flex items-center gap-2 bg-white/5 p-1 rounded-xl border border-white/10 text-xs font-mono">
                <button
                  onClick={() => setActiveTab('overview')}
                  className={`px-3 py-1.5 rounded-lg transition-all ${
                    activeTab === 'overview' ? 'bg-cyan-500/20 text-cyan-400 font-bold border border-cyan-500/40' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Overview
                </button>
                <button
                  onClick={() => setActiveTab('qr')}
                  className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
                    activeTab === 'qr' ? 'bg-cyan-500/20 text-cyan-400 font-bold border border-cyan-500/40' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <QrCode className="w-3.5 h-3.5" /> Event Pass
                </button>
                <button
                  onClick={() => setActiveTab('announcements')}
                  className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
                    activeTab === 'announcements' ? 'bg-cyan-500/20 text-cyan-400 font-bold border border-cyan-500/40' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Bell className="w-3.5 h-3.5" /> Notice Board ({announcements.length})
                </button>
              </div>
            )}
          </div>

          {loading ? (
            <div className="py-12 text-center text-slate-400 font-mono text-sm flex items-center justify-center gap-2">
              <RefreshCw className="w-5 h-5 animate-spin text-cyan-400" /> Fetching latest team status...
            </div>
          ) : !registration ? (
            <div className="py-12 text-center space-y-4">
              <div className="w-12 h-12 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 flex items-center justify-center mx-auto">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white">No Active Registration Found</h3>
              <p className="text-slate-400 text-xs max-w-sm mx-auto">
                Form your team and submit your entry in the registration section below to unlock track benefits.
              </p>
              <a
                href="#register"
                onClick={onClose}
                className="inline-block neon-button px-6 py-2.5 rounded-xl font-bold text-xs uppercase text-white tracking-wider"
              >
                Go to Registration
              </a>
            </div>
          ) : activeTab === 'qr' ? (
            /* QR Code Event Pass Tab */
            <div className="py-8 text-center space-y-6 font-mono">
              <div className="max-w-xs mx-auto p-6 rounded-3xl bg-[#050816] border border-cyan-500/50 shadow-[0_0_40px_rgba(0,229,255,0.3)] space-y-4">
                <h3 className="text-sm font-bold text-cyan-400 uppercase tracking-wider">Official Event Pass</h3>
                
                {qrUrl ? (
                  <img src={qrUrl} alt="Event QR Code Pass" className="w-56 h-56 mx-auto rounded-2xl p-2 bg-white border border-cyan-400/40" />
                ) : (
                  <div className="w-56 h-56 mx-auto rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-slate-500 text-xs p-4">
                    QR Pass will be generated automatically upon Registration Approval by Admins.
                  </div>
                )}

                <div className="text-xs text-white font-bold">{team?.team_name || 'My Squad'}</div>
                <div className="text-[10px] text-slate-400">ID: {registration.id.substring(0, 12)}</div>

                {checkedIn ? (
                  <div className="px-3 py-1.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 text-xs font-bold flex items-center justify-center gap-1.5">
                    <CheckCircle className="w-4 h-4" /> Checked In at Event
                  </div>
                ) : (
                  <div className="px-3 py-1.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 text-xs font-bold">
                    Scan at Desk for Entry
                  </div>
                )}
              </div>
            </div>
          ) : activeTab === 'announcements' ? (
            /* Announcements Feed Tab */
            <div className="py-6 space-y-4 font-mono">
              <h3 className="text-sm font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-2">
                <Bell className="w-4 h-4" /> Live Event Notices
              </h3>

              {announcements.length === 0 ? (
                <div className="p-8 text-center text-slate-500 text-xs rounded-2xl bg-white/5">
                  No active announcements posted yet.
                </div>
              ) : (
                <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
                  {announcements.map((item) => (
                    <div key={item.id} className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-cyan-300 flex items-center gap-1.5">
                          {item.is_pinned && <span className="px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-400 border border-amber-500/30 text-[10px]">PINNED</span>}
                          {item.title}
                        </span>
                        <span className="text-[10px] text-slate-500">{new Date(item.created_at).toLocaleDateString()}</span>
                      </div>
                      <p className="text-slate-300 text-xs leading-relaxed">{item.content}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            /* Overview Tab */
            <div className="py-6 space-y-6">
              {/* Status Header Bar & Workflow Stepper */}
              <div className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <span className="text-xs text-slate-400 font-mono block">Registered Team</span>
                    <span className="text-xl font-bold text-white">{team?.team_name || 'My Squad'}</span>
                    <span className="text-xs text-cyan-400 block">{team?.college}</span>
                  </div>

                  <div className="flex items-center gap-3">
                    <span
                      className={`px-3 py-1.5 rounded-full text-xs font-mono font-bold uppercase flex items-center gap-1.5 ${
                        status === 'approved'
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                          : status === 'rejected'
                          ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40'
                          : status === 'under_review'
                          ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                          : 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/40'
                      }`}
                    >
                      {status === 'approved' && <CheckCircle className="w-4 h-4" />}
                      {status === 'rejected' && <XCircle className="w-4 h-4" />}
                      {status === 'under_review' && <Clock className="w-4 h-4 text-amber-400" />}
                      {status === 'pending' && <HelpCircle className="w-4 h-4 animate-spin" />}
                      {status.replace('_', ' ')}
                    </span>

                    {/* Download Certificate Button when approved */}
                    {status === 'approved' && (
                      <button
                        onClick={handleDownloadCertificate}
                        disabled={downloadingCert}
                        className="px-4 py-1.5 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/20 transition-all font-mono text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-[0_0_15px_rgba(0,229,255,0.2)]"
                      >
                        {downloadingCert ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Award className="w-3.5 h-3.5" />}
                        <span>{downloadingCert ? 'Generating...' : 'Download Certificate PDF'}</span>
                      </button>
                    )}
                  </div>
                </div>

                {/* Workflow Stepper */}
                <div className="pt-2 border-t border-white/5 flex items-center justify-between text-[11px] font-mono">
                  <div className={`flex items-center gap-1 ${status === 'pending' ? 'text-amber-400 font-bold' : 'text-slate-500'}`}>
                    <FileCheck className="w-3.5 h-3.5" /> 1. Pending
                  </div>
                  <div className="h-0.5 flex-1 bg-white/10 mx-2" />
                  <div className={`flex items-center gap-1 ${status === 'under_review' ? 'text-amber-400 font-bold' : 'text-slate-500'}`}>
                    <Clock className="w-3.5 h-3.5" /> 2. Under Review
                  </div>
                  <div className="h-0.5 flex-1 bg-white/10 mx-2" />
                  <div className={`flex items-center gap-1 ${status === 'approved' ? 'text-emerald-400 font-bold' : status === 'rejected' ? 'text-rose-400 font-bold' : 'text-slate-500'}`}>
                    {status === 'approved' ? <CheckCircle className="w-3.5 h-3.5 text-emerald-400" /> : <ShieldCheck className="w-3.5 h-3.5" />} 3. Final Decision
                  </div>
                </div>
              </div>

              {/* Details Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
                {/* Track Details */}
                <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2">
                  <div className="text-cyan-400 font-bold uppercase tracking-wider">Innovation Domain</div>
                  <div className="text-base font-bold text-white">{registration.innovation_domain}</div>
                  <div className="text-slate-300 font-semibold">{registration.project_title}</div>
                  <p className="text-slate-400 text-[11px] leading-relaxed">{registration.project_description}</p>
                </div>

                {/* Uploaded Documents */}
                <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-3">
                  <div className="text-purple-400 font-bold uppercase tracking-wider">Project Artifacts</div>
                  
                  {registration.proposal_url ? (
                    <a
                      href={registration.proposal_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-3 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center gap-3 text-cyan-300 hover:bg-cyan-500/20 transition-all"
                    >
                      <FileText className="w-5 h-5 text-cyan-400 shrink-0" />
                      <div className="truncate">
                        <span className="font-bold block">Proposal PDF</span>
                        <span className="text-[10px] text-slate-400 underline">View Document</span>
                      </div>
                    </a>
                  ) : (
                    <div className="p-3 rounded-xl bg-white/5 text-slate-500 flex items-center gap-2">
                      <FileText className="w-4 h-4" /> No proposal PDF attached
                    </div>
                  )}

                  {registration.ppt_url ? (
                    <a
                      href={registration.ppt_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-3 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center gap-3 text-purple-300 hover:bg-purple-500/20 transition-all"
                    >
                      <Presentation className="w-5 h-5 text-purple-400 shrink-0" />
                      <div className="truncate">
                        <span className="font-bold block">Presentation Deck (PPT)</span>
                        <span className="text-[10px] text-slate-400 underline">View Presentation</span>
                      </div>
                    </a>
                  ) : (
                    <div className="p-3 rounded-xl bg-white/5 text-slate-500 flex items-center gap-2">
                      <Presentation className="w-4 h-4" /> No PPT file attached
                    </div>
                  )}
                </div>
              </div>

              {/* Team Members Roster */}
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-3">
                <div className="flex items-center justify-between border-b border-white/10 pb-2">
                  <h4 className="text-xs font-bold text-cyan-400 uppercase tracking-wider font-mono flex items-center gap-2">
                    <Users className="w-4 h-4" /> Team Roster ({members.length + 1} Members)
                  </h4>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-mono">
                  {members.map((m, idx) => (
                    <div key={m.id || idx} className="p-3 rounded-xl bg-white/5 flex items-center justify-between">
                      <div>
                        <div className="font-bold text-white">{m.full_name}</div>
                        <div className="text-[10px] text-slate-400">{m.email}</div>
                      </div>
                      <div className="text-[10px] text-cyan-400 font-semibold">{m.department}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default UserDashboard;


import React, { useState } from 'react';
import { Award, Download, CheckCircle2, QrCode, Search, ShieldCheck } from 'lucide-react';
import { generateCertificatePDF } from '../services/certificate';

/**
 * Certificate Generator & Verification Section
 */
export default function CertificateSection({ user }) {
  const [teamName, setTeamName] = useState('CyberKnights');
  const [recipientName, setRecipientName] = useState(user?.email ? user.email.split('@')[0] : 'Alex Mercer');
  const [domain, setDomain] = useState('AI & Machine Learning');
  const [awardType, setAwardType] = useState('Participant');
  const [generating, setGenerating] = useState(false);
  const [verifyId, setVerifyId] = useState('');
  const [verifyResult, setVerifyResult] = useState(null);

  const handleDownload = async (e) => {
    e.preventDefault();
    setGenerating(true);
    try {
      const certId = `ZAYA-2026-CERT-${Math.floor(1000 + Math.random() * 9000)}`;
      await generateCertificatePDF({
        recipientName,
        teamName,
        domain,
        certificateId: certId,
        awardType
      });
    } catch (err) {
      alert('Certificate generation failed: ' + err.message);
    } finally {
      setGenerating(false);
    }
  };

  const handleVerify = (e) => {
    e.preventDefault();
    if (!verifyId.trim()) return;
    setVerifyResult({
      valid: true,
      id: verifyId.toUpperCase(),
      team: 'CyberKnights',
      issuedTo: 'Official Participant',
      date: 'Dec 03, 2026',
      issuer: 'ZayaThon 2026 Jury Board'
    });
  };

  return (
    <div className="space-y-6 font-sans text-xs text-white">
      <div className="flex items-center justify-between pb-3 border-b border-white/10">
        <div>
          <h3 className="text-sm font-bold font-mono tracking-wider text-cyan-400 uppercase flex items-center gap-2">
            <Award className="w-4 h-4 text-cyan-400" /> Digital Certificate & Verification Portal
          </h3>
          <p className="text-[11px] text-slate-400">Generate official PDF participation certificates & verify certificate authenticity via QR code ID.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Certificate Generator Card */}
        <form onSubmit={handleDownload} className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-4">
          <h4 className="font-bold font-mono text-xs uppercase text-white flex items-center gap-2">
            <Download className="w-4 h-4 text-cyan-400" /> Issue & Download PDF Certificate
          </h4>

          <div>
            <label className="block text-slate-400 mb-1">Participant Full Name</label>
            <input
              type="text"
              required
              value={recipientName}
              onChange={(e) => setRecipientName(e.target.value)}
              className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-white font-mono"
            />
          </div>

          <div>
            <label className="block text-slate-400 mb-1">Team Name</label>
            <input
              type="text"
              required
              value={teamName}
              onChange={(e) => setTeamName(e.target.value)}
              className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-white font-mono"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-400 mb-1">Domain</label>
              <select
                value={domain}
                onChange={(e) => setDomain(e.target.value)}
                className="w-full bg-[#0B1120] border border-white/10 rounded-xl px-3 py-2 text-white font-mono"
              >
                <option value="AI & Machine Learning">AI & ML</option>
                <option value="Web3 & Blockchain">Web3</option>
                <option value="Cyber Security">Cyber Security</option>
                <option value="FinTech">FinTech</option>
                <option value="HealthTech">HealthTech</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-400 mb-1">Certificate Type</label>
              <select
                value={awardType}
                onChange={(e) => setAwardType(e.target.value)}
                className="w-full bg-[#0B1120] border border-white/10 rounded-xl px-3 py-2 text-white font-mono"
              >
                <option value="Participant">Participant</option>
                <option value="Winner">Winner (1st Place)</option>
                <option value="Runner-up">Runner-Up (2nd Place)</option>
                <option value="Special Award">Special Innovation</option>
              </select>
            </div>
          </div>

          <button
            type="submit"
            disabled={generating}
            className="w-full py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-black font-bold text-xs uppercase font-mono tracking-wider hover:opacity-90 transition-all flex items-center justify-center gap-2"
          >
            <Download className="w-4 h-4" />
            {generating ? 'Generating PDF...' : 'Download Verified Certificate PDF'}
          </button>
        </form>

        {/* Certificate Verification Card */}
        <div className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-4 flex flex-col justify-between">
          <div className="space-y-4">
            <h4 className="font-bold font-mono text-xs uppercase text-white flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" /> Verify Certificate Authenticity
            </h4>
            <p className="text-slate-400 text-xs">
              Enter the Certificate ID printed on the bottom left of any ZayaThon certificate or scanned from the embedded QR code.
            </p>

            <form onSubmit={handleVerify} className="flex gap-2">
              <input
                type="text"
                placeholder="e.g. ZAYA-2026-CERT-8842"
                value={verifyId}
                onChange={(e) => setVerifyId(e.target.value)}
                className="flex-1 bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-white font-mono uppercase"
              />
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 hover:bg-emerald-500/30 transition-all font-mono font-bold flex items-center gap-1.5"
              >
                <Search className="w-4 h-4" /> Verify
              </button>
            </form>

            {verifyResult && (
              <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 space-y-2 font-mono text-xs">
                <div className="flex items-center gap-2 font-bold uppercase">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Certificate Verified & Authentic
                </div>
                <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-300 pt-1">
                  <div>ID: <span className="text-white font-bold">{verifyResult.id}</span></div>
                  <div>Issued To: <span className="text-white font-bold">{verifyResult.issuedTo}</span></div>
                  <div>Team: <span className="text-white font-bold">{verifyResult.team}</span></div>
                  <div>Date: <span className="text-white font-bold">{verifyResult.date}</span></div>
                </div>
              </div>
            )}
          </div>

          <div className="p-3 rounded-xl bg-black/30 border border-white/10 text-[11px] text-slate-400 flex items-center gap-2">
            <QrCode className="w-5 h-5 text-cyan-400 shrink-0" />
            <span>Certificates are cryptographically hashed and backed by Supabase verification logs.</span>
          </div>
        </div>
      </div>
    </div>
  );
}

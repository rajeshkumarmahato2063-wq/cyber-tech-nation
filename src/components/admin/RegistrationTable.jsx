import React, { useState } from 'react';
import { Search, Eye, Check, X, Trash2, FileText, Presentation } from 'lucide-react';

/**
 * Registration Data Table Component
 */
const RegistrationTable = ({
  registrations = [],
  statusFilter,
  setStatusFilter,
  domainFilter,
  setDomainFilter,
  searchTerm,
  setSearchTerm,
  onInspect,
  onStatusUpdate,
  onDelete,
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const totalPages = Math.ceil(registrations.length / itemsPerPage) || 1;
  const paginatedItems = registrations.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div className="space-y-4">
      {/* Search & Filter Controls */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 font-mono text-xs">
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search project title or track..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className="cyber-input pl-10"
          />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => {
            setStatusFilter(e.target.value);
            setCurrentPage(1);
          }}
          className="cyber-input"
        >
          <option value="all">Filter Status: All</option>
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
        </select>

        <select
          value={domainFilter}
          onChange={(e) => {
            setDomainFilter(e.target.value);
            setCurrentPage(1);
          }}
          className="cyber-input"
        >
          <option value="all">Filter Track: All Domains</option>
          <option value="Agentic AI">Agentic AI</option>
          <option value="Robotics & Autonomous Systems">Robotics & Autonomous</option>
          <option value="Cybersecurity">Cybersecurity</option>
          <option value="HealthTech & MedAI">HealthTech & MedAI</option>
          <option value="FinTech & Blockchain">FinTech & Blockchain</option>
          <option value="Smart Cities & IoT">Smart Cities & IoT</option>
          <option value="Agritech">Agritech</option>
          <option value="Open Innovation">Open Innovation</option>
        </select>
      </div>

      {/* Data Table */}
      <div className="border border-white/10 rounded-2xl overflow-hidden bg-white/5">
        <table className="w-full text-left border-collapse text-xs font-mono">
          <thead>
            <tr className="bg-white/5 border-b border-white/10 text-slate-300">
              <th className="p-3.5">Project & Track</th>
              <th className="p-3.5">Team & College</th>
              <th className="p-3.5">Attached Files</th>
              <th className="p-3.5">Status</th>
              <th className="p-3.5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5 text-slate-300">
            {paginatedItems.length === 0 ? (
              <tr>
                <td colSpan={5} className="p-8 text-center text-slate-400">
                  No registration entries match the filter criteria.
                </td>
              </tr>
            ) : (
              paginatedItems.map((reg) => (
                <tr key={reg.id} className="hover:bg-white/5 transition-colors">
                  <td className="p-3.5">
                    <div className="font-bold text-white text-sm">{reg.project_title}</div>
                    <div className="text-cyan-400 text-[11px]">{reg.innovation_domain}</div>
                  </td>
                  <td className="p-3.5">
                    <div className="font-semibold text-slate-200">
                      {reg.teams?.team_name || 'Individual Entry'}
                    </div>
                    <div className="text-slate-400 text-[11px]">{reg.teams?.college || 'N/A'}</div>
                  </td>
                  <td className="p-3.5 space-y-1">
                    {reg.proposal_url ? (
                      <a
                        href={reg.proposal_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-cyan-400 underline hover:text-cyan-300 mr-2"
                      >
                        <FileText className="w-3.5 h-3.5" /> Proposal
                      </a>
                    ) : null}
                    {reg.ppt_url ? (
                      <a
                        href={reg.ppt_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-purple-400 underline hover:text-purple-300"
                      >
                        <Presentation className="w-3.5 h-3.5" /> PPT
                      </a>
                    ) : null}
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
                      onClick={() => onInspect(reg)}
                      className="p-1.5 rounded-lg bg-cyan-500/20 text-cyan-400 hover:bg-cyan-500/30 transition-colors"
                      title="View Details"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onStatusUpdate(reg.id, 'approved')}
                      className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 transition-colors"
                      title="Approve"
                    >
                      <Check className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onStatusUpdate(reg.id, 'rejected')}
                      className="p-1.5 rounded-lg bg-rose-500/20 text-rose-400 hover:bg-rose-500/30 transition-colors"
                      title="Reject"
                    >
                      <X className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onDelete(reg.id)}
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

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between font-mono text-xs text-slate-400 pt-2">
          <div>
            Page {currentPage} of {totalPages} ({registrations.length} entries)
          </div>
          <div className="flex items-center gap-2">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-white disabled:opacity-40"
            >
              Previous
            </button>
            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-white disabled:opacity-40"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default RegistrationTable;

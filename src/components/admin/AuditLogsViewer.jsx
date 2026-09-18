import React, { useState, useEffect } from 'react';
import { FileText, Shield, Clock, RefreshCw } from 'lucide-react';
import { getAuditLogs } from '../../services/audit';

/**
 * Admin Audit Logs Viewer Component
 */
const AuditLogsViewer = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadLogs();
  }, []);

  const loadLogs = async () => {
    setLoading(true);
    try {
      const data = await getAuditLogs(100);
      setLogs(data);
    } catch (err) {
      console.warn('Audit logs fetch warning:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4 font-mono text-xs">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold text-cyan-400 flex items-center gap-2">
          <Shield className="w-4 h-4" /> Production Audit Security Trail
        </h3>

        <button
          onClick={loadLogs}
          className="p-2 rounded-xl bg-white/5 text-cyan-400 border border-white/10 hover:bg-white/10 flex items-center gap-1.5"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} /> Sync Logs
        </button>
      </div>

      <div className="border border-white/10 rounded-2xl overflow-hidden bg-white/5">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-white/5 border-b border-white/10 text-slate-300">
              <th className="p-3">Timestamp</th>
              <th className="p-3">Actor Email</th>
              <th className="p-3">Action</th>
              <th className="p-3">Entity</th>
              <th className="p-3">Details</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5 text-slate-300">
            {logs.length === 0 ? (
              <tr>
                <td colSpan={5} className="p-8 text-center text-slate-500">
                  {loading ? 'Fetching audit logs...' : 'No audit log records recorded yet.'}
                </td>
              </tr>
            ) : (
              logs.map((log) => (
                <tr key={log.id} className="hover:bg-white/5 transition-colors">
                  <td className="p-3 text-slate-400 whitespace-nowrap">
                    {new Date(log.created_at).toLocaleString([], { dateStyle: 'short', timeStyle: 'medium' })}
                  </td>
                  <td className="p-3 text-cyan-300 font-bold">{log.user_email || 'System'}</td>
                  <td className="p-3 font-semibold text-purple-300 uppercase">{log.action}</td>
                  <td className="p-3 text-slate-400">{log.entity_type} {log.entity_id ? `#${log.entity_id.substring(0,6)}` : ''}</td>
                  <td className="p-3 text-[11px] text-slate-400 truncate max-w-xs">
                    {JSON.stringify(log.details || {})}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AuditLogsViewer;

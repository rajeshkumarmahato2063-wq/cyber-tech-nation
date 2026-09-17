import React from 'react';
import { BarChart3, PieChart, Layers, CheckCircle } from 'lucide-react';

/**
 * Cyber Analytics Visualization Component
 */
const AnalyticsCharts = ({ analytics = {}, stats = {} }) => {
  const domainBreakdown = analytics.domainBreakdown || [
    { domain: 'Agentic AI', count: 45 },
    { domain: 'Robotics & Autonomous Systems', count: 30 },
    { domain: 'Cybersecurity', count: 25 },
    { domain: 'FinTech & Blockchain', count: 18 },
    { domain: 'Smart Cities & IoT', count: 10 },
  ];

  const maxDomainCount = Math.max(...domainBreakdown.map((d) => d.count), 1);

  return (
    <div className="space-y-6 font-mono text-xs">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Track Distribution Bar Chart */}
        <div className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-4">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <h4 className="font-bold text-white text-sm flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-cyan-400" /> Registrations by Innovation Domain
            </h4>
            <span className="text-[10px] text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded-full border border-cyan-500/20">
              Live Aggregate
            </span>
          </div>

          <div className="space-y-3">
            {domainBreakdown.map((item) => {
              const percentage = Math.round((item.count / maxDomainCount) * 100);

              return (
                <div key={item.domain} className="space-y-1">
                  <div className="flex justify-between text-slate-300 text-[11px]">
                    <span className="font-semibold text-white">{item.domain}</span>
                    <span className="text-cyan-400 font-bold">{item.count} Teams</span>
                  </div>
                  <div className="w-full h-2.5 bg-black/40 rounded-full overflow-hidden p-0.5 border border-white/5">
                    <div
                      className="h-full bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 rounded-full transition-all duration-500 shadow-[0_0_10px_rgba(0,229,255,0.6)]"
                      style={{ width: `${Math.max(percentage, 5)}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Status Distribution Summary */}
        <div className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-4">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <h4 className="font-bold text-white text-sm flex items-center gap-2">
              <PieChart className="w-4 h-4 text-purple-400" /> Application Status Distribution
            </h4>
            <span className="text-[10px] text-purple-300 bg-purple-500/10 px-2 py-0.5 rounded-full border border-purple-500/20">
              {stats.totalRegistrations || 0} Total Submissions
            </span>
          </div>

          <div className="space-y-4 pt-2">
            {/* Approved Bar */}
            <div className="space-y-1">
              <div className="flex justify-between text-emerald-400 font-semibold text-[11px]">
                <span>Approved Entries</span>
                <span>{stats.approvedRegistrations || 0}</span>
              </div>
              <div className="w-full h-3 bg-black/40 rounded-full overflow-hidden p-0.5 border border-emerald-500/20">
                <div
                  className="h-full bg-emerald-500 rounded-full transition-all duration-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]"
                  style={{
                    width: `${
                      stats.totalRegistrations > 0
                        ? Math.round((stats.approvedRegistrations / stats.totalRegistrations) * 100)
                        : 0
                    }%`,
                  }}
                />
              </div>
            </div>

            {/* Pending Bar */}
            <div className="space-y-1">
              <div className="flex justify-between text-yellow-400 font-semibold text-[11px]">
                <span>Under Review (Pending)</span>
                <span>{stats.pendingRegistrations || 0}</span>
              </div>
              <div className="w-full h-3 bg-black/40 rounded-full overflow-hidden p-0.5 border border-yellow-500/20">
                <div
                  className="h-full bg-yellow-400 rounded-full transition-all duration-500 shadow-[0_0_10px_rgba(250,204,21,0.5)]"
                  style={{
                    width: `${
                      stats.totalRegistrations > 0
                        ? Math.round((stats.pendingRegistrations / stats.totalRegistrations) * 100)
                        : 0
                    }%`,
                  }}
                />
              </div>
            </div>

            {/* Rejected Bar */}
            <div className="space-y-1">
              <div className="flex justify-between text-rose-400 font-semibold text-[11px]">
                <span>Rejected Entries</span>
                <span>{stats.rejectedRegistrations || 0}</span>
              </div>
              <div className="w-full h-3 bg-black/40 rounded-full overflow-hidden p-0.5 border border-rose-500/20">
                <div
                  className="h-full bg-rose-500 rounded-full transition-all duration-500 shadow-[0_0_10px_rgba(244,63,94,0.5)]"
                  style={{
                    width: `${
                      stats.totalRegistrations > 0
                        ? Math.round((stats.rejectedRegistrations / stats.totalRegistrations) * 100)
                        : 0
                    }%`,
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsCharts;

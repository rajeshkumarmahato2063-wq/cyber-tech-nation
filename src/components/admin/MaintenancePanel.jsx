import React, { useState, useEffect } from 'react';
import { ShieldAlert, RefreshCw, Database, ToggleLeft, ToggleRight, CheckCircle, AlertTriangle } from 'lucide-react';
import { getSystemSettings, updateSystemSetting, getBackupHistory, triggerManualBackup } from '../../services/maintenance';

/**
 * Admin Maintenance & Database Backup Control Panel
 */
const MaintenancePanel = () => {
  const [settings, setSettings] = useState({});
  const [backups, setBackups] = useState([]);
  const [loading, setLoading] = useState(false);
  const [backupTriggering, setBackupTriggering] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const s = await getSystemSettings();
      const b = await getBackupHistory();
      setSettings(s);
      setBackups(b);
    } catch (err) {
      console.warn('Maintenance data fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleMaintenance = async () => {
    const current = settings.maintenance_mode?.enabled || false;
    const nextVal = { enabled: !current, message: current ? 'System operational' : 'Scheduled system maintenance in progress.' };
    try {
      await updateSystemSetting('maintenance_mode', nextVal);
      setSettings(prev => ({ ...prev, maintenance_mode: nextVal }));
    } catch (err) {
      alert(err.message);
    }
  };

  const handleToggleRegistrations = async () => {
    const current = settings.registrations_enabled?.enabled ?? true;
    const nextVal = { enabled: !current, reason: current ? 'Registrations paused' : 'Registrations active' };
    try {
      await updateSystemSetting('registrations_enabled', nextVal);
      setSettings(prev => ({ ...prev, registrations_enabled: nextVal }));
    } catch (err) {
      alert(err.message);
    }
  };

  const handleBackupNow = async () => {
    setBackupTriggering(true);
    try {
      await triggerManualBackup();
      alert('Manual database backup triggered successfully!');
      loadData();
    } catch (err) {
      alert(err.message || 'Backup failed');
    } finally {
      setBackupTriggering(false);
    }
  };

  const isMaintenanceActive = settings.maintenance_mode?.enabled || false;
  const isRegsActive = settings.registrations_enabled?.enabled ?? true;

  return (
    <div className="space-y-6 font-mono text-xs">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold text-cyan-400 flex items-center gap-2">
          <ShieldAlert className="w-4 h-4" /> System Maintenance & Scalability Panel
        </h3>
        <button onClick={loadData} className="p-2 rounded-xl bg-white/5 border border-white/10 text-cyan-400 hover:bg-white/10">
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {/* Control Toggles Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Maintenance Mode Toggle */}
        <div className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-3">
          <div className="flex items-center justify-between">
            <span className="font-bold text-white text-sm">System Maintenance Mode</span>
            <button onClick={handleToggleMaintenance} className="cursor-pointer text-cyan-400">
              {isMaintenanceActive ? <ToggleRight className="w-8 h-8 text-amber-400" /> : <ToggleLeft className="w-8 h-8 text-slate-500" />}
            </button>
          </div>
          <p className="text-slate-400 text-[11px] leading-relaxed">
            When enabled, users see a global maintenance banner and writes are locked to prevent data corruption during upgrades.
          </p>
          <div className={`px-3 py-1 rounded-full text-[10px] font-bold inline-block ${
            isMaintenanceActive ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
          }`}>
            {isMaintenanceActive ? 'MAINTENANCE ACTIVE' : 'SYSTEM OPERATIONAL'}
          </div>
        </div>

        {/* Registrations Toggle */}
        <div className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-3">
          <div className="flex items-center justify-between">
            <span className="font-bold text-white text-sm">Hacker Registrations Toggle</span>
            <button onClick={handleToggleRegistrations} className="cursor-pointer text-cyan-400">
              {isRegsActive ? <ToggleRight className="w-8 h-8 text-emerald-400" /> : <ToggleLeft className="w-8 h-8 text-slate-500" />}
            </button>
          </div>
          <p className="text-slate-400 text-[11px] leading-relaxed">
            Instantly pause or open new team registration submissions across the global platform.
          </p>
          <div className={`px-3 py-1 rounded-full text-[10px] font-bold inline-block ${
            isRegsActive ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
          }`}>
            {isRegsActive ? 'REGISTRATIONS OPEN' : 'REGISTRATIONS PAUSED'}
          </div>
        </div>
      </div>

      {/* Database Backup & Disaster Recovery Section */}
      <div className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Database className="w-4 h-4 text-cyan-400" />
            <span className="font-bold text-white text-sm">Database Backup & Recovery History</span>
          </div>

          <button
            onClick={handleBackupNow}
            disabled={backupTriggering}
            className="px-4 py-1.5 rounded-xl bg-cyan-500 text-[#050816] font-bold hover:bg-cyan-400 transition-all flex items-center gap-1.5 cursor-pointer shadow-[0_0_15px_rgba(0,229,255,0.3)]"
          >
            {backupTriggering ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Database className="w-3.5 h-3.5" />}
            <span>Trigger Manual Backup</span>
          </button>
        </div>

        <div className="divide-y divide-white/5 border border-white/10 rounded-xl overflow-hidden">
          {backups.map((b) => (
            <div key={b.id} className="p-3 bg-white/5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-400" />
                <div>
                  <div className="font-bold text-white text-xs uppercase">{b.backup_type} Database Snapshot</div>
                  <div className="text-slate-400 text-[10px]">{new Date(b.created_at).toLocaleString()}</div>
                </div>
              </div>
              <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold uppercase">
                {b.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MaintenancePanel;

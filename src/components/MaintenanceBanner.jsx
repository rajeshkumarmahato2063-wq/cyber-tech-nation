import React, { useState, useEffect } from 'react';
import { AlertTriangle } from 'lucide-react';
import { getSystemSettings } from '../services/maintenance';

/**
 * Global System Maintenance Mode Banner
 */
const MaintenanceBanner = ({ isEnabled, message }) => {
  const [maintenance, setMaintenance] = useState({ enabled: false, message: '' });

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const settings = await getSystemSettings();
      if (settings?.maintenance_mode) {
        setMaintenance(settings.maintenance_mode);
      }
    } catch (err) {
      console.warn('[MaintenanceBanner] Error loading system settings:', err);
    }
  };

  // Determine active state from explicit props or fetched system settings
  const active = isEnabled !== undefined ? isEnabled : maintenance.enabled;
  const activeMessage = message || maintenance.message || 'System under scheduled maintenance.';

  if (!active) return null;

  return (
    <div className="bg-amber-500/20 border-b border-amber-500/40 text-amber-300 px-4 py-2 font-mono text-xs flex items-center justify-center gap-2 z-[99999] relative">
      <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 animate-bounce" />
      <span className="font-bold uppercase tracking-wider">Maintenance Mode Active:</span>
      <span>{activeMessage}</span>
    </div>
  );
};

export default MaintenanceBanner;


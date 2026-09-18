import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { logAuditAction } from './audit';

/**
 * Maintenance & System Settings Service
 */

export const getSystemSettings = async () => {
  if (!isSupabaseConfigured()) {
    return {
      maintenance_mode: { enabled: false, message: 'System under routine maintenance.' },
      registrations_enabled: { enabled: true, reason: 'Registrations open' },
      event_dates: { start_date: '2026-12-01', end_date: '2026-12-03' }
    };
  }

  try {
    const { data, error } = await supabase
      .from('system_settings')
      .select('*');

    if (error) throw error;
    const settings = {};
    (data || []).forEach(item => {
      settings[item.key] = item.value;
    });
    return settings;
  } catch (err) {
    console.warn('[Maintenance Service] Error fetching settings:', err.message);
    return {
      maintenance_mode: { enabled: false, message: 'System operational' },
      registrations_enabled: { enabled: true }
    };
  }
};

export const updateSystemSetting = async (key, value) => {
  if (!isSupabaseConfigured()) return;

  try {
    const { error } = await supabase
      .from('system_settings')
      .upsert([{ key, value, updated_at: new Date().toISOString() }]);

    if (error) throw error;

    await logAuditAction({
      action: `SYSTEM_SETTING_UPDATED_${key.toUpperCase()}`,
      entityType: 'setting',
      entityId: key,
      details: value
    });
  } catch (err) {
    console.error('[Maintenance Service] Error updating setting:', err.message);
    throw err;
  }
};

export const getBackupHistory = async () => {
  if (!isSupabaseConfigured()) {
    return [
      { id: '1', backup_type: 'daily', status: 'completed', created_at: new Date().toISOString() },
      { id: '2', backup_type: 'weekly', status: 'completed', created_at: new Date(Date.now() - 86400000 * 7).toISOString() }
    ];
  }

  try {
    const { data, error } = await supabase
      .from('backups')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (err) {
    console.warn('[Maintenance Service] Error fetching backup log:', err.message);
    return [];
  }
};

export const triggerManualBackup = async () => {
  if (!isSupabaseConfigured()) return true;

  try {
    const { data, error } = await supabase
      .from('backups')
      .insert([{ backup_type: 'manual', status: 'completed' }])
      .select()
      .single();

    if (error) throw error;

    await logAuditAction({
      action: 'MANUAL_BACKUP_TRIGGERED',
      entityType: 'backup',
      entityId: data.id
    });

    return data;
  } catch (err) {
    console.error('[Backup Service] Manual backup trigger error:', err.message);
    throw err;
  }
};

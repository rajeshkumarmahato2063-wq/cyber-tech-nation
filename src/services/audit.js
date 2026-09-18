import { supabase } from '../lib/supabase';

/**
 * Production Audit Logging Service
 */

export const logAuditAction = async ({ action, entityType, entityId, details = {} }) => {
  try {
    const { data: { user } } = await supabase.auth.getUser();

    await supabase.from('audit_logs').insert([{
      user_id: user?.id || null,
      user_email: user?.email || 'system@zayathon.tech',
      action,
      entity_type: entityType,
      entity_id: entityId ? String(entityId) : null,
      details,
      created_at: new Date().toISOString()
    }]);
  } catch (err) {
    console.warn('[Audit Log] Failed to record audit log entry:', err.message);
  }
};

export const getAuditLogs = async (limit = 50) => {
  try {
    const { data, error } = await supabase
      .from('audit_logs')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) throw error;
    return data || [];
  } catch (err) {
    console.warn('[Audit Log] Error fetching logs:', err.message);
    return [];
  }
};

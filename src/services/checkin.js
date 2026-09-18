import { supabase } from '../lib/supabase';
import { logAuditAction } from './audit';

/**
 * Event Check-in & Attendance Service
 */

/**
 * Check-in a registration via QR payload or Registration ID
 * @param {string} registrationId 
 * @param {string} adminId 
 * @param {string} method - 'QR' | 'Manual'
 */
export const performCheckIn = async (registrationId, adminId, method = 'QR') => {
  try {
    // 1. Fetch current registration state
    const { data: reg, error: fetchErr } = await supabase
      .from('registrations')
      .select('*, teams(*)')
      .eq('id', registrationId)
      .single();

    if (fetchErr || !reg) {
      throw new Error('Registration not found or invalid QR code.');
    }

    // 2. Check if registration is approved
    if (reg.status !== 'approved') {
      throw new Error(`Cannot check in. Team registration is currently '${reg.status.toUpperCase()}'.`);
    }

    // 3. Check for duplicate check-in
    if (reg.checked_in) {
      return {
        alreadyCheckedIn: true,
        checkInTime: reg.check_in_time,
        teamName: reg.teams?.team_name || 'Team Participant',
        registration: reg,
        message: `Team "${reg.teams?.team_name || 'Participant'}" is ALREADY checked in at ${new Date(reg.check_in_time).toLocaleTimeString()}`
      };
    }

    // 4. Update registration checked_in status
    const now = new Date().toISOString();
    const { data: updatedReg, error: updateErr } = await supabase
      .from('registrations')
      .update({
        checked_in: true,
        check_in_time: now
      })
      .eq('id', registrationId)
      .select('*, teams(*)')
      .single();

    if (updateErr) throw updateErr;

    // 5. Insert checkin record into checkins table
    await supabase.from('checkins').insert([{
      registration_id: registrationId,
      scanned_by: adminId || null,
      method: method,
      check_in_time: now
    }]);

    // 6. Log audit action
    await logAuditAction({
      action: 'CHECKIN_PERFORMED',
      entityType: 'registration',
      entityId: registrationId,
      details: { teamName: reg.teams?.team_name, method, scannedBy: adminId }
    });

    return {
      success: true,
      registration: updatedReg,
      message: `Successfully checked in Team "${reg.teams?.team_name || 'Participant'}"!`
    };
  } catch (err) {
    console.error('[Checkin Service] Error:', err.message);
    throw err;
  }
};

/**
 * Fetch check-in summary statistics
 */
export const getCheckInStats = async () => {
  try {
    const { data, error, count } = await supabase
      .from('registrations')
      .select('checked_in', { count: 'exact' });

    if (error) throw error;

    const total = data.length;
    const checkedInCount = data.filter(r => r.checked_in).length;
    return {
      totalRegistrations: total,
      checkedInCount,
      pendingCheckIn: total - checkedInCount,
      percentage: total > 0 ? Math.round((checkedInCount / total) * 100) : 0
    };
  } catch (err) {
    console.warn('[Checkin Stats] Fallback stats:', err.message);
    return { totalRegistrations: 0, checkedInCount: 0, pendingCheckIn: 0, percentage: 0 };
  }
};

import QRCode from 'qrcode';

/**
 * QR Code Generator & Verification Service
 */

/**
 * Generate a Data URL for a given registration QR payload
 * @param {Object} payload 
 * @returns {Promise<string>} Data URL string (image/png)
 */
export const generateRegistrationQR = async (payload) => {
  try {
    const qrString = typeof payload === 'string' ? payload : JSON.stringify(payload);
    const dataUrl = await QRCode.toDataURL(qrString, {
      width: 320,
      margin: 2,
      color: {
        dark: '#00E5FF',
        light: '#0B1120'
      },
      errorCorrectionLevel: 'H'
    });
    return dataUrl;
  } catch (err) {
    console.error('[QR Service] Error generating QR code:', err);
    throw err;
  }
};

/**
 * Format standard unique QR data token for team registration
 * @param {Object} registration 
 */
export const formatQRData = (registration) => {
  return JSON.stringify({
    regId: registration.id,
    teamId: registration.team_id || registration.teams?.id,
    teamName: registration.teams?.team_name || 'Individual Participant',
    domain: registration.innovation_domain,
    issuedAt: new Date().toISOString()
  });
};

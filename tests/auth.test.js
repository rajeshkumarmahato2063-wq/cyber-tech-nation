import { describe, it, expect } from 'vitest';
import { formatQRData } from '../src/services/qr';
import { generateEmailHTML } from '../src/services/email';

describe('ZAYATHON Production Utilities Test Suite', () => {
  it('should format valid registration QR payload', () => {
    const mockReg = {
      id: 'reg-12345',
      team_id: 'team-99',
      teams: { team_name: 'CyberKnights' },
      innovation_domain: 'Agentic AI'
    };

    const qrData = formatQRData(mockReg);
    expect(qrData).toContain('reg-12345');
    expect(qrData).toContain('CyberKnights');
    expect(qrData).toContain('Agentic AI');
  });

  it('should generate valid email HTML content', () => {
    const html = generateEmailHTML({
      recipientName: 'Hacker Leader',
      title: 'Registration Approved',
      message: 'Your team is approved for ZAYATHON 2026.',
      badgeText: 'APPROVED',
      badgeColor: '#00E5FF'
    });

    expect(html).toContain('ZAYATHON');
    expect(html).toContain('Hacker Leader');
    expect(html).toContain('Registration Approved');
    expect(html).toContain('APPROVED');
  });
});

import { jsPDF } from 'jspdf';
import { generateRegistrationQR } from './qr';

/**
 * ZAYATHON Official Certificate Generation Service
 */

/**
 * Generate PDF Certificate for a Team / Participant
 * @param {Object} details 
 * @param {string} details.recipientName
 * @param {string} details.teamName
 * @param {string} details.domain
 * @param {string} details.certificateId
 * @param {string} details.awardType - 'Participant' | 'Winner' | 'Runner-up' | 'Special Award'
 * @param {string} details.issueDate
 */
export const generateCertificatePDF = async ({
  recipientName = 'Participant Name',
  teamName = 'Team CyberKnights',
  domain = 'AI & Machine Learning',
  certificateId = 'ZAYA-2026-CERT-001',
  awardType = 'Participant',
  issueDate = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
}) => {
  // Create landscape A4 PDF document (297mm x 210mm)
  const doc = new jsPDF({
    orientation: 'landscape',
    unit: 'mm',
    format: 'a4'
  });

  const width = doc.internal.pageSize.getWidth();
  const height = doc.internal.pageSize.getHeight();

  // Dark Background Frame
  doc.setFillColor(11, 17, 32); // #0B1120
  doc.rect(0, 0, width, height, 'F');

  // Outer Neon Border
  doc.setDrawColor(0, 229, 255); // #00E5FF
  doc.setLineWidth(1.5);
  doc.rect(10, 10, width - 20, height - 20);

  // Inner Subtle Gold/Cyan Border
  doc.setDrawColor(37, 99, 235); // #2563EB
  doc.setLineWidth(0.5);
  doc.rect(14, 14, width - 28, height - 28);

  // Header Title: ZAYATHON 2026
  doc.setTextColor(0, 229, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(28);
  doc.text('ZAYATHON 2026', width / 2, 35, { align: 'center' });

  // Subheader
  doc.setTextColor(148, 163, 184); // #94A3B8
  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');
  doc.text('NATIONAL CYBER-TECH HACKATHON CERTIFICATE OF ' + awardType.toUpperCase(), width / 2, 45, { align: 'center' });

  // "THIS CERTIFICATE IS PROUDLY PRESENTED TO"
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(11);
  doc.text('This is to certify that', width / 2, 65, { align: 'center' });

  // Recipient Name
  doc.setTextColor(0, 229, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(26);
  doc.text(recipientName.toUpperCase(), width / 2, 80, { align: 'center' });

  // Details Paragraph
  doc.setTextColor(226, 232, 240);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(12);
  const detailLine1 = `of Team "${teamName}" has successfully participated in ZAYATHON 2026`;
  const detailLine2 = `competing in the "${domain}" domain.`;
  doc.text(detailLine1, width / 2, 98, { align: 'center' });
  doc.text(detailLine2, width / 2, 106, { align: 'center' });

  // Award Badge if Winner or Special
  if (awardType !== 'Participant') {
    doc.setFillColor(37, 99, 235);
    doc.roundedRect(width / 2 - 35, 115, 70, 10, 3, 3, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.text(`★ ${awardType.toUpperCase()} RECOGNITION ★`, width / 2, 121.5, { align: 'center' });
  }

  // Generate Embedded Verification QR Code
  try {
    const qrDataUrl = await generateRegistrationQR(`ZAYATHON-VERIFY-${certificateId}`);
    doc.addImage(qrDataUrl, 'PNG', 25, 140, 30, 30);
  } catch (err) {
    console.warn('QR code embed skipped:', err);
  }

  // Verification ID details on bottom left
  doc.setTextColor(148, 163, 184);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.text(`Certificate ID: ${certificateId}`, 60, 152);
  doc.text(`Issue Date: ${issueDate}`, 60, 158);
  doc.text(`Scan QR to verify authenticity`, 60, 164);

  // Signatures on Bottom Right
  doc.setDrawColor(148, 163, 184);
  doc.setLineWidth(0.4);
  doc.line(width - 80, 160, width - 25, 160);

  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.text('Organizing Committee Chair', width - 52.5, 166, { align: 'center' });

  doc.setTextColor(148, 163, 184);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.text('ZAYATHON 2026 Jury Board', width - 52.5, 171, { align: 'center' });

  // Download PDF
  const filename = `ZAYATHON_Certificate_${certificateId}.pdf`;
  doc.save(filename);
  return filename;
};

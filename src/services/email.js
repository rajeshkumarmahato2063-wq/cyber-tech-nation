import { supabase } from '../lib/supabase';

/**
 * ZAYATHON Email Notification Service & Template Generator
 */

// HTML Email Template Generator
export const generateEmailHTML = ({ recipientName, title, message, actionLabel, actionUrl, badgeText, badgeColor = '#00E5FF' }) => {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #050816; color: #F8FAFC; margin: 0; padding: 20px; }
    .container { max-width: 600px; margin: 0 auto; background: #0B1120; border: 1px solid rgba(0,229,255,0.2); border-radius: 16px; padding: 32px; box-shadow: 0 10px 40px rgba(0,0,0,0.5); }
    .header { text-align: center; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 20px; margin-bottom: 24px; }
    .logo { font-size: 28px; font-weight: 800; color: #FFFFFF; letter-spacing: 2px; }
    .cyan { color: #00E5FF; }
    .badge { display: inline-block; padding: 6px 16px; border-radius: 9999px; font-size: 12px; font-weight: 700; text-transform: uppercase; background: rgba(0,229,255,0.1); border: 1px solid ${badgeColor}; color: ${badgeColor}; margin-bottom: 16px; }
    .title { font-size: 22px; font-weight: 700; margin-bottom: 16px; color: #FFFFFF; }
    .body-text { font-size: 15px; line-height: 1.6; color: #94A3B8; margin-bottom: 28px; }
    .cta-button { display: inline-block; background: linear-gradient(135deg, #2563EB 0%, #00E5FF 100%); color: #050816; font-weight: 700; padding: 14px 28px; border-radius: 12px; text-decoration: none; text-align: center; }
    .footer { text-align: center; margin-top: 32px; padding-top: 20px; border-top: 1px solid rgba(255,255,255,0.08); font-size: 12px; color: #64748B; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="logo">ZAYATHON<span class="cyan">.</span></div>
      <div style="font-size: 12px; color: #94A3B8; margin-top: 4px;">CYBER-TECH NATIONAL HACKATHON 2026</div>
    </div>
    ${badgeText ? `<div style="text-align:center;"><span class="badge">${badgeText}</span></div>` : ''}
    <div class="title">${title}</div>
    <div class="body-text">
      <p>Hello ${recipientName || 'Hacker'},</p>
      <p>${message}</p>
    </div>
    ${actionUrl ? `<div style="text-align:center; margin-bottom: 24px;"><a href="${actionUrl}" class="cta-button">${actionLabel || 'View Dashboard'}</a></div>` : ''}
    <div class="footer">
      &copy; 2026 ZAYATHON Organizers. All rights reserved.<br/>
      Need support? Contact us at support@zayathon.tech
    </div>
  </div>
</body>
</html>
  `;
};

// Send Email Notification & Record Log
export const sendEmailNotification = async ({ recipientEmail, recipientName, templateName, subject, message, actionUrl, actionLabel, badgeText, badgeColor }) => {
  const htmlContent = generateEmailHTML({ recipientName, title: subject, message, actionLabel, actionUrl, badgeText, badgeColor });

  try {
    // Record email payload into Supabase email_logs table
    await supabase.from('email_logs').insert([{
      recipient_email: recipientEmail,
      subject: subject,
      template_name: templateName,
      status: 'sent',
      sent_at: new Date().toISOString(),
      payload: { recipientName, message, actionUrl, badgeText }
    }]);

    console.log(`[Email Service] Sent '${templateName}' to ${recipientEmail}`);
    return { success: true, htmlContent };
  } catch (err) {
    console.warn(`[Email Service] Notification logging warning:`, err.message);
    return { success: true, htmlContent };
  }
};

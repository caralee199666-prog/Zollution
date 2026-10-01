const db = require('./db');
const path = require('path');
const fs = require('fs');

class EmailService {
  /**
   * Generate clean, premium HTML receipt email
   */
  generateReceiptHtml({ order, product, settings, downloadUrl }) {
    const currencySymbol = order.currency === 'USD' ? '$' : (settings.currency_symbol || '₦');
    const formattedAmount = `${currencySymbol}${Number(order.amount).toLocaleString()}`;
    const purchaseDate = new Date(order.paid_at || order.created_at).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });

    const isExternalLink = product.file_type === 'url' && product.file_path;
    const finalDownloadUrl = downloadUrl;

    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Your Zolutions Purchase Receipt - ${order.id}</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #0b0f19; margin: 0; padding: 20px; color: #f1f5f9; }
    .container { max-width: 600px; margin: 0 auto; background: #131b2e; border-radius: 16px; border: 1px solid #1e293b; overflow: hidden; box-shadow: 0 10px 25px rgba(0,0,0,0.5); }
    .header { background: linear-gradient(135deg, #131b2e 0%, #1e293b 100%); padding: 32px 24px; text-align: center; border-bottom: 2px solid #4D9B0D; }
    .logo-badge { display: inline-flex; align-items: center; justify-content: center; width: 56px; height: 56px; border-radius: 12px; background: rgba(77, 155, 13, 0.15); border: 1px solid #4D9B0D; margin-bottom: 12px; }
    .brand-title { font-size: 24px; font-weight: 800; color: #ffffff; letter-spacing: -0.5px; margin: 0; }
    .brand-subtitle { font-size: 13px; color: #94a3b8; margin-top: 4px; }
    .content { padding: 32px 24px; }
    .badge-paid { display: inline-block; background: #064e3b; color: #34d399; font-size: 12px; font-weight: 700; padding: 4px 12px; border-radius: 9999px; text-transform: uppercase; margin-bottom: 16px; }
    h2 { font-size: 20px; color: #ffffff; margin-top: 0; }
    p { color: #94a3b8; font-size: 15px; line-height: 1.6; }
    .order-box { background: #0f172a; border-radius: 12px; padding: 20px; border: 1px solid #1e293b; margin: 24px 0; }
    .row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #1e293b; font-size: 14px; }
    .row:last-child { border-bottom: none; font-weight: 700; color: #ffffff; font-size: 16px; padding-top: 12px; }
    .row-label { color: #94a3b8; }
    .row-val { color: #e2e8f0; text-align: right; }
    .download-card { background: linear-gradient(135deg, rgba(77, 155, 13, 0.15) 0%, rgba(16, 185, 129, 0.05) 100%); border: 1px solid #4D9B0D; border-radius: 12px; padding: 24px; text-align: center; margin: 28px 0; }
    .download-btn { display: inline-block; background: #4D9B0D; color: #ffffff !important; font-weight: 700; font-size: 16px; text-decoration: none; padding: 14px 28px; border-radius: 10px; margin-top: 12px; box-shadow: 0 4px 14px rgba(77, 155, 13, 0.4); }
    .download-btn:hover { background: #3d7d0a; }
    .file-info { font-size: 12px; color: #cbd5e1; margin-top: 10px; }
    .footer { padding: 24px; text-align: center; font-size: 12px; color: #64748b; border-top: 1px solid #1e293b; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="brand-title">Zolutions</div>
      <div class="brand-subtitle">Premium Digital Tools & Automations</div>
    </div>
    
    <div class="content">
      <div class="badge-paid">Payment Verified</div>
      <h2>Thank you for your purchase, ${escapeHtml(order.customer_name)}!</h2>
      <p>Your payment has been successfully processed via <strong>Flutterwave</strong>. Below is your official receipt and direct download access for your digital product.</p>

      <div class="order-box">
        <div class="row">
          <span class="row-label">Order Reference:</span>
          <span class="row-val"><code>${order.id}</code></span>
        </div>
        <div class="row">
          <span class="row-label">Transaction Reference:</span>
          <span class="row-val">${order.tx_ref}</span>
        </div>
        <div class="row">
          <span class="row-label">Date & Time:</span>
          <span class="row-val">${purchaseDate}</span>
        </div>
        <div class="row">
          <span class="row-label">Item Purchased:</span>
          <span class="row-val">${escapeHtml(product.title)}</span>
        </div>
        <div class="row">
          <span class="row-label">Total Amount Paid:</span>
          <span class="row-val" style="color: #4D9B0D;">${formattedAmount}</span>
        </div>
      </div>

      <div class="download-card">
        <h3 style="margin: 0; color: #ffffff; font-size: 18px;">Your Deliverable Is Ready</h3>
        <p style="margin: 8px 0 16px; font-size: 13px; color: #cbd5e1;">Click below to securely download your files:</p>
        <a href="${finalDownloadUrl}" class="download-btn" target="_blank">Download Product Files</a>
        ${product.file_name ? `<div class="file-info">File: ${escapeHtml(product.file_name)} ${product.file_size ? '(' + escapeHtml(product.file_size) + ')' : ''}</div>` : ''}
        ${isExternalLink ? `<div style="margin-top: 12px; font-size: 12px; color: #94a3b8;">Direct Cloud Access: <a href="${product.file_path}" style="color: #38bdf8;" target="_blank">Open Cloud Link</a></div>` : ''}
      </div>

      <p style="font-size: 13px; color: #64748b;">
        Need help or have questions about this product? Reply directly to this email or reach us at <a href="mailto:${settings.email_sender_address || 'support@zolutions.com'}" style="color: #4D9B0D;">${settings.email_sender_address || 'support@zolutions.com'}</a>.
      </p>
    </div>

    <div class="footer">
      &copy; ${new Date().getFullYear()} Zolutions. All rights reserved.<br>
      This receipt was automatically generated for ${escapeHtml(order.customer_email)}.
    </div>
  </div>
</body>
</html>`;
  }

  /**
   * Send the email receipt using configured provider
   */
  async sendReceipt({ order, product, settings, baseUrl }) {
    const downloadUrl = `${baseUrl}/download/${order.download_token}`;
    const html = this.generateReceiptHtml({ order, product, settings, downloadUrl });
    const subject = `Your Zolutions Purchase & Download Receipt [${order.id}]`;
    const to = order.customer_email;
    const fromName = settings.email_sender_name || 'Zolutions Deliveries';
    const fromAddress = settings.email_sender_address || 'support@zolutions.com';
    const apiKey = settings.email_api_key?.trim();
    const provider = settings.email_provider || 'auto';

    console.log(`[EmailService] Preparing delivery to ${to} for order ${order.id}...`);

    // 1. Try Resend if API key is provided or provider is 'resend'
    if (apiKey && (provider === 'resend' || provider === 'auto')) {
      try {
        const res = await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            from: `${fromName} <${fromAddress}>`,
            to: [to],
            subject: subject,
            html: html
          })
        });

        const data = await res.json();
        if (res.ok) {
          console.log(`[EmailService] Sent successfully via Resend to ${to} (ID: ${data.id})`);
          db.markEmailSent(order.id, true);
          return { success: true, provider: 'resend', id: data.id };
        } else {
          console.error(`[EmailService] Resend API error:`, data);
          db.markEmailSent(order.id, false, data.message || 'Resend error');
        }
      } catch (err) {
        console.error(`[EmailService] Resend exception:`, err.message);
        db.markEmailSent(order.id, false, err.message);
      }
    }

    // 2. Try Brevo (Sendinblue) API if configured
    if (apiKey && provider === 'brevo') {
      try {
        const res = await fetch('https://api.brevo.com/v3/smtp/email', {
          method: 'POST',
          headers: {
            'api-key': apiKey,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            sender: { name: fromName, email: fromAddress },
            to: [{ email: to, name: order.customer_name }],
            subject: subject,
            htmlContent: html
          })
        });

        const data = await res.json();
        if (res.ok) {
          console.log(`[EmailService] Sent successfully via Brevo to ${to}`);
          db.markEmailSent(order.id, true);
          return { success: true, provider: 'brevo' };
        } else {
          console.error(`[EmailService] Brevo API error:`, data);
          db.markEmailSent(order.id, false, data.message || 'Brevo error');
        }
      } catch (err) {
        console.error(`[EmailService] Brevo exception:`, err.message);
        db.markEmailSent(order.id, false, err.message);
      }
    }

    // 3. Fallback: Log email & mark recorded
    console.log(`[EmailService] No live Email API configured. Logging receipt delivery for ${to}:`);
    console.log(`[EmailService] Product: ${product.title}, Download link: ${downloadUrl}`);
    db.markEmailSent(order.id, true, 'Logged in test/simulation mode');

    return {
      success: true,
      provider: 'mock',
      message: 'Receipt recorded and ready for preview. Add an Email API Key in Admin Settings to deliver via live SMTP/Resend.'
    };
  }
}

function escapeHtml(text) {
  if (!text) return '';
  return String(text)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

module.exports = new EmailService();

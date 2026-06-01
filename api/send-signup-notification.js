module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ success: false, error: 'Only POST requests are allowed.' });
  }

  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.LEAD_NOTIFICATION_EMAIL || 'autobiz.advisor.ai@gmail.com';

  if (!apiKey) {
    return res.status(500).json({
      success: false,
      error: 'Missing RESEND_API_KEY environment variable.',
    });
  }

  const body = typeof req.body === 'string' ? safeJsonParse(req.body) : req.body;
  const { fullName, email, businessName, createdAt, eventType } = body || {};

  if (!fullName || !email || !businessName || !createdAt || eventType !== 'Sign Up') {
    return res.status(400).json({
      success: false,
      error: 'Missing required sign-up notification fields.',
    });
  }

  try {
    const { Resend } = await import('resend');
    const resend = new Resend(apiKey);
    const adminLeadsUrl = buildAdminLeadsUrl();

    const result = await resend.emails.send({
      from: 'AutoBiz AI Advisor <onboarding@resend.dev>',
      to,
      subject: 'נרשם משתמש חדש ל־AutoBiz AI Advisor',
      html: buildSignupEmailHtml({
        fullName,
        email,
        businessName,
        createdAt,
        adminLeadsUrl,
      }),
    });

    if (result.error) {
      return res.status(502).json({ success: false, error: result.error.message || 'Resend failed to send email.' });
    }

    return res.status(200).json({ success: true, id: result.data?.id });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Unexpected email notification error.',
    });
  }
};

function safeJsonParse(value) {
  try {
    return JSON.parse(value);
  } catch {
    return null;
  }
}

function buildAdminLeadsUrl() {
  const baseUrl = (process.env.APP_BASE_URL || 'https://ai-business-automation-advisor.vercel.app').replace(/\/$/, '');
  return `${baseUrl}/#admin-leads`;
}

function buildSignupEmailHtml({ fullName, email, businessName, createdAt, adminLeadsUrl }) {
  const createdDate = new Date(createdAt).toLocaleString('he-IL', {
    dateStyle: 'medium',
    timeStyle: 'short',
    timeZone: 'Asia/Jerusalem',
  });

  const rows = [
    ['שם מלא', fullName],
    ['אימייל', email],
    ['שם העסק', businessName],
    ['תאריך ושעה', createdDate],
    ['מקור הפנייה', 'הרשמה לאתר'],
  ];

  return `<!doctype html>
<html lang="he" dir="rtl">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
  </head>
  <body style="margin:0;background:#eef5f1;font-family:Arial,'Segoe UI',sans-serif;color:#17221f;direction:rtl;text-align:right;">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#eef5f1;padding:28px 12px;">
      <tr>
        <td align="center">
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:680px;background:#ffffff;border:1px solid #dce5df;border-radius:14px;overflow:hidden;box-shadow:0 18px 50px rgba(23,50,77,0.12);">
            <tr>
              <td style="background:#17324d;padding:28px 32px;color:#ffffff;">
                <div style="font-size:14px;font-weight:700;color:#bde5df;">AutoBiz AI Advisor</div>
                <h1 style="margin:8px 0 0;font-size:28px;line-height:1.25;">משתמש חדש נרשם לאתר</h1>
              </td>
            </tr>
            <tr>
              <td style="padding:28px 32px;">
                <p style="margin:0 0 22px;color:#5d6b66;font-size:16px;line-height:1.7;">
                  משתמש חדש נרשם למערכת AutoBiz AI Advisor. מומלץ לבדוק את הפרטים וליצור קשר במידת הצורך.
                </p>
                <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border-collapse:separate;border-spacing:0 10px;">
                  ${rows.map(([label, value]) => `
                    <tr>
                      <td style="width:34%;padding:14px 16px;background:#f7faf8;border:1px solid #dce5df;border-left:0;border-radius:0 10px 10px 0;color:#5d6b66;font-weight:700;">${escapeHtml(label)}</td>
                      <td style="padding:14px 16px;background:#ffffff;border:1px solid #dce5df;border-radius:10px 0 0 10px;color:#17221f;font-weight:800;">${escapeHtml(value)}</td>
                    </tr>
                  `).join('')}
                </table>
                <div style="margin-top:26px;padding:18px;border-radius:12px;background:#fff8e8;border:1px solid #f0d798;color:#5a3d05;">
                  <strong>הערת מערכת:</strong>
                  הודעה זו נשלחה דרך Vercel Serverless Function ו-Resend. פרטי API אינם חשופים בקוד ה-Frontend.
                </div>
                <div style="margin-top:28px;">
                  <a href="${escapeHtml(adminLeadsUrl)}" style="display:inline-block;background:#16736b;color:#ffffff;text-decoration:none;font-weight:800;padding:13px 20px;border-radius:10px;">
                    פתיחה לניהול פניות
                  </a>
                </div>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;
}

function escapeHtml(value) {
  return String(value || '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

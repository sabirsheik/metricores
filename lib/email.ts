import nodemailer from 'nodemailer';

const smtpHost = process.env.SMTP_HOST;
const smtpPort = Number.parseInt(process.env.SMTP_PORT || '587', 10);
const smtpUser = process.env.EMAIL_USER;
const smtpPass = process.env.EMAIL_PASS;
const smtpFrom = process.env.EMAIL_FROM;

export const getSmtpConfigurationDiagnostics = () => ({
  SMTP_HOST: smtpHost || '',
  SMTP_PORT: smtpPort,
  EMAIL_USER: smtpUser || '',
  EMAIL_FROM: smtpFrom || '',
  EMAIL_PASS_EXISTS: Boolean(smtpPass),
  EMAIL_PASS_LENGTH: smtpPass?.length ?? 0,
});

if (process.env.NODE_ENV === 'development') {
  console.info('[Email] SMTP configuration', getSmtpConfigurationDiagnostics());
}

const hasUsableSmtpConfig = Boolean(
  smtpHost &&
  smtpUser &&
  smtpPass &&
  smtpFrom &&
  Number.isInteger(smtpPort) &&
  smtpPort > 0 &&
  smtpPort < 65536
);

const transporter = hasUsableSmtpConfig
  ? nodemailer.createTransport({
      host: smtpHost,
      port: smtpPort,
      secure: smtpPort === 465,
      auth: {
        user: smtpUser,
        pass: smtpPass,
      },
    })
  : null;

const sendEmail = async (to: string, subject: string, html: string) => {
  if (!transporter) {
    if (process.env.NODE_ENV === 'development') {
      console.warn('[Email] SMTP is not configured; verification email was not sent.');
      return;
    }

    throw new Error('Email service is not configured. Set SMTP_HOST, SMTP_PORT, EMAIL_USER, EMAIL_PASS, and EMAIL_FROM.');
  }

  try {
    const info = await transporter.sendMail({
      from: smtpFrom,
      sender: smtpFrom,
      replyTo: smtpFrom,
      to,
      subject,
      html,
      headers: {
        'List-Unsubscribe': '<mailto:unsubscribe@metricores.com>',
        'X-Priority': '3',
        'X-MSMail-Priority': 'Normal',
        'Importance': 'Normal',
      },
    });

    console.info('[Email] SMTP send result', {
      acceptedRecipients: info.accepted.length,
      rejectedRecipients: info.rejected.length,
      responseCode: Number(info.response?.match(/^(\d{3})/)?.[1]) || undefined,
    });
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      const smtpError = error as Error & {
        code?: string;
        command?: string;
        responseCode?: number;
      };
      let message = smtpError.message || String(error);
      for (const secret of [smtpUser, smtpPass, smtpFrom, to]) {
        if (secret) message = message.split(secret).join('[redacted]');
      }

      console.error('[Email] SMTP delivery failed', {
        code: smtpError.code,
        command: smtpError.command,
        responseCode: smtpError.responseCode,
        message: message.slice(0, 500),
      });
      console.warn('[Email] Verification email was not sent.');
      return;
    }

    throw error;
  }
};

export const verifySmtpConnection = async () => {
  if (!transporter) {
    throw new Error('SMTP configuration is incomplete; check the safe configuration diagnostic.');
  }

  await transporter.verify();
};

export const sendVerificationEmail = async (email: string, fullName: string, token: string) => {
  // Point directly to the API route so the server can verify and redirect
  const verificationUrl = `${process.env.NEXTAUTH_URL}/api/auth/verify-email?token=${token}`;
  
  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <title>Verify your email - Metricores</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
      background-color: #f8fafc;
      color: #1e293b;
      line-height: 1.6;
    }
    .container {
      max-width: 600px;
      margin: 0 auto;
      padding: 40px 20px;
    }
    .card {
      background-color: #ffffff;
      border: 1px solid #e2e8f0;
      border-radius: 12px;
      padding: 40px;
      box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
    }
    .logo {
      margin-bottom: 24px;
      display: flex;
      align-items: center;
    }
    .logo img {
      height: 40px;
      width: auto;
      display: block;
    }
    h1 {
      font-size: 24px;
      font-weight: 600;
      color: #0f172a;
      margin-bottom: 16px;
    }
    p {
      color: #475569;
      margin-bottom: 24px;
      font-size: 16px;
    }
    .button {
      display: inline-block;
      padding: 14px 32px;
      background: #18181b;
      color: #ffffff;
      text-decoration: none;
      border-radius: 8px;
      font-weight: 600;
      margin-bottom: 24px;
    }
    .fallback {
      word-break: break-all;
      color: #64748b;
      font-size: 14px;
      margin-bottom: 24px;
    }
    .expiry {
      background-color: #f1f5f9;
      padding: 16px;
      border-radius: 8px;
      border: 1px solid #e2e8f0;
      margin-bottom: 24px;
    }
    .expiry p {
      margin: 0;
      font-size: 14px;
      color: #475569;
    }
    .security {
      font-size: 13px;
      color: #64748b;
      border-top: 1px solid #e2e8f0;
      padding-top: 24px;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="card">
      <div class="logo">
        <img src="${process.env.NEXTAUTH_URL}/Logo.png" alt="Metricores" />
      </div>
      <h1>Verify your email address</h1>
      <p>Hi ${fullName},</p>
      <p>Thanks for signing up for Metricores! Please verify your email address to get started.</p>
      <a href="${verificationUrl}" class="button">Verify Email Address</a>
      <p class="fallback">Or copy and paste this link into your browser:</p>
      <p class="fallback">${verificationUrl}</p>
      <div class="expiry">
        <p>This link will expire in 24 hours for security reasons.</p>
      </div>
      <div class="security">
        <p>If you didn't create an account with Metricores, you can safely ignore this email.</p>
      </div>
    </div>
  </div>
</body>
</html>
  `;
  
  await sendEmail(email, 'Verify your email - Metricores', html);
};

export const sendPasswordResetEmail = async (email: string, fullName: string, token: string) => {
  const resetUrl = `${process.env.NEXTAUTH_URL}/reset-password?token=${token}`;
  
  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <title>Reset your password - Metricores</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
      background-color: #f8fafc;
      color: #1e293b;
      line-height: 1.6;
    }
    .container {
      max-width: 600px;
      margin: 0 auto;
      padding: 40px 20px;
    }
    .card {
      background-color: #ffffff;
      border: 1px solid #e2e8f0;
      border-radius: 12px;
      padding: 40px;
      box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
    }
    .logo {
      margin-bottom: 24px;
      display: flex;
      align-items: center;
    }
    .logo img {
      height: 40px;
      width: auto;
      display: block;
    }
    h1 {
      font-size: 24px;
      font-weight: 600;
      color: #0f172a;
      margin-bottom: 16px;
    }
    p {
      color: #475569;
      margin-bottom: 24px;
      font-size: 16px;
    }
    .button {
      display: inline-block;
      padding: 14px 32px;
      background: #18181b;
      color: #ffffff;
      text-decoration: none;
      border-radius: 8px;
      font-weight: 600;
      margin-bottom: 24px;
    }
    .fallback {
      word-break: break-all;
      color: #64748b;
      font-size: 14px;
      margin-bottom: 24px;
    }
    .expiry {
      background-color: #f1f5f9;
      padding: 16px;
      border-radius: 8px;
      border: 1px solid #e2e8f0;
      margin-bottom: 24px;
    }
    .expiry p {
      margin: 0;
      font-size: 14px;
      color: #475569;
    }
    .security {
      font-size: 13px;
      color: #64748b;
      border-top: 1px solid #e2e8f0;
      padding-top: 24px;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="card">
      <div class="logo">
        <img src="${process.env.NEXTAUTH_URL}/Logo.png" alt="Metricores" />
      </div>
      <h1>Reset your password</h1>
      <p>Hi ${fullName},</p>
      <p>We received a request to reset the password for your Metricores account.</p>
      <a href="${resetUrl}" class="button">Reset Password</a>
      <p class="fallback">Or copy and paste this link into your browser:</p>
      <p class="fallback">${resetUrl}</p>
      <div class="expiry">
        <p>This link will expire in 1 hour for security reasons.</p>
      </div>
      <div class="security">
        <p>If you didn't request this, you can safely ignore this email. Your password won't change unless you click the link above.</p>
      </div>
    </div>
  </div>
</body>
</html>
  `;
  
  await sendEmail(email, 'Reset your password - Metricores', html);
};

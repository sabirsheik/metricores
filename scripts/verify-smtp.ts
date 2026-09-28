import nextEnv from '@next/env';

nextEnv.loadEnvConfig(process.cwd(), true);

const { getSmtpConfigurationDiagnostics, verifySmtpConnection } = await import('../lib/email');
const diagnostics = getSmtpConfigurationDiagnostics();

console.info('[SMTP verification] Runtime environment', diagnostics);

if (!diagnostics.EMAIL_PASS_EXISTS) {
  console.error('[SMTP verification] EMAIL_PASS is empty. Set the Google App Password in .env.local.');
  process.exitCode = 1;
} else {
  try {
    await verifySmtpConnection();
    console.info('[SMTP verification] Gmail authentication succeeded.');
  } catch (error) {
    const smtpError = error as Error & {
      code?: string;
      command?: string;
      responseCode?: number;
    };

    console.error('[SMTP verification] Gmail authentication failed', {
      code: smtpError.code,
      command: smtpError.command,
      responseCode: smtpError.responseCode,
    });
    process.exitCode = 1;
  }
}
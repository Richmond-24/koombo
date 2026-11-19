import { APP_URL, BRAND_NAME } from '@/lib/email-utils/email-config';
import type { EmailTemplateResult } from '@/lib/email-utils/email-types';
import { renderBaseEmailLayout } from './base-layout';

export function generatePasswordResetTemplate({
  name,
  resetUrl,
  appUrl = APP_URL,
}: {
  name?: string;
  resetUrl: string;
  appUrl?: string;
}): EmailTemplateResult {
  const customerName = name ? ` ${name}` : '';

  const html = renderBaseEmailLayout({
    title: 'Reset your password',
    preheader: 'Use this secure link to update the password for your Koombo account.',
    body: `
      <p style="margin: 0 0 16px;">Hi${customerName},</p>
      <p style="margin: 0 0 16px;">We received a request to reset the password for your ${BRAND_NAME} account.</p>
      <p style="margin: 0 0 16px;">Click below to choose a new password. If you did not request this change, you can safely ignore this email and your account will remain protected.</p>
    `,
    ctaUrl: resetUrl,
    ctaLabel: 'Reset password',
    secondaryCtaUrl: appUrl,
    secondaryCtaLabel: 'Return to Koombo',
  });

  return {
    subject: 'Reset your Koombo password',
    html,
    text: `Reset your Koombo password.\n\nHi${customerName},\nWe received a request to reset your password. Visit: ${resetUrl}\nIf you did not ask for this, ignore this email.`,
  };
}

import { APP_URL, BRAND_NAME } from '@/lib/email-utils/email-config';
import type { EmailTemplateResult } from '@/lib/email-utils/email-types';
import { renderBaseEmailLayout } from './base-layout';

export function generateVerificationTemplate({
  name,
  verificationUrl,
  appUrl = APP_URL,
}: {
  name?: string;
  verificationUrl: string;
  appUrl?: string;
}): EmailTemplateResult {
  const customerName = name ? ` ${name}` : '';

  const html = renderBaseEmailLayout({
    title: 'Verify your email address',
    preheader: 'Confirm your email to complete your Koombo account setup.',
    body: `
      <p style="margin: 0 0 16px;">Hi${customerName},</p>
      <p style="margin: 0 0 16px;">To finish setting up your ${BRAND_NAME} account, confirm your email address by clicking the button below.</p>
      <p style="margin: 0 0 16px;">This helps keep your account secure and ensures you receive important updates about your orders and listings.</p>
    `,
    ctaUrl: verificationUrl,
    ctaLabel: 'Verify my email',
    secondaryCtaUrl: appUrl,
    secondaryCtaLabel: 'Open Koombo',
  });

  const text = `Verify your email address for ${BRAND_NAME}.\n\nHi${customerName},\nTo finish setting up your account, visit: ${verificationUrl}\nYou can also continue to ${appUrl}.`;

  return {
    subject: 'Verify your Koombo email',
    html,
    text,
  };
}

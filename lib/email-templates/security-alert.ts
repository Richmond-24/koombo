import { APP_URL, BRAND_NAME } from '@/lib/email-utils/email-config';
import type { EmailTemplateResult } from '@/lib/email-utils/email-types';
import { renderBaseEmailLayout } from './base-layout';

export function generateSecurityAlertTemplate({
  name,
  action,
  appUrl = APP_URL,
}: {
  name?: string;
  action: string;
  appUrl?: string;
}): EmailTemplateResult {
  const customerName = name ? ` ${name}` : '';

  const html = renderBaseEmailLayout({
    title: 'Security alert',
    preheader: 'A security update requires your attention on your Koombo account.',
    body: `
      <p style="margin: 0 0 16px;">Hi${customerName},</p>
      <p style="margin: 0 0 16px;">We noticed an important security update related to your ${BRAND_NAME} account:</p>
      <p style="margin: 0 0 16px; font-weight: 700; color: #111827;">${action}</p>
      <p style="margin: 0 0 16px;">Please review your account activity and take action if this was not expected. For your protection, we recommend needing to review recent login activity and updating your password if needed.</p>
    `,
    ctaUrl: appUrl,
    ctaLabel: 'Review account',
  });

  return {
    subject: 'Important security update for your Koombo account',
    html,
    text: `Security alert for ${BRAND_NAME}.\n\nHi${customerName},\n${action}\nPlease review your account activity at ${appUrl}.`,
  };
}

import { APP_URL, BRAND_NAME } from '@/lib/email-utils/email-config';
import type { EmailTemplateResult } from '@/lib/email-utils/email-types';
import { renderBaseEmailLayout } from './base-layout';

export function generateBonanzaEntryTemplate({
  name,
  entryReference,
  appUrl = APP_URL,
}: {
  name?: string;
  entryReference?: string;
  appUrl?: string;
}): EmailTemplateResult {
  const customerName = name ? ` ${name}` : '';
  const entryText = entryReference ? `Your entry reference is <strong>${entryReference}</strong>.` : 'Your entry has been recorded successfully.';

  const html = renderBaseEmailLayout({
    title: 'You’re in for the Koombo Bonanza',
    preheader: 'Your Koombo Bonanza entry has been confirmed.',
    body: `
      <p style="margin: 0 0 16px;">Hi${customerName},</p>
      <p style="margin: 0 0 16px;">Thanks for entering the ${BRAND_NAME} Bonanza. Your participation has been confirmed and you're now in the draw.</p>
      <p style="margin: 0 0 16px;">${entryText}</p>
      <p style="margin: 0 0 16px;">Keep an eye on your inbox for the next update, prize list, and winner announcement.</p>
    `,
    ctaUrl: appUrl,
    ctaLabel: 'View Koombo',
  });

  return {
    subject: 'Your Koombo Bonanza entry is confirmed',
    html,
    text: `Bonanza entry confirmed. Hi${customerName}, your Koombo Bonanza entry has been recorded. ${entryReference ? `Reference: ${entryReference}.` : ''} Visit ${appUrl} for updates.`,
  };
}

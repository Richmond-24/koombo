import { APP_URL, BRAND_NAME } from '@/lib/email-utils/email-config';
import type { EmailTemplateResult } from '@/lib/email-utils/email-types';
import { renderBaseEmailLayout } from './base-layout';

export function generateBonanzaWinnerTemplate({
  name,
  prize,
  appUrl = APP_URL,
}: {
  name?: string;
  prize?: string;
  appUrl?: string;
}): EmailTemplateResult {
  const customerName = name ? ` ${name}` : '';
  const prizeLine = prize ? `You won: <strong>${prize}</strong>.` : 'You are one of our verified winners.';

  const html = renderBaseEmailLayout({
    title: 'Congratulations! You’re a winner',
    preheader: 'Your Koombo Bonanza prize has been verified and confirmed.',
    body: `
      <p style="margin: 0 0 16px;">Hi${customerName},</p>
      <p style="margin: 0 0 16px;">We’re pleased to announce that your Bonanza entry was verified and selected as a winner.</p>
      <p style="margin: 0 0 16px;">${prizeLine}</p>
      <p style="margin: 0 0 16px;">Our team will follow up with the details needed to complete your prize claim.</p>
    `,
    ctaUrl: appUrl,
    ctaLabel: 'Open Koombo',
  });

  return {
    subject: 'Congratulations — you’re a Koombo Bonanza winner',
    html,
    text: `Congratulations! Hi${customerName}, your Koombo Bonanza entry was verified and selected as a winner. ${prize ? `Prize: ${prize}.` : ''} Visit ${appUrl} for next steps.`,
  };
}

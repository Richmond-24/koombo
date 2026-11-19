import { APP_URL, BRAND_NAME, BRAND_PRIMARY } from '@/lib/email-utils/email-config';
import { renderBaseEmailLayout } from './base-layout';
import type { EmailTemplateResult } from '@/lib/email-utils/email-types';

export function generateWelcomeTemplate({
  name,
  appUrl = APP_URL,
}: {
  name?: string;
  appUrl?: string;
}): EmailTemplateResult {
  const customerName = name ? ` ${name}` : '';
  const html = renderBaseEmailLayout({
    title: `Welcome to ${BRAND_NAME}${customerName}!`,
    preheader: 'Your Koombo account is ready. Explore listings, sellers, and secure commerce.',
    body: `
      <p style="margin: 0 0 16px;">Hi${customerName},</p>
      <p style="margin: 0 0 16px;">You’re all set. ${BRAND_NAME} is here to help you discover products, connect with trusted sellers, and enjoy a safer, faster shopping experience.</p>
      <p style="margin: 0 0 16px;">Start exploring, save your favorite finds, and watch for your next great deal.</p>
      <p style="margin: 0;">Thanks for joining the ${BRAND_NAME} community.</p>
    `,
    ctaUrl: appUrl,
    ctaLabel: 'Explore Koombo',
  });

  const text = `Welcome to ${BRAND_NAME}${customerName}!\n\nYour Koombo account is ready. Explore listings, sellers, and secure commerce at ${appUrl}.\n\nThanks for joining the Koombo community.`;

  return {
    subject: `Welcome to ${BRAND_NAME}!`,
    html,
    text,
  };
}

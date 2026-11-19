import { APP_URL, BRAND_NAME } from '@/lib/email-utils/email-config';
import type { EmailTemplateResult } from '@/lib/email-utils/email-types';
import { renderBaseEmailLayout } from './base-layout';

export function generateOrderStatusTemplate({
  name,
  orderNumber,
  status,
  nextStep,
  appUrl = APP_URL,
}: {
  name?: string;
  orderNumber: string;
  status: string;
  nextStep?: string;
  appUrl?: string;
}): EmailTemplateResult {
  const customerName = name ? ` ${name}` : '';
  const nextStepText = nextStep ? `<p style="margin: 0 0 16px;">Next step: <strong>${nextStep}</strong>.</p>` : '';

  const html = renderBaseEmailLayout({
    title: `Order update: ${status}`,
    preheader: `Your ${BRAND_NAME} order has a new status update.`,
    body: `
      <p style="margin: 0 0 16px;">Hi${customerName},</p>
      <p style="margin: 0 0 16px;">The status of order <strong>#${orderNumber}</strong> is now <strong>${status}</strong>.</p>
      ${nextStepText}
      <p style="margin: 0;">We’ll keep you posted as your order continues through the process.</p>
    `,
    ctaUrl: appUrl,
    ctaLabel: 'Check order',
  });

  return {
    subject: `Order update for #${orderNumber}: ${status}`,
    html,
    text: `Order status update. Hi${customerName}, order #${orderNumber} is now ${status}. ${nextStep ? `Next step: ${nextStep}.` : ''} Visit ${appUrl} for details.`,
  };
}

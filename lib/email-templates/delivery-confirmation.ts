import { APP_URL, BRAND_NAME } from '@/lib/email-utils/email-config';
import type { EmailTemplateResult } from '@/lib/email-utils/email-types';
import { renderBaseEmailLayout } from './base-layout';

export function generateDeliveryConfirmationTemplate({
  name,
  orderNumber,
  deliveryDate,
  trackingUrl,
  appUrl = APP_URL,
}: {
  name?: string;
  orderNumber: string;
  deliveryDate?: string;
  trackingUrl?: string;
  appUrl?: string;
}): EmailTemplateResult {
  const customerName = name ? ` ${name}` : '';
  const deliveryLine = deliveryDate ? `It was delivered on <strong>${deliveryDate}</strong>.` : 'Your order has been delivered successfully.';
  const trackingCta = trackingUrl ? { ctaUrl: trackingUrl, ctaLabel: 'Track delivery' } : undefined;

  const html = renderBaseEmailLayout({
    title: 'Your order has arrived',
    preheader: `Your ${BRAND_NAME} order has been delivered.`,
    body: `
      <p style="margin: 0 0 16px;">Hi${customerName},</p>
      <p style="margin: 0 0 16px;">We’re happy to confirm that order <strong>#${orderNumber}</strong> has been delivered.</p>
      <p style="margin: 0 0 16px;">${deliveryLine}</p>
      <p style="margin: 0;">We hope you enjoy your purchase and look forward to serving you again.</p>
    `,
    ctaUrl: trackingCta?.ctaUrl ?? appUrl,
    ctaLabel: trackingCta?.ctaLabel ?? 'View order',
  });

  return {
    subject: `Your ${BRAND_NAME} order #${orderNumber} has been delivered`,
    html,
    text: `Delivery confirmed. Hi${customerName}, order #${orderNumber} has been delivered${deliveryDate ? ` on ${deliveryDate}` : ''}.`,
  };
}

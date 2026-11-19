import { APP_URL, BRAND_NAME } from '@/lib/email-utils/email-config';
import type { EmailTemplateResult } from '@/lib/email-utils/email-types';
import { renderBaseEmailLayout } from './base-layout';

export function generatePaymentConfirmationTemplate({
  name,
  orderNumber,
  amount,
  appUrl = APP_URL,
}: {
  name?: string;
  orderNumber: string;
  amount?: string;
  appUrl?: string;
}): EmailTemplateResult {
  const customerName = name ? ` ${name}` : '';
  const amountText = amount ? ` of ${amount}` : '';

  const html = renderBaseEmailLayout({
    title: 'Payment received',
    preheader: 'Your payment has been verified and your order is moving forward.',
    body: `
      <p style="margin: 0 0 16px;">Hi${customerName},</p>
      <p style="margin: 0 0 16px;">We’ve successfully verified your payment for order <strong>#${orderNumber}</strong>${amountText}.</p>
      <p style="margin: 0 0 16px;">Your order is now being processed and you’ll receive updates as it moves through fulfillment.</p>
    `,
    ctaUrl: appUrl,
    ctaLabel: 'View order',
  });

  return {
    subject: `Payment confirmed for ${BRAND_NAME} order #${orderNumber}`,
    html,
    text: `Payment verified. Hi${customerName}, we’ve received payment for order #${orderNumber}${amountText}. Visit ${appUrl} for your order details.`,
  };
}

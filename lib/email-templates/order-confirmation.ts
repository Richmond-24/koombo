import { APP_URL, BRAND_NAME } from '@/lib/email-utils/email-config';
import type { EmailTemplateResult } from '@/lib/email-utils/email-types';
import { renderBaseEmailLayout } from './base-layout';

export function generateOrderConfirmationTemplate({
  name,
  orderNumber,
  total,
  appUrl = APP_URL,
}: {
  name?: string;
  orderNumber: string;
  total?: string;
  appUrl?: string;
}): EmailTemplateResult {
  const customerName = name ? ` ${name}` : '';
  const totalText = total ? ` for ${total}` : '';

  const html = renderBaseEmailLayout({
    title: 'Order confirmed',
    preheader: `Your ${BRAND_NAME} order has been received and is being prepared.`,
    body: `
      <p style="margin: 0 0 16px;">Hi${customerName},</p>
      <p style="margin: 0 0 16px;">Your order <strong>#${orderNumber}</strong> has been confirmed successfully${totalText}.</p>
      <p style="margin: 0 0 16px;">We’ve received your purchase and will keep you updated as it moves through fulfillment and delivery.</p>
      <p style="margin: 0;">Thank you for shopping with ${BRAND_NAME}.</p>
    `,
    ctaUrl: appUrl,
    ctaLabel: 'Track order',
  });

  return {
    subject: `Your ${BRAND_NAME} order #${orderNumber} is confirmed`,
    html,
    text: `Order confirmed. Hi${customerName}, your Koombo order #${orderNumber} has been received${totalText}. Track updates at ${appUrl}.`,
  };
}

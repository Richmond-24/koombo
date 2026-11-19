import { getResendClient } from './resend';
import {
  generateBonanzaEntryTemplate,
  generateBonanzaWinnerTemplate,
  generateDeliveryConfirmationTemplate,
  generateOrderConfirmationTemplate,
  generateOrderStatusTemplate,
  generatePasswordResetTemplate,
  generatePaymentConfirmationTemplate,
  generateSecurityAlertTemplate,
  generateVerificationTemplate,
  generateWelcomeTemplate,
} from './email-templates';
import { APP_URL, DEFAULT_SENDER, SUPPORT_EMAIL } from './email-utils/email-config';
import { logEmailEvent } from './email-utils/email-logger';
import type {
  EmailDeliveryResponse,
  EmailNotificationType,
  EmailRecipient,
  EmailSendOptions,
  EmailTag,
} from './email-utils/email-types';
import { normalizeEmailRecipient, validateRequiredFields } from './email-utils/validation';

const notificationCache = new Map<string, number>();
const DEDUPE_WINDOW_MS = 1000 * 60 * 60 * 24;

type EmailTarget = string | EmailRecipient;

function normalizeTarget(to: EmailTarget): EmailRecipient {
  if (typeof to === 'string') {
    return normalizeEmailRecipient({ email: to });
  }

  return normalizeEmailRecipient(to);
}

function buildDedupeKey(type: EmailNotificationType, recipient: EmailRecipient, reference?: string): string {
  return `${type}:${recipient.email.toLowerCase()}:${(reference || 'default').toLowerCase()}`;
}

async function sendTransactionalEmail({
  to,
  type,
  subject,
  html,
  text,
  tags,
  dedupeKey,
  replyTo = SUPPORT_EMAIL,
}: EmailSendOptions): Promise<EmailDeliveryResponse> {
  const recipient = normalizeTarget(to);

  const missingFields = validateRequiredFields(
    { email: recipient.email, subject, html, text },
    ['email', 'subject', 'html', 'text'],
  );

  if (missingFields.length > 0) {
    const error = `Missing required email fields: ${missingFields.join(', ')}`;
    return {
      success: false,
      status: 'failed',
      provider: 'resend',
      error,
    };
  }

  const resolvedDedupeKey = dedupeKey || buildDedupeKey(type, recipient);
  const now = Date.now();
  const lastSentAt = notificationCache.get(resolvedDedupeKey);

  if (lastSentAt && now - lastSentAt < DEDUPE_WINDOW_MS) {
    logEmailEvent({
      recipient: recipient.email,
      type,
      status: 'skipped',
    });

    return {
      success: true,
      skipped: true,
      status: 'skipped',
      provider: 'resend',
    };
  }

  notificationCache.set(resolvedDedupeKey, now);

  try {
    const resend = getResendClient();
    const payload = {
      from: DEFAULT_SENDER,
      to: [{ email: recipient.email, name: recipient.name }],
      reply_to: replyTo,
      subject,
      html,
      text,
      ...(tags && tags.length > 0 ? { tags: tags.map((tag: EmailTag) => ({ name: tag.name, value: tag.value })) } : {}),
    };

    const result = await resend.emails.send(payload as any);
    const messageId = (result as any)?.data?.id || (result as any)?.id || undefined;

    if ((result as any)?.error) {
      throw new Error((result as any).error.message || 'Resend delivery failed.');
    }

    logEmailEvent({
      recipient: recipient.email,
      type,
      status: 'sent',
      messageId,
    });

    return {
      success: true,
      status: 'sent',
      provider: 'resend',
      id: messageId,
      messageId,
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown email delivery error';
    logEmailEvent({
      recipient: recipient.email,
      type,
      status: 'failed',
      error: message,
    });

    return {
      success: false,
      status: 'failed',
      provider: 'resend',
      error: message,
    };
  }
}

export async function sendWelcomeEmail({
  to,
  name,
  appUrl = APP_URL,
}: {
  to: EmailTarget;
  name?: string;
  appUrl?: string;
}): Promise<EmailDeliveryResponse> {
  const { subject, html, text } = generateWelcomeTemplate({ name, appUrl });

  return sendTransactionalEmail({
    to,
    type: 'welcome',
    subject,
    html,
    text,
    tags: [{ name: 'category', value: 'welcome' }],
  });
}

export async function sendVerificationEmail({
  to,
  name,
  verificationUrl,
  appUrl = APP_URL,
}: {
  to: EmailTarget;
  name?: string;
  verificationUrl: string;
  appUrl?: string;
}): Promise<EmailDeliveryResponse> {
  const { subject, html, text } = generateVerificationTemplate({ name, verificationUrl, appUrl });

  return sendTransactionalEmail({
    to,
    type: 'verification',
    subject,
    html,
    text,
    dedupeKey: `verification:${typeof to === 'string' ? to : to.email}:${verificationUrl}`,
    tags: [{ name: 'category', value: 'verification' }],
  });
}

export async function sendPasswordResetEmail({
  to,
  name,
  resetUrl,
  appUrl = APP_URL,
}: {
  to: EmailTarget;
  name?: string;
  resetUrl: string;
  appUrl?: string;
}): Promise<EmailDeliveryResponse> {
  const { subject, html, text } = generatePasswordResetTemplate({ name, resetUrl, appUrl });

  return sendTransactionalEmail({
    to,
    type: 'password-reset',
    subject,
    html,
    text,
    dedupeKey: `password-reset:${typeof to === 'string' ? to : to.email}:${resetUrl}`,
    tags: [{ name: 'category', value: 'password-reset' }],
  });
}

export async function sendSecurityAlertEmail({
  to,
  name,
  action,
  appUrl = APP_URL,
}: {
  to: EmailTarget;
  name?: string;
  action: string;
  appUrl?: string;
}): Promise<EmailDeliveryResponse> {
  const { subject, html, text } = generateSecurityAlertTemplate({ name, action, appUrl });

  return sendTransactionalEmail({
    to,
    type: 'security-alert',
    subject,
    html,
    text,
    tags: [{ name: 'category', value: 'security-alert' }],
  });
}

export async function sendBonanzaEntryEmail({
  to,
  name,
  entryReference,
  appUrl = APP_URL,
}: {
  to: EmailTarget;
  name?: string;
  entryReference?: string;
  appUrl?: string;
}): Promise<EmailDeliveryResponse> {
  const { subject, html, text } = generateBonanzaEntryTemplate({ name, entryReference, appUrl });

  return sendTransactionalEmail({
    to,
    type: 'bonanza-entry',
    subject,
    html,
    text,
    dedupeKey: `bonanza-entry:${typeof to === 'string' ? to : to.email}:${entryReference || 'default'}`,
    tags: [{ name: 'category', value: 'bonanza' }],
  });
}

export async function sendBonanzaWinnerEmail({
  to,
  name,
  prize,
  appUrl = APP_URL,
}: {
  to: EmailTarget;
  name?: string;
  prize?: string;
  appUrl?: string;
}): Promise<EmailDeliveryResponse> {
  const { subject, html, text } = generateBonanzaWinnerTemplate({ name, prize, appUrl });

  return sendTransactionalEmail({
    to,
    type: 'bonanza-winner',
    subject,
    html,
    text,
    dedupeKey: `bonanza-winner:${typeof to === 'string' ? to : to.email}:${prize || 'default'}`,
    tags: [{ name: 'category', value: 'bonanza' }],
  });
}

export async function sendOrderConfirmationEmail({
  to,
  name,
  orderNumber,
  total,
  appUrl = APP_URL,
}: {
  to: EmailTarget;
  name?: string;
  orderNumber: string;
  total?: string;
  appUrl?: string;
}): Promise<EmailDeliveryResponse> {
  const { subject, html, text } = generateOrderConfirmationTemplate({ name, orderNumber, total, appUrl });

  return sendTransactionalEmail({
    to,
    type: 'order-confirmation',
    subject,
    html,
    text,
    dedupeKey: `order-confirmation:${typeof to === 'string' ? to : to.email}:${orderNumber}`,
    tags: [{ name: 'category', value: 'commerce' }],
  });
}

export async function sendPaymentConfirmationEmail({
  to,
  name,
  orderNumber,
  amount,
  appUrl = APP_URL,
}: {
  to: EmailTarget;
  name?: string;
  orderNumber: string;
  amount?: string;
  appUrl?: string;
}): Promise<EmailDeliveryResponse> {
  const { subject, html, text } = generatePaymentConfirmationTemplate({ name, orderNumber, amount, appUrl });

  return sendTransactionalEmail({
    to,
    type: 'payment-confirmation',
    subject,
    html,
    text,
    dedupeKey: `payment-confirmation:${typeof to === 'string' ? to : to.email}:${orderNumber}`,
    tags: [{ name: 'category', value: 'commerce' }],
  });
}

export async function sendOrderStatusEmail({
  to,
  name,
  orderNumber,
  status,
  nextStep,
  appUrl = APP_URL,
}: {
  to: EmailTarget;
  name?: string;
  orderNumber: string;
  status: string;
  nextStep?: string;
  appUrl?: string;
}): Promise<EmailDeliveryResponse> {
  const { subject, html, text } = generateOrderStatusTemplate({ name, orderNumber, status, nextStep, appUrl });

  return sendTransactionalEmail({
    to,
    type: 'order-status',
    subject,
    html,
    text,
    dedupeKey: `order-status:${typeof to === 'string' ? to : to.email}:${orderNumber}:${status}`,
    tags: [{ name: 'category', value: 'commerce' }],
  });
}

export async function sendDeliveryConfirmationEmail({
  to,
  name,
  orderNumber,
  deliveryDate,
  trackingUrl,
  appUrl = APP_URL,
}: {
  to: EmailTarget;
  name?: string;
  orderNumber: string;
  deliveryDate?: string;
  trackingUrl?: string;
  appUrl?: string;
}): Promise<EmailDeliveryResponse> {
  const { subject, html, text } = generateDeliveryConfirmationTemplate({
    name,
    orderNumber,
    deliveryDate,
    trackingUrl,
    appUrl,
  });

  return sendTransactionalEmail({
    to,
    type: 'delivery-confirmation',
    subject,
    html,
    text,
    dedupeKey: `delivery-confirmation:${typeof to === 'string' ? to : to.email}:${orderNumber}`,
    tags: [{ name: 'category', value: 'commerce' }],
  });
}

export { APP_URL, DEFAULT_SENDER, SUPPORT_EMAIL };

export type EmailNotificationType =
  | 'welcome'
  | 'verification'
  | 'password-reset'
  | 'security-alert'
  | 'bonanza-entry'
  | 'bonanza-winner'
  | 'order-confirmation'
  | 'payment-confirmation'
  | 'order-status'
  | 'delivery-confirmation';

export interface EmailRecipient {
  email: string;
  name?: string;
}

export type EmailTarget = string | EmailRecipient;

export interface EmailTemplateResult {
  subject: string;
  html: string;
  text: string;
}

export interface EmailTag {
  name: string;
  value: string;
}

export interface EmailSendOptions {
  to: EmailTarget;
  type: EmailNotificationType;
  subject: string;
  html: string;
  text: string;
  tags?: EmailTag[];
  dedupeKey?: string;
  replyTo?: string;
}

export interface EmailDeliveryResponse {
  success: boolean;
  skipped?: boolean;
  status: 'queued' | 'sent' | 'failed' | 'skipped';
  id?: string;
  messageId?: string;
  provider?: 'resend';
  error?: string;
}

export interface NotificationPayload {
  recipient: EmailRecipient;
  type: EmailNotificationType;
  reference?: string;
  metadata?: Record<string, unknown>;
}

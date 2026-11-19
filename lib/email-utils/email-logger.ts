import type { EmailNotificationType } from './email-types';

export interface EmailLogEntry {
  recipient: string;
  type: EmailNotificationType;
  messageId?: string;
  timestamp: string;
  status: 'sent' | 'failed' | 'skipped';
  error?: string;
}

export function logEmailEvent({
  recipient,
  type,
  status,
  messageId,
  error,
}: {
  recipient: string;
  type: EmailNotificationType;
  status: EmailLogEntry['status'];
  messageId?: string;
  error?: string;
}): EmailLogEntry {
  const payload: EmailLogEntry = {
    recipient,
    type,
    timestamp: new Date().toISOString(),
    status,
    ...(messageId ? { messageId } : {}),
    ...(error ? { error } : {}),
  };

  if (status === 'failed') {
    console.error('[EMAIL FAILED]', JSON.stringify(payload));
    return payload;
  }

  console.info('[EMAIL]', JSON.stringify(payload));
  return payload;
}

export function isValidEmail(value: string): boolean {
  if (!value || typeof value !== 'string') return false;
  const trimmed = value.trim();
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed);
}

export function isValidUrl(value: string): boolean {
  if (!value || typeof value !== 'string') return false;
  try {
    const url = new URL(value);
    return ['http:', 'https:'].includes(url.protocol);
  } catch {
    return false;
  }
}

export function sanitizeForEmail(value: string, fallback = ''): string {
  if (typeof value !== 'string') {
    return fallback;
  }

  return value.replace(/[\u0000-\u001F\u007F]/g, '').trim() || fallback;
}

export function validateRequiredFields(
  values: Record<string, string | number | undefined | null>,
  required: string[],
): string[] {
  return required.filter((field) => {
    const value = values[field];
    return value === undefined || value === null || String(value).trim() === '';
  });
}

export function normalizeEmailRecipient(
  recipient: { email: string; name?: string },
): { email: string; name?: string } {
  const email = sanitizeForEmail(recipient.email).toLowerCase();

  if (!isValidEmail(email)) {
    throw new Error('A valid recipient email address is required.');
  }

  return {
    email,
    name: recipient.name ? sanitizeForEmail(recipient.name) : undefined,
  };
}

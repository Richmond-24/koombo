import { Resend } from 'resend';

const isServer = typeof window === 'undefined';
const apiKey = process.env.RESEND_API_KEY?.trim();

export function validateResendConfig(): string {
  if (!isServer) {
    throw new Error('Resend must only be initialized on the server side.');
  }

  if (!apiKey) {
    throw new Error('Missing required environment variable: RESEND_API_KEY');
  }

  return apiKey;
}

export function getResendClient(): Resend {
  const resolvedApiKey = validateResendConfig();
  return new Resend(resolvedApiKey);
}

export const resend = isServer && apiKey ? new Resend(apiKey) : null;

export default resend;

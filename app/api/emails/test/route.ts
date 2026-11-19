import { NextResponse } from 'next/server';
import {
  sendBonanzaEntryEmail,
  sendDeliveryConfirmationEmail,
  sendOrderConfirmationEmail,
  sendPasswordResetEmail,
  sendPaymentConfirmationEmail,
  sendVerificationEmail,
  sendWelcomeEmail,
} from '@/lib/email';
import { APP_URL } from '@/lib/email-utils/email-config';
import { isValidEmail } from '@/lib/email-utils/validation';

const emailTypeHandlers = {
  welcome: sendWelcomeEmail,
  verification: async ({ to, name, appUrl }: { to: string; name?: string; appUrl?: string }) =>
    sendVerificationEmail({ to, name, verificationUrl: `${appUrl || APP_URL}/verify?demo=1`, appUrl }),
  'password-reset': async ({ to, name, appUrl }: { to: string; name?: string; appUrl?: string }) =>
    sendPasswordResetEmail({ to, name, resetUrl: `${appUrl || APP_URL}/reset-password?demo=1`, appUrl }),
  'bonanza-entry': sendBonanzaEntryEmail,
  'order-confirmation': async ({ to, name, appUrl }: { to: string; name?: string; appUrl?: string }) =>
    sendOrderConfirmationEmail({ to, name, orderNumber: 'TEST-1001', total: '$49.99', appUrl }),
  'payment-confirmation': async ({ to, name, appUrl }: { to: string; name?: string; appUrl?: string }) =>
    sendPaymentConfirmationEmail({ to, name, orderNumber: 'TEST-1001', amount: '$49.99', appUrl }),
  'delivery-confirmation': async ({ to, name, appUrl }: { to: string; name?: string; appUrl?: string }) =>
    sendDeliveryConfirmationEmail({ to, name, orderNumber: 'TEST-1001', deliveryDate: 'Today', trackingUrl: `${appUrl || APP_URL}/orders/TEST-1001`, appUrl }),
};

export async function GET() {
  if (process.env.NODE_ENV === 'production') {
    return NextResponse.json({ error: 'Development email testing is disabled in production.' }, { status: 403 });
  }

  return NextResponse.json({
    ok: true,
    message: 'Development email test endpoint active.',
    supportedTypes: Object.keys(emailTypeHandlers),
  });
}

export async function POST(request: Request) {
  if (process.env.NODE_ENV === 'production') {
    return NextResponse.json({ error: 'Development email testing is disabled in production.' }, { status: 403 });
  }

  const providedSecret = request.headers.get('x-email-test-secret');
  const requiredSecret = process.env.EMAIL_TEST_SECRET?.trim();

  if (requiredSecret && providedSecret !== requiredSecret) {
    return NextResponse.json({ error: 'Unauthorized email test request.' }, { status: 401 });
  }

  let body: Record<string, unknown> = {};

  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    body = {};
  }

  const email = String(body.email || '').trim();
  const type = String(body.type || 'welcome');
  const name = String(body.name || 'Customer');
  const appUrl = String(body.appUrl || APP_URL);

  if (!isValidEmail(email)) {
    return NextResponse.json({ error: 'A valid email address is required.' }, { status: 400 });
  }

  const handler = emailTypeHandlers[type as keyof typeof emailTypeHandlers];

  if (!handler) {
    return NextResponse.json({ error: `Unsupported email type: ${type}` }, { status: 400 });
  }

  try {
    const result = await handler({ to: email, name, appUrl });
    return NextResponse.json(result, { status: result.success ? 200 : 500 });
  } catch (error) {
    return NextResponse.json({
      success: false,
      status: 'failed',
      provider: 'resend',
      error: error instanceof Error ? error.message : 'Unknown error',
    }, { status: 500 });
  }
}

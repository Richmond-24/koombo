import { NextResponse } from 'next/server';
import {
  sendBonanzaEntryEmail,
  sendDeliveryConfirmationEmail,
  sendOrderConfirmationEmail,
  sendOrderStatusEmail,
  sendPasswordResetEmail,
  sendPaymentConfirmationEmail,
  sendSecurityAlertEmail,
  sendVerificationEmail,
  sendWelcomeEmail,
} from '@/lib/email';

export async function POST(request: Request) {
  const providedSecret = request.headers.get('x-koombo-webhook-secret');
  const requiredSecret = process.env.EMAIL_WEBHOOK_SECRET?.trim();

  if (requiredSecret && providedSecret !== requiredSecret) {
    return NextResponse.json({ error: 'Unauthorized webhook request.' }, { status: 401 });
  }

  let payload: Record<string, any>;

  try {
    payload = (await request.json()) as Record<string, any>;
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body.' }, { status: 400 });
  }

  const event = String(payload.event || '').toLowerCase();
  const recipient = payload.recipient || payload.to || payload.customer || {};
  const email = String(recipient.email || payload.email || '');

  if (!email) {
    return NextResponse.json({ error: 'Recipient email is required.' }, { status: 400 });
  }

  const name = String(recipient.name || payload.name || 'Customer');
  const appUrl = String(payload.appUrl || process.env.APP_URL || 'https://koomboapp.com');

  try {
    const handlers: Record<string, () => Promise<any>> = {
      welcome: () => sendWelcomeEmail({ to: email, name, appUrl }),
      verification: () => sendVerificationEmail({ to: email, name, verificationUrl: String(payload.verificationUrl || `${appUrl}/verify`), appUrl }),
      'password-reset': () => sendPasswordResetEmail({ to: email, name, resetUrl: String(payload.resetUrl || `${appUrl}/reset-password`), appUrl }),
      'security-alert': () => sendSecurityAlertEmail({ to: email, name, action: String(payload.action || 'Your account security settings were updated.'), appUrl }),
      'bonanza-entry': () => sendBonanzaEntryEmail({ to: email, name, entryReference: String(payload.entryReference || 'BZN-ENTRY'), appUrl }),
      'order-confirmation': () => sendOrderConfirmationEmail({ to: email, name, orderNumber: String(payload.orderNumber || 'ORDER-0001'), total: String(payload.total || ''), appUrl }),
      'payment-confirmation': () => sendPaymentConfirmationEmail({ to: email, name, orderNumber: String(payload.orderNumber || 'ORDER-0001'), amount: String(payload.amount || ''), appUrl }),
      'order-status': () => sendOrderStatusEmail({ to: email, name, orderNumber: String(payload.orderNumber || 'ORDER-0001'), status: String(payload.status || 'Processing'), nextStep: String(payload.nextStep || ''), appUrl }),
      'delivery-confirmation': () => sendDeliveryConfirmationEmail({ to: email, name, orderNumber: String(payload.orderNumber || 'ORDER-0001'), deliveryDate: String(payload.deliveryDate || ''), trackingUrl: String(payload.trackingUrl || `${appUrl}/orders/${payload.orderNumber || 'ORDER-0001'}`), appUrl }),
    };

    const handler = handlers[event];

    if (!handler) {
      return NextResponse.json({ ok: true, skipped: true, reason: `Unsupported event: ${event}` }, { status: 200 });
    }

    const result = await handler();
    return NextResponse.json({ ok: result.success, result }, { status: result.success ? 200 : 500 });
  } catch (error) {
    return NextResponse.json({
      ok: false,
      error: error instanceof Error ? error.message : 'Unknown email webhook error',
    }, { status: 500 });
  }
}

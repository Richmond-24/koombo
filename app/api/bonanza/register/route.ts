import { NextResponse } from 'next/server';
import mongoose, { Schema } from 'mongoose';
import { Resend } from 'resend';

const MONGODB_URI = process.env.MONGODB_URI || process.env.NEXT_PUBLIC_MONGODB_URI || '';

const WaitlistSchema = new Schema({
  fullName: { type: String, required: true, trim: true, maxlength: 120 },
  email: { type: String, required: true, trim: true, lowercase: true, maxlength: 254, unique: true, index: true },
  phone: { type: String, trim: true, maxlength: 40, default: '' },
  registrationSource: { type: String, default: 'bonanza_campaign', immutable: true },
  waitlistStatus: { type: String, enum: ['New', 'Contacted', 'Early Community Member', 'Launch Notified'], default: 'New' },
  welcomeEmailStatus: { type: String, enum: ['pending', 'sent', 'failed'], default: 'pending' },
  welcomeEmailSentAt: { type: Date, default: null },
  welcomeEmailProvider: { type: String, default: 'resend' },
  welcomeEmailMessageId: { type: String, default: '' },
  welcomeEmailError: { type: String, default: '' },
  welcomeEmailAttempts: { type: Number, default: 0 },
  registeredAt: { type: Date, default: Date.now, index: true },
  existingFields: { type: Schema.Types.Mixed, default: {} },
}, { timestamps: true, collection: 'bonanza_waitlist' });

const BonanzaWaitlist = mongoose.models.BonanzaWaitlist || mongoose.model('BonanzaWaitlist', WaitlistSchema);

async function connect() {
  if (!MONGODB_URI) throw new Error('MONGODB_URI is not configured');
  if (mongoose.connection.readyState !== 1) await mongoose.connect(MONGODB_URI, { serverSelectionTimeoutMS: 10000 });
}

function welcomeHtml(name: string) {
  const firstName = name.trim().split(/\s+/)[0] || 'there';
  return `<!doctype html><html><body style="margin:0;background:#f7f5fb;font-family:Arial,sans-serif;color:#17102b"><div style="max-width:640px;margin:0 auto;background:#fff"><img src="https://koomboapp.com/email/koombo-banner.jpg" alt="Koombo Bonanza" style="width:100%;display:block"><div style="padding:36px 32px"><img src="https://koomboapp.com/email/koombo-logo.png" alt="Koombo" style="height:44px;margin-bottom:24px"><h1 style="font-size:28px">Welcome to Koombo, ${firstName}! 💜</h1><p>Thank you for joining the <strong>Koombo Bonanza</strong>. Your information has been successfully received.</p><p>Koombo is currently preparing for its official launch. Our vision is to become an agentic social commerce ecosystem in Africa—making it easier for people to discover, connect, and shop.</p><p>You are among the early people joining our growing community. We will keep you updated about the upcoming launch and community activities.</p><p>Get ready for an exciting new way to discover, connect, and shop.</p><p><strong>The Koombo Team 💜💜</strong></p></div></div></body></html>`;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const fullName = String(body.fullName || body.name || '').trim().replace(/\s+/g, ' ');
    const email = String(body.email || '').trim().toLowerCase();
    const phone = String(body.phone || body.phoneNumber || '').trim();

    if (!fullName || fullName.length > 120) return NextResponse.json({ success: false, error: 'Please enter your full name.' }, { status: 400 });
    if (!email || email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return NextResponse.json({ success: false, error: 'Please enter a valid email address.' }, { status: 400 });

    await connect();
    let record;
    try {
      record = await BonanzaWaitlist.create({
        fullName,
        email,
        phone,
        registrationSource: 'bonanza_campaign',
        existingFields: Object.fromEntries(Object.entries(body).filter(([key]) => !['fullName', 'name', 'email', 'phone', 'phoneNumber'].includes(key)).slice(0, 50)),
      });
    } catch (error: any) {
      if (error?.code === 11000) return NextResponse.json({ success: true, duplicate: true, message: 'You’re already on the Koombo list! Stay tuned for exciting updates.' });
      throw error;
    }

    record.welcomeEmailAttempts = 1;
    try {
      if (!process.env.RESEND_API_KEY) throw new Error('Missing Resend API configuration');
      const resend = new Resend(process.env.RESEND_API_KEY);
      const result = await resend.emails.send({
        from: 'Koombo Team 💜💜 <support@noreply.koomboapp.com>',
        to: [email],
        subject: 'Welcome to Koombo 💜 — You’re on the List!',
        html: welcomeHtml(fullName),
        text: `Welcome to Koombo, ${fullName}! Thank you for joining the Koombo Bonanza. Your information has been successfully received. Koombo is preparing for its official launch and building an agentic social commerce ecosystem in Africa. You are among our early community. Watch your inbox for launch and community updates. The Koombo Team 💜💜`,
        headers: { 'Idempotency-Key': `bonanza-welcome-${record._id}` },
      });
      if (result.error) throw new Error(result.error.message || 'Resend delivery failed');
      record.welcomeEmailStatus = 'sent';
      record.welcomeEmailSentAt = new Date();
      record.welcomeEmailMessageId = result.data?.id || '';
      record.welcomeEmailError = '';
    } catch (error) {
      record.welcomeEmailStatus = 'failed';
      record.welcomeEmailError = error instanceof Error ? error.message : 'Email delivery failed';
    }
    await record.save();

    return NextResponse.json({
      success: true,
      duplicate: false,
      emailStatus: record.welcomeEmailStatus,
      message: 'You’re officially on the Koombo list! 💜\n\nThank you for joining the Koombo Bonanza. Koombo is getting ready to introduce a new way to discover, connect and shop. You’re now part of our growing early community.\n\nKeep an eye on your inbox for updates!',
    }, { status: 201 });
  } catch (error) {
    console.error('[bonanza/register]', error);
    return NextResponse.json({ success: false, error: 'We could not save your registration. Please try again.' }, { status: 500 });
  }
}

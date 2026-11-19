'use client';

import React, { useState } from 'react';
import KoomboFooter from '../components/Footer';
import SiteHeader from '../components/SiteHeader';
import {
  ArrowUpRight,
  Check,
  ChevronDown,
  Clock,
  Copy,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  Send,
  ShieldCheck,
  TimerReset,
  User,
} from 'lucide-react';

const EMAIL = 'hello@koombo.app';
const PHONE_DISPLAY = '+233 53 119 0274';
const PHONE_HREF = 'tel:+233531190274';
const WHATSAPP_HREF =
  'https://wa.me/233531190274?text=' + encodeURIComponent('Hi Koombo, I need help with ');

/* Palette: royal purple + teal blue, near-black ink for borders */
const INK = '#17102B';
const PURPLE = '#5B21B6';
const PURPLE_DEEP = '#4C1D95';
const TEAL = '#0B7285';
const TINT = '#F3EFFF';

const TOPICS = [
  'Selling on Koombo',
  'Buying and orders',
  'Becoming a delivery partner',
  'Partnerships',
  'Report a problem',
  'Something else',
];

const highlights = [
  { title: 'Fast response', description: 'We usually reply within a few hours, any day of the week.', icon: TimerReset },
  { title: 'Real people', description: 'Talk to a team that knows buying, selling and growing on Koombo.', icon: ShieldCheck },
  { title: 'Any enquiry', description: 'Partnerships, listings or product support, all welcome.', icon: MessageCircle },
];

/* Scalloped badge outline (12 lobes) */
const BADGE_PATH = (() => {
  const pts: string[] = [];
  for (let i = 0; i <= 120; i++) {
    const t = (i / 120) * Math.PI * 2;
    const r = 44 + 3.2 * Math.cos(t * 12);
    pts.push(`${(50 + r * Math.cos(t)).toFixed(2)},${(50 + r * Math.sin(t)).toFixed(2)}`);
  }
  return `M${pts.join(' L')}Z`;
})();

function Badge() {
  return (
    <div aria-hidden="true" className="relative h-[72px] w-[72px] shrink-0 sm:h-28 sm:w-28">
      <svg viewBox="0 0 100 100" className="kb-spin absolute inset-0 h-full w-full">
        <path d={BADGE_PATH} fill={TEAL} stroke={INK} strokeWidth="2.5" strokeLinejoin="round" />
      </svg>
      <span className="absolute inset-0 grid place-content-center text-center font-extrabold leading-[1.05] text-white">
        <span className="text-[12px] sm:text-[17px]">Open</span>
        <span className="text-[15px] sm:text-[22px]">24/7</span>
      </span>
    </div>
  );
}

/* Shared field styles */
const fieldWrap =
  'flex h-12 items-center gap-3 rounded-xl bg-[#F1F2F4] px-4 transition focus-within:bg-white focus-within:ring-2 focus-within:ring-[#5B21B6] sm:h-14';
const inputCls =
  'h-full w-full min-w-0 bg-transparent text-base font-medium text-[#17102B] outline-none placeholder:text-[#17102B]/55';
const focus =
  'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#5B21B6]';
const chip =
  'flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border-2 border-[#17102B] bg-white text-[#5B21B6] sm:h-11 sm:w-11';

export default function ContactPage() {
  const [copied, setCopied] = useState(false);
  const [sent, setSent] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', phone: '', topic: '', message: '' });

  const set =
    (key: keyof typeof form) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
      setForm({ ...form, [key]: e.target.value });

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(EMAIL);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      /* clipboard unavailable: the mailto link still works */
    }
  };

  /* Opens the visitor's email app with everything filled in.
     Replace with your own API call if you want the form to send directly. */
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const subject = encodeURIComponent(`${form.topic}: ${form.name}`);
    const body = encodeURIComponent(
      `${form.message}\n\nName: ${form.name}\nEmail: ${form.email}\nPhone: ${form.phone || 'Not given'}`
    );
    window.location.href = `mailto:${EMAIL}?subject=${subject}&body=${body}`;
    setSent(true);
  };

  return (
    <main className="kb-font relative min-h-screen overflow-x-hidden bg-white text-[#17102B]">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@500;600;700;800&display=swap');

        .kb-font { font-family: 'Plus Jakarta Sans', ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif; }
        .kb-balance { text-wrap: balance; }

        @keyframes koombo-rise { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: none; } }
        @keyframes koombo-dot { 0%, 80%, 100% { transform: translateY(0); opacity: .5; } 40% { transform: translateY(-3px); opacity: 1; } }
        @keyframes koombo-spin { to { transform: rotate(360deg); } }
        .koombo-rise { animation: koombo-rise .7s cubic-bezier(.16,1,.3,1) both; }
        .koombo-dot { animation: koombo-dot 1.2s ease-in-out infinite; }
        .kb-spin { animation: koombo-spin 28s linear infinite; }

        @media (prefers-reduced-motion: reduce) {
          .koombo-rise, .koombo-dot, .kb-spin { animation: none !important; }
          * { transition: none !important; }
        }
      `}</style>

      {/* ---------- top colour band ---------- */}
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-[180px] overflow-hidden sm:h-[250px]"
        style={{ backgroundColor: PURPLE }}
      >
        <div
          className="absolute left-0 top-0 h-full w-24 sm:w-56"
          style={{
            backgroundImage: 'repeating-linear-gradient(135deg, rgba(255,255,255,.22) 0 6px, transparent 6px 18px)',
          }}
        />
        <div className="absolute inset-x-0 bottom-0 h-1/3" style={{ backgroundColor: PURPLE_DEEP }} />
      </div>

      <SiteHeader />

      <div className="relative mx-auto max-w-6xl px-3 pb-12 pt-20 sm:px-6 sm:pb-16 sm:pt-28 lg:px-8 lg:pb-24">
        {/* ---------- framed contact form ---------- */}
        <section
          className="koombo-rise relative rounded-[24px] border-[3px] bg-white p-4 sm:rounded-[36px] sm:p-10 lg:p-12"
          style={{ borderColor: INK }}
        >
          <div className="flex items-start justify-between gap-3">
            <h1
              className="kb-balance font-extrabold text-[#0D0B14]"
              style={{ fontSize: 'clamp(2rem, 8vw, 3.75rem)', lineHeight: 1.05, letterSpacing: '-0.04em' }}
            >
              Let&rsquo;s talk.
            </h1>
            <Badge />
          </div>

          <p className="mt-3 max-w-3xl text-[15px] leading-[1.55] text-[#17102B]/85 sm:mt-5 sm:text-xl sm:leading-relaxed">
            Want to sell, partner with us or get help? Send us a message on this form, email us at{' '}
            <a href={`mailto:${EMAIL}`} className={`font-semibold underline underline-offset-4 ${focus}`}>
              {EMAIL}
            </a>{' '}
            or chat with us on WhatsApp below.
          </p>

          <form onSubmit={handleSubmit} className="mt-6 space-y-3 sm:mt-10 sm:space-y-4">
            <div className="grid gap-3 sm:gap-4 md:grid-cols-3">
              <label className={fieldWrap}>
                <span className="sr-only">Your name</span>
                <User size={18} aria-hidden className="shrink-0 text-[#17102B]/70" />
                <input
                  required
                  type="text"
                  autoComplete="name"
                  placeholder="Your Name"
                  className={inputCls}
                  value={form.name}
                  onChange={set('name')}
                />
              </label>
              <label className={fieldWrap}>
                <span className="sr-only">Your email address</span>
                <Mail size={18} aria-hidden className="shrink-0 text-[#17102B]/70" />
                <input
                  required
                  type="email"
                  autoComplete="email"
                  placeholder="Your Email Address"
                  className={inputCls}
                  value={form.email}
                  onChange={set('email')}
                />
              </label>
              <label className={fieldWrap}>
                <span className="sr-only">Your phone number</span>
                <Phone size={18} aria-hidden className="shrink-0 text-[#17102B]/70" />
                <input
                  type="tel"
                  inputMode="tel"
                  autoComplete="tel"
                  placeholder="Your Phone Number"
                  className={inputCls}
                  value={form.phone}
                  onChange={set('phone')}
                />
              </label>
            </div>

            {/* topic bar */}
            <div className="relative h-12 rounded-xl bg-black sm:h-14">
              <select
                required
                aria-label="Select a topic"
                value={form.topic}
                onChange={set('topic')}
                className={`h-full w-full appearance-none rounded-xl bg-black pl-4 pr-24 text-base outline-none focus-visible:ring-4 focus-visible:ring-[#5B21B6]/50 sm:pl-5 sm:pr-28 ${
                  form.topic ? 'text-white' : 'text-white/60'
                }`}
              >
                <option value="" disabled>
                  Select a topic
                </option>
                {TOPICS.map((t) => (
                  <option key={t} value={t} className="text-black">
                    {t}
                  </option>
                ))}
              </select>
              <span
                aria-hidden="true"
                className="pointer-events-none absolute right-4 top-1/2 flex -translate-y-1/2 items-center gap-1.5 text-[11px] font-extrabold tracking-[0.18em] text-white sm:right-5 sm:text-xs"
              >
                SELECT <ChevronDown size={16} />
              </span>
            </div>

            <label className="block">
              <span className="sr-only">Your message</span>
              <textarea
                required
                rows={4}
                placeholder="Type a message..."
                className="min-h-28 w-full resize-y rounded-xl bg-[#F1F2F4] px-4 py-3.5 text-base font-medium text-[#17102B] outline-none transition placeholder:text-[#17102B]/55 focus:bg-white focus:ring-2 focus:ring-[#5B21B6] sm:min-h-36 sm:py-4"
                value={form.message}
                onChange={set('message')}
              />
            </label>

            <div className="flex flex-col gap-3 pt-1 sm:flex-row sm:items-center sm:gap-4 sm:pt-2">
              <button
                type="submit"
                className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-full px-9 text-base font-extrabold text-white transition-colors hover:bg-[#4C1D95] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#5B21B6]/30 sm:h-14 sm:w-auto"
                style={{ backgroundColor: PURPLE }}
              >
                Send message <Send size={18} aria-hidden />
              </button>
              <p role="status" className="text-sm leading-6 text-[#17102B]/70">
                {sent
                  ? `Your email app should open with your message ready. If it does not, write to ${EMAIL}.`
                  : 'We usually reply within a few hours.'}
              </p>
            </div>
          </form>
        </section>

        {/* ---------- other ways to reach us ---------- */}
        <div className="koombo-rise mt-10 sm:mt-16" style={{ animationDelay: '.12s' }}>
          <h2
            className="kb-balance font-extrabold text-[#0D0B14]"
            style={{ fontSize: 'clamp(1.5rem, 5.5vw, 2.6rem)', lineHeight: 1.1, letterSpacing: '-0.035em' }}
          >
            Prefer to chat? Reach us directly.
          </h2>

          <div className="mt-5 grid gap-3 sm:mt-6 sm:gap-4 lg:grid-cols-12">
            {/* WhatsApp chat card */}
            <a
              href={WHATSAPP_HREF}
              target="_blank"
              rel="noopener noreferrer"
              className={`group relative flex flex-col justify-between gap-5 overflow-hidden rounded-[24px] border-[3px] bg-gradient-to-br from-[#22B95F] via-[#1AA755] to-[#128246] p-4 text-white sm:min-h-[22rem] sm:gap-0 sm:rounded-[32px] sm:p-8 lg:col-span-7 lg:row-span-2 ${focus}`}
              style={{ borderColor: INK }}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex min-w-0 items-center gap-3">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/20 sm:h-12 sm:w-12">
                    <MessageCircle size={20} aria-hidden />
                  </span>
                  <span className="min-w-0 leading-tight">
                    <span className="block text-base font-extrabold">Koombo Support</span>
                    <span className="block truncate text-xs text-white/80 sm:text-sm">Usually replies in a few hours</span>
                  </span>
                </div>
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/20 transition group-hover:bg-white group-hover:text-[#128246] sm:h-10 sm:w-10">
                  <ArrowUpRight size={18} aria-hidden />
                </span>
              </div>

              {/* chat preview */}
              <div className="space-y-2 sm:my-8 sm:space-y-2.5" aria-hidden="true">
                <div className="ml-auto w-fit max-w-[88%] rounded-2xl rounded-br-md bg-white px-3.5 py-2.5 text-sm font-medium text-[#17102B] shadow-lg sm:px-4 sm:py-3 sm:text-[15px]">
                  Hi, I&rsquo;d like to list an item on Koombo.
                </div>
                <div className="w-fit max-w-[88%] rounded-2xl rounded-bl-md bg-[#0B5B2D]/85 px-3.5 py-2.5 text-sm text-white sm:px-4 sm:py-3 sm:text-[15px]">
                  Happy to help. What are you selling?
                </div>
                <div className="flex w-fit items-center gap-1 rounded-2xl rounded-bl-md bg-[#0B5B2D]/60 px-4 py-3">
                  {[0, 0.15, 0.3].map((d) => (
                    <span
                      key={d}
                      className="koombo-dot h-1.5 w-1.5 rounded-full bg-white"
                      style={{ animationDelay: `${d}s` }}
                    />
                  ))}
                </div>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-end sm:justify-between sm:gap-4">
                <div>
                  <h3 className="text-2xl font-extrabold tracking-[-0.04em] sm:text-3xl">Chat on WhatsApp</h3>
                  <p className="mt-1 text-sm text-white/85 sm:mt-1.5 sm:text-base">The quickest way to reach us.</p>
                </div>
                <span className="inline-flex h-11 items-center justify-center rounded-full bg-white px-6 text-[15px] font-extrabold text-[#0B5B2D] shadow-lg sm:h-12">
                  Start a chat
                </span>
              </div>
            </a>

            {/* Call */}
            <a
              href={PHONE_HREF}
              className={`group flex items-center justify-between gap-3 rounded-[24px] border-[3px] p-4 sm:flex-col sm:items-stretch sm:justify-between sm:gap-8 sm:rounded-[32px] sm:p-6 lg:col-span-5 ${focus}`}
              style={{ borderColor: INK, backgroundColor: TINT }}
            >
              <div className="order-1 flex items-start justify-between sm:order-none">
                <span className={chip}>
                  <Phone size={20} aria-hidden />
                </span>
                <span className="hidden h-10 w-10 items-center justify-center rounded-full bg-white text-[#17102B]/50 ring-1 ring-[#17102B]/10 transition group-hover:bg-[#5B21B6] group-hover:text-white sm:flex">
                  <ArrowUpRight size={18} aria-hidden />
                </span>
              </div>
              <div className="order-2 min-w-0 flex-1 sm:order-none sm:flex-none">
                <p className="text-sm font-medium text-[#17102B]/65">Call us</p>
                <p className="mt-0.5 truncate text-lg font-extrabold tracking-[-0.03em] sm:mt-1 sm:text-2xl">
                  {PHONE_DISPLAY}
                </p>
              </div>
              <span className="order-3 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white text-[#17102B]/50 ring-1 ring-[#17102B]/10 sm:hidden">
                <ArrowUpRight size={16} aria-hidden />
              </span>
            </a>

            {/* Email */}
            <div
              className="flex items-center justify-between gap-3 rounded-[24px] border-[3px] p-4 sm:flex-col sm:items-stretch sm:justify-between sm:gap-8 sm:rounded-[32px] sm:p-6 lg:col-span-5"
              style={{ borderColor: INK, backgroundColor: TINT }}
            >
              <div className="flex items-start justify-between">
                <span className={chip}>
                  <Mail size={20} aria-hidden />
                </span>
                <button
                  type="button"
                  onClick={copyEmail}
                  className={`hidden h-10 items-center gap-1.5 rounded-full bg-white px-4 text-sm font-bold ring-1 ring-[#17102B]/10 transition hover:bg-[#E4DAFB] sm:inline-flex ${focus}`}
                >
                  {copied ? <Check size={15} className="text-emerald-600" aria-hidden /> : <Copy size={15} aria-hidden />}
                  <span aria-live="polite">{copied ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
              <a href={`mailto:${EMAIL}`} className={`block min-w-0 flex-1 rounded-md sm:flex-none ${focus}`}>
                <p className="text-sm font-medium text-[#17102B]/65">Email</p>
                <p className="mt-0.5 truncate text-lg font-extrabold tracking-[-0.03em] hover:underline sm:mt-1 sm:text-2xl">
                  {EMAIL}
                </p>
              </a>
              <button
                type="button"
                onClick={copyEmail}
                aria-label="Copy email address"
                className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white ring-1 ring-[#17102B]/10 sm:hidden ${focus}`}
              >
                {copied ? <Check size={15} className="text-emerald-600" aria-hidden /> : <Copy size={15} aria-hidden />}
              </button>
            </div>
          </div>

          {/* Location + hours */}
          <div className="mt-3 grid grid-cols-1 gap-3 sm:mt-4 sm:grid-cols-2 sm:gap-4">
            {[
              { icon: MapPin, label: 'Location', value: 'Accra, Ghana' },
              { icon: Clock, label: 'Hours', value: '24 hours, 7 days a week' },
            ].map(({ icon: Icon, label, value }) => (
              <div
                key={label}
                className="flex items-center gap-3 rounded-2xl border-2 bg-white p-3.5 sm:gap-4 sm:rounded-3xl sm:p-5"
                style={{ borderColor: INK }}
              >
                <span className={chip} style={{ color: TEAL }}>
                  <Icon size={20} aria-hidden />
                </span>
                <div className="min-w-0">
                  <p className="text-xs font-medium text-[#17102B]/65 sm:text-sm">{label}</p>
                  <p className="text-base font-bold sm:text-lg">{value}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ---------- reassurance ---------- */}
        <div className="mt-10 grid gap-3 sm:mt-14 sm:grid-cols-3 sm:gap-4">
          {highlights.map(({ title, description, icon: Icon }) => (
            <div key={title} className="flex gap-3 rounded-2xl p-4 sm:gap-4 sm:rounded-3xl sm:p-6" style={{ backgroundColor: TINT }}>
              <span className={chip} style={{ color: TEAL }}>
                <Icon size={20} aria-hidden />
              </span>
              <div className="min-w-0">
                <p className="text-base font-extrabold">{title}</p>
                <p className="mt-0.5 text-sm leading-6 text-[#17102B]/70 sm:mt-1 sm:text-[15px]">{description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <KoomboFooter />
    </main>
  );
}
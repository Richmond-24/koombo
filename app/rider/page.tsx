'use client';

import React, { useState } from 'react';

type FormData = {
  name: string;
  email: string;
  phone: string;
  city: string;
  vehicle: string;
};

/* Palette: royal purple + teal blue, with a near-black ink for borders */
const INK = '#17102B';
const PURPLE = '#5B21B6';
const PURPLE_DEEP = '#4C1D95';
const TEAL = '#0B7285';
const TEAL_DEEP = '#0A5566';
const TINT = '#F3EFFF';

const EMPTY: FormData = { name: '', email: '', phone: '', city: '', vehicle: 'Motorbike' };
const VEHICLES = ['Motorbike', 'Bicycle', 'Car', 'Tricycle'];

const BENEFITS = [
  { title: 'Flexible hours', text: 'Ride when it suits you, full time or on the side.' },
  { title: 'Weekly payouts', text: 'Withdraw your earnings straight to your account.' },
  { title: 'Local vendors', text: 'Deliver for shops and shoppers near you.' },
];

/* ------------------------------------------------------------------ */
/* Icons                                                               */
/* ------------------------------------------------------------------ */

type IconProps = { className?: string };

function Arrow({ className = 'h-5 w-5' }: IconProps) {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" className={className}>
      <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ArrowDown({ className = 'h-5 w-5' }: IconProps) {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" className={className}>
      <path d="M12 5v14M6 13l6 6 6-6" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function CheckIcon({ className = 'h-4 w-4' }: IconProps) {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" className={className}>
      <path d="m5 12.5 4.5 4.5L19 7.5" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function BellIcon({ className = 'h-5 w-5' }: IconProps) {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" className={className}>
      <path
        d="M6 16V11a6 6 0 1 1 12 0v5l1.5 2h-15L6 16ZM10 21h4"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function Sparkle({ className = 'h-10 w-10' }: IconProps) {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M12 1.5c.6 5.6 4.9 9.9 10.5 10.5-5.6.6-9.9 4.9-10.5 10.5C11.4 16.9 7.1 12.6 1.5 12 7.1 11.4 11.4 7.1 12 1.5Z" />
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/* Phone mockup (decorative)                                           */
/* ------------------------------------------------------------------ */

function PhoneMock() {
  return (
    <div
      aria-hidden="true"
      className="relative h-[560px] w-[270px] rounded-t-[40px] border-8 border-b-0 border-[#1B2430] bg-white sm:w-[300px]"
    >
      {/* notch */}
      <span className="absolute left-1/2 top-0 h-5 w-24 -translate-x-1/2 rounded-b-2xl bg-[#1B2430]" />

      <div className="px-4 pt-3">
        {/* status bar */}
        <div className="flex items-center justify-between text-[10px] font-semibold text-[#17102B]">
          <span>9:41 AM</span>
          <span className="flex items-center gap-1">
            <span className="h-2 w-3 rounded-[2px] bg-[#17102B]" />
            <span className="h-2 w-4 rounded-[3px] bg-[#17102B]" />
          </span>
        </div>

        {/* title */}
        <div className="mt-6 flex items-center justify-between text-[#17102B]">
          <span className="text-[15px] font-bold">Wallet</span>
          <BellIcon className="h-[18px] w-[18px]" />
        </div>

        {/* balance card */}
        <div className="relative mt-4 overflow-hidden rounded-xl p-4 text-white" style={{ backgroundColor: TEAL_DEEP }}>
          <Sparkle className="absolute -right-3 top-4 h-20 w-20 text-white/10" />
          <p className="text-[10px] font-bold tracking-wide text-white/90">AVAILABLE BALANCE</p>
          <p className="mt-3 text-[30px] font-semibold leading-none">GH₵3,540</p>
          <div
            className="mt-4 grid h-11 place-items-center rounded-lg bg-white text-[13px] font-bold"
            style={{ color: TEAL_DEEP }}
          >
            Withdraw Money
          </div>
        </div>

        {/* rows */}
        <div className="mt-3 flex h-12 items-center justify-between rounded-lg border border-black/10 px-3 text-[12px] font-semibold text-[#17102B]">
          <span>Weekly payout</span>
          <Arrow className="h-4 w-4" />
        </div>
        <div className="mt-3 flex h-12 items-center justify-between rounded-lg border border-black/10 px-3 text-[12px] font-semibold text-[#17102B]">
          <span>Deliveries today</span>
          <span style={{ color: PURPLE }}>12</span>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Rider photo                                                         */
/* ------------------------------------------------------------------ */

function RiderPhoto() {
  const [ok, setOk] = useState(true);
  return (
    <div
      className="relative h-60 w-full overflow-hidden rounded-3xl border-[3px] sm:h-80 sm:rounded-[28px]"
      style={{ borderColor: INK, backgroundColor: PURPLE }}
    >
      {ok ? (
        <img
          src="/koombo.jpeg"
          alt="Koombo delivery partner with packages"
          onError={() => setOk(false)}
          className="absolute inset-0 h-full w-full select-none object-cover object-center"
          draggable={false}
        />
      ) : (
        <div
          className="absolute inset-0"
          style={{ background: `linear-gradient(135deg, ${PURPLE} 0%, ${TEAL} 100%)` }}
        />
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Page                                                                */
/* ------------------------------------------------------------------ */

const fieldCls =
  'h-14 w-full rounded-xl border-2 border-[#17102B]/15 bg-white px-4 text-base font-medium text-[#17102B] outline-none transition placeholder:text-[#17102B]/40 focus:border-[#5B21B6] focus:ring-4 focus:ring-[#5B21B6]/15';
const labelCls = 'mb-1.5 block text-sm font-bold text-[#17102B]/80';

export default function KoomboRiderSignup({
  onBack,
  onRegisterClick,
}: {
  onBack?: () => void;
  onRegisterClick?: () => void;
}) {
  const [formData, setFormData] = useState<FormData>(EMPTY);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [ref, setRef] = useState('0000');

  const set = (key: keyof FormData) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setFormData({ ...formData, [key]: e.target.value });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // TODO: replace with your real API call
    await new Promise((resolve) => setTimeout(resolve, 1500));
    onRegisterClick?.();

    setRef(String(Math.floor(1000 + Math.random() * 9000)));
    setIsSubmitting(false);
    setSubmitted(true);
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@500;600;700;800&display=swap');

        .kb-font { font-family: 'Plus Jakarta Sans', ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif; }
        .kb-balance { text-wrap: balance; }

        @keyframes kb-pop { 0% { transform: scale(.4); opacity: 0; } 70% { transform: scale(1.08); opacity: 1; } 100% { transform: scale(1); } }
        .kb-pop { animation: kb-pop .6s cubic-bezier(.2,.8,.2,1) both; }
        @keyframes kb-fade-up { from { opacity: 0; transform: translateY(14px); } to { opacity: 1; transform: none; } }
        .kb-fade-up { animation: kb-fade-up .6s cubic-bezier(.16,1,.3,1) both; }
        @keyframes kb-float { 0%,100% { translate: 0 0; } 50% { translate: 0 -6px; } }
        .kb-float { animation: kb-float 5s ease-in-out infinite; }

        @media (prefers-reduced-motion: reduce) {
          .kb-pop, .kb-fade-up, .kb-float { animation: none !important; }
        }
      `}</style>

      <main
        id="rider"
        className="kb-font relative min-h-screen overflow-x-hidden bg-white pb-16 text-[#17102B] sm:pb-24"
      >
        {/* ---------- top colour band ---------- */}
        <div
          aria-hidden="true"
          className="absolute inset-x-0 top-0 h-[190px] overflow-hidden sm:h-[220px]"
          style={{ backgroundColor: PURPLE }}
        >
          <div
            className="absolute left-0 top-0 h-full w-32 sm:w-56"
            style={{
              backgroundImage:
                'repeating-linear-gradient(135deg, rgba(255,255,255,.22) 0 6px, transparent 6px 18px)',
            }}
          />
          <div className="absolute inset-x-0 bottom-0 h-1/3" style={{ backgroundColor: PURPLE_DEEP }} />
        </div>

        <div className="relative mx-auto w-full max-w-6xl px-3 sm:px-6 lg:px-8">
          {/* ---------- floating nav pills ---------- */}
          <div className="flex items-center justify-between gap-3 pt-4 sm:pt-5">
            <div className="flex items-center gap-2">
              <span
                className="inline-flex h-11 items-center gap-2 rounded-full px-5 text-[15px] font-extrabold text-white shadow-lg"
                style={{ backgroundColor: TEAL_DEEP }}
              >
                <Sparkle className="h-4 w-4" />
                Koombo
              </span>
              {onBack && (
                <button
                  type="button"
                  onClick={onBack}
                  className="inline-flex h-11 items-center rounded-full bg-white px-5 text-[15px] font-bold shadow-lg transition-colors hover:bg-[#F3EFFF] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-white/50"
                >
                  Back
                </button>
              )}
            </div>

            <a
              href="#register"
              className="hidden h-11 items-center rounded-full bg-white px-8 text-[15px] font-bold shadow-lg transition-colors hover:bg-[#F3EFFF] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-white/50 md:inline-flex"
            >
              Become a delivery partner
            </a>

            <a
              href="#register"
              className="inline-flex h-11 items-center gap-2 rounded-full bg-white px-5 text-[15px] font-bold shadow-lg transition-colors hover:bg-[#F3EFFF] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-white/50"
              style={{ color: PURPLE }}
            >
              Register
              <ArrowDown className="h-4 w-4" />
            </a>
          </div>

          {/* ---------- hero frame ---------- */}
          <section
            className="mt-5 overflow-hidden rounded-[28px] border-[3px] bg-white sm:mt-6 sm:rounded-[36px]"
            style={{ borderColor: INK }}
          >
            <div className="grid lg:grid-cols-[1.1fr_.9fr]">
              {/* left: copy */}
              <div className="min-w-0 px-6 pb-4 pt-9 sm:px-12 sm:pt-14 lg:self-center lg:py-16 lg:pl-14 lg:pr-4">
                <h1
                  className="kb-balance font-extrabold text-[#0D0B14]"
                  style={{ fontSize: 'clamp(2.35rem, 9vw, 4.4rem)', lineHeight: 1.06, letterSpacing: '-0.04em' }}
                >
                  Deliver for thousands of local vendors and shoppers
                </h1>

                <p className="mt-5 max-w-md text-[17px] leading-relaxed text-[#17102B]/80 sm:mt-6 sm:text-lg">
                  Partner with local vendors, deliver packages safely, and get paid for every successful drop-off.
                </p>

                <p className="mt-4 text-[15px] font-bold" style={{ color: TEAL }}>
                  Flexible hours. Weekly payouts. Start earning today.
                </p>

                <div className="mt-7 flex items-center gap-3 sm:mt-8">
                  <a
                    href="#register"
                    aria-label="Go to the registration form"
                    className="grid h-12 w-12 shrink-0 place-items-center rounded-full text-white transition-transform hover:translate-y-0.5 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#5B21B6]/30"
                    style={{ backgroundColor: PURPLE }}
                  >
                    <ArrowDown className="h-5 w-5" />
                  </a>
                  <a
                    href="#register"
                    className="inline-flex h-12 items-center rounded-full px-6 text-[15px] font-extrabold text-white transition-colors hover:opacity-90 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#0B7285]/30"
                    style={{ backgroundColor: TEAL }}
                  >
                    Register now
                  </a>
                </div>
              </div>

              {/* right: phone */}
              <div className="relative mt-4 h-[420px] overflow-hidden sm:h-[470px] lg:mt-0 lg:h-auto lg:min-h-[580px]">
                <div className="absolute left-1/2 top-6 -translate-x-1/2 lg:left-auto lg:right-12 lg:top-14 lg:translate-x-0">
                  <PhoneMock />
                </div>

                {/* overlapping notice card */}
                <div
                  aria-hidden="true"
                  className="kb-float absolute bottom-4 left-2.5 z-10 flex w-[178px] items-center gap-3 rounded-2xl border-2 p-3 shadow-lg sm:left-8 sm:w-[200px] lg:bottom-8 lg:left-5"
                  style={{ borderColor: INK, backgroundColor: TINT }}
                >
                  <span className="relative grid h-11 w-11 shrink-0 place-items-center">
                    <Sparkle className="absolute h-11 w-11 text-[#C4B5FD]" />
                    <Sparkle className="relative h-6 w-6" />
                  </span>
                  <span className="min-w-0 leading-tight">
                    <span className="block text-[13px] font-extrabold">Delivery complete</span>
                    <span className="block text-[13px] font-bold" style={{ color: TEAL }}>
                      +GH₵25
                    </span>
                  </span>
                </div>
              </div>
            </div>
          </section>

          {/* ---------- registration ---------- */}
          <div
            id="register"
            className="mt-12 grid scroll-mt-6 gap-8 sm:mt-16 lg:grid-cols-[1fr_minmax(0,480px)] lg:grid-rows-[auto_1fr] lg:gap-x-16 lg:gap-y-0"
          >
            {/* A: heading + benefits */}
            <div className="min-w-0 lg:col-start-1 lg:row-start-1">
              <h2
                className="kb-balance font-extrabold text-[#0D0B14]"
                style={{ fontSize: 'clamp(1.9rem, 6.5vw, 3rem)', lineHeight: 1.08, letterSpacing: '-0.035em' }}
              >
                Register as a delivery partner
              </h2>
              <p className="mt-3 max-w-lg text-base leading-relaxed text-[#17102B]/75 sm:text-lg">
                Tell us about yourself and we&rsquo;ll get you on the road.
              </p>

              <ul className="mt-6 space-y-4">
                {BENEFITS.map((b) => (
                  <li key={b.title} className="flex items-start gap-3.5">
                    <span
                      className="mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-full text-white"
                      style={{ backgroundColor: TEAL }}
                    >
                      <CheckIcon className="h-3.5 w-3.5" />
                    </span>
                    <span className="min-w-0">
                      <span className="block text-base font-extrabold leading-6">{b.title}</span>
                      <span className="block text-[15px] leading-6 text-[#17102B]/70">{b.text}</span>
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            {/* B: form card */}
            <div className="min-w-0 lg:col-start-2 lg:row-span-2 lg:row-start-1">
              <div
                className="rounded-[28px] border-[3px] bg-white p-5 sm:rounded-[32px] sm:p-8"
                style={{ borderColor: INK }}
              >
                {!submitted ? (
                  <form onSubmit={handleSubmit}>
                    <span
                      className="inline-flex rounded-full px-4 py-1.5 text-sm font-extrabold text-white"
                      style={{ backgroundColor: TEAL_DEEP }}
                    >
                      Delivery partner
                    </span>

                    <div className="mt-5 space-y-4">
                      <div>
                        <label htmlFor="kb-name" className={labelCls}>Full name</label>
                        <input
                          id="kb-name"
                          required
                          type="text"
                          autoComplete="name"
                          placeholder="Kwame Mensah"
                          className={fieldCls}
                          value={formData.name}
                          onChange={set('name')}
                        />
                      </div>

                      <div>
                        <label htmlFor="kb-email" className={labelCls}>Email address</label>
                        <input
                          id="kb-email"
                          required
                          type="email"
                          autoComplete="email"
                          placeholder="kwame@example.com"
                          className={fieldCls}
                          value={formData.email}
                          onChange={set('email')}
                        />
                      </div>

                      <div>
                        <label htmlFor="kb-phone" className={labelCls}>Phone number</label>
                        <input
                          id="kb-phone"
                          required
                          type="tel"
                          autoComplete="tel"
                          inputMode="tel"
                          placeholder="+233 XX XXX XXXX"
                          className={fieldCls}
                          value={formData.phone}
                          onChange={set('phone')}
                        />
                      </div>

                      <div className="grid gap-4 sm:grid-cols-2">
                        <div>
                          <label htmlFor="kb-city" className={labelCls}>City</label>
                          <input
                            id="kb-city"
                            required
                            type="text"
                            autoComplete="address-level2"
                            placeholder="Sunyani"
                            className={fieldCls}
                            value={formData.city}
                            onChange={set('city')}
                          />
                        </div>
                        <div>
                          <label htmlFor="kb-vehicle" className={labelCls}>Vehicle</label>
                          <select
                            id="kb-vehicle"
                            required
                            className={fieldCls}
                            value={formData.vehicle}
                            onChange={set('vehicle')}
                          >
                            {VEHICLES.map((v) => (
                              <option key={v} value={v}>{v}</option>
                            ))}
                          </select>
                        </div>
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="mt-6 flex h-14 w-full items-center justify-center gap-2 rounded-full text-base font-extrabold text-white transition-colors hover:bg-[#4C1D95] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#5B21B6]/30 disabled:cursor-not-allowed disabled:opacity-60"
                      style={{ backgroundColor: PURPLE }}
                    >
                      {isSubmitting ? (
                        <>
                          <svg className="h-5 w-5 animate-spin" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                          </svg>
                          Sending your application…
                        </>
                      ) : (
                        <>
                          Register as a delivery partner <Arrow className="h-5 w-5" />
                        </>
                      )}
                    </button>

                    <p className="mt-4 text-center text-sm leading-relaxed text-[#17102B]/60">
                      By registering you agree to be contacted by Koombo about your application.
                    </p>
                  </form>
                ) : (
                  <div className="px-1 py-6 text-center sm:py-10" aria-live="polite">
                    <span
                      className="kb-pop mx-auto grid h-20 w-20 place-items-center rounded-full text-white"
                      style={{ backgroundColor: TEAL }}
                    >
                      <CheckIcon className="h-9 w-9" />
                    </span>
                    <h3 className="kb-fade-up mt-6 text-[28px] font-extrabold leading-tight tracking-[-0.03em]" style={{ animationDelay: '.2s' }}>
                      You&rsquo;re in
                    </h3>
                    <p className="kb-fade-up mt-1 text-sm font-extrabold" style={{ color: PURPLE, animationDelay: '.3s' }}>
                      Rider no. {ref}
                    </p>
                    <p
                      className="kb-fade-up mx-auto mt-5 max-w-sm text-base leading-relaxed text-[#17102B]/80"
                      style={{ animationDelay: '.4s' }}
                    >
                      Thanks, {formData.name.split(' ')[0] || 'friend'}. We&rsquo;ll send the next steps to{' '}
                      <span className="break-all font-bold" style={{ color: PURPLE }}>{formData.email}</span>.
                    </p>
                    <button
                      type="button"
                      onClick={() => {
                        setSubmitted(false);
                        setFormData(EMPTY);
                      }}
                      className="kb-fade-up mt-7 inline-flex h-12 items-center rounded-full border-2 px-6 text-[15px] font-extrabold transition-colors hover:bg-[#F3EFFF] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#5B21B6]/30"
                      style={{ borderColor: INK, animationDelay: '.55s' }}
                    >
                      Register another rider
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* C: photo */}
            <div className="min-w-0 lg:col-start-1 lg:row-start-2 lg:mt-10">
              <RiderPhoto />
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
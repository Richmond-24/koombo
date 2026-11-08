'use client';

import React, { useState } from 'react';

type FormData = {
  name: string;
  email: string;
  phone: string;
  city: string;
  vehicle: string;
};

const INK = '#17102B';
const PURPLE = '#5B21B6';
const PAPER = '#F5F1E8';

const EMPTY: FormData = { name: '', email: '', phone: '', city: '', vehicle: 'Motorbike' };
const VEHICLES = ['Motorbike', 'Bicycle', 'Car', 'Tricycle'];

function Arrow({ className = 'h-5 w-5' }: { className?: string }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" className={className}>
      <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function RiderPhoto() {
  const [ok, setOk] = useState(true);
  return (
    <div
      className="relative h-[260px] w-full overflow-hidden rounded-[20px] border-2 shadow-[6px_6px_0_#17102B] sm:h-[340px] sm:rounded-[24px] sm:shadow-[8px_8px_0_#17102B]"
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
        <div className="absolute inset-0 bg-gradient-to-br from-[#F5D0FE] via-[#C4B5FD] to-[#4C1D95]" />
      )}
    </div>
  );
}

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

  const labelCls = 'mb-1.5 block text-[12px] font-extrabold uppercase tracking-[0.12em] text-[#17102B]/75';

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,500;12..96,800&display=swap');

        .kb-display { font-family: 'Bricolage Grotesque', ui-sans-serif, system-ui, sans-serif; }
        .kb-balance { text-wrap: balance; }

        @keyframes kb-rise { from { opacity: 0; transform: translateY(40px) rotate(2deg); } to { opacity: 1; transform: none; } }
        .kb-rise { display: inline-block; opacity: 0; animation: kb-rise .8s cubic-bezier(.16,1,.3,1) forwards; }

        @keyframes kb-stamp {
          0% { transform: scale(2.6) rotate(-18deg); opacity: 0; }
          60% { transform: scale(.94) rotate(-8deg); opacity: 1; }
          80% { transform: scale(1.04) rotate(-8deg); }
          100% { transform: scale(1) rotate(-8deg); opacity: 1; }
        }
        .kb-stamp { animation: kb-stamp .7s cubic-bezier(.2,.8,.2,1) .15s both; }
        @keyframes kb-fade-up { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: none; } }
        .kb-fade-up { animation: kb-fade-up .6s cubic-bezier(.16,1,.3,1) both; }

        .kb-field {
          width: 100%;
          border: 2px solid ${INK};
          border-radius: 12px;
          background: #fff;
          padding: 14px 16px;
          font-size: 16px;
          font-weight: 500;
          color: ${INK};
          outline: none;
          transition: transform .15s ease, box-shadow .15s ease;
        }
        .kb-field::placeholder { color: #17102B66; }
        .kb-field:focus { transform: translate(-2px, -2px); box-shadow: 4px 4px 0 ${PURPLE}; }

        .kb-btn { box-shadow: 5px 5px 0 ${INK}; transition: transform .15s ease, box-shadow .15s ease, background-color .2s ease; }
        .kb-btn:hover:not(:disabled) { transform: translate(-2px, -2px); box-shadow: 7px 7px 0 ${INK}; }
        .kb-btn:active:not(:disabled) { transform: translate(3px, 3px); box-shadow: 2px 2px 0 ${INK}; }

        @media (prefers-reduced-motion: reduce) {
          .kb-stamp, .kb-fade-up { animation: none !important; }
          .kb-rise { animation: none !important; opacity: 1; }
        }
      `}</style>

      <main
        id="rider"
        className="relative min-h-screen overflow-x-hidden pb-16 sm:pb-24"
        style={{ backgroundColor: PAPER, color: INK }}
      >
        <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
          {onBack && (
            <button
              type="button"
              onClick={onBack}
              className="mt-6 inline-flex min-h-[44px] items-center rounded-xl border-2 bg-white px-4 text-[15px] font-extrabold transition-colors hover:bg-[#17102B] hover:text-white"
              style={{ borderColor: INK }}
            >
              Back
            </button>
          )}

          <div className="grid items-start gap-10 pt-8 sm:pt-12 lg:grid-cols-[1fr_minmax(0,460px)] lg:gap-16 lg:pt-16">
            {/* Left: headline, copy, photo */}
            <section className="min-w-0">
              <h1
                className="kb-display kb-balance font-extrabold"
                style={{ fontSize: 'clamp(2.2rem, 8vw, 4.5rem)', lineHeight: 1.02, letterSpacing: '-0.04em' }}
              >
                <span className="kb-rise text-[#5B21B6]" style={{ animationDelay: '.05s' }}>
                  Deliver for thousands of
                </span>{' '}
                <span className="kb-rise" style={{ animationDelay: '.2s' }}>
                  local vendors and shoppers
                </span>
              </h1>

              <p className="mt-5 max-w-xl text-[16px] leading-[1.6] text-[#17102B]/80 sm:mt-7 sm:text-[19px] sm:leading-relaxed">
                Grow your earnings with Koombo. Partner with local vendors, deliver packages safely, and get paid for
                every successful drop-off you make.
              </p>

              <p className="mt-4 text-[15px] font-bold text-[#5B21B6]">
                Flexible hours. Weekly payouts. Start earning today.
              </p>

              <div className="mt-8 sm:mt-10">
                <RiderPhoto />
              </div>
            </section>

            {/* Right: ticket form */}
            <section id="register" aria-label="Register as a delivery partner" className="min-w-0 scroll-mt-6">
              <div
                className="relative rounded-[20px] border-2 bg-white shadow-[6px_6px_0_#17102B] sm:rounded-[24px] sm:shadow-[8px_8px_0_#17102B]"
                style={{ borderColor: INK }}
              >
                {/* ticket header */}
                <div className="flex items-center justify-between gap-3 rounded-t-[17px] bg-[#17102B] px-5 py-3 text-[#F5F1E8] sm:rounded-t-[21px] sm:px-7">
                  <span className="text-[12px] font-extrabold uppercase tracking-[0.14em] sm:text-[13px]">Delivery partner</span>
                  <span className="text-[12px] font-extrabold uppercase tracking-[0.14em] text-[#C4B5FD] sm:text-[13px]">
                    Koombo
                  </span>
                </div>

                {!submitted ? (
                  <form onSubmit={handleSubmit} className="px-5 pb-6 pt-6 sm:px-7 sm:pb-8 sm:pt-7">
                    <h2 className="kb-display kb-balance text-[24px] font-extrabold leading-[1.1] tracking-[-0.03em] sm:text-[28px]">
                      Register as a delivery partner
                    </h2>
                    <p className="mt-2 text-[15px] leading-relaxed text-[#17102B]/70">
                      Tell us about yourself and we&rsquo;ll get you on the road.
                    </p>

                    <div className="mt-6 space-y-4 sm:space-y-5">
                      <div>
                        <label htmlFor="kb-name" className={labelCls}>Full name</label>
                        <input
                          id="kb-name"
                          required
                          type="text"
                          autoComplete="name"
                          placeholder="Kwame Mensah"
                          className="kb-field"
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
                          className="kb-field"
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
                          className="kb-field"
                          value={formData.phone}
                          onChange={set('phone')}
                        />
                      </div>

                      <div className="grid gap-4 sm:grid-cols-2 sm:gap-5">
                        <div>
                          <label htmlFor="kb-city" className={labelCls}>City</label>
                          <input
                            id="kb-city"
                            required
                            type="text"
                            autoComplete="address-level2"
                            placeholder="Sunyani"
                            className="kb-field"
                            value={formData.city}
                            onChange={set('city')}
                          />
                        </div>
                        <div>
                          <label htmlFor="kb-vehicle" className={labelCls}>Vehicle</label>
                          <select
                            id="kb-vehicle"
                            required
                            className="kb-field"
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

                    {/* perforation */}
                    <div className="relative my-6 sm:my-7" aria-hidden="true">
                      <div className="border-t-2 border-dashed" style={{ borderColor: INK }} />
                      <span
                        className="absolute -left-[33px] top-1/2 h-6 w-6 -translate-y-1/2 rounded-full border-2 sm:-left-[41px]"
                        style={{ borderColor: INK, backgroundColor: PAPER, clipPath: 'inset(0 0 0 50%)' }}
                      />
                      <span
                        className="absolute -right-[33px] top-1/2 h-6 w-6 -translate-y-1/2 rounded-full border-2 sm:-right-[41px]"
                        style={{ borderColor: INK, backgroundColor: PAPER, clipPath: 'inset(0 50% 0 0)' }}
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="kb-btn flex h-14 w-full items-center justify-center gap-2 rounded-xl border-2 bg-[#5B21B6] text-[16px] font-extrabold text-white disabled:cursor-not-allowed disabled:opacity-60"
                      style={{ borderColor: INK }}
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

                    <p className="mt-4 text-center text-[13px] leading-relaxed text-[#17102B]/60">
                      By registering you agree to be contacted by Koombo about your application.
                    </p>
                  </form>
                ) : (
                  <div className="relative overflow-hidden px-5 pb-8 pt-8 text-center sm:px-7 sm:pb-10 sm:pt-10">
                    <div className="kb-stamp mx-auto flex w-fit max-w-full flex-col items-center rounded-2xl border-[4px] border-[#5B21B6] px-5 py-3 text-[#5B21B6] sm:px-6">
                      <span className="kb-display text-[32px] font-extrabold leading-none tracking-[-0.03em] sm:text-[44px]">
                        YOU&rsquo;RE IN
                      </span>
                      <span className="mt-1.5 text-[12px] font-extrabold uppercase tracking-[0.18em]">Rider no. {ref}</span>
                    </div>

                    <p
                      className="kb-fade-up mx-auto mt-8 max-w-sm text-[16px] leading-relaxed text-[#17102B]/80 sm:text-[17px]"
                      style={{ animationDelay: '.7s' }}
                    >
                      Thanks, {formData.name.split(' ')[0] || 'friend'}. We&rsquo;ll send the next steps to{' '}
                      <span className="break-all font-bold text-[#5B21B6]">{formData.email}</span>.
                    </p>

                     <button
                      type="button"
                      onClick={() => {
                        setSubmitted(false);
                        setFormData(EMPTY);
                      }}
                      className="kb-fade-up mt-7 inline-flex min-h-[44px] items-center rounded-xl border-2 px-5 text-[15px] font-extrabold transition-colors hover:bg-[#17102B] hover:text-white"
                      style={{ borderColor: INK, animationDelay: '.9s' }}
                    >
                      Register another rider
                    </button>
                  </div>
                )}
              </div>
            </section>
          </div>
        </div>
      </main>
    </>
  );
}
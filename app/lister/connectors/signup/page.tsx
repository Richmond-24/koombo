'use client';

import { FormEvent, Suspense, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import GoogleButton from '../../../components/GoogleButton';
import SiteHeader from '../../../components/SiteHeader';
import KoomboFooter from '../../../components/Footer';
import { getApiBaseUrl } from '../../../../lib/auth-config';

/* Photo from /public. Swap for any image you like. */
const SIGNUP_IMAGE = '/connect.jpg';

type AuthResponse = {
  token?: string;
  id?: string;
  connector?: { _id?: string };
  data?: { connector?: { _id?: string } };
  error?: string;
  message?: string;
};

export default function ConnectorSignUpPage() {
  return (
    <Suspense
      fallback={
        <main className="flex min-h-screen items-center justify-center bg-[#E8DEFF] px-4 py-12 text-[#2B1650]">
          <div className="text-sm font-semibold">Loading…</div>
        </main>
      }
    >
      <ConnectorSignUpForm />
    </Suspense>
  );
}

function ConnectorSignUpForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const referredByCode = searchParams.get('ref') || searchParams.get('referredByCode') || '';

  function finishSignIn(data: AuthResponse) {
    const connectorId = data.connector?._id || data.data?.connector?._id || data.id;
    if (!data.token || !connectorId) {
      throw new Error('Account created, but the server did not return a connector session.');
    }
    localStorage.setItem('connector_token', data.token);
    localStorage.setItem('connector_id', String(connectorId));
    router.push(`/lister/connectors/dashboard?connector=${encodeURIComponent(String(connectorId))}`);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError('');

    const form = new FormData(event.currentTarget);
    const fullName = String(form.get('fullName') || '').trim();
    const username = String(form.get('username') || '').trim();
    const email = String(form.get('email') || '').trim().toLowerCase();
    const password = String(form.get('password') || '');

    try {
      const response = await fetch(`${getApiBaseUrl()}/api/connectors/auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName,
          username: username || undefined,
          email,
          password,
          referredByCode: referredByCode || undefined,
        }),
      });
      const data: AuthResponse | null = await response.json().catch(() => null);
      if (!response.ok) throw new Error(data?.error || data?.message || `Account creation failed (${response.status})`);
      if (!data) throw new Error('The server returned an invalid sign-up response.');
      finishSignIn(data);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Unable to create your connector account. Please try again.');
      setLoading(false);
    }
  }

  async function handleGoogleCredential(idToken: string) {
    if (loading) return;
    setLoading(true);
    setError('');

    try {
      const response = await fetch(`${getApiBaseUrl()}/api/connectors/auth/google`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idToken }),
      });
      const data: AuthResponse | null = await response.json().catch(() => null);
      if (!response.ok) throw new Error(data?.error || data?.message || `Google sign-up failed (${response.status})`);
      if (!data) throw new Error('The server returned an invalid Google sign-up response.');
      finishSignIn(data);
    } catch (cause) {
      setError(
        cause instanceof TypeError
          ? 'Could not reach the connector service. Check your connection and try again.'
          : cause instanceof Error
            ? cause.message
            : 'Google sign-up failed.'
      );
      setLoading(false);
    }
  }

  const input =
    'mt-1.5 w-full rounded-xl border border-[#CFC3EE] bg-white px-4 py-3.5 text-base font-normal text-[#20201F] outline-none transition focus:border-[#4C1D95] focus:ring-4 focus:ring-[#4C1D95]/15 disabled:opacity-60';

  return (
    <div
      className="min-h-screen bg-[#E8DEFF] text-[#2B1650]"
      style={{ fontFamily: "'Lufga', 'DM Sans', 'Inter', system-ui, sans-serif" }}
    >
      <SiteHeader ctaLabel="Become a Vendor" demoHref="/watch-demo" />

      <main className="relative flex min-h-screen flex-col overflow-hidden pt-[120px] lg:block">
        {/* PHOTO: straight banner on mobile, slanted right edge on desktop only */}
        <div className="relative h-52 w-full shrink-0 sm:h-72 lg:absolute lg:inset-y-0 lg:left-0 lg:h-auto lg:w-[58%] lg:[clip-path:polygon(0_0,100%_0,89%_100%,0_100%)]">
          <img
            src={SIGNUP_IMAGE}
            alt="A connector checking her referral earnings on her phone"
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#170D29]/40 via-transparent to-transparent" />
        </div>

        {/* FORM PANEL */}
        <section className="relative z-10 flex flex-1 items-start px-5 pb-12 pt-8 sm:px-10 sm:pt-10 lg:ml-[58%] lg:min-h-screen lg:items-center lg:px-12 lg:py-16 xl:px-16">
          <div className="mx-auto w-full max-w-md lg:mx-0">
            <a href="/lister/connectors" className="text-sm font-extrabold tracking-tight text-[#4C1D95]">
              Koombo Connectors
            </a>

            <h1 className="mt-5 text-[2rem] font-black uppercase leading-[1] tracking-[-0.04em] text-[#3B1B73] sm:text-5xl">
              Create your connector account
            </h1>
            <p className="mt-4 text-[0.95rem] leading-7 text-[#3C3542]">
              Start earning by referring vendors and products to Koombo.
            </p>

            <div className="mt-6 flex w-full min-w-0 justify-center overflow-hidden rounded-full sm:mt-7 sm:justify-start [&>div]:max-w-full [&_iframe]:max-w-full [&_iframe]:rounded-full">
              <GoogleButton onCredential={handleGoogleCredential} text="signup_with" disabled={loading} onError={setError} />
            </div>

            <div className="my-5 flex items-center gap-3 text-[11px] sm:my-6 sm:text-xs font-semibold uppercase tracking-wider text-[#6B5A8E]">
              <span className="h-px flex-1 bg-[#CFC3EE]" />
              or sign up with email
              <span className="h-px flex-1 bg-[#CFC3EE]" />
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <label className="block text-sm font-semibold text-[#2B1650]">
                Full name
                <input name="fullName" type="text" autoComplete="name" required disabled={loading} className={input} />
              </label>

              <label className="block text-sm font-semibold text-[#2B1650]">
                Username (optional)
                <input name="username" type="text" autoComplete="username" disabled={loading} className={input} />
              </label>

              <label className="block text-sm font-semibold text-[#2B1650]">
                Email address
                <input name="email" type="email" autoComplete="email" required disabled={loading} className={input} />
              </label>

              <label className="block text-sm font-semibold text-[#2B1650]">
                Password
                <input
                  name="password"
                  type="password"
                  autoComplete="new-password"
                  minLength={8}
                  required
                  disabled={loading}
                  className={input}
                />
              </label>

              {referredByCode && (
                <div className="rounded-xl border border-[#C4B5FD] bg-white/70 px-3 py-2 text-xs font-medium text-[#4C1D95]">
                  Referral code detected: <span className="font-bold">{referredByCode}</span>
                </div>
              )}

              {error && (
                <p role="alert" className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-full bg-[#4C1D95] px-8 py-4 font-bold text-white sm:w-auto sm:py-3.5 shadow-lg shadow-[#4C1D95]/20 transition hover:bg-[#5B21B6] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#4C1D95]/30 disabled:cursor-wait disabled:opacity-60"
              >
                {loading ? 'Creating account…' : 'Create account'}
              </button>
            </form>

            <p className="mt-6 text-center text-sm text-[#3C3542] sm:text-left">
              Already have an account?{' '}
              <a href="/lister/connectors/signin" className="font-bold text-[#4C1D95] underline underline-offset-4 hover:text-[#5B21B6]">
                Sign in
              </a>
            </p>
          </div>
        </section>
      </main>

      <KoomboFooter />
    </div>
  );
}
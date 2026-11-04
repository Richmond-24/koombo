'use client';

import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';
import GoogleButton from '../../../components/GoogleButton';
import SiteHeader from '../../../components/SiteHeader';
import KoomboFooter from '../../../components/Footer';
import { getApiBaseUrl } from '../../../../lib/auth-config';

/* Photo from /public. Swap for any image you like. */
const SIGNIN_IMAGE = '/connect.jpg';

type AuthResponse = {
  token?: string;
  id?: string;
  connector?: { _id?: string };
  data?: { connector?: { _id?: string } };
  error?: string;
  message?: string;
};

export default function ConnectorSignInPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  function finishSignIn(data: AuthResponse) {
    const connectorId = data.connector?._id || data.data?.connector?._id || data.id;
    if (!data.token || !connectorId) {
      throw new Error('Sign-in succeeded, but the server did not return a connector account.');
    }
    localStorage.setItem('connector_token', data.token);
    localStorage.setItem('connector_id', connectorId);
    router.push(`/lister/connectors/dashboard?connector=${encodeURIComponent(connectorId)}`);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError('');

    const form = new FormData(event.currentTarget);
    const email = String(form.get('email') || '').trim();
    const password = String(form.get('password') || '');

    try {
      const response = await fetch(`${getApiBaseUrl()}/api/connectors/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data: AuthResponse | null = await response.json().catch(() => null);
      if (!response.ok) throw new Error(data?.error || data?.message || `Sign-in failed (${response.status})`);
      if (!data) throw new Error('The server returned an invalid sign-in response.');
      finishSignIn(data);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Unable to sign in. Please try again.');
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
      if (!response.ok) throw new Error(data?.error || data?.message || `Google sign-in failed (${response.status}).`);
      if (!data) throw new Error('The server returned an invalid Google sign-in response.');
      finishSignIn(data);
    } catch (cause) {
      setError(
        cause instanceof TypeError
          ? 'Could not reach the connector service. Check your connection and try again.'
          : cause instanceof Error
            ? cause.message
            : 'Google sign-in failed. Please try again.'
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
            src={SIGNIN_IMAGE}
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
              Welcome back
            </h1>
            <p className="mt-4 text-[0.95rem] leading-7 text-[#3C3542]">
              Sign in to continue to your connector dashboard.
            </p>

            <div className="mt-6 flex w-full min-w-0 justify-center overflow-hidden rounded-full sm:mt-7 sm:justify-start [&>div]:max-w-full [&_iframe]:max-w-full [&_iframe]:rounded-full">
              <GoogleButton onCredential={handleGoogleCredential} disabled={loading} onError={setError} />
            </div>

            <div className="my-5 flex items-center gap-3 text-[11px] font-semibold uppercase tracking-wider text-[#6B5A8E] sm:my-6 sm:text-xs">
              <span className="h-px flex-1 bg-[#CFC3EE]" />
              or sign in with email
              <span className="h-px flex-1 bg-[#CFC3EE]" />
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <label className="block text-sm font-semibold text-[#2B1650]">
                Email address
                <input name="email" type="email" autoComplete="email" required disabled={loading} className={input} />
              </label>

              <label className="block text-sm font-semibold text-[#2B1650]">
                Password
                <input
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  disabled={loading}
                  className={input}
                />
              </label>

              {error && (
                <p role="alert" className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-full bg-[#4C1D95] px-8 py-4 font-bold text-white shadow-lg shadow-[#4C1D95]/20 transition hover:bg-[#5B21B6] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#4C1D95]/30 disabled:cursor-wait disabled:opacity-60 sm:w-auto sm:py-3.5"
              >
                {loading ? 'Signing in…' : 'Sign in'}
              </button>
            </form>

            <p className="mt-6 text-center text-sm text-[#3C3542] sm:text-left">
              New to Koombo?{' '}
              <a
                href="/lister/connectors/signup"
                className="font-bold text-[#4C1D95] underline underline-offset-4 hover:text-[#5B21B6]"
              >
                Create an account
              </a>
            </p>
          </div>
        </section>
      </main>

      <KoomboFooter />
    </div>
  );
}
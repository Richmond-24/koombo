'use client';

import { FormEvent, useEffect, useMemo, useState } from 'react';
import GoogleButton from './GoogleButton';
import { getApiBaseUrl } from '../../lib/auth-config';

const STORAGE_KEY = 'koombo_bonanza_signup_seen';
const AUTH_KEYS = ['seller_token', 'connector_token', 'token'];

function hasExistingSession(): boolean {
  if (typeof window === 'undefined') return false;
  return AUTH_KEYS.some((key) => Boolean(window.localStorage.getItem(key)));
}

function hasSeenPopup(): boolean {
  if (typeof window === 'undefined') return true;
  return window.localStorage.getItem(STORAGE_KEY) === '1';
}

type AuthResponse = {
  token?: string;
  id?: string;
  connector?: { _id?: string };
  data?: { connector?: { _id?: string } };
  error?: string;
  message?: string;
};

export default function BonanzaSignupModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (hasExistingSession() || hasSeenPopup()) return;

    const timer = window.setTimeout(() => {
      setIsOpen(true);
    }, 1500);

    return () => window.clearTimeout(timer);
  }, []);

  const summary = useMemo(() => [
    'Free entry into the Koombo Bonanza draw',
    'Access to exclusive launch offers',
    'A faster route into trusted local sellers',
  ], []);

  function markSeen() {
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(STORAGE_KEY, '1');
    }
  }

  function closeModal() {
    markSeen();
    setIsOpen(false);
  }

  function persistAuth(data: AuthResponse) {
    const token = data.token;
    const connectorId = data.connector?._id || data.id || data.data?.connector?._id;
    if (!token || !connectorId) return;

    window.localStorage.setItem('connector_token', String(token));
    window.localStorage.setItem('connector_id', String(connectorId));
    window.localStorage.setItem('token', String(token));
  }

  async function handleEmailSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setError('');
    setSuccess('');

    const formData = new FormData(event.currentTarget);
    const fullName = String(formData.get('fullName') || '').trim();
    const email = String(formData.get('email') || '').trim().toLowerCase();
    const password = String(formData.get('password') || '');

    if (!fullName || !email || !password) {
      setError('Please enter your name, email and password.');
      setIsSubmitting(false);
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Enter a valid email address to join the draw.');
      setIsSubmitting(false);
      return;
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters long.');
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await fetch(`${getApiBaseUrl()}/api/connectors/auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fullName, email, password }),
      });

      const data: AuthResponse | null = await response.json().catch(() => null);
      if (!response.ok) {
        throw new Error(data?.error || data?.message || 'Unable to create your Koombo account.');
      }
      if (!data || !data.token) {
        throw new Error('The server did not return a valid account session.');
      }

      persistAuth(data);
      markSeen();
      setSuccess('You’re in! Your Koombo Bonanza entry has been saved.');
      window.setTimeout(() => setIsOpen(false), 1200);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'We could not complete your signup right now.');
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleGoogleCredential(idToken: string) {
    setIsSubmitting(true);
    setError('');
    setSuccess('');

    try {
      const response = await fetch(`${getApiBaseUrl()}/api/connectors/auth/google`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idToken }),
      });

      const data: AuthResponse | null = await response.json().catch(() => null);
      if (!response.ok) {
        throw new Error(data?.error || data?.message || 'Google signup failed.');
      }
      if (!data || !data.token) {
        throw new Error('Google sign-in did not return a valid session.');
      }

      persistAuth(data);
      markSeen();
      setSuccess('Google signup successful. Your Bonanza entry is ready.');
      window.setTimeout(() => setIsOpen(false), 1200);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Google signup failed.');
    } finally {
      setIsSubmitting(false);
    }
  }

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-[#170d29]/70 px-4 py-8 backdrop-blur-sm">
      <div className="relative w-full max-w-5xl overflow-hidden rounded-[28px] border border-[#E9D7FF] bg-[#fffdfb] shadow-[0_30px_90px_rgba(70,31,120,0.32)]">
        <button
          type="button"
          aria-label="Close Bonanza signup"
          onClick={closeModal}
          className="absolute right-4 top-4 z-10 inline-flex h-10 w-10 items-center justify-center rounded-full border border-[#E7DFFA] bg-white text-lg text-[#2B1650] transition hover:bg-[#F5F1FF]"
        >
          ×
        </button>

        <div className="grid md:grid-cols-[1.05fr_0.95fr]">
          <div className="relative overflow-hidden bg-[#1f1231] p-6 sm:p-8 md:p-10">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(160,121,255,0.36),transparent_38%),radial-gradient(circle_at_bottom_right,_rgba(34,211,238,0.18),transparent_35%)]" />
            <div className="relative z-10">
              <div className="inline-flex items-center rounded-full border border-white/20 bg-white/10 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.22em] text-white/80">
                Koombo Bonanza Draw
              </div>

              <h2 className="mt-6 max-w-md text-3xl font-black tracking-[-0.06em] text-white sm:text-4xl">
                Unlock a free entry before launch.
              </h2>

              <p className="mt-4 max-w-md text-base leading-7 text-violet-100/80">
                Join the first wave of Koombo shoppers and sellers. Winners get merchandise, delivery credit, and a spotlight on our launch campaign.
              </p>

              <div className="mt-8 space-y-3">
                {summary.map((item) => (
                  <div key={item} className="flex items-start gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white/90">
                    <span className="mt-0.5 inline-flex h-5 w-5 items-center justify-center rounded-full bg-[#9b6bff] text-xs font-black text-white">✓</span>
                    <span>{item}</span>
                  </div>
                ))}
              </div>

              <div className="mt-8 flex items-center gap-4 text-sm text-violet-100/75">
                <div className="rounded-full border border-white/15 bg-white/5 px-3 py-2 font-semibold">Limited slots</div>
                <div className="rounded-full border border-white/15 bg-white/5 px-3 py-2 font-semibold">Free to join</div>
              </div>
            </div>
          </div>

          <div className="bg-[#fffdfb] p-6 sm:p-8 md:p-10">
            <div className="mb-5">
              <div className="text-sm font-bold uppercase tracking-[0.18em] text-[#6D38B8]">Create your entry</div>
              <h3 className="mt-3 text-2xl font-black tracking-[-0.05em] text-[#2B1650]">Join Koombo today</h3>
            </div>

            <div className="mb-5 overflow-hidden rounded-2xl border border-[#E9D7FF] bg-[#F8F3FF] px-3 py-2 text-sm text-[#4C1D95] shadow-inner">
              <GoogleButton
                text="signup_with"
                onCredential={handleGoogleCredential}
                disabled={isSubmitting}
                onError={setError}
              />
            </div>

            <div className="mb-5 flex items-center gap-3 text-[11px] font-bold uppercase tracking-[0.18em] text-[#7A6D8C]">
              <span className="h-px flex-1 bg-[#E7DFFA]" />
              Or sign up with email
              <span className="h-px flex-1 bg-[#E7DFFA]" />
            </div>

            <form onSubmit={handleEmailSubmit} className="space-y-4">
              <label className="block text-sm font-semibold text-[#2B1650]">
                Full name
                <input
                  name="fullName"
                  type="text"
                  autoComplete="name"
                  required
                  disabled={isSubmitting}
                  className="mt-2 w-full rounded-xl border border-[#E4D7F5] bg-white px-3.5 py-3 text-base text-[#22162F] outline-none transition focus:border-[#5B21B6] focus:ring-4 focus:ring-[#5B21B6]/10 disabled:opacity-60"
                  placeholder="Jane Doe"
                />
              </label>

              <label className="block text-sm font-semibold text-[#2B1650]">
                Email address
                <input
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  disabled={isSubmitting}
                  className="mt-2 w-full rounded-xl border border-[#E4D7F5] bg-white px-3.5 py-3 text-base text-[#22162F] outline-none transition focus:border-[#5B21B6] focus:ring-4 focus:ring-[#5B21B6]/10 disabled:opacity-60"
                  placeholder="you@example.com"
                />
              </label>

              <label className="block text-sm font-semibold text-[#2B1650]">
                Password
                <input
                  name="password"
                  type="password"
                  autoComplete="new-password"
                  minLength={8}
                  required
                  disabled={isSubmitting}
                  className="mt-2 w-full rounded-xl border border-[#E4D7F5] bg-white px-3.5 py-3 text-base text-[#22162F] outline-none transition focus:border-[#5B21B6] focus:ring-4 focus:ring-[#5B21B6]/10 disabled:opacity-60"
                  placeholder="Create a password"
                />
              </label>

              {error && (
                <p role="alert" className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                  {error}
                </p>
              )}

              {success && (
                <p role="status" className="rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
                  {success}
                </p>
              )}

              <div className="flex flex-col gap-3 pt-1 sm:flex-row">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex flex-1 items-center justify-center rounded-full bg-[#5B21B6] px-5 py-3.5 text-sm font-bold text-white transition hover:bg-[#4C1D95] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isSubmitting ? 'Joining…' : 'Join the draw'}
                </button>
                <button
                  type="button"
                  onClick={closeModal}
                  className="rounded-full border border-[#E7DFFA] bg-white px-5 py-3.5 text-sm font-bold text-[#2B1650] transition hover:bg-[#F5F1FF]"
                >
                  Maybe later
                </button>
              </div>
            </form>

            <p className="mt-5 text-xs leading-6 text-[#635B70]">
              By joining, you agree to Koombo’s terms and to receive launch updates. You can opt out later.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

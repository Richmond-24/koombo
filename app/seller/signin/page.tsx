'use client';

/**
 * Seller sign-in page: save as app/seller/signin/page.tsx
 * Sign-in only (email + password, or Google). New sellers are sent to the listing flow.
 */
import { FormEvent, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, ArrowRight, Eye, EyeOff } from 'lucide-react';
import GoogleButton from '../../components/GoogleButton';
import { getApiBaseUrl } from '../../../lib/auth-config';

const API_BASE = getApiBaseUrl();
const CREATE_ACCOUNT_HREF = '/lister/setup'; // <- route of your seller listing / account-creation flow
const PHOTO = 'https://images.unsplash.com/photo-1546213290-e1b492ab3eee?auto=format&fit=crop&w=1400&q=80';

const inputClass =
  'mt-2 block w-full rounded-2xl border border-stone-200 bg-white px-4 py-3.5 text-base text-stone-900 outline-none transition placeholder:text-stone-400 hover:border-stone-300 focus:border-[#5B21B6] focus:ring-4 focus:ring-[#5B21B6]/10 disabled:bg-stone-50 disabled:text-stone-400';

function safeNext(value: string | null) {
  return value?.startsWith('/') && !value.startsWith('//') ? value : null;
}

export default function SellerSignInPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  function destination(id: string, token: string) {
    const query = new URLSearchParams(window.location.search);
    return safeNext(query.get('next')) || `/sellers/${encodeURIComponent(id)}#seller_token=${encodeURIComponent(token)}`;
  }

  function startSession(data: any) {
    const id = data?.seller?.id || data?.seller?._id || data?.sellerId || data?.id;
    if (!data?.token || !id) throw new Error('Your account response was incomplete. Please try again.');
    const sellerId = String(id);
    const token = String(data.token);
    localStorage.setItem('seller_id', sellerId);
    localStorage.setItem('seller_token', token);
    window.location.assign(destination(sellerId, token));
  }

  function friendly(cause: unknown, fallback: string) {
    if (cause instanceof TypeError) return 'Could not reach the seller service. Check your connection and try again.';
    return cause instanceof Error ? cause.message : fallback;
  }

  async function handleGoogleCredential(credential: string) {
    if (loading) return;
    setLoading(true);
    setError('');
    try {
      const response = await fetch(`${API_BASE}/api/sellers/auth/google`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ credential }),
      });
      const data = await response.json().catch(() => null);
      if (response.status === 404) {
        setLoading(false);
        return;
      }
      if (!response.ok) throw new Error(data?.error || data?.message || 'Google sign-in failed. Try email and password instead.');
      startSession(data);
    } catch (cause) {
      setError(friendly(cause, 'Google sign-in failed. Please try again.'));
      setLoading(false);
    }
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (loading) return;
    setLoading(true);
    setError('');
    const form = new FormData(event.currentTarget);
    const email = String(form.get('email') || '').trim().toLowerCase();
    const password = String(form.get('password') || '');
    try {
      const response = await fetch(`${API_BASE}/api/sellers/auth/login`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email, password }),
      });
      const data = await response.json().catch(() => null);
      if (!response.ok) {
        if (response.status === 401) throw new Error(data?.error || 'Email or password is incorrect. Check your details and try again.');
        throw new Error(data?.error || data?.message || 'Could not sign you in. Please try again.');
      }
      startSession(data);
    } catch (cause) {
      setError(friendly(cause, 'Something went wrong. Please try again.'));
      setLoading(false);
    }
  }

  return (
    <main
      className="ks min-h-[100dvh] bg-[#F4F1EC] px-3 pb-[max(1rem,env(safe-area-inset-bottom))] pt-[max(0.75rem,env(safe-area-inset-top))] text-[#24133F] sm:px-6 sm:py-8 lg:flex lg:items-center lg:justify-center lg:py-10"
    >
      <style jsx global>{`
        .ks, .ks input, .ks button { font-family: "Inter", "Segoe UI", "Helvetica Neue", Arial, sans-serif; }
        @keyframes ks-rise { from { opacity: 0; transform: translateY(10px) } to { opacity: 1; transform: none } }
        .ks-rise { animation: ks-rise .45s ease-out both; }
        @media (prefers-reduced-motion: reduce) { .ks-rise { animation: none; } }
      `}</style>

      <div className="ks-rise mx-auto flex w-full max-w-[1080px] flex-col overflow-hidden rounded-[28px] bg-white shadow-[0_30px_90px_-40px_rgba(36,19,63,.45)] ring-1 ring-[#24133F]/5 sm:rounded-[36px] lg:min-h-[640px] lg:flex-row">
        {/* PHOTO PANEL */}
        <aside className="relative h-56 shrink-0 bg-[#d9cfc2] sm:h-72 lg:h-auto lg:w-[46%]">
          <img src={PHOTO} alt="A shopper browsing clothes on a rail inside a boutique" className="absolute inset-0 h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#24133F]/80 via-[#24133F]/15 to-[#24133F]/25" />

          <div className="absolute inset-x-0 top-0 flex items-center justify-between p-4 sm:p-6">
            <Link href="/" className="text-2xl font-bold tracking-tight text-white">koombo<span className="text-[#C4B5FD]">.</span></Link>
            <Link href="/" className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3.5 py-2 text-xs font-semibold text-white backdrop-blur-md transition hover:bg-white/25 sm:text-sm">
              <ArrowLeft size={15} /> Marketplace
            </Link>
          </div>

          <div className="absolute inset-x-0 bottom-0 hidden p-8 text-white lg:block">
            <p className="max-w-xs text-[34px] font-semibold leading-[1.1] tracking-[-0.03em]">Your shop is waiting for you.</p>
            <p className="mt-4 text-xs text-white/70">
              Photo by <a href="https://unsplash.com/photos/IzIME1jwjCY" target="_blank" rel="noopener noreferrer" className="underline underline-offset-2 hover:text-white">Korie Cull</a> on Unsplash
            </p>
          </div>
        </aside>

        {/* FORM PANEL: overlaps the photo on mobile like a bottom sheet */}
        <section className="relative -mt-7 flex-1 rounded-t-[28px] bg-white px-5 pb-8 pt-8 sm:-mt-8 sm:rounded-t-[36px] sm:px-10 sm:pb-10 sm:pt-10 lg:mt-0 lg:flex lg:items-center lg:rounded-none lg:px-14 lg:py-12">
          <div className="mx-auto w-full max-w-[420px]">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#5B21B6]">Koombo Seller</p>
            <h1 className="mt-2 text-[30px] font-semibold leading-tight tracking-[-0.03em] sm:text-[34px]">Welcome back</h1>
            <p className="mt-2 text-[15px] leading-6 text-stone-600">Sign in to manage your shop and listings.</p>

            <div className="mt-7">
              <GoogleButton text="signin_with" onCredential={handleGoogleCredential} disabled={loading} onError={setError} />
            </div>

            <div className="my-6 flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.13em] text-stone-400">
              <span className="h-px flex-1 bg-stone-200" />or use email<span className="h-px flex-1 bg-stone-200" />
            </div>

            <form onSubmit={submit} className="space-y-4" noValidate={false}>
              <label className="block text-sm font-semibold text-stone-700">
                Email address
                <input className={inputClass} type="email" name="email" autoComplete="email" inputMode="email" placeholder="you@example.com" required disabled={loading} />
              </label>

              <label className="block text-sm font-semibold text-stone-700">
                Password
                <span className="relative mt-2 block">
                  <input className={`${inputClass} !mt-0 pr-12`} type={showPassword ? 'text' : 'password'} name="password" autoComplete="current-password" placeholder="Enter your password" required disabled={loading} />
                  <button type="button" onClick={() => setShowPassword((v) => !v)} aria-label={showPassword ? 'Hide password' : 'Show password'} className="absolute inset-y-0 right-1 flex w-11 items-center justify-center rounded-xl text-stone-400 transition hover:text-stone-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#5B21B6]">
                    {showPassword ? <EyeOff size={19} /> : <Eye size={19} />}
                  </button>
                </span>
              </label>

              {error && (
                <p role="alert" className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm leading-5 text-red-700">{error}</p>
              )}

              <button type="submit" disabled={loading} className="group inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-[#5B21B6] px-5 py-4 text-[15px] font-semibold text-white shadow-[0_12px_28px_-12px_rgba(91,33,182,.7)] transition hover:bg-[#4C1D95] active:scale-[0.99] focus-visible:outline focus-visible:outline-4 focus-visible:outline-offset-2 focus-visible:outline-violet-300 disabled:cursor-wait disabled:opacity-60">
                {loading ? 'Signing you in…' : 'Sign in'}
                {!loading && <ArrowRight size={18} className="transition-transform group-hover:translate-x-0.5" />}
              </button>
            </form>

            <p className="mt-7 text-center text-sm text-stone-600">
              New to Koombo?{' '}
              <Link href={CREATE_ACCOUNT_HREF} className="font-semibold text-[#5B21B6] underline-offset-4 hover:underline">Create a seller account</Link>
            </p>

            <p className="mt-6 text-center text-xs leading-5 text-stone-500">
              By signing in, you agree to Koombo’s{' '}
              <Link href="/terms" className="font-semibold text-stone-700 underline underline-offset-2">Terms</Link> and{' '}
              <Link href="/privacy" className="font-semibold text-stone-700 underline underline-offset-2">Privacy Policy</Link>.
            </p>

            <p className="mt-4 text-center text-[11px] text-stone-400 lg:hidden">
              Photo by <a href="https://unsplash.com/photos/IzIME1jwjCY" target="_blank" rel="noopener noreferrer" className="underline underline-offset-2">Korie Cull</a> on Unsplash
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}
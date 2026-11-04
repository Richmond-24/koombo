'use client';

import React, { useEffect, useRef, useState } from 'react';

type Connector = { _id?: string; fullName?: string; referralCode?: string; email?: string; mobileMoneyNumber?: string; mobileMoneyNetwork?: string; minimumWithdrawalAmount?: number };
type AnalyticsPoint = { date: string; count: number };
type ActivityItem = { id: string; type: string; name: string; status?: string; createdAt?: string };
type DashboardAnalytics = {
  totalReferrals: number;
  referralsInRange: number;
  rangeDays: number;
  referralsByDate: AnalyticsPoint[];
  recentActivity: ActivityItem[];
};

const COMMISSION_RATE = 2; // percent
const PAYOUT_THRESHOLD = 1000;
const MERCH_GOAL = 10;
const money = (value: number) => `GH₵${(value || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
const RANGES = ['7d', '30d', '90d'] as const;
const MERCH_ITEMS = [
  { id: 'tee', label: 'T-shirt' },
  { id: 'cap', label: 'Cap' },
  { id: 'mug', label: 'Mug' },
] as const;
type MerchId = (typeof MERCH_ITEMS)[number]['id'];

const getInviteLink = (referralCode?: string) => {
  if (!referralCode) return '';
  const path = `/lister/connectors?ref=${encodeURIComponent(referralCode)}`;
  return typeof window === 'undefined' ? path : `${window.location.origin}${path}`;
};

/* ---------- Animated counter ---------- */
function useCountUp(target: number, duration = 1200, delay = 300) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    let raf = 0;
    const from = 0;
    const start = performance.now() + delay;
    const tick = (now: number) => {
      const t = Math.min(Math.max((now - start) / duration, 0), 1);
      setValue(from + (target - from) * (1 - Math.pow(1 - t, 4)));
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, duration, delay]);
  return value;
}

const reveal = (delay: number): React.CSSProperties => ({
  animation: `riseIn 0.8s cubic-bezier(0.16, 1, 0.3, 1) ${delay}s both`,
});

/* ---------- Tilt-on-hover wrapper (Figma-style smart-animate feel) ---------- */
function Tilt({ children, className = '', max = 6 }: { children: React.ReactNode; className?: string; max?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const onMove = (e: React.MouseEvent) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    el.style.setProperty('--rx', `${(-y * max).toFixed(2)}deg`);
    el.style.setProperty('--ry', `${(x * max).toFixed(2)}deg`);
    el.style.setProperty('--mx', `${((x + 0.5) * 100).toFixed(1)}%`);
    el.style.setProperty('--my', `${((y + 0.5) * 100).toFixed(1)}%`);
  };
  const onLeave = () => {
    const el = ref.current;
    if (!el) return;
    el.style.setProperty('--rx', '0deg');
    el.style.setProperty('--ry', '0deg');
  };
  return (
    <div ref={ref} onMouseMove={onMove} onMouseLeave={onLeave} className={`tilt ${className}`}>
      {children}
    </div>
  );
}

export default function ConnectorDashboard() {
  const [connectorId, setConnectorId] = useState<string | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [timeRange, setTimeRange] = useState<(typeof RANGES)[number]>('7d');
  const [connector, setConnector] = useState<Connector | null>(null);
  const [analytics, setAnalytics] = useState<DashboardAnalytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [linkCopied, setLinkCopied] = useState(false);
  const [showProductLink, setShowProductLink] = useState(false);
  const [ledgerSummary, setLedgerSummary] = useState<{ availableBalance?: number; totalEarned?: number; pending?: number; totalWithdrawn?: number; minimumWithdrawalAmount?: number }>({});
  const [withdrawalAmount, setWithdrawalAmount] = useState('100');
  const [withdrawalMessage, setWithdrawalMessage] = useState('');
  const [withdrawing, setWithdrawing] = useState(false);
  const [shareNotice, setShareNotice] = useState('');
  const [hoverIdx, setHoverIdx] = useState<number | null>(null);
  const [merchItem, setMerchItem] = useState<MerchId>('tee');

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const params = new URLSearchParams(window.location.search);
    const resolved = params.get('connector') || localStorage.getItem('connector_id');
    if (resolved) {
      setConnectorId(resolved);
      localStorage.setItem('connector_id', resolved);
    }
  }, []);

  useEffect(() => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('connector_token') : null;
    if (!connectorId && !token) {
      setLoading(false);
      return;
    }

    async function load() {
      setLoading(true);
      setLoadError(null);
      const globalTimeoutId = setTimeout(() => {
        setLoading(false);
        setLoadError('Failed to load dashboard. Please check your connection.');
      }, 10000);

      try {
        const token = typeof window !== 'undefined' ? localStorage.getItem('connector_token') : null;
        const headers: any = token ? { Authorization: `Bearer ${token}` } : {};
        const apiBase =
          process.env.NEXT_PUBLIC_API_BASE ||
          (typeof window !== 'undefined' && window.location.hostname.includes('localhost') ? 'http://localhost:5000' : '');
        if (!apiBase) throw new Error('API missing');

        const controller = new AbortController();
        setTimeout(() => controller.abort(), 5000);

        const res = await fetch(`${apiBase}/api/connectors/auth/me`, { headers, signal: controller.signal });
        const json = await res.json().catch(() => null);

        if (res.ok && json?.connector) {
          setConnector(json.connector);
          if (json.connector._id) {
            localStorage.setItem('connector_id', json.connector._id);
            setConnectorId(json.connector._id);
          }
        } else if (connectorId) {
          const r2 = await fetch(`${apiBase}/api/connectors/${connectorId}`, { signal: controller.signal });
          const j2 = await r2.json().catch(() => null);
          setConnector(j2?.data || j2?.connector || j2 || null);
        }

        const currentId = connectorId || (typeof window !== 'undefined' ? localStorage.getItem('connector_id') : null);
        if (currentId) {
          const [analyticsRes, ledgerRes, settingsRes] = await Promise.all([
            fetch(`${apiBase}/api/connectors/${currentId}/analytics?range=${timeRange}`, {
              headers: { ...headers, Accept: 'application/json' },
              signal: controller.signal,
            }),
            fetch(`${apiBase}/api/connectors/${currentId}/ledger-summary`, {
              headers: { ...headers, Accept: 'application/json' },
              signal: controller.signal,
            }),
            fetch(`${apiBase}/api/connectors/${currentId}/payout-settings`, {
              headers: { ...headers, Accept: 'application/json' },
              signal: controller.signal,
            }),
          ]);
          const analyticsJson = await analyticsRes.json().catch(() => null);
          const ledgerJson = await ledgerRes.json().catch(() => null);
          const settingsJson = await settingsRes.json().catch(() => null);
          setAnalytics(analyticsRes.ok && analyticsJson?.data ? analyticsJson.data : null);
          if (ledgerJson?.success) setLedgerSummary(ledgerJson.summary || {});
          if (settingsJson?.success) {
            setConnector((existing) => ({
              ...(existing || {}),
              mobileMoneyNumber: settingsJson.payoutSettings?.mobileMoneyNumber || existing?.mobileMoneyNumber || '',
              mobileMoneyNetwork: settingsJson.payoutSettings?.mobileMoneyNetwork || existing?.mobileMoneyNetwork || '',
              minimumWithdrawalAmount: settingsJson.minimumWithdrawalAmount || existing?.minimumWithdrawalAmount || 100,
            }));
          }
        }
        clearTimeout(globalTimeoutId);
      } catch {
        setConnector(null);
        setAnalytics(null);
        clearTimeout(globalTimeoutId);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [connectorId, timeRange]);

  const handleCopyCode = () => {
    if (!connector?.referralCode) return;
    navigator.clipboard.writeText(connector.referralCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCopyInviteLink = async () => {
    const link = getInviteLink(connector?.referralCode);
    if (!link) return;
    await navigator.clipboard.writeText(link);
    setLinkCopied(true);
    setTimeout(() => setLinkCopied(false), 2000);
  };

  const sellerInviteLink = connector?.referralCode ? getInviteLink(connector.referralCode) : '';
  const whatsappSellerLink = sellerInviteLink
    ? `https://wa.me/?text=${encodeURIComponent(
        `Hi! Start selling on Koombo today. Use my invite link to list your products and grow your business: ${sellerInviteLink}`
      )}`
    : '';

  const notify = (msg: string) => {
    setShareNotice(msg);
    window.setTimeout(() => setShareNotice(''), 3500);
  };

  const copySellerInvite = async () => {
    if (!sellerInviteLink) return;
    try {
      await navigator.clipboard.writeText(sellerInviteLink);
      notify('Seller invite link copied. Paste it in WhatsApp or Telegram.');
    } catch {
      notify('Could not copy automatically. Please select and copy manually.');
    }
  };

  const shareSellerInvite = async () => {
    if (!sellerInviteLink) return;
    try {
      if (navigator.share) {
        await navigator.share({
          title: 'List your products on Koombo',
          text: 'Use this invite link to create your seller account and list your products on Koombo.',
          url: sellerInviteLink,
        });
        notify('Invite shared.');
      } else {
        await copySellerInvite();
      }
    } catch (error) {
      if ((error as DOMException)?.name === 'AbortError') return;
      await copySellerInvite();
    }
  };

  const totalReferrals = useCountUp(analytics?.totalReferrals ?? 0);
  const referralsInRange = useCountUp(analytics?.referralsInRange ?? 0, 1200, 400);
  const earningsRaw = (analytics?.totalReferrals ?? 0) * 5;
  const earnings = useCountUp(earningsRaw, 1400, 300);
  const activeSellerCount = (analytics?.recentActivity ?? []).filter((item) =>
    ['active', 'approved', 'verified', 'complete', 'live'].includes(String(item.status || '').toLowerCase())
  ).length;

  const minimumWithdrawal = Number(ledgerSummary.minimumWithdrawalAmount || connector?.minimumWithdrawalAmount || 100);
  const availableBalance = Number(ledgerSummary.availableBalance ?? 0);
  const remainingToMinimum = Math.max(minimumWithdrawal - availableBalance, 0);

  const handleWithdrawalRequest = async () => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('connector_token') : null;
    const currentId = connectorId || (typeof window !== 'undefined' ? localStorage.getItem('connector_id') : null);
    if (!currentId || !token) return;
    const typedAmount = Number(withdrawalAmount || 0);
    if (!Number.isFinite(typedAmount) || typedAmount <= 0) {
      setWithdrawalMessage('Enter a valid withdrawal amount.');
      return;
    }
    setWithdrawing(true);
    setWithdrawalMessage('');
    try {
      const apiBase = process.env.NEXT_PUBLIC_API_BASE || (typeof window !== 'undefined' && window.location.hostname.includes('localhost') ? 'http://localhost:5000' : '');
      const response = await fetch(`${apiBase}/api/connectors/${currentId}/withdrawals/request`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          amount: typedAmount,
          mobileMoneyNumber: connector?.mobileMoneyNumber || '',
          mobileMoneyNetwork: connector?.mobileMoneyNetwork || '',
        }),
      });
      const json = await response.json().catch(() => null);
      if (!response.ok || !json?.success) throw new Error(json?.error || 'Withdrawal request failed.');
      setWithdrawalMessage('Withdrawal requested successfully.');
      setWithdrawalAmount(String(minimumWithdrawal));
      const summaryResponse = await fetch(`${apiBase}/api/connectors/${currentId}/ledger-summary`, { headers: { Authorization: `Bearer ${token}` } });
      const summaryJson = await summaryResponse.json().catch(() => null);
      if (summaryJson?.success) setLedgerSummary(summaryJson.summary || {});
    } catch (error) {
      setWithdrawalMessage(error instanceof Error ? error.message : 'Withdrawal request failed.');
    } finally {
      setWithdrawing(false);
    }
  };

  const currentSellers = Math.round(totalReferrals);
  const merchProgress = Math.min((currentSellers / MERCH_GOAL) * 100, 100);
  const isMerchUnlocked = (analytics?.totalReferrals ?? 0) >= MERCH_GOAL;
  const payoutProgress = Math.min((earningsRaw / PAYOUT_THRESHOLD) * 100, 100);
  const payoutRemaining = Math.max(PAYOUT_THRESHOLD - earningsRaw, 0);

  /* chart geometry */
  const series = analytics?.referralsByDate ?? [];
  const maxCount = Math.max(...series.map((p) => p.count), 1);
  const pts = series.map((p, i) => ({
    x: 30 + (i / Math.max(series.length - 1, 1)) * 740,
    y: 170 - (p.count / maxCount) * 120,
    ...p,
  }));
  const linePath = pts.length
    ? pts.reduce((acc, p, i) => {
        if (i === 0) return `M ${p.x} ${p.y}`;
        const prev = pts[i - 1];
        const cx = (prev.x + p.x) / 2;
        return `${acc} C ${cx} ${prev.y}, ${cx} ${p.y}, ${p.x} ${p.y}`;
      }, '')
    : 'M 30 170 L 770 170';
  const areaPath = pts.length ? `${linePath} L ${pts[pts.length - 1].x} 190 L ${pts[0].x} 190 Z` : '';

  if (loading) {
    return (
      <div className="min-h-screen bg-white px-4 sm:px-8 py-8">
        <Styles />
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="skeleton h-10 w-56" />
          <div className="skeleton h-56 rounded-[28px]" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="skeleton h-32" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!connectorId || loadError || !connector) {
    return (
      <ErrorShell
        title={!connectorId ? 'Invalid access' : loadError ? 'Connection error' : 'Account not found'}
        message={loadError || (!connectorId ? 'No connector ID provided.' : 'Connector account not found.')}
        action={
          loadError ? (
            <button
              onClick={() => window.location.reload()}
              className="w-full py-3 px-4 bg-violet-700 text-white font-semibold rounded-xl hover:bg-violet-800 transition-all active:scale-95"
            >
              Try again
            </button>
          ) : undefined
        }
      />
    );
  }

  const firstName = (connector.fullName?.split(' ')[0] || '').trim();
  const initials = (connector.fullName?.charAt(0) || '?').toUpperCase();

  return (
    <div className="min-h-screen bg-white text-zinc-800 relative overflow-hidden">
      <Styles />

      {shareNotice && (
        <div role="status" className="toast fixed right-4 top-4 z-50 max-w-sm rounded-2xl px-4 py-3 text-sm font-semibold shadow-2xl pop-in">
          {shareNotice}
        </div>
      )}

      {/* Ambient background: drifting grey blobs + dotted grid */}
      <div className="fixed inset-0 z-0 pointer-events-none" aria-hidden>
        <div className="blob absolute -top-40 -right-32 w-[560px] h-[560px] bg-violet-300/30" />
        <div className="blob blob-b absolute -bottom-48 -left-32 w-[520px] h-[520px] bg-violet-200/50" />
        <div className="absolute inset-0 dot-grid opacity-[0.35]" />
      </div>

      {/* Header */}
      <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-xl border-b border-zinc-200" style={reveal(0)}>
        <div className="max-w-7xl mx-auto px-4 sm:px-8 h-16 sm:h-[72px] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-white flex items-center justify-center shrink-0 logo-wiggle">
              <img src="/koombo-logo.png" alt="Koombo" className="w-full h-full object-contain p-1.5" />
            </div>
            <span className="font-semibold tracking-tight text-zinc-800 hidden sm:block">Koombo Connectors</span>
          </div>
          <div className="flex items-center gap-3 sm:gap-4">
            <button aria-label="Notifications" className="relative p-2.5 text-zinc-500 hover:text-violet-700 hover:bg-violet-50 rounded-full transition-all active:scale-90">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
              <span className="absolute top-2 right-2.5 w-2 h-2 bg-violet-600 rounded-full ping-dot" />
            </button>
            <div className="flex items-center gap-3 pl-3 sm:pl-4 border-l border-zinc-200">
              <div className="hidden sm:flex flex-col items-end leading-tight">
                <span className="text-sm font-semibold truncate max-w-[150px]">{connector.fullName}</span>
                <span className="text-[11px] text-zinc-500 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 ping-dot" /> Active connector
                </span>
              </div>
              <div className="w-10 h-10 rounded-full p-[2px] ring-spin shrink-0">
                <div className="w-full h-full rounded-full bg-white text-zinc-800 flex items-center justify-center text-sm font-bold">{initials}</div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-8 py-6 sm:py-10 space-y-6 sm:space-y-8">
        {/* Welcome */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-5" style={reveal(0.05)}>
          <div>
            <p className="text-sm text-zinc-500 mb-2">Connector dashboard</p>
            <h1 className="text-3xl sm:text-5xl font-semibold tracking-tight leading-[1.05] shine-text">
              Welcome back, {firstName}
              <span className="inline-block wave ml-2">👋</span>
            </h1>
            <p className="text-zinc-500 mt-3 text-sm sm:text-lg max-w-xl">
              Bring businesses to Koombo and refer products. You earn {COMMISSION_RATE}% commission on what they sell.
            </p>
          </div>
          <button
            onClick={() => setShowProductLink((v) => !v)}
            aria-expanded={showProductLink}
            className="btn-light group w-full sm:w-auto"
          >
            <svg className={`w-4 h-4 transition-transform duration-500 ${showProductLink ? 'rotate-[135deg]' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.4} d="M12 4v16m8-8H4" />
            </svg>
            {showProductLink ? 'Hide seller link' : 'Invite a seller'}
          </button>
        </div>

        {/* IMPORTANT: Commission hero */}
        <Tilt max={3}>
          <section className="commission relative overflow-hidden rounded-[28px] p-5 sm:p-8" style={reveal(0.12)} aria-label="Commission information">
            <div className="absolute inset-0 spotlight pointer-events-none" />
            <div className="relative grid gap-6 lg:grid-cols-[auto_1fr] lg:items-center">
              <div className="flex items-center gap-5">
                <div className="pct-badge" aria-hidden>
                  <span className="pct-num">{COMMISSION_RATE}</span>
                  <span className="pct-sign">%</span>
                </div>
                <div className="lg:hidden">
                  <p className="text-lg font-semibold leading-tight">Your commission rate</p>
                  <p className="text-sm text-zinc-500">Paid on every sale</p>
                </div>
              </div>

              <div>
                <div className="hidden lg:block mb-4">
                  <p className="text-2xl font-semibold tracking-tight">You earn {COMMISSION_RATE}% commission, every time.</p>
                  <p className="text-zinc-500 mt-1">Two ways to earn. Both pay {COMMISSION_RATE}% of the sale value.</p>
                </div>
                <div className="grid sm:grid-cols-2 gap-3">
                  <div className="earn-card">
                    <div className="earn-icon">
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M3 21h18M5 21V7l8-4v18M19 21V11l-6-4M9 9v.01M9 12v.01M9 15v.01M9 18v.01" />
                      </svg>
                    </div>
                    <div>
                      <p className="font-semibold">Bring businesses</p>
                      <p className="text-sm text-zinc-500 mt-0.5">Get {COMMISSION_RATE}% of every sale from businesses that join through your link.</p>
                    </div>
                  </div>
                  <div className="earn-card">
                    <div className="earn-icon">
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                      </svg>
                    </div>
                    <div>
                      <p className="font-semibold">Refer products</p>
                      <p className="text-sm text-zinc-500 mt-0.5">Get {COMMISSION_RATE}% when a product you referred is bought.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </Tilt>

        {/* Seller invite panel */}
        <div className={`collapse-grid ${showProductLink ? 'open' : ''}`}>
          <div className="overflow-hidden">
            <div className="panel rounded-[24px] p-5 sm:p-6">
              <p className="text-sm text-zinc-500">Seller referral link</p>
              <h3 className="mt-1 text-xl sm:text-2xl font-semibold tracking-tight">Send this link to a business</h3>
              <p className="mt-2 text-sm text-zinc-500 max-w-2xl">
                Anyone who signs up with this link stays attributed to you, so you earn {COMMISSION_RATE}% on their sales.
              </p>
              {sellerInviteLink ? (
                <div className="mt-5 space-y-4">
                  <a href={sellerInviteLink} target="_blank" rel="noreferrer" className="link-chip">
                    {sellerInviteLink}
                  </a>
                  <div className="flex flex-col gap-3 sm:flex-row">
                    <a href={whatsappSellerLink} target="_blank" rel="noreferrer" className="btn-light w-full sm:w-auto">
                      Send on WhatsApp
                    </a>
                    <button type="button" onClick={shareSellerInvite} className="btn-ghost w-full sm:w-auto">
                      Share to another app
                    </button>
                    <button type="button" onClick={copySellerInvite} className="btn-ghost w-full sm:w-auto">
                      Copy link
                    </button>
                  </div>
                </div>
              ) : (
                <div className="mt-5 rounded-2xl border border-zinc-200 bg-zinc-50 p-4 text-sm text-zinc-600">
                  Your referral code isn’t available yet. Refresh the page or sign in again.
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4" style={reveal(0.2)}>
          <StatCard title="Total earnings" value={`GH₵${earnings.toFixed(2)}`} subtitle={`${COMMISSION_RATE}% on seller sales`} icon="currency" />
          <StatCard title="Sellers recruited" value={Math.round(totalReferrals)} subtitle={`${activeSellerCount} active`} icon="users" />
          <StatCard title="This period" value={Math.round(referralsInRange)} subtitle={`Last ${timeRange}`} icon="chart" />
          <StatCard title="Recent activity" value={(analytics?.recentActivity ?? []).length} subtitle="Signups and sales" icon="activity" />
        </div>

        <div className="panel rounded-[24px] p-5 sm:p-6" style={reveal(0.25)}>
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-sm text-zinc-500">Ledger summary</p>
              <h3 className="mt-1 text-2xl font-semibold tracking-tight">{money(availableBalance)}</h3>
              <p className="mt-1 text-sm text-zinc-500">Available for withdrawal · minimum {money(minimumWithdrawal)}</p>
            </div>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              <MiniStat label="Earned" value={money(ledgerSummary.totalEarned ?? 0)} />
              <MiniStat label="Pending" value={money(ledgerSummary.pending ?? 0)} />
              <MiniStat label="Withdrawn" value={money(ledgerSummary.totalWithdrawn ?? 0)} />
            </div>
          </div>
          <div className="mt-5 grid gap-4 lg:grid-cols-[1fr_auto] lg:items-end">
            <div>
              <label className="mb-2 block text-sm font-medium text-zinc-600">Withdrawal amount (GHS)</label>
              <input
                type="number"
                min={minimumWithdrawal}
                step="0.01"
                value={withdrawalAmount}
                onChange={(event) => setWithdrawalAmount(event.target.value)}
                className="w-full rounded-xl border border-zinc-200 bg-white px-4 py-3 text-base outline-none ring-0 transition focus:border-violet-500"
                placeholder={String(minimumWithdrawal)}
              />
              <p className="mt-2 text-xs text-zinc-500">{remainingToMinimum > 0 ? `${money(remainingToMinimum)} remaining before you can withdraw.` : 'You can withdraw now.'}</p>
            </div>
            <button
              type="button"
              onClick={handleWithdrawalRequest}
              disabled={withdrawing || availableBalance < minimumWithdrawal}
              className="w-full rounded-xl bg-violet-700 px-5 py-3 font-semibold text-white disabled:cursor-not-allowed disabled:bg-zinc-300 lg:w-auto"
            >
              {withdrawing ? 'Requesting…' : 'Request withdrawal'}
            </button>
          </div>
          {withdrawalMessage && <p className="mt-3 text-sm text-violet-700">{withdrawalMessage}</p>}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Chart */}
          <div className="lg:col-span-2 panel rounded-[24px] p-5 sm:p-6" style={reveal(0.3)}>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
              <div>
                <h3 className="font-semibold text-lg">Referral overview</h3>
                <p className="text-sm text-zinc-500">
                  {hoverIdx !== null && pts[hoverIdx]
                    ? `${pts[hoverIdx].count} on ${new Date(pts[hoverIdx].date).toLocaleDateString()}`
                    : 'Hover the line to see daily numbers'}
                </p>
              </div>
              {/* Sliding pill segmented control */}
              <div className="seg self-start sm:self-auto" role="tablist" aria-label="Time range">
                <span className="seg-pill" style={{ transform: `translateX(${RANGES.indexOf(timeRange) * 100}%)` }} />
                {RANGES.map((range) => (
                  <button key={range} role="tab" aria-selected={timeRange === range} onClick={() => setTimeRange(range)} className={`seg-btn ${timeRange === range ? 'on' : ''}`}>
                    {range.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>

            <div className="relative h-56 sm:h-64 w-full">
              <svg key={timeRange} className="w-full h-full overflow-visible" viewBox="0 0 800 200" preserveAspectRatio="none" onMouseLeave={() => setHoverIdx(null)}>
                <defs>
                  <linearGradient id="areaFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#6d28d9" stopOpacity="0.22" />
                    <stop offset="100%" stopColor="#6d28d9" stopOpacity="0" />
                  </linearGradient>
                  <linearGradient id="lineStroke" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#a78bfa" />
                    <stop offset="100%" stopColor="#5b21b6" />
                  </linearGradient>
                </defs>
                {[50, 110, 170].map((y) => (
                  <line key={y} x1="30" x2="770" y1={y} y2={y} stroke="rgba(109,40,217,0.1)" strokeDasharray="4 6" />
                ))}
                {areaPath && <path d={areaPath} fill="url(#areaFill)" className="area-in" />}
                <path d={linePath} fill="none" stroke="url(#lineStroke)" strokeWidth="3" strokeLinecap="round" pathLength={1} className="line-draw" vectorEffect="non-scaling-stroke" />
                {pts.map((p, i) => (
                  <g key={p.date + i} onMouseEnter={() => setHoverIdx(i)}>
                    <rect x={p.x - 18} y={0} width={36} height={200} fill="transparent" />
                    {hoverIdx === i && <line x1={p.x} x2={p.x} y1={p.y} y2={190} stroke="rgba(109,40,217,0.35)" />}
                    <ellipse cx={p.x} cy={p.y} rx={hoverIdx === i ? 6 : 3.5} ry={hoverIdx === i ? 6 : 3.5} fill="#6d28d9" stroke="#fff" strokeWidth="2" className="dot-in" style={{ animationDelay: `${0.9 + i * 0.05}s`, transition: 'rx .2s, ry .2s' }} />
                  </g>
                ))}
              </svg>
              <div className="absolute left-0 top-0 h-full flex flex-col justify-between text-xs text-zinc-500 py-1 pointer-events-none">
                <span>{maxCount}</span>
                <span>0</span>
              </div>
              {!pts.length && <p className="absolute inset-0 flex items-center justify-center text-sm text-zinc-500">No referrals in this period yet.</p>}
            </div>
          </div>

          <div className="space-y-6">
            {/* Payout */}
            <div className="panel rounded-[24px] p-5 sm:p-6" style={reveal(0.4)}>
              <h3 className="font-semibold text-lg mb-4">Next payout</h3>
              <div className="flex items-end justify-between mb-3">
                <span className="text-3xl font-semibold tracking-tight tabular-nums">GH₵{earnings.toFixed(2)}</span>
                <span className="text-sm text-zinc-500 mb-1">of GH₵{PAYOUT_THRESHOLD.toLocaleString()}</span>
              </div>
              <div className="track">
                <div className="fill" style={{ width: `${payoutProgress}%` }} />
              </div>
              <p className="text-sm text-zinc-500 mt-3">
                {payoutRemaining > 0 ? (
                  <>
                    <span className="font-semibold text-zinc-900">GH₵{payoutRemaining.toFixed(2)}</span> more to reach the minimum payout.
                  </>
                ) : (
                  'You’ve reached the minimum payout.'
                )}
              </p>
            </div>
          </div>
        </div>

        {/* MERCH DROP */}
        <Tilt max={4}>
          <section className="merch relative overflow-hidden rounded-[28px] p-5 sm:p-8" style={reveal(0.45)} aria-label="Koombo merch drop">
            <div className="absolute inset-0 spotlight pointer-events-none" />
            <div className="merch-marquee" aria-hidden>
              <div>{Array.from({ length: 8 }).map((_, i) => <span key={i}>KOOMBO MERCH DROP&nbsp;&nbsp;✦&nbsp;&nbsp;</span>)}</div>
              <div>{Array.from({ length: 8 }).map((_, i) => <span key={i}>KOOMBO MERCH DROP&nbsp;&nbsp;✦&nbsp;&nbsp;</span>)}</div>
            </div>

            <div className="relative grid gap-8 md:grid-cols-[minmax(0,340px)_1fr] items-center">
              <div>
                <div className="shirt-stage">
                  <div className="shirt-glow" />
                  <div key={merchItem} className="swap w-full h-full">
                    <MerchArt id={merchItem} locked={!isMerchUnlocked} />
                  </div>
                  {!isMerchUnlocked && (
                    <span className="lock-chip">
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4" /></svg>
                      Locked
                    </span>
                  )}
                </div>
                <div className="thumbs" role="tablist" aria-label="Merch items">
                  {MERCH_ITEMS.map((item) => (
                    <button key={item.id} role="tab" aria-selected={merchItem === item.id} onClick={() => setMerchItem(item.id)} className={`thumb ${merchItem === item.id ? 'on' : ''}`}>
                      <span className="thumb-art"><MerchArt id={item.id} locked={false} /></span>
                      <span className="text-xs font-semibold">{item.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-2xl sm:text-4xl font-semibold tracking-tight leading-tight">Recruit {MERCH_GOAL} sellers, unlock the full Koombo gear set.</h3>
                <p className="text-zinc-500 mt-2 max-w-lg">Every seller who signs up with your link counts. Hit {MERCH_GOAL} and we’ll send you a tee, a cap and a mug, all free.</p>

                <div className="flex flex-wrap gap-2 mt-4">
                  {MERCH_ITEMS.map((item) => (
                    <span key={item.id} className="inc-chip">
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.6} d="M5 13l4 4L19 7" /></svg>
                      {item.label}
                    </span>
                  ))}
                </div>

                <div className="mt-6">
                  <div className="flex justify-between text-sm mb-2">
                    <span className="font-semibold tabular-nums">{Math.min(currentSellers, MERCH_GOAL)} / {MERCH_GOAL} sellers</span>
                    <span className="text-zinc-500">{isMerchUnlocked ? 'Unlocked' : `${MERCH_GOAL - currentSellers} to go`}</span>
                  </div>
                  <div className="steps" role="progressbar" aria-valuemin={0} aria-valuemax={MERCH_GOAL} aria-valuenow={Math.min(currentSellers, MERCH_GOAL)}>
                    {Array.from({ length: MERCH_GOAL }).map((_, i) => (
                      <span key={i} className={i < currentSellers ? 'on' : ''} style={{ transitionDelay: `${i * 90}ms` }} />
                    ))}
                  </div>
                </div>

                <div className="mt-6">
                  {isMerchUnlocked ? (
                    <button className="btn-light w-full sm:w-auto">
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.4} d="M5 13l4 4L19 7" /></svg>
                      Claim your free gear
                    </button>
                  ) : (
                    <button onClick={() => setShowProductLink(true)} className="btn-ghost w-full sm:w-auto">Invite more sellers</button>
                  )}
                </div>
              </div>
            </div>
          </section>
        </Tilt>

        {/* Recent referrals */}
        <div className="panel rounded-[24px] p-5 sm:p-6" style={reveal(0.5)}>
          <div className="flex items-center justify-between mb-5">
            <h3 className="font-semibold text-lg">Recent referrals</h3>
            <span className="text-sm text-zinc-500">{analytics?.recentActivity?.length ?? 0} entries</span>
          </div>
          <div className="overflow-x-auto -mx-5 sm:mx-0 px-5 sm:px-0">
            <table className="w-full text-left border-collapse min-w-[600px]">
              <thead>
                <tr className="border-b border-zinc-200 text-sm text-zinc-500">
                  <th className="pb-3 font-medium">Seller or business</th>
                  <th className="pb-3 font-medium text-right">Status</th>
                  <th className="pb-3 font-medium text-right">Type</th>
                  <th className="pb-3 font-medium text-right">Joined</th>
                </tr>
              </thead>
              <tbody>
                {(analytics?.recentActivity ?? []).map((item, idx) => {
                  const ok = ['active', 'approved', 'verified'].includes(String(item.status || '').toLowerCase());
                  return (
                    <tr key={item.id || `${item.name}-${idx}`} className="row group" style={{ animationDelay: `${0.6 + idx * 0.05}s` }}>
                      <td className="py-4 pr-4">
                        <div className="flex items-center gap-3">
                          <span className="w-8 h-8 rounded-full bg-violet-50 text-violet-700 flex items-center justify-center text-xs font-semibold shrink-0 transition-all group-hover:bg-violet-700 group-hover:text-white">
                            {(item.name || 'S').charAt(0).toUpperCase()}
                          </span>
                          <span className="font-medium truncate">{item.name || 'Seller'}</span>
                        </div>
                      </td>
                      <td className="py-4 text-right">
                        <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium border ${ok ? 'border-emerald-200 text-emerald-700 bg-emerald-50' : 'border-zinc-200 text-zinc-600 bg-zinc-50'}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${ok ? 'bg-emerald-400' : 'bg-zinc-400'}`} />
                          {item.status || 'Pending'}
                        </span>
                      </td>
                      <td className="py-4 text-right text-zinc-600">{item.type === 'seller_signup' ? 'Signup' : 'Referral'}</td>
                      <td className="py-4 text-right text-zinc-600">{item.createdAt ? new Date(item.createdAt).toLocaleDateString() : '—'}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            {!(analytics?.recentActivity ?? []).length && (
              <p className="py-8 text-center text-sm text-zinc-500">No referrals yet. Share your invite link to get your first seller.</p>
            )}
          </div>
        </div>

        {/* Code + link */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6" style={reveal(0.6)}>
          <div className="panel rounded-[24px] p-5 sm:p-6 flex flex-col justify-between">
            <div>
              <p className="text-sm text-zinc-500 mb-4">Your referral code</p>
              <div className="code-box">
                <code className="text-2xl sm:text-3xl font-mono font-semibold tracking-[0.18em] break-all text-center">{connector.referralCode || 'N/A'}</code>
              </div>
            </div>
            <button onClick={handleCopyCode} className={`${copied ? 'btn-done' : 'btn-light'} w-full mt-4`}>
              {copied ? 'Copied' : 'Copy referral code'}
            </button>
          </div>
          <div className="panel rounded-[24px] p-5 sm:p-6 flex flex-col justify-between">
            <div>
              <p className="text-sm text-zinc-500 mb-4">Shareable invite link</p>
              <input readOnly aria-label="Invite link" value={getInviteLink(connector.referralCode)} className="w-full rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-3.5 text-sm text-zinc-600 outline-none focus:border-violet-500 focus:ring-4 focus:ring-violet-200 transition-all font-mono mb-4 break-all" />
            </div>
            <button onClick={handleCopyInviteLink} className={`${linkCopied ? 'btn-done' : 'btn-ghost'} w-full`}>
              {linkCopied ? 'Copied' : 'Copy invite link'}
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}

/* ---------- T-shirt with Koombo logo ---------- */
function KoomboShirt({ locked }: { locked: boolean }) {
  return (
    <svg viewBox="0 0 240 240" fill="none" xmlns="http://www.w3.org/2000/svg" className={`shirt-svg ${locked ? 'is-locked' : ''}`} role="img" aria-label="Koombo t-shirt with logo">
      <defs>
        <linearGradient id="shirtBody" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#7c3aed" />
          <stop offset="100%" stopColor="#3b1a85" />
        </linearGradient>
        <radialGradient id="shirtSheen" cx="0.3" cy="0.2" r="0.8">
          <stop offset="0%" stopColor="#fff" stopOpacity="0.22" />
          <stop offset="100%" stopColor="#fff" stopOpacity="0" />
        </radialGradient>
        <clipPath id="shirtClip">
          <path d="M82 28 C92 44 148 44 158 28 L206 48 L228 98 L194 112 L184 98 L184 216 C184 220 181 222 178 222 L62 222 C59 222 56 220 56 216 L56 98 L46 112 L12 98 L34 48 Z" />
        </clipPath>
      </defs>
      <ellipse cx="120" cy="230" rx="70" ry="6" fill="#18181b" opacity="0.18" />
      <path d="M82 28 C92 44 148 44 158 28 L206 48 L228 98 L194 112 L184 98 L184 216 C184 220 181 222 178 222 L62 222 C59 222 56 220 56 216 L56 98 L46 112 L12 98 L34 48 Z" fill="url(#shirtBody)" stroke="#c4b5fd" strokeOpacity="0.6" strokeWidth="1.5" strokeLinejoin="round" />
      <g clipPath="url(#shirtClip)">
        <rect width="240" height="240" fill="url(#shirtSheen)" />
        <path d="M56 98 L56 222 M184 98 L184 222" stroke="#000" strokeOpacity="0.2" strokeWidth="6" />
        <path d="M10 98 L46 112 M194 112 L230 98" stroke="#000" strokeOpacity="0.25" strokeWidth="3" />
      </g>
      {/* collar */}
      <path d="M82 28 C92 44 148 44 158 28 C150 58 90 58 82 28 Z" fill="#2e1065" stroke="#c4b5fd" strokeOpacity="0.6" strokeWidth="1.2" />
      {/* logo patch */}
      <g className="logo-patch">
        <circle cx="120" cy="110" r="30" fill="#fff" />
        <image href="/koombo-logo.png" x="95" y="85" width="50" height="50" preserveAspectRatio="xMidYMid meet" />
      </g>
      <text x="120" y="164" textAnchor="middle" fill="#ede9fe" fontSize="11" fontWeight="600" letterSpacing="5" fontFamily="system-ui, sans-serif">KOOMBO</text>
    </svg>
  );
}

/* ---------- Merch art switcher ---------- */
function MerchArt({ id, locked }: { id: MerchId; locked: boolean }) {
  if (id === 'cap') return <KoomboCap locked={locked} />;
  if (id === 'mug') return <KoomboMug locked={locked} />;
  return <KoomboShirt locked={locked} />;
}

/* ---------- Cap with Koombo logo ---------- */
function KoomboCap({ locked }: { locked: boolean }) {
  return (
    <svg viewBox="0 0 240 240" fill="none" xmlns="http://www.w3.org/2000/svg" className={`shirt-svg ${locked ? 'is-locked' : ''}`} role="img" aria-label="Koombo cap with logo">
      <defs>
        <linearGradient id="capBody" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#7c3aed" />
          <stop offset="100%" stopColor="#3b1a85" />
        </linearGradient>
        <linearGradient id="capBrim" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#5b21b6" />
          <stop offset="100%" stopColor="#2e1065" />
        </linearGradient>
      </defs>
      <ellipse cx="120" cy="214" rx="82" ry="7" fill="#18181b" opacity="0.18" />
      <path d="M48 160 C44 92 82 46 120 46 C158 46 196 92 192 160 Z" fill="url(#capBody)" stroke="#c4b5fd" strokeOpacity="0.6" strokeWidth="1.5" strokeLinejoin="round" />
      <path d="M120 46 C104 84 102 122 106 160 M120 46 C136 84 138 122 134 160" stroke="#000" strokeOpacity="0.25" strokeWidth="2" />
      <path d="M62 138 C90 150 150 150 178 138" stroke="#fff" strokeOpacity="0.15" strokeWidth="2" />
      <circle cx="120" cy="46" r="6" fill="#5b21b6" stroke="#c4b5fd" strokeOpacity="0.6" />
      <path d="M36 160 C80 146 160 146 204 160 C212 182 188 198 120 198 C52 198 28 182 36 160 Z" fill="url(#capBrim)" stroke="#c4b5fd" strokeOpacity="0.6" strokeWidth="1.5" strokeLinejoin="round" />
      <g className="logo-patch">
        <circle cx="120" cy="106" r="26" fill="#fff" />
        <image href="/koombo-logo.png" x="99" y="85" width="42" height="42" preserveAspectRatio="xMidYMid meet" />
      </g>
    </svg>
  );
}

/* ---------- Mug with Koombo logo ---------- */
function KoomboMug({ locked }: { locked: boolean }) {
  return (
    <svg viewBox="0 0 240 240" fill="none" xmlns="http://www.w3.org/2000/svg" className={`shirt-svg ${locked ? 'is-locked' : ''}`} role="img" aria-label="Koombo mug with logo">
      <defs>
        <linearGradient id="mugBody" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#4c1d95" />
          <stop offset="35%" stopColor="#7c3aed" />
          <stop offset="100%" stopColor="#2e1065" />
        </linearGradient>
      </defs>
      <ellipse cx="115" cy="216" rx="70" ry="7" fill="#18181b" opacity="0.18" />
      <path d="M170 92 C214 88 214 168 168 164" stroke="#5b21b6" strokeWidth="14" strokeLinecap="round" fill="none" />
      <path d="M60 70 L60 196 C60 206 68 212 78 212 L152 212 C162 212 170 206 170 196 L170 70 Z" fill="url(#mugBody)" stroke="#c4b5fd" strokeOpacity="0.6" strokeWidth="1.5" strokeLinejoin="round" />
      <ellipse cx="115" cy="70" rx="55" ry="11" fill="#7c3aed" stroke="#c4b5fd" strokeOpacity="0.6" strokeWidth="1.5" />
      <ellipse cx="115" cy="71" rx="47" ry="8" fill="#1e0a3c" />
      <rect x="72" y="84" width="6" height="110" rx="3" fill="#fff" opacity="0.14" />
      <g className="logo-patch">
        <circle cx="115" cy="136" r="28" fill="#fff" />
        <image href="/koombo-logo.png" x="92" y="113" width="46" height="46" preserveAspectRatio="xMidYMid meet" />
      </g>
      <text x="115" y="188" textAnchor="middle" fill="#ede9fe" fontSize="10" fontWeight="600" letterSpacing="4" fontFamily="system-ui, sans-serif">KOOMBO</text>
    </svg>
  );
}

/* ---------- Stat card ---------- */
function MiniStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-violet-100 bg-violet-50/70 px-3 py-2">
      <p className="text-[10px] uppercase tracking-[0.16em] text-zinc-500">{label}</p>
      <p className="mt-1 text-sm font-semibold text-zinc-800">{value}</p>
    </div>
  );
}

function StatCard({ title, value, subtitle, icon }: { title: string; value: string | number; subtitle: string; icon: string }) {
  const icons: Record<string, React.ReactNode> = {
    currency: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />,
    users: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />,
    chart: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />,
    activity: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M13 10V3L4 14h7v7l9-11h-7z" />,
  };
  return (
    <Tilt max={8} className="h-full">
      <div className="panel stat rounded-[22px] p-5 h-full">
        <div className="flex items-start justify-between mb-4">
          <div className="min-w-0">
            <p className="text-sm text-zinc-500">{title}</p>
            <p className="text-xs text-zinc-500 mt-0.5">{subtitle}</p>
          </div>
          <div className="stat-icon">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">{icons[icon]}</svg>
          </div>
        </div>
        <h4 className="text-2xl sm:text-3xl font-semibold tracking-tight tabular-nums break-words">{value}</h4>
      </div>
    </Tilt>
  );
}

/* ---------- Error shell ---------- */
function ErrorShell({ title, message, action }: { title: string; message: string; action?: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      <Styles />
      <div className="panel rounded-[28px] p-8 sm:p-10 max-w-md w-full text-center pop-in">
        <div className="w-14 h-14 rounded-2xl bg-zinc-100 border border-zinc-200 flex items-center justify-center mx-auto mb-5 text-zinc-700">
          <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.6} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
        </div>
        <h2 className="text-2xl font-semibold mb-2 tracking-tight text-zinc-800">{title}</h2>
        <p className="text-zinc-500 text-sm mb-8 leading-relaxed">{message}</p>
        {action}
      </div>
    </div>
  );
}

/* ---------- Styles ---------- */
function Styles() {
  return (
    <style>{`
      @keyframes riseIn { from { opacity: 0; transform: translateY(24px) scale(.98); filter: blur(6px); } to { opacity: 1; transform: none; filter: blur(0); } }
      @keyframes popIn { from { opacity: 0; transform: scale(.9) translateY(-8px); } to { opacity: 1; transform: none; } }
      @keyframes swapIn { from { opacity: 0; transform: translateY(14px) scale(.9) rotate(-4deg); } to { opacity: 1; transform: none; } }
      @keyframes shimmer { 0% { background-position: -200% 0; } 100% { background-position: 200% 0; } }
      @keyframes drift { 0%,100% { transform: translate(0,0) scale(1); } 50% { transform: translate(40px,30px) scale(1.12); } }
      @keyframes ping { 0% { box-shadow: 0 0 0 0 rgba(109,40,217,.45); } 100% { box-shadow: 0 0 0 9px rgba(109,40,217,0); } }
      @keyframes spin { to { transform: rotate(360deg); } }
      @keyframes drawLine { from { stroke-dashoffset: 1; } to { stroke-dashoffset: 0; } }
      @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
      @keyframes dotIn { from { opacity: 0; transform: scale(0); } to { opacity: 1; transform: scale(1); } }
      @keyframes floatY { 0%,100% { transform: translateY(0) rotate(-2deg); } 50% { transform: translateY(-12px) rotate(2deg); } }
      @keyframes wave { 0%,60%,100% { transform: rotate(0); } 10%,30% { transform: rotate(16deg); } 20%,40% { transform: rotate(-10deg); } 50% { transform: rotate(8deg); } }
      @keyframes slide { to { transform: translateX(-50%); } }
      @keyframes textShine { to { background-position: 200% center; } }
      @keyframes rowIn { from { opacity: 0; transform: translateX(-12px); } to { opacity: 1; transform: none; } }
      @keyframes pctGlow { 0%,100% { box-shadow: 0 10px 24px -8px rgba(109,40,217,.4); } 50% { box-shadow: 0 16px 48px -6px rgba(109,40,217,.55); } }
      @keyframes wiggle { 0%,90%,100% { transform: rotate(0); } 93% { transform: rotate(-10deg); } 96% { transform: rotate(10deg); } }

      .pop-in { animation: popIn .45s cubic-bezier(.16,1,.3,1) both; }
      .swap { animation: swapIn .55s cubic-bezier(.34,1.4,.64,1) both; }
      .toast { background: #5b21b6; color: #fff; }
      .tilt { transform: perspective(1000px) rotateX(var(--rx,0deg)) rotateY(var(--ry,0deg)); transition: transform .35s cubic-bezier(.16,1,.3,1); will-change: transform; }
      .dot-grid { background-image: radial-gradient(rgba(109,40,217,.16) 1px, transparent 1px); background-size: 26px 26px; mask-image: radial-gradient(ellipse at 50% 0%, #000 20%, transparent 75%); -webkit-mask-image: radial-gradient(ellipse at 50% 0%, #000 20%, transparent 75%); }
      .blob { border-radius: 9999px; filter: blur(110px); animation: drift 18s ease-in-out infinite; }
      .blob-b { animation-duration: 24s; animation-direction: reverse; }
      .ping-dot { animation: ping 2s infinite; }
      .logo-wiggle { animation: wiggle 6s ease-in-out infinite; }
      .ring-spin { background: conic-gradient(from 0deg, #5b21b6, #c4b5fd, #5b21b6); animation: spin 6s linear infinite; }
      .ring-spin > div { animation: spin 6s linear infinite reverse; }
      .wave { transform-origin: 70% 70%; animation: wave 2.6s 1.2s ease-in-out 2; }
      .shine-text { background: linear-gradient(100deg, #3f3f46 25%, #7c3aed 50%, #3f3f46 75%); background-size: 200% auto; -webkit-background-clip: text; background-clip: text; color: transparent; animation: textShine 6s linear infinite; }

      .panel { position: relative; background: #fff; border: 1px solid #ede9fe; box-shadow: 0 1px 2px rgba(24,24,27,.04), 0 14px 32px -18px rgba(24,24,27,.14); transition: border-color .3s, box-shadow .3s; }
      .panel:hover { border-color: #a78bfa; box-shadow: 0 1px 2px rgba(24,24,27,.04), 0 22px 40px -18px rgba(24,24,27,.2); }
      .panel::before, .commission::before, .merch::before { content: ''; position: absolute; inset: 0; border-radius: inherit; background: radial-gradient(260px circle at var(--mx,50%) var(--my,0%), rgba(109,40,217,.07), transparent 60%); opacity: 0; transition: opacity .3s; pointer-events: none; }
      .tilt:hover > .panel::before, .tilt:hover > .commission::before, .tilt:hover > .merch::before { opacity: 1; }
      .stat-icon { width: 40px; height: 40px; border-radius: 14px; display: flex; align-items: center; justify-content: center; background: #f5f3ff; border: 1px solid #ede9fe; color: #6d28d9; flex-shrink: 0; margin-left: 8px; transition: transform .5s cubic-bezier(.34,1.56,.64,1), background .3s, color .3s; }
      .stat:hover .stat-icon { transform: rotate(-12deg) scale(1.15); background: #6d28d9; color: #fff; }

      .btn-light, .btn-ghost, .btn-done { display: inline-flex; align-items: center; justify-content: center; gap: .5rem; padding: .85rem 1.4rem; border-radius: 16px; font-size: .9rem; font-weight: 600; transition: transform .25s cubic-bezier(.34,1.56,.64,1), background .25s, box-shadow .25s, border-color .25s; cursor: pointer; text-align: center; }
      .btn-light { background: #6d28d9; color: #fff; box-shadow: 0 10px 24px -10px rgba(109,40,217,.6); }
      .btn-light:hover { transform: translateY(-2px) scale(1.03); background: #5b21b6; box-shadow: 0 16px 34px -10px rgba(91,33,182,.65); }
      .btn-ghost { background: #fff; color: #5b21b6; border: 1px solid #ddd6fe; }
      .btn-ghost:hover { transform: translateY(-2px); background: #f5f3ff; border-color: #7c3aed; }
      .btn-done { background: #ecfdf5; color: #047857; border: 1px solid #a7f3d0; }
      .btn-light:active, .btn-ghost:active { transform: scale(.96); }
      button:focus-visible, a:focus-visible, input:focus-visible { outline: 2px solid #6d28d9; outline-offset: 3px; }

      .link-chip { display: block; word-break: break-all; border-radius: 16px; border: 1px dashed #c4b5fd; background: #faf5ff; padding: .9rem 1rem; font-size: .85rem; font-weight: 500; color: #5b21b6; transition: background .2s, border-color .2s; }
      .link-chip:hover { background: #f5f3ff; border-color: #7c3aed; }
      .code-box { border-radius: 18px; border: 1px dashed #c4b5fd; background: #faf5ff; padding: 1.25rem 1rem; display: flex; justify-content: center; color: #27272a; }

      .collapse-grid { display: grid; grid-template-rows: 0fr; opacity: 0; transition: grid-template-rows .6s cubic-bezier(.16,1,.3,1), opacity .4s; }
      .collapse-grid.open { grid-template-rows: 1fr; opacity: 1; }

      .seg { position: relative; display: grid; grid-template-columns: repeat(3, 1fr); background: #f5f3ff; border: 1px solid #ede9fe; border-radius: 14px; padding: 4px; }
      .seg-pill { position: absolute; top: 4px; bottom: 4px; left: 4px; width: calc((100% - 8px) / 3); background: #6d28d9; border-radius: 10px; transition: transform .45s cubic-bezier(.34,1.4,.64,1); }
      .seg-btn { position: relative; z-index: 1; padding: .4rem 1rem; font-size: .75rem; font-weight: 700; color: #6b7280; transition: color .25s; }
      .seg-btn.on { color: #fff; }

      .line-draw { stroke-dasharray: 1; stroke-dashoffset: 1; animation: drawLine 1.8s .2s cubic-bezier(.65,0,.35,1) forwards; }
      .area-in { opacity: 0; animation: fadeIn 1s 1s forwards; }
      .dot-in { opacity: 0; transform-box: fill-box; transform-origin: center; animation: dotIn .4s cubic-bezier(.34,1.56,.64,1) forwards; }

      .track { height: 12px; border-radius: 9999px; background: #ede9fe; overflow: hidden; }
      .fill { height: 100%; border-radius: 9999px; background: linear-gradient(90deg, #a78bfa, #5b21b6, #a78bfa); background-size: 200% 100%; animation: shimmer 2.4s linear infinite; transition: width 1.2s cubic-bezier(.16,1,.3,1); }

      .commission { background: linear-gradient(135deg, #ffffff 0%, #faf5ff 55%, #ede9fe 100%); border: 1px solid #ddd6fe; box-shadow: 0 24px 50px -30px rgba(91,33,182,.35); color: #27272a; }
      .spotlight { background: radial-gradient(600px circle at 15% 0%, rgba(255,255,255,.9), transparent 60%); }
      .pct-badge { width: 120px; height: 120px; flex-shrink: 0; border-radius: 32px; display: flex; align-items: flex-start; justify-content: center; gap: 2px; padding-top: 18px; background: linear-gradient(160deg, #7c3aed, #4c1d95); color: #fff; animation: pctGlow 3.2s ease-in-out infinite; transform: rotate(-4deg); transition: transform .5s cubic-bezier(.34,1.56,.64,1); }
      .pct-badge:hover { transform: rotate(4deg) scale(1.06); }
      .pct-num { font-size: 72px; font-weight: 700; line-height: 1; letter-spacing: -.04em; }
      .pct-sign { font-size: 28px; font-weight: 700; margin-top: 8px; }
      .earn-card { display: flex; gap: .9rem; padding: 1rem; border-radius: 20px; background: #fff; border: 1px solid #ede9fe; transition: transform .35s cubic-bezier(.34,1.56,.64,1), border-color .25s, box-shadow .25s; }
      .earn-card:hover { transform: translateY(-4px); border-color: #7c3aed; box-shadow: 0 16px 30px -16px rgba(91,33,182,.4); }
      .earn-icon { width: 44px; height: 44px; border-radius: 14px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; background: #6d28d9; color: #fff; transition: transform .5s cubic-bezier(.34,1.56,.64,1); }
      .earn-card:hover .earn-icon { transform: rotate(-10deg) scale(1.1); }

      .merch { background: linear-gradient(145deg, #ffffff, #faf5ff 60%, #ede9fe); border: 1px solid #ddd6fe; box-shadow: 0 24px 50px -30px rgba(91,33,182,.35); color: #27272a; }
      .merch-marquee { position: absolute; top: 14px; left: 0; display: flex; width: 200%; overflow: hidden; color: #6d28d9; opacity: .06; pointer-events: none; font-weight: 800; font-size: 56px; letter-spacing: .04em; white-space: nowrap; animation: slide 40s linear infinite; }
      .merch-marquee > div { display: flex; flex-shrink: 0; width: 50%; }
      .shirt-stage { position: relative; display: flex; align-items: center; justify-content: center; aspect-ratio: 1; max-width: 340px; margin: 0 auto; width: 100%; }
      .shirt-glow { position: absolute; inset: 10%; border-radius: 9999px; background: radial-gradient(circle, rgba(255,255,255,.95), rgba(196,181,253,.45) 55%, transparent 72%); filter: blur(10px); }
      .shirt-svg { position: relative; width: 100%; height: 100%; animation: floatY 6s ease-in-out infinite; filter: drop-shadow(0 20px 24px rgba(76,29,149,.35)); transition: filter .6s; }
      .shirt-svg.is-locked { filter: drop-shadow(0 20px 24px rgba(24,24,27,.3)) grayscale(.7) opacity(.7); }
      .merch:hover .shirt-svg { animation-duration: 3s; }
      .logo-patch { transform-box: fill-box; transform-origin: center; transition: transform .6s cubic-bezier(.34,1.56,.64,1); }
      .merch:hover .logo-patch { transform: scale(1.12) rotate(-6deg); }
      .lock-chip { position: absolute; bottom: 4%; display: inline-flex; align-items: center; gap: .35rem; padding: .35rem .8rem; border-radius: 9999px; font-size: .75rem; font-weight: 600; background: rgba(255,255,255,.92); color: #5b21b6; border: 1px solid #ddd6fe; backdrop-filter: blur(8px); }
      .thumbs { display: grid; grid-template-columns: repeat(3, 1fr); gap: .6rem; margin-top: 1rem; }
      .thumb { display: flex; flex-direction: column; align-items: center; gap: .15rem; padding: .5rem .25rem; border-radius: 18px; background: #fff; border: 1px solid #ede9fe; color: #525252; transition: transform .35s cubic-bezier(.34,1.56,.64,1), border-color .25s, box-shadow .25s; }
      .thumb:hover { transform: translateY(-3px); border-color: #a78bfa; }
      .thumb.on { border-color: #6d28d9; color: #5b21b6; box-shadow: 0 0 0 2px #6d28d9 inset; }
      .thumb-art { display: block; width: 48px; height: 48px; }
      .thumb .shirt-svg { animation: none; filter: none; }
      .inc-chip { display: inline-flex; align-items: center; gap: .35rem; padding: .3rem .75rem; border-radius: 9999px; font-size: .8rem; font-weight: 600; background: #fff; border: 1px solid #ddd6fe; color: #5b21b6; }
      .steps { display: grid; grid-template-columns: repeat(10, 1fr); gap: 6px; }
      .steps span { height: 14px; border-radius: 6px; background: #ede9fe; transition: background .5s, transform .5s cubic-bezier(.34,1.56,.64,1), box-shadow .5s; }
      .steps span.on { background: #6d28d9; transform: scaleY(1.25); box-shadow: 0 4px 12px rgba(109,40,217,.4); }

      .row { animation: rowIn .5s cubic-bezier(.16,1,.3,1) both; border-bottom: 1px solid #f5f3ff; transition: background .2s; }
      .row:hover { background: #faf5ff; }

      .skeleton { background: linear-gradient(110deg, #f5f3ff 8%, #ede9fe 18%, #f5f3ff 33%); background-size: 200% 100%; animation: shimmer 1.6s linear infinite; border-radius: 20px; }

      @media (max-width: 640px) { .pct-badge { width: 96px; height: 96px; } .pct-num { font-size: 56px; } .merch-marquee { font-size: 40px; } }
      @media (prefers-reduced-motion: reduce) { *, *::before, *::after { animation-duration: .01ms !important; animation-iteration-count: 1 !important; transition-duration: .01ms !important; } .tilt { transform: none !important; } }
    `}</style>
  );
}
'use client';

import Link from 'next/link';
import { useEffect, useMemo, useRef, useState, type ChangeEvent, type FormEvent } from 'react';
import { createPortal } from 'react-dom';
import {
  ArrowLeft,
  ArrowRight,
  Check,
  CheckCircle2,
  FileText,
  ImagePlus,
  Lock,
  LoaderCircle,
  ShieldCheck,
  Sparkles,
  Tag,
  Video,
  X,
} from 'lucide-react';

const API_BASE_URL = (
  process.env.NEXT_PUBLIC_API_BASE ||
  process.env.NEXT_PUBLIC_API_URL ||
  process.env.NEXT_PUBLIC_BACKEND_URL ||
  (process.env.NODE_ENV === 'development' ? 'http://localhost:5000' : 'https://unimart-backend-2.onrender.com')
).replace(/\/+$/, '').replace(/\/api$/i, '');

const MAX_PHOTOS = 5;
const MAX_VIDEO_MB = 50;
const MAX_VIDEO_SECONDS = 60;

type Seller = {
  id: string;
  fullName: string;
  businessName?: string;
  email: string;
  phone?: string;
  location?: string;
  sellerType?: string;
};

type FormState = {
  title: string;
  description: string;
  category: string;
  subcategory: string;
  price: string;
  stock: string;
  condition: string;
};

type AiState = 'idle' | 'working' | 'done' | 'failed';

const STAGES = [
  { key: 'photos', label: 'Photos', icon: ImagePlus },
  { key: 'video', label: 'Video', icon: Video },
  { key: 'details', label: 'Details', icon: FileText },
  { key: 'pricing', label: 'Price', icon: Tag },
  { key: 'review', label: 'Review', icon: CheckCircle2 },
] as const;

const CATEGORIES = ['Fashion', 'Electronics', 'Books', 'Home & Furniture', 'Food', 'Services', 'Events', 'Second Hand', 'Tech Gadgets', 'Campus Life', 'Other'];
const CONDITIONS = ['New', 'Like New', 'Good', 'Fair', 'Poor'];

const fieldClass = 'mt-1.5 w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 sm:px-4 sm:py-3 text-sm sm:text-base font-normal outline-none focus:border-violet-600 focus:ring-2 focus:ring-violet-200';

function ShuriHeader({ seller }: { seller: Seller | null }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const header = (
    <header className="fixed inset-x-0 top-0 z-40 border-b border-violet-100 bg-[#F8F7FB]/95 pt-[env(safe-area-inset-top)] text-[#211536] backdrop-blur-xl">
      <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-3 sm:h-16 sm:px-6">
        <Link href={seller ? `/sellers/${encodeURIComponent(seller.id)}` : '/lister'} className="inline-flex h-9 sm:h-10 items-center gap-1.5 sm:gap-2 rounded-full bg-white px-3 sm:px-4 text-xs sm:text-sm font-bold text-slate-700 shadow-sm ring-1 ring-slate-200 transition hover:text-violet-700">
          <ArrowLeft size={14} className="sm:hidden" />
          <ArrowLeft size={16} className="hidden sm:block" />
          <span className="hidden sm:inline">Dashboard</span>
          <span className="sm:hidden">Back</span>
        </Link>
        <span className="flex items-center gap-1.5 sm:gap-2 font-extrabold text-violet-700">
          <span className="grid h-7 w-7 sm:h-8 sm:w-8 place-items-center rounded-xl bg-violet-600 text-white">
            <Sparkles size={14} className="sm:hidden" />
            <Sparkles size={16} className="hidden sm:block" />
          </span>
          <span className="text-sm sm:text-base">Shuri AI</span>
        </span>
        <span className="hidden max-w-48 truncate text-xs sm:text-sm font-semibold text-slate-500 md:block">{seller?.businessName || 'New listing'}</span>
        <span className="w-8 sm:w-10" />
      </div>
    </header>
  );

  return <>{mounted && createPortal(header, document.body)}<div aria-hidden className="h-[calc(3.5rem+env(safe-area-inset-top))] sm:h-[calc(4rem+env(safe-area-inset-top))]" /></>;
}

/** Object URLs for previews, revoked when files change or the page unmounts. */
function usePreviewUrls(files: File[]) {
  const urls = useMemo(() => files.map((f) => URL.createObjectURL(f)), [files]);
  useEffect(() => () => urls.forEach((u) => URL.revokeObjectURL(u)), [urls]);
  return urls;
}

const fileKey = (f: File) => `${f.name}-${f.size}-${f.lastModified}`;

function readVideoDuration(file: File): Promise<number> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const el = document.createElement('video');
    el.preload = 'metadata';
    el.onloadedmetadata = () => { URL.revokeObjectURL(url); resolve(el.duration); };
    el.onerror = () => { URL.revokeObjectURL(url); reject(new Error('This video could not be read. Try a different file.')); };
    el.src = url;
  });
}

export default function ShuriListingPage() {
  const [seller, setSeller] = useState<Seller | null>(null);
  const [loadingSeller, setLoadingSeller] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const [step, setStep] = useState(0);
  const [photos, setPhotos] = useState<File[]>([]);
  const [video, setVideo] = useState<File | null>(null);
  const [videoDecided, setVideoDecided] = useState(false);
  const [photoError, setPhotoError] = useState('');
  const [videoError, setVideoError] = useState('');
  const [aiState, setAiState] = useState<AiState>('idle');
  const [aiMessage, setAiMessage] = useState('');
  const [scanProgress, setScanProgress] = useState(0);
  const [form, setForm] = useState<FormState>({ title: '', description: '', category: 'Fashion', subcategory: '', price: '', stock: '1', condition: 'New' });

  // Fields the seller has edited by hand — AI never overwrites these.
  const touched = useRef<Set<keyof FormState>>(new Set());
  const photoUrls = usePreviewUrls(photos);
  const videos = useMemo(() => (video ? [video] : []), [video]);
  const videoUrls = usePreviewUrls(videos);

  function setField<K extends keyof FormState>(key: K, value: FormState[K]) {
    touched.current.add(key);
    setForm((current) => ({ ...current, [key]: value }));
  }

  // ---- Load seller ----
  useEffect(() => {
    const id = new URLSearchParams(window.location.search).get('sellerId') || '';
    if (!id) {
      setSeller(null);
      setLoadingSeller(false);
      return;
    }

    fetch(`${API_BASE_URL}/api/public/sellers/${encodeURIComponent(id)}`, { cache: 'no-store' })
      .then(async (response) => {
        const payload = await response.json().catch(() => null);
        const profile = (payload?.seller || payload?.data?.seller || payload?.profile || payload?.data) as Seller | undefined;
        if (!response.ok || !profile) throw new Error(payload?.error || 'Seller account could not be found.');
        if (String(profile.id) !== id) throw new Error('This seller session does not match the selected account.');
        setSeller(profile);
      })
      .catch(() => setSeller(null))
      .finally(() => setLoadingSeller(false));
  }, []);

  // ---- Auto-fill from the first photo, as soon as it is added or replaced ----
  const firstPhoto = photos[0];
  const firstKey = firstPhoto ? fileKey(firstPhoto) : '';
  useEffect(() => {
    if (!firstPhoto) { setAiState('idle'); setAiMessage(''); setScanProgress(0); return; }
    let cancelled = false;
    setAiState('working');
    setAiMessage('Preparing your photo…');
    setScanProgress(12);

    (async () => {
      try {
        const data = new FormData();
        data.append('image', firstPhoto);
        setAiMessage('Reading product details…');
        setScanProgress(38);

        const response = await fetch('/api/listings', { method: 'POST', body: data });
        const payload = await response.json().catch(() => null);
        if (!response.ok) throw new Error(payload?.error || 'Shuri could not analyze this photo.');
        if (cancelled) return;
        setScanProgress(72);
        setAiMessage('Drafting the listing preview…');

        const draft = payload?.listing || {};
        const next: Partial<FormState> = {
          title: draft.title,
          description: draft.description,
          category: draft.category,
          subcategory: draft.subcategory,
          price: draft.price ? String(draft.price) : undefined,
          stock: draft.stock ? String(draft.stock) : undefined,
        };
        setForm((current) => {
          const merged = { ...current };
          (Object.keys(next) as (keyof FormState)[]).forEach((k) => {
            if (next[k] && !touched.current.has(k)) merged[k] = next[k] as string;
          });
          return merged;
        });
        setScanProgress(100);
        setAiState('done');
        setAiMessage('Shuri filled in the details from your photo. You can review and edit them in the next steps.');
      } catch (cause) {
        if (cancelled) return;
        setAiState('failed');
        setScanProgress(0);
        setAiMessage(cause instanceof Error ? `${cause.message} You can still fill the form manually.` : 'Shuri could not analyze this photo. You can still fill the form manually.');
      }
    })();

    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [firstKey]);

  // ---- Stage completion (each stage unlocks only when all previous ones are done) ----
  const complete = [
    photos.length >= 1 && aiState !== 'working',
    videoDecided,
    form.title.trim().length >= 3 && form.description.trim().length >= 10 && !!form.category,
    Number(form.price) > 0 && Number(form.stock) >= 0 && !!form.condition,
    true,
  ];
  const firstIncomplete = complete.findIndex((done) => !done);
  const furthest = firstIncomplete === -1 ? STAGES.length - 1 : firstIncomplete;
  const activeStep = Math.min(step, furthest);
  const isLast = activeStep === STAGES.length - 1;

  const goTo = (i: number) => { if (i <= furthest) { setError(''); setStep(i); } };
  const next = () => {
    if (isLast) return;
    if (activeStep === 1 && !video) setVideoDecided(true); // skipping the optional video counts as done
    else if (!complete[activeStep]) return;
    setError('');
    setStep(activeStep + 1);
  };
  const back = () => { setError(''); setStep(Math.max(0, activeStep - 1)); };

  // ---- Photos ----
  function onPickPhotos(event: ChangeEvent<HTMLInputElement>) {
    const picked = Array.from(event.target.files || []);
    event.target.value = '';
    setPhotoError('');
    const images = picked.filter((f) => f.type.startsWith('image/'));
    if (images.length < picked.length) setPhotoError('Only image files can be added here.');
    setPhotos((current) => {
      const known = new Set(current.map(fileKey));
      const merged = [...current, ...images.filter((f) => !known.has(fileKey(f)))];
      if (merged.length > MAX_PHOTOS) setPhotoError(`You can add up to ${MAX_PHOTOS} photos.`);
      return merged.slice(0, MAX_PHOTOS);
    });
  }

  const removePhoto = (index: number) => setPhotos((current) => current.filter((_, i) => i !== index));
  const makeCover = (index: number) => setPhotos((current) => [current[index], ...current.filter((_, i) => i !== index)]);

  // ---- Video ----
  async function onPickVideo(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = '';
    setVideoError('');
    if (!file) return;
    if (!file.type.startsWith('video/')) { setVideoError('Please choose a video file.'); return; }
    if (file.size > MAX_VIDEO_MB * 1024 * 1024) { setVideoError(`Video is too large. Keep it under ${MAX_VIDEO_MB} MB.`); return; }
    try {
      const seconds = await readVideoDuration(file);
      if (seconds > MAX_VIDEO_SECONDS) { setVideoError(`Video is ${Math.round(seconds)}s long. Keep it under ${MAX_VIDEO_SECONDS} seconds.`); return; }
    } catch (cause) {
      setVideoError(cause instanceof Error ? cause.message : 'This video could not be read.');
      return;
    }
    setVideo(file);
    setVideoDecided(true);
  }

  // ---- Upload + submit ----
  async function uploadMedia(file: File) {
    const data = new FormData();
    data.append('file', file);
    const response = await fetch('/api/upload', { method: 'POST', body: data });
    const payload = await response.json().catch(() => null);
    if (!response.ok || !payload?.url) throw new Error(payload?.error || `Could not upload ${file.name}.`);
    return String(payload.url);
  }

  async function submitListing(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!isLast) { next(); return; } // Enter key in earlier stages just moves forward
    if (!complete.slice(0, 4).every(Boolean)) return;
    setBusy(true);
    setError('');
    try {
      const [imageUrls, videoUrls] = await Promise.all([
        Promise.all(photos.map(uploadMedia)),
        Promise.all(videos.map(uploadMedia)),
      ]);
      const token = localStorage.getItem('seller_token');
      const fallbackSeller = {
        id: 'guest',
        fullName: 'Seller',
        businessName: '',
        email: 'seller@example.com',
        phone: '',
        location: '',
        sellerType: 'student',
      };
      const activeSeller = seller || fallbackSeller;
      const response = await fetch('/api/listings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) },
        body: JSON.stringify({
          listingSource: 'seller-dashboard',
          ...(activeSeller.id && activeSeller.id !== 'guest' ? { sellerId: activeSeller.id } : {}),
          sellerName: activeSeller.fullName || 'Seller',
          businessName: activeSeller.businessName || '',
          sellerEmail: activeSeller.email || 'seller@example.com',
          sellerPhone: activeSeller.phone || '',
          location: activeSeller.location || '',
          userType: activeSeller.sellerType === 'business' ? 'vendor' : 'student',
          title: form.title.trim(), description: form.description.trim(),
          category: form.category, subcategory: form.subcategory.trim() || form.category,
          condition: form.condition, price: Number(form.price), stock: Number(form.stock) || 0, imageUrls, videoUrls,
          status: 'pending',
          isActive: false,
        }),
      });
      const payload = await response.json().catch(() => null);
      if (!response.ok || payload?.success === false) throw new Error(payload?.error || 'Could not submit this listing.');
      setSuccess(true);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Could not submit this listing. Please try again.');
    } finally { setBusy(false); }
  }

  // ---- Render ----
  const stageHints = [
    photos.length === 0 ? 'Add at least one photo to continue.' : aiState === 'working' ? 'Shuri is reading your photo…' : '',
    '',
    'Add a name (3+ characters) and a description (10+ characters).',
    'Enter a price above 0 and set a stock count.',
    '',
  ];

  return (
    <main className="min-h-screen bg-[#F8F7FB] pb-12 text-slate-900">
      <ShuriHeader seller={seller} />
      <div className="mx-auto max-w-3xl px-3 sm:px-4 md:px-6 py-6 sm:py-7 md:py-10">
        <div className="mb-3 flex justify-end">
          <Link
            href={seller ? `/sellers/${encodeURIComponent(seller.id)}` : '/lister'}
            className="inline-flex items-center rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-700 shadow-sm transition hover:border-violet-200 hover:text-violet-700 sm:text-sm"
          >
            Back to dashboard
          </Link>
        </div>
        <div className="mb-5 sm:mb-6">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight leading-tight">Create a product listing</h1>
          <p className="mt-2 text-xs sm:text-sm md:text-base leading-relaxed text-slate-600">Start with your photos. Shuri will fill in the details for you to check.</p>
        </div>

        {loadingSeller ? (
          <div className="rounded-2xl sm:rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 text-center text-sm sm:text-base text-slate-600"><LoaderCircle className="mx-auto animate-spin" size={24} />Loading your seller account…</div>
        ) : !seller ? (
          <div role="status" className="rounded-2xl sm:rounded-3xl border border-violet-200 bg-violet-50 p-3 sm:p-4 text-xs sm:text-sm text-violet-900">Continuing without a saved seller account. You can still submit this listing with the AI form.</div>
        ) : null}

        {success ? (
          <section className="rounded-2xl sm:rounded-3xl border border-emerald-200 bg-white p-6 sm:p-8 text-center shadow-sm">
            <div className="mx-auto grid h-12 w-12 sm:h-14 sm:w-14 place-items-center rounded-2xl bg-emerald-100 text-emerald-700"><Check size={24} /></div>
            <h2 className="mt-4 text-xl sm:text-2xl font-extrabold">Listing submitted</h2>
            <p className="mt-2 text-sm sm:text-base text-slate-600">Your product is queued for review. You can check its status in your seller dashboard.</p>
            <Link href={seller ? `/sellers/${encodeURIComponent(seller.id)}` : '/lister'} className="mt-6 inline-flex rounded-xl bg-violet-700 px-4 sm:px-5 py-2.5 sm:py-3 text-sm sm:text-base font-bold text-white hover:bg-violet-800">{seller ? 'Back to dashboard' : 'Back to lister'}</Link>
          </section>
        ) : (
          <>
            {/* Stepper: a stage opens only when every stage before it is complete */}
            <nav aria-label="Listing steps" className="mb-4 sm:mb-5">
              <ol className="flex items-center gap-1 sm:gap-1.5 overflow-x-auto pb-2 -mx-3 px-3 sm:mx-0 sm:px-0 sm:pb-0">
                {STAGES.map((stage, i) => {
                  const Icon = stage.icon;
                  const locked = i > furthest;
                  const done = i < furthest && complete[i];
                  const current = i === activeStep;
                  return (
                    <li key={stage.key} className="shrink-0 min-w-18 sm:min-w-0 flex-1">
                      <button
                        type="button"
                        onClick={() => goTo(i)}
                        disabled={locked}
                        aria-current={current ? 'step' : undefined}
                        aria-label={`${stage.label}${locked ? ' (locked)' : done ? ' (done)' : ''}`}
                        className={`w-full flex flex-col items-center gap-1 rounded-xl sm:rounded-2xl px-2 sm:px-3 py-2 sm:py-2.5 text-[10px] sm:text-xs font-bold transition ${
                          current ? 'bg-violet-700 text-white shadow-sm' : done ? 'bg-emerald-50 text-emerald-800 ring-1 ring-emerald-200' : locked ? 'cursor-not-allowed bg-slate-100 text-slate-400' : 'bg-white text-slate-700 ring-1 ring-slate-200'
                        }`}
                      >
                        {locked ? (
                          <>
                            <Lock size={14} className="sm:hidden" />
                            <Lock size={15} className="hidden sm:block" />
                          </>
                        ) : done ? (
                          <>
                            <Check size={14} className="sm:hidden" />
                            <Check size={15} className="hidden sm:block" />
                          </>
                        ) : (
                          <>
                            <Icon size={14} className="sm:hidden" />
                            <Icon size={15} className="hidden sm:block" />
                          </>
                        )}
                        <span className="truncate">{stage.label}</span>
                      </button>
                    </li>
                  );
                })}
              </ol>
            </nav>

            <form onSubmit={submitListing} className="space-y-4 sm:space-y-5 rounded-2xl sm:rounded-3xl border border-slate-200 bg-white p-4 sm:p-6 md:p-8 shadow-sm">
              {/* ---------- Stage 1: Photos ---------- */}
              {activeStep === 0 && (
                <section className="space-y-3 sm:space-y-4">
                  <div>
                    <h2 className="text-lg sm:text-xl font-extrabold">Upload product photos</h2>
                    <p className="mt-1 text-xs sm:text-sm text-slate-600">Add up to {MAX_PHOTOS} clear photos. The first photo is your cover, and Shuri uses it to fill in the form.</p>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3">
                    {photoUrls.map((url, i) => (
                      <div key={url} className="group relative aspect-square overflow-hidden rounded-xl sm:rounded-2xl border border-slate-200 bg-slate-50">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={url} alt={`Product photo ${i + 1}`} className="h-full w-full object-cover" />
                        {i === 0 ? (
                          <span className="absolute left-1.5 top-1.5 sm:left-2 sm:top-2 rounded-full bg-violet-700 px-2 sm:px-2.5 py-0.5 sm:py-1 text-[10px] sm:text-xs font-bold text-white">Cover</span>
                        ) : (
                          <button type="button" onClick={() => makeCover(i)} className="absolute left-1.5 top-1.5 sm:left-2 sm:top-2 rounded-full bg-white/90 px-2 sm:px-2.5 py-0.5 sm:py-1 text-[10px] sm:text-xs font-bold text-slate-700 shadow hover:text-violet-700">Make cover</button>
                        )}
                        <button type="button" onClick={() => removePhoto(i)} aria-label={`Remove photo ${i + 1}`} className="absolute right-1.5 top-1.5 sm:right-2 sm:top-2 grid h-7 w-7 sm:h-8 sm:w-8 place-items-center rounded-full bg-white/90 text-slate-700 shadow hover:text-red-600">
                          <X size={14} className="sm:hidden" />
                          <X size={16} className="hidden sm:block" />
                        </button>
                      </div>
                    ))}

                    {photos.length < MAX_PHOTOS && (
                      <label className="flex aspect-square cursor-pointer flex-col items-center justify-center gap-1.5 sm:gap-2 rounded-xl sm:rounded-2xl border-2 border-dashed border-violet-300 bg-violet-50 text-center text-xs sm:text-sm font-bold text-violet-800 transition hover:bg-violet-100 focus-within:ring-2 focus-within:ring-violet-300">
                        <ImagePlus size={20} className="sm:hidden" />
                        <ImagePlus size={26} className="hidden sm:block" />
                        <span>{photos.length === 0 ? 'Add photos' : 'Add more'}</span>
                        <span className="text-[10px] sm:text-xs font-normal text-violet-700">{photos.length}/{MAX_PHOTOS}</span>
                        <input multiple accept="image/*" type="file" onChange={onPickPhotos} className="sr-only" />
                      </label>
                    )}
                  </div>

                  {photoError && <p role="alert" className="text-xs sm:text-sm text-red-700">{photoError}</p>}

                  {aiState !== 'idle' && (
                    <div role="status" className={`rounded-xl sm:rounded-2xl border p-3 sm:p-4 text-xs sm:text-sm ${aiState === 'failed' ? 'border-amber-200 bg-amber-50 text-amber-900' : 'border-violet-200 bg-violet-50 text-violet-900'}`}>
                      <div className="flex items-start gap-2 sm:gap-3">
                        {aiState === 'working' ? (
                          <>
                            <LoaderCircle size={16} className="sm:hidden mt-0.5 shrink-0 animate-spin" />
                            <LoaderCircle size={18} className="hidden sm:block mt-0.5 shrink-0 animate-spin" />
                          </>
                        ) : (
                          <>
                            <Sparkles size={16} className="sm:hidden mt-0.5 shrink-0" />
                            <Sparkles size={18} className="hidden sm:block mt-0.5 shrink-0" />
                          </>
                        )}
                        <p>{aiMessage}</p>
                      </div>
                      {aiState === 'working' && (
                        <div className="mt-2 sm:mt-3" aria-label="AI scan progress">
                          <div className="h-1.5 sm:h-2 w-full overflow-hidden rounded-full bg-violet-100">
                            <div className="h-full rounded-full bg-violet-600 transition-all duration-500" style={{ width: `${scanProgress}%` }} />
                          </div>
                          <div className="mt-1.5 sm:mt-2 text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.12em] text-violet-700">{scanProgress}% complete</div>
                        </div>
                      )}
                    </div>
                  )}
                </section>
              )}

              {/* ---------- Stage 2: Video ---------- */}
              {activeStep === 1 && (
                <section className="space-y-3 sm:space-y-4">
                  <div>
                    <h2 className="text-lg sm:text-xl font-extrabold">Add a short video <span className="text-xs sm:text-sm font-semibold text-slate-500">(optional)</span></h2>
                    <p className="mt-1 text-xs sm:text-sm text-slate-600">If you have one, a quick video of the product (up to {MAX_VIDEO_SECONDS} seconds) shows buyers it is real and as described.</p>
                  </div>

                  <div className="flex items-start gap-2 sm:gap-3 rounded-xl sm:rounded-2xl border border-emerald-200 bg-emerald-50 p-3 sm:p-4 text-xs sm:text-sm text-emerald-900">
                    <ShieldCheck size={18} className="sm:hidden mt-0.5 shrink-0" />
                    <ShieldCheck size={20} className="hidden sm:block mt-0.5 shrink-0" />
                    <p>We ask for this for <strong>security and transparency</strong>. It helps us confirm the item exists and protects buyers and sellers from fake listings.</p>
                  </div>

                  {video && videoUrls[0] ? (
                    <div className="space-y-2 sm:space-y-3">
                      <video src={videoUrls[0]} controls playsInline className="max-h-60 sm:max-h-80 w-full rounded-xl sm:rounded-2xl bg-black" />
                      <div className="flex items-center justify-between gap-2 sm:gap-3 text-xs sm:text-sm">
                        <span className="min-w-0 truncate font-semibold text-slate-700">{video.name}</span>
                        <button type="button" onClick={() => { setVideo(null); setVideoDecided(false); }} className="shrink-0 rounded-lg px-2.5 sm:px-3 py-1 sm:py-1.5 text-xs sm:text-sm font-bold text-red-700 hover:bg-red-50">Remove</button>
                      </div>
                    </div>
                  ) : (
                    <label className="flex cursor-pointer flex-col items-center justify-center gap-1.5 sm:gap-2 rounded-xl sm:rounded-2xl border-2 border-dashed border-violet-300 bg-violet-50 px-3 sm:px-4 py-6 sm:py-8 text-center text-xs sm:text-sm font-bold text-violet-800 transition hover:bg-violet-100 focus-within:ring-2 focus-within:ring-violet-300">
                      <Video size={24} className="sm:hidden" />
                      <Video size={28} className="hidden sm:block" />
                      <span>Choose a video</span>
                      <span className="text-[10px] sm:text-xs font-normal text-violet-700">Max {MAX_VIDEO_SECONDS}s · {MAX_VIDEO_MB} MB</span>
                      <input accept="video/*" type="file" onChange={onPickVideo} className="sr-only" />
                    </label>
                  )}

                  {videoError && <p role="alert" className="text-xs sm:text-sm text-red-700">{videoError}</p>}

                </section>
              )}

              {/* ---------- Stage 3: Details ---------- */}
              {activeStep === 2 && (
                <section className="space-y-3 sm:space-y-4">
                  <div>
                    <h2 className="text-lg sm:text-xl font-extrabold">Product details</h2>
                    <p className="mt-1 text-xs sm:text-sm text-slate-600">{aiState === 'done' ? 'Shuri drafted these from your photo. Fix anything that looks off.' : 'Tell buyers what you are selling.'}</p>
                  </div>
                  <div className="grid gap-3 sm:gap-4 sm:grid-cols-2">
                    <label className="block text-xs sm:text-sm font-bold sm:col-span-2">Product name<input required maxLength={120} value={form.title} onChange={(e) => setField('title', e.target.value)} className={fieldClass} placeholder="e.g. Handmade leather sandals" /></label>
                    <label className="block text-xs sm:text-sm font-bold sm:col-span-2">Description<textarea required rows={4} maxLength={3000} value={form.description} onChange={(e) => setField('description', e.target.value)} className={`${fieldClass} sm:rows-5`} placeholder="Describe the product, size, materials, and what makes it useful." /></label>
                    <label className="block text-xs sm:text-sm font-bold">Category<select value={form.category} onChange={(e) => setField('category', e.target.value)} className={fieldClass}>{CATEGORIES.map((c) => <option key={c}>{c}</option>)}</select></label>
                    <label className="block text-xs sm:text-sm font-bold">Subcategory<input value={form.subcategory} onChange={(e) => setField('subcategory', e.target.value)} className={fieldClass} placeholder="e.g. Shoes" /></label>
                  </div>
                </section>
              )}

              {/* ---------- Stage 4: Price & condition ---------- */}
              {activeStep === 3 && (
                <section className="space-y-3 sm:space-y-4">
                  <div>
                    <h2 className="text-lg sm:text-xl font-extrabold">Price and condition</h2>
                    <p className="mt-1 text-xs sm:text-sm text-slate-600">{form.price && aiState === 'done' && !touched.current.has('price') ? 'Shuri suggested this price. Check it before you continue.' : 'Set a fair price and be honest about condition.'}</p>
                  </div>
                  <div className="grid gap-3 sm:gap-4 sm:grid-cols-3">
                    <label className="block text-xs sm:text-sm font-bold">Price (GH₵)<input required min="0.01" step="0.01" type="number" inputMode="decimal" value={form.price} onChange={(e) => setField('price', e.target.value)} className={fieldClass} placeholder="0.00" /></label>
                    <label className="block text-xs sm:text-sm font-bold">Stock<input required min="0" step="1" type="number" inputMode="numeric" value={form.stock} onChange={(e) => setField('stock', e.target.value)} className={fieldClass} placeholder="1" /></label>
                    <label className="block text-xs sm:text-sm font-bold">Condition<select value={form.condition} onChange={(e) => setField('condition', e.target.value)} className={fieldClass}>{CONDITIONS.map((c) => <option key={c}>{c}</option>)}</select></label>
                  </div>
                </section>
              )}

              {/* ---------- Stage 5: Review ---------- */}
              {activeStep === 4 && (
                <section className="space-y-3 sm:space-y-4">
                  <div>
                    <h2 className="text-lg sm:text-xl font-extrabold">Review and submit</h2>
                    <p className="mt-1 text-xs sm:text-sm text-slate-600">Check everything below. Use the steps above to change anything.</p>
                  </div>

                  <div className="flex gap-1.5 sm:gap-2 overflow-x-auto pb-1 -mx-1 px-1">
                    {photoUrls.map((url, i) => (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img key={url} src={url} alt={`Product photo ${i + 1}`} className="h-16 w-16 sm:h-20 sm:w-20 shrink-0 rounded-lg sm:rounded-xl border border-slate-200 object-cover" />
                    ))}
                  </div>

                  <dl className="divide-y divide-slate-100 rounded-xl sm:rounded-2xl border border-slate-200 text-xs sm:text-sm">
                    {[
                      ['Name', form.title],
                      ['Description', form.description],
                      ['Category', form.subcategory.trim() ? `${form.category} › ${form.subcategory.trim()}` : form.category],
                      ['Price', `GH₵ ${Number(form.price || 0).toFixed(2)}`],
                      ['Stock', `${form.stock || 0} units`],
                      ['Condition', form.condition],
                      ['Video', video ? video.name : 'None added'],
                    ].map(([label, value]) => (
                      <div key={label} className="grid gap-1 px-3 sm:px-4 py-2.5 sm:py-3 sm:grid-cols-[8rem_1fr]">
                        <dt className="font-bold text-slate-500">{label}</dt>
                        <dd className="whitespace-pre-wrap wrap-break-word text-slate-900">{value}</dd>
                      </div>
                    ))}
                  </dl>

                  {!video && (
                    <p className="flex items-start gap-2 rounded-xl bg-slate-50 px-3 sm:px-4 py-2.5 sm:py-3 text-xs sm:text-sm text-slate-600">
                      <ShieldCheck size={14} className="sm:hidden mt-0.5 shrink-0 text-emerald-700" />
                      <ShieldCheck size={16} className="hidden sm:block mt-0.5 shrink-0 text-emerald-700" />
                      Listings with a short video are easier for us to verify. Go back to the Video step to add one.
                    </p>
                  )}
                </section>
              )}

              {error && <p role="alert" className="rounded-xl border border-red-200 bg-red-50 px-3 sm:px-4 py-2.5 sm:py-3 text-xs sm:text-sm text-red-700">{error}</p>}

              {/* ---------- Navigation ---------- */}
              <div className="flex justify-end gap-2 sm:gap-3 border-t border-slate-100 pt-4 sm:pt-5">
                <div className="flex flex-col items-stretch gap-2">
                  {!complete[activeStep] && stageHints[activeStep] && <p className="text-[10px] sm:text-xs text-slate-500">{stageHints[activeStep]}</p>}
                  {isLast ? (
                    <button type="submit" disabled={busy} className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 sm:px-6 py-2.5 sm:py-3.5 text-sm sm:text-base font-extrabold text-white transition hover:bg-slate-800 disabled:cursor-wait disabled:opacity-60">
                      {busy && (
                        <>
                          <LoaderCircle size={15} className="sm:hidden animate-spin" />
                          <LoaderCircle size={17} className="hidden sm:block animate-spin" />
                        </>
                      )}
                      {busy ? 'Uploading and submitting…' : 'Submit listing for review'}
                    </button>
                  ) : (
                    <button type="button" onClick={next} disabled={activeStep !== 1 && !complete[activeStep]} className="inline-flex items-center justify-center gap-2 rounded-xl bg-violet-700 px-4 sm:px-6 py-2.5 sm:py-3.5 text-sm sm:text-base font-extrabold text-white transition hover:bg-violet-800 disabled:cursor-not-allowed disabled:opacity-50">
                      {activeStep === 0 && aiState === 'working' ? (
                        <>
                          <LoaderCircle size={15} className="sm:hidden animate-spin" />
                          <LoaderCircle size={17} className="hidden sm:block animate-spin" />
                        </>
                      ) : null}
                      {activeStep === 1 && !video ? 'Continue without video' : 'Continue'}
                      <ArrowRight size={15} className="sm:hidden" />
                      <ArrowRight size={17} className="hidden sm:block" />
                    </button>
                  )}
                </div>
              </div>
            </form>
          </>
        )}
      </div>
    </main>
  );
}
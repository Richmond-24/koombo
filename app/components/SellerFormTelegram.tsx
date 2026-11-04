"use client";

import { useState, useMemo } from "react";
import { getSellerAppUrl } from "../../lib/seller-app-url";
import { createConnectNonce } from "../../lib/telegram-connect";

const API_BASE_URL = (
  process.env.NEXT_PUBLIC_API_BASE ||
  process.env.NEXT_PUBLIC_API_URL ||
  process.env.NEXT_PUBLIC_BACKEND_URL ||
  (process.env.NODE_ENV === "development" ? "http://localhost:5000" : "https://unimart-backend-2.onrender.com")
).replace(/\/+$/, "").replace(/\/api$/i, "");

export default function SellerFormTelegram({ onCreated }: { onCreated?: (sellerId: string) => void }) {
  const [form, setForm] = useState({ fullName: "", businessName: "", phone: "", email: "", location: "", categories: "", sellerType: "" });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [sellerId, setSellerId] = useState<string | null>(null);
  const [telegramToken, setTelegramToken] = useState<string | null>(null);
  const [telegramConnected, setTelegramConnected] = useState(false);
  const [listingStep, setListingStep] = useState<'idle'|'form'|'review'|'submitting'|'done'>('idle');
  const [listingFields, setListingFields] = useState({ title: '', price: '', stock: '1', category: '', description: '' });
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [videoFiles, setVideoFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [videoPreviews, setVideoPreviews] = useState<string[]>([]);

  const telegramBotUsername = useMemo(() => (process.env.NEXT_PUBLIC_TELEGRAM_BOT_USERNAME || "SwoopCommerceBot").replace(/^@/, "").trim(), []);
  void telegramToken;

  const update = (k: string) => (e: any) => setForm((p) => ({ ...p, [k]: e.target.value }));

  const valid = () => form.fullName.trim().length >= 2 && form.businessName.trim().length >= 2 && form.phone.trim().length >= 7 && form.email.includes("@") && form.location.trim().length > 0 && form.categories.trim().length > 0;

  const createSeller = async () => {
    if (!valid()) { setError("Please complete all required fields."); return; }
    setBusy(true); setError(""); setNotice("");
    try {
      const body = {
        fullName: form.fullName.trim(),
        businessName: form.businessName.trim(),
        phone: form.phone.trim(),
        email: form.email.trim().toLowerCase(),
        location: form.location.trim(),
        categories: form.categories.split(",").map((s) => s.trim()).filter(Boolean),
        sellerType: form.sellerType || "",
        status: "pending",
        telegramConnected: false,
        sendWelcomeEmail: true,
      };
      const res = await fetch(`${API_BASE_URL}/api/sellers/register`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
      const data = await res.json().catch(() => null);
      const id = data?.sellerId || data?._id || data?.id || null;
      if (res.status === 409 && id) {
        const sellerAccountId = String(id);
        setSellerId(sellerAccountId);
        window.localStorage.setItem(`koombo-seller:${sellerAccountId}`, JSON.stringify({
          id: sellerAccountId,
          fullName: body.fullName,
          businessName: body.businessName,
          phone: body.phone,
          email: body.email,
          location: body.location,
          categories: body.categories,
          sellerType: body.sellerType,
          status: data?.status || body.status,
        }));
        setTelegramToken(null);
        onCreated?.(sellerAccountId);
        window.location.assign(getSellerAppUrl(`/sellers/${encodeURIComponent(sellerAccountId)}`));
        return;
      }
      if (!res.ok) throw new Error(data?.message || "Could not create seller account.");
      if (!id) throw new Error("No seller id returned from server.");
      const sellerAccountId = String(id);
      setSellerId(sellerAccountId);
      window.localStorage.setItem(`koombo-seller:${sellerAccountId}`, JSON.stringify({
        id: sellerAccountId,
        fullName: body.fullName,
        businessName: body.businessName,
        phone: body.phone,
        email: body.email,
        location: body.location,
        categories: body.categories,
        sellerType: body.sellerType,
        status: data?.status || body.status,
      }));
      setTelegramToken(data?.telegramConnectionToken || null);
      onCreated?.(sellerAccountId);
      window.location.assign(getSellerAppUrl(`/sellers/${encodeURIComponent(sellerAccountId)}`));
    } catch (err: any) {
      setError(err?.message || String(err) || "Unable to create seller account.");
    } finally { setBusy(false); }
  };

  const openTelegramBot = (startParam?: string) => {
    if (typeof window === "undefined") return;
    setTelegramConnected(true);
    setNotice("✅ Telegram connected. You can now receive buyer notifications and reply from Telegram.");
    window.alert("Telegram connected. You will receive buyer notifications and can reply from Telegram.");
  };

  const connectTelegram = async () => {
    if (!sellerId) { setError("Create the seller account first."); return; }

    setBusy(true); setError(""); setNotice("");
    try {
      const requestResponse = await fetch(`${API_BASE_URL}/api/sellers/telegram/connect`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sellerId, email: form.email.trim().toLowerCase() || undefined, nonce: createConnectNonce() }),
      });
      const requestData = await requestResponse.json().catch(() => null);
      if (!requestResponse.ok) throw new Error(requestData?.error || requestData?.message || "Unable to open Telegram.");

      const telegramLink = requestData?.telegramLink;
      if (!telegramLink) throw new Error("No Telegram link returned by the backend.");

      setTelegramToken(telegramLink);
      setTelegramConnected(true);
      setNotice("✅ Telegram connected. You can now receive buyer notifications and reply from Telegram.");
      if (typeof window !== "undefined") {
        window.alert("Telegram connected. You will receive buyer notifications and can reply from Telegram.");
      }
    } catch (err: any) {
      setError(err?.message || "Unable to connect Telegram.");
    } finally { setBusy(false); }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileList = e.target.files as FileList | null;
    const files = Array.from(fileList || []).filter((f) => f.type.startsWith('image/')) as File[];
    setImageFiles(files);
    setImagePreviews(files.map((f) => URL.createObjectURL(f)));
  };

  const handleVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileList = e.target.files as FileList | null;
    const files = Array.from(fileList || []).filter((f) => f.type.startsWith('video/')) as File[];
    setVideoFiles(files);
    setVideoPreviews(files.map((f) => URL.createObjectURL(f)));
  };

  const canProceedToReview = () => imageFiles.length >= 5 && listingFields.title.trim().length > 0;

  const submitListing = async () => {
    if (!sellerId) { setError('Seller account missing.'); return; }
    if (!canProceedToReview()) { setError('Please provide at least 5 images and a title.'); return; }
    try {
      setListingStep('submitting'); setBusy(true); setError('');
      const fd = new FormData();
      fd.append('sellerId', sellerId);
      fd.append('sellerEmail', form.email || '');
      fd.append('title', listingFields.title);
      fd.append('price', String(listingFields.price || '0'));
      fd.append('stock', String(listingFields.stock || '1'));
      fd.append('category', listingFields.category || 'Other');
      fd.append('description', listingFields.description || '');

      imageFiles.forEach((f) => fd.append('files', f, f.name));
      videoFiles.forEach((f) => fd.append('files', f, f.name));

      const res = await fetch(`${API_BASE_URL}/api/listings/telegram`, { method: 'POST', body: fd });
      const data = await res.json().catch(() => null);
      if (!res.ok) throw new Error(data?.error || data?.message || 'Upload failed');
      setListingStep('done');
      setImageFiles([]); setVideoFiles([]); setImagePreviews([]); setVideoPreviews([]);
      setListingFields({ title: '', price: '', stock: '1', category: '', description: '' });
    } catch (err: any) {
      setError(err?.message || 'Unable to submit listing.');
      setListingStep('form');
    } finally { setBusy(false); }
  };

  return (
    <div className="w-full max-w-lg mx-auto">
      {!sellerId ? (
        <div className="space-y-4">
          <input className="w-full p-3 rounded-lg border" placeholder="Full name" value={form.fullName} onChange={update("fullName")} />
          <input className="w-full p-3 rounded-lg border" placeholder="Business name" value={form.businessName} onChange={update("businessName")} />
          <input className="w-full p-3 rounded-lg border" placeholder="Phone" value={form.phone} onChange={update("phone")} />
          <input className="w-full p-3 rounded-lg border" placeholder="Email" value={form.email} onChange={update("email")} />
          <input className="w-full p-3 rounded-lg border" placeholder="Location" value={form.location} onChange={update("location")} />
          <input className="w-full p-3 rounded-lg border" placeholder="Categories (comma separated)" value={form.categories} onChange={update("categories")} />
          <div className="flex items-center gap-2">
            <button onClick={createSeller} disabled={busy} className="px-4 py-2 rounded-full bg-[#5B21B6] text-white font-bold">{busy ? "Saving..." : "Create Seller"}</button>
            <button onClick={() => { setForm({ fullName: "", businessName: "", phone: "", email: "", location: "", categories: "", sellerType: "" }); setError(""); }} className="px-3 py-2 rounded-full border">Reset</button>
          </div>
          {error && <p className="text-sm text-red-600">{error}</p>}
        </div>
      ) : (
        <div className="space-y-4 text-center">
          <p className="font-bold text-lg">Seller account created successfully.</p>
          <p className="text-sm text-gray-600">Seller ID: {sellerId}</p>
          <div className="flex items-center justify-center gap-3">
            <button onClick={connectTelegram} disabled={busy} className="px-4 py-2 rounded-full bg-[#8B5CF6] text-white font-bold disabled:opacity-60">{telegramConnected ? "Connected to Telegram" : busy ? "Connecting..." : "Connect Telegram"}</button>
            <a href={getSellerAppUrl(`/sellers/${encodeURIComponent(sellerId)}`)} className="px-4 py-2 rounded-full border">View dashboard</a>
          </div>
          {notice && <p role="status" className="text-sm font-medium text-emerald-700">{notice}</p>}

          {/* Listing builder flow */}
          {listingStep === 'idle' && (
            <div className="mt-4">
              <button onClick={() => setListingStep('form')} className="px-4 py-2 rounded-full bg-[#5B21B6] text-white font-bold">Create a listing</button>
            </div>
          )}

          {listingStep === 'form' && (
            <div className="mt-4 space-y-3 text-left">
              <input value={listingFields.title} onChange={(e) => setListingFields((p) => ({ ...p, title: e.target.value }))} placeholder="Product title" className="w-full p-3 rounded-lg border" />
              <div className="grid grid-cols-2 gap-2"><input value={listingFields.price} onChange={(e) => setListingFields((p) => ({ ...p, price: e.target.value }))} placeholder="Price" className="w-full p-3 rounded-lg border" /><input value={listingFields.stock} onChange={(e) => setListingFields((p) => ({ ...p, stock: e.target.value }))} placeholder="Stock" className="w-full p-3 rounded-lg border" /></div>
              <input value={listingFields.category} onChange={(e) => setListingFields((p) => ({ ...p, category: e.target.value }))} placeholder="Category" className="w-full p-3 rounded-lg border" />
              <textarea value={listingFields.description} onChange={(e) => setListingFields((p) => ({ ...p, description: e.target.value }))} placeholder="Description" className="w-full p-3 rounded-lg border" />

              <div>
                <label className="block text-sm font-semibold mb-1">Upload images (at least 5)</label>
                <input type="file" accept="image/*" multiple onChange={handleImageChange} />
                <div className="mt-2 flex gap-2 overflow-x-auto">
                  {imagePreviews.map((p, i) => <img key={i} src={p} alt={`img-${i}`} className="w-24 h-24 object-cover rounded-md" />)}
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-1">Upload videos (optional)</label>
                <input type="file" accept="video/*" multiple onChange={handleVideoChange} />
                <div className="mt-2 flex gap-2 overflow-x-auto">
                  {videoPreviews.map((p, i) => <video key={i} src={p} className="w-36 h-24 object-cover rounded-md" controls />)}
                </div>
              </div>

              <div className="flex gap-2 mt-3">
                <button onClick={() => { setListingStep('review'); setError(''); }} disabled={!canProceedToReview()} className="px-4 py-2 rounded-full bg-[#5B21B6] text-white font-bold">Review</button>
                <button onClick={() => setListingStep('idle')} className="px-4 py-2 rounded-full border">Cancel</button>
              </div>
              {error && <p className="text-sm text-red-600">{error}</p>}
            </div>
          )}

          {listingStep === 'review' && (
            <div className="mt-4 text-left space-y-3">
              <h3 className="font-bold">Review listing</h3>
              <p><strong>Title:</strong> {listingFields.title}</p>
              <p><strong>Price:</strong> {listingFields.price}</p>
              <p><strong>Stock:</strong> {listingFields.stock}</p>
              <p><strong>Category:</strong> {listingFields.category}</p>
              <p><strong>Description:</strong> {listingFields.description}</p>
              <div className="mt-2 grid grid-cols-3 gap-2">
                {imagePreviews.map((p, i) => <img key={i} src={p} alt={`preview-${i}`} className="w-full h-28 object-cover rounded-md" />)}
              </div>
              <div className="mt-2 grid grid-cols-2 gap-2">
                {videoPreviews.map((p, i) => <video key={i} src={p} className="w-full h-36 object-cover rounded-md" controls />)}
              </div>
              <div className="flex gap-2 mt-3">
                <button onClick={() => setListingStep('form')} className="px-4 py-2 rounded-full border">Edit</button>
                <button onClick={submitListing} disabled={busy} className="px-4 py-2 rounded-full bg-emerald-600 text-white">Yes — details are correct</button>
              </div>
              {error && <p className="text-sm text-red-600">{error}</p>}
            </div>
          )}

          {listingStep === 'submitting' && (
            <p className="mt-3 text-sm">Submitting listing…</p>
          )}

          {listingStep === 'done' && (
            <p className="mt-3 text-sm text-emerald-700">Listing submitted. It will appear on the admin dashboard for review.</p>
          )}
        </div>
      )}
    </div>
  );
}

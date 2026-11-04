"use client";

import { useMemo, useState } from "react";

const API_BASE_URL = (
  process.env.NEXT_PUBLIC_API_BASE ||
  process.env.NEXT_PUBLIC_API_URL ||
  process.env.NEXT_PUBLIC_BACKEND_URL ||
  (process.env.NODE_ENV === "development" ? "http://localhost:5000" : "https://unimart-backend-2.onrender.com")
).replace(/\/+$/, "").replace(/\/api$/i, "");

type ListingTemplate = {
  title?: string;
  description?: string;
  category?: string;
  price?: string;
};

type ProductQuickEditProps = {
  product: {
    id: string;
    title: string;
    price: number | null;
    stock: number | null;
    description: string;
    category: string;
  };
  onClose: () => void;
  onSaved: (message: string) => void;
  onUpdated: (patch: { stock?: number; price?: number; title?: string }) => void;
  onReuse: () => void;
};

type QuickAddSheetProps = {
  sellerId: string;
  categories: string[];
  template?: ListingTemplate;
  onClose: () => void;
  onSaved: (message: string) => void;
};

export type { ListingTemplate };

export function ActionCard({
  title,
  sub,
  d,
  onClick,
  primary = false,
}: {
  title: string;
  sub: string;
  d: string;
  onClick: () => void;
  primary?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        "group rounded-[22px] border p-4 text-left transition hover:-translate-y-0.5",
        primary
          ? "border-violet-200 bg-violet-600 text-white shadow-[0_12px_30px_-18px_rgba(109,40,217,.9)]"
          : "border-slate-200 bg-white text-slate-900 shadow-sm hover:border-violet-200 hover:bg-violet-50/40",
      ].join(" ")}
    >
      <span
        className={[
          "mb-3 grid h-11 w-11 place-items-center rounded-2xl",
          primary ? "bg-white/15 text-white" : "bg-violet-50 text-violet-700",
        ].join(" ")}
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
          <path d={d} />
        </svg>
      </span>
      <p className="text-[17px] font-extrabold tracking-tight">{title}</p>
      <p className={primary ? "mt-1 text-[15px] text-violet-100" : "mt-1 text-[15px] text-slate-500"}>{sub}</p>
    </button>
  );
}

export function ProductQuickEdit({
  product,
  onClose,
  onSaved,
  onUpdated,
  onReuse,
}: ProductQuickEditProps) {
  const [title, setTitle] = useState(product.title ?? "");
  const [stock, setStock] = useState<number | null>(product.stock ?? 0);
  const [price, setPrice] = useState<number | null>(product.price ?? null);
  const [saving, setSaving] = useState(false);

  const submit = async () => {
    setSaving(true);
    try {
      const token = typeof window !== "undefined" ? window.localStorage.getItem("seller_token") : null;
      const payload: Record<string, string | number> = {};

      if (title.trim() && title.trim() !== product.title) payload.title = title.trim();
      if (stock !== null && stock !== (product.stock ?? 0)) payload.stock = stock;
      if (price !== null && price !== (product.price ?? 0)) payload.price = price;

      if (Object.keys(payload).length === 0) {
        onSaved("No changes to save");
        onClose();
        return;
      }

      const response = await fetch(`${API_BASE_URL}/api/listings/${encodeURIComponent(product.id)}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json().catch(() => null);
      if (!response.ok) {
        throw new Error(data?.error || "Could not save these product changes.");
      }

      const updated = data?.data || data || {};
      const nextPatch: { stock?: number; price?: number; title?: string } = {};
      if (updated.title || title.trim()) nextPatch.title = String(updated.title || title.trim());
      if (updated.stock !== undefined) nextPatch.stock = Number(updated.stock);
      if (updated.price !== undefined) nextPatch.price = Number(updated.price);

      onUpdated(nextPatch);
      onSaved("Product updated successfully");
      onClose();
    } catch (error) {
      onSaved(error instanceof Error ? error.message : "Could not save product changes");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="rounded-[22px] border border-violet-100 bg-violet-50/60 p-4 shadow-sm">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-[15px] font-extrabold text-slate-900">Update {product.title}</p>
          <p className="text-[14px] text-slate-500">Quick stock, price, and name edits</p>
        </div>
        <button type="button" onClick={onClose} className="rounded-full bg-white px-2.5 py-1 text-[14px] font-bold text-slate-600">
          Close
        </button>
      </div>
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <label className="block text-[15px] font-semibold text-slate-700 sm:col-span-2">
          Product name
          <input
            type="text"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-[15px] outline-none ring-0 focus:border-violet-400"
          />
        </label>
        <label className="block text-[15px] font-semibold text-slate-700">
          Stock
          <input
            type="number"
            min={0}
            value={stock ?? ""}
            onChange={(event) => setStock(event.target.value === "" ? null : Number(event.target.value))}
            className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-[15px] outline-none ring-0 focus:border-violet-400"
          />
        </label>
        <label className="block text-[15px] font-semibold text-slate-700">
          Price (GH₵)
          <input
            type="number"
            min={0}
            step="0.01"
            value={price ?? ""}
            onChange={(event) => setPrice(event.target.value === "" ? null : Number(event.target.value))}
            className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-[15px] outline-none ring-0 focus:border-violet-400"
          />
        </label>
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        <button type="button" onClick={submit} disabled={saving} className="inline-flex h-10 items-center justify-center rounded-xl bg-violet-600 px-4 text-[15px] font-bold text-white disabled:opacity-60">
          {saving ? "Saving..." : "Save changes"}
        </button>
        <button type="button" onClick={onReuse} className="inline-flex h-10 items-center justify-center rounded-xl bg-white px-4 text-[15px] font-bold text-slate-700 ring-1 ring-slate-200">
          Reuse listing
        </button>
      </div>
    </div>
  );
}

export function QuickAddSheet({ sellerId, categories, template, onClose, onSaved }: QuickAddSheetProps) {
  const [form, setForm] = useState({
    title: template?.title ?? "",
    description: template?.description ?? "",
    category: template?.category ?? categories[0] ?? "General",
    price: template?.price ?? "",
  });
  const [saving, setSaving] = useState(false);

  const submit = async () => {
    setSaving(true);
    try {
      const title = form.title.trim();
      const price = Number(form.price || 0);
      if (!title) throw new Error("Add a product title first.");
      if (!Number.isFinite(price) || price <= 0) throw new Error("Enter a price greater than zero.");
      const token = typeof window !== "undefined" ? window.localStorage.getItem("seller_token") : null;
      const response = await fetch(`${API_BASE_URL}/api/listings`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          sellerId,
          title,
          description: form.description.trim(),
          category: form.category,
          price,
          stock: 0,
        }),
      });
      const data = await response.json().catch(() => null);
      if (!response.ok || data?.success === false) {
        throw new Error(data?.error || data?.message || "Could not save this listing. The seller sign-in may have expired — sign in again and retry.");
      }
      const saved = data?.data || data?.listing || {};
      onSaved(saved?.title ? `“${saved.title}” submitted for Koombo review` : "Product submitted for Koombo review");
      onClose();
    } catch (error) {
      onSaved(error instanceof Error ? error.message : "Could not save this listing");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[70] flex items-end justify-center bg-slate-900/45 p-3 sm:items-center sm:p-6">
      <div className="w-full max-w-xl rounded-[28px] bg-white p-5 shadow-2xl">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xl font-extrabold text-slate-900">Quick add</p>
            <p className="text-[15px] text-slate-500">Create a product listing fast</p>
          </div>
          <button type="button" onClick={onClose} className="rounded-full bg-slate-100 px-2.5 py-1 text-[14px] font-bold text-slate-600">
            Close
          </button>
        </div>

        <div className="mt-4 grid gap-3">
          <label className="block text-[15px] font-semibold text-slate-700">
            Title
            <input
              value={form.title}
              onChange={(event) => setForm((current) => ({ ...current, title: event.target.value }))}
              className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-[15px] outline-none focus:border-violet-400"
            />
          </label>

          <label className="block text-[15px] font-semibold text-slate-700">
            Description
            <textarea
              value={form.description}
              onChange={(event) => setForm((current) => ({ ...current, description: event.target.value }))}
              rows={4}
              className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-[15px] outline-none focus:border-violet-400"
            />
          </label>

          <div className="grid gap-3 sm:grid-cols-2">
            <label className="block text-[15px] font-semibold text-slate-700">
              Category
              <select
                value={form.category}
                onChange={(event) => setForm((current) => ({ ...current, category: event.target.value }))}
                className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-[15px] outline-none focus:border-violet-400"
              >
                {(categories.length ? categories : ["General"]).map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </label>

            <label className="block text-[15px] font-semibold text-slate-700">
              Price (GH₵)
              <input
                type="number"
                min={0}
                step={0.01}
                value={form.price}
                onChange={(event) => setForm((current) => ({ ...current, price: event.target.value }))}
                className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-[15px] outline-none focus:border-violet-400"
              />
            </label>
          </div>
        </div>

        <div className="mt-5 flex justify-end gap-2">
          <button type="button" onClick={onClose} className="inline-flex h-11 items-center rounded-xl bg-slate-100 px-4 text-[15px] font-bold text-slate-700">
            Cancel
          </button>
          <button type="button" onClick={submit} disabled={saving || !form.title.trim()} className="inline-flex h-11 items-center rounded-xl bg-violet-600 px-4 text-[15px] font-bold text-white disabled:opacity-60">
            {saving ? "Saving..." : "Save listing"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function SellerTools() {
  return null;
}

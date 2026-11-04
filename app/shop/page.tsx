"use client";

/**
 * Public Koombo shop: approved products, search, category filters and
 * in-app buyer ↔ seller messaging.
 *
 * Everything here talks to the existing backend:
 *   GET  /api/public/listings            — approved catalog
 *   POST /api/listings/:id/message       — buyer sends a message
 *   GET  /api/conversations/:id/messages — conversation history
 *
 * The seller side of the conversation runs in Telegram: a buyer message is
 * pushed to the seller's chat, and the seller's reply is written back to the
 * conversation so it appears here.
 */

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { API_BASE_URL } from "../../lib/telegram-connect";

type Product = {
  id: string;
  title: string;
  description: string;
  price: number | null;
  category: string;
  imageUrl: string;
  videoUrl: string;
  businessName: string;
  sellerName: string;
  sellerId: string;
  stock: number | null;
  createdAt: string;
};

type ChatMessage = {
  senderType: "buyer" | "seller" | "system";
  text: string;
  attachments?: string[];
  createdAt: string;
};

const CATEGORIES = [
  "All",
  "Electronics",
  "Fashion",
  "Books",
  "Food",
  "Services",
  "Events",
  "Second Hand",
  "Tech Gadgets",
  "Campus Life",
  "Home & Furniture",
  "Other",
];

const BUYER_ID_KEY = "koombo_buyer_id";

/** A stable anonymous buyer id so a buyer can return to their conversations. */
function buyerIdentity() {
  if (typeof window === "undefined") return { id: "", name: "" };
  let id = window.localStorage.getItem(BUYER_ID_KEY);
  if (!id || !/^[a-zA-Z0-9_-]{8,64}$/.test(id)) {
    id = `buyer_${Date.now().toString(36)}${Math.random().toString(36).slice(2, 10)}`;
    window.localStorage.setItem(BUYER_ID_KEY, id);
  }
  const name = window.localStorage.getItem("koombo_buyer_name") || "";
  return { id, name };
}

function toProduct(raw: any, index: number): Product {
  const priceValue = Number(raw?.price);
  const stockValue = Number(raw?.stock);
  return {
    id: String(raw?._id || raw?.id || index),
    title: String(raw?.title || "Untitled product"),
    description: String(raw?.description || ""),
    price: Number.isFinite(priceValue) && priceValue > 0 ? priceValue : null,
    category: String(raw?.category || "Other"),
    imageUrl: String(
      raw?.imageUrl ||
        raw?.imageUrls?.[0] ||
        raw?.images?.[0]?.url ||
        raw?.media?.find?.((m: any) => m?.resource_type === "image")?.secure_url ||
        ""
    ),
    videoUrl: String(
      raw?.videoUrl || raw?.videoUrls?.[0] || raw?.media?.find?.((m: any) => m?.resource_type === "video")?.secure_url || ""
    ),
    businessName: String(raw?.businessName || raw?.sellerName || "Koombo seller"),
    sellerName: String(raw?.sellerName || ""),
    sellerId: String(raw?.sellerId || ""),
    stock: Number.isFinite(stockValue) ? stockValue : null,
    createdAt: String(raw?.createdAt || ""),
  };
}

export default function ShopPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");

  const [active, setActive] = useState<Product | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [draft, setDraft] = useState("");
  const [buyerName, setBuyerName] = useState("");
  const [sending, setSending] = useState(false);
  const [chatError, setChatError] = useState("");
  const [conversationId, setConversationId] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const identity = useMemo(() => buyerIdentity(), []);

  useEffect(() => {
    setBuyerName(identity.name);
  }, [identity.name]);

  const loadProducts = useCallback(async () => {
    setLoading(true);
    setLoadError("");
    try {
      const query = new URLSearchParams({ limit: "60" });
      if (category !== "All") query.set("category", category);
      if (search.trim()) query.set("search", search.trim());
      const response = await fetch(`${API_BASE_URL}/api/public/listings?${query.toString()}`, {
        cache: "no-store",
      });
      const payload = await response.json().catch(() => null);
      if (!response.ok || !payload?.success) {
        throw new Error(payload?.error || "Unable to load products right now.");
      }
      const rows = Array.isArray(payload.data) ? payload.data : [];
      setProducts(rows.map(toProduct));
    } catch (error) {
      setLoadError(error instanceof Error ? error.message : "Unable to load products right now.");
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, [category, search]);

  useEffect(() => {
    const timer = window.setTimeout(() => void loadProducts(), 250);
    return () => window.clearTimeout(timer);
  }, [loadProducts]);

  // Poll the open conversation so the seller's Telegram replies show up.
  useEffect(() => {
    if (!conversationId || !identity.id) return;
    let cancelled = false;

    const refresh = async () => {
      try {
        const response = await fetch(
          `${API_BASE_URL}/api/conversations/${encodeURIComponent(conversationId)}/messages?buyerId=${encodeURIComponent(identity.id)}`,
          { cache: "no-store" }
        );
        if (!response.ok) return;
        const payload = await response.json().catch(() => null);
        if (!cancelled && Array.isArray(payload?.messages)) {
          setMessages(payload.messages);
        }
      } catch {
        // A transient network error must not clear the conversation.
      }
    };

    void refresh();
    const interval = window.setInterval(refresh, 5000);
    return () => {
      cancelled = true;
      window.clearInterval(interval);
    };
  }, [conversationId, identity.id]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages.length]);

  const openChat = (product: Product) => {
    setActive(product);
    setMessages([]);
    setConversationId(null);
    setChatError("");
  };

  const sendMessage = async () => {
    const text = draft.trim();
    if (!text || !active || sending) return;

    setSending(true);
    setChatError("");
    const optimistic: ChatMessage = {
      senderType: "buyer",
      text,
      createdAt: new Date().toISOString(),
    };
    setMessages((current) => [...current, optimistic]);
    setDraft("");

    try {
      if (buyerName.trim()) window.localStorage.setItem("koombo_buyer_name", buyerName.trim());
      const response = await fetch(`${API_BASE_URL}/api/listings/${encodeURIComponent(active.id)}/message`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          buyerId: identity.id,
          buyerName: buyerName.trim() || "Koombo buyer",
          text,
        }),
      });
      const payload = await response.json().catch(() => null);
      if (!response.ok || !payload?.success) {
        throw new Error(payload?.error || "Could not send your message.");
      }
      if (payload.conversationId) setConversationId(String(payload.conversationId));
      if (payload.delivery && payload.delivery.delivered === false) {
        setChatError("Sent. The seller has not connected Telegram yet, so they will see it in their dashboard instead.");
      }
    } catch (error) {
      setMessages((current) => current.filter((message) => message !== optimistic));
      setDraft(text);
      setChatError(error instanceof Error ? error.message : "Could not send your message.");
    } finally {
      setSending(false);
    }
  };

  const money = (value: number | null) =>
    value === null ? "Price on request" : `GH₵${value.toLocaleString("en-GH")}`;

  return (
    <main className="min-h-screen bg-[#F4F8F9] text-[#12161C]">
      <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
          <a href="/" className="flex items-center gap-2">
            <img src="/logo.png" alt="Koombo" className="h-9 w-auto" />
            <span className="text-lg font-extrabold tracking-tight">Shop</span>
          </a>
          <div className="flex w-full gap-2 sm:w-auto">
            <label className="sr-only" htmlFor="shop-search">Search products</label>
            <input
              id="shop-search"
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search products or shops"
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium outline-none focus:border-[#5B21B6] focus:ring-4 focus:ring-[#5B21B6]/10 sm:w-72"
            />
          </div>
        </div>
        <div className="mx-auto flex max-w-6xl gap-2 overflow-x-auto px-4 pb-3">
          {CATEGORIES.map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => setCategory(item)}
              className={`whitespace-nowrap rounded-full px-4 py-1.5 text-sm font-bold transition ${
                category === item
                  ? "bg-[#5B21B6] text-white"
                  : "border border-slate-200 bg-white text-slate-600 hover:border-[#5B21B6]/40"
              }`}
            >
              {item}
            </button>
          ))}
        </div>
      </header>

      <section className="mx-auto max-w-6xl px-4 py-8">
        {loadError && (
          <div role="alert" className="mb-6 rounded-2xl border border-rose-200 bg-rose-50 px-5 py-4 text-sm font-medium text-rose-800">
            {loadError}
            <button type="button" onClick={() => void loadProducts()} className="ml-3 font-bold underline">Retry</button>
          </div>
        )}

        {loading && <p className="py-16 text-center text-slate-500">Loading products…</p>}

        {!loading && !products.length && !loadError && (
          <div className="rounded-3xl border border-slate-200 bg-white px-6 py-16 text-center">
            <p className="text-lg font-bold">No products match that search yet.</p>
            <p className="mt-2 text-slate-500">Try another category, or clear the search to see everything.</p>
          </div>
        )}

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => (
            <article key={product.id} className="flex flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition hover:shadow-lg">
              <div className="aspect-[4/3] w-full bg-slate-100">
                {product.imageUrl ? (
                  <img src={product.imageUrl} alt={product.title} className="h-full w-full object-cover" loading="lazy" />
                ) : (
                  <div className="flex h-full items-center justify-center text-sm font-semibold text-slate-400">No photo yet</div>
                )}
              </div>
              <div className="flex flex-1 flex-col p-4">
                <p className="text-xs font-extrabold uppercase tracking-[.18em] text-[#5B21B6]">{product.category}</p>
                <h2 className="mt-1 line-clamp-2 text-lg font-extrabold">{product.title}</h2>
                <p className="mt-1 text-sm text-slate-500">{product.businessName}</p>
                <p className="mt-3 text-xl font-extrabold">{money(product.price)}</p>
                {product.stock !== null && (
                  <p className="mt-1 text-sm text-slate-500">{product.stock > 0 ? `${product.stock} available` : "Currently out of stock"}</p>
                )}
                <button
                  type="button"
                  onClick={() => openChat(product)}
                  className="mt-4 inline-flex h-11 items-center justify-center rounded-xl bg-[#5B21B6] font-bold text-white transition hover:bg-[#4C1D95]"
                >
                  Message seller
                </button>
              </div>
            </article>
          ))}
        </div>
      </section>

      {active && (
        <div className="fixed inset-0 z-40 flex items-end justify-center bg-slate-900/40 p-0 sm:items-center sm:p-6" role="dialog" aria-modal="true">
          <div className="flex h-[85vh] w-full max-w-lg flex-col overflow-hidden rounded-t-3xl bg-white shadow-2xl sm:h-[70vh] sm:rounded-3xl">
            <div className="flex items-start justify-between gap-3 border-b border-slate-200 px-4 py-3">
              <div className="min-w-0">
                <p className="truncate text-sm font-bold">{active.businessName}</p>
                <p className="truncate text-xs text-slate-500">About: {active.title}</p>
              </div>
              <button type="button" onClick={() => setActive(null)} className="rounded-lg px-2 py-1 text-sm font-bold text-slate-500 hover:bg-slate-100">Close</button>
            </div>

            <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto bg-[#F7F9F9] px-4 py-4">
              <div className="rounded-2xl bg-white px-4 py-3 text-sm text-slate-600 shadow-sm">
                Ask the seller anything about <strong>{active.title}</strong>. Replies arrive here and in your Koombo account.
              </div>
              {messages.map((message, index) => (
                <div key={`${message.createdAt}-${index}`} className={`flex ${message.senderType === "buyer" ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm shadow-sm ${message.senderType === "buyer" ? "bg-[#5B21B6] text-white" : "bg-white text-slate-800"}`}>
                    <p className="whitespace-pre-wrap break-words">{message.text}</p>
                    <p className={`mt-1 text-[11px] ${message.senderType === "buyer" ? "text-white/70" : "text-slate-400"}`}>
                      {message.senderType === "seller" ? "Seller" : "You"} · {new Date(message.createdAt).toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" })}
                    </p>
                  </div>
                </div>
              ))}
              {!messages.length && <p className="pt-6 text-center text-sm text-slate-400">No messages yet. Say hello to the seller.</p>}
            </div>

            {chatError && <p className="bg-amber-50 px-4 py-2 text-xs font-semibold text-amber-800">{chatError}</p>}

            <div className="border-t border-slate-200 px-4 py-3">
              <label className="mb-2 block text-xs font-bold text-slate-500" htmlFor="buyer-name">Your name (shown to the seller)</label>
              <input
                id="buyer-name"
                value={buyerName}
                onChange={(event) => setBuyerName(event.target.value)}
                placeholder="e.g. Ama"
                className="mb-2 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-[#5B21B6]"
              />
              <div className="flex gap-2">
                <label className="sr-only" htmlFor="chat-draft">Message</label>
                <textarea
                  id="chat-draft"
                  rows={2}
                  value={draft}
                  onChange={(event) => setDraft(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" && !event.shiftKey) {
                      event.preventDefault();
                      void sendMessage();
                    }
                  }}
                  placeholder="Is this still available?"
                  className="flex-1 resize-none rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-[#5B21B6]"
                />
                <button
                  type="button"
                  onClick={() => void sendMessage()}
                  disabled={sending || !draft.trim()}
                  className="rounded-xl bg-[#5B21B6] px-5 font-bold text-white transition hover:bg-[#4C1D95] disabled:opacity-50"
                >
                  {sending ? "…" : "Send"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

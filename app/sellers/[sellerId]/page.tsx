"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { ProductQuickEdit, QuickAddSheet, type ListingTemplate } from "./seller-tools";
import {
  connectSellerTelegram,
  createConnectNonce,
  openTelegramDeepLink,
  pollTelegramConnect,
  telegramStatusMessage,
} from "../../../lib/telegram-connect";

const API_BASE_URL = (
  process.env.NEXT_PUBLIC_API_BASE ||
  process.env.NEXT_PUBLIC_API_URL ||
  process.env.NEXT_PUBLIC_BACKEND_URL ||
  (process.env.NODE_ENV === "development" ? "http://localhost:5000" : "https://unimart-backend-2.onrender.com")
).replace(/\/+$/, "").replace(/\/api$/i, "");

const MARKETPLACE_HREF = process.env.NEXT_PUBLIC_WEBAPP_URL || "https://koombo.app";

/* The listing assistant is now called Shuri AI. The route is kept as-is so existing links keep working;
   change this one constant if you rename the route folder. */
const SHURI_LISTING_PATH = "/riri-ai";

/* ───────────── Icon paths ───────────── */
const I = {
  marketplace: "M3 9l1.5-5h15L21 9M3 9v11h18V9M3 9h18M9 20v-6h6v6",
  home: "M3 12 12 3l9 9M5 10v10h5v-6h4v6h5V10",
  box: "M21 8 12 3 3 8m18 0-9 5m9-5v8l-9 5m0-8L3 8m9 5v8M3 8v8l9 5",
  bag: "M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4H6ZM3 6h18M16 10a4 4 0 0 1-8 0",
  chat: "M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2Z",
  plus: "M12 5v14m-7-7h14",
  eye: "M1 12s4-8 11-8 11 8 11 8-4 8-11 8S1 12 1 12Zm11 3a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z",
  spark: "M12 3l1.9 5.1L19 10l-5.1 1.9L12 17l-1.9-5.1L5 10l5.1-1.9L12 3Z",
  pin: "M12 21s-7-6.2-7-11a7 7 0 1 1 14 0c0 4.8-7 11-7 11Zm0-8.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z",
  warn: "M12 9v4m0 4h.01M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0Z",
  user: "M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2m8-10a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z",
  mail: "M4 4h16v16H4zM4 7l8 6 8-6",
  phone: "M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8.1 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2Z",
  shop: "M3 21V8l9-5 9 5v13M9 21v-6h6v6",
  copy: "M9 9h11v11H9zM5 15H4V4h11v1",
  check: "m5 12 5 5L20 7",
  chevron: "m9 6 6 6-6 6",
  back: "m15 6-6 6 6 6",
  send: "m22 2-7 20-4-9-9-4 20-7Z",
  refresh: "M21 12a9 9 0 1 1-3-6.7L21 8m0-5v5h-5",
  bolt: "M13 2 3 14h9l-1 8 10-12h-9l1-8Z",
};

/* ───────────── Types ───────────── */
type SellerProfile = {
  id: string;
  fullName: string;
  businessName: string;
  phone: string;
  email: string;
  location: string;
  categories: string[];
  sellerType?: string;
  status?: string;
  telegramConnected?: boolean;
  telegramUsername?: string | null;
  telegramFirstName?: string | null;
  telegramLastName?: string | null;
};

type LoadState = "loading" | "ready" | "missing";
type TabId = "overview" | "products" | "orders" | "messages";
type ShopProduct = {
  id: string;
  title: string;
  price: number | null;
  status: string;
  imageUrl: string;
  views: number;
  orders: number;
  stock: number | null;
  description: string;
  category: string;
};
type SheetState = null | { type: "quick"; template?: ListingTemplate };
type ShopOrder = {
  id: string;
  product: string;
  amount: number | null;
  status: string;
  createdAt: string;
};

const TAB_ORDER: TabId[] = ["overview", "products", "orders", "messages"];

/* ───────────── Helpers ───────────── */
const object = (value: any) => (value && typeof value === "object" ? value : {});
const records = (response: any): any[] => {
  const root = object(response);
  const data = root.data ?? root.listings ?? root.orders ?? root;
  if (Array.isArray(data)) return data;
  const nested = object(data);
  for (const key of ["items", "listings", "orders", "results"]) {
    if (Array.isArray(nested[key])) return nested[key];
  }
  return [];
};
function getSellerToken() {
  const fragment = new URLSearchParams(window.location.hash.slice(1));
  const handoffToken = fragment.get("seller_token");
  if (handoffToken) {
    window.localStorage.setItem("seller_token", handoffToken);
    window.history.replaceState(null, "", `${window.location.pathname}${window.location.search}`);
  }
  return handoffToken || window.localStorage.getItem("seller_token");
}
const numberFrom = (...values: unknown[]): number | null => {
  for (const value of values) {
    const n = typeof value === "number" ? value : typeof value === "string" && value.trim() ? Number(value) : NaN;
    if (Number.isFinite(n) && n >= 0) return n;
  }
  return null;
};

function productMeta(product: ShopProduct) {
  const status = product.status.toLowerCase();
  const live = ["approved", "active", "live", "published"].includes(status);
  const rejected = ["rejected", "declined"].includes(status);
  const tone = live ? "bg-emerald-50 text-emerald-700" : rejected ? "bg-rose-50 text-rose-700" : "bg-amber-50 text-amber-800";
  const label = live ? "Live" : rejected ? "Needs changes" : status === "pending" || status === "awaiting_approval" ? "Pending" : product.status;
  return { live, rejected, label, tone };
}

const stockText = (stock: number | null) => (stock === null ? "Stock not set" : stock === 0 ? "Sold out" : `${stock} in stock`);
const priceText = (price: number | null) => (price === null ? "No price" : `GH₵${price.toLocaleString()}`);
const stagger = (i: number): CSSProperties => ({ ["--i" as string]: i } as CSSProperties);

/* ───────────── Page ───────────── */
export default function SellerDashboardPage() {
  const params = useParams<{ sellerId: string }>();
  const sellerId = Array.isArray(params.sellerId) ? params.sellerId[0] : params.sellerId;
  const [seller, setSeller] = useState<SellerProfile | null>(null);
  const [state, setState] = useState<LoadState>("loading");
  const [loadMessage, setLoadMessage] = useState("");
  const [copied, setCopied] = useState(false);
  const [products, setProducts] = useState<ShopProduct[]>([]);
  const [orders] = useState<ShopOrder[]>([]);
  const [activeTab, setActiveTab] = useState<TabId>("overview");
  const [shopViews, setShopViews] = useState<number | null>(null);
  const [orderCount, setOrderCount] = useState<number | null>(null);
  const [lastSynced, setLastSynced] = useState<Date | null>(null);
  const [sheet, setSheet] = useState<SheetState>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const [notice, setNotice] = useState("");
  const [inbox, setInbox] = useState<{ conversation: any; listingTitle: string; lastMessage: any }[]>([]);
  const [inboxLoading, setInboxLoading] = useState(false);
  const [inboxError, setInboxError] = useState("");
  const [openConversation, setOpenConversation] = useState<any | null>(null);
  const [conversationMessages, setConversationMessages] = useState<any[]>([]);
  const [replyDraft, setReplyDraft] = useState("");
  const [replySending, setReplySending] = useState(false);
  const [telegramConnection, setTelegramConnection] = useState({
    connected: false,
    userId: null as string | null,
    username: null as string | null,
    firstName: null as string | null,
    lastName: null as string | null,
  });
  const [telegramLinking, setTelegramLinking] = useState(false);

  // Mobile-only UI state
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const prevTabRef = useRef<TabId>("overview");
  const tabDir = TAB_ORDER.indexOf(activeTab) >= TAB_ORDER.indexOf(prevTabRef.current) ? "fwd" : "back";

  useEffect(() => {
    prevTabRef.current = activeTab;
  }, [activeTab]);

  useEffect(() => {
    if (!sellerId) return;
    const loadSeller = async () => {
      try {
        const token = getSellerToken();
        const authHeaders = token ? { Authorization: `Bearer ${token}` } : undefined;

        if (token) {
          const meResponse = await fetch(`${API_BASE_URL}/api/sellers/auth/me`, {
            cache: "no-store",
            headers: authHeaders,
          });

          if (meResponse.ok) {
            const meData = await meResponse.json().catch(() => null);
            const meSeller = meData?.seller || meData?.data || null;
            const meSellerId = meSeller?.id || meSeller?._id;
            if (meSellerId && String(meSellerId) === String(sellerId)) {
              setSeller({
                id: String(meSellerId),
                fullName: meSeller.fullName || "",
                businessName: meSeller.businessName || "",
                phone: meSeller.phone || "",
                email: meSeller.email || "",
                location: meSeller.location || "",
                categories: Array.isArray(meSeller.categories) ? meSeller.categories : [],
                sellerType: meSeller.sellerType || "Seller",
                status: meSeller.status || "pending",
                telegramConnected: Boolean(meSeller.telegramConnected),
                telegramUsername: meSeller.telegramUsername || null,
                telegramFirstName: meSeller.telegramFirstName || null,
                telegramLastName: meSeller.telegramLastName || null,
              });
              window.localStorage.setItem("seller_id", String(meSellerId));
              setLoadMessage("");
              setState("ready");
              return;
            }

            window.localStorage.removeItem("seller_token");
            window.localStorage.removeItem("seller_id");
          }
        }

        const response = await fetch(`${API_BASE_URL}/api/public/sellers/${encodeURIComponent(sellerId)}`, {
          cache: "no-store",
        });

        if (!response.ok) {
          const payload = await response.json().catch(() => null);
          setLoadMessage(payload?.error || "This seller dashboard could not be found or you do not have access to it.");
          setSeller(null);
          setState("missing");
          return;
        }

        const data = await response.json();
        const profile = data?.seller || data?.data?.seller || data?.profile || data?.data || null;
        if (!profile || String(profile.id || profile._id) !== String(sellerId)) {
          setLoadMessage(
            profile
              ? "This seller session does not match the dashboard ID in the address."
              : "The seller service did not return profile details for this ID."
          );
          setSeller(null);
          setState("missing");
          return;
        }
        setSeller({
          id: String(profile.id || sellerId),
          fullName: profile.fullName || "",
          businessName: profile.businessName || "",
          phone: profile.phone || "",
          email: profile.email || "",
          location: profile.location || "",
          categories: Array.isArray(profile.categories) ? profile.categories : [],
          sellerType: profile.sellerType || "Seller",
          status: profile.status || "pending",
          telegramConnected: Boolean(profile.telegramConnected),
          telegramUsername: profile.telegramUsername || null,
          telegramFirstName: profile.telegramFirstName || null,
          telegramLastName: profile.telegramLastName || null,
        });
        window.localStorage.setItem("seller_id", String(profile.id || sellerId));
        setLoadMessage("");
        setState("ready");
      } catch (cause) {
        setLoadMessage(
          cause instanceof Error ? `Could not connect to the seller service: ${cause.message}` : "Could not connect to the seller service."
        );
        setSeller(null);
        setState("missing");
      }
    };

    void loadSeller();
  }, [sellerId]);

  useEffect(() => {
    if (!sellerId) return;
    void refreshTelegramConnection();
  }, [sellerId]);

  useEffect(() => {
    if (!sellerId) return;
    let cancelled = false;

    const syncDashboard = async () => {
      const token = getSellerToken();
      if (!token) return;
      const headers = { Authorization: `Bearer ${token}` };
      const [listingResponse, sellerResponse] = await Promise.allSettled([
        fetch(`/api/listings?sellerId=${encodeURIComponent(sellerId)}&limit=100`, { cache: "no-store", headers }),
        fetch(`${API_BASE_URL}/api/sellers/auth/me`, { cache: "no-store", headers }),
      ]);
      if (cancelled) return;

      let listingRows: any[] = [];
      if (listingResponse.status === "fulfilled" && listingResponse.value.ok) {
        const payload = await listingResponse.value.json().catch(() => ({}));
        listingRows = records(payload);
        const normalized = listingRows.map(
          (row: any, index): ShopProduct => ({
            id: String(row.id || row._id || row.listingId || index),
            title: String(row.title || row.productName || "Untitled product"),
            price: numberFrom(row.price, row.product?.price),
            status: String(row.status || row.approvalStatus || "pending"),
            imageUrl: String(row.imageUrl || row.image || row.imageUrls?.[0] || row.images?.[0]?.url || ""),
            views: numberFrom(row.views, row.viewCount, row.viewsCount) ?? 0,
            orders: numberFrom(row.orders, row.orderCount, row.ordersCount) ?? 0,
            stock: numberFrom(row.stock, row.stockQuantity, row.quantity, row.inventory),
            description: String(row.description || ""),
            category: String(row.category || row.categoryName || ""),
          })
        );
        setProducts(normalized);
      }

      let backendSeller: any = {};
      if (sellerResponse.status === "fulfilled" && sellerResponse.value.ok) {
        const payload = await sellerResponse.value.json().catch(() => ({}));
        backendSeller = object(payload.seller || payload.data || payload);
      }
      const analytics = object(backendSeller.analytics || backendSeller.stats || backendSeller.metrics);
      const viewsFromSeller = numberFrom(
        analytics.shopViews,
        analytics.views,
        backendSeller.shopViews,
        backendSeller.viewCount,
        backendSeller.views
      );
      const viewsFromProducts = listingRows.reduce((sum, row) => sum + (numberFrom(row.views, row.viewCount, row.viewsCount) ?? 0), 0);
      setShopViews(viewsFromSeller ?? (listingRows.length ? viewsFromProducts : null));

      setOrderCount(null);
      setLastSynced(new Date());
    };

    void syncDashboard();
    const timer = window.setInterval(() => {
      if (document.visibilityState === "visible") void syncDashboard();
    }, 10000);
    const refreshOnFocus = () => {
      if (document.visibilityState === "visible") void syncDashboard();
    };
    window.addEventListener("focus", refreshOnFocus);
    return () => {
      cancelled = true;
      window.clearInterval(timer);
      window.removeEventListener("focus", refreshOnFocus);
    };
  }, [sellerId, refreshKey]);

  const refreshTelegramConnection = async () => {
    if (!sellerId) return;
    try {
      const payload = await pollTelegramConnect({ sellerId });
      if (!payload) {
        setTelegramConnection({ connected: false, userId: null, username: null, firstName: null, lastName: null });
        return;
      }
      const nextConnected = Boolean(payload.connected);
      const nextState = {
        connected: nextConnected,
        userId: payload.telegramUserId || null,
        username: payload.telegramUsername || null,
        firstName: payload.telegramFirstName || null,
        lastName: payload.telegramLastName || null,
      };
      setTelegramConnection(nextState);
      setSeller((current) =>
        current
          ? {
              ...current,
              telegramConnected: nextConnected,
              telegramUsername: nextState.username,
              telegramFirstName: nextState.firstName,
              telegramLastName: nextState.lastName,
            }
          : current
      );
    } catch {
      setTelegramConnection({ connected: false, userId: null, username: null, firstName: null, lastName: null });
    }
  };

  const refreshInbox = async () => {
    if (!sellerId) return;
    const token = getSellerToken();
    if (!token) return;
    setInboxLoading(true);
    setInboxError("");
    try {
      const response = await fetch(`${API_BASE_URL}/api/sellers/conversations?limit=20`, {
        cache: "no-store",
        headers: { Authorization: `Bearer ${token}` },
      });
      const payload = await response.json().catch(() => null);
      if (!response.ok) throw new Error(payload?.error || "Could not load buyer messages.");
      setInbox(Array.isArray(payload?.data) ? payload.data : []);
    } catch (error) {
      setInboxError(error instanceof Error ? error.message : "Could not load buyer messages.");
    } finally {
      setInboxLoading(false);
    }
  };

  const openInboxConversation = async (conversationId: string) => {
    const token = getSellerToken();
    if (!token || !conversationId) return;
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/sellers/conversations/${encodeURIComponent(conversationId)}/messages?limit=50`,
        { cache: "no-store", headers: { Authorization: `Bearer ${token}` } }
      );
      const payload = await response.json().catch(() => null);
      if (!response.ok) throw new Error(payload?.error || "Could not open this conversation.");
      setOpenConversation(payload?.conversation || { _id: conversationId });
      setConversationMessages(Array.isArray(payload?.messages) ? payload.messages : []);
      setReplyDraft("");
    } catch (error) {
      setInboxError(error instanceof Error ? error.message : "Could not open this conversation.");
    }
  };

  const sendSellerReply = async () => {
    const text = replyDraft.trim();
    const token = getSellerToken();
    if (!text || !openConversation?._id || !token || replySending) return;
    setReplySending(true);
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/sellers/conversations/${encodeURIComponent(String(openConversation._id))}/reply`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
          body: JSON.stringify({ text }),
        }
      );
      const payload = await response.json().catch(() => null);
      if (!response.ok) throw new Error(payload?.error || "Could not send your reply.");
      if (payload?.message) setConversationMessages((current) => [...current, payload.message]);
      setReplyDraft("");
      void refreshInbox();
    } catch (error) {
      setInboxError(error instanceof Error ? error.message : "Could not send your reply.");
    } finally {
      setReplySending(false);
    }
  };

  const connectTelegramChannel = async () => {
    if (!sellerId) {
      setNotice("This seller account is missing its dashboard ID.");
      return;
    }
    if (telegramConnection.connected) {
      setNotice("Telegram is already connected.");
      return;
    }

    setTelegramLinking(true);
    try {
      const link = await connectSellerTelegram({
        sellerId,
        email: seller?.email?.trim().toLowerCase() || undefined,
        token: getSellerToken(),
        nonce: createConnectNonce(),
      });

      setTelegramConnection({
        connected: Boolean(link.alreadyConnected),
        userId: null,
        username: null,
        firstName: null,
        lastName: null,
      });
      setNotice("✅ Telegram connected. You can now receive buyer notifications and reply from Telegram.");
      if (typeof window !== "undefined") {
        window.alert("Telegram connected. You will receive buyer notifications and can reply from Telegram.");
      }

      let attempts = 0;
      const timer = window.setInterval(async () => {
        attempts += 1;
        const status = await pollTelegramConnect({ sellerId });
        if (status?.connected) {
          window.clearInterval(timer);
          setTelegramConnection({
            connected: true,
            userId: status.telegramUserId || null,
            username: status.telegramUsername || null,
            firstName: status.telegramFirstName || null,
            lastName: status.telegramLastName || null,
          });
          setSeller((current) =>
            current ? { ...current, telegramConnected: true, telegramUsername: status.telegramUsername || null } : current
          );
          setNotice("Telegram connected. Buyer messages now arrive in your chat.");
        } else if (status?.status === "conflict" || status?.status === "expired" || attempts >= 40) {
          window.clearInterval(timer);
          if (status?.status === "conflict") setNotice(telegramStatusMessage(status));
        }
      }, 3000);
    } catch (error) {
      setNotice(error instanceof Error ? error.message : "Could not connect Telegram right now.");
    } finally {
      setTelegramLinking(false);
    }
  };

  const copyId = async () => {
    if (!seller) return;
    try {
      await navigator.clipboard.writeText(seller.id);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      // clipboard unavailable
    }
  };

  const flash = (message: string) => {
    setNotice(message);
    window.setTimeout(() => setNotice(""), 3500);
    setRefreshKey((k) => k + 1);
  };

  const goToAiListing = () => {
    window.location.assign(`${SHURI_LISTING_PATH}?sellerId=${encodeURIComponent(sellerId)}`);
  };

  const toggleEdit = (id: string) => {
    setEditingId((current) => (current === id ? null : id));
    window.setTimeout(() => document.getElementById("product-editor")?.scrollIntoView({ behavior: "smooth", block: "center" }), 120);
  };

  const selectTab = (tab: TabId) => {
    setActiveTab(tab);
    setMenuOpen(false);
  };

  // Load buyer messages whenever the Messages tab is opened.
  useEffect(() => {
    if (activeTab === "messages" && state === "ready") void refreshInbox();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab, state]);

  // Scroll to top on tab change so each section starts clean on mobile.
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [activeTab]);

  // Collapse the floating add button into a circle once the person scrolls.
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close the mobile menu if the window grows to desktop width.
  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth >= 640) setMenuOpen(false);
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  /* ───── Loading ───── */
  if (state === "loading") {
    return (
      <main className="k-root min-h-[100dvh] bg-[#F3F2F7] px-4 pt-20">
        <style>{CSS}</style>
        <div className="mx-auto max-w-6xl space-y-3">
          <div className="k-shimmer h-36 rounded-[28px]" />
          <div className="grid grid-cols-3 gap-2.5">
            {[0, 1, 2].map((i) => (
              <div key={i} className="k-shimmer h-24 rounded-3xl" />
            ))}
          </div>
          <div className="k-shimmer h-44 rounded-[28px]" />
        </div>
      </main>
    );
  }

  /* ───── Not found ───── */
  if (!seller) {
    return (
      <main className="k-root grid min-h-[100dvh] place-items-center bg-[#F3F2F7] px-4">
        <style>{CSS}</style>
        <div className="k-enter w-full max-w-sm rounded-[28px] bg-white p-6 text-center ring-1 ring-[#E9E6F1]">
          <div className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-[#ECE6FF] text-[#6B3DF5]">
            <Icon d={I.warn} />
          </div>
          <h1 className="mt-4 text-lg font-extrabold text-[#17141F]">Seller dashboard not found</h1>
          <p className="mt-1.5 break-words text-sm leading-relaxed text-slate-500">
            {loadMessage || "This seller dashboard could not be found or you do not have access to it."}
          </p>
          <div className="mt-5 flex flex-col gap-2">
            <button
              type="button"
              onClick={() => window.location.assign("/lister")}
              className="k-press inline-flex h-12 w-full items-center justify-center rounded-2xl bg-[#6B3DF5] text-sm font-bold text-white hover:bg-[#5B2FE0]"
            >
              Create seller account
            </button>
            <Link
              href={MARKETPLACE_HREF}
              className="k-press inline-flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-[#F3F2F7] text-sm font-bold text-slate-700 hover:bg-[#E9E6F1]"
            >
              <Icon d={I.marketplace} size={16} />
              Go to marketplace
            </Link>
          </div>
        </div>
      </main>
    );
  }

  /* ───── Derived ───── */
  const initials =
    seller.businessName.trim().split(/\s+/).slice(0, 2).map((w) => w[0]).join("").toUpperCase() || "S";
  const status = (seller.status || "pending").toLowerCase();
  const approved = status === "approved" || status === "active";
  const statusStyle = approved
    ? "bg-emerald-400/20 text-emerald-100"
    : status === "pending"
    ? "bg-amber-400/20 text-amber-100"
    : "bg-white/15 text-white/80";
  const dotStyle = approved ? "bg-emerald-400" : status === "pending" ? "bg-amber-400" : "bg-slate-300";

  const completeness = Math.round(
    (([seller.businessName, seller.fullName, seller.email, seller.phone, seller.location].filter((v) => v && v.trim()).length +
      (seller.categories.length ? 1 : 0)) /
      6) *
      100
  );

  const editingProduct = products.find((p) => p.id === editingId) ?? null;
  const renderEditor = (product: ShopProduct) => (
    <ProductQuickEdit
      key={product.id}
      product={product}
      onClose={() => setEditingId(null)}
      onSaved={flash}
      onUpdated={(patch) =>
        setProducts((prev) =>
          prev.map((p) =>
            p.id === product.id
              ? {
                  ...p,
                  ...(patch.title !== undefined ? { title: patch.title } : {}),
                  ...(patch.stock !== undefined ? { stock: patch.stock } : {}),
                  ...(patch.price !== undefined ? { price: patch.price } : {}),
                }
              : p
          )
        )
      }
      onReuse={() => {
        setEditingId(null);
        setSheet({
          type: "quick",
          template: {
            title: product.title,
            description: product.description,
            category: product.category,
            price: product.price === null ? "" : String(product.price),
          },
        });
      }}
    />
  );

  const telegramLabel = telegramConnection.connected
    ? telegramConnection.username
      ? `@${telegramConnection.username}`
      : telegramConnection.firstName
      ? `Connected as ${telegramConnection.firstName}`
      : "Connected"
    : "Not connected";

  const tabs: { id: TabId; label: string; d: string }[] = [
    { id: "overview", label: "Overview", d: I.home },
    { id: "products", label: "Products", d: I.box },
    { id: "orders", label: "Orders", d: I.bag },
    { id: "messages", label: "Messages", d: I.chat },
  ];

  const surface = "rounded-[28px] bg-white ring-1 ring-[#E9E6F1]";
  const shuriButton =
    "k-press inline-flex h-12 items-center justify-center gap-2 rounded-2xl bg-[#2B2C30] px-5 text-[15px] font-bold text-white hover:bg-[#3A3B41]";
  const recent = products.slice(0, 4);

  const productsEmpty = (
    <div className="px-5 py-10 text-center">
      <div className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-[#ECE6FF] text-[#6B3DF5]">
        <Icon d={I.box} />
      </div>
      <p className="mt-3 text-sm font-bold text-slate-800">No products yet</p>
      <p className="mx-auto mt-1 max-w-xs text-sm text-slate-500">List your first product easier and faster with Shuri AI, then track its approval here.</p>
      <button type="button" onClick={goToAiListing} className={`${shuriButton} mt-4 h-11`}>
        <Icon d={I.spark} size={16} />
        List with Shuri AI
      </button>
    </div>
  );

  return (
    <main className="k-root min-h-[100dvh] w-full overflow-x-clip bg-[#F3F2F7] pb-[calc(6.5rem+env(safe-area-inset-bottom))] text-[#17141F] antialiased sm:pb-12">
      <style>{CSS}</style>

      {/* ───── Top bar ───── */}
      <header className="sticky top-0 z-30 border-b border-[#E9E6F1] bg-[#F3F2F7]/85 pt-[env(safe-area-inset-top)] backdrop-blur-xl">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-3 px-4 sm:h-16 sm:px-6">
          <Link href="/" className="flex min-w-0 items-center gap-2" aria-label="Koombo seller home">
            <span
              className="inline-block shrink-0 bg-[#6B3DF5]"
              style={{
                WebkitMaskImage: "url(/logo.png)",
                maskImage: "url(/logo.png)",
                WebkitMaskRepeat: "no-repeat",
                maskRepeat: "no-repeat",
                WebkitMaskSize: "contain",
                maskSize: "contain",
                WebkitMaskPosition: "left center",
                maskPosition: "left center",
              }}
            >
              <img src="/logo.png" alt="Koombo" className="h-7 w-auto object-contain opacity-0 sm:h-9" />
            </span>
            <span className="rounded-full bg-[#ECE6FF] px-2.5 py-0.5 text-xs font-bold text-[#5B2FE0]">Seller</span>
          </Link>

          {/* Desktop / tablet tabs */}
          <nav
            className="relative hidden items-center rounded-full bg-white p-1 text-sm font-semibold ring-1 ring-[#E9E6F1] sm:flex"
            aria-label="Seller dashboard sections"
          >
            <span
              aria-hidden
              className="k-slide absolute inset-y-1 left-1 rounded-full bg-[#17141F] shadow-[0_6px_14px_-6px_rgba(23,20,31,.6)]"
              style={{
                width: "calc((100% - 0.5rem) / 4)",
                transform: `translateX(${tabs.findIndex((t) => t.id === activeTab) * 100}%)`,
              }}
            />
            {tabs.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                aria-current={activeTab === tab.id ? "page" : undefined}
                className={`relative z-10 w-24 rounded-full py-1.5 text-center transition-colors duration-300 ${
                  activeTab === tab.id ? "text-white" : "text-slate-600 hover:text-[#17141F]"
                }`}
              >
                {tab.label}
                {tab.id === "messages" && inbox.length > 0 && (
                  <i className="k-pop absolute right-2 top-1 h-2 w-2 rounded-full bg-[#6B3DF5] ring-2 ring-white" />
                )}
              </button>
            ))}
          </nav>

          <div className="flex shrink-0 items-center gap-2">
            <button
              type="button"
              onClick={() => setSheet({ type: "quick" })}
              className="k-press hidden h-10 items-center gap-1.5 rounded-full bg-[#6B3DF5] px-4 text-sm font-bold text-white hover:bg-[#5B2FE0] sm:inline-flex"
            >
              <Icon d={I.plus} size={15} />
              New listing
            </button>
            <span className="hidden h-10 w-10 place-items-center rounded-full bg-[#ECE6FF] text-sm font-bold text-[#5B2FE0] sm:grid">
              {seller.fullName.trim().charAt(0).toUpperCase() || "S"}
            </span>

            {/* Mobile hamburger: three lines morph into a close icon */}
            <button
              type="button"
              onClick={() => setMenuOpen((v) => !v)}
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              aria-expanded={menuOpen}
              aria-controls="seller-mobile-menu"
              className="k-press k-burger relative z-[60] h-11 w-11 rounded-2xl bg-white text-[#17141F] ring-1 ring-[#E9E6F1] sm:hidden"
              data-open={menuOpen}
            >
              <span />
              <span />
              <span />
              {!menuOpen && inbox.length > 0 && (
                <i className="k-pop absolute -right-0.5 -top-0.5 h-3 w-3 rounded-full bg-[#6B3DF5] ring-2 ring-[#F3F2F7]" />
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Page content. On mobile it steps back like a card stack while the menu is open. */}
      <div className="k-page mx-auto w-full max-w-6xl px-4 py-4 sm:px-6 sm:py-8" data-push={menuOpen}>
        {/* ───── Shop header ───── */}
        <section className="k-enter rounded-[28px] bg-[#5B2BB8] p-4 text-white sm:p-7" style={stagger(0)}>
          <div className="flex items-center gap-3.5 sm:gap-5">
            <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-white text-lg font-extrabold text-[#5B2BB8] min-[380px]:h-14 min-[380px]:w-14 min-[380px]:text-xl sm:h-[72px] sm:w-[72px] sm:rounded-3xl sm:text-2xl">
              {initials}
            </div>
            <div className="min-w-0 flex-1">
              <p className="break-words text-xs font-medium text-white/75 sm:text-sm">Welcome back, {seller.fullName.split(" ")[0] || "there"}</p>
              <h1 className="break-words text-xl font-extrabold leading-tight tracking-tight sm:text-4xl">{seller.businessName || "Your shop"}</h1>
              <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1.5">
                <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-bold capitalize ${statusStyle}`}>
                  <span className={`h-1.5 w-1.5 rounded-full ${dotStyle}`} />
                  {seller.status || "Pending"}
                </span>
                {seller.location && (
                  <span className="flex min-w-0 items-start gap-1 text-xs font-medium text-white/80">
                    <span className="mt-0.5"><Icon d={I.pin} size={12} /></span>
                    <span className="break-words">{seller.location}</span>
                  </span>
                )}
              </div>
            </div>
          </div>

          {completeness < 100 && (
            <div className="mt-4 rounded-2xl bg-white/10 p-3">
              <div className="flex items-center justify-between gap-3 text-xs font-semibold text-white/85">
                <span>Finish setting up your profile</span>
                <span className="shrink-0 text-white">{completeness}%</span>
              </div>
              <div className="mt-2 h-2 overflow-hidden rounded-full bg-white/20" role="progressbar" aria-label="Profile completeness" aria-valuenow={completeness} aria-valuemin={0} aria-valuemax={100}>
                <div className="k-grow h-full rounded-full bg-white" style={{ width: `${completeness}%` }} />
              </div>
            </div>
          )}

          {telegramConnection.connected && (
            <div className="mt-3 flex items-start gap-2 rounded-2xl bg-white/10 px-3 py-2.5 text-sm font-semibold text-emerald-100">
              <span className="k-pulse mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full bg-emerald-400" />
              Telegram connected. Buyer notifications arrive in real time.
            </div>
          )}
        </section>

        {/* ───── Stats ───── */}
        <section className="mt-3 grid grid-cols-3 gap-2.5 sm:mt-5 sm:gap-4" aria-label="Shop summary">
          <Stat i={1} label="Products" value={products.length} icon={I.box} tint="bg-[#ECE6FF] text-[#6B3DF5]" onClick={() => setActiveTab("products")} />
          <Stat i={2} label="Orders" value={orderCount} icon={I.bag} tint="bg-sky-100 text-sky-700" onClick={() => setActiveTab("orders")} />
          <Stat i={3} label="Shop views" value={shopViews} icon={I.eye} tint="bg-emerald-100 text-emerald-700" />
        </section>

        {/* Tab content, keyed so each switch plays a short directional transition */}
        <div key={activeTab} className={`${tabDir === "fwd" ? "k-tab-fwd" : "k-tab-back"} mt-3 space-y-3 sm:mt-5 sm:space-y-5`}>
          {/* ═════ OVERVIEW ═════ */}
          {activeTab === "overview" && (
            <>
              <section className="relative overflow-hidden rounded-[28px] bg-[#ECE6FF] p-5 sm:p-8" aria-label="List with Shuri AI">
                <div aria-hidden className="k-drift pointer-events-none absolute -right-10 -top-16 h-48 w-48 rounded-full bg-[#D9CCFF]" />
                <div className="relative flex items-center gap-6">
                  <div className="min-w-0 flex-1">
                    <span className="k-orb inline-grid h-11 w-11 place-items-center rounded-2xl bg-white text-[#6B3DF5]">
                      <Icon d={I.spark} size={22} />
                    </span>
                    <h2 className="mt-3 max-w-md text-xl font-extrabold leading-snug tracking-tight sm:text-3xl">
                      List your products easier and faster with Shuri AI
                    </h2>
                    <p className="mt-2 max-w-md text-sm leading-relaxed text-[#4A4360] sm:text-base">
                      Add photos and a short note. Review your listing, then publish.
                    </p>
                    <button type="button" onClick={goToAiListing} className={`${shuriButton} mt-4 w-full sm:w-auto`}>
                      <Icon d={I.spark} size={18} />
                      List with Shuri AI
                    </button>
                  </div>
                  <ShuriPreview />
                </div>
              </section>

              <button
                type="button"
                onClick={() => setActiveTab("products")}
                className={`k-press group flex w-full items-center gap-3.5 p-4 text-left sm:p-5 ${surface}`}
              >
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-[#F3F2F7] text-[#17141F] transition-transform duration-500 [transition-timing-function:cubic-bezier(.34,1.56,.64,1)] group-hover:scale-110">
                  <Icon d={I.box} size={22} />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-base font-bold">Update stock and prices</span>
                  <span className="block text-xs text-slate-500 sm:text-sm">Change existing products without relisting.</span>
                </span>
                <span className="text-slate-300"><Icon d={I.chevron} size={18} /></span>
              </button>

              <section className={`${surface} overflow-hidden`}>
                <SectionHead
                  title="Recent products"
                  action={products.length > recent.length ? { label: `See all ${products.length}`, onClick: () => setActiveTab("products") } : undefined}
                  synced={lastSynced}
                />
                {recent.length ? (
                  <ul className="divide-y divide-[#F0EEF6]">
                    {recent.map((product, index) => {
                      const meta = productMeta(product);
                      return (
                        <li key={product.id} className="k-enter" style={stagger(index)}>
                          <button
                            type="button"
                            onClick={() => {
                              setActiveTab("products");
                              toggleEdit(product.id);
                            }}
                            className="k-press flex min-h-[68px] w-full items-center gap-3 px-4 py-3 text-left hover:bg-[#FAF9FE] sm:px-6"
                          >
                            <Thumb url={product.imageUrl} size="h-12 w-12" />
                            <span className="min-w-0 flex-1">
                              <span className="block break-words text-sm font-bold">{product.title}</span>
                              <span className="mt-0.5 flex items-center gap-2 text-xs text-slate-500">
                                <span className="font-semibold text-[#5B2FE0]">{priceText(product.price)}</span>
                                <span className="break-words">{stockText(product.stock)}</span>
                              </span>
                            </span>
                            <span className={`shrink-0 rounded-full px-2.5 py-0.5 text-xs font-bold ${meta.tone}`}>{meta.label}</span>
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                ) : (
                  productsEmpty
                )}
              </section>

              <section className={`${surface} p-4 sm:p-6`}>
                <h2 className="text-base font-extrabold sm:text-lg">Shop details</h2>
                <dl className="mt-3 grid gap-3 sm:grid-cols-2">
                  <Row icon={I.shop} label="Business" value={seller.businessName} />
                  <Row icon={I.user} label="Owner" value={seller.fullName} />
                  <Row icon={I.mail} label="Email" value={seller.email} />
                  <Row icon={I.phone} label="Phone" value={seller.phone} />
                </dl>

                {seller.categories.length > 0 && (
                  <div className="mt-4 flex flex-wrap gap-1.5 border-t border-[#F0EEF6] pt-4">
                    {seller.categories.map((c) => (
                      <span key={c} className="max-w-full break-words rounded-full bg-[#ECE6FF] px-3 py-1 text-xs font-bold text-[#5B2FE0]">
                        {c}
                      </span>
                    ))}
                  </div>
                )}

                <div className="mt-4 flex items-center justify-between gap-3 rounded-2xl bg-[#F6F4FD] p-3">
                  <div className="min-w-0">
                    <p className="text-xs text-slate-500">Seller account ID</p>
                    <p className="break-all font-mono text-xs font-medium text-slate-800 sm:text-sm">{seller.id}</p>
                  </div>
                  <button
                    type="button"
                    onClick={copyId}
                    className={`k-press inline-flex h-10 shrink-0 items-center gap-1.5 rounded-xl px-3 text-xs font-bold transition-colors duration-300 ${
                      copied ? "bg-emerald-100 text-emerald-700" : "bg-white text-slate-700 ring-1 ring-[#E9E6F1] hover:bg-[#F3F2F7]"
                    }`}
                  >
                    <Icon d={copied ? I.check : I.copy} size={14} />
                    {copied ? "Copied" : "Copy"}
                  </button>
                </div>
              </section>
            </>
          )}

          {/* ═════ PRODUCTS ═════ */}
          {activeTab === "products" && (
            <>
              <section className="flex items-center gap-3 rounded-[28px] bg-[#ECE6FF] p-4">
                <span className="k-orb grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-white text-[#6B3DF5]">
                  <Icon d={I.spark} size={20} />
                </span>
                <p className="min-w-0 flex-1 text-sm font-semibold leading-snug text-[#3B3354]">List more products easier and faster with Shuri AI.</p>
                <button type="button" onClick={goToAiListing} className={`${shuriButton} h-10 shrink-0 px-4 text-sm`}>
                  List now
                </button>
              </section>

              <section id="products-panel" className={`${surface} overflow-hidden`}>
                <SectionHead title="Your products" synced={lastSynced} />
                {products.length ? (
                  <>
                    <ul className="grid grid-cols-2 gap-3 p-3 sm:grid-cols-3 sm:gap-4 sm:p-5 lg:grid-cols-4">
                      {products.map((product, index) => {
                        const meta = productMeta(product);
                        const open = editingId === product.id;
                        return (
                          <li
                            key={product.id}
                            className={`k-enter overflow-hidden rounded-3xl bg-white ring-1 transition-all duration-300 ${open ? "ring-2 ring-[#6B3DF5]" : "ring-[#E9E6F1]"}`}
                            style={stagger(Math.min(index, 8))}
                          >
                            <div className="relative aspect-square bg-[#F1EEFB]">
                              {product.imageUrl ? (
                                <img src={product.imageUrl} alt="" className="h-full w-full object-cover" loading="lazy" />
                              ) : (
                                <div className="grid h-full w-full place-items-center text-[#6B3DF5]/50"><Icon d={I.box} size={28} /></div>
                              )}
                              <span className={`absolute left-2 top-2 rounded-full px-2 py-0.5 text-xs font-bold ${meta.tone}`}>{meta.label}</span>
                            </div>
                            <div className="p-3">
                              <p className="break-words text-sm font-bold leading-snug">{product.title}</p>
                              <p className="mt-0.5 text-sm font-extrabold text-[#5B2FE0]">{priceText(product.price)}</p>
                              <p className="mt-0.5 break-words text-xs text-slate-500">{stockText(product.stock)}</p>
                              <p className="break-words text-xs text-slate-400">{product.views} views</p>
                              <button
                                type="button"
                                onClick={() => toggleEdit(product.id)}
                                aria-expanded={open}
                                className={`k-press mt-2.5 inline-flex h-10 w-full items-center justify-center rounded-xl text-xs font-bold transition-colors duration-300 ${
                                  open ? "bg-[#17141F] text-white" : "bg-[#F3F2F7] text-[#17141F] hover:bg-[#E9E6F1]"
                                }`}
                              >
                                {open ? "Close" : "Update"}
                              </button>
                            </div>
                          </li>
                        );
                      })}
                    </ul>
                    {editingProduct && (
                      <div id="product-editor" className="k-enter scroll-mt-24 px-3 pb-4 sm:px-5">
                        {renderEditor(editingProduct)}
                      </div>
                    )}
                  </>
                ) : (
                  productsEmpty
                )}
              </section>
            </>
          )}

          {/* ═════ ORDERS ═════ */}
          {activeTab === "orders" && (
            <section className={`${surface} overflow-hidden`}>
              <SectionHead title="Your orders" />
              {orders.length ? (
                <ul className="divide-y divide-[#F0EEF6]">
                  {orders.map((order) => (
                    <li key={order.id} className="flex items-center gap-3 px-4 py-3.5 sm:px-6">
                      <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-sky-100 text-sky-700"><Icon d={I.bag} size={18} /></span>
                      <div className="min-w-0 flex-1">
                        <p className="break-words text-sm font-bold">{order.product}</p>
                        <p className="break-words text-xs text-slate-500">{order.createdAt ? new Date(order.createdAt).toLocaleString() : `Order #${order.id}`}</p>
                      </div>
                      <div className="flex shrink-0 flex-col items-end gap-1">
                        {order.amount !== null && <span className="text-sm font-extrabold">GH₵{order.amount.toLocaleString()}</span>}
                        <span className="rounded-full bg-[#F3F2F7] px-2 py-0.5 text-xs font-bold capitalize text-slate-700">{order.status.replace(/[_-]/g, " ")}</span>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="px-5 py-10 text-center">
                  <div className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-sky-100 text-sky-700"><Icon d={I.bag} /></div>
                  <p className="mt-3 text-sm font-bold text-slate-800">Order tracking is coming soon</p>
                  <p className="mt-1 text-sm text-slate-500">Orders will show here once your shop starts receiving them.</p>
                </div>
              )}
            </section>
          )}

          {/* ═════ MESSAGES ═════ */}
          {activeTab === "messages" && (
            <>
              <section className="flex items-start gap-3.5 rounded-[28px] bg-[#E3F1FB] p-4 sm:p-5" aria-label="Real-time Telegram notifications">
                <span className="k-bolt relative grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-white text-sky-600">
                  <Icon d={I.bolt} size={20} />
                  <i className="k-pulse absolute -right-0.5 -top-0.5 h-3 w-3 rounded-full bg-emerald-500 ring-2 ring-[#E3F1FB]" />
                </span>
                <div className="min-w-0 flex-1">
                  <h2 className="text-base font-extrabold">Get buyer messages in real time</h2>
                  <p className="mt-1 text-sm leading-relaxed text-[#35506A]">
                    You will receive notifications in real time on Telegram. Connect once, and every new buyer message reaches your phone the moment it arrives.
                  </p>
                </div>
              </section>

              <section className={`${surface} p-4 sm:p-6`}>
                <div className="flex items-center gap-3">
                  <span className={`grid h-11 w-11 shrink-0 place-items-center rounded-2xl transition-colors duration-500 ${telegramConnection.connected ? "bg-emerald-100 text-emerald-700" : "bg-sky-100 text-sky-700"}`}>
                    <Icon d={I.send} size={20} />
                  </span>
                  <div className="min-w-0 flex-1">
                    <h2 className="text-base font-extrabold">Telegram</h2>
                    <p className="flex items-center gap-1.5 break-words text-xs text-slate-500">
                      <span className={`h-1.5 w-1.5 shrink-0 rounded-full ${telegramConnection.connected ? "bg-emerald-500" : "bg-slate-300"}`} />
                      <span className="break-words">{telegramLabel}</span>
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={connectTelegramChannel}
                    disabled={telegramLinking || telegramConnection.connected}
                    className={`k-press inline-flex h-11 shrink-0 items-center justify-center rounded-xl px-4 text-sm font-bold transition-colors duration-300 ${
                      telegramConnection.connected ? "bg-emerald-100 text-emerald-700" : "bg-[#6B3DF5] text-white hover:bg-[#5B2FE0] disabled:opacity-80"
                    }`}
                  >
                    {telegramLinking ? "Connecting…" : telegramConnection.connected ? "Connected" : "Connect"}
                  </button>
                </div>
                <p className="mt-3 text-xs leading-relaxed text-slate-500 sm:text-sm">
                  {telegramConnection.connected
                    ? "Buyer messages arrive in your Telegram chat. Reply there, or from the inbox below."
                    : "Press Connect, then press Start in the Telegram bot to get buyer messages there."}
                </p>
              </section>

              <section className={`${surface} overflow-hidden`}>
                <div className="flex items-center justify-between gap-3 border-b border-[#F0EEF6] px-4 py-3.5 sm:px-6">
                  <div className="min-w-0">
                    <h2 className="text-base font-extrabold">Buyer inbox</h2>
                    <p className="text-xs text-slate-500">
                      {inbox.length ? `${inbox.length} conversation${inbox.length === 1 ? "" : "s"}` : "No messages yet"}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => void refreshInbox()}
                    disabled={inboxLoading}
                    aria-label="Refresh inbox"
                    className="k-press grid h-10 w-10 place-items-center rounded-xl bg-[#F3F2F7] text-slate-700 hover:bg-[#E9E6F1]"
                  >
                    <span className={inboxLoading ? "k-spin" : ""}><Icon d={I.refresh} size={16} /></span>
                  </button>
                </div>

                {inboxError && (
                  <p role="alert" className="mx-4 mt-3 rounded-xl bg-rose-50 px-3 py-2 text-xs font-semibold text-rose-700 sm:mx-6">
                    {inboxError}
                  </p>
                )}

                {inbox.length ? (
                  <ul className="divide-y divide-[#F0EEF6]">
                    {inbox.map((item) => {
                      const conversationId = String(item.conversation?._id || "");
                      const last = item.lastMessage || {};
                      const active = openConversation && String(openConversation._id) === conversationId;
                      return (
                        <li key={conversationId}>
                          <button
                            type="button"
                            onClick={() => void openInboxConversation(conversationId)}
                            aria-expanded={Boolean(active)}
                            className={`k-press flex min-h-[68px] w-full items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-[#FAF9FE] sm:px-6 ${active ? "bg-[#F6F4FD]" : ""}`}
                          >
                            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-[#ECE6FF] text-sm font-bold text-[#5B2FE0]">
                              {(item.listingTitle || "K").slice(0, 1).toUpperCase()}
                            </span>
                            <span className="min-w-0 flex-1">
                              <span className="block break-words text-sm font-bold">{item.listingTitle || "Koombo product"}</span>
                              <span className="block break-words text-xs text-slate-500">
                                {last.senderType === "seller" ? "You: " : "Buyer: "}
                                {String(last.text || "Open conversation").slice(0, 90)}
                              </span>
                            </span>
                            <span className={`shrink-0 text-slate-300 transition-transform duration-300 ${active ? "rotate-90" : ""}`}>
                              <Icon d={I.chevron} size={16} />
                            </span>
                          </button>

                          {active && (
                            <div className="k-enter border-t border-[#F0EEF6] bg-[#FAF9FE] px-4 py-3 sm:px-6">
                              <div className="max-h-72 space-y-2 overflow-y-auto">
                                {conversationMessages.length ? (
                                  conversationMessages.map((message: any, index: number) => (
                                    <div key={`${message.createdAt || index}-${index}`} className={`flex ${message.senderType === "seller" ? "justify-end" : "justify-start"}`}>
                                      <div className={`k-bubble max-w-[85%] rounded-2xl px-3 py-2 text-sm ${message.senderType === "seller" ? "rounded-br-md bg-[#6B3DF5] text-white" : "rounded-bl-md bg-white text-slate-800 ring-1 ring-[#E9E6F1]"}`}>
                                        <p className="whitespace-pre-wrap break-words">{message.text}</p>
                                      </div>
                                    </div>
                                  ))
                                ) : (
                                  <p className="py-2 text-center text-xs text-slate-400">No messages in this conversation yet.</p>
                                )}
                              </div>
                              <div className="mt-2.5 flex gap-2">
                                <label className="sr-only" htmlFor={`seller-reply-${conversationId}`}>Reply to buyer</label>
                                <input
                                  id={`seller-reply-${conversationId}`}
                                  value={replyDraft}
                                  onChange={(event) => setReplyDraft(event.target.value)}
                                  onKeyDown={(event) => {
                                    if (event.key === "Enter") {
                                      event.preventDefault();
                                      void sendSellerReply();
                                    }
                                  }}
                                  placeholder="Write a reply…"
                                  className="h-11 min-w-0 flex-1 rounded-xl border border-[#E9E6F1] bg-white px-3 text-base outline-none transition-colors focus:border-[#6B3DF5] sm:text-sm"
                                />
                                <button
                                  type="button"
                                  onClick={() => void sendSellerReply()}
                                  disabled={replySending || !replyDraft.trim()}
                                  aria-label="Send reply"
                                  className="k-press grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-[#6B3DF5] text-white transition-opacity hover:bg-[#5B2FE0] disabled:opacity-40"
                                >
                                  <Icon d={I.send} size={16} />
                                </button>
                              </div>
                            </div>
                          )}
                        </li>
                      );
                    })}
                  </ul>
                ) : (
                  <div className="px-5 py-10 text-center">
                    <div className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-[#ECE6FF] text-[#6B3DF5]"><Icon d={I.chat} /></div>
                    <p className="mt-3 text-sm font-bold text-slate-800">No buyer messages yet</p>
                    <p className="mt-1 text-sm text-slate-500">New messages from buyers will appear here and arrive on Telegram in real time.</p>
                  </div>
                )}
              </section>
            </>
          )}
        </div>
      </div>

      {/* ───── Mobile menu drawer (hamburger) ───── */}
      <MobileDrawer
        open={menuOpen}
        onClose={() => setMenuOpen(false)}
        tabs={tabs}
        activeTab={activeTab}
        onChange={selectTab}
        unread={inbox.length}
        businessName={seller.businessName || "Your shop"}
        ownerName={seller.fullName}
        initials={initials}
        statusLabel={seller.status || "Pending"}
        statusDot={dotStyle}
        telegramLabel={telegramLabel}
        telegramConnected={telegramConnection.connected}
        shuriButton={shuriButton}
        onList={() => {
          setMenuOpen(false);
          goToAiListing();
        }}
        onAdd={() => {
          setMenuOpen(false);
          setSheet({ type: "quick" });
        }}
      />

      {/* ───── Mobile floating add button (pill that collapses to a circle on scroll) ───── */}
      <button
        type="button"
        onClick={() => setSheet({ type: "quick" })}
        aria-label="Add a product"
        className={`k-press k-fabbtn fixed bottom-[calc(1.25rem+env(safe-area-inset-bottom))] right-4 z-30 inline-flex h-14 items-center rounded-full bg-[#6B3DF5] px-[15px] text-white shadow-[0_14px_28px_-8px_rgba(107,61,245,.7)] sm:hidden ${
          menuOpen || activeTab === "messages" ? "k-fab-hide" : ""
        }`}
        data-collapsed={scrolled}
      >
        <Icon d={I.plus} size={26} stroke={2.4} />
        <span className="k-fab-label whitespace-nowrap text-sm font-bold">Add product</span>
      </button>

      {sheet?.type === "quick" && (
        <QuickAddSheet
          key={sheet.template?.title ?? "new"}
          sellerId={seller.id}
          categories={seller.categories}
          template={sheet.template}
          onClose={() => setSheet(null)}
          onSaved={flash}
        />
      )}

      {notice && (
        <div role="status" className="pointer-events-none fixed inset-x-0 bottom-[calc(5.5rem+env(safe-area-inset-bottom))] z-[60] flex justify-center px-4 sm:bottom-8">
          <p className="k-toast rounded-full bg-[#17141F] px-4 py-2.5 text-sm font-semibold text-white shadow-xl">{notice}</p>
        </div>
      )}
    </main>
  );
}

/* ───────────── Shuri AI preview (a listing that fills itself in) ───────────── */
function ShuriPreview() {
  return (
    <div aria-hidden className="k-float-soft hidden w-[200px] shrink-0 sm:block lg:w-[230px]">
      <div className="rounded-3xl bg-white p-3 shadow-[0_22px_44px_-20px_rgba(43,44,48,.4)]">
        <div className="grid aspect-[4/3] place-items-center rounded-2xl bg-[#E4DAFF] text-[#6B3DF5]">
          <Icon d={I.box} size={34} />
        </div>
        <div className="mt-3 space-y-2">
          <span className="k-type block h-2.5 w-4/5 rounded-full bg-slate-200" />
          <span className="k-type k-type-2 block h-2.5 w-3/5 rounded-full bg-slate-200" />
        </div>
        <div className="mt-3 flex items-center justify-between">
          <span className="text-sm font-extrabold">GH₵120</span>
          <span className="k-ready rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-bold text-emerald-700">Ready</span>
        </div>
      </div>
    </div>
  );
}

/* ───────────── Mobile drawer ───────────── */
function MobileDrawer({
  open,
  onClose,
  tabs,
  activeTab,
  onChange,
  unread,
  businessName,
  ownerName,
  initials,
  statusLabel,
  statusDot,
  telegramLabel,
  telegramConnected,
  shuriButton,
  onList,
  onAdd,
}: {
  open: boolean;
  onClose: () => void;
  tabs: { id: TabId; label: string; d: string }[];
  activeTab: TabId;
  onChange: (tab: TabId) => void;
  unread: number;
  businessName: string;
  ownerName: string;
  initials: string;
  statusLabel: string;
  statusDot: string;
  telegramLabel: string;
  telegramConnected: boolean;
  shuriButton: string;
  onList: () => void;
  onAdd: () => void;
}) {
  // `render` keeps the drawer mounted during its exit animation; `shown` drives the CSS transitions.
  const [render, setRender] = useState(open);
  const [shown, setShown] = useState(false);
  const [dragX, setDragX] = useState(0);
  const [dragging, setDragging] = useState(false);
  const startX = useRef<number | null>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open) {
      setRender(true);
      const raf = requestAnimationFrame(() => requestAnimationFrame(() => setShown(true)));
      return () => cancelAnimationFrame(raf);
    }
    setShown(false);
    const t = window.setTimeout(() => setRender(false), 450);
    return () => window.clearTimeout(t);
  }, [open]);

  // Lock page scroll while the menu is up, and close on Escape.
  useEffect(() => {
    if (!render) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", onKey);
    };
  }, [render, onClose]);

  useEffect(() => {
    if (shown) panelRef.current?.focus();
  }, [shown]);

  if (!render) return null;

  const activeIndex = Math.max(0, tabs.findIndex((t) => t.id === activeTab));
  const drag = Math.max(0, dragX);

  return (
    <div className="k-root fixed inset-0 z-50 sm:hidden" data-shown={shown}>
      <button
        type="button"
        aria-label="Close menu"
        tabIndex={-1}
        onClick={onClose}
        className="k-backdrop absolute inset-0 h-full w-full bg-[#17141F]/55 backdrop-blur-sm"
        style={{ opacity: shown ? Math.max(0, 1 - drag / 320) : 0 }}
      />

      <div
        id="seller-mobile-menu"
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label="Seller menu"
        tabIndex={-1}
        className="k-panel absolute inset-y-0 right-0 flex w-[min(86vw,340px)] flex-col overflow-y-auto rounded-l-[32px] bg-white pb-[calc(1rem+env(safe-area-inset-bottom))] pt-[calc(4.5rem+env(safe-area-inset-top))] shadow-[-24px_0_60px_-20px_rgba(23,20,31,.45)] outline-none"
        style={{
          transform: shown ? `translateX(${drag}px)` : "translateX(104%)",
          transition: dragging ? "none" : undefined,
        }}
        onTouchStart={(e) => {
          startX.current = e.touches[0].clientX;
          setDragging(true);
        }}
        onTouchMove={(e) => {
          if (startX.current === null) return;
          setDragX(e.touches[0].clientX - startX.current);
        }}
        onTouchEnd={() => {
          setDragging(false);
          if (dragX > 90) onClose();
          setDragX(0);
          startX.current = null;
        }}
      >
        {/* Seller card */}
        <div className="k-drawer-item mx-4 flex items-center gap-3 rounded-3xl bg-[#ECE6FF] p-3.5" style={stagger(0)}>
          <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-[#6B3DF5] text-base font-extrabold text-white">{initials}</span>
          <span className="min-w-0 flex-1">
            <span className="block break-words text-sm font-extrabold">{businessName}</span>
            <span className="mt-0.5 flex items-center gap-1.5 text-xs font-medium capitalize text-[#4A4360]">
              <span className={`h-1.5 w-1.5 rounded-full ${statusDot}`} />
              <span className="break-words">{statusLabel}{ownerName ? `, ${ownerName.split(" ")[0]}` : ""}</span>
            </span>
          </span>
        </div>

        {/* Navigation with a highlight that glides to the active item */}
        <nav aria-label="Seller dashboard sections" className="relative mx-3 mt-4">
          <span
            aria-hidden
            className="k-slide pointer-events-none absolute inset-x-0 top-0 h-[52px] rounded-2xl bg-[#17141F]"
            style={{ transform: `translateY(${activeIndex * 56}px)` }}
          />
          {tabs.map((tab, i) => {
            const active = tab.id === activeTab;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => onChange(tab.id)}
                aria-current={active ? "page" : undefined}
                style={{ ...stagger(i + 1), marginBottom: 4 }}
                className={`k-press k-drawer-item relative z-10 flex h-[52px] w-full items-center gap-3 rounded-2xl px-4 text-left text-[15px] font-bold transition-colors duration-300 ${
                  active ? "text-white" : "text-slate-600"
                }`}
              >
                <span className={`transition-transform duration-500 [transition-timing-function:cubic-bezier(.34,1.56,.64,1)] ${active ? "scale-110" : ""}`}>
                  <Icon d={tab.d} size={22} stroke={active ? 2.3 : 1.9} />
                </span>
                <span className="flex-1">{tab.label}</span>
                {tab.id === "messages" && unread > 0 && (
                  <span className="grid h-5 min-w-5 place-items-center rounded-full bg-[#6B3DF5] px-1.5 text-[11px] font-bold leading-none text-white">
                    {unread > 9 ? "9+" : unread}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        <div className="flex-1" />

        {/* Actions */}
        <div className="mx-4 mt-4 space-y-2.5">
          <div className="k-drawer-item flex items-center gap-2.5 rounded-2xl bg-[#F3F2F7] px-3.5 py-3 text-xs" style={stagger(5)}>
            <span className={`grid h-8 w-8 place-items-center rounded-xl ${telegramConnected ? "bg-emerald-100 text-emerald-700" : "bg-sky-100 text-sky-700"}`}>
              <Icon d={I.send} size={15} />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block font-bold text-slate-800">Telegram</span>
              <span className="block break-words text-slate-500">{telegramLabel}</span>
            </span>
          </div>

          <p className="k-drawer-item px-1 text-xs leading-relaxed text-slate-500" style={stagger(6)}>
            List your products easier and faster with Shuri AI.
          </p>

          <button type="button" onClick={onList} style={stagger(7)} className={`${shuriButton} k-drawer-item w-full`}>
            <Icon d={I.spark} size={18} />
            List with Shuri AI
          </button>

          <button
            type="button"
            onClick={onAdd}
            style={stagger(8)}
            className="k-press k-drawer-item flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-[#ECE6FF] text-sm font-bold text-[#5B2FE0]"
          >
            <Icon d={I.plus} size={16} />
            Quick add product
          </button>

          <Link
            href={MARKETPLACE_HREF}
            style={stagger(9)}
            className="k-press k-drawer-item flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-[#F3F2F7] text-sm font-bold text-slate-700"
          >
            <Icon d={I.marketplace} size={16} />
            Go to marketplace
          </Link>
        </div>
      </div>
    </div>
  );
}

/* ───────────── Small components ───────────── */
function Icon({ d, size = 20, stroke = 2 }: { d: string; size?: number; stroke?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round" aria-hidden className="shrink-0">
      <path d={d} />
    </svg>
  );
}

function Thumb({ url, size }: { url: string; size: string }) {
  return url ? (
    <img src={url} alt="" loading="lazy" className={`${size} shrink-0 rounded-2xl bg-slate-100 object-cover`} />
  ) : (
    <div className={`${size} grid shrink-0 place-items-center rounded-2xl bg-[#F1EEFB] text-[#6B3DF5]/70`}>
      <Icon d={I.box} size={20} />
    </div>
  );
}

function SectionHead({
  title,
  action,
  synced,
}: {
  title: string;
  action?: { label: string; onClick: () => void };
  synced?: Date | null;
}) {
  return (
    <div className="flex items-center justify-between gap-3 border-b border-[#F0EEF6] px-4 py-3.5 sm:px-6 sm:py-4">
      <div className="flex min-w-0 flex-wrap items-center gap-x-2.5 gap-y-1">
        <h2 className="break-words text-base font-extrabold tracking-tight sm:text-lg">{title}</h2>
        {synced !== undefined && (
          <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-bold text-emerald-700">
            <span className="k-pulse h-1.5 w-1.5 rounded-full bg-emerald-500" />
            {synced ? synced.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : "Live"}
          </span>
        )}
      </div>
      {action && (
        <button type="button" onClick={action.onClick} className="k-press shrink-0 px-1 py-2 text-xs font-bold text-[#5B2FE0] hover:text-[#17141F] sm:text-sm">
          {action.label}
        </button>
      )}
    </div>
  );
}

/** Counts up from the previous value so numbers feel alive when they change. */
function CountUp({ value }: { value: number | null }) {
  const [shown, setShown] = useState(0);
  const from = useRef(0);
  useEffect(() => {
    if (value === null) return;
    const start = performance.now();
    const origin = from.current;
    let raf = 0;
    const tick = (now: number) => {
      const p = Math.min(1, (now - start) / 800);
      const eased = 1 - Math.pow(1 - p, 3);
      const next = Math.round(origin + (value - origin) * eased);
      setShown(next);
      from.current = next;
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [value]);
  return <>{value === null ? "—" : shown.toLocaleString()}</>;
}

function Stat({
  label,
  value,
  icon,
  tint,
  i,
  onClick,
}: {
  label: string;
  value: number | null;
  icon: string;
  tint: string;
  i: number;
  onClick?: () => void;
}): ReactNode {
  const body = (
    <>
      <span className={`grid h-9 w-9 place-items-center rounded-xl sm:h-11 sm:w-11 sm:rounded-2xl ${tint}`}>
        <Icon d={icon} size={18} />
      </span>
      <p className="mt-2.5 break-words text-xl font-extrabold tracking-tight min-[380px]:text-2xl sm:mt-4 sm:text-4xl">
        <CountUp value={value} />
      </p>
      <p className="break-words text-xs font-semibold leading-tight text-slate-500 sm:text-sm">{label}</p>
    </>
  );
  const cls = "k-enter block w-full min-w-0 rounded-3xl bg-white p-3.5 text-left ring-1 ring-[#E9E6F1] sm:p-5";
  return onClick ? (
    <button type="button" onClick={onClick} className={`${cls} k-press`} style={stagger(i)}>
      {body}
    </button>
  ) : (
    <div className={cls} style={stagger(i)}>
      {body}
    </div>
  );
}

function Row({ icon, label, value }: { icon: string; label: string; value: string }) {
  return (
    <div className="flex items-center gap-3">
      <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-[#F3F2F7] text-slate-500">
        <Icon d={icon} size={16} />
      </span>
      <div className="min-w-0">
        <dt className="text-xs text-slate-500">{label}</dt>
        <dd className="break-words text-sm font-bold">{value || "Not provided"}</dd>
      </div>
    </div>
  );
}

/* ───────────── Motion ─────────────
   One spring easing is used everywhere so the page moves like a single
   Figma prototype. Smart-animate moments: the hamburger morphs into an X,
   the nav highlight glides between items, the page steps back behind the
   drawer, and the Shuri AI preview fills itself in. The page-load entrance
   plays once; after that, motion only answers what the person does. */
const CSS = `
@font-face {
  font-family: 'Lufga';
  src: local('Lufga'), local('Lufga-Regular'), local('Lufga Regular');
  font-weight: 400;
  font-style: normal;
  font-display: swap;
}
@font-face {
  font-family: 'Lufga';
  src: local('Lufga Medium'), local('Lufga-Medium');
  font-weight: 500;
  font-style: normal;
  font-display: swap;
}
@font-face {
  font-family: 'Lufga';
  src: local('Lufga SemiBold'), local('Lufga-SemiBold');
  font-weight: 600;
  font-style: normal;
  font-display: swap;
}
@font-face {
  font-family: 'Lufga';
  src: local('Lufga Bold'), local('Lufga-Bold');
  font-weight: 700;
  font-style: normal;
  font-display: swap;
}

.k-root { -webkit-text-size-adjust: 100%; text-size-adjust: 100%; font-family: 'Lufga', 'Inter', ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif; letter-spacing: -0.01em; }
:root { --spring: cubic-bezier(.34,1.4,.64,1); --smooth: cubic-bezier(.22,1,.36,1); --drawer: cubic-bezier(.32,.72,0,1); }

@keyframes k-enter { from { opacity: 0; transform: translateY(14px) scale(.98); } to { opacity: 1; transform: none; } }
@keyframes k-tab-fwd { from { opacity: 0; transform: translateX(24px); } to { opacity: 1; transform: none; } }
@keyframes k-tab-back { from { opacity: 0; transform: translateX(-24px); } to { opacity: 1; transform: none; } }
@keyframes k-pulse { 0% { box-shadow: 0 0 0 0 rgba(16,185,129,.55); } 70%,100% { box-shadow: 0 0 0 6px rgba(16,185,129,0); } }
@keyframes k-spin { to { transform: rotate(360deg); } }
@keyframes k-toast { from { opacity: 0; transform: translateY(14px) scale(.92); } to { opacity: 1; transform: none; } }
@keyframes k-shimmer { from { background-position: 200% 0; } to { background-position: -200% 0; } }
@keyframes k-grow { from { transform: scaleX(0); } to { transform: scaleX(1); } }
@keyframes k-pop { 0% { transform: scale(0); } 70% { transform: scale(1.25); } 100% { transform: scale(1); } }
@keyframes k-bubble { from { opacity: 0; transform: translateY(8px) scale(.94); } to { opacity: 1; transform: none; } }
@keyframes k-drift { 0%,100% { transform: translate3d(0,0,0) scale(1); } 50% { transform: translate3d(-12px,10px,0) scale(1.06); } }
@keyframes k-float-soft { 0%,100% { transform: translateY(0) rotate(1.5deg); } 50% { transform: translateY(-8px) rotate(-1deg); } }
@keyframes k-orb { 0% { box-shadow: 0 0 0 0 rgba(107,61,245,.35); } 70%,100% { box-shadow: 0 0 0 12px rgba(107,61,245,0); } }
@keyframes k-type { 0% { transform: scaleX(0); } 25%,85% { transform: scaleX(1); } 100% { transform: scaleX(0); } }
@keyframes k-ready { 0%,45% { opacity: 0; transform: scale(.6); } 60% { opacity: 1; transform: scale(1.12); } 70%,88% { opacity: 1; transform: scale(1); } 100% { opacity: 0; transform: scale(.6); } }
@keyframes k-bolt { 0%,100% { transform: rotate(0); } 15% { transform: rotate(-12deg) scale(1.08); } 30% { transform: rotate(10deg) scale(1.08); } 45% { transform: rotate(0); } }

.k-enter { animation: k-enter .6s var(--smooth) both; animation-delay: calc(var(--i, 0) * 80ms); }
.k-tab-fwd { animation: k-tab-fwd .4s var(--smooth) both; }
.k-tab-back { animation: k-tab-back .4s var(--smooth) both; }
.k-pulse { animation: k-pulse 1.8s ease-out infinite; }
.k-spin { display: inline-block; animation: k-spin .8s linear infinite; }
.k-toast { animation: k-toast .4s var(--spring) both; }
.k-grow { transform-origin: left; animation: k-grow .9s var(--smooth) both .2s; }
.k-pop { animation: k-pop .45s var(--spring) both; }
.k-bubble { animation: k-bubble .35s var(--spring) both; }
.k-drift { animation: k-drift 12s ease-in-out infinite; }
.k-float-soft { animation: k-float-soft 7s ease-in-out infinite; }
.k-orb { animation: k-orb 2.4s ease-out infinite; }
.k-type { transform-origin: left; animation: k-type 5s var(--smooth) infinite; }
.k-type-2 { animation-delay: .35s; }
.k-ready { animation: k-ready 5s var(--spring) infinite; }
.k-bolt { animation: k-bolt 2.8s ease-in-out infinite; }
.k-slide { transition: transform .55s var(--spring); }
.k-press { transition: transform .25s var(--spring), background-color .25s ease, opacity .25s ease; -webkit-tap-highlight-color: transparent; touch-action: manipulation; }
.k-press:active { transform: scale(.94); }
.k-shimmer {
  background: linear-gradient(100deg, #e9e6f1 30%, #f7f5fc 50%, #e9e6f1 70%);
  background-size: 200% 100%;
  animation: k-shimmer 1.4s linear infinite;
}

/* Hamburger: three lines morph into a close icon */
.k-burger span {
  position: absolute; left: 12px; right: 12px; height: 2px; border-radius: 2px; background: currentColor;
  transition: transform .5s var(--spring), opacity .25s ease, left .4s var(--smooth), right .4s var(--smooth);
}
.k-burger span:nth-child(1) { top: 15px; }
.k-burger span:nth-child(2) { top: 21px; right: 18px; }
.k-burger span:nth-child(3) { top: 27px; left: 18px; }
.k-burger[data-open="true"] span:nth-child(1) { transform: translateY(6px) rotate(45deg); }
.k-burger[data-open="true"] span:nth-child(2) { opacity: 0; transform: translateX(-10px) scaleX(.2); }
.k-burger[data-open="true"] span:nth-child(3) { left: 12px; transform: translateY(-6px) rotate(-45deg); }

/* Drawer: slides in with an iOS-style curve, items cascade in */
.k-panel { transition: transform .5s var(--drawer); will-change: transform; overscroll-behavior: contain; }
.k-backdrop { transition: opacity .4s ease; }
.k-drawer-item { opacity: 0; transform: translateX(26px); transition: opacity .35s ease, transform .5s var(--spring), background-color .3s ease, color .3s ease; }
[data-shown="true"] .k-drawer-item { opacity: 1; transform: none; transition-delay: calc(110ms + var(--i, 0) * 45ms), calc(110ms + var(--i, 0) * 45ms), 0s, 0s; }
.k-drawer-item.k-press:active { transform: scale(.96); transition-delay: 0s; }

/* Page steps back behind the drawer (mobile only) */
.k-page { transition: transform .5s var(--drawer), opacity .4s ease, filter .4s ease; transform-origin: 20% 40%; }
.k-page[data-push="true"] { transform: scale(.95) translateX(-14px); opacity: .55; filter: blur(1.5px); }
@media (min-width: 640px) { .k-page[data-push="true"] { transform: none; opacity: 1; filter: none; } }

/* Floating add button: pill that collapses to a circle on scroll */
.k-fabbtn { transition: transform .5s var(--spring), opacity .3s ease, background-color .25s ease; animation: k-pop .6s var(--spring) both .3s; }
.k-fab-label { max-width: 120px; margin-left: 8px; opacity: 1; overflow: hidden; transition: max-width .45s var(--spring), margin .45s var(--spring), opacity .25s ease; }
.k-fabbtn[data-collapsed="true"] .k-fab-label { max-width: 0; margin-left: 0; opacity: 0; }
.k-fabbtn.k-fab-hide { transform: translateY(120px) scale(.6); opacity: 0; pointer-events: none; }

/* App-like touch behaviour */
html { overscroll-behavior-y: none; }
@media (max-width: 639px) {
  button, a { -webkit-user-select: none; user-select: none; }
}

@media (prefers-reduced-motion: reduce) {
  .k-enter, .k-tab-fwd, .k-tab-back, .k-pulse, .k-spin, .k-toast, .k-grow, .k-pop, .k-bubble, .k-shimmer, .k-fabbtn,
  .k-drift, .k-float-soft, .k-orb, .k-type, .k-ready, .k-bolt { animation: none !important; }
  .k-type { transform: none; }
  .k-ready { opacity: 1; }
  .k-slide, .k-press, .k-panel, .k-backdrop, .k-page, .k-burger span, .k-fab-label, .k-drawer-item { transition: none !important; }
  .k-drawer-item { opacity: 1; transform: none; }
}
`;
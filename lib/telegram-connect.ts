/**
 * Telegram connection helpers shared by the signup wizard and the seller
 * dashboard.
 *
 * The flow is always the same three steps:
 *   1. Ask the backend for a single-use deep link (POST /api/sellers/telegram/connect).
 *   2. Open the link in Telegram — the seller presses Start.
 *   3. Poll for the connection (by nonce during signup, by seller id afterwards).
 *
 * Keeping it in one module means the wizard and the dashboard cannot drift
 * apart, and a failure shows the seller a specific, actionable message.
 */

export const API_BASE_URL = (
  process.env.NEXT_PUBLIC_API_BASE ||
  process.env.NEXT_PUBLIC_API_URL ||
  process.env.NEXT_PUBLIC_BACKEND_URL ||
  (process.env.NODE_ENV === "development"
    ? "http://localhost:5000"
    : "https://unimart-backend-2.onrender.com")
)
  .trim()
  .replace(/\/+$/, "")
  .replace(/\/api$/i, "");

export type TelegramConnectStatus = {
  connected: boolean;
  status: "pending" | "connected" | "conflict" | "expired";
  sellerId?: string | null;
  telegramUsername?: string | null;
  telegramFirstName?: string | null;
  telegramLastName?: string | null;
  telegramUserId?: string | null;
  botUsername?: string | null;
};

export type TelegramConnectLink = {
  telegramLink: string;
  expiresAt?: string;
  nonce?: string | null;
  botUsername?: string | null;
  alreadyConnected?: boolean;
};

/** A short, unguessable nonce used only to poll the onboarding step. */
export function createConnectNonce(): string {
  const cryptoObject = typeof window !== "undefined" ? window.crypto : undefined;
  if (cryptoObject?.getRandomValues) {
    const bytes = new Uint8Array(16);
    cryptoObject.getRandomValues(bytes);
    return Array.from(bytes, (byte) => byte.toString(16).padStart(2, "0")).join("");
  }
  return `n${Date.now().toString(36)}${Math.random().toString(36).slice(2, 12)}`;
}

export async function fetchTelegramConfig(): Promise<{ botUsername: string | null }> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/sellers/telegram/config`, {
      cache: "no-store",
    });
    if (!response.ok) return { botUsername: null };
    const data = await response.json().catch(() => null);
    return { botUsername: data?.botUsername || null };
  } catch {
    return { botUsername: null };
  }
}

export async function connectSellerTelegram(options: {
  sellerId?: string | null;
  email?: string | null;
  token?: string | null;
  nonce?: string | null;
}): Promise<TelegramConnectLink> {
  const response = await fetch(`${API_BASE_URL}/api/sellers/telegram/connect`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(options.token ? { Authorization: `Bearer ${options.token}` } : {}),
    },
    body: JSON.stringify({
      sellerId: options.sellerId || undefined,
      email: options.email || undefined,
      nonce: options.nonce || undefined,
    }),
  });

  const data = await response.json().catch(() => null);
  if (!response.ok || !data?.success) {
    throw new Error(
      data?.error ||
        data?.message ||
        "Could not start the Telegram connection. Please try again."
    );
  }
  if (!data.telegramLink) {
    throw new Error("The backend did not return a Telegram link. Try again in a moment.");
  }
  return data as TelegramConnectLink;
}

export async function pollTelegramConnect(options: {
  nonce?: string | null;
  sellerId?: string | null;
}): Promise<TelegramConnectStatus | null> {
  const query = new URLSearchParams();
  if (options.nonce) query.set("nonce", options.nonce);
  else if (options.sellerId) query.set("sellerId", options.sellerId);
  else return null;

  try {
    const response = await fetch(
      `${API_BASE_URL}/api/sellers/telegram/status?${query.toString()}`,
      { cache: "no-store" }
    );
    if (!response.ok) return null;
    const data = await response.json().catch(() => null);
    if (!data?.success) return null;
    return data as TelegramConnectStatus;
  } catch {
    return null;
  }
}

/**
 * Opens the Telegram deep link. Mobile browsers honour tg://, desktop browsers
 * fall back to https://t.me/… so the seller can still press Start.
 */
export function openTelegramDeepLink(telegramLink: string) {
  if (typeof window === "undefined") return;
  const url = new URL(telegramLink);
  const startParam = url.searchParams.get("start") || "";
  const handle = String(url.pathname || "").replace(/^\/+/, "");
  const deepLink =
    handle && startParam
      ? `tg://resolve?domain=${handle}&start=${encodeURIComponent(startParam)}`
      : telegramLink;

  const popup = window.open(deepLink, "_blank", "noopener,noreferrer");
  if (popup) return;

  try {
    window.location.href = deepLink;
  } catch {
    window.setTimeout(() => {
      window.open(telegramLink, "_blank", "noopener,noreferrer");
    }, 600);
  }
}

export function telegramConnectedLabel(status: TelegramConnectStatus | null): string {
  if (!status?.connected) return "";
  if (status.telegramUsername) return `Connected as @${status.telegramUsername}`;
  const name = [status.telegramFirstName, status.telegramLastName]
    .filter(Boolean)
    .join(" ")
    .trim();
  return name ? `Connected as ${name}` : "Telegram connected";
}

export function telegramStatusMessage(status: TelegramConnectStatus | null): string {
  switch (status?.status) {
    case "conflict":
      return "That Telegram account is already connected to a different Koombo store. Sign in to that store, disconnect Telegram there, then try again.";
    case "expired":
      return "That Telegram link expired. Press Connect Telegram again to get a fresh one.";
    default:
      return "";
  }
}

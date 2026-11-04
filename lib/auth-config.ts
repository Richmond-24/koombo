/** Public authentication settings safe to read in browser bundles. */
export const GOOGLE_CLIENT_ID = (process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || "").trim();

/** Resolve the public backend origin used by browser-side authentication requests. */
export function getApiBaseUrl(): string {
  const configured =
    process.env.NEXT_PUBLIC_API_BASE ||
    process.env.NEXT_PUBLIC_API_URL ||
    process.env.NEXT_PUBLIC_BACKEND_URL;
  const fallback = process.env.NODE_ENV === "development"
    ? "http://localhost:5000"
    : "https://unimart-backend-2.onrender.com";

  return (configured || fallback).trim().replace(/\/+$/, "").replace(/\/api$/i, "");
}

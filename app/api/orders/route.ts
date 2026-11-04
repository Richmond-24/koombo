import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL = (
  process.env.BACKEND_URL ||
  process.env.NEXT_PUBLIC_API_BASE ||
  process.env.NEXT_PUBLIC_API_URL ||
  process.env.NEXT_PUBLIC_BACKEND_URL ||
  (process.env.NODE_ENV === "development" ? "http://localhost:5000" : "https://unimart-backend-2.onrender.com")
).replace(/\/+$/, "").replace(/\/api$/i, "");

export async function GET(req: NextRequest) {
  const incoming = new URL(req.url);
  const target = new URL(`${BACKEND_URL}/api/orders`);
  incoming.searchParams.forEach((value, key) => target.searchParams.set(key, value));

  try {
    const response = await fetch(target, { cache: "no-store", signal: AbortSignal.timeout(10000) });
    const result = await response.json().catch(() => ({}));
    return NextResponse.json(result, { status: response.status });
  } catch (error) {
    console.error("Could not fetch orders from backend", error);
    return NextResponse.json({ success: false, error: "Order activity is temporarily unavailable." }, { status: 503 });
  }
}

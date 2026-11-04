import { NextRequest, NextResponse } from 'next/server';

/** Move seller dashboard traffic onto the separately deployed seller origin. */
export function proxy(request: NextRequest) {
  const sellerOrigin = process.env.NEXT_PUBLIC_SELLER_APP_URL?.trim();
  if (!sellerOrigin || !request.nextUrl.pathname.startsWith('/sellers/')) {
    return NextResponse.next();
  }

  let sellerHost: string;
  try {
    sellerHost = new URL(sellerOrigin).host.toLowerCase();
  } catch {
    return NextResponse.next();
  }

  if (request.nextUrl.host.toLowerCase() === sellerHost) {
    return NextResponse.next();
  }

  const destination = new URL(request.nextUrl.pathname + request.nextUrl.search, sellerOrigin);
  return NextResponse.redirect(destination, 308);
}

export const config = {
  matcher: ['/sellers/:path*'],
};

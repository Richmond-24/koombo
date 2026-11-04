/**
 * Public origin for the seller dashboard, for example https://seller.koombo.com.
 * Leave unset to keep seller pages on the current host during local development.
 */
export function getSellerAppUrl(path: string): string {
  const configuredOrigin = process.env.NEXT_PUBLIC_SELLER_APP_URL?.trim();
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;

  if (!configuredOrigin) return normalizedPath;

  try {
    return new URL(normalizedPath, configuredOrigin).toString();
  } catch {
    return normalizedPath;
  }
}

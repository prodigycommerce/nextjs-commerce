const LOCAL_FALLBACK = 'http://localhost:3001';

export function getBaseUrl() {
  if (process.env.NEXT_PUBLIC_VERCEL_ENV === 'production') {
    return `https://${process.env.NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL}`;
  }

  return process.env.NEXT_PUBLIC_VERCEL_URL
    ? `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`
    : LOCAL_FALLBACK;
}

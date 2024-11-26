import { getBaseUrl } from 'lib/getBaseUrl';
import { ensureStartsWith } from './utils';
import { deserializeJSONApi, isJSONApiDocument, ParsedJSONApiData } from './utils/json-api';

const apiDomain = process.env.PRODIGY_API_DOMAIN!;
const clientDomain = process.env.PRODIGY_CLIENT_DOMAIN!;
export const apiKey = process.env.PRODIGY_STORE_TOKEN!;
const redirectUrl = getBaseUrl();

export function makeApiFullUrl(path: string) {
  if (path.startsWith('https://') || path.startsWith('http://')) {
    return path;
  }

  return `${apiDomain}${ensureStartsWith(path, '/')}`;
}

export function makeCheckoutUrl(orderId: string, orderToken: string) {
  return `${clientDomain}/orders/${orderId}/checkout/login?token=${orderToken}&plugin_redirect_url=${redirectUrl}`;
}

export async function prodigyFetch<T>({
  cache = 'force-cache',
  headers,
  endpoint,
  method,
  params,
  tags
}: {
  cache?: RequestCache;
  headers?: HeadersInit;
  endpoint: string;
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'UPDATE' | 'DELETE';
  params?: any;
  tags?: string[];
}): Promise<ParsedJSONApiData | never> {
  const isGet = method === 'GET';
  const url = new URL(makeApiFullUrl(endpoint));
  if (isGet && params) {
    const searchParams = Object.fromEntries(
      Object.entries(params).filter(([name, value]) => value !== undefined)
    ) as Record<string, string>;
    url.search = new URLSearchParams(searchParams).toString();
  }

  const result = await fetch(url, {
    method,
    headers: {
      'Content-Type': 'application/json',
      'X-Authorization': apiKey,
      ...headers
    },
    body: params && !isGet ? JSON.stringify(params) : undefined,
    cache,
    ...(tags && { next: { tags } })
  });

  if (result.status >= 200 && result.status < 300) {
    if (!result.body) {
      return {};
    }
    const body = await result.json();

    if (isJSONApiDocument(body)) {
      const parsed = deserializeJSONApi(body);
      return parsed;
    } else {
      return body;
    }
  } else if (result.status === 404) {
    return {};
  } else {
    throw new Error('Error calling Prodigy API');
  }
}

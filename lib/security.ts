export function normalizeEmail(value: unknown): string {
  if (typeof value !== 'string') return '';
  return value.trim().toLowerCase();
}

export function sanitizeText(value: unknown, maxLength = 200): string {
  if (typeof value !== 'string') return '';

  const cleaned = value
    .replace(/[<>/]/g, '')
    .replace(/[\r\n]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  if (!cleaned) return '';
  return cleaned.slice(0, maxLength);
}

export function isValidEmail(value: unknown): boolean {
  if (typeof value !== 'string') return false;
  return /^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(value.trim());
}

export function getClientIdentifier(request: { headers: Headers | Record<string, string | undefined> }): string {
  const headers = request.headers instanceof Headers ? request.headers : new Headers();
  const plainHeaders = request.headers && typeof request.headers === 'object' && !(request.headers instanceof Headers)
    ? (request.headers as Record<string, string | undefined>)
    : undefined;

  const forwarded = headers.get('x-forwarded-for') ?? plainHeaders?.['x-forwarded-for'];
  const realIp = headers.get('x-real-ip') ?? plainHeaders?.['x-real-ip'];

  return (forwarded?.split(',')[0]?.trim() || realIp || 'unknown').slice(0, 255) || 'unknown';
}

export function createRateLimiter({ windowMs, maxRequests }: { windowMs: number; maxRequests: number }) {
  const store = new Map<string, { count: number; resetAt: number }>();

  return (identifier: string, action: string): boolean => {
    const key = `${action}:${identifier}`;
    const now = Date.now();
    const current = store.get(key);

    if (!current || now >= current.resetAt) {
      store.set(key, { count: 1, resetAt: now + windowMs });
      return true;
    }

    if (current.count >= maxRequests) {
      return false;
    }

    current.count += 1;
    return true;
  };
}

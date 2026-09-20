import test from 'node:test';
import assert from 'node:assert/strict';
import { createRateLimiter, normalizeEmail, sanitizeText } from '../lib/security';

test('normalizes and sanitizes email and user input', () => {
  assert.equal(normalizeEmail('  USER+tag@Example.com  '), 'user+tag@example.com');
  assert.equal(sanitizeText('  Bob   Smith  ', 20), 'Bob Smith');
  assert.equal(sanitizeText('<script>alert(1)</script>', 20), 'scriptalert(1)script');
});

test('rate limiter enforces request quotas', () => {
  const limiter = createRateLimiter({ windowMs: 60_000, maxRequests: 2 });

  assert.equal(limiter('10.0.0.1', 'signup'), true);
  assert.equal(limiter('10.0.0.1', 'signup'), true);
  assert.equal(limiter('10.0.0.1', 'signup'), false);
  assert.equal(limiter('10.0.0.2', 'signup'), true);
});

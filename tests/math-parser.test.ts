import assert from 'node:assert/strict';
import test from 'node:test';
import { MathParser } from '../utils/mathParser';

test('evaluates supported mathematical expressions without dynamic code execution', () => {
  const expression = MathParser.compile('2x + sin(pi / 2)');

  assert.equal(expression(3), 7);
  assert.equal(MathParser.compile('sqrt(9) + log(100)') (0), 5);
});

test('rejects JavaScript and unsupported property access attempts', () => {
  for (const expression of [
    'constructor',
    'Object.keys(1)',
    'globalThis',
    'x.constructor',
    'require(1)',
  ]) {
    assert.throws(() => MathParser.compile(expression));
  }
});

test('returns NaN for mathematically undefined results', () => {
  assert.ok(Number.isNaN(MathParser.compile('1 / 0')(0)));
  assert.ok(Number.isNaN(MathParser.compile('sqrt(-1)')(0)));
  assert.ok(Number.isNaN(MathParser.compile('log(0)')(0)));
});
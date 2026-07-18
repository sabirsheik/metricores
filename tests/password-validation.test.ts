import test from 'node:test';
import assert from 'node:assert/strict';
import { validatePassword } from '../utils/password';

test('rejects common and weak passwords', () => {
  assert.equal(validatePassword('123456').isValid, false);
  assert.equal(validatePassword('password').isValid, false);
  assert.equal(validatePassword('qwerty').isValid, false);
  assert.equal(validatePassword('abcdefgh').isValid, false);
  assert.equal(validatePassword('aaaaaa').isValid, false);
});

test('accepts strong passwords that meet all requirements', () => {
  const result = validatePassword('StrongPass1!');
  assert.equal(result.isValid, true);
  assert.equal(result.strength, 'Strong');
});

test('flags missing complexity requirements', () => {
  const result = validatePassword('strongpass');
  assert.equal(result.isValid, false);
  assert.equal(result.requirements.uppercase, false);
  assert.equal(result.requirements.number, false);
  assert.equal(result.requirements.special, false);
});

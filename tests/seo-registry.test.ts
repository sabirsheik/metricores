import assert from 'node:assert/strict';
import test from 'node:test';
import { calculatorsData, getCalculatorBySlug } from '../data/calculators';
import { guidesData, getGuideBySlug } from '../data/guides';

test('calculator registry exposes canonical slug and SEO metadata', () => {
  const mortgage = calculatorsData.mortgage;

  assert.equal(mortgage.slug, 'mortgage');
  assert.equal(mortgage.searchIntent, 'calculate monthly mortgage payment');
  assert.equal(mortgage.seoTitle, 'Mortgage Calculator');
  assert.equal(mortgage.relatedCalculators.includes('loan'), true);
  assert.equal(mortgage.relatedGuides.includes('understanding-amortization'), true);
});

test('calculator registry exposes slug lookups for route generation', () => {
  assert.equal(getCalculatorBySlug('mortgage')?.id, 'mortgage');
  assert.equal(getCalculatorBySlug('reverse-mortgage')?.slug, 'reverse-mortgage');
  assert.equal(getCalculatorBySlug('missing')?.id, undefined);
});

test('guide registry exposes canonical slug metadata', () => {
  const guide = guidesData[0];

  assert.equal(guide.slug, 'understanding-amortization');
  assert.equal(getGuideBySlug('understanding-amortization')?.id, 'understanding-amortization');
  assert.equal(getGuideBySlug('missing')?.id, undefined);
});

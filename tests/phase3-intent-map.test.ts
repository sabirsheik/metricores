import test from 'node:test';
import assert from 'node:assert/strict';
import { getSearchIntentProfile, getTopicCluster, getGuideQualityProfile, getSearchIntentMap } from '../lib/search-intent';

test('calculator intent profiles map to a coherent primary user problem', () => {
  const mortgageIntent = getSearchIntentProfile('mortgage');

  assert.equal(mortgageIntent.primaryIntent, 'calculate monthly mortgage payment');
  assert.ok(mortgageIntent.relatedQuestions.length > 0);
  assert.ok(mortgageIntent.relatedCalculators.includes('loan'));
  assert.ok(mortgageIntent.supportingGuides.includes('understanding-amortization'));
});

test('topic clusters organize calculators around actual user needs', () => {
  const cluster = getTopicCluster('Financial Mathematics');

  assert.ok(cluster.calculators.includes('mortgage'));
  assert.ok(cluster.calculators.includes('loan'));
  assert.ok(cluster.guides.includes('understanding-amortization'));
});

test('guide quality metadata includes purpose, methodology, and review cadence', () => {
  const guide = getGuideQualityProfile('understanding-amortization');

  assert.ok(guide.purpose.length > 0);
  assert.ok(guide.introduction.length > 0);
  assert.ok(guide.lastReviewed);
  assert.ok(guide.methodology.length > 0);
  assert.ok(guide.calculatorCta.includes('mortgage'));
});

test('search intent map avoids duplicate primary intents across calculators', () => {
  const map = getSearchIntentMap();
  const primaryIntentCounts = new Map<string, number>();

  for (const profile of Object.values(map)) {
    const count = primaryIntentCounts.get(profile.primaryIntent) ?? 0;
    primaryIntentCounts.set(profile.primaryIntent, count + 1);
  }

  assert.ok([...primaryIntentCounts.values()].every((count) => count <= 1));
});

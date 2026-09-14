import assert from 'node:assert/strict';
import test from 'node:test';
import { calculate } from '../data/calculators';
import { calculateReverseMortgage } from '../utils/reverseMortgage';

const defaultInputs = {
  homeValue: 500000,
  mortgageBalance: 75000,
  borrowerAge: 68,
  interestRate: 6.5,
  loanTerm: 15,
  closingCosts: 10000,
  initialAdvance: 50000
};

test('calculates a transparent reverse mortgage estimate and projection', () => {
  const estimate = calculateReverseMortgage(defaultInputs);

  assert.equal(estimate.availableEquity, 425000);
  assert.equal(estimate.mortgagePayoff, 75000);
  assert.equal(estimate.initialAdvance, 50000);
  assert.equal(estimate.projections.length, 16);
  assert.equal(estimate.projections[0].endingBalance, 135000);
  assert.equal(estimate.estimatedLoanBalance > estimate.projections[0].endingBalance, true);
  assert.equal(estimate.estimatedRemainingEquity < defaultInputs.homeValue, true);
  assert.equal(estimate.estimatedInterest > 0, true);
});

test('reduces proceeds when the existing mortgage or costs increase', () => {
  const baseline = calculateReverseMortgage(defaultInputs);
  const higherDebt = calculateReverseMortgage({ ...defaultInputs, mortgageBalance: 150000 });
  const higherCosts = calculateReverseMortgage({ ...defaultInputs, closingCosts: 30000 });

  assert.equal(higherDebt.estimatedProceeds < baseline.estimatedProceeds, true);
  assert.equal(higherDebt.netEquityAfterMortgage < baseline.netEquityAfterMortgage, true);
  assert.equal(higherCosts.netEquityAfterMortgage < baseline.netEquityAfterMortgage, true);
});

test('handles zero interest without growing the balance', () => {
  const estimate = calculateReverseMortgage({ ...defaultInputs, interestRate: 0 });

  assert.equal(estimate.estimatedInterest, 0);
  assert.equal(estimate.estimatedLoanBalance, estimate.projections[0].endingBalance);
});

test('rejects invalid age, rate, term, and property debt inputs', () => {
  assert.throws(() => calculateReverseMortgage({ ...defaultInputs, borrowerAge: 61 }), /between 62 and 100/);
  assert.throws(() => calculateReverseMortgage({ ...defaultInputs, interestRate: 21 }), /between 0% and 20%/);
  assert.throws(() => calculateReverseMortgage({ ...defaultInputs, loanTerm: 31 }), /between 1 and 30 years/);
  assert.throws(() => calculateReverseMortgage({ ...defaultInputs, mortgageBalance: 500001 }), /between zero and the home value/);
});

test('is registered through the shared calculator dispatcher', () => {
  const results = calculate('reverse-mortgage', defaultInputs);

  assert.equal(results[0].label, 'Estimated Reverse Mortgage Proceeds');
  assert.equal(results[0].isPrimary, true);
  assert.equal(results.some((result) => result.id === 'estimatedRemainingEquity'), true);
  assert.equal(results.some((result) => result.id === 'estimatedRepayment'), true);
});
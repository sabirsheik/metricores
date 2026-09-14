import assert from 'node:assert/strict';
import test from 'node:test';
import { calculate } from '../data/calculators';
import { calculateAge, parseCivilDate } from '../utils/age';

function exactAge(birthDate: string, calculationDate: string): string {
  const result = calculateAge(birthDate, calculationDate);
  return `${result.years} Years, ${result.months} Months, ${result.days} Days`;
}

test('calculates a normal birthday with calendar-aware precision', () => {
  assert.equal(exactAge('2000-06-15', '2025-09-14'), '25 Years, 2 Months, 30 Days');
});

test('handles birthdays already reached and not yet reached this year', () => {
  assert.equal(exactAge('2000-06-15', '2025-06-16'), '25 Years, 0 Months, 1 Days');
  assert.equal(exactAge('2000-06-15', '2025-06-14'), '24 Years, 11 Months, 30 Days');
});

test('handles leap-year and February 29 birthdays', () => {
  assert.equal(exactAge('2000-02-29', '2024-02-29'), '24 Years, 0 Months, 0 Days');
  assert.equal(exactAge('2000-02-29', '2021-02-28'), '21 Years, 0 Months, 0 Days');
});

test('handles February 28 birthdays and month-end borrowing', () => {
  assert.equal(exactAge('2020-02-28', '2021-02-28'), '1 Years, 0 Months, 0 Days');
  assert.equal(exactAge('2021-01-31', '2021-02-28'), '0 Years, 0 Months, 28 Days');
});

test('handles equal dates, one-day differences, and year boundaries', () => {
  assert.equal(exactAge('2025-01-01', '2025-01-01'), '0 Years, 0 Months, 0 Days');
  assert.equal(exactAge('2025-01-01', '2025-01-02'), '0 Years, 0 Months, 1 Days');
  assert.equal(exactAge('2019-12-31', '2020-01-01'), '0 Years, 0 Months, 1 Days');
});

test('returns supporting totals and birthday details', () => {
  const result = calculateAge('2000-01-01', '2025-01-01');

  assert.equal(result.totalYears > 24.9 && result.totalYears < 25.1, true);
  assert.equal(result.totalMonths, 300);
  assert.equal(result.totalWeeks, 1304);
  assert.equal(result.totalDays, 9132);
  assert.equal(result.daysUntilNextBirthday, 0);
  assert.match(result.dayOfBirth, /Saturday, January 1, 2000/);
  assert.equal(result.status, 'Adult (18+)');
});

test('rejects invalid dates, future births, and reversed ranges', () => {
  assert.equal(parseCivilDate('2025-02-29'), null);
  assert.throws(() => calculateAge('2025-02-29', '2025-03-01'), /valid calendar dates/);
  assert.throws(() => calculateAge('2026-01-01', '2025-12-31'), /cannot be earlier/);
});

test('is registered through the shared calculator dispatcher', () => {
  const result = calculate('age', {
    dateOfBirth: '1995-01-15',
    calculationDate: '2026-09-14'
  });

  assert.equal(result[0].label, 'Your Exact Age');
  assert.equal(result[0].value, '31 Years, 7 Months, 30 Days');
  assert.equal(result.some((field) => field.id === 'nextBirthday'), true);
});
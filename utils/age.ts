export interface CivilDate {
  year: number;
  month: number;
  day: number;
}

export interface AgeDetails {
  years: number;
  months: number;
  days: number;
  totalYears: number;
  totalMonths: number;
  totalWeeks: number;
  totalDays: number;
  nextBirthday: string;
  daysUntilNextBirthday: number;
  dayOfBirth: string;
  status: string;
}

const ISO_DATE_PATTERN = /^(\d{4})-(\d{2})-(\d{2})$/;
const MILLISECONDS_PER_DAY = 24 * 60 * 60 * 1000;

export function isLeapYear(year: number): boolean {
  return year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0);
}

export function daysInMonth(year: number, month: number): number {
  if (month === 2) return isLeapYear(year) ? 29 : 28;
  return [4, 6, 9, 11].includes(month) ? 30 : 31;
}

export function parseCivilDate(value: unknown): CivilDate | null {
  if (typeof value !== 'string') return null;
  const match = ISO_DATE_PATTERN.exec(value);
  if (!match) return null;

  const date = {
    year: Number(match[1]),
    month: Number(match[2]),
    day: Number(match[3])
  };

  if (date.month < 1 || date.month > 12 || date.day < 1 || date.day > daysInMonth(date.year, date.month)) {
    return null;
  }

  return date;
}

export function formatCivilDate(date: CivilDate): string {
  return `${String(date.year).padStart(4, '0')}-${String(date.month).padStart(2, '0')}-${String(date.day).padStart(2, '0')}`;
}

export function getTodayDateString(date = new Date()): string {
  return formatCivilDate({
    year: date.getFullYear(),
    month: date.getMonth() + 1,
    day: date.getDate()
  });
}

export function getDateYearsAgoString(years: number, date = new Date()): string {
  const targetYear = date.getFullYear() - years;
  return formatCivilDate({
    year: targetYear,
    month: date.getMonth() + 1,
    day: Math.min(date.getDate(), daysInMonth(targetYear, date.getMonth() + 1))
  });
}

export function compareCivilDates(left: CivilDate, right: CivilDate): number {
  if (left.year !== right.year) return left.year - right.year;
  if (left.month !== right.month) return left.month - right.month;
  return left.day - right.day;
}

function anniversaryForYear(birthDate: CivilDate, year: number): CivilDate {
  const day = birthDate.month === 2 && birthDate.day === 29 && !isLeapYear(year)
    ? 28
    : birthDate.day;
  return { year, month: birthDate.month, day };
}

function addMonths(date: CivilDate, months: number): CivilDate {
  const absoluteMonth = date.year * 12 + (date.month - 1) + months;
  const year = Math.floor(absoluteMonth / 12);
  const month = (absoluteMonth % 12 + 12) % 12 + 1;
  return {
    year,
    month,
    day: Math.min(date.day, daysInMonth(year, month))
  };
}

function differenceInDays(start: CivilDate, end: CivilDate): number {
  const startUtc = Date.UTC(start.year, start.month - 1, start.day);
  const endUtc = Date.UTC(end.year, end.month - 1, end.day);
  return Math.round((endUtc - startUtc) / MILLISECONDS_PER_DAY);
}

function differenceInMonthsAndDays(start: CivilDate, end: CivilDate): { months: number; days: number } {
  let months = (end.year - start.year) * 12 + end.month - start.month;
  let days = end.day - start.day;
  let borrowMonth = end.month - 1;
  let borrowYear = end.year;

  while (days < 0) {
    if (borrowMonth === 0) {
      borrowMonth = 12;
      borrowYear -= 1;
    }
    days += daysInMonth(borrowYear, borrowMonth);
    months -= 1;
    borrowMonth -= 1;
  }

  return { months, days };
}

function formatReadableDate(date: CivilDate): string {
  return new Intl.DateTimeFormat('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
    timeZone: 'UTC'
  }).format(new Date(Date.UTC(date.year, date.month - 1, date.day)));
}

function getNextBirthday(birthDate: CivilDate, asOfDate: CivilDate): CivilDate {
  const birthdayThisYear = anniversaryForYear(birthDate, asOfDate.year);
  return compareCivilDates(asOfDate, birthdayThisYear) <= 0
    ? birthdayThisYear
    : anniversaryForYear(birthDate, asOfDate.year + 1);
}

export function calculateAge(birthDateValue: unknown, asOfDateValue: unknown): AgeDetails {
  const birthDate = parseCivilDate(birthDateValue);
  const asOfDate = parseCivilDate(asOfDateValue);

  if (!birthDate || !asOfDate) {
    throw new Error('Enter valid calendar dates.');
  }
  if (compareCivilDates(birthDate, asOfDate) > 0) {
    throw new Error('The calculation date cannot be earlier than the date of birth.');
  }

  let years = asOfDate.year - birthDate.year;
  let anniversary = anniversaryForYear(birthDate, asOfDate.year);
  if (compareCivilDates(asOfDate, anniversary) < 0) {
    years -= 1;
    anniversary = anniversaryForYear(birthDate, asOfDate.year - 1);
  }

  const remainder = differenceInMonthsAndDays(anniversary, asOfDate);
  const nextBirthday = getNextBirthday(birthDate, asOfDate);
  const totalDays = differenceInDays(birthDate, asOfDate);

  return {
    years,
    months: remainder.months,
    days: remainder.days,
    totalYears: totalDays / 365.2425,
    totalMonths: years * 12 + remainder.months,
    totalWeeks: Math.floor(totalDays / 7),
    totalDays,
    nextBirthday: formatReadableDate(nextBirthday),
    daysUntilNextBirthday: differenceInDays(asOfDate, nextBirthday),
    dayOfBirth: formatReadableDate(birthDate),
    status: years >= 18 ? 'Adult (18+)' : 'Minor (under 18)'
  };
}
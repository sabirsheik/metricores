/**
 * Format a number to currency string.
 * Supports USD, GBP, EUR.
 */
export function formatCurrency(value: number, currencyCode: string = 'USD', decimals: number = 2): string {
  if (value === undefined || value === null) return '';
  if (value === Infinity) return 'Infinite';
  if (isNaN(value)) return 'N/A';

  const localeMap: Record<string, string> = {
    USD: 'en-US',
    GBP: 'en-GB',
    EUR: 'de-DE'
  };

  const locale = localeMap[currencyCode.toUpperCase()] || 'en-US';

  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currencyCode.toUpperCase(),
    maximumFractionDigits: decimals,
    minimumFractionDigits: decimals
  }).format(value);
}

/**
 * Format a number to percentage string.
 */
export function formatPercentage(value: number, decimals: number = 2): string {
  if (value === undefined || value === null) return '';
  if (isNaN(value)) return 'N/A';
  return `${value.toLocaleString('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  })}%`;
}

/**
 * Format a number with thousands separators and custom decimal precision.
 */
export function formatNumber(value: number, decimals: number = 2): string {
  if (value === undefined || value === null) return '';
  if (isNaN(value)) return 'N/A';
  return value.toLocaleString('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  });
}

/**
 * Format a date object or string into a clean professional display date.
 */
export function formatDate(date: Date | string): string {
  if (!date) return '';
  const d = typeof date === 'string' ? new Date(date) : date;
  if (isNaN(d.getTime())) return '';
  
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

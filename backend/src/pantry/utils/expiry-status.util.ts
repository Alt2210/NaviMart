export const EXPIRY_STATUSES = ['safe', 'expiring', 'expired'] as const;

export type ExpiryStatus = (typeof EXPIRY_STATUSES)[number];

export type ExpiryStatusRange = {
  from?: Date;
  toExclusive?: Date;
};

export const DEFAULT_EXPIRY_WARNING_DAYS = 3;

export function getStartOfDay(date = new Date()): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

export function addDays(date: Date, days: number): Date {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

export function getExpiryStatus(
  expiryDate: Date,
  warningDays = DEFAULT_EXPIRY_WARNING_DAYS,
  now = new Date(),
): ExpiryStatus {
  const startOfToday = getStartOfDay(now);
  const safeStart = addDays(startOfToday, warningDays + 1);

  if (expiryDate < startOfToday) {
    return 'expired';
  }

  if (expiryDate < safeStart) {
    return 'expiring';
  }

  return 'safe';
}

export function getExpiryStatusRange(
  expiryStatus?: ExpiryStatus,
  warningDays = DEFAULT_EXPIRY_WARNING_DAYS,
  now = new Date(),
): ExpiryStatusRange | undefined {
  const startOfToday = getStartOfDay(now);
  const safeStart = addDays(startOfToday, warningDays + 1);

  if (expiryStatus === 'expired') {
    return { toExclusive: startOfToday };
  }

  if (expiryStatus === 'expiring') {
    return { from: startOfToday, toExclusive: safeStart };
  }

  if (expiryStatus === 'safe') {
    return { from: safeStart };
  }

  return undefined;
}

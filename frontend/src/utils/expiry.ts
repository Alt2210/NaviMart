// Single source of truth for "days until expiry" math.
// Previously Home and PantryDashboard each computed this slightly differently
// (clamped vs signed), showing conflicting day counts for the same item.

const DAY_MS = 24 * 60 * 60 * 1000;

/** Signed whole days until expiry: 0 = expires today, negative = already expired. */
export function daysUntilExpiry(expiryDate: string | Date): number {
  return Math.ceil((new Date(expiryDate).getTime() - Date.now()) / DAY_MS);
}

/** Days left for countdown badges, clamped at 0. */
export function daysLeft(expiryDate: string | Date): number {
  return Math.max(0, daysUntilExpiry(expiryDate));
}

/** Days past expiry, clamped at 0. */
export function daysOverdue(expiryDate: string | Date): number {
  return Math.max(0, -daysUntilExpiry(expiryDate));
}

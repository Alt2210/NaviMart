import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { daysLeft, daysOverdue, daysUntilExpiry } from './expiry';

describe('expiry date math', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    // Fixed "now" so the day math is deterministic.
    vi.setSystemTime(new Date('2026-06-14T12:00:00Z'));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe('daysUntilExpiry (signed)', () => {
    it('returns a positive count for a future date', () => {
      expect(daysUntilExpiry('2026-06-17T12:00:00Z')).toBe(3);
    });

    it('returns 0 on the boundary of exactly now', () => {
      expect(daysUntilExpiry('2026-06-14T12:00:00Z')).toBe(0);
    });

    it('returns a negative count for a past date', () => {
      expect(daysUntilExpiry('2026-06-12T12:00:00Z')).toBe(-2);
    });

    it('rounds partial days up (ceil)', () => {
      // 1.5 days ahead -> ceil -> 2
      expect(daysUntilExpiry('2026-06-16T00:00:00Z')).toBe(2);
    });
  });

  describe('daysLeft (clamped at 0)', () => {
    it('clamps already-expired dates to 0', () => {
      expect(daysLeft('2026-06-10T12:00:00Z')).toBe(0);
    });

    it('matches the signed value for future dates', () => {
      expect(daysLeft('2026-06-19T12:00:00Z')).toBe(5);
    });
  });

  describe('daysOverdue (clamped at 0)', () => {
    it('reports how many days past expiry', () => {
      expect(daysOverdue('2026-06-11T12:00:00Z')).toBe(3);
    });

    it('clamps future dates to 0', () => {
      expect(daysOverdue('2026-06-20T12:00:00Z')).toBe(0);
    });
  });
});

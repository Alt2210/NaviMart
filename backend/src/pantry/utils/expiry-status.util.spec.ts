import {
  addDays,
  DEFAULT_EXPIRY_WARNING_DAYS,
  getExpiryStatus,
  getExpiryStatusRange,
  getStartOfDay,
} from './expiry-status.util';

describe('expiry status utilities', () => {
  const now = new Date(2026, 5, 11, 15, 30);

  describe('getStartOfDay', () => {
    it('strips the time component to local midnight', () => {
      expect(getStartOfDay(now)).toEqual(new Date(2026, 5, 11));
    });

    it('defaults to the current date when no argument is given', () => {
      const start = getStartOfDay();
      expect(start.getHours()).toBe(0);
      expect(start.getMinutes()).toBe(0);
      expect(start.getSeconds()).toBe(0);
      expect(start.getMilliseconds()).toBe(0);
    });
  });

  describe('addDays', () => {
    it('adds whole days without mutating the input', () => {
      const base = new Date(2026, 5, 11);
      expect(addDays(base, 4)).toEqual(new Date(2026, 5, 15));
      expect(base).toEqual(new Date(2026, 5, 11));
    });

    it('handles negative offsets and month rollover', () => {
      expect(addDays(new Date(2026, 5, 1), -1)).toEqual(new Date(2026, 4, 31));
    });
  });

  describe('getExpiryStatus', () => {
    it('marks dates before today as expired', () => {
      expect(getExpiryStatus(new Date(2026, 5, 10), 3, now)).toBe('expired');
    });

    it('marks today through warning window as expiring', () => {
      expect(getExpiryStatus(new Date(2026, 5, 11), 3, now)).toBe('expiring');
      expect(getExpiryStatus(new Date(2026, 5, 14), 3, now)).toBe('expiring');
    });

    it('marks dates after warning window as safe', () => {
      expect(getExpiryStatus(new Date(2026, 5, 15), 3, now)).toBe('safe');
    });

    it('uses the default warning window when none is supplied', () => {
      expect(DEFAULT_EXPIRY_WARNING_DAYS).toBe(3);
      // 3-day window: today + 3 is still expiring, today + 4 is safe.
      expect(getExpiryStatus(new Date(2026, 5, 14), undefined, now)).toBe(
        'expiring',
      );
      expect(getExpiryStatus(new Date(2026, 5, 15), undefined, now)).toBe(
        'safe',
      );
    });

    it('with warningDays=0 only marks today as expiring', () => {
      expect(getExpiryStatus(new Date(2026, 5, 11), 0, now)).toBe('expiring');
      expect(getExpiryStatus(new Date(2026, 5, 12), 0, now)).toBe('safe');
      expect(getExpiryStatus(new Date(2026, 5, 10), 0, now)).toBe('expired');
    });
  });

  describe('getExpiryStatusRange', () => {
    it('returns matching date ranges for query filtering', () => {
      expect(getExpiryStatusRange('expired', 3, now)).toEqual({
        toExclusive: new Date(2026, 5, 11),
      });
      expect(getExpiryStatusRange('expiring', 3, now)).toEqual({
        from: new Date(2026, 5, 11),
        toExclusive: new Date(2026, 5, 15),
      });
      expect(getExpiryStatusRange('safe', 3, now)).toEqual({
        from: new Date(2026, 5, 15),
      });
    });

    it('returns undefined when no expiry status is provided', () => {
      expect(getExpiryStatusRange(undefined, 3, now)).toBeUndefined();
    });
  });
});

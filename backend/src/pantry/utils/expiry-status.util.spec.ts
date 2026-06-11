import {
  getExpiryStatus,
  getExpiryStatusRange,
} from './expiry-status.util';

describe('expiry status utilities', () => {
  const now = new Date(2026, 5, 11, 15, 30);

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
});

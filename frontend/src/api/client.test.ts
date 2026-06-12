import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
  apiRequest,
  ApiError,
  clearSession,
  getStoredTokens,
  getStoredUser,
  storeTokens,
  storeUser,
} from './client';

function jsonResponse(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

describe('token/user storage', () => {
  beforeEach(() => localStorage.clear());

  it('stores and reads tokens', () => {
    storeTokens({ accessToken: 'a', refreshToken: 'r' });
    expect(getStoredTokens()).toEqual({ accessToken: 'a', refreshToken: 'r' });
    storeTokens(null);
    expect(getStoredTokens()).toBeNull();
  });

  it('returns null for corrupted stored JSON instead of throwing', () => {
    localStorage.setItem('navimart.tokens', '{not-json');
    expect(getStoredTokens()).toBeNull();
  });

  it('clearSession removes both tokens and user', () => {
    storeTokens({ accessToken: 'a', refreshToken: 'r' });
    storeUser({ id: 'u1' });
    clearSession();
    expect(getStoredTokens()).toBeNull();
    expect(getStoredUser()).toBeNull();
  });
});

describe('apiRequest', () => {
  const fetchMock = vi.fn();

  beforeEach(() => {
    localStorage.clear();
    fetchMock.mockReset();
    vi.stubGlobal('fetch', fetchMock);
  });

  afterEach(async () => {
    // let the module-level refreshPromise reset (scheduled with setTimeout 0) before the next test
    await new Promise((resolve) => setTimeout(resolve, 0));
    vi.unstubAllGlobals();
  });

  it('sends Authorization header and query params', async () => {
    storeTokens({ accessToken: 'tok123', refreshToken: 'r' });
    fetchMock.mockResolvedValueOnce(jsonResponse([{ id: '1' }]));

    const result = await apiRequest<{ id: string }[]>('/pantry', {
      query: { q: 'sua', skipped: undefined, empty: '' },
    });

    expect(result).toEqual([{ id: '1' }]);
    const [url, init] = fetchMock.mock.calls[0];
    expect(String(url)).toContain('/pantry?q=sua');
    expect(String(url)).not.toContain('skipped');
    expect(String(url)).not.toContain('empty');
    expect((init.headers as Record<string, string>).Authorization).toBe('Bearer tok123');
  });

  it('throws ApiError with joined class-validator messages', async () => {
    fetchMock.mockResolvedValueOnce(
      jsonResponse({ message: ['a must be x', 'b must be y'], statusCode: 400 }, 400),
    );

    await expect(apiRequest('/auth/login', { method: 'POST', body: {}, auth: false }))
      .rejects.toMatchObject({ status: 400, message: 'a must be x; b must be y' });
  });

  it('on 401: refreshes the token and retries the original request', async () => {
    storeTokens({ accessToken: 'expired', refreshToken: 'refresh-1' });

    fetchMock
      // original request -> 401
      .mockResolvedValueOnce(jsonResponse({ message: 'Unauthorized' }, 401))
      // refresh call -> new tokens
      .mockResolvedValueOnce(
        jsonResponse({
          tokens: { accessToken: 'fresh', refreshToken: 'refresh-2' },
          user: { id: 'u1' },
        }),
      )
      // retried request -> success
      .mockResolvedValueOnce(jsonResponse({ ok: true }));

    const result = await apiRequest<{ ok: boolean }>('/pantry');

    expect(result).toEqual({ ok: true });
    expect(fetchMock).toHaveBeenCalledTimes(3);
    expect(String(fetchMock.mock.calls[1][0])).toContain('/auth/refresh');
    const retryInit = fetchMock.mock.calls[2][1];
    expect((retryInit.headers as Record<string, string>).Authorization).toBe('Bearer fresh');
    expect(getStoredTokens()?.accessToken).toBe('fresh');
  });

  it('on 401 with failed refresh: clears session and dispatches navimart:unauthorized', async () => {
    storeTokens({ accessToken: 'expired', refreshToken: 'dead' });
    const unauthorizedListener = vi.fn();
    window.addEventListener('navimart:unauthorized', unauthorizedListener);

    fetchMock
      .mockResolvedValueOnce(jsonResponse({ message: 'Unauthorized' }, 401))
      .mockResolvedValueOnce(jsonResponse({ message: 'Invalid refresh token' }, 401));

    await expect(apiRequest('/pantry')).rejects.toBeInstanceOf(ApiError);
    expect(getStoredTokens()).toBeNull();
    expect(unauthorizedListener).toHaveBeenCalled();

    window.removeEventListener('navimart:unauthorized', unauthorizedListener);
  });
});

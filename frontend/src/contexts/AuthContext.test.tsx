import { act } from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { Mock } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { AuthProvider, useAuth } from './AuthContext';
import {
  authApi,
  clearSession,
  getStoredTokens,
  getStoredUser,
  storeTokens,
  storeUser,
} from '../api';
import { connectSocket, disconnectSocket } from '../api/socket';

vi.mock('../api', () => ({
  authApi: {
    login: vi.fn(),
    register: vi.fn(),
    logout: vi.fn(),
    refresh: vi.fn(),
  },
  clearSession: vi.fn(),
  getStoredTokens: vi.fn(),
  getStoredUser: vi.fn(),
  storeTokens: vi.fn(),
  storeUser: vi.fn(),
}));

vi.mock('../api/socket', () => ({
  connectSocket: vi.fn(),
  disconnectSocket: vi.fn(),
}));

const SESSION = {
  user: { id: 'u1', role: 'user' },
  tokens: { accessToken: 'a', refreshToken: 'r' },
};

describe('AuthContext', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (getStoredUser as Mock).mockReturnValue(null);
    (getStoredTokens as Mock).mockReturnValue(null);
  });

  function setup() {
    return renderHook(() => useAuth(), { wrapper: AuthProvider });
  }

  it('login persists the session, sets the user, and connects the socket', async () => {
    (authApi.login as Mock).mockResolvedValue(SESSION);
    const { result } = setup();

    await act(async () => {
      await result.current.login('u1@example.com', 'pw', true);
    });

    expect(authApi.login).toHaveBeenCalledWith('u1@example.com', 'pw', true);
    expect(storeTokens).toHaveBeenCalledWith(SESSION.tokens);
    expect(storeUser).toHaveBeenCalledWith(SESSION.user);
    expect(result.current.user).toEqual(SESSION.user);
    expect(result.current.isAuthenticated).toBe(true);
    await waitFor(() => expect(connectSocket).toHaveBeenCalled());
  });

  it('register persists the session and sets the user', async () => {
    (authApi.register as Mock).mockResolvedValue(SESSION);
    const { result } = setup();

    await act(async () => {
      await result.current.register({
        password: 'pw',
        firstName: 'A',
        lastName: 'B',
      });
    });

    expect(storeUser).toHaveBeenCalledWith(SESSION.user);
    expect(result.current.user).toEqual(SESSION.user);
  });

  it('logout clears the session even if the API call fails', async () => {
    (authApi.login as Mock).mockResolvedValue(SESSION);
    (authApi.logout as Mock).mockRejectedValue(new Error('network'));
    const { result } = setup();

    await act(async () => {
      await result.current.login('u1@example.com', 'pw');
    });
    await act(async () => {
      await result.current.logout();
    });

    expect(clearSession).toHaveBeenCalled();
    expect(disconnectSocket).toHaveBeenCalled();
    expect(result.current.user).toBeNull();
    expect(result.current.isAuthenticated).toBe(false);
  });

  it('refreshSession returns null when there is no stored refresh token', async () => {
    (getStoredTokens as Mock).mockReturnValue(null);
    const { result } = setup();

    let returned: unknown;
    await act(async () => {
      returned = await result.current.refreshSession();
    });

    expect(returned).toBeNull();
    expect(authApi.refresh).not.toHaveBeenCalled();
  });

  it('refreshSession re-issues tokens and updates the user', async () => {
    (getStoredTokens as Mock).mockReturnValue(SESSION.tokens);
    (authApi.refresh as Mock).mockResolvedValue(SESSION);
    const { result } = setup();

    await act(async () => {
      await result.current.refreshSession();
    });

    expect(authApi.refresh).toHaveBeenCalledWith('r');
    expect(result.current.user).toEqual(SESSION.user);
  });

  it('clears the user when a navimart:unauthorized event fires', async () => {
    (authApi.login as Mock).mockResolvedValue(SESSION);
    const { result } = setup();
    await act(async () => {
      await result.current.login('u1@example.com', 'pw');
    });

    act(() => {
      window.dispatchEvent(new Event('navimart:unauthorized'));
    });

    expect(result.current.user).toBeNull();
  });
});

import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import {
  authApi,
  clearSession,
  getStoredTokens,
  getStoredUser,
  storeTokens,
  storeUser,
} from '../api';
import type { AuthUser } from '../api';
import { connectSocket, disconnectSocket } from '../api/socket';

type AuthContextType = {
  user: AuthUser | null;
  isAuthenticated: boolean;
  login: (identifier: string, password: string, rememberMe?: boolean) => Promise<AuthUser>;
  register: (input: {
    email?: string;
    phone?: string;
    password: string;
    firstName: string;
    lastName: string;
    familyName?: string;
  }) => Promise<AuthUser>;
  logout: () => Promise<void>;
  refreshSession: () => Promise<AuthUser | null>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<AuthUser | null>(() => getStoredUser<AuthUser>());

  useEffect(() => {
    const handleUnauthorized = () => {
      disconnectSocket();
      setUser(null);
    };
    window.addEventListener('navimart:unauthorized', handleUnauthorized);
    return () => window.removeEventListener('navimart:unauthorized', handleUnauthorized);
  }, []);

  // Keep the realtime socket in sync with the auth state.
  useEffect(() => {
    if (user) {
      connectSocket();
    } else {
      disconnectSocket();
    }
  }, [user]);

  const login = useCallback(
    async (identifier: string, password: string, rememberMe = false) => {
      const response = await authApi.login(identifier, password, rememberMe);
      storeTokens(response.tokens);
      storeUser(response.user);
      setUser(response.user);
      return response.user;
    },
    [],
  );

  const register = useCallback(
    async (input: {
      email?: string;
      phone?: string;
      password: string;
      firstName: string;
      lastName: string;
      familyName?: string;
    }) => {
      const response = await authApi.register(input);
      storeTokens(response.tokens);
      storeUser(response.user);
      setUser(response.user);
      return response.user;
    },
    [],
  );

  const logout = useCallback(async () => {
    try {
      await authApi.logout();
    } catch {
      // ignore network/auth errors on logout
    }
    disconnectSocket();
    clearSession();
    setUser(null);
  }, []);

  // Re-issues tokens so the JWT picks up server-side changes (e.g. new activeFamilyId after joining a family).
  const refreshSession = useCallback(async () => {
    const tokens = getStoredTokens();
    if (!tokens?.refreshToken) return null;
    try {
      const response = await authApi.refresh(tokens.refreshToken);
      storeTokens(response.tokens);
      storeUser(response.user);
      setUser(response.user);
      return response.user;
    } catch {
      return null;
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, isAuthenticated: !!user, login, register, logout, refreshSession }}
    >
      {children}
    </AuthContext.Provider>
  );
};

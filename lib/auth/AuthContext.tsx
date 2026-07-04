'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { authApi, type AuthUser } from '@/lib/api/auth';
import { ApiError } from '@/lib/api/client';
import { env } from '@/lib/env';
import { AuthError } from '@/lib/auth/AuthError';

const TOKEN_KEY = 'bo_token';

type AuthStatus = 'checking' | 'signed-out' | 'signed-in' | 'demo';

interface AuthState {
  status: AuthStatus;
  token: string | null;
  user: AuthUser | null;
  error: string | null;
}

interface AuthContextValue {
  status: AuthStatus;
  user: AuthUser | null;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>({
    status: 'checking',
    token: null,
    user: null,
    error: null,
  });

  useEffect(() => {
    let cancelled = false;

    async function bootstrap() {
      const storedToken = sessionStorage.getItem(TOKEN_KEY);

      if (!storedToken) {
        if (!cancelled) {
          setState({ status: 'signed-out', token: null, user: null, error: null });
        }
        return;
      }

      try {
        const user = await authApi.me(storedToken);
        if (!cancelled) {
          setState({ status: 'signed-in', token: storedToken, user, error: null });
        }
      } catch (error) {
        if (error instanceof ApiError && error.status === 401) {
          sessionStorage.removeItem(TOKEN_KEY);
        }
        if (!cancelled) {
          setState({ status: 'signed-out', token: null, user: null, error: null });
        }
      }
    }

    void bootstrap();

    return () => {
      cancelled = true;
    };
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    try {
      const response = await authApi.login(email, password);
      sessionStorage.setItem(TOKEN_KEY, response.access_token);
      setState({
        status: 'signed-in',
        token: response.access_token,
        user: null,
        error: null,
      });

      try {
        const user = await authApi.me(response.access_token);
        setState((prev) =>
          prev.status === 'signed-in' ? { ...prev, user } : prev,
        );
      } catch {
        // Keep signed-in with user: null per spec
      }
    } catch (error) {
      if (error instanceof ApiError && error.status === 401) {
        throw new AuthError('invalid-credentials');
      }

      if (env.allowDemoLogin) {
        setState({ status: 'demo', token: '__demo__', user: null, error: null });
        return;
      }

      throw new AuthError('unreachable');
    }
  }, []);

  const logout = useCallback(async () => {
    if (state.status === 'demo') {
      setState({ status: 'signed-out', token: null, user: null, error: null });
      return;
    }

    if (state.token) {
      try {
        await authApi.logout(state.token);
      } catch {
        // Best-effort — ignore errors
      }
    }

    sessionStorage.removeItem(TOKEN_KEY);
    setState({ status: 'signed-out', token: null, user: null, error: null });
  }, [state.status, state.token]);

  const value = useMemo(
    () => ({
      status: state.status,
      user: state.user,
      error: state.error,
      login,
      logout,
    }),
    [state.status, state.user, state.error, login, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export { AuthContext };

import { render, renderHook, act, waitFor } from '@testing-library/react';
import { ReactNode } from 'react';

const mockEnv = { apiBaseUrl: 'http://test.api/api/v1', allowDemoLogin: false };

jest.mock('@/lib/env', () => ({
  get env() {
    return mockEnv;
  },
}));

const mockLogin = jest.fn();
const mockLogout = jest.fn();
const mockMe = jest.fn();

jest.mock('@/lib/api/auth', () => ({
  authApi: {
    login: (...args: unknown[]) => mockLogin(...args),
    logout: (...args: unknown[]) => mockLogout(...args),
    me: (...args: unknown[]) => mockMe(...args),
    refresh: jest.fn(),
  },
}));

import { AuthProvider } from '@/lib/auth/AuthContext';
import { useAuth } from '@/lib/auth/useAuth';
import { AuthError } from '@/lib/auth/AuthError';
import { ApiError } from '@/lib/api/client';

const sessionStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: jest.fn((key: string) => store[key] ?? null),
    setItem: jest.fn((key: string, value: string) => {
      store[key] = value;
    }),
    removeItem: jest.fn((key: string) => {
      delete store[key];
    }),
    clear: jest.fn(() => {
      store = {};
    }),
  };
})();

Object.defineProperty(window, 'sessionStorage', { value: sessionStorageMock, writable: true });

function wrapper({ children }: { children: ReactNode }) {
  return <AuthProvider>{children}</AuthProvider>;
}

describe('AuthContext', () => {
  beforeEach(() => {
    mockEnv.allowDemoLogin = false;
    sessionStorageMock.clear();
    jest.clearAllMocks();
    mockMe.mockReset();
    mockLogin.mockReset();
    mockLogout.mockReset();
  });

  it('bootstraps to signed-out with no stored token and no fetch call', async () => {
    const { result } = renderHook(() => useAuth(), { wrapper });

    await waitFor(() => {
      expect(result.current.status).toBe('signed-out');
    });
    expect(mockMe).not.toHaveBeenCalled();
  });

  it('bootstraps to signed-in when stored token and me() succeeds', async () => {
    sessionStorageMock.setItem('bo_token', 'stored-token');
    mockMe.mockResolvedValue({
      id: 1,
      name: 'Admin',
      email: 'admin@example.com',
      created_at: null,
    });

    const { result } = renderHook(() => useAuth(), { wrapper });

    await waitFor(() => {
      expect(result.current.status).toBe('signed-in');
    });
    expect(result.current.user?.email).toBe('admin@example.com');
    expect(mockMe).toHaveBeenCalledWith('stored-token');
  });

  it('bootstraps to signed-out and clears storage when me() returns 401', async () => {
    sessionStorageMock.setItem('bo_token', 'expired-token');
    mockMe.mockRejectedValue(new ApiError(401, 'Unauthorized'));

    const { result } = renderHook(() => useAuth(), { wrapper });

    await waitFor(() => {
      expect(result.current.status).toBe('signed-out');
    });
    expect(sessionStorageMock.removeItem).toHaveBeenCalledWith('bo_token');
  });

  it('login success stores token, sets signed-in, and calls me()', async () => {
    mockLogin.mockResolvedValue({
      access_token: 'new-token',
      token_type: 'bearer',
      expires_in: 3600,
    });
    mockMe.mockResolvedValue({
      id: 1,
      name: 'Admin',
      email: 'admin@example.com',
      created_at: null,
    });

    const { result } = renderHook(() => useAuth(), { wrapper });
    await waitFor(() => expect(result.current.status).toBe('signed-out'));

    await act(async () => {
      await result.current.login('admin@example.com', 'password');
    });

    expect(sessionStorageMock.setItem).toHaveBeenCalledWith('bo_token', 'new-token');
    expect(result.current.status).toBe('signed-in');
    expect(mockMe).toHaveBeenCalledWith('new-token');
  });

  it('login with 401 throws AuthError invalid-credentials and stays signed-out', async () => {
    mockLogin.mockRejectedValue(new ApiError(401, 'Invalid credentials.'));

    const { result } = renderHook(() => useAuth(), { wrapper });
    await waitFor(() => expect(result.current.status).toBe('signed-out'));

    let caught: unknown;
    await act(async () => {
      try {
        await result.current.login('admin@example.com', 'wrong');
      } catch (e) {
        caught = e;
      }
    });

    expect(caught).toBeInstanceOf(AuthError);
    expect((caught as AuthError).kind).toBe('invalid-credentials');
    expect(result.current.status).toBe('signed-out');
  });

  it('login network failure with allowDemoLogin false throws AuthError unreachable', async () => {
    mockEnv.allowDemoLogin = false;
    mockLogin.mockRejectedValue(new ApiError(500, 'Server error'));

    const { result } = renderHook(() => useAuth(), { wrapper });
    await waitFor(() => expect(result.current.status).toBe('signed-out'));

    let caught: unknown;
    await act(async () => {
      try {
        await result.current.login('admin@example.com', 'password');
      } catch (e) {
        caught = e;
      }
    });

    expect(caught).toBeInstanceOf(AuthError);
    expect((caught as AuthError).kind).toBe('unreachable');
    expect(result.current.status).toBe('signed-out');
  });

  it('login network failure with allowDemoLogin true sets demo status', async () => {
    mockEnv.allowDemoLogin = true;
    mockLogin.mockRejectedValue(new ApiError(500, 'Server error'));

    const { result } = renderHook(() => useAuth(), { wrapper });
    await waitFor(() => expect(result.current.status).toBe('signed-out'));

    await act(async () => {
      await result.current.login('any@example.com', 'any');
    });

    expect(result.current.status).toBe('demo');
  });

  it('logout from signed-in calls authApi.logout, clears storage, sets signed-out', async () => {
    sessionStorageMock.setItem('bo_token', 'stored-token');
    mockMe.mockResolvedValue({
      id: 1,
      name: 'Admin',
      email: 'admin@example.com',
      created_at: null,
    });
    mockLogout.mockResolvedValue({ message: 'Logged out' });

    const { result } = renderHook(() => useAuth(), { wrapper });
    await waitFor(() => expect(result.current.status).toBe('signed-in'));

    await act(async () => {
      await result.current.logout();
    });

    expect(mockLogout).toHaveBeenCalledWith('stored-token');
    expect(sessionStorageMock.removeItem).toHaveBeenCalledWith('bo_token');
    expect(result.current.status).toBe('signed-out');
  });

  it('logout from demo makes no API call and sets signed-out', async () => {
    mockEnv.allowDemoLogin = true;
    mockLogin.mockRejectedValue(new ApiError(500, 'Server error'));

    const { result } = renderHook(() => useAuth(), { wrapper });
    await waitFor(() => expect(result.current.status).toBe('signed-out'));

    await act(async () => {
      await result.current.login('any@example.com', 'any');
    });
    expect(result.current.status).toBe('demo');

    mockLogout.mockClear();
    await act(async () => {
      await result.current.logout();
    });

    expect(mockLogout).not.toHaveBeenCalled();
    expect(result.current.status).toBe('signed-out');
  });
});

describe('useAuth', () => {
  it('throws when used outside AuthProvider', () => {
    function BadConsumer() {
      useAuth();
      return null;
    }

    const spy = jest.spyOn(console, 'error').mockImplementation(() => {});
    expect(() => render(<BadConsumer />)).toThrow('useAuth must be used within an AuthProvider');
    spy.mockRestore();
  });
});

jest.mock('@/lib/env', () => ({
  env: { apiBaseUrl: 'http://test.api/api/v1', allowDemoLogin: false },
}));

import { ApiError, apiFetch } from '@/lib/api/client';
import { authApi } from '@/lib/api/auth';

describe('apiFetch', () => {
  beforeEach(() => {
    global.fetch = jest.fn();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('prefixes path with apiBaseUrl and sets Content-Type', async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => ({ data: { ok: true }, meta: {} }),
    });

    await apiFetch('/auth/me');

    expect(global.fetch).toHaveBeenCalledWith(
      'http://test.api/api/v1/auth/me',
      expect.objectContaining({
        headers: expect.objectContaining({
          'Content-Type': 'application/json',
        }),
      }),
    );
  });

  it('attaches Authorization header when token is provided', async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => ({ data: { id: 1 }, meta: {} }),
    });

    await apiFetch('/auth/me', { token: 'abc123' });

    expect(global.fetch).toHaveBeenCalledWith(
      'http://test.api/api/v1/auth/me',
      expect.objectContaining({
        headers: expect.objectContaining({
          Authorization: 'Bearer abc123',
        }),
      }),
    );
  });

  it('unwraps data from a successful envelope response', async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => ({
        data: { access_token: 'tok', token_type: 'bearer', expires_in: 3600 },
        meta: {},
      }),
    });

    const result = await apiFetch<{ access_token: string }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email: 'a@b.com', password: 'pass' }),
    });

    expect(result).toEqual({
      access_token: 'tok',
      token_type: 'bearer',
      expires_in: 3600,
    });
  });

  it('throws ApiError with status 401 on unauthorized response', async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: false,
      status: 401,
      json: async () => ({ message: 'Invalid credentials.', errors: [] }),
    });

    await expect(
      apiFetch('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email: 'a@b.com', password: 'wrong' }),
      }),
    ).rejects.toMatchObject({
      status: 401,
      message: 'Invalid credentials.',
    });
  });

  it('throws ApiError with message when response body is not JSON', async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: false,
      status: 500,
      json: async () => {
        throw new Error('not json');
      },
    });

    await expect(apiFetch('/auth/me')).rejects.toBeInstanceOf(ApiError);
    await expect(apiFetch('/auth/me')).rejects.toMatchObject({
      status: 500,
      message: 'Request failed (500)',
    });
  });
});

describe('authApi', () => {
  beforeEach(() => {
    global.fetch = jest.fn();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('login posts credentials to /auth/login', async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => ({
        data: { access_token: 'tok', token_type: 'bearer', expires_in: 3600 },
        meta: {},
      }),
    });

    const result = await authApi.login('admin@example.com', 'password');

    expect(global.fetch).toHaveBeenCalledWith(
      'http://test.api/api/v1/auth/login',
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify({ email: 'admin@example.com', password: 'password' }),
      }),
    );
    expect(result.access_token).toBe('tok');
  });

  it('logout posts to /auth/logout with token', async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => ({ data: { message: 'Logged out' }, meta: {} }),
    });

    await authApi.logout('tok');

    expect(global.fetch).toHaveBeenCalledWith(
      'http://test.api/api/v1/auth/logout',
      expect.objectContaining({
        method: 'POST',
        headers: expect.objectContaining({ Authorization: 'Bearer tok' }),
      }),
    );
  });

  it('refresh posts to /auth/refresh with token', async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => ({
        data: { access_token: 'newtok', token_type: 'bearer', expires_in: 3600 },
        meta: {},
      }),
    });

    const result = await authApi.refresh('tok');
    expect(result.access_token).toBe('newtok');
  });

  it('me gets /auth/me with token', async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => ({
        data: { id: 1, name: 'Admin', email: 'admin@example.com', created_at: null },
        meta: {},
      }),
    });

    const result = await authApi.me('tok');
    expect(result.email).toBe('admin@example.com');
  });
});

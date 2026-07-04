import { apiFetch } from '@/lib/api/client';

export interface LoginResponse {
  access_token: string;
  token_type: 'bearer';
  expires_in: number;
}

export interface AuthUser {
  id: number;
  name: string;
  email: string;
  created_at: string | null;
}

export const authApi = {
  login: (email: string, password: string) =>
    apiFetch<LoginResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),

  logout: (token: string) =>
    apiFetch<{ message: string }>('/auth/logout', { method: 'POST', token }),

  refresh: (token: string) =>
    apiFetch<LoginResponse>('/auth/refresh', { method: 'POST', token }),

  me: (token: string) => apiFetch<AuthUser>('/auth/me', { token }),
};

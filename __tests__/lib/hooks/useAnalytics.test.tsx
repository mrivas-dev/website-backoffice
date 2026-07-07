import { act, renderHook, waitFor } from '@testing-library/react';

const mockRequest = jest.fn();

jest.mock('@/lib/auth/useAuth', () => ({
  useAuth: () => ({ request: mockRequest }),
}));

import { useAnalytics } from '@/lib/hooks/useAnalytics';
import type { RangeKey } from '@/lib/api/analytics';

const overview = {
  range: '30d' as const,
  kpis: {
    total_sessions: 10,
    total_page_views: 20,
    total_commands: 5,
    unique_visitors: 8,
    avg_session_duration_seconds: 120,
  },
  daily: [{ date: '2026-07-01', sessions: 2, page_views: 4 }],
};

const commands = {
  range: '30d' as const,
  total_commands: 5,
  top_commands: [{ command: 'help', count: 3 }],
};

const sessions = {
  range: '30d' as const,
  total_sessions: 10,
  avg_duration_seconds: 120,
  median_duration_seconds: 100,
  duration_buckets: [{ label: '0-30s', count: 2 }],
  recent_sessions: [],
};

const os = {
  range: '30d' as const,
  by_os: [{ os: 'macOS', count: 6, percentage: 60 }],
  by_device: [{ device_type: 'desktop', count: 8, percentage: 80 }],
};

const referrers = {
  range: '30d' as const,
  direct_count: 3,
  top_referrers: [{ referrer: 'github.com', count: 2 }],
};

function mockRequestForRange(range: '7d' | '30d' | '90d') {
  mockRequest.mockImplementation((path: string) => {
    if (path === `/analytics?range=${range}`) return Promise.resolve({ ...overview, range });
    if (path === `/analytics/commands?range=${range}`) return Promise.resolve({ ...commands, range });
    if (path === `/analytics/sessions?range=${range}`) return Promise.resolve({ ...sessions, range });
    if (path === `/analytics/os?range=${range}`) return Promise.resolve({ ...os, range });
    if (path === `/analytics/referrers?range=${range}`) return Promise.resolve({ ...referrers, range });
    return Promise.reject(new Error(`Unexpected path: ${path}`));
  });
}

describe('useAnalytics', () => {
  beforeEach(() => {
    mockRequest.mockReset();
    mockRequestForRange('30d');
  });

  it('starts in loading state', () => {
    mockRequest.mockImplementation(() => new Promise(() => {}));

    const { result } = renderHook(() => useAnalytics('30d'));

    expect(result.current.status).toBe('loading');
  });

  it('resolves to success with data from all five endpoints', async () => {
    const { result } = renderHook(() => useAnalytics('30d'));

    await waitFor(() => {
      expect(result.current.status).toBe('success');
    });

    if (result.current.status !== 'success') {
      throw new Error('Expected success state');
    }

    expect(result.current.data).toEqual({
      overview,
      commands,
      sessions,
      os,
      referrers,
    });
    expect(mockRequest).toHaveBeenCalledTimes(5);
  });

  it('sets error state when any endpoint rejects', async () => {
    mockRequest.mockImplementation((path: string) => {
      if (path === '/analytics/sessions?range=30d') {
        return Promise.reject(new Error('Sessions failed'));
      }
      return Promise.resolve({});
    });

    const { result } = renderHook(() => useAnalytics('30d'));

    await waitFor(() => {
      expect(result.current.status).toBe('error');
    });

    if (result.current.status !== 'error') {
      throw new Error('Expected error state');
    }

    expect(result.current.message).toBe('Sessions failed');
  });

  it('refetches when range changes', async () => {
    mockRequestForRange('7d');

    const { result, rerender } = renderHook(({ range }: { range: RangeKey }) => useAnalytics(range), {
      initialProps: { range: '7d' as RangeKey },
    });

    await waitFor(() => {
      expect(result.current.status).toBe('success');
    });

    mockRequest.mockClear();
    mockRequestForRange('30d');
    rerender({ range: '30d' });

    await waitFor(() => {
      expect(mockRequest).toHaveBeenCalledWith('/analytics?range=30d');
    });
    expect(mockRequest).toHaveBeenCalledTimes(5);
  });

  it('does not update state after unmount during fetch', async () => {
    const consoleError = jest.spyOn(console, 'error').mockImplementation(() => {});

    let resolveRequest: ((value: unknown) => void) | undefined;
    mockRequest.mockImplementation(
      () =>
        new Promise((resolve) => {
          resolveRequest = resolve;
        }),
    );

    const { unmount } = renderHook(() => useAnalytics('30d'));
    unmount();

    await act(async () => {
      resolveRequest?.({});
      await Promise.resolve();
    });

    expect(consoleError).not.toHaveBeenCalled();
    consoleError.mockRestore();
  });

  it('does not fetch when disabled', () => {
    const { result } = renderHook(() => useAnalytics('30d', false));

    expect(result.current.status).toBe('idle');
    expect(mockRequest).not.toHaveBeenCalled();
  });

  it('refetch triggers a new round of five calls with the same range', async () => {
    const { result } = renderHook(() => useAnalytics('30d'));

    await waitFor(() => {
      expect(result.current.status).toBe('success');
    });

    mockRequest.mockClear();
    mockRequestForRange('30d');

    act(() => {
      result.current.refetch();
    });

    await waitFor(() => {
      expect(mockRequest).toHaveBeenCalledTimes(5);
    });
    expect(mockRequest).toHaveBeenCalledWith('/analytics?range=30d');
  });
});

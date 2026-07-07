import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

const mockLogout = jest.fn();
const mockRefetch = jest.fn();
const mockUseAuth = jest.fn();
const mockUseAnalytics = jest.fn();

jest.mock('@/lib/auth/useAuth', () => ({
  useAuth: () => mockUseAuth(),
}));

jest.mock('@/lib/hooks/useAnalytics', () => ({
  useAnalytics: (...args: unknown[]) => mockUseAnalytics(...args),
}));

import { DashboardScreen } from '@/components/Dashboard/DashboardScreen';

const mockData = {
  overview: {
    range: '30d' as const,
    kpis: {
      total_sessions: 482,
      total_page_views: 1893,
      total_commands: 3120,
      unique_visitors: 341,
      avg_session_duration_seconds: 187,
    },
    daily: [
      { date: '2026-07-04', sessions: 10, page_views: 40 },
      { date: '2026-07-05', sessions: 15, page_views: 50 },
    ],
  },
  commands: {
    range: '30d' as const,
    total_commands: 3120,
    top_commands: [
      { command: 'help', count: 812 },
      { command: 'about', count: 420 },
    ],
  },
  sessions: {
    range: '30d' as const,
    total_sessions: 482,
    avg_duration_seconds: 187,
    median_duration_seconds: 142,
    duration_buckets: [],
    recent_sessions: [
      {
        session_id: 'b3f1c2d4-e5f6-7890-abcd-ef1234567890',
        os: 'macOS' as const,
        device_type: 'desktop' as const,
        referrer: 'github.com',
        commands_count: 8,
        duration_seconds: 245,
        started_at: '2026-07-06T14:02:00Z',
        ended_at: '2026-07-06T14:06:05Z',
      },
    ],
  },
  os: {
    range: '30d' as const,
    by_os: [{ os: 'macOS', count: 210, percentage: 43.6 }],
    by_device: [{ device_type: 'desktop', count: 390, percentage: 80.9 }],
  },
  referrers: {
    range: '30d' as const,
    direct_count: 140,
    top_referrers: [{ referrer: 'github.com', count: 88 }],
  },
};

describe('DashboardScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUseAuth.mockReturnValue({
      status: 'signed-in',
      user: { email: 'admin@example.com' },
      logout: mockLogout,
    });
    mockUseAnalytics.mockReturnValue({
      status: 'loading',
      refetch: mockRefetch,
    });
  });

  it('renders KPI cards in loading state when analytics is loading', () => {
    render(<DashboardScreen />);

    expect(screen.getAllByTestId('kpi-skeleton')).toHaveLength(5);
  });

  it('renders error message and try again button', () => {
    mockUseAnalytics.mockReturnValue({
      status: 'error',
      message: 'Failed to load analytics.',
      refetch: mockRefetch,
    });

    render(<DashboardScreen />);

    expect(screen.getByRole('alert')).toHaveTextContent('Failed to load analytics.');
    fireEvent.click(screen.getByRole('button', { name: /try again/i }));
    expect(mockRefetch).toHaveBeenCalled();
  });

  it('renders populated dashboard when analytics succeeds', () => {
    mockUseAnalytics.mockReturnValue({
      status: 'success',
      data: mockData,
      refetch: mockRefetch,
    });

    render(<DashboardScreen />);

    expect(screen.getByText('482')).toBeInTheDocument();
    expect(screen.getByText('341')).toBeInTheDocument();
    expect(screen.getByText('1,893')).toBeInTheDocument();
    expect(screen.getByText('3,120')).toBeInTheDocument();
    expect(screen.getByText('3m 07s')).toBeInTheDocument();
    expect(screen.getByText('Visitors over time')).toBeInTheDocument();
    expect(screen.getByText('OS Breakdown')).toBeInTheDocument();
    expect(screen.getByText('Device Breakdown')).toBeInTheDocument();
    expect(screen.getByText('Top Referrers')).toBeInTheDocument();
    expect(screen.getByText('Top Commands')).toBeInTheDocument();
    expect(screen.getByText('b3f1c2d4…')).toBeInTheDocument();
  });

  it('calls useAnalytics with updated range when range toggle clicked', async () => {
    mockUseAnalytics.mockReturnValue({
      status: 'success',
      data: mockData,
      refetch: mockRefetch,
    });

    render(<DashboardScreen />);

    await userEvent.click(screen.getByRole('button', { name: '7d' }));

    expect(mockUseAnalytics).toHaveBeenLastCalledWith('7d');
  });

  it('calls logout when exit button clicked', async () => {
    render(<DashboardScreen />);

    await userEvent.click(screen.getByRole('button', { name: /\$ exit/i }));

    expect(mockLogout).toHaveBeenCalled();
  });

  it('shows demo mode on KPI cards when auth status is demo', () => {
    mockUseAuth.mockReturnValue({
      status: 'demo',
      user: null,
      logout: mockLogout,
    });
    mockUseAnalytics.mockReturnValue({
      status: 'loading',
      refetch: mockRefetch,
    });

    render(<DashboardScreen />);

    expect(screen.getAllByText('demo mode')).toHaveLength(5);
  });
});

import { render, screen } from '@testing-library/react';

const mockReplace = jest.fn();

jest.mock('next/navigation', () => ({
  useRouter: () => ({ replace: mockReplace, push: jest.fn() }),
}));

const mockUseAuth = jest.fn();

jest.mock('@/lib/auth/useAuth', () => ({
  useAuth: () => mockUseAuth(),
}));

jest.mock('@/lib/hooks/useAnalytics', () => ({
  useAnalytics: () => ({ status: 'loading', refetch: jest.fn() }),
}));

import DashboardPage from '@/app/dashboard/page';

describe('DashboardPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders DashboardScreen when status is signed-in', () => {
    mockUseAuth.mockReturnValue({
      status: 'signed-in',
      user: { email: 'admin@example.com' },
      logout: jest.fn(),
    });

    render(<DashboardPage />);

    expect(screen.getByTestId('dashboard-screen')).toBeInTheDocument();
    expect(screen.getByText('$ analytics --dashboard')).toBeInTheDocument();
    expect(screen.queryByTestId('dashboard-stub')).not.toBeInTheDocument();
    expect(mockReplace).not.toHaveBeenCalled();
  });

  it('renders DashboardScreen when status is demo', () => {
    mockUseAuth.mockReturnValue({
      status: 'demo',
      user: null,
      logout: jest.fn(),
    });

    render(<DashboardPage />);

    expect(screen.getByTestId('dashboard-screen')).toBeInTheDocument();
    expect(mockReplace).not.toHaveBeenCalled();
  });

  it('redirects to /login when status is signed-out', () => {
    mockUseAuth.mockReturnValue({
      status: 'signed-out',
      user: null,
      logout: jest.fn(),
    });

    const { container } = render(<DashboardPage />);

    expect(container.firstChild).toBeNull();
    expect(mockReplace).toHaveBeenCalledWith('/login');
  });

  it('renders nothing while status is checking', () => {
    mockUseAuth.mockReturnValue({
      status: 'checking',
      user: null,
      logout: jest.fn(),
    });

    const { container } = render(<DashboardPage />);

    expect(container.firstChild).toBeNull();
    expect(mockReplace).not.toHaveBeenCalled();
  });
});

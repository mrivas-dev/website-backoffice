import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

const mockReplace = jest.fn();
const mockLogin = jest.fn();
const mockUseMediaQuery = jest.fn();

jest.mock('next/navigation', () => ({
  useRouter: () => ({ replace: mockReplace, push: jest.fn() }),
}));

jest.mock('@/lib/auth/useAuth', () => ({
  useAuth: () => ({ login: mockLogin }),
}));

jest.mock('@/lib/hooks/useMediaQuery', () => ({
  useMediaQuery: (...args: unknown[]) => mockUseMediaQuery(...args),
}));

const mockEnv = { apiBaseUrl: 'http://test.api/api/v1', allowDemoLogin: false };

jest.mock('@/lib/env', () => ({
  get env() {
    return mockEnv;
  },
}));

jest.mock('@/components/Login/LoginScreenDesktop', () => ({
  LoginScreenDesktop: (props: {
    email: string;
    password: string;
    error: string | null;
    submitting: boolean;
    buttonText: string;
    onEmailChange: (v: string) => void;
    onPasswordChange: (v: string) => void;
    onKeyDown: (e: React.KeyboardEvent) => void;
    onSubmit: () => void;
  }) => (
    <div data-testid="desktop-layout">
      {props.error && <div>{props.error}</div>}
      <input
        aria-label="Email"
        value={props.email}
        onChange={(e) => props.onEmailChange(e.target.value)}
        onKeyDown={props.onKeyDown}
      />
      <input
        aria-label="Password"
        value={props.password}
        onChange={(e) => props.onPasswordChange(e.target.value)}
        onKeyDown={props.onKeyDown}
      />
      <button onClick={props.onSubmit}>{props.buttonText}</button>
    </div>
  ),
}));

jest.mock('@/components/Login/LoginScreenMobile', () => ({
  LoginScreenMobile: (props: {
    email: string;
    password: string;
    error: string | null;
    submitting: boolean;
    buttonText: string;
    onEmailChange: (v: string) => void;
    onPasswordChange: (v: string) => void;
    onKeyDown: (e: React.KeyboardEvent) => void;
    onSubmit: () => void;
  }) => (
    <div data-testid="mobile-layout">
      {props.error && <div>{props.error}</div>}
      <input
        aria-label="Email"
        value={props.email}
        onChange={(e) => props.onEmailChange(e.target.value)}
        onKeyDown={props.onKeyDown}
      />
      <input
        aria-label="Password"
        value={props.password}
        onChange={(e) => props.onPasswordChange(e.target.value)}
        onKeyDown={props.onKeyDown}
      />
      <button onClick={props.onSubmit}>{props.buttonText}</button>
      {mockEnv.allowDemoLogin && (
        <p>API offline? Any credentials grant demo access.</p>
      )}
    </div>
  ),
}));

import { LoginScreen } from '@/components/Login/LoginScreen';
import { AuthError } from '@/lib/auth/AuthError';

describe('LoginScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockEnv.allowDemoLogin = false;
    mockUseMediaQuery.mockReturnValue(false);
    mockLogin.mockResolvedValue(undefined);
  });

  it('renders desktop layout when useMediaQuery returns false', () => {
    mockUseMediaQuery.mockReturnValue(false);
    render(<LoginScreen />);
    expect(screen.getByTestId('desktop-layout')).toBeInTheDocument();
  });

  it('renders mobile layout when useMediaQuery returns true', () => {
    mockUseMediaQuery.mockReturnValue(true);
    render(<LoginScreen />);
    expect(screen.getByTestId('mobile-layout')).toBeInTheDocument();
  });

  it('shows validation error for empty fields without calling login', async () => {
    render(<LoginScreen />);
    await userEvent.click(screen.getByRole('button', { name: 'Sign in →' }));
    expect(screen.getByText('Please enter your email and password.')).toBeInTheDocument();
    expect(mockLogin).not.toHaveBeenCalled();
  });

  it('navigates to /dashboard on successful login', async () => {
    render(<LoginScreen />);
    await userEvent.type(screen.getByLabelText('Email'), 'admin@example.com');
    await userEvent.type(screen.getByLabelText('Password'), 'password');
    await userEvent.click(screen.getByRole('button', { name: 'Sign in →' }));

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith('admin@example.com', 'password');
      expect(mockReplace).toHaveBeenCalledWith('/dashboard');
    });
  });

  it('shows invalid credentials message on AuthError invalid-credentials', async () => {
    mockLogin.mockRejectedValue(new AuthError('invalid-credentials'));
    render(<LoginScreen />);
    await userEvent.type(screen.getByLabelText('Email'), 'admin@example.com');
    await userEvent.type(screen.getByLabelText('Password'), 'wrong');
    await userEvent.click(screen.getByRole('button', { name: 'Sign in →' }));

    await waitFor(() => {
      expect(screen.getByText('Invalid email or password.')).toBeInTheDocument();
    });
  });

  it('shows unreachable message on AuthError unreachable', async () => {
    mockLogin.mockRejectedValue(new AuthError('unreachable'));
    render(<LoginScreen />);
    await userEvent.type(screen.getByLabelText('Email'), 'admin@example.com');
    await userEvent.type(screen.getByLabelText('Password'), 'password');
    await userEvent.click(screen.getByRole('button', { name: 'Sign in →' }));

    await waitFor(() => {
      expect(
        screen.getByText('Unable to reach the server. Please try again.'),
      ).toBeInTheDocument();
    });
  });

  it('shows rate-limit message on AuthError rate-limited', async () => {
    mockLogin.mockRejectedValue(new AuthError('rate-limited'));
    render(<LoginScreen />);
    await userEvent.type(screen.getByLabelText('Email'), 'admin@example.com');
    await userEvent.type(screen.getByLabelText('Password'), 'password');
    await userEvent.click(screen.getByRole('button', { name: 'Sign in →' }));

    await waitFor(() => {
      expect(
        screen.getByText('Too many attempts. Please wait a minute and try again.'),
      ).toBeInTheDocument();
    });
  });

  it('shows signing in... while login promise is pending', async () => {
    let resolveLogin: () => void;
    mockLogin.mockImplementation(
      () =>
        new Promise<void>((resolve) => {
          resolveLogin = resolve;
        }),
    );

    render(<LoginScreen />);
    await userEvent.type(screen.getByLabelText('Email'), 'admin@example.com');
    await userEvent.type(screen.getByLabelText('Password'), 'password');
    await userEvent.click(screen.getByRole('button', { name: 'Sign in →' }));

    expect(screen.getByRole('button', { name: 'signing in...' })).toBeInTheDocument();

    await act(async () => {
      resolveLogin!();
    });

    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'Sign in →' })).toBeInTheDocument();
    });
  });

  it('submits when Enter is pressed in email field', async () => {
    render(<LoginScreen />);
    const emailInput = screen.getByLabelText('Email');
    await userEvent.type(emailInput, 'admin@example.com');
    await userEvent.type(screen.getByLabelText('Password'), 'password');
    fireEvent.keyDown(emailInput, { key: 'Enter' });

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith('admin@example.com', 'password');
    });
  });

  it('shows demo footnote on mobile when allowDemoLogin is true', () => {
    mockEnv.allowDemoLogin = true;
    mockUseMediaQuery.mockReturnValue(true);
    render(<LoginScreen />);
    expect(
      screen.getByText('API offline? Any credentials grant demo access.'),
    ).toBeInTheDocument();
  });

  it('hides demo footnote when allowDemoLogin is false', () => {
    mockEnv.allowDemoLogin = false;
    mockUseMediaQuery.mockReturnValue(true);
    render(<LoginScreen />);
    expect(
      screen.queryByText('API offline? Any credentials grant demo access.'),
    ).not.toBeInTheDocument();
  });
});

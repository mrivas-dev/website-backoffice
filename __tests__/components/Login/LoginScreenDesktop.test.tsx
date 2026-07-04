import { render, screen } from '@testing-library/react';
import { LoginScreenDesktop } from '@/components/Login/LoginScreenDesktop';
import type { LoginScreenProps } from '@/components/Login/types';

const mockEnv = { apiBaseUrl: 'http://test.api/api/v1', allowDemoLogin: false };

jest.mock('@/lib/env', () => ({
  get env() {
    return mockEnv;
  },
}));

const baseProps: LoginScreenProps = {
  email: '',
  password: '',
  error: null,
  submitting: false,
  onEmailChange: jest.fn(),
  onPasswordChange: jest.fn(),
  onKeyDown: jest.fn(),
  onSubmit: jest.fn(),
  buttonText: 'Sign in →',
};

describe('LoginScreenDesktop', () => {
  it('renders heading, subheading, labels, and placeholders', () => {
    render(<LoginScreenDesktop {...baseProps} />);

    expect(screen.getByText('$ analytics --login')).toBeInTheDocument();
    expect(screen.getByText('Portfolio Dashboard')).toBeInTheDocument();
    expect(screen.getByLabelText('Email')).toBeInTheDocument();
    expect(screen.getByLabelText('Password')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('admin@portfolio.dev')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('••••••••')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Sign in →' })).toBeInTheDocument();
  });

  it('does not render demo footnote when allowDemoLogin is false', () => {
    render(<LoginScreenDesktop {...baseProps} />);
    expect(
      screen.queryByText('API offline? Any credentials grant demo access.'),
    ).not.toBeInTheDocument();
  });

  it('renders error banner when error is set', () => {
    render(<LoginScreenDesktop {...baseProps} error="Invalid email or password." />);
    expect(screen.getByText('Invalid email or password.')).toBeInTheDocument();
  });
});

describe('LoginScreenDesktop demo footnote', () => {
  it('renders demo footnote when allowDemoLogin is true', () => {
    mockEnv.allowDemoLogin = true;
    render(<LoginScreenDesktop {...baseProps} />);
    expect(
      screen.getByText('API offline? Any credentials grant demo access.'),
    ).toBeInTheDocument();
    mockEnv.allowDemoLogin = false;
  });
});

import { render, screen } from '@testing-library/react';
import { LoginScreenMobile } from '@/components/Login/LoginScreenMobile';
import type { LoginScreenProps } from '@/components/Login/types';

jest.mock('@/lib/env', () => ({
  env: { apiBaseUrl: 'http://test.api/api/v1', allowDemoLogin: false },
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

describe('LoginScreenMobile', () => {
  it('renders hero terminal copy and form labels', () => {
    render(<LoginScreenMobile {...baseProps} />);

    expect(screen.getByText('analytics')).toBeInTheDocument();
    expect(screen.getByText('~ node server.js')).toBeInTheDocument();
    expect(screen.getByText('listening on :3000')).toBeInTheDocument();
    expect(screen.getByText('db connected')).toBeInTheDocument();
    expect(screen.getByText('~ curl /api/analytics')).toBeInTheDocument();
    expect(screen.getByText('{"status":"auth required"}')).toBeInTheDocument();
    expect(screen.getByText('Portfolio Analytics')).toBeInTheDocument();
    expect(screen.getByText('sign in to continue')).toBeInTheDocument();
    expect(screen.getByLabelText('Email')).toBeInTheDocument();
    expect(screen.getByLabelText('Password')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('admin@portfolio.dev')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('••••••••')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Sign in →' })).toBeInTheDocument();
  });

  it('renders blinking cursor in terminal', () => {
    render(<LoginScreenMobile {...baseProps} />);
    expect(screen.getByText('▋')).toBeInTheDocument();
  });

  it('renders error banner when error is set', () => {
    render(<LoginScreenMobile {...baseProps} error="Invalid email or password." />);
    expect(screen.getByText('Invalid email or password.')).toBeInTheDocument();
  });
});

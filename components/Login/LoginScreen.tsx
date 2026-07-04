'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth/useAuth';
import { AuthError } from '@/lib/auth/AuthError';
import { useMediaQuery } from '@/lib/hooks/useMediaQuery';
import { LoginScreenDesktop } from '@/components/Login/LoginScreenDesktop';
import { LoginScreenMobile } from '@/components/Login/LoginScreenMobile';

export function LoginScreen() {
  const { login } = useAuth();
  const router = useRouter();
  const isMobile = useMediaQuery('(max-width: 767px)');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit() {
    if (!email || !password) {
      setError('Please enter your email and password.');
      return;
    }
    setSubmitting(true);
    setError(null);
    try {
      await login(email, password);
      router.replace('/dashboard');
    } catch (e) {
      if (e instanceof AuthError && e.kind === 'invalid-credentials') {
        setError('Invalid email or password.');
      } else if (e instanceof AuthError && e.kind === 'unreachable') {
        setError('Unable to reach the server. Please try again.');
      } else {
        setError('Something went wrong. Please try again.');
      }
    } finally {
      setSubmitting(false);
    }
  }

  const props = {
    email,
    password,
    error,
    submitting,
    onEmailChange: (v: string) => setEmail(v),
    onPasswordChange: (v: string) => setPassword(v),
    onKeyDown: (e: React.KeyboardEvent) => {
      if (e.key === 'Enter') void handleSubmit();
    },
    onSubmit: () => void handleSubmit(),
    buttonText: submitting ? 'signing in...' : 'Sign in →',
  };

  return isMobile ? <LoginScreenMobile {...props} /> : <LoginScreenDesktop {...props} />;
}

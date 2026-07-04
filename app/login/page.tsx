'use client';

import { useAuth } from '@/lib/auth/useAuth';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { LoginScreen } from '@/components/Login/LoginScreen';

export default function LoginPage() {
  const { status } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (status === 'signed-in' || status === 'demo') router.replace('/dashboard');
  }, [status, router]);

  if (status !== 'signed-out') return null;

  return <LoginScreen />;
}

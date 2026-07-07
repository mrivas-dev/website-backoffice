'use client';

import { useAuth } from '@/lib/auth/useAuth';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { DashboardScreen } from '@/components/Dashboard/DashboardScreen';

export default function DashboardPage() {
  const { status } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (status === 'signed-out') router.replace('/login');
  }, [status, router]);

  if (status !== 'signed-in' && status !== 'demo') return null;

  return <DashboardScreen />;
}

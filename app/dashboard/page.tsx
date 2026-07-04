'use client';

import { useAuth } from '@/lib/auth/useAuth';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function DashboardPage() {
  const { status, user, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (status === 'signed-out') router.replace('/login');
  }, [status, router]);

  if (status !== 'signed-in' && status !== 'demo') return null;

  return (
    <main data-testid="dashboard-stub">
      <p>Signed in{user ? ` as ${user.email}` : ''}. Dashboard content lands in a later spec.</p>
      <button onClick={logout}>$ exit</button>
    </main>
  );
}

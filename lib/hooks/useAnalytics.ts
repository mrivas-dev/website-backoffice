'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/auth/useAuth';
import {
  analyticsApi,
  type RangeKey,
  type AnalyticsOverview,
  type CommandsBreakdown,
  type SessionsBreakdown,
  type OsBreakdown,
  type ReferrersBreakdown,
} from '@/lib/api/analytics';

interface DashboardData {
  overview: AnalyticsOverview;
  commands: CommandsBreakdown;
  sessions: SessionsBreakdown;
  os: OsBreakdown;
  referrers: ReferrersBreakdown;
}

type State =
  | { status: 'loading' }
  | { status: 'error'; message: string }
  | { status: 'success'; data: DashboardData };

export function useAnalytics(range: RangeKey) {
  const { request } = useAuth();
  const [state, setState] = useState<State>({ status: 'loading' });
  const [reloadToken, setReloadToken] = useState(0);

  useEffect(() => {
    let cancelled = false;
    setState({ status: 'loading' });

    Promise.all([
      analyticsApi.overview(request, range),
      analyticsApi.commands(request, range),
      analyticsApi.sessions(request, range),
      analyticsApi.os(request, range),
      analyticsApi.referrers(request, range),
    ])
      .then(([overview, commands, sessions, os, referrers]) => {
        if (!cancelled) {
          setState({ status: 'success', data: { overview, commands, sessions, os, referrers } });
        }
      })
      .catch((error: unknown) => {
        if (!cancelled) {
          setState({
            status: 'error',
            message: error instanceof Error ? error.message : 'Failed to load analytics.',
          });
        }
      });

    return () => {
      cancelled = true;
    };
  }, [request, range, reloadToken]);

  return { ...state, refetch: () => setReloadToken((n) => n + 1) };
}

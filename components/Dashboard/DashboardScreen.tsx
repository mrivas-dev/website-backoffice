'use client';

import { useState } from 'react';
import { useAuth } from '@/lib/auth/useAuth';
import { useAnalytics } from '@/lib/hooks/useAnalytics';
import { formatDuration } from '@/lib/format/duration';
import { DashboardHeader } from './DashboardHeader';
import { KpiCard } from './KpiCard';
import { VisitorsChart } from './VisitorsChart';
import { RankedBarList } from './RankedBarList';
import { RecentSessionsTable } from './RecentSessionsTable';

const pageStyle: React.CSSProperties = {
  minHeight: '100vh',
  background: '#090912',
  fontFamily: 'var(--font-jetbrains-mono), monospace',
  color: '#e0e0e8',
};

const contentStyle: React.CSSProperties = {
  padding: '24px',
  display: 'flex',
  flexDirection: 'column',
  gap: 24,
};

const kpiRowStyle: React.CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
  gap: 16,
};

const secondaryRowStyle: React.CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
  gap: 16,
};

const errorStyle: React.CSSProperties = {
  fontSize: 12,
  color: '#f87171',
  background: 'rgba(248,113,113,0.07)',
  border: '1px solid rgba(248,113,113,0.25)',
  borderRadius: 4,
  padding: '12px 16px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: 12,
};

const retryButtonStyle: React.CSSProperties = {
  fontSize: 12,
  fontWeight: 700,
  color: '#050510',
  background: '#4ade80',
  border: 'none',
  borderRadius: 4,
  padding: '6px 12px',
  cursor: 'pointer',
};

function formatCount(value: number): string {
  return value.toLocaleString();
}

function buildReferrerRows(
  directCount: number,
  topReferrers: { referrer: string; count: number }[],
) {
  const rows = topReferrers.map((r) => ({ label: r.referrer, count: r.count }));

  if (directCount > 0) {
    rows.push({ label: 'Direct', count: directCount });
  }

  rows.sort((a, b) => b.count - a.count);
  return rows;
}

export function DashboardScreen() {
  const { user, status, logout } = useAuth();
  const [range, setRange] = useState<'7d' | '30d' | '90d'>('30d');
  const analytics = useAnalytics(range, status !== 'demo');
  const isDemo = status === 'demo';
  const isLoading = isDemo ? false : analytics.status === 'loading';
  const data = analytics.status === 'success' ? analytics.data : null;

  return (
    <main data-testid="dashboard-screen" style={pageStyle}>
      <DashboardHeader
        email={user?.email ?? null}
        range={range}
        onRangeChange={setRange}
        onLogout={logout}
      />

      <div style={contentStyle}>
        {analytics.status === 'error' && !isDemo && (
          <div role="alert" style={errorStyle}>
            <p>{analytics.message}</p>
            <button type="button" style={retryButtonStyle} onClick={analytics.refetch}>
              Try again
            </button>
          </div>
        )}

        <div style={kpiRowStyle}>
          <KpiCard
            label="Total Sessions"
            value={formatCount(data?.overview.kpis.total_sessions ?? 0)}
            loading={isLoading}
            demo={isDemo}
          />
          <KpiCard
            label="Unique Visitors"
            value={formatCount(data?.overview.kpis.unique_visitors ?? 0)}
            loading={isLoading}
            demo={isDemo}
          />
          <KpiCard
            label="Page Views"
            value={formatCount(data?.overview.kpis.total_page_views ?? 0)}
            loading={isLoading}
            demo={isDemo}
          />
          <KpiCard
            label="Commands Run"
            value={formatCount(data?.overview.kpis.total_commands ?? 0)}
            loading={isLoading}
            demo={isDemo}
          />
          <KpiCard
            label="Avg. Session Duration"
            value={formatDuration(data?.overview.kpis.avg_session_duration_seconds ?? 0)}
            loading={isLoading}
            demo={isDemo}
          />
        </div>

        {data && <VisitorsChart daily={data.overview.daily} />}

        {data && (
          <div style={secondaryRowStyle}>
            <RankedBarList
              title="OS Breakdown"
              rows={data.os.by_os.map((row) => ({
                label: row.os,
                count: row.count,
                percentage: row.percentage,
              }))}
              emptyLabel="No sessions yet"
            />
            <RankedBarList
              title="Device Breakdown"
              rows={data.os.by_device.map((row) => ({
                label: row.device_type,
                count: row.count,
                percentage: row.percentage,
              }))}
              emptyLabel="No sessions yet"
            />
            <RankedBarList
              title="Top Referrers"
              rows={buildReferrerRows(data.referrers.direct_count, data.referrers.top_referrers)}
              emptyLabel="No referrers yet"
            />
          </div>
        )}

        {data && (
          <RankedBarList
            title="Top Commands"
            rows={data.commands.top_commands.map((row) => ({
              label: row.command,
              count: row.count,
            }))}
            emptyLabel="No commands yet"
          />
        )}

        {data && <RecentSessionsTable sessions={data.sessions.recent_sessions} />}
      </div>
    </main>
  );
}

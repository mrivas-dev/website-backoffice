export type RangeKey = '7d' | '30d' | '90d';

export interface DailyPoint {
  date: string;
  sessions: number;
  page_views: number;
}

export interface AnalyticsOverview {
  range: RangeKey;
  kpis: {
    total_sessions: number;
    total_page_views: number;
    total_commands: number;
    unique_visitors: number;
    avg_session_duration_seconds: number;
  };
  daily: DailyPoint[];
}

export interface CommandCount {
  command: string;
  count: number;
}

export interface CommandsBreakdown {
  range: RangeKey;
  total_commands: number;
  top_commands: CommandCount[];
}

export interface RecentSession {
  session_id: string;
  os: 'macOS' | 'Linux' | 'Windows' | null;
  device_type: 'desktop' | 'mobile' | null;
  referrer: string | null;
  commands_count: number;
  duration_seconds: number | null;
  started_at: string;
  ended_at: string | null;
}

export interface SessionsBreakdown {
  range: RangeKey;
  total_sessions: number;
  avg_duration_seconds: number;
  median_duration_seconds: number;
  duration_buckets: { label: string; count: number }[];
  recent_sessions: RecentSession[];
}

export interface OsBreakdown {
  range: RangeKey;
  by_os: { os: string; count: number; percentage: number }[];
  by_device: { device_type: string; count: number; percentage: number }[];
}

export interface ReferrersBreakdown {
  range: RangeKey;
  direct_count: number;
  top_referrers: { referrer: string; count: number }[];
}

type Requester = <T>(path: string, init?: RequestInit) => Promise<T>;

export const analyticsApi = {
  overview: (request: Requester, range: RangeKey) =>
    request<AnalyticsOverview>(`/analytics?range=${range}`),

  commands: (request: Requester, range: RangeKey) =>
    request<CommandsBreakdown>(`/analytics/commands?range=${range}`),

  sessions: (request: Requester, range: RangeKey) =>
    request<SessionsBreakdown>(`/analytics/sessions?range=${range}`),

  os: (request: Requester, range: RangeKey) =>
    request<OsBreakdown>(`/analytics/os?range=${range}`),

  referrers: (request: Requester, range: RangeKey) =>
    request<ReferrersBreakdown>(`/analytics/referrers?range=${range}`),
};

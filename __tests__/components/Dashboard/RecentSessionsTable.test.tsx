import { render, screen } from '@testing-library/react';
import { RecentSessionsTable } from '@/components/Dashboard/RecentSessionsTable';
import type { RecentSession } from '@/lib/api/analytics';

const sessions: RecentSession[] = [
  {
    session_id: 'b3f1c2d4-e5f6-7890-abcd-ef1234567890',
    os: 'macOS',
    device_type: 'desktop',
    referrer: 'github.com',
    commands_count: 8,
    duration_seconds: 245,
    started_at: '2026-07-06T14:02:00Z',
    ended_at: '2026-07-06T14:06:05Z',
  },
  {
    session_id: 'a1b2c3d4-e5f6-7890-abcd-ef1234567891',
    os: 'Linux',
    device_type: 'mobile',
    referrer: null,
    commands_count: 3,
    duration_seconds: null,
    started_at: '2026-07-06T14:48:00Z',
    ended_at: null,
  },
];

describe('RecentSessionsTable', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date('2026-07-06T15:00:00Z'));
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('renders a row per session', () => {
    render(<RecentSessionsTable sessions={sessions} />);

    expect(screen.getByText('b3f1c2d4…')).toBeInTheDocument();
    expect(screen.getByText('github.com')).toBeInTheDocument();
    expect(screen.getByText('Direct')).toBeInTheDocument();
  });

  it('renders active for sessions with null duration_seconds', () => {
    render(<RecentSessionsTable sessions={sessions} />);

    expect(screen.getByText('active')).toBeInTheDocument();
  });

  it('renders no sessions message when empty', () => {
    render(<RecentSessionsTable sessions={[]} />);

    expect(screen.getByText('No sessions in this range')).toBeInTheDocument();
  });
});

import type { RecentSession } from '@/lib/api/analytics';
import { formatDuration } from '@/lib/format/duration';
import { formatRelativeTime } from '@/lib/format/relativeTime';

interface RecentSessionsTableProps {
  sessions: RecentSession[];
}

const panelStyle: React.CSSProperties = {
  background: '#0d0d1a',
  border: '1px solid #1a1a2e',
  borderRadius: 6,
  padding: '20px 24px',
};

const titleStyle: React.CSSProperties = {
  fontSize: 10,
  textTransform: 'uppercase',
  letterSpacing: '0.09em',
  color: '#3a3a5c',
  marginBottom: 16,
};

const tableStyle: React.CSSProperties = {
  width: '100%',
  borderCollapse: 'collapse',
  fontSize: 12,
};

const thStyle: React.CSSProperties = {
  textAlign: 'left',
  color: '#3a3a5c',
  fontSize: 10,
  textTransform: 'uppercase',
  letterSpacing: '0.09em',
  padding: '8px 12px 8px 0',
  borderBottom: '1px solid #1a1a2e',
};

const tdStyle: React.CSSProperties = {
  color: '#e0e0e8',
  padding: '10px 12px 10px 0',
  borderBottom: '1px solid #1a1a2e',
};

const activeStyle: React.CSSProperties = {
  color: '#4ade80',
  fontWeight: 700,
};

function truncateSessionId(id: string): string {
  return `${id.slice(0, 8)}…`;
}

export function RecentSessionsTable({ sessions }: RecentSessionsTableProps) {
  return (
    <div style={panelStyle}>
      <div style={titleStyle}>Recent sessions</div>
      {sessions.length === 0 ? (
        <div style={{ fontSize: 12, color: '#3a3a5c' }}>No sessions in this range</div>
      ) : (
        <table style={tableStyle}>
          <thead>
            <tr>
              <th style={thStyle}>Session</th>
              <th style={thStyle}>OS</th>
              <th style={thStyle}>Device</th>
              <th style={thStyle}>Referrer</th>
              <th style={thStyle}>Commands</th>
              <th style={thStyle}>Duration</th>
              <th style={thStyle}>Started</th>
            </tr>
          </thead>
          <tbody>
            {sessions.map((session) => (
              <tr key={session.session_id}>
                <td style={tdStyle}>{truncateSessionId(session.session_id)}</td>
                <td style={tdStyle}>{session.os ?? '—'}</td>
                <td style={tdStyle}>{session.device_type ?? '—'}</td>
                <td style={tdStyle}>{session.referrer ?? 'Direct'}</td>
                <td style={tdStyle}>{session.commands_count}</td>
                <td style={tdStyle}>
                  {session.duration_seconds === null ? (
                    <span style={activeStyle}>active</span>
                  ) : (
                    formatDuration(session.duration_seconds)
                  )}
                </td>
                <td style={tdStyle}>{formatRelativeTime(session.started_at)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

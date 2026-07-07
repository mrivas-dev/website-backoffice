import type { RangeKey } from '@/lib/api/analytics';
import { RangeToggle } from './RangeToggle';

interface DashboardHeaderProps {
  email: string | null;
  range: RangeKey;
  onRangeChange: (range: RangeKey) => void;
  onLogout: () => void;
}

const headerStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: 16,
  padding: '14px 24px',
  background: '#0d0d1a',
  borderBottom: '1px solid #1a1a2e',
};

const headingStyle: React.CSSProperties = {
  fontSize: 15,
  fontWeight: 700,
  color: '#4ade80',
  letterSpacing: '-0.02em',
};

const rightStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: 16,
};

const emailStyle: React.CSSProperties = {
  fontSize: 12,
  color: '#3a3a5c',
};

const logoutStyle: React.CSSProperties = {
  fontSize: 12,
  color: '#4ade80',
  background: 'transparent',
  border: 'none',
  cursor: 'pointer',
  padding: 0,
};

export function DashboardHeader({
  email,
  range,
  onRangeChange,
  onLogout,
}: DashboardHeaderProps) {
  return (
    <header style={headerStyle}>
      <div style={headingStyle}>$ analytics --dashboard</div>
      <RangeToggle value={range} onChange={onRangeChange} />
      <div style={rightStyle}>
        {email && <span style={emailStyle}>{email}</span>}
        <button type="button" style={logoutStyle} onClick={onLogout}>
          $ exit
        </button>
      </div>
    </header>
  );
}

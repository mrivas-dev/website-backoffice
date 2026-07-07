interface KpiCardProps {
  label: string;
  value: string;
  loading?: boolean;
  demo?: boolean;
}

const cardStyle: React.CSSProperties = {
  background: '#0d0d1a',
  border: '1px solid #1a1a2e',
  borderRadius: 6,
  padding: '16px 20px',
};

const labelStyle: React.CSSProperties = {
  fontSize: 10,
  textTransform: 'uppercase',
  letterSpacing: '0.09em',
  color: '#3a3a5c',
  marginBottom: 8,
};

const valueStyle: React.CSSProperties = {
  fontSize: 22,
  fontWeight: 700,
  color: '#4ade80',
};

const skeletonStyle: React.CSSProperties = {
  height: 28,
  width: '60%',
  background: '#1a1a2e',
  borderRadius: 4,
  animation: 'pulse 1.5s ease-in-out infinite',
};

const demoNoteStyle: React.CSSProperties = {
  fontSize: 10,
  color: '#3a3a5c',
  marginTop: 4,
};

export function KpiCard({ label, value, loading, demo }: KpiCardProps) {
  return (
    <div style={cardStyle}>
      <div style={labelStyle}>{label}</div>
      {loading ? (
        <div data-testid="kpi-skeleton" style={skeletonStyle} />
      ) : demo ? (
        <>
          <div style={valueStyle}>—</div>
          <div style={demoNoteStyle}>demo mode</div>
        </>
      ) : (
        <div style={valueStyle}>{value}</div>
      )}
    </div>
  );
}

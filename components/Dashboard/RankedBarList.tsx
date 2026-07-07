interface RankedBarListProps {
  title: string;
  rows: { label: string; count: number; percentage?: number }[];
  emptyLabel?: string;
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

const rowStyle: React.CSSProperties = {
  marginBottom: 12,
};

const rowHeaderStyle: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  fontSize: 12,
  color: '#e0e0e8',
  marginBottom: 4,
};

const barTrackStyle: React.CSSProperties = {
  height: 4,
  background: '#1a1a2e',
  borderRadius: 2,
};

const emptyStyle: React.CSSProperties = {
  fontSize: 12,
  color: '#3a3a5c',
};

export function RankedBarList({ title, rows, emptyLabel }: RankedBarListProps) {
  const maxCount = Math.max(...rows.map((r) => r.count), 0);

  return (
    <div style={panelStyle}>
      <div style={titleStyle}>{title}</div>
      {rows.length === 0 ? (
        <div style={emptyStyle}>{emptyLabel ?? 'No data'}</div>
      ) : (
        rows.map((row) => {
          const widthPercent = maxCount === 0 ? 0 : (row.count / maxCount) * 100;
          return (
            <div key={row.label} style={rowStyle}>
              <div style={rowHeaderStyle}>
                <span>{row.label}</span>
                <span>
                  {row.count.toLocaleString()}
                  {row.percentage !== undefined ? ` · ${row.percentage}%` : ''}
                </span>
              </div>
              <div style={barTrackStyle}>
                <div
                  data-testid="ranked-bar-fill"
                  style={{
                    height: '100%',
                    width: `${widthPercent}%`,
                    background: '#4ade80',
                    borderRadius: 2,
                    opacity: 0.7,
                  }}
                />
              </div>
            </div>
          );
        })
      )}
    </div>
  );
}

import type { DailyPoint } from '@/lib/api/analytics';

interface VisitorsChartProps {
  daily: DailyPoint[];
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

const legendStyle: React.CSSProperties = {
  display: 'flex',
  gap: 16,
  marginTop: 12,
  fontSize: 11,
  color: '#3a3a5c',
};

const CHART_WIDTH = 800;
const CHART_HEIGHT = 180;
const PADDING = { top: 10, right: 20, bottom: 24, left: 40 };

function formatAxisDate(date: string): string {
  const [, month, day] = date.split('-');
  return `${month}/${day}`;
}

function buildPoints(
  daily: DailyPoint[],
  key: 'sessions' | 'page_views',
  maxValue: number,
): string {
  if (daily.length === 0) return '';

  const plotWidth = CHART_WIDTH - PADDING.left - PADDING.right;
  const plotHeight = CHART_HEIGHT - PADDING.top - PADDING.bottom;
  const safeMax = maxValue === 0 ? 1 : maxValue;

  return daily
    .map((point, index) => {
      const x =
        PADDING.left +
        (daily.length === 1 ? plotWidth / 2 : (index / (daily.length - 1)) * plotWidth);
      const y =
        PADDING.top + plotHeight - (point[key] / safeMax) * plotHeight;
      return `${x},${y}`;
    })
    .join(' ');
}

export function VisitorsChart({ daily }: VisitorsChartProps) {
  const maxValue = Math.max(
    ...daily.flatMap((d) => [d.sessions, d.page_views]),
    0,
  );

  const sessionsPoints = buildPoints(daily, 'sessions', maxValue);
  const pageViewsPoints = buildPoints(daily, 'page_views', maxValue);

  const axisLabels =
    daily.length === 0
      ? []
      : daily.length === 1
        ? [daily[0]]
        : [daily[0], daily[Math.floor(daily.length / 2)], daily[daily.length - 1]];

  return (
    <div style={panelStyle}>
      <div style={titleStyle}>Visitors over time</div>
      <svg
        viewBox={`0 0 ${CHART_WIDTH} ${CHART_HEIGHT}`}
        width="100%"
        height={CHART_HEIGHT}
        role="img"
        aria-label="Visitors over time chart"
      >
        {pageViewsPoints && (
          <polyline
            points={pageViewsPoints}
            fill="none"
            stroke="#2a5a3a"
            strokeWidth={1.5}
          />
        )}
        {sessionsPoints && (
          <polyline
            points={sessionsPoints}
            fill="none"
            stroke="#4ade80"
            strokeWidth={2.5}
          />
        )}
        {axisLabels.map((point) => {
          const index = daily.indexOf(point);
          const plotWidth = CHART_WIDTH - PADDING.left - PADDING.right;
          const x =
            PADDING.left +
            (daily.length === 1 ? plotWidth / 2 : (index / (daily.length - 1)) * plotWidth);
          return (
            <text
              key={point.date}
              x={x}
              y={CHART_HEIGHT - 4}
              fill="#3a3a5c"
              fontSize={10}
              textAnchor="middle"
            >
              {formatAxisDate(point.date)}
            </text>
          );
        })}
      </svg>
      <div style={legendStyle}>
        <span>
          <span style={{ color: '#4ade80' }}>●</span> Sessions
        </span>
        <span>
          <span style={{ color: '#2a5a3a' }}>●</span> Page views
        </span>
      </div>
    </div>
  );
}

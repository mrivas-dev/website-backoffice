import type { RangeKey } from '@/lib/api/analytics';

interface RangeToggleProps {
  value: RangeKey;
  onChange: (range: RangeKey) => void;
}

const containerStyle: React.CSSProperties = {
  display: 'flex',
  gap: 4,
};

const ranges: RangeKey[] = ['7d', '30d', '90d'];

function pillStyle(active: boolean): React.CSSProperties {
  return {
    fontSize: 11,
    fontWeight: 700,
    padding: '4px 10px',
    borderRadius: 4,
    border: active ? 'none' : '1px solid #1a1a2e',
    background: active ? '#4ade80' : 'transparent',
    color: active ? '#050510' : '#3a3a5c',
    cursor: 'pointer',
  };
}

export function RangeToggle({ value, onChange }: RangeToggleProps) {
  return (
    <div style={containerStyle}>
      {ranges.map((range) => (
        <button
          key={range}
          type="button"
          aria-pressed={value === range}
          style={pillStyle(value === range)}
          onClick={() => onChange(range)}
        >
          {range}
        </button>
      ))}
    </div>
  );
}

import { render, screen } from '@testing-library/react';
import { RankedBarList } from '@/components/Dashboard/RankedBarList';

describe('RankedBarList', () => {
  it('renders one row per item with proportional bar widths', () => {
    render(
      <RankedBarList
        title="OS Breakdown"
        rows={[
          { label: 'macOS', count: 210, percentage: 43.6 },
          { label: 'Linux', count: 100, percentage: 20.7 },
        ]}
      />,
    );

    expect(screen.getByText('OS Breakdown')).toBeInTheDocument();
    expect(screen.getByText('macOS')).toBeInTheDocument();
    expect(screen.getByText('Linux')).toBeInTheDocument();
    expect(screen.getByText(/43\.6%/)).toBeInTheDocument();

    const bars = screen.getAllByTestId('ranked-bar-fill');
    expect(bars).toHaveLength(2);
    expect(bars[0].style.width).toBe('100%');
    expect(parseFloat(bars[1].style.width)).toBeCloseTo((100 / 210) * 100, 0);
  });

  it('renders emptyLabel when rows is empty', () => {
    render(
      <RankedBarList
        title="OS Breakdown"
        rows={[]}
        emptyLabel="No sessions yet"
      />,
    );

    expect(screen.getByText('No sessions yet')).toBeInTheDocument();
  });
});

import { render, screen } from '@testing-library/react';
import { KpiCard } from '@/components/Dashboard/KpiCard';

describe('KpiCard', () => {
  it('renders label and value', () => {
    render(<KpiCard label="Total Sessions" value="1,893" />);

    expect(screen.getByText('Total Sessions')).toBeInTheDocument();
    expect(screen.getByText('1,893')).toBeInTheDocument();
  });

  it('renders a skeleton when loading', () => {
    render(<KpiCard label="Total Sessions" value="1,893" loading />);

    expect(screen.getByTestId('kpi-skeleton')).toBeInTheDocument();
    expect(screen.queryByText('1,893')).not.toBeInTheDocument();
  });

  it('renders demo note instead of value when demo', () => {
    render(<KpiCard label="Total Sessions" value="1,893" demo />);

    expect(screen.getByText('—')).toBeInTheDocument();
    expect(screen.getByText('demo mode')).toBeInTheDocument();
    expect(screen.queryByText('1,893')).not.toBeInTheDocument();
  });
});

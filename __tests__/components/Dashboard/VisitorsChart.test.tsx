import { render } from '@testing-library/react';
import { VisitorsChart } from '@/components/Dashboard/VisitorsChart';

describe('VisitorsChart', () => {
  it('renders without throwing on an all-zero daily array', () => {
    expect(() =>
      render(
        <VisitorsChart
          daily={[
            { date: '2026-07-04', sessions: 0, page_views: 0 },
            { date: '2026-07-05', sessions: 0, page_views: 0 },
            { date: '2026-07-06', sessions: 0, page_views: 0 },
          ]}
        />,
      ),
    ).not.toThrow();
  });

  it('renders a path per data point for a populated array', () => {
    const { container } = render(
      <VisitorsChart
        daily={[
          { date: '2026-07-04', sessions: 10, page_views: 20 },
          { date: '2026-07-05', sessions: 15, page_views: 25 },
          { date: '2026-07-06', sessions: 8, page_views: 18 },
        ]}
      />,
    );

    const paths = container.querySelectorAll('path, polyline');
    expect(paths.length).toBeGreaterThanOrEqual(2);
  });
});

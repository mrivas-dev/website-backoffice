import { formatRelativeTime } from '@/lib/format/relativeTime';

describe('formatRelativeTime', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date('2026-07-06T15:00:00Z'));
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('formats minutes ago', () => {
    expect(formatRelativeTime('2026-07-06T14:48:00Z')).toBe('12m ago');
  });

  it('formats hours ago', () => {
    expect(formatRelativeTime('2026-07-06T12:00:00Z')).toBe('3h ago');
  });

  it('formats days ago', () => {
    expect(formatRelativeTime('2026-07-04T15:00:00Z')).toBe('2d ago');
  });

  it('formats just now for very recent times', () => {
    expect(formatRelativeTime('2026-07-06T14:59:30Z')).toBe('just now');
  });
});

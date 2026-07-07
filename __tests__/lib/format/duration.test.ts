import { formatDuration } from '@/lib/format/duration';

describe('formatDuration', () => {
  it('formats zero seconds', () => {
    expect(formatDuration(0)).toBe('0s');
  });

  it('formats seconds only', () => {
    expect(formatDuration(45)).toBe('45s');
  });

  it('formats minutes and seconds with zero padding', () => {
    expect(formatDuration(187)).toBe('3m 07s');
  });

  it('formats large durations without hours component', () => {
    expect(formatDuration(3661)).toBe('61m 01s');
  });
});

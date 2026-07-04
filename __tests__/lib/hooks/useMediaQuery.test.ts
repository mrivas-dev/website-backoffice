import { renderHook, act } from '@testing-library/react';
import { useMediaQuery } from '@/lib/hooks/useMediaQuery';

describe('useMediaQuery', () => {
  const listeners: Array<(e: MediaQueryListEvent) => void> = [];
  let matches = false;

  beforeEach(() => {
    matches = false;
    listeners.length = 0;

    window.matchMedia = jest.fn().mockImplementation((query: string) => ({
      matches,
      media: query,
      addEventListener: (_: string, cb: (e: MediaQueryListEvent) => void) => {
        listeners.push(cb);
      },
      removeEventListener: (_: string, cb: (e: MediaQueryListEvent) => void) => {
        const idx = listeners.indexOf(cb);
        if (idx >= 0) listeners.splice(idx, 1);
      },
    })) as typeof window.matchMedia;
  });

  it('returns false when media query does not match', () => {
    matches = false;
    const { result } = renderHook(() => useMediaQuery('(max-width: 767px)'));
    expect(result.current).toBe(false);
  });

  it('returns true when media query matches after mount', () => {
    matches = true;
    const { result } = renderHook(() => useMediaQuery('(max-width: 767px)'));
    expect(result.current).toBe(true);
  });

  it('responds to media query change events', () => {
    matches = false;
    const { result } = renderHook(() => useMediaQuery('(max-width: 767px)'));

    act(() => {
      listeners.forEach((cb) => cb({ matches: false } as MediaQueryListEvent));
    });

    expect(result.current).toBe(false);

    act(() => {
      listeners.forEach((cb) => cb({ matches: true } as MediaQueryListEvent));
    });

    expect(result.current).toBe(true);
  });
});

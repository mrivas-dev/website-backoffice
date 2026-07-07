import { analyticsApi, type RangeKey } from '@/lib/api/analytics';

describe('analyticsApi', () => {
  const mockRequest = jest.fn();

  beforeEach(() => {
    mockRequest.mockClear();
    mockRequest.mockResolvedValue({});
  });

  describe.each(['7d', '30d', '90d'] as const satisfies RangeKey[])('with range=%s', (range) => {
    it('overview calls request with correct path', async () => {
      await analyticsApi.overview(mockRequest, range);

      expect(mockRequest).toHaveBeenCalledWith(`/analytics?range=${range}`);
    });

    it('commands calls request with correct path', async () => {
      await analyticsApi.commands(mockRequest, range);

      expect(mockRequest).toHaveBeenCalledWith(`/analytics/commands?range=${range}`);
    });

    it('sessions calls request with correct path', async () => {
      await analyticsApi.sessions(mockRequest, range);

      expect(mockRequest).toHaveBeenCalledWith(`/analytics/sessions?range=${range}`);
    });

    it('os calls request with correct path', async () => {
      await analyticsApi.os(mockRequest, range);

      expect(mockRequest).toHaveBeenCalledWith(`/analytics/os?range=${range}`);
    });

    it('referrers calls request with correct path', async () => {
      await analyticsApi.referrers(mockRequest, range);

      expect(mockRequest).toHaveBeenCalledWith(`/analytics/referrers?range=${range}`);
    });
  });
});

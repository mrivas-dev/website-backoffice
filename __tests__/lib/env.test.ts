describe('env', () => {
  const originalApiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  const originalAllowDemoLogin = process.env.NEXT_PUBLIC_ALLOW_DEMO_LOGIN;

  afterEach(() => {
    if (originalApiBaseUrl === undefined) {
      delete process.env.NEXT_PUBLIC_API_BASE_URL;
    } else {
      process.env.NEXT_PUBLIC_API_BASE_URL = originalApiBaseUrl;
    }
    if (originalAllowDemoLogin === undefined) {
      delete process.env.NEXT_PUBLIC_ALLOW_DEMO_LOGIN;
    } else {
      process.env.NEXT_PUBLIC_ALLOW_DEMO_LOGIN = originalAllowDemoLogin;
    }
    jest.resetModules();
  });

  it('defaults apiBaseUrl to localhost:8081 when env var is unset', async () => {
    delete process.env.NEXT_PUBLIC_API_BASE_URL;
    const { env } = await import('@/lib/env');
    expect(env.apiBaseUrl).toBe('http://localhost:8081/api/v1');
  });

  it('reads apiBaseUrl from NEXT_PUBLIC_API_BASE_URL', async () => {
    process.env.NEXT_PUBLIC_API_BASE_URL = 'http://custom.test/api/v1';
    const { env } = await import('@/lib/env');
    expect(env.apiBaseUrl).toBe('http://custom.test/api/v1');
  });

  it('defaults allowDemoLogin to false when env var is unset', async () => {
    delete process.env.NEXT_PUBLIC_ALLOW_DEMO_LOGIN;
    const { env } = await import('@/lib/env');
    expect(env.allowDemoLogin).toBe(false);
  });

  it('sets allowDemoLogin true only when NEXT_PUBLIC_ALLOW_DEMO_LOGIN is "true"', async () => {
    process.env.NEXT_PUBLIC_ALLOW_DEMO_LOGIN = 'true';
    const { env } = await import('@/lib/env');
    expect(env.allowDemoLogin).toBe(true);
  });

  it('sets allowDemoLogin false for any other value', async () => {
    process.env.NEXT_PUBLIC_ALLOW_DEMO_LOGIN = 'false';
    const { env } = await import('@/lib/env');
    expect(env.allowDemoLogin).toBe(false);
  });
});

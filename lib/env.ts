export const env = {
  apiBaseUrl: process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:8081/api/v1',
  allowDemoLogin: process.env.NEXT_PUBLIC_ALLOW_DEMO_LOGIN === 'true',
};

import { API_ROUTES } from './api.routes';

describe('API_ROUTES', () => {
  test('exports a router with routes configured', () => {
    const stack = (API_ROUTES as any).stack || [];
    expect(Array.isArray(stack)).toBe(true);
    expect(stack.length).toBeGreaterThanOrEqual(1);
  });
});
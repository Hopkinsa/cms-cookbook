import { FILE_ROUTES } from './file.routes';

describe('FILE_ROUTES', () => {
  test('exports a router with routes configured', () => {
    // Express routers expose stack with route definitions
    const stack = (FILE_ROUTES as any).stack || [];
    expect(Array.isArray(stack)).toBe(true);
    expect(stack.length).toBeGreaterThanOrEqual(1);
  });
});
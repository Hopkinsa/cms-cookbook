import { getAllowedOrigin, getAllowedOrigins, isAllowedOrigin } from './auth.session.ts';

describe('auth session origin handling', () => {
  const originalFrontendOrigin = process.env['FRONTEND_ORIGIN'];
  const originalNodeEnv = process.env['NODE_ENV'];

  afterEach(() => {
    if (originalFrontendOrigin === undefined) {
      delete process.env['FRONTEND_ORIGIN'];
    } else {
      process.env['FRONTEND_ORIGIN'] = originalFrontendOrigin;
    }

    if (originalNodeEnv === undefined) {
      delete process.env['NODE_ENV'];
    } else {
      process.env['NODE_ENV'] = originalNodeEnv;
    }
  });

  it('supports comma-separated configured origins', () => {
    process.env['FRONTEND_ORIGIN'] = 'http://localhost:4200, http://localhost:3000';

    expect(getAllowedOrigins()).toEqual(['http://localhost:4200', 'http://localhost:3000']);
    expect(getAllowedOrigin()).toBe('http://localhost:4200');
    expect(isAllowedOrigin('http://localhost:3000')).toBe(true);
    expect(isAllowedOrigin('http://localhost:4300')).toBe(false);
  });

  it('allows both localhost frontend modes by default in development', () => {
    delete process.env['FRONTEND_ORIGIN'];
    delete process.env['NODE_ENV'];

    expect(getAllowedOrigins()).toEqual(['http://localhost:4200', 'http://localhost:3000']);
    expect(isAllowedOrigin('http://localhost:4200')).toBe(true);
    expect(isAllowedOrigin('http://localhost:3000')).toBe(true);
  });
});

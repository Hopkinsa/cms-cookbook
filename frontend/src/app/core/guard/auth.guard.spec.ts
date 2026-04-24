import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { AuthGuard } from './auth.guard';
import { AuthService } from '@server/core/services/auth.service';

describe('AuthGuard', () => {
  it('returns true when session is authenticated and permission matches', () => {
    const fakeAuthService = {
      isAuthenticated: () => true,
      hasPermission: () => true,
      hasAnyPermission: () => true,
    } as any;
    const router = { createUrlTree: jest.fn(() => ({ redirected: true })) } as any;

    TestBed.configureTestingModule({
      providers: [
        { provide: AuthService, useValue: fakeAuthService },
        { provide: Router, useValue: router },
      ],
    });

    const result = TestBed.runInInjectionContext(() =>
      AuthGuard({ data: { permission: 'recipe.create' } } as any, { url: '/recipe/add' } as any),
    );
    expect(result).toBe(true);
  });

  it('redirects to login when unauthenticated', () => {
    const fakeAuthService = {
      isAuthenticated: () => false,
      hasPermission: () => false,
      hasAnyPermission: () => false,
    } as any;
    const router = { createUrlTree: jest.fn(() => ({ redirected: true })) } as any;

    TestBed.configureTestingModule({
      providers: [
        { provide: AuthService, useValue: fakeAuthService },
        { provide: Router, useValue: router },
      ],
    });

    const result = TestBed.runInInjectionContext(() => AuthGuard({ data: {} } as any, { url: '/backup' } as any));
    expect(result).toEqual({ redirected: true });
    expect(router.createUrlTree).toHaveBeenCalledWith(['/auth/login'], { queryParams: { returnTo: '/backup' } });
  });

  it('redirects home when authenticated but missing the required permission', () => {
    const fakeAuthService = {
      isAuthenticated: () => true,
      hasPermission: () => false,
      hasAnyPermission: () => false,
    } as any;
    const router = { createUrlTree: jest.fn(() => ({ redirected: true })) } as any;

    TestBed.configureTestingModule({
      providers: [
        { provide: AuthService, useValue: fakeAuthService },
        { provide: Router, useValue: router },
      ],
    });

    const result = TestBed.runInInjectionContext(() =>
      AuthGuard({ data: { permission: 'user.read' } } as any, { url: '/users' } as any),
    );
    expect(result).toEqual({ redirected: true });
    expect(router.createUrlTree).toHaveBeenCalledWith(['/']);
  });
});

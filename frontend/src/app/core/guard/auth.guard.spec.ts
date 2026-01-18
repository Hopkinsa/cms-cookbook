import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { AuthGuard } from './auth.guard';
import { SignalService } from '@server/core/services/signal.service';

describe('AuthGuard', () => {
  it('returns true when editEnabled is true', () => {
    const fakeSignalService = { editEnabled: () => true } as any;
    const router = { createUrlTree: jest.fn(() => ({ redirected: true })) } as any;

    TestBed.configureTestingModule({
      providers: [
        { provide: SignalService, useValue: fakeSignalService },
        { provide: Router, useValue: router },
      ],
    });

    const result = TestBed.runInInjectionContext(() => AuthGuard());
    expect(result).toBe(true);
  });

  it('returns UrlTree when editEnabled is false', () => {
    const fakeSignalService = { editEnabled: () => false } as any;
    const router = { createUrlTree: jest.fn(() => ({ redirected: true })) } as any;

    TestBed.configureTestingModule({
      providers: [
        { provide: SignalService, useValue: fakeSignalService },
        { provide: Router, useValue: router },
      ],
    });

    const result = TestBed.runInInjectionContext(() => AuthGuard());
    expect(result).toEqual({ redirected: true });
    expect(router.createUrlTree).toHaveBeenCalledWith(['/']);
  });
});

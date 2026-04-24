import { signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { of } from 'rxjs';

import { AuthService, SignalService } from '@server/core/services';

import { PasswordResetCompleteComponent } from './password-reset-complete.component';

describe('PasswordResetCompleteComponent', () => {
  let authService: any;
  let signalService: any;
  let router: any;

  beforeEach(async () => {
    authService = {
      completePasswordReset: jest.fn(() => of({ completed: true })),
    };
    signalService = {
      feedbackMessage: signal(null),
    };
    router = { navigate: jest.fn() };

    await TestBed.configureTestingModule({
      imports: [PasswordResetCompleteComponent],
      providers: [
        { provide: AuthService, useValue: authService },
        { provide: SignalService, useValue: signalService },
        { provide: Router, useValue: router },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              queryParamMap: {
                get: jest.fn((key: string) => (key === 'token' ? 'prefilled-token' : null)),
              },
            },
          },
        },
      ],
    }).compileComponents();
  });

  it('prefills the token and completes the password reset', () => {
    const fixture = TestBed.createComponent(PasswordResetCompleteComponent);
    const component = fixture.componentInstance as any;
    fixture.detectChanges();

    expect(component.resetModel().token).toBe('prefilled-token');

    component.resetModel.set({
      token: 'prefilled-token',
      password: 'Password123!',
      confirmPassword: 'Password123!',
    });
    component.submit({ preventDefault: jest.fn() } as unknown as Event);

    expect(authService.completePasswordReset).toHaveBeenCalledWith('prefilled-token', 'Password123!');
    expect(signalService.feedbackMessage()).toEqual({ type: 'success', message: 'Password updated' });
    expect(router.navigate).toHaveBeenCalledWith(['/auth/login']);
    expect(component.enableSubmit()).toBe(true);
  });

  it('rejects mismatched passwords before calling the API', () => {
    const fixture = TestBed.createComponent(PasswordResetCompleteComponent);
    const component = fixture.componentInstance as any;
    fixture.detectChanges();

    component.resetModel.set({
      token: 'prefilled-token',
      password: 'Password123!',
      confirmPassword: 'Different123!',
    });
    component.submit({ preventDefault: jest.fn() } as unknown as Event);

    expect(authService.completePasswordReset).not.toHaveBeenCalled();
    expect(signalService.feedbackMessage()).toEqual({ type: 'error', message: 'Passwords do not match' });
  });
});

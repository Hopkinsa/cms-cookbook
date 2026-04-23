import { signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { of } from 'rxjs';

import { AuthService, SignalService } from '@server/core/services';

import { PasswordResetRequestComponent } from './password-reset-request.component';

describe('PasswordResetRequestComponent', () => {
  let authService: any;
  let signalService: any;
  let router: any;

  beforeEach(async () => {
    authService = {
      requestPasswordReset: jest.fn(() => of({ completed: true, message: 'Requested', resetToken: 'token-123' })),
    };
    signalService = {
      feedbackMessage: signal(null),
    };
    router = {
      navigate: jest.fn(),
      createUrlTree: jest.fn(() => ({})),
      serializeUrl: jest.fn(() => '/auth/password-reset/complete'),
    };

    await TestBed.configureTestingModule({
      imports: [PasswordResetRequestComponent],
      providers: [
        { provide: AuthService, useValue: authService },
        { provide: SignalService, useValue: signalService },
        { provide: Router, useValue: router },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              queryParamMap: {
                get: jest.fn(() => null),
              },
            },
          },
        },
      ],
    }).compileComponents();
  });

  it('requests a password reset and shows the development token', () => {
    const fixture = TestBed.createComponent(PasswordResetRequestComponent);
    const component = fixture.componentInstance as any;
    fixture.detectChanges();

    component.requestModel.set({ login: ' admin@example.com ' });
    component.submit({ preventDefault: jest.fn() } as unknown as Event);

    expect(authService.requestPasswordReset).toHaveBeenCalledWith('admin@example.com');
    expect(signalService.feedbackMessage()).toEqual({ type: 'success', message: 'Requested' });
    expect(component.issuedResetToken()).toBe('token-123');
    expect(component.enableSubmit()).toBe(true);
  });

  it('shows an error message when the reset request fails', () => {
    authService.requestPasswordReset.mockReturnValue(of({ completed: false, message: 'Unable' }));

    const fixture = TestBed.createComponent(PasswordResetRequestComponent);
    const component = fixture.componentInstance as any;
    fixture.detectChanges();

    component.requestModel.set({ login: 'admin' });
    component.submit({ preventDefault: jest.fn() } as unknown as Event);

    expect(signalService.feedbackMessage()).toEqual({ type: 'error', message: 'Unable' });
    expect(component.issuedResetToken()).toBe('');
    expect(component.enableSubmit()).toBe(true);
  });
});

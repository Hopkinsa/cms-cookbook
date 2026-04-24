import { signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { of } from 'rxjs';

import { AuthService, SignalService } from '@server/core/services';

import { LoginComponent } from './login.component';

describe('LoginComponent', () => {
  let authService: any;
  let signalService: any;
  let router: any;

  beforeEach(async () => {
    authService = {
      login: jest.fn(() => of({ authenticated: true, user: { username: 'admin' } })),
    };
    signalService = {
      feedbackMessage: signal(null),
    };
    router = {
      navigateByUrl: jest.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [LoginComponent],
      providers: [
        { provide: AuthService, useValue: authService },
        { provide: SignalService, useValue: signalService },
        { provide: Router, useValue: router },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              queryParamMap: {
                get: jest.fn((key: string) => (key === 'returnTo' ? '/users' : null)),
              },
            },
          },
        },
      ],
    }).compileComponents();
  });

  it('logs in and redirects to the requested return path', () => {
    const fixture = TestBed.createComponent(LoginComponent);
    const component = fixture.componentInstance as any;
    fixture.detectChanges();

    component.loginModel.set({ login: ' admin ', password: 'Password123!' });
    component.submit({ preventDefault: jest.fn() } as unknown as Event);

    expect(authService.login).toHaveBeenCalledWith({ login: 'admin', password: 'Password123!' });
    expect(signalService.feedbackMessage()).toEqual({ type: 'success', message: 'Logged in' });
    expect(router.navigateByUrl).toHaveBeenCalledWith('/users');
    expect(component.enableSubmit()).toBe(true);
  });

  it('shows an error message when login fails', () => {
    authService.login.mockReturnValue(of({ authenticated: false, user: null }));

    const fixture = TestBed.createComponent(LoginComponent);
    const component = fixture.componentInstance as any;
    fixture.detectChanges();

    component.loginModel.set({ login: 'admin', password: 'wrong' });
    component.submit({ preventDefault: jest.fn() } as unknown as Event);

    expect(signalService.feedbackMessage()).toEqual({ type: 'error', message: 'Unable to login' });
    expect(router.navigateByUrl).not.toHaveBeenCalled();
    expect(component.enableSubmit()).toBe(true);
  });
});

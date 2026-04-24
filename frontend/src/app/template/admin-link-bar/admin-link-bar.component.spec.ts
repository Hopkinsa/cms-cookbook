import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';

import { AuthService } from '@server/core/services/auth.service';
import { SignalService } from '@server/core/services/signal.service';

import { AdminLinkBarComponent } from './admin-link-bar.component';

describe('AdminLinkBarComponent', () => {
  let component: AdminLinkBarComponent;
  let fixture: ComponentFixture<AdminLinkBarComponent>;
  let router: Router;
  const signalServiceMock = {
    hasAnyPermission: jest.fn(() => false),
  };
  const authServiceMock = {
    isAuthenticated: jest.fn(() => false),
    logout: jest.fn(() => ({ subscribe: (cb: () => void) => cb() })),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminLinkBarComponent],
      providers: [
        provideRouter([]),
        { provide: SignalService, useValue: signalServiceMock },
        { provide: AuthService, useValue: authServiceMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AdminLinkBarComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    fixture.detectChanges();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should navigate to the selected admin route', () => {
    const navigateSpy = jest.spyOn(router, 'navigate').mockResolvedValue(true);

    component.nav(1);

    expect(navigateSpy).toHaveBeenCalledWith(['/images']);
  });

  it('navigates to login when signed out', () => {
    const navigateSpy = jest.spyOn(router, 'navigate').mockResolvedValue(true);

    component.authAction();

    expect(navigateSpy).toHaveBeenCalledWith(['/auth/login'], { queryParams: { returnTo: '/' } });
  });

  it('logs out when signed in', () => {
    authServiceMock.isAuthenticated.mockReturnValue(true);
    const navigateSpy = jest.spyOn(router, 'navigate').mockResolvedValue(true);

    component.authAction();

    expect(authServiceMock.logout).toHaveBeenCalled();
    expect(navigateSpy).toHaveBeenCalledWith(['/']);
  });
});

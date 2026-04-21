import { signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';

import { SignalService } from '@server/core/services/signal.service';

import { AdminLinkBarComponent } from './admin-link-bar.component';

describe('AdminLinkBarComponent', () => {
  let component: AdminLinkBarComponent;
  let fixture: ComponentFixture<AdminLinkBarComponent>;
  let router: Router;
  const signalServiceMock = {
    editEnabled: signal(false),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminLinkBarComponent],
      providers: [provideRouter([]), { provide: SignalService, useValue: signalServiceMock }],
    }).compileComponents();

    fixture = TestBed.createComponent(AdminLinkBarComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    fixture.detectChanges();
  });

  afterEach(() => {
    signalServiceMock.editEnabled.set(false);
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

  it('should toggle edit mode', () => {
    component.toggleEdit();
    expect(signalServiceMock.editEnabled()).toBe(true);

    component.toggleEdit();
    expect(signalServiceMock.editEnabled()).toBe(false);
  });
});

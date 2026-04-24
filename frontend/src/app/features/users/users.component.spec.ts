import { signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { of } from 'rxjs';

import { AuthService, SignalService } from '@server/core/services';

import { UsersComponent } from './users.component';

describe('UsersComponent', () => {
  let authService: any;
  let signalService: any;
  let router: any;
  let feedbackMessage: any;

  beforeEach(async () => {
    authService = {
      users: signal([
        {
          id: 1,
          firstName: 'Admin',
          surname: 'User',
          username: 'admin',
          email: 'admin@example.com',
          isActive: true,
          createdAt: 1,
          updatedAt: 1,
          permissions: ['user.read', 'user.create'],
        },
      ]),
      loadUsers: jest.fn(() => of([])),
      createUser: jest.fn(() => of({ user: { id: 2 } })),
      updateUser: jest.fn(() => of({ user: { id: 1 } })),
      deleteUser: jest.fn(() => of({ completed: true })),
    };
    feedbackMessage = signal(null);
    signalService = {
      hasPermission: jest.fn((permission: string) => permission === 'user.create' || permission === 'user.update'),
      feedbackMessage,
    };
    router = { navigate: jest.fn() };

    await TestBed.configureTestingModule({
      imports: [UsersComponent],
      providers: [
        { provide: AuthService, useValue: authService },
        { provide: SignalService, useValue: signalService },
        { provide: Router, useValue: router },
      ],
    }).compileComponents();
  });

  it('shows the add user action when user.create is allowed', () => {
    const fixture = TestBed.createComponent(UsersComponent);
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('Add user');
    expect(authService.loadUsers).toHaveBeenCalled();
  });

  it('creates a new user through the frontend form flow', () => {
    const fixture = TestBed.createComponent(UsersComponent);
    const component = fixture.componentInstance as any;
    fixture.detectChanges();

    component.startCreate();
    component.userModel.set({
      firstName: 'Editor',
      surname: 'User',
      username: 'editor',
      email: 'editor@example.com',
      password: 'Password123!',
      isActive: true,
    });
    component.selectedPermissions.set(['user.read']);

    component.save({ preventDefault: jest.fn() } as unknown as Event);

    expect(authService.createUser).toHaveBeenCalledWith({
      firstName: 'Editor',
      surname: 'User',
      username: 'editor',
      email: 'editor@example.com',
      password: 'Password123!',
      isActive: true,
      permissions: ['user.read'],
    });
    expect(signalService.feedbackMessage()).toEqual({ type: 'success', message: 'User created' });
  });

  it('blocks save attempts when the user lacks create and update permissions', () => {
    signalService.hasPermission.mockReturnValue(false);

    const fixture = TestBed.createComponent(UsersComponent);
    const component = fixture.componentInstance as any;
    fixture.detectChanges();

    component.save({ preventDefault: jest.fn() } as unknown as Event);

    expect(authService.createUser).not.toHaveBeenCalled();
    expect(signalService.feedbackMessage()).toEqual({ type: 'error', message: 'You do not have permission to save users' });
    expect(fixture.nativeElement.textContent).toContain('You can view users, but you do not have permission to create or edit them.');
  });

  it('shows the backend authorization error when a save is rejected', () => {
    authService.createUser.mockReturnValue(of({ user: null, status: 403, message: 'Permission denied' }));

    const fixture = TestBed.createComponent(UsersComponent);
    const component = fixture.componentInstance as any;
    fixture.detectChanges();

    component.startCreate();
    component.userModel.set({
      firstName: 'Editor',
      surname: 'User',
      username: 'editor',
      email: 'editor@example.com',
      password: 'Password123!',
      isActive: true,
    });
    component.selectedPermissions.set(['user.read']);

    component.save({ preventDefault: jest.fn() } as unknown as Event);

    expect(signalService.feedbackMessage()).toEqual({ type: 'error', message: 'Permission denied' });
  });
});

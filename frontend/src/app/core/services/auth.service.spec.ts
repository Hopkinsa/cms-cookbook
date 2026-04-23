import { TestBed } from '@angular/core/testing';
import { HttpClient } from '@angular/common/http';
import { of, throwError } from 'rxjs';

import {
  authSessionInitialState,
  type AuthSessionState,
  type AuthUser,
  type AuthUserUpsert,
} from '@server/core/interface';

import { AuthService } from './auth.service';

describe('AuthService', () => {
  let http: {
    get: jest.Mock;
    post: jest.Mock;
    patch: jest.Mock;
    delete: jest.Mock;
  };
  let service: AuthService;

  const sessionState: AuthSessionState = {
    authenticated: true,
    user: {
      userId: 1,
      firstName: 'Admin',
      surname: 'User',
      username: 'admin',
      email: 'admin@example.com',
      permissions: ['user.read', 'backup.export'],
    },
  };

  const userRecord: AuthUser = {
    id: 2,
    firstName: 'Editor',
    surname: 'User',
    username: 'editor',
    email: 'editor@example.com',
    isActive: true,
    createdAt: 10,
    updatedAt: 20,
    permissions: ['recipe.update'],
  };

  const userUpsert: AuthUserUpsert = {
    firstName: 'Editor',
    surname: 'User',
    username: 'editor',
    email: 'editor@example.com',
    password: 'secret',
    isActive: true,
    permissions: ['recipe.update'],
  };

  beforeEach(() => {
    http = {
      get: jest.fn(),
      post: jest.fn(),
      patch: jest.fn(),
      delete: jest.fn(),
    };

    TestBed.configureTestingModule({
      providers: [{ provide: HttpClient, useValue: http }],
    });

    service = TestBed.inject(AuthService);
  });

  it('hydrates the current session on success', async () => {
    http.get.mockReturnValue(of(sessionState));

    await service.hydrateSession();

    expect(http.get).toHaveBeenCalledWith('auth/session');
    expect(service.session()).toEqual(sessionState);
    expect(service.isAuthenticated()).toBe(true);
    expect(service.user()).toEqual(sessionState.user);
    expect(service.permissions()).toEqual(['user.read', 'backup.export']);
    expect(service.hasAdminAccess()).toBe(true);
  });

  it('clears session state when hydrateSession fails', async () => {
    service.session.set(sessionState);
    service.users.set([userRecord]);
    http.get.mockReturnValue(throwError(() => new Error('no session')));

    await service.hydrateSession();

    expect(service.session()).toEqual(authSessionInitialState);
    expect(service.users()).toBeNull();
    expect(service.hasAdminAccess()).toBe(false);
  });

  it('stores the authenticated session after login', (done) => {
    http.post.mockReturnValue(of(sessionState));

    service.login({ login: 'admin', password: 'secret' }).subscribe((result) => {
      expect(result).toEqual(sessionState);
      expect(http.post).toHaveBeenCalledWith('auth/login', { login: 'admin', password: 'secret' });
      expect(service.session()).toEqual(sessionState);
      done();
    });
  });

  it('clears the session when login fails', (done) => {
    service.session.set(sessionState);
    service.users.set([userRecord]);
    http.post.mockReturnValue(throwError(() => new Error('bad login')));

    service.login({ login: 'admin', password: 'wrong' }).subscribe((result) => {
      expect(result).toEqual(authSessionInitialState);
      expect(service.session()).toEqual(authSessionInitialState);
      expect(service.users()).toBeNull();
      done();
    });
  });

  it('clears the session after logout success and failure', (done) => {
    service.session.set(sessionState);
    service.users.set([userRecord]);
    http.post.mockReturnValueOnce(of({ completed: true }));

    service.logout().subscribe((successResult) => {
      expect(successResult).toEqual({ completed: true });
      expect(service.session()).toEqual(authSessionInitialState);
      expect(service.users()).toBeNull();

      service.session.set(sessionState);
      service.users.set([userRecord]);
      http.post.mockReturnValueOnce(throwError(() => new Error('logout failed')));

      service.logout().subscribe((failureResult) => {
        expect(failureResult).toEqual({ completed: false });
        expect(service.session()).toEqual(authSessionInitialState);
        expect(service.users()).toBeNull();
        done();
      });
    });
  });

  it('loads users and falls back to an empty list on error', (done) => {
    http.get.mockReturnValueOnce(of([userRecord]));

    service.loadUsers().subscribe((users) => {
      expect(users).toEqual([userRecord]);
      expect(http.get).toHaveBeenCalledWith('users');
      expect(service.users()).toEqual([userRecord]);

      http.get.mockReturnValueOnce(throwError(() => new Error('users failed')));
      service.loadUsers().subscribe((fallbackUsers) => {
        expect(fallbackUsers).toEqual([]);
        expect(service.users()).toEqual([]);
        done();
      });
    });
  });

  it('creates and updates users, returning null on errors', (done) => {
    http.post.mockReturnValueOnce(of(userRecord));

    service.createUser(userUpsert).subscribe((createdUser) => {
      expect(createdUser).toEqual(userRecord);
      expect(http.post).toHaveBeenCalledWith('users', userUpsert);

      http.post.mockReturnValueOnce(throwError(() => new Error('create failed')));
      service.createUser(userUpsert).subscribe((failedCreate) => {
        expect(failedCreate).toBeNull();

        http.patch.mockReturnValueOnce(of(userRecord));
        service.updateUser(2, userUpsert).subscribe((updatedUser) => {
          expect(updatedUser).toEqual(userRecord);
          expect(http.patch).toHaveBeenCalledWith('users/2', userUpsert);

          http.patch.mockReturnValueOnce(throwError(() => new Error('update failed')));
          service.updateUser(2, userUpsert).subscribe((failedUpdate) => {
            expect(failedUpdate).toBeNull();
            done();
          });
        });
      });
    });
  });

  it('deletes users and handles reset flows with error fallbacks', (done) => {
    http.delete.mockReturnValueOnce(of({ completed: true }));

    service.deleteUser(3).subscribe((deleteResult) => {
      expect(deleteResult).toEqual({ completed: true });
      expect(http.delete).toHaveBeenCalledWith('users/3');

      http.delete.mockReturnValueOnce(throwError(() => new Error('delete failed')));
      service.deleteUser(3).subscribe((failedDelete) => {
        expect(failedDelete).toEqual({ completed: false });

        http.post.mockReturnValueOnce(of({ completed: true, message: 'ok', resetToken: 'abc' }));
        service.requestPasswordReset('admin').subscribe((requestResult) => {
          expect(requestResult).toEqual({ completed: true, message: 'ok', resetToken: 'abc' });
          expect(http.post).toHaveBeenCalledWith('auth/password-reset/request', { login: 'admin' });

          http.post.mockReturnValueOnce(throwError(() => new Error('reset failed')));
          service.requestPasswordReset('admin').subscribe((failedRequest) => {
            expect(failedRequest).toEqual({ completed: false, message: 'Unable to request password reset' });

            http.post.mockReturnValueOnce(of({ completed: true }));
            service.completePasswordReset('token', 'newpass').subscribe((completeResult) => {
              expect(completeResult).toEqual({ completed: true });
              expect(http.post).toHaveBeenCalledWith('auth/password-reset/complete', {
                token: 'token',
                password: 'newpass',
              });

              http.post.mockReturnValueOnce(throwError(() => new Error('complete failed')));
              service.completePasswordReset('token', 'newpass').subscribe((failedComplete) => {
                expect(failedComplete).toEqual({ completed: false });
                done();
              });
            });
          });
        });
      });
    });
  });

  it('checks single and multiple permissions from the current session', () => {
    service.session.set(sessionState);

    expect(service.hasPermission('user.read')).toBe(true);
    expect(service.hasPermission('user.delete')).toBe(false);
    expect(service.hasAnyPermission(['user.delete', 'backup.export'])).toBe(true);
    expect(service.hasAnyPermission(['user.delete', 'backup.restore'])).toBe(false);
  });
});

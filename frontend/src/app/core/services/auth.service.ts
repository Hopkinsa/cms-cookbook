import { computed, inject, Injectable, signal } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { firstValueFrom, Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { environment } from 'src/environment/environment';

import {
  AuthLoginRequest,
  type AuthPermissionCode,
  type AuthSessionState,
  authSessionInitialState,
  type AuthUser,
  type AuthUserSaveResponse,
  type AuthUserUpsert,
  crudResponse,
  type PasswordResetRequestResponse,
} from '@server/core/interface';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private http: HttpClient = inject(HttpClient);
  private apiUrl = environment.baseApiURL;

  readonly session = signal<AuthSessionState>({ ...authSessionInitialState });
  readonly users = signal<AuthUser[] | null>(null);

  readonly isAuthenticated = computed(() => this.session().authenticated);
  readonly user = computed(() => this.session().user);
  readonly permissions = computed(() => this.session().user?.permissions ?? []);
  readonly hasAdminAccess = computed(() => this.isAuthenticated() && this.permissions().length > 0);

  async hydrateSession(): Promise<void> {
    await firstValueFrom(
      this.http.get<AuthSessionState>(`${this.apiUrl}auth/session`).pipe(
        tap((sessionState) => this.session.set(sessionState)),
        catchError(() => {
          this.clearSession();
          return of({ ...authSessionInitialState });
        }),
      ),
    );
  }

  login(request: AuthLoginRequest): Observable<AuthSessionState> {
    return this.http.post<AuthSessionState>(`${this.apiUrl}auth/login`, request).pipe(
      tap((sessionState) => this.session.set(sessionState)),
      catchError(() => {
        this.clearSession();
        return of({ ...authSessionInitialState });
      }),
    );
  }

  logout(): Observable<crudResponse> {
    return this.http.post<crudResponse>(`${this.apiUrl}auth/logout`, {}).pipe(
      tap(() => this.clearSession()),
      catchError(() => {
        this.clearSession();
        return of({ completed: false });
      }),
    );
  }

  loadUsers(): Observable<AuthUser[]> {
    return this.http.get<AuthUser[]>(`${this.apiUrl}users`).pipe(
      tap((users) => this.users.set(users)),
      catchError(() => {
        this.users.set([]);
        return of([]);
      }),
    );
  }

  createUser(user: AuthUserUpsert): Observable<AuthUserSaveResponse> {
    return this.http.post<AuthUser>(`${this.apiUrl}users`, user).pipe(
      map((savedUser) => ({ user: savedUser })),
      catchError((error: unknown) => of(this.toUserSaveError(error, 'Unable to create user'))),
    );
  }

  updateUser(userId: number, user: AuthUserUpsert): Observable<AuthUserSaveResponse> {
    return this.http.patch<AuthUser>(`${this.apiUrl}users/${userId}`, user).pipe(
      map((savedUser) => ({ user: savedUser })),
      catchError((error: unknown) => of(this.toUserSaveError(error, 'Unable to save user'))),
    );
  }

  deleteUser(userId: number): Observable<crudResponse> {
    return this.http.delete<crudResponse>(`${this.apiUrl}users/${userId}`).pipe(catchError(() => of({ completed: false })));
  }

  requestPasswordReset(login: string): Observable<PasswordResetRequestResponse> {
    return this.http.post<PasswordResetRequestResponse>(`${this.apiUrl}auth/password-reset/request`, { login }).pipe(
      catchError(() => of({ completed: false, message: 'Unable to request password reset' })),
    );
  }

  completePasswordReset(token: string, password: string): Observable<crudResponse> {
    return this.http
      .post<crudResponse>(`${this.apiUrl}auth/password-reset/complete`, { token, password })
      .pipe(catchError(() => of({ completed: false })));
  }

  hasPermission(permission: AuthPermissionCode): boolean {
    return this.permissions().includes(permission);
  }

  hasAnyPermission(permissions: readonly AuthPermissionCode[]): boolean {
    return permissions.some((permission) => this.permissions().includes(permission));
  }

  private clearSession(): void {
    this.session.set({ ...authSessionInitialState });
    this.users.set(null);
  }

  private toUserSaveError(error: unknown, fallbackMessage: string): AuthUserSaveResponse {
    if (error instanceof HttpErrorResponse) {
      if (error.status === 401) {
        this.clearSession();
      }

      return {
        user: null,
        status: error.status,
        message: this.getErrorMessage(error.error) ?? fallbackMessage,
      };
    }

    return {
      user: null,
      message: fallbackMessage,
    };
  }

  private getErrorMessage(errorBody: unknown): string | undefined {
    if (typeof errorBody !== 'object' || errorBody === null) {
      return undefined;
    }

    const message = (errorBody as { message?: unknown })['message'];
    return typeof message === 'string' ? message : undefined;
  }
}

import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { type AuthPermissionCode } from '@server/core/interface';
import { AuthService } from '@server/core/services';

export const AuthGuard = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree => {
  const router: Router = inject(Router);
  const authService: AuthService = inject(AuthService);
  const permission = route.data['permission'] as AuthPermissionCode | undefined;
  const permissionsAny = route.data['permissionsAny'] as AuthPermissionCode[] | undefined;

  if (!authService.isAuthenticated()) {
    return router.createUrlTree(['/auth/login'], { queryParams: { returnTo: state.url } });
  }

  if (permission && !authService.hasPermission(permission)) {
    return router.createUrlTree(['/']);
  }

  if (permissionsAny && !authService.hasAnyPermission(permissionsAny)) {
    return router.createUrlTree(['/']);
  }

  return true;
};

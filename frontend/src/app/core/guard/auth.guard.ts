import { inject } from '@angular/core';
import { Router, UrlTree } from '@angular/router';
import { SignalService } from '@server/core/services';

export const AuthGuard = (): boolean | UrlTree => {
  const router: Router = inject(Router);
  const signalService: SignalService = inject(SignalService);

  // if edit allowed, continue journey
  if (signalService.editEnabled()) {
    return true;
  }

  // if edit not allowed, redirect to homepage
  return router.createUrlTree(['/']);
};

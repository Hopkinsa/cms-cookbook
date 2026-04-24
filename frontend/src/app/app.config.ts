import { APP_INITIALIZER, ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideHttpClient, withInterceptors, withInterceptorsFromDi } from '@angular/common/http';
import { provideRouter } from '@angular/router';

import { credentialsInterceptor } from '@server/core/interceptor/credentials.interceptor';
import { AuthService } from '@server/core/services/auth.service';
import { SignalService } from '@server/core/services/signal.service';
import { UnitsService } from '@server/core/services/units.service';
import { RecipeService } from '@server/core/services/recipe.service';

import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    SignalService,
    UnitsService,
    RecipeService,
    {
      provide: APP_INITIALIZER,
      multi: true,
      deps: [AuthService],
      useFactory: (authService: AuthService) => {
        return () => authService.hydrateSession();
      },
    },
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(withInterceptors([credentialsInterceptor]), withInterceptorsFromDi()),
  ],
};

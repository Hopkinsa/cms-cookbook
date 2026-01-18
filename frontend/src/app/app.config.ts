import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { provideRouter } from '@angular/router';

import { SignalService } from '@server/core/services/signal.service';
import { UnitsService } from '@server/core/services/units.service';
import { RecipeService } from '@server/core/services/recipe.service';

import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    SignalService,
    UnitsService,
    RecipeService,
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(withInterceptorsFromDi()),
  ],
};

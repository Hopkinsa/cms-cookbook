import { inject } from '@angular/core';
import { recipeInitialState } from '@server/core/interface';
import { SignalService } from '@server/core/services';

import type { ActivatedRouteSnapshot, ResolveFn, RouterStateSnapshot } from '@angular/router';

export const addRecipeResolver: ResolveFn<any> = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
   const id = -1;
   const initialState = recipeInitialState;
   inject(SignalService).recipe.set(initialState);
   return id;
};
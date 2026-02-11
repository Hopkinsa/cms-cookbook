import { inject } from '@angular/core';
import { recipeInitialState } from '@server/core/interface';
import { SignalService } from '@server/core/services';

import type { ActivatedRouteSnapshot, ResolveFn, RouterStateSnapshot } from '@angular/router';

export const addRecipeResolver: ResolveFn<any> = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
  const id = -1;
  const sigSer: SignalService = inject(SignalService)
  const initialState = {...recipeInitialState};
  sigSer.recipe.set({...initialState});
  return id;
};

import { inject } from '@angular/core';
import { RecipeListService } from '@server/core/services';

import type { ActivatedRouteSnapshot, ResolveFn, RouterStateSnapshot } from '@angular/router';

export const recipeListResolver: ResolveFn<any> = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
   inject(RecipeListService).getRecipeList.set(Date.now());
};
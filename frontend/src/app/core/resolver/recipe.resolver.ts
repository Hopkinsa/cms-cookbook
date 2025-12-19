import { inject } from '@angular/core';
import { RecipeService } from '@server/core/services/recipe.service';

import type { ActivatedRouteSnapshot, ResolveFn, RouterStateSnapshot } from '@angular/router';

export const recipeResolver: ResolveFn<any> = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
  const id = Number(route.paramMap.get('id'));
  if (id > 0) {
    inject(RecipeService).getRecipe.set(id);
  }
  return id;
};

import { inject } from '@angular/core';
import { RecipeService } from '@server/core/services/recipe.service';

import type { ActivatedRouteSnapshot, ResolveFn } from '@angular/router';

export const recipeResolver: ResolveFn<number> = (route: ActivatedRouteSnapshot) => {
  const id = Number(route.paramMap.get('id'));
  if (id > 0) {
    inject(RecipeService).getRecipe.set(id);
  }
  return id;
};

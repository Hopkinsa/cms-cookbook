import { inject } from '@angular/core';
import { RecipeListService } from '@server/core/services';

import type { ResolveFn } from '@angular/router';

export const recipeListResolver: ResolveFn<void> = () => {
  inject(RecipeListService).getRecipeList.set(Date.now());
};

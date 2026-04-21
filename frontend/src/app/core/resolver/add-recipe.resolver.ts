import { inject } from '@angular/core';
import { recipeInitialState } from '@server/core/interface';
import { SignalService } from '@server/core/services';

import type { ResolveFn } from '@angular/router';

export const addRecipeResolver: ResolveFn<number> = () => {
  const id = -1;
  const sigSer: SignalService = inject(SignalService);
  const initialState = { ...recipeInitialState };
  sigSer.recipe.set({ ...initialState });
  return id;
};

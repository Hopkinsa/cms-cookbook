import { Injectable, inject, signal, computed, WritableSignal } from '@angular/core';
import { Router } from '@angular/router';

import { IRecipe, IRecipeList, ITags, IUnits } from '@server/core/interface';

@Injectable({
  providedIn: 'root',
})
export class SignalService {
  private router: Router = inject(Router);

  // Signal that controls
  editEnabled: WritableSignal<Boolean> = signal(false);

  // Signal that contains the Recipe List data
  recipeList: WritableSignal<Array<IRecipeList> | null> = signal(null);

  // Signals that contains the Recipe data
  recipe: WritableSignal<IRecipe | null> = signal(null);
  recipeServes: WritableSignal<number | null> = signal(null);

  recipeServesAdjustment = computed(() => {
    if (this.recipe() && this.recipeServes()) {
      return this.recipeServes()! / this.recipe()!.serves;
    }
    return 1;
  });
  ingredients = computed(() => this.recipe()?.ingredients);
  steps = computed(() => this.recipe()?.steps);

  // Signal that contains the Unit data
  units: WritableSignal<Array<IUnits> | null> = signal(null);

  // Signal that contains the Tag data
  tags: WritableSignal<Array<ITags> | null> = signal(null);

  // Signal that contains previous page
  returnTo: WritableSignal<string | null> = signal(null);

  // simple function for use as additional check on restricted pages
  // all effects trigger on signal changes, add call to the init page effect
  canEdit(): void {
    if (!this.editEnabled()) {
      this.router.navigate(['/']);
    }
  }
}
import { computed, inject, Injectable, signal, WritableSignal } from '@angular/core';
import { Router } from '@angular/router';

import { IFeedback, IRecipe, IRecipeList, ITags, IUnits } from '@server/core/interface';
import { storageSignal } from './signal-storage.service';

@Injectable({
  providedIn: 'root',
})
export class SignalService {
  private router: Router = inject(Router);

  // Signal that controls access to editing
  readonly editEnabled: WritableSignal<boolean> = storageSignal('editEnabled', false, {storage: localStorage, crossTabSync: true});

  // Signal that controls feedback
  readonly feedbackMessage: WritableSignal<IFeedback | null> = signal(null);

  // Signal that contains the Recipe List data
  readonly recipeList: WritableSignal<IRecipeList[] | null> = signal(null);

  // Signals that contains the Recipe data
  readonly recipe: WritableSignal<IRecipe | null> = signal(null);
  readonly recipeServes: WritableSignal<number | null> = signal(null);

  readonly recipeServesAdjustment = computed(() => {
    if (this.recipe() && this.recipeServes()) {
      return this.recipeServes()! / this.recipe()!.serves;
    }
    return 1;
  });
  readonly ingredients = computed(() => this.recipe()?.ingredients);
  readonly steps = computed(() => this.recipe()?.steps);

  // Signal that contains the Unit data
  readonly units: WritableSignal<IUnits[] | null> = signal(null);

  // Signal that contains the Tag data
  readonly tags: WritableSignal<ITags[] | null> = signal(null);

  // Signal that contains previous page
  readonly returnTo: WritableSignal<string | null> = signal(null);

  // simple function for use as additional check on restricted pages
  // all effects trigger on signal changes, add call to the init page effect
  canEdit(): void {
    if (!this.editEnabled()) {
      this.router.navigate(['/']);
    }
  }
}


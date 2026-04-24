import { computed, effect, inject, Injectable, signal, WritableSignal } from '@angular/core';
import { Router } from '@angular/router';

import {
  type AuthPermissionCode,
  IFeedback,
  IRecipe,
  IRecipeList,
  IRecipeSearch,
  IRecipeSearchInit,
  ISortSignal,
  ITags,
  IUnits,
} from '@server/core/interface';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class SignalService {
  private router: Router = inject(Router);
  private authService: AuthService = inject(AuthService);

  // Signal that controls access to editing
  readonly editEnabled: WritableSignal<boolean> = signal(false);

  // Signal that controls feedback
  readonly feedbackMessage: WritableSignal<IFeedback | null> = signal(null);

  // Signal that contains the Recipe List data
  readonly recipeList: WritableSignal<IRecipeList[] | null> = signal(null);
  readonly recipesFound: WritableSignal<number | null> = signal(null);
  readonly recipeSearch: WritableSignal<IRecipeSearch> = signal({ ...IRecipeSearchInit });
  readonly filteredRecipeList = computed(() => {
    const recipes = this.recipeList();
    if (!recipes) {
      return null;
    }

    const { tags, tagMode } = this.recipeSearch();
    if (!tags.length) {
      return recipes;
    }

    return recipes.filter((recipe) => {
      const recipeTags = recipe.tags ?? [];

      if (tagMode === 'and') {
        return tags.every((tag) => recipeTags.includes(tag));
      }

      return tags.some((tag) => recipeTags.includes(tag));
    });
  });
  readonly filteredRecipesFound = computed(() => this.filteredRecipeList()?.length ?? 0);

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

  // Signals for results page
  readonly pageSizeOptions: number[] = [6, 9, 12, 18, 24];
  readonly pageIndex: WritableSignal<number> = signal(0);
  readonly pageSize: WritableSignal<number> = signal(this.pageSizeOptions[1]);
  readonly pageSort: WritableSignal<ISortSignal> = signal({ target: 'title', direction: 'asc' });

  // Signal that contains previous page
  readonly returnTo: WritableSignal<string | null> = signal(null);

  private readonly syncEditAccess = effect(() => {
    const hasAccess = this.authService.hasAdminAccess();
    if (this.editEnabled() !== hasAccess) {
      this.editEnabled.set(hasAccess);
    }
  });

  hasPermission(permission: AuthPermissionCode): boolean {
    return this.authService.hasPermission(permission);
  }

  hasAnyPermission(permissions: readonly AuthPermissionCode[]): boolean {
    return this.authService.hasAnyPermission(permissions);
  }

  // simple function for use as additional check on restricted pages
  // all effects trigger on signal changes, add call to the init page effect
  canEdit(requiredPermission?: AuthPermissionCode | AuthPermissionCode[]): void {
    if (!this.authService.isAuthenticated()) {
      this.router.navigate(['/auth/login'], { queryParams: { returnTo: this.router.url } });
      return;
    }

    if (requiredPermission === undefined) {
      if (!this.editEnabled()) {
        this.router.navigate(['/']);
      }
      return;
    }

    if (Array.isArray(requiredPermission)) {
      if (!this.hasAnyPermission(requiredPermission)) {
        this.router.navigate(['/']);
      }
      return;
    }

    if (!this.hasPermission(requiredPermission)) {
      this.router.navigate(['/']);
    }
  }
}

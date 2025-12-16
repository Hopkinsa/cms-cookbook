import { Injectable, WritableSignal, effect, inject, signal } from '@angular/core';
import { httpResource } from '@angular/common/http';
import { environment } from 'src/environment/environment';

import { SignalService } from '@server/core/services/signal.service';
import { IRecipeList } from '@server/core/interface/recipe.interface';

@Injectable({
  providedIn: 'root',
})
export class RecipeListService {
  protected signalService: SignalService = inject(SignalService);
  private apiUrl = environment.baseApiURL;

  // Signals only trigger if the new value is different to current value
  // to get a recipe pass the recipe id by using getRecipe.set(<id>)
  public getRecipeList: WritableSignal<number | null> = signal(null);
  public findRecipes: WritableSignal<string | null> = signal(null);

  private recipeListRequestResolved = effect(() => {
    if (this.recipeListRequest.status() === 'resolved') {
      this.signalService.recipeList.set(this.recipeListRequest.value() as Array<IRecipeList>);
    }
  })

  private recipeListRequestError = effect(() => {
    if (this.recipeListRequest.error()) {
      console.error('Recipe error', this.recipeListRequest.error()?.message);
    }
  })

  private recipeSearchRequestResolved = effect(() => {
    if (this.recipeSearchRequest.status() === 'resolved') {
      this.signalService.recipeList.set(this.recipeSearchRequest.value() as Array<IRecipeList>);
    }
  })

  private recipeSearchRequestError = effect(() => {
    if (this.recipeSearchRequest.error()) {
      console.error('Recipe search error', this.recipeSearchRequest.error()?.message);
    }
  })

  private recipeSearchRequest = httpResource<Array<IRecipeList>>(() => {
    const terms = this.findRecipes();
    if (terms !== null && terms.trim() !== '') {
      return `${this.apiUrl}search?terms=${terms}`;
    }
    return undefined;
  });

  private recipeListRequest = httpResource<Array<IRecipeList>>(() => {
    return this.getRecipeList() ? `${this.apiUrl}recipes` : undefined
  });
}

import { effect, inject, Injectable, signal, WritableSignal } from '@angular/core';
import { httpResource } from '@angular/common/http';
import { environment } from 'src/environment/environment';

import { SignalService } from '@server/core/services/signal.service';
import { IRecipeList, ISearchResults } from '@server/core/interface/recipe.interface';

interface ISortSignal {
  sortOn: string;
  sortDir: string;
}

@Injectable({
  providedIn: 'root',
})
export class RecipeListService {
  protected signalService: SignalService = inject(SignalService);
  private apiUrl = environment.baseApiURL;

  // Signals only trigger if the new value is different to current value
  // to get a recipe pass the recipe id by using getRecipe.set(<id>)
  readonly getRecipeList: WritableSignal<number | null> = signal(null);
  readonly findRecipes: WritableSignal<string | null> = signal(null);
  readonly recipeSort: WritableSignal<ISortSignal> = signal({ sortOn: 'title', sortDir: 'asc' });

  private recipeListRequestResolved = effect(() => {
    if (this.recipeListRequest.status() === 'resolved') {
      this.signalService.recipeList.set(this.recipeListRequest.value()?.results as IRecipeList[]);
    }
  });

  private recipeListRequestError = effect(() => {
    if (this.recipeListRequest.error()) {
      console.error('Recipe error', this.recipeListRequest.error()?.message);
    }
  });

  private recipeListRequest = httpResource<ISearchResults>(() => {
    const terms = this.findRecipes();
    const sorting = this.recipeSort();
    const sortOn = sorting.sortOn;
    const sortDir = sorting.sortDir;

    let targetResource = `${this.apiUrl}recipes?t=${sortOn}&d=${sortDir}`;
    if (terms !== null && terms.trim() !== '') {
      targetResource = `${this.apiUrl}search??t=${sortOn}&d=${sortDir}&terms=${terms}`;
    }
    return this.getRecipeList() ? targetResource : undefined;
  });
}

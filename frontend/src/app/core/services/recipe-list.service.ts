import { effect, inject, Injectable, signal, WritableSignal } from '@angular/core';
import { httpResource } from '@angular/common/http';
import { environment } from 'src/environment/environment';

import { SignalService } from '@server/core/services/signal.service';
import { IRecipeList, ISearchResults } from '@server/core/interface/recipe.interface';

@Injectable({
  providedIn: 'root',
})
export class RecipeListService {
  protected signalService: SignalService = inject(SignalService);
  private apiUrl = environment.baseApiURL;

  // Signals only trigger if the new value is different to current value
  // to get the list of recipes pass a unique number to getRecipeList using getRecipeList.set(<number>)
  // or a string to findRecipes using findRecipes.set(<string>)
  // or an ISortSignal object to recipeSort using recipeSort.set(<ISortSignal>)
  readonly getRecipeList: WritableSignal<number | null> = signal(null);
  readonly findRecipes: WritableSignal<string | null> = signal(null);

  private recipeListRequestResolved = effect(() => {
    if (this.recipeListRequest.status() === 'resolved') {
      const resolvedData = this.recipeListRequest.value();
      this.signalService.recipeList.set(resolvedData?.results as IRecipeList[]);
      this.signalService.recipesFound.set(resolvedData?.total as number);
      this.signalService.pageIndex.set(0);
    }
  });

  private recipeListRequestError = effect(() => {
    if (this.recipeListRequest.error()) {
      console.error('Recipe error', this.recipeListRequest.error()?.message);
    }
  });

  private recipeListRequest = httpResource<ISearchResults>(() => {
    const terms = this.findRecipes();
    const sorting = this.signalService.pageSort();
    const sortOn = sorting.target;
    const sortDir = sorting.direction;

    let targetResource = `${this.apiUrl}recipes?t=${sortOn}&d=${sortDir}`;
    if (terms !== null && terms.trim() !== '') {
      targetResource = `${this.apiUrl}search??t=${sortOn}&d=${sortDir}&terms=${terms}`;
    }
    return this.getRecipeList() ? targetResource : undefined;
  });
}

import { Injectable, WritableSignal, effect, inject, signal } from '@angular/core';
import { httpResource, HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from 'src/environment/environment';

import { SignalService } from '@server/core/services/signal.service';
import { IRecipe } from '@server/core/interface/recipe.interface';
import { ErrorHandlerService } from './error-handler.service';

@Injectable({
  providedIn: 'root',
})
export class RecipeService {
  private http: HttpClient = inject(HttpClient);
  private error: ErrorHandlerService = inject(ErrorHandlerService);
  protected signalService: SignalService = inject(SignalService);
  private apiUrl = environment.baseApiURL;

  // Signals only trigger if the new value is different to current value
  // to get a recipe pass the recipe id by using getRecipe.set(<id>)
  public getRecipe: WritableSignal<number | null> = signal(null);

  private recipeRequestResolved = effect(() => {
    if (this.recipeRequest.status() === 'resolved') {
      this.signalService.recipe.set(this.recipeRequest.value() as IRecipe);
    }
  })

  private recipeRequestError = effect(() => {
    if (this.recipeRequest.error()) {
      console.error('Recipe error', this.recipeRequest.error()?.message);
    }
  })

  private recipeRequest = httpResource<IRecipe>(() => {
    return this.getRecipe() ? `${this.apiUrl}recipe/${this.getRecipe()}` : undefined
  });

  public createRecipe(data: IRecipe): Observable<IRecipe[]> {
    return this.http
      .post<IRecipe[]>(
        `${this.apiUrl}recipe`,
        data
      )
      .pipe(catchError(this.error.handleError('createRecipe', 'Unable to save recipe', [])));
  }

  public updateRecipe(recipe: Number): Observable<IRecipe[]> {
    return this.http
      .patch<IRecipe[]>(
        `${this.apiUrl}recipe/${recipe}`,
        this.signalService.recipe()
      )
      .pipe(catchError(this.error.handleError('updateRecipe', 'Unable to save recipe', [])));
  }

  public deleteRecipe(recipe: Number): Observable<IRecipe[]> {
    return this.http
      .delete<IRecipe[]>(
        `${this.apiUrl}recipe/${recipe}`,
      )
      .pipe(catchError(this.error.handleError('deleteRecipe', 'Unable to remove recipe', [])));
  }
}

import { effect, inject, Injectable, signal, WritableSignal } from '@angular/core';
import { HttpClient, httpResource } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from 'src/environment/environment';

import { SignalService } from '@server/core/services/signal.service';
import { crudResponse, IRecipe } from '@server/core/interface';
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
  readonly getRecipe: WritableSignal<number | null> = signal(null);

  private recipeRequestResolved = effect(() => {
    if (this.recipeRequest.status() === 'resolved') {
      this.signalService.recipe.set(this.recipeRequest.value() as IRecipe);
    }
  });

  private recipeRequestError = effect(() => {
    if (this.recipeRequest.error()) {
      console.error('Recipe error', this.recipeRequest.error()?.message);
    }
  });

  private recipeRequest = httpResource<IRecipe>(() => {
    return this.getRecipe() ? `${this.apiUrl}recipe/${this.getRecipe()}` : undefined;
  });

  createRecipe(data: IRecipe): Observable<crudResponse> {
    return this.http
      .post<crudResponse>(`${this.apiUrl}recipe`, data)
      .pipe(
        catchError(this.error.handleError<crudResponse>('createRecipe', 'Unable to save recipe', { completed: false })),
      );
  }

  updateRecipe(recipe: number): Observable<crudResponse> {
    return this.http
      .patch<crudResponse>(`${this.apiUrl}recipe/${recipe}`, this.signalService.recipe())
      .pipe(
        catchError(this.error.handleError<crudResponse>('updateRecipe', 'Unable to save recipe', { completed: false })),
      );
  }

  deleteRecipe(recipe: number): Observable<crudResponse> {
    return this.http
      .delete<crudResponse>(`${this.apiUrl}recipe/${recipe}`)
      .pipe(catchError(this.error.handleError<crudResponse>('deleteRecipe', 'Unable to remove recipe', {
        completed: false,
      })));
  }
}

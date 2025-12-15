import { Injectable, WritableSignal, effect, inject, signal } from '@angular/core';
import { httpResource, HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { SignalService } from '@server/core/services/signal.service';
import { IRecipe } from '@server/core/interface/recipe.interface';

@Injectable({
  providedIn: 'root',
})
export class RecipeService {
  private http: HttpClient = inject(HttpClient);
  protected signalService: SignalService = inject(SignalService);
  private apiUrl = 'http://localhost:3000/';

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

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead
      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }

  public createRecipe(data: IRecipe): Observable<IRecipe[]> {
    return this.http
      .post<IRecipe[]>(
        `${this.apiUrl}recipe`,
        data
      )
      .pipe(catchError(this.handleError('createRecipeRequest', [])));
  }

  public updateRecipe(recipe: Number): Observable<IRecipe[]> {
    return this.http
      .patch<IRecipe[]>(
        `${this.apiUrl}recipe/${recipe}`,
        this.signalService.recipe()
      )
      .pipe(catchError(this.handleError('updateRecipeRequest', [])));
  }

  public postImage(data: any): Observable<any> {
    return this.http
      .post<any>(
        `${this.apiUrl}bob`,
        data,
        {
          reportProgress: true,
          observe: 'events'
        }
      )
      .pipe(catchError(this.handleError('createRecipeRequest', [])));
  }

  public deleteRecipe(recipe: Number): Observable<IRecipe[]> {
    return this.http
      .delete<IRecipe[]>(
        `${this.apiUrl}recipe/${recipe}`,
      )
      .pipe(catchError(this.handleError('deleteRecipeRequest', [])));
  }
}

import { Injectable, WritableSignal, effect, inject, signal } from '@angular/core';
import { httpResource, HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { SignalService } from '@server/core/services/signal.service';
import { ITags } from '@server/core/interface';

@Injectable({
  providedIn: 'root',
})
export class TagService {
  private http: HttpClient = inject(HttpClient);
  protected signalService: SignalService = inject(SignalService);
  private apiUrl = 'http://localhost:3000/';

  // Signals only trigger if the new value is different to current value
  // to ensure this signal triggers use getTags.set(Date.now())
  public getTags: WritableSignal<number | null> = signal(null);

  private tagRequestResolved = effect(() => {
    if (this.tagRequest.status() === 'resolved') {
      this.signalService.tags.set(this.tagRequest.value() as Array<ITags>);
    }
  })

  private tagRequestError = effect(() => {
    if (this.tagRequest.error()) {
      console.error('Tags error', this.tagRequest.error()?.message);
    }
  })

  private tagRequest = httpResource<Array<ITags>>(() => {
    return this.getTags() ? `${this.apiUrl}tags` : undefined
  });

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead
      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }

  public createTag(data: ITags): Observable<ITags[]> {
    return this.http
      .post<ITags[]>(
        `${this.apiUrl}tags`,
        data
      )
      .pipe(catchError(this.handleError('createTagRequest', [])));
  }

  public updateTag(tag: Number, data: ITags): Observable<any> {
    return this.http
      .patch<any>(
        `${this.apiUrl}tags/${tag}`,
        data
      )
      .pipe(catchError(this.handleError('updateTagRequest', [])));
  }

  public deleteTag(tag: Number): Observable<any> {
    return this.http
      .delete<any>(`${this.apiUrl}tags/${tag}`)
      .pipe(catchError(this.handleError('deleteTagRequest', [])));
  }

}

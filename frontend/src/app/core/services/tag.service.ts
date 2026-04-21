import { effect, inject, Injectable, signal, WritableSignal } from '@angular/core';
import { HttpClient, httpResource } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from 'src/environment/environment';

import { SignalService } from '@server/core/services/signal.service';
import { crudResponse, ITags } from '@server/core/interface';
import { ErrorHandlerService } from './error-handler.service';

@Injectable({
  providedIn: 'root',
})
export class TagService {
  private http: HttpClient = inject(HttpClient);
  private error: ErrorHandlerService = inject(ErrorHandlerService);
  protected signalService: SignalService = inject(SignalService);
  private apiUrl = environment.baseApiURL;

  // Signals only trigger if the new value is different to current value
  // to ensure this signal triggers use getTags.set(Date.now())
  readonly getTags: WritableSignal<number | null> = signal(null);

  private tagRequestResolved = effect(() => {
    if (this.tagRequest.status() === 'resolved') {
      this.signalService.tags.set(this.tagRequest.value() as ITags[]);
    }
  });

  private tagRequestError = effect(() => {
    if (this.tagRequest.error()) {
      console.error('Tags error', this.tagRequest.error()?.message);
    }
  });

  private tagRequest = httpResource<ITags[]>(() => {
    return this.getTags() ? `${this.apiUrl}tags` : undefined;
  });

  createTag(data: ITags): Observable<crudResponse> {
    return this.http
      .post<crudResponse>(`${this.apiUrl}tags`, data)
      .pipe(catchError(this.error.handleError<crudResponse>('createTag', 'Unable to save tag', { completed: false })));
  }

  updateTag(tag: number, data: ITags): Observable<crudResponse> {
    return this.http
      .patch<crudResponse>(`${this.apiUrl}tags/${tag}`, data)
      .pipe(catchError(this.error.handleError<crudResponse>('updateTag', 'Unable to save tag', { completed: false })));
  }

  deleteTag(tag: number): Observable<crudResponse> {
    return this.http
      .delete<crudResponse>(`${this.apiUrl}tags/${tag}`)
      .pipe(
        catchError(this.error.handleError<crudResponse>('deleteTag', 'Unable to remove tag', { completed: false })),
      );
  }
}

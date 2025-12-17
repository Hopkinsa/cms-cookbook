import { Injectable, inject } from '@angular/core';
import { Observable, of } from 'rxjs';

import { SignalService } from '@server/core/services/signal.service';

@Injectable({
  providedIn: 'root',
})
export class ErrorHandlerService {
  protected signalService: SignalService = inject(SignalService);

  handleError<T>(operation = 'operation', feedback = "", result?: T) {
    return (error: any): Observable<T> => {
      // Give feedback to user
      this.signalService.feedbackMessage.set({ type: 'error', message: feedback });
      console.error(operation, error); // log to console
      // Let the app keep running.
      return of({completed: false} as T);
    };
  }
}

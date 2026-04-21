import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from 'src/environment/environment';

import { crudResponse } from '@server/core/interface';
import { ErrorHandlerService } from './error-handler.service';

@Injectable({
  providedIn: 'root',
})
export class BackupService {
  private http: HttpClient = inject(HttpClient);
  private error: ErrorHandlerService = inject(ErrorHandlerService);
  private apiUrl = environment.baseApiURL;

  backupDB(): Observable<Blob> {
    return this.http
      .get(`${this.apiUrl}backup`, { responseType: 'blob' })
      .pipe(catchError(this.error.handleError('backupDB', 'Unable to create backup', new Blob())));
  }

  uploadFile(data: FormData): Observable<HttpEvent<unknown>> {
    return this.http
      .post<unknown>(`${this.apiUrl}restore`, data, {
        reportProgress: true,
        observe: 'events',
      })
      .pipe(catchError(this.error.handleError<HttpEvent<unknown>>('uploadFile', 'Unable to upload file')));
  }

  restoreDB(): Observable<crudResponse> {
    return this.http
      .post<crudResponse>(`${this.apiUrl}restore`, '')
      .pipe(
        catchError(this.error.handleError<crudResponse>('restoreDB', 'Unable to restore backup', { completed: false })),
      );
  }
}

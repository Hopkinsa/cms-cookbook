import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from 'src/environment/environment';

import { ErrorHandlerService } from './error-handler.service';

@Injectable({
  providedIn: 'root',
})
export class BackupService {
  private http: HttpClient = inject(HttpClient);
  private error: ErrorHandlerService = inject(ErrorHandlerService);
  private apiUrl = environment.baseApiURL;


  backupDB(): Observable<any> {
    return this.http
      .post<any>(`${this.apiUrl}backup`,'')
      .pipe(catchError(this.error.handleError('backupDB', 'Unable to create backup', [])));
  }

  restoreDB(): Observable<any> {
    return this.http
      .post<any>(`${this.apiUrl}restore`,'')
      .pipe(catchError(this.error.handleError('restoreDB', 'Unable to restore backup', [])));
  }
}

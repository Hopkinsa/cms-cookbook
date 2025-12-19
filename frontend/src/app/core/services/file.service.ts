import { effect, inject, Injectable, signal, WritableSignal } from '@angular/core';
import { HttpClient, httpResource } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from 'src/environment/environment';

import { ErrorHandlerService } from './error-handler.service';

@Injectable({
  providedIn: 'root',
})
export class FileService {
  private http: HttpClient = inject(HttpClient);
  private error: ErrorHandlerService = inject(ErrorHandlerService);
  private apiUrl = environment.baseApiURL;

  readonly imageList: WritableSignal<string[] | null> = signal(null);


  // Signals only trigger if the new value is different to current value
  // to ensure this signal triggers use getTags.set(Date.now())
  readonly getImages: WritableSignal<number | null> = signal(null);

  private imageRequestResolved = effect(() => {
    if (this.imagesRequest.status() === 'resolved') {
      this.imageList.set(this.imagesRequest.value() as string[]);
    }
  })

  private imageRequestError = effect(() => {
    if (this.imagesRequest.error()) {
      console.error('File Image error', this.imagesRequest.error()?.message);
    }
  })

  private imagesRequest = httpResource<string[]>(() => {
    return this.getImages() ? `${this.apiUrl}images` : undefined
  });

  uploadImage(data: any): Observable<any> {
    return this.http
      .post<any>(`${this.apiUrl}images/upload`, data, {
        reportProgress: true,
        observe: 'events',
      })
      .pipe(catchError(this.error.handleError('uploadImage', 'Unable to upload file', [])));
  }

  deleteImage(imgName: string): Observable<any> {
    return this.http
      .delete<any>(`${this.apiUrl}images/${imgName}`)
      .pipe(catchError(this.error.handleError('deleteImage', 'Unable to remove file', [])));
  }
}

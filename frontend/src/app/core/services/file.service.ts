import { effect, inject, Injectable, signal, WritableSignal } from '@angular/core';
import { HttpClient, HttpEvent, httpResource } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from 'src/environment/environment';

import { crudResponse } from '@server/core/interface';
import { ErrorHandlerService } from './error-handler.service';

type ImageEditRequest = {
  file: string;
  saveTo: string;
  cropBoxData: unknown;
};

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
  });

  private imageRequestError = effect(() => {
    if (this.imagesRequest.error()) {
      console.error('File Image error', this.imagesRequest.error()?.message);
    }
  });

  private imagesRequest = httpResource<string[]>(() => {
    return this.getImages() ? `${this.apiUrl}images` : undefined;
  });

  uploadImage(data: FormData): Observable<HttpEvent<unknown>> {
    return this.http
      .post<unknown>(`${this.apiUrl}images/upload`, data, {
        reportProgress: true,
        observe: 'events',
      })
      .pipe(catchError(this.error.handleError<HttpEvent<unknown>>('uploadImage', 'Unable to upload file')));
  }

  editImage(data: ImageEditRequest): Observable<HttpEvent<unknown>> {
    return this.http
      .post<unknown>(`${this.apiUrl}images/edit`, data, {
        reportProgress: true,
        observe: 'events',
      })
      .pipe(catchError(this.error.handleError<HttpEvent<unknown>>('editImage', 'Unable to edit file')));
  }

  deleteImage(imgName: string): Observable<crudResponse> {
    return this.http
      .delete<crudResponse>(`${this.apiUrl}images/${imgName}`)
      .pipe(catchError(this.error.handleError<crudResponse>('deleteImage', 'Unable to remove file')));
  }
}

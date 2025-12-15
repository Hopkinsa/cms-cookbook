import { Injectable, WritableSignal, effect, inject, signal } from '@angular/core';
import { httpResource, HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class FileService {
  private http: HttpClient = inject(HttpClient);
  private apiUrl = 'http://localhost:3000/';

  public imageList: WritableSignal<Array<string> | null> = signal(null);


  // Signals only trigger if the new value is different to current value
  // to ensure this signal triggers use getTags.set(Date.now())
  public getImages: WritableSignal<number | null> = signal(null);

  private imageRequestResolved = effect(() => {
    if (this.imagesRequest.status() === 'resolved') {
      this.imageList.set(this.imagesRequest.value() as Array<string>);
    }
  })

  private imageRequestError = effect(() => {
    if (this.imagesRequest.error()) {
      console.error('File Image error', this.imagesRequest.error()?.message);
    }
  })

  private imagesRequest = httpResource<Array<string>>(() => {
    return this.getImages() ? `${this.apiUrl}images` : undefined
  });

  public uploadImage(data: any): Observable<any> {
    return this.http
      .post<any>(`${this.apiUrl}images/upload`, data, {
        reportProgress: true,
        observe: 'events',
      })
      .pipe(catchError(this.handleError('uploadImage', [])));
  }

  public deleteImage(imgName: string): Observable<any> {
    return this.http
      .delete<any>(`${this.apiUrl}images/${imgName}`)
      .pipe(catchError(this.handleError('deleteImageRequest', [])));
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead
      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }
}

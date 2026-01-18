import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { FileService } from './file.service';
import { ErrorHandlerService } from './error-handler.service';

describe('FileService', () => {
  let http: any;
  let error: any;

  beforeEach(() => {
    http = { post: jest.fn(() => of('posted')), delete: jest.fn(() => of('deleted')) };
    error = { handleError: jest.fn(() => (err: any) => of([])) };

    TestBed.configureTestingModule({ providers: [{ provide: HttpClient, useValue: http }, { provide: ErrorHandlerService, useValue: error }] });
  });

  it('uploadImage posts to images/upload', (done) => {
    const svc = TestBed.inject(FileService);
    svc.uploadImage({}).subscribe((res) => {
      expect(http.post).toHaveBeenCalledWith('images/upload', {}, { reportProgress: true, observe: 'events' });
      done();
    });
  });

  it('deleteImage calls delete endpoint', (done) => {
    const svc = TestBed.inject(FileService);
    svc.deleteImage('pic.png').subscribe((res) => {
      expect(http.delete).toHaveBeenCalledWith('images/pic.png');
      done();
    });
  });
});

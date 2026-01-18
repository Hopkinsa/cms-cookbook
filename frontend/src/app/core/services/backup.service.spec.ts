import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { BackupService } from './backup.service';
import { ErrorHandlerService } from './error-handler.service';

describe('BackupService', () => {
  let http: any;
  let error: any;

  beforeEach(() => {
    http = { get: jest.fn(() => of('blob')), post: jest.fn(() => of('posted')) };
    error = { handleError: jest.fn(() => (err: any) => of([])) };

    TestBed.configureTestingModule({ providers: [{ provide: HttpClient, useValue: http }, { provide: ErrorHandlerService, useValue: error }] });
  });

  it('backupDB calls GET /backup', (done) => {
    const svc = TestBed.inject(BackupService);
    svc.backupDB().subscribe(() => {
      expect(http.get).toHaveBeenCalledWith('backup', { responseType: 'blob' });
      done();
    });
  });

  it('uploadFile posts to /restore', (done) => {
    const svc = TestBed.inject(BackupService);
    svc.uploadFile({}).subscribe(() => {
      expect(http.post).toHaveBeenCalledWith('restore', {}, { reportProgress: true, observe: 'events' });
      done();
    });
  });

  it('restoreDB posts to /restore', (done) => {
    const svc = TestBed.inject(BackupService);
    svc.restoreDB().subscribe(() => {
      expect(http.post).toHaveBeenCalledWith('restore', '');
      done();
    });
  });
});

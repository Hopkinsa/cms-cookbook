import { TestBed } from '@angular/core/testing';
import { HttpEventType } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, of } from 'rxjs';

import { BackupComponent } from './backup.component';
import { BackupService, SignalService } from '@server/core/services';

describe('BackupComponent', () => {
  const router = { navigate: jest.fn() };

  afterEach(() => {
    jest.restoreAllMocks();
    router.navigate.mockClear();
  });

  it('pad and downloadName', () => {
    TestBed.configureTestingModule({
      imports: [BackupComponent],
      providers: [
        { provide: SignalService, useValue: { canEdit: jest.fn() } },
        { provide: BackupService, useValue: {} },
        { provide: Router, useValue: router },
      ],
    });
    const fixture = TestBed.createComponent(BackupComponent);
    const comp = fixture.componentInstance as any;

    expect(comp.pad(5)).toBe('05');
    const dn = comp.downloadName();
    expect(dn.startsWith('backup-')).toBe(true);
  });

  it('backup triggers download and feedback', () => {
    const blob = new Blob(['x']);
    const mockSignal: any = { canEdit: jest.fn(), feedbackMessage: { set: jest.fn() } };
    const mockBackup: any = { backupDB: jest.fn(() => of(blob)) };
    const click = jest.fn();
    const anchor = { click };
    const originalCreateElement = document.createElement.bind(document);
    const createElementSpy = jest.spyOn(document, 'createElement').mockImplementation((tagName: string) => {
      if (tagName === 'a') {
        return anchor as any;
      }

      return originalCreateElement(tagName);
    });

    // stub global URL helpers and restore afterwards
    const originalURL = (global as any).URL;
    if (!originalURL || typeof originalURL !== 'function') {
      (global as any).URL = class {
        constructor(href?: string) {
          /* no-op */
        }
        static createObjectURL = jest.fn(() => 'blob:xxx');
        static revokeObjectURL = jest.fn();
      } as any;
    } else {
      (global as any).URL = Object.assign(originalURL, {
        createObjectURL: jest.fn(() => 'blob:xxx'),
        revokeObjectURL: jest.fn(),
      });
    }

    TestBed.configureTestingModule({
      imports: [BackupComponent],
      providers: [
        { provide: SignalService, useValue: mockSignal },
        { provide: BackupService, useValue: mockBackup },
        { provide: Router, useValue: router },
      ],
    });
    const fixture = TestBed.createComponent(BackupComponent);
    const comp = fixture.componentInstance as any;

    comp.backup();

    expect(mockSignal.feedbackMessage.set).toHaveBeenCalledWith({ type: 'success', message: 'Database backed up' });
    expect(createElementSpy).toHaveBeenCalledWith('a');
    expect(click).toHaveBeenCalled();
    expect((global as any).URL.createObjectURL).toHaveBeenCalledWith(blob);
    expect((global as any).URL.revokeObjectURL).toHaveBeenCalledWith('blob:xxx');
    expect(comp.enableBtn()).toBe(true);

    // restore global URL
    (global as any).URL = originalURL;
    createElementSpy.mockRestore();
  });

  it('restore calls feedback when completed', () => {
    const mockSignal: any = { canEdit: jest.fn(), feedbackMessage: { set: jest.fn() } };
    const mockBackup: any = { restoreDB: jest.fn(() => of({ completed: true })) };

    TestBed.configureTestingModule({
      imports: [BackupComponent],
      providers: [
        { provide: SignalService, useValue: mockSignal },
        { provide: BackupService, useValue: mockBackup },
        { provide: Router, useValue: router },
      ],
    });
    const fixture = TestBed.createComponent(BackupComponent);
    const comp = fixture.componentInstance as any;

    comp.restore();
    expect(mockSignal.feedbackMessage.set).toHaveBeenCalledWith({ type: 'success', message: 'Database restored' });
  });

  it('does not upload when no file is selected', () => {
    const mockSignal: any = { canEdit: jest.fn(), feedbackMessage: { set: jest.fn() } };
    const mockBackup: any = { uploadFile: jest.fn() };

    TestBed.configureTestingModule({
      imports: [BackupComponent],
      providers: [
        { provide: SignalService, useValue: mockSignal },
        { provide: BackupService, useValue: mockBackup },
        { provide: Router, useValue: router },
      ],
    });
    const fixture = TestBed.createComponent(BackupComponent);
    const comp = fixture.componentInstance as any;

    comp.onFileSelected({ target: { files: [] } } as unknown as Event);

    expect(mockBackup.uploadFile).not.toHaveBeenCalled();
    expect(comp.isUploading).toBe(false);
  });

  it('updates upload progress and success feedback during restore upload', () => {
    const mockSignal: any = { canEdit: jest.fn(), feedbackMessage: { set: jest.fn() } };
    const mockBackup: any = {
      uploadFile: jest.fn(
        () =>
          new Observable((subscriber) => {
            subscriber.next({ type: HttpEventType.UploadProgress, loaded: 50, total: 100 });
            subscriber.next({ type: HttpEventType.Response });
            subscriber.complete();
          }),
      ),
    };

    TestBed.configureTestingModule({
      imports: [BackupComponent],
      providers: [
        { provide: SignalService, useValue: mockSignal },
        { provide: BackupService, useValue: mockBackup },
        { provide: Router, useValue: router },
      ],
    });
    const fixture = TestBed.createComponent(BackupComponent);
    const comp = fixture.componentInstance as any;
    const file = new File(['backup'], 'backup.zip', { type: 'application/zip' });

    comp.onFileSelected({ target: { files: [file] } } as unknown as Event);

    expect(mockBackup.uploadFile).toHaveBeenCalled();
    expect(comp.uploadProgress).toBe(100);
    expect(comp.isUploading).toBe(false);
    expect(mockSignal.feedbackMessage.set).toHaveBeenCalledWith({ type: 'success', message: 'File uploaded' });
  });

  it('shows error feedback when restore upload fails and back navigates home', () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    const mockSignal: any = { canEdit: jest.fn(), feedbackMessage: { set: jest.fn() } };
    const mockBackup: any = {
      uploadFile: jest.fn(
        () =>
          new Observable((subscriber) => {
            subscriber.error(new Error('upload failed'));
          }),
      ),
      restoreDB: jest.fn(() => of({ completed: false })),
    };

    TestBed.configureTestingModule({
      imports: [BackupComponent],
      providers: [
        { provide: SignalService, useValue: mockSignal },
        { provide: BackupService, useValue: mockBackup },
        { provide: Router, useValue: router },
      ],
    });
    const fixture = TestBed.createComponent(BackupComponent);
    const comp = fixture.componentInstance as any;
    const file = new File(['backup'], 'backup.zip', { type: 'application/zip' });

    comp.onFileSelected({ target: { files: [file] } } as unknown as Event);
    expect(mockSignal.feedbackMessage.set).toHaveBeenCalledWith({ type: 'error', message: 'File upload failed' });
    expect(comp.isUploading).toBe(false);

    comp.restore();
    expect(mockSignal.feedbackMessage.set).not.toHaveBeenCalledWith({ type: 'success', message: 'Database restored' });

    comp.back();
    expect(router.navigate).toHaveBeenCalledWith(['/']);
    consoleSpy.mockRestore();
  });
});

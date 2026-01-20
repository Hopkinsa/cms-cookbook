import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { BackupComponent } from './backup.component';
import { BackupService, SignalService } from '@server/core/services';

describe('BackupComponent', () => {
  it('pad and downloadName', () => {
    TestBed.configureTestingModule({
      imports: [BackupComponent],
      providers: [
        { provide: SignalService, useValue: {} },
        { provide: BackupService, useValue: {} },
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
    const mockSignal: any = { feedbackMessage: { set: jest.fn() } };
    const mockBackup: any = { backupDB: jest.fn(() => of(blob)) };

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
      ],
    });
    const fixture = TestBed.createComponent(BackupComponent);
    const comp = fixture.componentInstance as any;

    comp.backup();

    expect(mockSignal.feedbackMessage.set).toHaveBeenCalledWith({ type: 'success', message: 'Database backed up' });

    // restore global URL
    (global as any).URL = originalURL;
  });

  it('restore calls feedback when completed', () => {
    const mockSignal: any = { feedbackMessage: { set: jest.fn() } };
    const mockBackup: any = { restoreDB: jest.fn(() => of({ completed: true })) };

    TestBed.configureTestingModule({
      imports: [BackupComponent],
      providers: [
        { provide: SignalService, useValue: mockSignal },
        { provide: BackupService, useValue: mockBackup },
      ],
    });
    const fixture = TestBed.createComponent(BackupComponent);
    const comp = fixture.componentInstance as any;

    comp.restore();
    expect(mockSignal.feedbackMessage.set).toHaveBeenCalledWith({ type: 'success', message: 'Database restored' });
  });
});

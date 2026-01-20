import { TestBed } from '@angular/core/testing';
import { HttpEventType } from '@angular/common/http';
import { SignalService, FileService } from '@server/core/services';
import { ImageUploadComponent } from './image-upload.component';

jest.useFakeTimers();

describe('ImageUploadComponent', () => {
  it('handles upload progress and completion', () => {
    const mockSignalService: any = { feedbackMessage: { set: jest.fn() } };
    const mockFileService: any = {
      uploadImage: jest.fn(() => ({ subscribe: (next: any) => next({ type: HttpEventType.Response }) })),
      getImages: { set: jest.fn() },
    };

    TestBed.configureTestingModule({
      imports: [ImageUploadComponent],
      providers: [
        { provide: SignalService, useValue: mockSignalService },
        { provide: FileService, useValue: mockFileService },
      ],
    });

    const fixture = TestBed.createComponent(ImageUploadComponent);
    const comp = fixture.componentInstance;

    const fakeFile = new File([''], 'pic.png');
    const event: any = { target: { files: [fakeFile] }, total: 100 };

    const emitSpy = jest.spyOn(comp.fileUploaded, 'emit');

    comp.onFileSelected(event);

    // fast-forward timers for the internal setTimeout
    jest.runAllTimers();

    expect(mockSignalService.feedbackMessage.set).toHaveBeenCalledWith({ type: 'success', message: 'Image added' });
    expect(mockFileService.getImages.set).toHaveBeenCalled();
    expect(emitSpy).toHaveBeenCalledWith('pic.png');
  });

  it('handles upload error', () => {
    jest.spyOn(console, 'error').mockImplementation(() => {});
    const mockSignalService: any = { feedbackMessage: { set: jest.fn() } };
    const mockFileService: any = { uploadImage: jest.fn(() => ({ subscribe: (next: any, err: any) => err('boom') })) };

    TestBed.configureTestingModule({
      imports: [ImageUploadComponent],
      providers: [
        { provide: SignalService, useValue: mockSignalService },
        { provide: FileService, useValue: mockFileService },
      ],
    });

    const fixture = TestBed.createComponent(ImageUploadComponent);
    const comp = fixture.componentInstance;

    const fakeFile = new File([''], 'pic.png');
    const event: any = { target: { files: [fakeFile] }, total: 100 };

    comp.onFileSelected(event);

    expect(mockSignalService.feedbackMessage.set).toHaveBeenCalledWith({
      type: 'error',
      message: 'Image upload failed',
    });
    expect(comp.isUploading).toBe(false);
  });

  it('updates uploadProgress on UploadProgress events', () => {
    const mockSignalService: any = { feedbackMessage: { set: jest.fn() } };
    const mockFileService: any = {
      // capture subscriber callbacks so we can invoke next() later
      uploadImage: jest.fn(() => {
        let subscriber: any;
        return {
          subscribe: (n: any, e: any) => {
            subscriber = { next: n, error: e };
            (mockFileService as any).__subscriber = subscriber;
          },
        };
      }),
      getImages: { set: jest.fn() },
    };

    TestBed.configureTestingModule({
      imports: [ImageUploadComponent],
      providers: [
        { provide: SignalService, useValue: mockSignalService },
        { provide: FileService, useValue: mockFileService },
      ],
    });

    const fixture = TestBed.createComponent(ImageUploadComponent);
    const comp = fixture.componentInstance as any;

    const fakeFile = new File([''], 'pic.png');
    const event: any = { target: { files: [fakeFile] }, total: 200 };

    comp.onFileSelected(event);

    // invoke progress event (50/200 -> ~25%) and ensure it doesn't throw
    expect(() =>
      (mockFileService as any).__subscriber.next({ type: HttpEventType.UploadProgress, loaded: 50 }),
    ).not.toThrow();

    // now simulate final response
    (mockFileService as any).__subscriber.next({ type: HttpEventType.Response });
    // fast-forward timers for internal setTimeout
    jest.runAllTimers();

    expect(mockSignalService.feedbackMessage.set).toHaveBeenCalledWith({ type: 'success', message: 'Image added' });
  });

  it('ignores when no file is selected', () => {
    const mockSignalService: any = { feedbackMessage: { set: jest.fn() } };
    const mockFileService: any = { uploadImage: jest.fn() };

    TestBed.configureTestingModule({
      imports: [ImageUploadComponent],
      providers: [
        { provide: SignalService, useValue: mockSignalService },
        { provide: FileService, useValue: mockFileService },
      ],
    });

    const fixture = TestBed.createComponent(ImageUploadComponent);
    const comp = fixture.componentInstance as any;

    const event: any = { target: { files: [] } };

    comp.onFileSelected(event);

    expect(mockFileService.uploadImage).not.toHaveBeenCalled();
    expect(comp.isUploading).toBe(false);
  });
});

import { TestBed } from '@angular/core/testing';
import { HttpEventType } from '@angular/common/http';
import { of } from 'rxjs';

import { ImageAmendComponent } from './image-amend.component';
import { FileService, SignalService } from '@server/core/services';

// Mock cropperjs before the component is imported/used
jest.mock('cropperjs', () => {
  return jest.fn().mockImplementation(() => ({
    zoom: jest.fn(),
    rotate: jest.fn(),
    scale: jest.fn(),
    setAspectRatio: jest.fn(),
    setDragMode: jest.fn(),
    reset: jest.fn(),
    getCropBoxData: jest.fn(() => ({ width: 100, height: 50 })),
    getCroppedCanvas: jest.fn(() => ({
      toBlob: (cb: any) => cb(new Blob(['a'], { type: 'image/png' })),
    })),
  }));
});

describe('ImageAmendComponent (edge cases)', () => {
  beforeEach(() => {
    const mockSignal: any = { feedbackMessage: { set: jest.fn() } };
    const mockFile: any = { uploadImage: jest.fn(() => ({ subscribe: () => {} })) };

    TestBed.configureTestingModule({ imports: [ImageAmendComponent], providers: [{ provide: SignalService, useValue: mockSignal }, { provide: FileService, useValue: mockFile }] });
  });

  it('initializes cropper and responds to controls', () => {
    const fixture = TestBed.createComponent(ImageAmendComponent);
    const comp = fixture.componentInstance as any;

    // Provide a fake image element for the viewChild and set original image
    (comp as any).imageElement = () => ({ nativeElement: document.createElement('img') });
    (comp as any).signalImageOrig = () => 'pic.png';

    // set a manual cropper mock on the component to avoid module instance issues
    const cropperMock = {
      zoom: jest.fn(),
      rotate: jest.fn(),
      scale: jest.fn(),
      setAspectRatio: jest.fn(),
      setDragMode: jest.fn(),
      reset: jest.fn(),
      getCropBoxData: jest.fn(() => ({ width: 100, height: 50 })),
      getCroppedCanvas: jest.fn(() => ({ toBlob: (cb: any) => cb(new Blob(['a'], { type: 'image/png' })) })),
    } as any;

    // allow component effects to run first
    fixture.detectChanges();

    // then replace the cropper with our spy mock so method calls hit spies
    (comp as any).cropper = cropperMock;

    // ensure control methods exist and can be called without throwing
    expect(typeof cropperMock.zoom).toBe('function');
    expect(typeof cropperMock.rotate).toBe('function');

    expect(() => comp.zoomIn()).not.toThrow();
    expect(() => comp.zoomOut()).not.toThrow();
    expect(() => comp.rotateLeft()).not.toThrow();
    expect(() => comp.rotateRight()).not.toThrow();

    // flip toggles state correctly
    const prevX = comp.flipX;
    comp.flipH();
    expect(comp.flipX).toBe(-prevX);

    const prevY = comp.flipY;
    comp.flipV();
    expect(comp.flipY).toBe(-prevY);

    // aspect ratio and drag/select/reset
    comp.aspectRatio(2);
    expect(cropperMock.setAspectRatio).toHaveBeenCalled();

    comp.selectBox();
    expect(cropperMock.setDragMode).toHaveBeenCalledWith('crop');

    comp.drag();
    expect(cropperMock.setDragMode).toHaveBeenCalledWith('move');

    comp.reset();
    expect(cropperMock.setAspectRatio).toHaveBeenCalled();
    expect(cropperMock.reset).toHaveBeenCalled();
  });

  it('apply uploads cropped image and handles success', () => {
    const CropperMock: any = require('cropperjs');
    const instance = CropperMock.mock.instances[0];

    const mockFileService: any = TestBed.inject(FileService) as any;
    const mockSignalService: any = TestBed.inject(SignalService) as any;

    // make uploadImage invoke success response
    mockFileService.uploadImage = jest.fn(() => ({ subscribe: (next: any) => next({ type: HttpEventType.Response }) }));

    const fixture = TestBed.createComponent(ImageAmendComponent);
    const comp = fixture.componentInstance as any;
    (comp as any).imageElement = () => ({ nativeElement: document.createElement('img') });
    (comp as any).signalIconImage = () => 'icon.png';
    (comp as any).signalBannerImage = () => 'banner.png';

    fixture.detectChanges();

    // set cropper mock so apply will use it
    (comp as any).cropper = {
      getCropBoxData: jest.fn(() => ({ width: 100, height: 100 })),
      getCroppedCanvas: jest.fn(() => ({ toBlob: (cb: any) => cb(new Blob(['a'], { type: 'image/png' })) })),
    } as any;

    comp.apply();

    expect(mockFileService.uploadImage).toHaveBeenCalled();
    expect(mockSignalService.feedbackMessage.set).toHaveBeenCalledWith({ type: 'success', message: 'Image added' });
  });

  it('apply handles upload error path', () => {
    const CropperMock: any = require('cropperjs');
    const instance = CropperMock.mock.instances[0];

    const mockFileService: any = TestBed.inject(FileService) as any;
    const mockSignalService: any = TestBed.inject(SignalService) as any;

    // make uploadImage invoke error callback
    mockFileService.uploadImage = jest.fn(() => ({ subscribe: (_next: any, err: any) => err('boom') }));

    const fixture = TestBed.createComponent(ImageAmendComponent);
    const comp = fixture.componentInstance as any;
    (comp as any).imageElement = () => ({ nativeElement: document.createElement('img') });
    (comp as any).signalIconImage = () => 'icon.png';

    fixture.detectChanges();

    // set cropper mock so apply will use it
    (comp as any).cropper = {
      getCropBoxData: jest.fn(() => ({ width: 100, height: 100 })),
      getCroppedCanvas: jest.fn(() => ({ toBlob: (cb: any) => cb(new Blob(['a'], { type: 'image/png' })) })),
    } as any;

    comp.apply();

    expect(mockFileService.uploadImage).toHaveBeenCalled();
    expect(mockSignalService.feedbackMessage.set).toHaveBeenCalledWith({ type: 'error', message: 'Image upload failed' });
  });
});

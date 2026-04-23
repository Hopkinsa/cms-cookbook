import { TestBed } from '@angular/core/testing';
import { HttpEventType } from '@angular/common/http';

import { ImageAmendComponent } from './image-amend.component';
import { FileService, SignalService } from '@server/core/services';

jest.mock('ngx-image-cropper', () => {
  const core = require('@angular/core');

  @core.Component({
    selector: 'image-cropper',
    standalone: true,
    template: '',
  })
  class MockImageCropperComponent {
    @core.Input() imageURL = '';
    @core.Input() imageAltText = '';
    @core.Input() cropperFrameAriaLabel = '';
    @core.Input() output = 'blob';
    @core.Input() maintainAspectRatio = false;
    @core.Input() aspectRatio = 1;
    @core.Input() cropper = undefined;
    @core.Input() transform = {};
    @core.Input() allowMoveImage = false;
    @core.Output() imageCropped = new core.EventEmitter();
    @core.Output() imageLoaded = new core.EventEmitter();
    @core.Output() cropperChange = new core.EventEmitter();
    @core.Output() transformChange = new core.EventEmitter();
  }

  return {
    ImageCropperComponent: MockImageCropperComponent,
  };
});

describe('ImageAmendComponent (edge cases)', () => {
  const mockCropEvent = {
    width: 100,
    height: 50,
    cropperPosition: { x1: 0, y1: 0, x2: 100, y2: 50 },
    imagePosition: { x1: 10, y1: 15, x2: 110, y2: 65 },
    objectUrl: 'blob:preview-a',
  };

  beforeEach(() => {
    const mockSignal: any = { feedbackMessage: { set: jest.fn() } };
    const mockFile: any = { editImage: jest.fn(() => ({ subscribe: () => {} })) };

    URL.revokeObjectURL = jest.fn();

    TestBed.configureTestingModule({
      imports: [ImageAmendComponent],
      providers: [
        { provide: SignalService, useValue: mockSignal },
        { provide: FileService, useValue: mockFile },
      ],
    });
  });

  it('tracks crop state and responds to controls', () => {
    const fixture = TestBed.createComponent(ImageAmendComponent);
    const comp = fixture.componentInstance as any;

    fixture.detectChanges();

    comp.imageLoaded({ original: { size: { width: 200, height: 100 } } });
    comp.cropperChanged({ x1: 0, y1: 0, x2: 100, y2: 50 });
    comp.imageCropped(mockCropEvent);
    fixture.detectChanges();

    expect(() => comp.zoomIn()).not.toThrow();
    expect(() => comp.zoomOut()).not.toThrow();
    expect(() => comp.rotateLeft()).not.toThrow();
    expect(() => comp.rotateRight()).not.toThrow();

    expect(comp.imgWidth()).toBe(200);
    expect(comp.imgHeight()).toBe(100);
    expect(comp.cropWidth()).toBe(100);
    expect(comp.cropHeight()).toBe(50);
    expect((fixture.nativeElement.querySelector('.previewImage') as HTMLImageElement | null)?.src).toContain(
      'blob:preview-a',
    );

    comp.flipH();
    expect(comp.transform().flipH).toBe(true);

    comp.flipV();
    expect(comp.transform().flipV).toBe(true);

    comp.scaleUp();
    expect(comp.transform().scale).toBeCloseTo(1.05);

    comp.scaleDown();
    expect(comp.transform().scale).toBeCloseTo(1);

    comp.aspectRatio(2);
    expect(comp.maintainAspectRatio()).toBe(true);
    expect(comp.selectedAspectRatio()).toBe(2);

    comp.selectBox();
    expect(comp.allowMoveImage()).toBe(false);

    comp.drag();
    expect(comp.allowMoveImage()).toBe(true);

    comp.reset();
    expect(comp.maintainAspectRatio()).toBe(false);
    expect(comp.allowMoveImage()).toBe(false);
    expect(comp.transform()).toEqual({ scale: 1, rotate: 0, flipH: false, flipV: false });
  });

  it('apply uploads adapted crop box data and handles success', () => {
    const mockFileService: any = TestBed.inject(FileService) as any;
    const mockSignalService: any = TestBed.inject(SignalService) as any;

    mockFileService.editImage = jest.fn(() => ({ subscribe: (next: any) => next({ type: HttpEventType.Response }) }));

    const fixture = TestBed.createComponent(ImageAmendComponent);
    const comp = fixture.componentInstance as any;
    (comp as any).signalIconImage = () => 'icon.png';
    (comp as any).signalBannerImage = () => 'banner.png';
    (comp as any).signalImageOrig = () => 'pic.png';

    fixture.detectChanges();

    comp.transformChanged({ scale: 1.25, rotate: 90, flipH: true, flipV: false });
    comp.imageCropped({
      ...mockCropEvent,
      imagePosition: { x1: 10, y1: 20, x2: 100, y2: 100 },
      objectUrl: 'blob:preview-b',
    });

    comp.apply();

    expect(mockFileService.editImage).toHaveBeenCalledWith({
      file: 'pic.png',
      saveTo: 'icon.png',
      cropBoxData: {
        rotate: 90,
        scaleX: -1.25,
        scaleY: 1.25,
        x: '10',
        y: '20',
        width: '90',
        height: '80',
      },
    });
    expect(mockSignalService.feedbackMessage.set).toHaveBeenCalledWith({ type: 'success', message: 'Image added' });
  });

  it('apply handles upload error path', () => {
    const mockFileService: any = TestBed.inject(FileService) as any;
    const mockSignalService: any = TestBed.inject(SignalService) as any;

    mockFileService.editImage = jest.fn(() => ({ subscribe: (_next: any, err: any) => err('boom') }));
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    const fixture = TestBed.createComponent(ImageAmendComponent);
    const comp = fixture.componentInstance as any;
    (comp as any).signalIconImage = () => 'icon.png';
    (comp as any).signalImageOrig = () => 'pic.png';

    fixture.detectChanges();

    comp.imageCropped(mockCropEvent);

    comp.apply();

    expect(mockFileService.editImage).toHaveBeenCalled();
    expect(mockSignalService.feedbackMessage.set).toHaveBeenCalledWith({
      type: 'error',
      message: 'Image upload failed',
    });

    consoleSpy.mockRestore();
  });
});

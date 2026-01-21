import { TestBed } from '@angular/core/testing';
import { FileService } from '@server/core/services/file.service';
import { ImageSelectComponent } from './image-select.component';

describe('ImageSelectComponent', () => {
  it('requests images when imageList is null', () => {
    const mockFileService: any = { imageList: jest.fn(() => null), getImages: { set: jest.fn() } };

    TestBed.configureTestingModule({
      imports: [ImageSelectComponent],
      providers: [{ provide: FileService, useValue: mockFileService }],
    });

    const fixture = TestBed.createComponent(ImageSelectComponent);
    fixture.detectChanges();

    expect(mockFileService.getImages.set).toHaveBeenCalled();
  });

  it('does not request images when imageList present', () => {
    const mockFileService: any = { imageList: jest.fn(() => ['a.png']), getImages: { set: jest.fn() } };

    TestBed.configureTestingModule({
      imports: [ImageSelectComponent],
      providers: [{ provide: FileService, useValue: mockFileService }],
    });

    const fixture = TestBed.createComponent(ImageSelectComponent);
    fixture.detectChanges();

    expect(mockFileService.getImages.set).not.toHaveBeenCalled();
  });
});

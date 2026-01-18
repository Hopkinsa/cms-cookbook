import { TestBed } from '@angular/core/testing';
import { DisplayImagesComponent } from './display-images.component';
import { FileService, SignalService } from '@server/core/services';
import { Router } from '@angular/router';
import { of } from 'rxjs';

describe('DisplayImagesComponent', () => {
  it('amend, delete and back', () => {
    const mockFile: any = { deleteImage: jest.fn(() => of({ completed: true })), getImages: { set: jest.fn() } };
    const mockSignal: any = { feedbackMessage: { set: jest.fn() } };
    const mockRouter: any = { navigate: jest.fn() };

    TestBed.configureTestingModule({ imports: [DisplayImagesComponent], providers: [{ provide: FileService, useValue: mockFile }, { provide: SignalService, useValue: mockSignal }, { provide: Router, useValue: mockRouter }] });

    const fixture = TestBed.createComponent(DisplayImagesComponent);
    const comp = fixture.componentInstance as any;

    comp.amend('imageA');
    expect(mockRouter.navigate).toHaveBeenCalled();

    comp.delete('imageA');
    expect(mockFile.deleteImage).toHaveBeenCalled();
    expect(mockFile.getImages.set).toHaveBeenCalled();

    comp.back();
    expect(mockRouter.navigate).toHaveBeenCalled();
  });
});
import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';
import { AmendImageComponent } from './amend-image.component';
import { SignalService, FileService } from '@server/core/services';

describe('AmendImageComponent', () => {
  it('reads route params and sets signals, and back() navigates', () => {
    const mockSignal: any = {};
    const mockFile: any = {};
    const mockRouter: any = { navigate: jest.fn() };
    const mockRoute: any = { params: of({ name: 'file.name.png' }) };

    TestBed.configureTestingModule({ imports: [AmendImageComponent], providers: [{ provide: SignalService, useValue: mockSignal }, { provide: FileService, useValue: mockFile }, { provide: Router, useValue: mockRouter }, { provide: ActivatedRoute, useValue: mockRoute }] });

    const fixture = TestBed.createComponent(AmendImageComponent);
    const comp = fixture.componentInstance as any;

    // After construction the route param should be processed by constructor
    expect(comp.imgName()).toBe('file.name.png');
    // generateFilename sets icon and banner - expect the signals to be filled
    expect(comp.imgNameIcon()).toBeDefined();
    expect(comp.imgNameBanner()).toBeDefined();

    comp.back();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['images']);
  });
});
